import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, "portfolio.db");

let db;

function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new DatabaseSync(DB_PATH);
    db.exec(`
      create table if not exists portfolio_storage (
        key text primary key,
        value text not null default '',
        updated_at text not null default current_timestamp
      )
    `);
  }
  return db;
}

export function isAdminRequest(req) {
  const expected = process.env.ADMIN_PASSWORD || "manav2025";
  const provided =
    req.headers["x-admin-password"] ||
    req.body?.password ||
    req.query?.password;
  return Boolean(expected && provided === expected);
}

export function getValue(key) {
  const row = getDb()
    .prepare("select value from portfolio_storage where key = ? limit 1")
    .get(key);
  return row?.value ?? null;
}

export function setValue(key, value) {
  getDb()
    .prepare(`
      insert into portfolio_storage (key, value, updated_at)
      values (?, ?, current_timestamp)
      on conflict(key) do update set
        value = excluded.value,
        updated_at = current_timestamp
    `)
    .run(key, String(value ?? ""));
}
