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
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
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
          WHERE id = ?`,
    args: [error.slice(0, 500), id],
  });
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
