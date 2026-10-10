import { ScanSemanticMode } from "@waffo/pancake-ts";
import { getWaffoClient, isWaffoConfigured } from "@/lib/waffo";

/**
 * Waffo Prompt Sift — screen prompts before AIGC generation.
 * Docs: https://docs.waffo.ai/api-reference/endpoints/content-safety/scan-prompt
 * AIGC: https://docs.waffo.ai/mor/account-reviews/aigc-compliance
 *
 * Continue to your image/video model only when `action === "allow"`.
 */

export type WaffoScanAction = "allow" | "review" | "block";

export type WaffoContentSafetyErrorCode =
  | "prompt_blocked"
  | "prompt_review"
  | "moderation_unavailable"
  | "rate_limited";

export class WaffoContentSafetyError extends Error {
  readonly code: WaffoContentSafetyErrorCode;
  readonly requestId?: string;

  constructor(
    message: string,
    code: WaffoContentSafetyErrorCode,
    requestId?: string,
  ) {
    super(message);
    this.name = "WaffoContentSafetyError";
    this.code = code;
    this.requestId = requestId;
  }
}

function isTruthyEnv(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

/** Explicit opt-out only — production never skips just because credentials look missing. */
export function isWaffoContentSafetySkipped(): boolean {
  return isTruthyEnv(process.env.WAFFO_CONTENT_SAFETY_SKIP);
}

/**
 * Call Waffo `contentSafety.scanPrompt` before generation.
 * Resolves only when the verdict is `allow`; otherwise throws (fail closed).
 */
export async function screenWaffoPrompt(input: {
  prompt: string;
  locale?: "en" | "zh" | "ja";
  log?: (message: string, data?: Record<string, unknown>) => void;
}): Promise<{ requestId?: string }> {
  const prompt = input.prompt.trim();
  if (!prompt) {
    throw new WaffoContentSafetyError(
      "A prompt is required for content screening before generation.",
      "prompt_blocked",
    );
  }

  if (prompt.length > 10_000) {
    throw new WaffoContentSafetyError(
      "Prompt is too long for content screening (max 10,000 characters).",
      "prompt_blocked",
    );
  }

  if (isWaffoContentSafetySkipped()) {
    input.log?.("content-safety skipped", {
      reason: "WAFFO_CONTENT_SAFETY_SKIP",
    });
    return {};
  }

  if (!isWaffoConfigured()) {
    // Local-only escape hatch when keys are absent; production must screen.
    if (process.env.NODE_ENV === "development") {
      input.log?.("content-safety skipped", {
        reason: "WAFFO credentials missing (development)",
      });
      return {};
    }
    input.log?.("content-safety blocked", { reason: "WAFFO not configured" });
    throw new WaffoContentSafetyError(
      "Content screening is temporarily unavailable. Please try again in a moment.",
      "moderation_unavailable",
    );
  }

  try {
    input.log?.("content-safety scanning", {
      promptLen: prompt.length,
      locale: input.locale ?? "en",
      semantic: ScanSemanticMode.Enforce,
    });

    const verdict = await getWaffoClient().contentSafety.scanPrompt({
      prompt,
      locale: input.locale ?? "en",
      semantic: ScanSemanticMode.Enforce,
    });

    input.log?.("content-safety screened", {
      action: verdict.action,
      reasonCode: verdict.reasonCode,
      requestId: verdict.requestId,
      matchedCategories: verdict.matchedCategories,
      semanticStatus: verdict.semanticStatus,
    });

    if (verdict.action === "allow") {
      return { requestId: verdict.requestId };
    }

    if (verdict.action === "block") {
      throw new WaffoContentSafetyError(
        "This content doesn't meet our usage guidelines. Please revise your prompt and try again.",
        "prompt_blocked",
        verdict.requestId,
      );
    }

    // review / service_degraded — fail closed, do not generate
    throw new WaffoContentSafetyError(
      "Content screening needs a moment. Please try again shortly.",
      "prompt_review",
      verdict.requestId,
    );
  } catch (error) {
    if (error instanceof WaffoContentSafetyError) throw error;

    const message = error instanceof Error ? error.message : String(error);
    const rateLimited =
      message.toLowerCase().includes("too many requests") ||
      message.includes("429");

    input.log?.("content-safety request failed", { message });

    throw new WaffoContentSafetyError(
      rateLimited
        ? "Content screening is busy. Please wait a moment and try again."
        : "Content screening is temporarily unavailable. Please try again in a moment.",
      rateLimited ? "rate_limited" : "moderation_unavailable",
    );
  }
}
