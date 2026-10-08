import { NextResponse } from "next/server";

/**
 * Stub for future video generation (Fal / Higgsfield Genjutsu / Kling / etc.).
 * Client VideoCreator posts here once APIs are wired.
 * Uses server-only env: process.env.FAL_KEY
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    characterSlug?: string;
    referenceVideoName?: string | null;
    mode?: string;
  } | null;

  if (!body?.characterSlug) {
    return NextResponse.json(
      { error: "characterSlug is required" },
      { status: 400 },
    );
  }

  // Keep FAL_KEY server-side only — never return it to the client.
  const hasFalKey = Boolean(process.env.FAL_KEY);

  return NextResponse.json({
    status: "mock",
    message:
      "Video generation stub ready. Connect Fal / Genjutsu / Kling when enabling real runs.",
    request: {
      characterSlug: body.characterSlug,
      referenceVideoName: body.referenceVideoName ?? null,
      mode: body.mode ?? "motion-transfer",
    },
    providerConfigured: hasFalKey,
  });
}
