/** Persist Motion Studio selections across auth / OAuth redirects. */

const DB_NAME = "genjutsu-studio-draft";
const DB_VERSION = 1;
const STORE = "draft";
const DRAFT_ID = "current";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export type StudioDraftMode = "motion-transfer" | "object-swap";
/** Genjutsu: 480/720/1080 · fal wan-motion: 480/580/720 */
export type StudioDraftResolution = "480p" | "580p" | "720p" | "1080p";

type StoredFile = { name: string; type: string; blob: Blob };

type StoredDraft = {
  id: typeof DRAFT_ID;
  studioMode: StudioDraftMode;
  modelId: string;
  resolution: StudioDraftResolution;
  prompt: string;
  promptOn: boolean;
  resumeGenerate: boolean;
  savedAt: number;
  imageFiles: StoredFile[];
  videoFile: StoredFile | null;
};

export type StudioDraftInput = {
  studioMode: StudioDraftMode;
  modelId: string;
  resolution: StudioDraftResolution;
  prompt: string;
  promptOn: boolean;
  resumeGenerate: boolean;
  imageFiles: File[];
  videoFile: File | null;
};

export type StudioDraftRestored = {
  studioMode: StudioDraftMode;
  modelId: string;
  resolution: StudioDraftResolution;
  prompt: string;
  promptOn: boolean;
  resumeGenerate: boolean;
  imageFiles: File[];
  videoFile: File | null;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () =>
      reject(request.error ?? new Error("Failed to open studio draft store"));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        const request = fn(store);
        tx.oncomplete = () => {
          if (request && "result" in request) {
            resolve((request as IDBRequest<T>).result);
          } else {
            resolve();
          }
        };
        tx.onerror = () =>
          reject(tx.error ?? new Error("Studio draft transaction failed"));
      }),
  );
}

async function toStoredFile(file: File): Promise<StoredFile> {
  return {
    name: file.name || "file",
    type: file.type || "application/octet-stream",
    blob: file,
  };
}

function fromStoredFile(entry: StoredFile): File {
  return new File([entry.blob], entry.name, {
    type: entry.type || "application/octet-stream",
  });
}

export async function saveStudioDraft(input: StudioDraftInput): Promise<void> {
  if (!isBrowser()) return;

  const record: StoredDraft = {
    id: DRAFT_ID,
    studioMode: input.studioMode,
    modelId: input.modelId,
    resolution: input.resolution,
    prompt: input.prompt,
    promptOn: input.promptOn,
    resumeGenerate: input.resumeGenerate,
    savedAt: Date.now(),
    imageFiles: await Promise.all(input.imageFiles.map(toStoredFile)),
    videoFile: input.videoFile ? await toStoredFile(input.videoFile) : null,
  };

  await runTransaction("readwrite", (store) => store.put(record));
}

export async function loadStudioDraft(): Promise<StudioDraftRestored | null> {
  if (!isBrowser()) return null;

  const record = (await runTransaction<StoredDraft>("readonly", (store) =>
    store.get(DRAFT_ID),
  )) as StoredDraft | undefined;

  if (!record?.savedAt) return null;
  if (Date.now() - record.savedAt > MAX_AGE_MS) {
    await clearStudioDraft();
    return null;
  }

  return {
    studioMode: record.studioMode,
    modelId: record.modelId,
    resolution: record.resolution,
    prompt: record.prompt,
    promptOn: record.promptOn,
    resumeGenerate: record.resumeGenerate,
    imageFiles: (record.imageFiles || []).map(fromStoredFile),
    videoFile: record.videoFile ? fromStoredFile(record.videoFile) : null,
  };
}

export async function clearStudioDraft(): Promise<void> {
  if (!isBrowser()) return;
  await runTransaction("readwrite", (store) => store.delete(DRAFT_ID));
}
