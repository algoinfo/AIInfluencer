import { randomUUID } from "crypto";
import { ensureSchema, getDb } from "@/lib/db";

export type GenerationJobStatus = "processing" | "completed" | "failed";

export type GenerationJobProduct = "motion-transfer" | "object-swap";

export type GenerationJob = {
  id: string;
  sessionId: string;
  userEmail: string | null;
  status: GenerationJobStatus;
  type: "video";
  product: GenerationJobProduct | null;
  title: string;
  outputR2Key: string | null;
  outputUrl: string | null;
  error: string | null;
  durationSec: number | null;
  modelMark: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Turso `datetime('now')` is UTC without a Z — normalize so clients sort/display correctly. */
function sqlUtcToIso(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return new Date().toISOString();
  if (raw.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(raw)) {
    const parsed = Date.parse(raw);
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : raw;
  }
  const asUtc = Date.parse(raw.includes("T") ? `${raw}Z` : `${raw.replace(" ", "T")}Z`);
  if (Number.isFinite(asUtc)) return new Date(asUtc).toISOString();
  const fallback = Date.parse(raw);
  return Number.isFinite(fallback)
    ? new Date(fallback).toISOString()
    : new Date().toISOString();
}

function rowToJob(row: Record<string, unknown>): GenerationJob {
  const product =
    row.product === "motion-transfer" || row.product === "object-swap"
      ? row.product
      : null;
  return {
    id: String(row.id),
    sessionId: String(row.session_id),
    userEmail: row.user_email ? String(row.user_email) : null,
    status: String(row.status) as GenerationJobStatus,
    type: "video",
    product,
    title: String(row.title),
    outputR2Key: row.output_r2_key ? String(row.output_r2_key) : null,
    outputUrl: row.output_url ? String(row.output_url) : null,
    error: row.error ? String(row.error) : null,
    durationSec:
      typeof row.duration_sec === "number"
        ? row.duration_sec
        : row.duration_sec != null
          ? Number(row.duration_sec) || null
          : null,
    modelMark: row.model_mark ? String(row.model_mark) : null,
    resolution: row.resolution ? String(row.resolution) : null,
    createdAt: sqlUtcToIso(row.created_at),
    updatedAt: sqlUtcToIso(row.updated_at),
  };
}

function sanitizeClientJobId(value: string | null | undefined): string | null {
  const raw = value?.trim() ?? "";
  if (!raw || raw.length < 8 || raw.length > 80) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(raw)) return null;
  return raw;
}

export async function createGenerationJob(input: {
  id?: string | null;
  sessionId: string;
  userEmail: string;
  title: string;
  product: GenerationJobProduct;
  durationSec?: number | null;
  modelMark?: string | null;
  resolution?: string | null;
}): Promise<GenerationJob> {
  await ensureSchema();
  const db = getDb();
  const id = sanitizeClientJobId(input.id) ?? randomUUID();
  await db.execute({
    sql: `INSERT INTO generation_jobs
            (id, session_id, user_email, status, type, product, title,
             duration_sec, model_mark, resolution)
          VALUES (?, ?, ?, 'processing', 'video', ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.sessionId,
      input.userEmail,
      input.product,
      input.title,
      input.durationSec ?? null,
      input.modelMark ?? null,
      input.resolution ?? null,
    ],
  });
  const job = await getGenerationJob(id);
  if (!job) throw new Error("Failed to create generation job");
  return job;
}

export async function getGenerationJob(
  id: string,
): Promise<GenerationJob | null> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, session_id, user_email, status, type, product, title,
                 output_r2_key, output_url, error, duration_sec, model_mark,
                 resolution, created_at, updated_at
          FROM generation_jobs WHERE id = ? LIMIT 1`,
    args: [id],
  });
  const row = result.rows[0];
  if (!row) return null;
  return rowToJob(row as Record<string, unknown>);
}

export async function markGenerationJobCompleted(
  id: string,
  input: { outputR2Key?: string | null; outputUrl: string },
) {
  await ensureSchema();
  const db = getDb();
  await db.execute({
    sql: `UPDATE generation_jobs
          SET status = 'completed',
              output_r2_key = ?,
              output_url = ?,
              error = NULL,
              updated_at = datetime('now')
          WHERE id = ?`,
    args: [input.outputR2Key ?? null, input.outputUrl, id],
  });
}

export async function markGenerationJobFailed(id: string, error: string) {
  await ensureSchema();
  const db = getDb();
  await db.execute({
    sql: `UPDATE generation_jobs
          SET status = 'failed', error = ?, updated_at = datetime('now')
          WHERE id = ? AND status != 'completed'`,
    args: [error.slice(0, 500), id],
  });
}

/**
 * Persist a finished generation for a logged-in user.
 * Safe to call even when the earlier "processing" insert failed.
 */
export async function saveCompletedGenerationJob(input: {
  id?: string | null;
  sessionId: string;
  userEmail: string;
  title: string;
  product: GenerationJobProduct;
  outputUrl: string;
  outputR2Key?: string | null;
  durationSec?: number | null;
  modelMark?: string | null;
  resolution?: string | null;
}): Promise<GenerationJob> {
  await ensureSchema();
  const db = getDb();
  const id = sanitizeClientJobId(input.id) ?? randomUUID();
  const existing = await getGenerationJob(id);

  if (existing) {
    await db.execute({
      sql: `UPDATE generation_jobs
            SET status = 'completed',
                output_r2_key = ?,
                output_url = ?,
                error = NULL,
                title = ?,
                product = ?,
                duration_sec = ?,
                model_mark = ?,
                resolution = ?,
                user_email = ?,
                updated_at = datetime('now')
            WHERE id = ?`,
      args: [
        input.outputR2Key ?? null,
        input.outputUrl,
        input.title.slice(0, 120),
        input.product,
        input.durationSec ?? null,
        input.modelMark ?? null,
        input.resolution ?? null,
        input.userEmail,
        id,
      ],
    });
  } else {
    await db.execute({
      sql: `INSERT INTO generation_jobs
              (id, session_id, user_email, status, type, product, title,
               output_r2_key, output_url, duration_sec, model_mark, resolution)
            VALUES (?, ?, ?, 'completed', 'video', ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        input.sessionId,
        input.userEmail,
        input.product,
        input.title.slice(0, 120),
        input.outputR2Key ?? null,
        input.outputUrl,
        input.durationSec ?? null,
        input.modelMark ?? null,
        input.resolution ?? null,
      ],
    });
  }

  const job = await getGenerationJob(id);
  if (!job) throw new Error("Failed to save generation job");
  return job;
}

export async function saveFailedGenerationJob(input: {
  id?: string | null;
  sessionId: string;
  userEmail: string;
  title: string;
  product: GenerationJobProduct;
  error: string;
  durationSec?: number | null;
  modelMark?: string | null;
  resolution?: string | null;
}): Promise<GenerationJob> {
  await ensureSchema();
  const db = getDb();
  const id = sanitizeClientJobId(input.id) ?? randomUUID();
  const existing = await getGenerationJob(id);
  const error = input.error.slice(0, 500);

  if (existing?.status === "completed" && existing.outputUrl) {
    return existing;
  }

  if (existing) {
    await markGenerationJobFailed(id, error);
  } else {
    await db.execute({
      sql: `INSERT INTO generation_jobs
              (id, session_id, user_email, status, type, product, title,
               error, duration_sec, model_mark, resolution)
            VALUES (?, ?, ?, 'failed', 'video', ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        input.sessionId,
        input.userEmail,
        input.product,
        input.title.slice(0, 120),
        error,
        input.durationSec ?? null,
        input.modelMark ?? null,
        input.resolution ?? null,
      ],
    });
  }

  const job = await getGenerationJob(id);
  if (!job) throw new Error("Failed to save failed generation job");
  return job;
}

export async function listGenerationJobsByUserEmail(
  userEmail: string,
  limit = 24,
): Promise<GenerationJob[]> {
  await ensureSchema();
  const db = getDb();
  const capped = Math.min(100, Math.max(1, Math.floor(limit)));
  const result = await db.execute({
    sql: `SELECT id, session_id, user_email, status, type, product, title,
                 output_r2_key, output_url, error, duration_sec, model_mark,
                 resolution, created_at, updated_at
          FROM generation_jobs
          WHERE user_email = ?
          ORDER BY created_at DESC
          LIMIT ?`,
    args: [userEmail, capped],
  });
  return result.rows.map((row) => rowToJob(row as Record<string, unknown>));
}

export async function deleteGenerationJobForUser(
  id: string,
  userEmail: string,
): Promise<boolean> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({
    sql: `DELETE FROM generation_jobs WHERE id = ? AND user_email = ?`,
    args: [id, userEmail],
  });
  return (result.rowsAffected ?? 0) > 0;
}

/** True when this user owns a completed job that points at the R2 key. */
export async function userOwnsGenerationR2Key(
  userEmail: string,
  r2Key: string,
): Promise<boolean> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id FROM generation_jobs
          WHERE user_email = ? AND output_r2_key = ?
          LIMIT 1`,
    args: [userEmail, r2Key],
  });
  return result.rows.length > 0;
}

export async function updateGenerationJobOutputUrl(
  id: string,
  input: { outputUrl: string; outputR2Key?: string | null },
): Promise<void> {
  await ensureSchema();
  const db = getDb();
  await db.execute({
    sql: `UPDATE generation_jobs
          SET output_url = ?,
              output_r2_key = COALESCE(?, output_r2_key),
              updated_at = datetime('now')
          WHERE id = ?`,
    args: [input.outputUrl, input.outputR2Key ?? null, id],
  });
}
