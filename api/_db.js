import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".backend");
const DATA_FILE = process.env.DATA_FILE || path.join(DATA_DIR, "db.json");

let mongoClient = null;
let dbInstance = null;
let connectPromise = null;
let lastFailedTime = 0;
const FAIL_COOLDOWN_MS = 30000; // 30 seconds cooldown after a failure

// Lazily connect and cache MongoDB database instance
async function getMongoDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb+srv://tiwarimanav118_db_user:Manav123@cluster0.oqebpy9.mongodb.net/portfolio?appName=Cluster0";
  if (!uri) {
    return null; // Gracefully fall back to local db.json
  }
  if (dbInstance) {
    return dbInstance;
  }
  if (connectPromise) {
    return connectPromise;
  }

  const now = Date.now();
  if (now - lastFailedTime < FAIL_COOLDOWN_MS) {
    return null;
  }

  connectPromise = (async () => {
    try {
      mongoClient = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });
      await mongoClient.connect();
      let dbName = null;
      try {
        const match = uri.match(/mongodb(?:\+srv)?:\/\/[^\/]+\/([^?#\/]+)/);
        if (match && match[1]) {
          dbName = match[1];
        }
      } catch (e) {}
      dbInstance = mongoClient.db(dbName || "portfolio");
      console.log("Connected successfully to MongoDB Atlas.");
      return dbInstance;
    } catch (error) {
      lastFailedTime = Date.now();
      console.error("MongoDB Connection Failed, using local file DB fallback:", error);
      dbInstance = null;
      return null;
    } finally {
      connectPromise = null;
    }
  })();

  return connectPromise;
}

let writeQueue = Promise.resolve();

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ storage: {} }, null, 2));
  }
}

async function readDatabase() {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return { storage: {} };
    if (!data.storage || typeof data.storage !== "object") data.storage = {};
    return data;
  } catch (error) {
    if (error.code === "ENOENT") return { storage: {} };
    throw error;
  }
}

async function writeDatabase(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmpFile = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(data, null, 2));
  await fs.rename(tmpFile, DATA_FILE);
}

export function isAdminRequest(req) {
  const expectedPassword = process.env.ADMIN_PASSWORD || "Manav@1234";
  const expectedUsername = process.env.ADMIN_USERNAME || "imanavv_25";
  const providedPassword =
    req.headers["x-admin-password"] ||
    req.body?.password ||
    req.query?.password;
  const providedUsername =
    req.headers["x-admin-username"] ||
    req.body?.username ||
    req.query?.username;
  return Boolean(
    expectedPassword && providedPassword === expectedPassword &&
    expectedUsername && providedUsername && providedUsername.toLowerCase() === expectedUsername.toLowerCase()
  );
}

const ARRAY_KEYS = new Set([
  "portfolio_skills",
  "portfolio_workexperience",
  "portfolio_qualifications",
  "portfolio_certifications",
  "portfolio_projects",
]);

const migrationPromises = {};

export async function getValue(key) {
  const db = await getMongoDB();
  if (db) {
    try {
      if (key === "contact_messages") {
        const collection = db.collection("contact_messages");
        
        if (migrationPromises[key]) {
          await migrationPromises[key];
        }
        
        let docs = await collection.find({}).sort({ date: -1 }).toArray();
        
        // Auto-migration: if the dedicated collection is empty, check the old storage key
        if (docs.length === 0 && !migrationPromises[key]) {
          migrationPromises[key] = (async () => {
            try {
              const storageColl = db.collection("storage");
              const oldDoc = await storageColl.findOne({ _id: "contact_messages" });
              if (oldDoc && typeof oldDoc.value === "string") {
                const parsed = JSON.parse(oldDoc.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  const docsToInsert = parsed.map(msg => {
                    const cleanMsg = { ...msg };
                    delete cleanMsg._id;
                    return cleanMsg;
                  });
                  await collection.insertMany(docsToInsert);
                  await storageColl.deleteOne({ _id: "contact_messages" });
                }
              }
            } catch (err) {
              console.error("Failed to migrate old contact messages:", err);
            } finally {
              delete migrationPromises[key];
            }
          })();
          await migrationPromises[key];
          docs = await collection.find({}).sort({ date: -1 }).toArray();
        } else if (migrationPromises[key]) {
          await migrationPromises[key];
          docs = await collection.find({}).sort({ date: -1 }).toArray();
        }
        
        const cleanDocs = docs.map(doc => {
          const cleanDoc = { ...doc };
          delete cleanDoc._id;
          return cleanDoc;
        });
        return JSON.stringify(cleanDocs);
      }

      if (ARRAY_KEYS.has(key)) {
        const collection = db.collection(key);
        
        if (migrationPromises[key]) {
          await migrationPromises[key];
        }
        
        let docs = await collection.find({}).sort({ orderIndex: 1 }).toArray();
        
        // Auto-migration
        if (docs.length === 0 && !migrationPromises[key]) {
          migrationPromises[key] = (async () => {
            try {
              const storageColl = db.collection("storage");
              const oldDoc = await storageColl.findOne({ _id: key });
              if (oldDoc && typeof oldDoc.value === "string") {
                const parsed = JSON.parse(oldDoc.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  const docsToInsert = parsed.map((item, idx) => {
                    const cleanItem = { ...item, orderIndex: idx };
                    delete cleanItem._id;
                    return cleanItem;
                  });
                  await collection.insertMany(docsToInsert);
                  await storageColl.deleteOne({ _id: key });
                }
              }
            } catch (err) {
              console.error(`Failed to migrate ${key}:`, err);
            } finally {
              delete migrationPromises[key];
            }
          })();
          await migrationPromises[key];
          docs = await collection.find({}).sort({ orderIndex: 1 }).toArray();
        } else if (migrationPromises[key]) {
          await migrationPromises[key];
          docs = await collection.find({}).sort({ orderIndex: 1 }).toArray();
        }
        
        const cleanDocs = docs.map(doc => {
          const cleanDoc = { ...doc };
          delete cleanDoc._id;
          delete cleanDoc.orderIndex;
          return cleanDoc;
        });
        return JSON.stringify(cleanDocs);
      }

      if (key === "portfolio_chatbot") {
        const collection = db.collection("portfolio_chatbot");
        
        if (migrationPromises[key]) {
          await migrationPromises[key];
        }
        
        let doc = await collection.findOne({});
        
        // Auto-migration
        if (!doc && !migrationPromises[key]) {
          migrationPromises[key] = (async () => {
            try {
              const storageColl = db.collection("storage");
              const oldDoc = await storageColl.findOne({ _id: "portfolio_chatbot" });
              if (oldDoc && typeof oldDoc.value === "string") {
                const parsed = JSON.parse(oldDoc.value);
                if (parsed && typeof parsed === "object") {
                  await collection.insertOne(parsed);
                  await storageColl.deleteOne({ _id: "portfolio_chatbot" });
                }
              }
            } catch (err) {
              console.error("Failed to migrate chatbot answers:", err);
            } finally {
              delete migrationPromises[key];
            }
          })();
          await migrationPromises[key];
          doc = await collection.findOne({});
        } else if (migrationPromises[key]) {
          await migrationPromises[key];
          doc = await collection.findOne({});
        }

        if (doc) {
          const cleanDoc = { ...doc };
          delete cleanDoc._id;
          return JSON.stringify(cleanDoc);
        }
      }
      
      const collection = db.collection("storage");
      const doc = await collection.findOne({ _id: key });
      return doc && typeof doc.value === "string" ? doc.value : null;
    } catch (err) {
      console.error("Error reading from MongoDB, falling back to file read:", err);
    }
  }

  // Fallback to local file
  const data = await readDatabase();
  const row = data.storage[key];
  return typeof row?.value === "string" ? row.value : null;
}

export async function setValue(key, value) {
  const db = await getMongoDB();
  if (db) {
    try {
      if (key === "contact_messages") {
        const collection = db.collection("contact_messages");
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            await collection.deleteMany({});
            if (parsed.length > 0) {
              const docsToInsert = parsed.map(msg => {
                const cleanMsg = { ...msg };
                delete cleanMsg._id; // prevent duplicate key errors
                return cleanMsg;
              });
              await collection.insertMany(docsToInsert);
            }
            return;
          }
        } catch (parseErr) {
          console.error("Failed to parse contact_messages JSON, storing as regular key:", parseErr);
        }
      }

      if (ARRAY_KEYS.has(key)) {
        const collection = db.collection(key);
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            await collection.deleteMany({});
            if (parsed.length > 0) {
              const docsToInsert = parsed.map((item, idx) => {
                const cleanItem = { ...item, orderIndex: idx };
                delete cleanItem._id;
                return cleanItem;
              });
              await collection.insertMany(docsToInsert);
            }
            return;
          }
        } catch (parseErr) {
          console.error(`Failed to parse ${key} JSON:`, parseErr);
        }
      }

      if (key === "portfolio_chatbot") {
        const collection = db.collection("portfolio_chatbot");
        try {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed === "object") {
            await collection.deleteMany({});
            await collection.insertOne(parsed);
            return;
          }
        } catch (err) {
          console.error("Failed to save chatbot answers to dedicated collection:", err);
        }
      }
      
      const collection = db.collection("storage");
      await collection.updateOne(
        { _id: key },
        {
          $set: {
            value: String(value ?? ""),
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
      return;
    } catch (err) {
      console.error("Error writing to MongoDB, falling back to file write:", err);
    }
  }

  // Fallback to local file
  const nextWrite = writeQueue.then(async () => {
    const data = await readDatabase();
    data.storage[key] = {
      value: String(value ?? ""),
      updatedAt: new Date().toISOString(),
    };
    await writeDatabase(data);
  });
  writeQueue = nextWrite.catch((err) => {
    console.error("Database write error:", err);
    throw err;
  });
  return nextWrite;
}

