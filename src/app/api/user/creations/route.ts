import { NextRequest, NextResponse } from "next/server";
import { listGenerationJobsByUserEmail } from "@/lib/generation-jobs";
import { getRequestSessionFromReq } from "@/lib/request-session";

export async function GET(req: NextRequest) {
  try {
    const { payload } = await getRequestSessionFromReq(req);
    const email = payload.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limitRaw = Number(req.nextUrl.searchParams.get("limit") ?? 24);
    const jobs = await listGenerationJobsByUserEmail(email, limitRaw);

    const items = jobs.map((job) => ({
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
    }));

    return NextResponse.json(
      { items },
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
