import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".backend");
const DATA_FILE = process.env.DATA_FILE || path.join(DATA_DIR, "db.json");

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
  const data = await readDatabase();
  const row = data.storage[key];
  return typeof row?.value === "string" ? row.value : null;
}

export async function setValue(key, value) {
  const nextWrite = writeQueue.then(async () => {
    const data = await readDatabase();
    data.storage[key] = {
      value: String(value ?? ""),
      updatedAt: new Date().toISOString(),
    };
    await writeDatabase(data);
  });
  writeQueue = nextWrite.catch(() => {});
  return nextWrite;
}
