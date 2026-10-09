import { NextRequest, NextResponse } from "next/server";
import {
  listGenerationJobsByUserEmail,
  saveCompletedGenerationJob,
  saveFailedGenerationJob,
  type GenerationJobProduct,
} from "@/lib/generation-jobs";
import { ensureHttpsProxyDispatcher } from "@/lib/https-proxy";
import { getRequestSessionFromReq } from "@/lib/request-session";

function toItem(
  job: Awaited<ReturnType<typeof listGenerationJobsByUserEmail>>[number],
) {
  return {
    id: job.id,
    title: job.title,
    createdAt: job.createdAt,
    videoUrl: job.outputUrl || "",
    durationSec: job.durationSec ?? 0,
    modelMark: job.modelMark || "—",
    resolution: job.resolution || undefined,
    status:
      job.status === "completed"
        ? ("done" as const)
        : job.status === "processing"
          ? ("generating" as const)
          : ("failed" as const),
    errorMessage: job.error || undefined,
    product: job.product,
  };
}

export async function GET(req: NextRequest) {
  ensureHttpsProxyDispatcher();
  try {
    const { payload } = await getRequestSessionFromReq(req);
    const email = payload.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limitRaw = Number(req.nextUrl.searchParams.get("limit") ?? 24);
    const jobs = await listGenerationJobsByUserEmail(email, limitRaw);

    return NextResponse.json(
      { items: jobs.map(toItem) },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("[user/creations]", error);
    return NextResponse.json(
      { error: "Could not load creations." },
      { status: 503 },
    );
  }
}

/** Client fallback: persist a finished generation if the generate route missed DB write. */
export async function POST(req: NextRequest) {
  ensureHttpsProxyDispatcher();
  try {
    const { payload, session } = await getRequestSessionFromReq(req);
    const email = payload.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      id?: string;
      title?: string;
      videoUrl?: string;
      r2Key?: string | null;
      durationSec?: number;
      modelMark?: string;
      resolution?: string;
      product?: string;
      status?: "done" | "failed";
      errorMessage?: string;
    };

    const product: GenerationJobProduct =
      body.product === "object-swap" ? "object-swap" : "motion-transfer";
    const title = (body.title?.trim() || "Generation").slice(0, 120);

    if (body.status === "failed") {
      const job = await saveFailedGenerationJob({
        id: body.id,
        sessionId: session.id,
        userEmail: email,
        title,
        product,
        error: body.errorMessage || "Generation failed.",
        durationSec: body.durationSec ?? null,
        modelMark: body.modelMark ?? null,
        resolution: body.resolution ?? null,
      });
      return NextResponse.json(
        { item: toItem(job) },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }

    const videoUrl = body.videoUrl?.trim() || "";
    if (!videoUrl) {
      return NextResponse.json(
        { error: "videoUrl is required for completed creations." },
        { status: 400 },
      );
    }

    const job = await saveCompletedGenerationJob({
      id: body.id,
      sessionId: session.id,
      userEmail: email,
      title,
      product,
      outputUrl: videoUrl,
      outputR2Key: body.r2Key ?? null,
      durationSec: body.durationSec ?? null,
      modelMark: body.modelMark ?? null,
      resolution: body.resolution ?? null,
    });

    return NextResponse.json(
      { item: toItem(job) },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("[user/creations POST]", error);
    return NextResponse.json(
      { error: "Could not save creation." },
      { status: 503 },
    );
  }
}
