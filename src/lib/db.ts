import { createClient, type Client } from "@libsql/client";
import {
  ensureHttpsProxyDispatcher,
  proxyFetch,
} from "@/lib/https-proxy";

/** Bump when adding tables/columns so hot reload re-runs migrations. */
const SCHEMA_VERSION = 3;

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;
let schemaReadySettled = false;
let appliedSchemaVersion = 0;

export function getDb(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(
      "Turso is not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.",
    );
  }

  // Local networks often need HTTPS_PROXY to reach Turso reliably.
  ensureHttpsProxyDispatcher();
  client = createClient({
    url,
    authToken,
    fetch: proxyFetch as unknown as typeof fetch,
  });
  return client;
}

export function isSchemaReady(): boolean {
  return schemaReadySettled && appliedSchemaVersion >= SCHEMA_VERSION;
}

export async function ensureSchema() {
  if (schemaReady && appliedSchemaVersion >= SCHEMA_VERSION) {
    return schemaReady;
  }

  // Schema code changed (or first boot) — (re)run CREATE / migrations.
  schemaReady = null;
  schemaReadySettled = false;

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
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        tier_id TEXT NOT NULL,
        amount_cents INTEGER NOT NULL,
        credits_granted INTEGER NOT NULL,
        provider TEXT,
        provider_ref TEXT UNIQUE,
        status TEXT NOT NULL DEFAULT 'completed',
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
        payment_id TEXT REFERENCES payments(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS generation_jobs (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        user_email TEXT,
        status TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'video',
        product TEXT,
        title TEXT NOT NULL,
        output_r2_key TEXT,
        output_url TEXT,
        error TEXT,
        duration_sec INTEGER,
        model_mark TEXT,
        resolution TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
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
      ignoreDuplicate(`ALTER TABLE generation_jobs ADD COLUMN output_url TEXT`),
      ignoreDuplicate(
        `ALTER TABLE generation_jobs ADD COLUMN duration_sec INTEGER`,
      ),
      ignoreDuplicate(`ALTER TABLE generation_jobs ADD COLUMN model_mark TEXT`),
      ignoreDuplicate(`ALTER TABLE generation_jobs ADD COLUMN resolution TEXT`),
      ignoreDuplicate(`ALTER TABLE generation_jobs ADD COLUMN product TEXT`),
      ignoreDuplicate(
        `ALTER TABLE credit_transactions ADD COLUMN payment_id TEXT`,
      ),
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
      db.execute(
        `CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_email
         ON generation_jobs(user_email, created_at DESC)`,
      ),
      db.execute(
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_ref
         ON payments(provider_ref)`,
      ),
    ]);

    appliedSchemaVersion = SCHEMA_VERSION;
    schemaReadySettled = true;
  })().catch((error) => {
    schemaReady = null;
    schemaReadySettled = false;
    appliedSchemaVersion = 0;
    throw error;
  });

  return schemaReady;
}
