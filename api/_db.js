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
  const uri = process.env.MONGODB_URI || "mongodb+srv://tiwarimanav118_db_user:Manav123@cluster0.oqebpy9.mongodb.net/portfolio?appName=Cluster0";
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
      dbInstance = mongoClient.db(); // Connects to the default db specified in connection string
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
  const expected = process.env.ADMIN_PASSWORD || "manav2025";
  const provided =
    req.headers["x-admin-password"] ||
    req.body?.password ||
    req.query?.password;
  return Boolean(expected && provided === expected);
}

export async function getValue(key) {
  const db = await getMongoDB();
  if (db) {
    try {
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

