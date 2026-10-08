"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CoverImage } from "@/components/ui/CoverImage";
import { influencers } from "@/data/influencers";

/**
 * VideoCreator — mock Motion Transfer UI.
 * Future: wire character + reference video to video generation APIs
 * (Fal / Higgsfield Genjutsu / Kling / Runway / etc.) via server routes.
 */

export type VideoGenerationRequest = {
  characterSlug: string;
  referenceVideoName: string | null;
  mode: "motion-transfer";
};

export function VideoCreator() {
  const [characterSlug, setCharacterSlug] = useState(influencers[0]?.slug || "mia");
  const [videoName, setVideoName] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [ready, setReady] = useState(false);

  const character = useMemo(
    () => influencers.find((item) => item.slug === characterSlug) || influencers[0],
    [characterSlug],
  );

  async function generateVideo() {
    if (!character || !videoName) return;
    setGenerating(true);
    setReady(false);
    const payload: VideoGenerationRequest = {
      characterSlug: character.slug,
      referenceVideoName: videoName,
      mode: "motion-transfer",
    };
    try {
      await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setReady(true);
    } catch {
      setReady(true);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="page-shell pb-20 pt-[112px]">
      <div className="max-w-3xl">
        <p className="eyebrow">Video</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Create AI Influencer Videos
        </h1>
        <p className="mt-4 max-w-xl text-lg text-fg-muted">
          Combine your character with a reference video. Motion Transfer brings
          your AI influencer to life.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-fg-muted">
        <span className="rounded-full border border-border px-3 py-1.5 text-fg">
          Character
        </span>
        <span>+</span>
        <span className="rounded-full border border-border px-3 py-1.5 text-fg">
          Reference Video
        </span>
        <span>↓</span>
        <span className="rounded-full border border-border px-3 py-1.5 text-fg">
          Motion Transfer
        </span>
        <span>↓</span>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-fg">
          AI Influencer Video
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-2xl font-medium">Your Character</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Select the AI influencer identity you want to animate.
          </p>
          <label className="mt-6 block">
            <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-fg-subtle">
              Select Character
            </span>
            <select
              value={characterSlug}
              onChange={(event) => {
                setCharacterSlug(event.target.value);
                setReady(false);
              }}
              className="h-12 w-full rounded-full border border-border-strong bg-bg px-4 text-sm text-fg outline-none focus:border-accent/50"
            >
              {influencers.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name} — {item.type}
                </option>
              ))}
            </select>
          </label>
          {character ? (
            <div className="media-frame mt-5 aspect-[3/4] max-w-xs overflow-hidden rounded-[1.25rem] border border-border">
              <CoverImage src={character.image} alt={character.name} />
            </div>
          ) : null}
          <p className="mt-4 text-sm text-fg-muted">
            No character yet?{" "}
            <Link href="/create" className="text-accent hover:text-accent-strong">
              Create Your Influencer
            </Link>
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-2xl font-medium">Reference Video</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Upload a dance, walk or gesture clip to drive motion.
          </p>
          <label className="mt-6 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-bg/50 px-6 text-center transition hover:border-accent/40">
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setVideoName(file?.name || null);
                setReady(false);
              }}
            />
            <p className="font-medium text-fg">
              {videoName || "Upload Video"}
            </p>
            <p className="mt-2 text-sm text-fg-subtle">MP4, MOV · mock upload</p>
          </label>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-border bg-bg-soft p-6 sm:p-8">
        <h2 className="font-display text-2xl font-medium">Motion Transfer</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
          Bring your AI influencer to life using a reference video. Your character
          performs the same motion while keeping a consistent identity.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={generateVideo}
            disabled={!videoName || generating}
          >
            {generating ? "Generating..." : "Generate Video"}
          </Button>
          <Button href="/genjutsu" variant="secondary">
            Explore Genjutsu
          </Button>
        </div>
        {ready ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-5 text-sm text-fg-muted">
            Mock AI Influencer Video ready for{" "}
            <span className="text-fg">{character?.name}</span> using{" "}
            <span className="text-fg">{videoName}</span>. Connect a video API next.
          </div>
        ) : null}
      </div>
    </div>
  );
}
