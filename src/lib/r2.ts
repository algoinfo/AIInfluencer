import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { R2_PREFIX, type R2Category } from "@/lib/r2-paths";

const LOG_PREFIX = "[r2]";

let client: S3Client | null = null;

function log(message: string, data?: Record<string, unknown>) {
  if (data) console.log(`${LOG_PREFIX} ${message}`, data);
  else console.log(`${LOG_PREFIX} ${message}`);
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      (process.env.R2_ENDPOINT || process.env.R2_ACCOUNT_ID),
  );
}

function getR2Endpoint(): string {
  let endpoint = process.env.R2_ENDPOINT?.trim() ?? "";
  const urlMatch = endpoint.match(/https:\/\/[^\s]+/);
  if (urlMatch) return urlMatch[0];

  const accountId = process.env.R2_ACCOUNT_ID;
  if (!accountId) {
    throw new Error("Set R2_ENDPOINT or R2_ACCOUNT_ID for Cloudflare R2.");
  }
  return `https://${accountId}.r2.cloudflarestorage.com`;
}

function getR2Client(): S3Client {
  if (client) return client;

  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured.");
  }

  client = new S3Client({
    region: "auto",
    endpoint: getR2Endpoint(),
    credentials: { accessKeyId, secretAccessKey },
  });

  return client;
}

function extensionFrom(name: string, mimeType: string): string {
  const fromName = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  if (fromName && fromName.length <= 8) return fromName.toLowerCase();

  if (mimeType.includes("jpeg") || mimeType === "image/jpg") return ".jpg";
  if (mimeType.includes("png")) return ".png";
  if (mimeType.includes("webp")) return ".webp";
  if (mimeType.includes("webm")) return ".webm";
  if (mimeType.includes("mp4")) return ".mp4";
  if (mimeType.includes("quicktime")) return ".mov";
  return "";
}

export async function downloadFromR2(key: string): Promise<Buffer | null> {
  if (!isR2Configured()) return null;

  const bucket = process.env.R2_BUCKET || "vocalove";
  try {
    const res = await getR2Client().send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    if (!res.Body) return null;
    const bytes = await res.Body.transformToByteArray();
    return Buffer.from(bytes);
  } catch (error) {
    log("download failed", {
      key,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export async function uploadToR2(input: {
  category: R2Category;
  body: Buffer | Uint8Array;
  filename?: string;
  contentType?: string;
}): Promise<{ key: string } | null> {
  if (!isR2Configured()) {
    log("upload skipped — R2 not configured");
    return null;
  }

  const bucket = process.env.R2_BUCKET || "vocalove";
  const prefix = R2_PREFIX[input.category];
  const safeName = (input.filename || "file").replace(/[^\w.\-()+ ]/g, "_");
  const ext = extensionFrom(safeName, input.contentType || "");
  const base = safeName.includes(".")
    ? safeName.slice(0, safeName.lastIndexOf("."))
    : safeName;
  const key = `${prefix}${Date.now()}-${randomUUID().slice(0, 8)}-${base}${ext || ""}`;
  const contentType = input.contentType || "application/octet-stream";

  log("upload start", {
    category: input.category,
    prefix,
    bucket,
    bytes: input.body.byteLength,
    key,
  });

  try {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: input.body,
        ContentType: contentType,
      }),
    );
    log("upload ok", { key, bytes: input.body.byteLength });
    return { key };
  } catch (error) {
    log("upload failed", {
      key,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/** Public HTTPS URL when NEXT_PUBLIC_R2_PUBLIC_URL is set. */
export function publicR2Url(key: string): string | null {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!base || !key) return null;
  return `${base}/${key}`;
}

/** Build a stable key (+ public URL) before uploading, for fire-and-forget mirrors. */
export function planR2Object(input: {
  category: R2Category;
  filename?: string;
  contentType?: string;
}): { key: string; url: string | null } | null {
  if (!isR2Configured()) return null;
  const prefix = R2_PREFIX[input.category];
  const safeName = (input.filename || "file").replace(/[^\w.\-()+ ]/g, "_");
  const ext = extensionFrom(safeName, input.contentType || "video/mp4");
  const base = safeName.includes(".")
    ? safeName.slice(0, safeName.lastIndexOf("."))
    : safeName;
  const key = `${prefix}${Date.now()}-${randomUUID().slice(0, 8)}-${base}${ext || ".mp4"}`;
  return { key, url: publicR2Url(key) };
}

export async function uploadToR2Key(input: {
  key: string;
  body: Buffer | Uint8Array;
  contentType?: string;
}): Promise<boolean> {
  if (!isR2Configured()) return false;
  const bucket = process.env.R2_BUCKET || "vocalove";
  const contentType = input.contentType || "application/octet-stream";
  try {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: input.key,
        Body: input.body,
        ContentType: contentType,
      }),
    );
    log("upload ok", { key: input.key, bytes: input.body.byteLength });
    return true;
  } catch (error) {
    log("upload failed", {
      key: input.key,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/** Fetch a remote video and store it under a planned R2 key (for history). */
export async function mirrorRemoteUrlToR2Key(params: {
  sourceUrl: string;
  key: string;
  contentType?: string;
}): Promise<boolean> {
  log("mirror start", { key: params.key, source: params.sourceUrl.slice(0, 80) });
  try {
    const res = await fetch(params.sourceUrl);
    if (!res.ok) {
      log("mirror fetch failed", { status: res.status, key: params.key });
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType =
      params.contentType ||
      res.headers.get("content-type") ||
      "video/mp4";
    return uploadToR2Key({
      key: params.key,
      body: buffer,
      contentType,
    });
  } catch (error) {
    log("mirror failed", {
      key: params.key,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
