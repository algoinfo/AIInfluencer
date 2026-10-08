import { randomUUID } from "crypto";
import {
  FREE_DOWNLOAD_LIMIT,
  FREE_GENERATION_LIMIT,
  requiresLoginForDownload,
  requiresLoginForGeneration,
  type AuthUser,
  type SessionPayload,
  type UsageCounts,
} from "@/lib/auth-limits";
import { ensureSchema, getDb } from "@/lib/db";
import { hashPassword, validatePassword, verifyPassword } from "@/lib/password";
import { sessionExpiryIso } from "@/lib/session-cookie";
import { grantWelcomeCreditsIfNeeded } from "@/lib/user-credits";

type SessionRow = {
  id: string;
  token: string;
  user_id: string | null;
  generations: number;
  downloads: number;
  expires_at: string;
};

type UserRow = {
  id: string;
  email: string;
  password_hash: string | null;
  google_id: string | null;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toUsage(row: SessionRow): UsageCounts {
  return {
    generations: row.generations,
    downloads: row.downloads,
  };
}

async function getUserById(userId: string | null): Promise<AuthUser | null> {
  if (!userId) return null;
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT email FROM users WHERE id = ? LIMIT 1",
    args: [userId],
  });
  const email = result.rows[0]?.email;
  return typeof email === "string" ? { email } : null;
}

async function getSessionWithUserByToken(
  token: string,
): Promise<{ session: SessionRow; user: AuthUser | null } | null> {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT s.id, s.token, s.user_id, s.generations, s.downloads, s.expires_at,
                 u.email AS user_email
          FROM sessions s
          LEFT JOIN users u ON u.id = s.user_id
          WHERE s.token = ?
          LIMIT 1`,
    args: [token],
  });
  const row = result.rows[0];
  if (!row) return null;
  if (
    typeof row.expires_at === "string" &&
    row.expires_at < new Date().toISOString()
  ) {
    return null;
  }
  const email = row.user_email;
  return {
    session: {
      id: String(row.id),
      token: String(row.token),
      user_id: row.user_id ? String(row.user_id) : null,
      generations: Number(row.generations) || 0,
      downloads: Number(row.downloads) || 0,
      expires_at: String(row.expires_at),
    },
    user: typeof email === "string" ? { email } : null,
  };
}

async function getSessionByToken(token: string): Promise<SessionRow | null> {
  const found = await getSessionWithUserByToken(token);
  return found?.session ?? null;
}

async function createSession(): Promise<SessionRow> {
  const db = getDb();
  const id = randomUUID();
  const token = randomUUID();
  const expiresAt = sessionExpiryIso();
  await db.execute({
    sql: `INSERT INTO sessions (id, token, expires_at) VALUES (?, ?, ?)`,
    args: [id, token, expiresAt],
  });
  return {
    id,
    token,
    user_id: null,
    generations: 0,
    downloads: 0,
    expires_at: expiresAt,
  };
}

export async function resolveSession(token?: string | null): Promise<{
  session: SessionRow;
  created: boolean;
}> {
  await ensureSchema();
  if (token) {
    const existing = await getSessionByToken(token);
    if (existing) return { session: existing, created: false };
  }
  const session = await createSession();
  return { session, created: true };
}

export async function getSessionPayload(token?: string | null): Promise<{
  payload: SessionPayload;
  session: SessionRow;
  created: boolean;
}> {
  await ensureSchema();

  if (token) {
    const found = await getSessionWithUserByToken(token);
    if (found) {
      return {
        payload: { user: found.user, usage: toUsage(found.session) },
        session: found.session,
        created: false,
      };
    }
  }

  const session = await createSession();
  return {
    payload: { user: null, usage: toUsage(session) },
    session,
    created: true,
  };
}

async function getUserByEmail(email: string): Promise<UserRow | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, email, password_hash, google_id FROM users WHERE email = ? LIMIT 1",
    args: [email],
  });
  const row = result.rows[0];
  if (!row?.id || typeof row.email !== "string") return null;
  return {
    id: String(row.id),
    email: row.email,
    password_hash: row.password_hash ? String(row.password_hash) : null,
    google_id: row.google_id ? String(row.google_id) : null,
  };
}

async function getUserByGoogleId(googleId: string): Promise<UserRow | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, email, password_hash, google_id FROM users WHERE google_id = ? LIMIT 1",
    args: [googleId],
  });
  const row = result.rows[0];
  if (!row?.id || typeof row.email !== "string") return null;
  return {
    id: String(row.id),
    email: row.email,
    password_hash: row.password_hash ? String(row.password_hash) : null,
    google_id: row.google_id ? String(row.google_id) : null,
  };
}

async function linkGoogleId(userId: string, googleId: string) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE users SET google_id = ? WHERE id = ?",
    args: [googleId, userId],
  });
}

async function createGoogleUser(
  email: string,
  googleId: string,
): Promise<UserRow> {
  const db = getDb();
  const userId = randomUUID();
  await db.execute({
    sql: "INSERT INTO users (id, email, google_id) VALUES (?, ?, ?)",
    args: [userId, email, googleId],
  });
  return {
    id: userId,
    email,
    password_hash: null,
    google_id: googleId,
  };
}

async function attachUserToSession(session: SessionRow, userId: string) {
  const db = getDb();
  await db.execute({
    sql: `UPDATE sessions SET user_id = ?, expires_at = ? WHERE id = ?`,
    args: [userId, sessionExpiryIso(), session.id],
  });
}

export async function signInWithPassword(
  token: string | null | undefined,
  email: string,
  password: string,
): Promise<{ payload: SessionPayload; session: SessionRow; created: boolean }> {
  await ensureSchema();
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes("@")) {
    throw new Error("Invalid email");
  }

  const existing = await getUserByEmail(normalized);
  if (!existing) {
    throw new Error("No account found. Sign up free.");
  }
  if (!existing.password_hash) {
    throw new Error(
      existing.google_id
        ? "This account uses Google sign-in. Continue with Google instead."
        : "This account has no password. Sign up again with a new email.",
    );
  }

  const valid = await verifyPassword(password, existing.password_hash);
  if (!valid) {
    throw new Error("Incorrect email or password.");
  }

  const { session, created } = await resolveSession(token);
  await attachUserToSession(session, existing.id);

  const updated = await getSessionByToken(session.token);
  if (!updated) throw new Error("Session not found");

  return {
    payload: { user: { email: existing.email }, usage: toUsage(updated) },
    session: updated,
    created,
  };
}

export async function registerWithPassword(
  token: string | null | undefined,
  email: string,
  password: string,
): Promise<{ payload: SessionPayload; session: SessionRow; created: boolean }> {
  await ensureSchema();
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes("@")) {
    throw new Error("Invalid email");
  }

  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(passwordError);

  const existing = await getUserByEmail(normalized);
  if (existing) {
    if (existing.google_id && !existing.password_hash) {
      throw new Error("Account already exists. Continue with Google instead.");
    }
    throw new Error("Account already exists. Log in instead.");
  }

  const { session, created } = await resolveSession(token);
  const db = getDb();
  const userId = randomUUID();
  const passwordHash = await hashPassword(password);
  await db.execute({
    sql: "INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)",
    args: [userId, normalized, passwordHash],
  });
  await grantWelcomeCreditsIfNeeded(userId);
  await attachUserToSession(session, userId);

  const updated = await getSessionByToken(session.token);
  if (!updated) throw new Error("Session not found");

  return {
    payload: { user: { email: normalized }, usage: toUsage(updated) },
    session: updated,
    created,
  };
}

export async function signInWithGoogle(
  token: string | null | undefined,
  profile: { googleId: string; email: string; emailVerified: boolean },
): Promise<{ payload: SessionPayload; session: SessionRow; created: boolean }> {
  await ensureSchema();

  if (!profile.emailVerified) {
    throw new Error("Your Google email must be verified.");
  }

  const normalized = normalizeEmail(profile.email);
  if (!normalized || !normalized.includes("@")) {
    throw new Error("Invalid Google email.");
  }

  let user = await getUserByGoogleId(profile.googleId);
  if (!user) {
    user = await getUserByEmail(normalized);
    if (user) {
      if (user.google_id && user.google_id !== profile.googleId) {
        throw new Error("This email is linked to a different Google account.");
      }
      if (!user.google_id) {
        await linkGoogleId(user.id, profile.googleId);
        user = { ...user, google_id: profile.googleId };
      }
    } else {
      user = await createGoogleUser(normalized, profile.googleId);
      await grantWelcomeCreditsIfNeeded(user.id);
    }
  }

  const { session, created } = await resolveSession(token);
  await attachUserToSession(session, user.id);

  const updated = await getSessionByToken(session.token);
  if (!updated) throw new Error("Session not found");

  return {
    payload: { user: { email: user.email }, usage: toUsage(updated) },
    session: updated,
    created,
  };
}

export async function logoutSession(
  token: string | null | undefined,
): Promise<SessionPayload> {
  await ensureSchema();
  const { session } = await resolveSession(token);
  if (session.user_id) {
    const db = getDb();
    await db.execute({
      sql: "UPDATE sessions SET user_id = NULL WHERE id = ?",
      args: [session.id],
    });
  }
  return { user: null, usage: toUsage(session) };
}

export type UsageAction = "generation" | "download";

export async function recordUsage(
  token: string | null | undefined,
  action: UsageAction,
): Promise<{
  payload: SessionPayload;
  session: SessionRow;
  created: boolean;
  needsLogin?: boolean;
}> {
  await ensureSchema();
  const { session, created } = await resolveSession(token);
  const user = await getUserById(session.user_id);
  const usage = toUsage(session);

  if (action === "generation" && requiresLoginForGeneration(user, usage)) {
    return { payload: { user, usage }, session, created, needsLogin: true };
  }
  if (action === "download" && requiresLoginForDownload(user, usage)) {
    return { payload: { user, usage }, session, created, needsLogin: true };
  }

  const db = getDb();
  const column = action === "generation" ? "generations" : "downloads";
  await db.execute({
    sql: `UPDATE sessions SET ${column} = ${column} + 1 WHERE id = ?`,
    args: [session.id],
  });

  const updated = await getSessionByToken(session.token);
  if (!updated) throw new Error("Session not found");

  const nextUser = await getUserById(updated.user_id);
  return {
    payload: { user: nextUser, usage: toUsage(updated) },
    session: updated,
    created,
  };
}

export { FREE_DOWNLOAD_LIMIT, FREE_GENERATION_LIMIT };
