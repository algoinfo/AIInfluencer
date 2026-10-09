import { NextRequest, NextResponse } from "next/server";
import { userOwnsGenerationR2Key } from "@/lib/generation-jobs";
import { isR2Configured, streamFromR2 } from "@/lib/r2";
import { getRequestSessionFromReq } from "@/lib/request-session";

function decodeKey(parts: string[]): string | null {
  if (!parts.length) return null;
  try {
    const key = parts.map((part) => decodeURIComponent(part)).join("/");
    if (!key.startsWith("ges/")) return null;
    if (key.includes("..")) return null;
    return key;
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string[] }> },
) {
  try {
    if (!isR2Configured()) {
      return NextResponse.json(
        { error: "Media storage is not configured." },
        { status: 503 },
      );
    }

    const { payload } = await getRequestSessionFromReq(req);
    const email = payload.user?.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }

    const { key: parts } = await context.params;
    const key = decodeKey(parts);
    if (!key) {
      return NextResponse.json({ error: "Invalid media key." }, { status: 400 });
    }

    const owns = await userOwnsGenerationR2Key(email, key);
    if (!owns) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const streamed = await streamFromR2(key);
    if (!streamed?.body) {
      return NextResponse.json(
        { error: "Media not ready yet." },
        { status: 404 },
      );
    }

    const headers = new Headers({
      "Content-Type": streamed.contentType,
      "Cache-Control": "private, max-age=86400",
    });
    if (typeof streamed.contentLength === "number") {
      headers.set("Content-Length", String(streamed.contentLength));
    }

    return new NextResponse(streamed.body, { status: 200, headers });
  } catch (error) {
    console.error("[media/r2]", error);
    return NextResponse.json(
      { error: "Could not load media." },
      { status: 500 },
    );
  }
}
