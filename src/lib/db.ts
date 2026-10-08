import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;
let schemaReadySettled = false;

export function getDb(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(
      "Turso is not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.",
    );
  }

  client = createClient({ url, authToken });
  return client;
}

export function isSchemaReady(): boolean {
  return schemaReadySettled;
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getDb();

      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT,
          google_id TEXT,
          credits_balance INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `);
      await db.execute(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          token TEXT NOT NULL UNIQUE,
          user_id TEXT REFERENCES users(id),
          generations INTEGER NOT NULL DEFAULT 0,
          downloads INTEGER NOT NULL DEFAULT 0,
          expires_at TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `);
      await db.execute(`
        CREATE TABLE IF NOT EXISTS credit_transactions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id),
          type TEXT NOT NULL,
          amount INTEGER NOT NULL,
          balance_after INTEGER NOT NULL,
          description TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `);

      const ignoreDuplicate = async (sql: string) => {
        try {
          await db.execute(sql);
        } catch {
          /* column/index already exists */
        }
      };

      await Promise.all([
        ignoreDuplicate(`ALTER TABLE users ADD COLUMN password_hash TEXT`),
        ignoreDuplicate(
          `ALTER TABLE users ADD COLUMN credits_balance INTEGER NOT NULL DEFAULT 0`,
        ),
        ignoreDuplicate(`ALTER TABLE users ADD COLUMN google_id TEXT`),
      ]);

      await Promise.all([
        db.execute(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`),
        db.execute(
          `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
        ),
        db.execute(
          `CREATE INDEX IF NOT EXISTS idx_credit_tx_user_id ON credit_transactions(user_id)`,
        ),
        db.execute(
          `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)`,
        ),
      ]);

      schemaReadySettled = true;
    })().catch((error) => {
      schemaReady = null;
      schemaReadySettled = false;
      throw error;
    });
  }
  return schemaReady;
}
