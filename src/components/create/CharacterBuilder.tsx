"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CoverImage } from "@/components/ui/CoverImage";
import { styleVisuals, type CharacterStyle, characterStyles } from "@/data/create";

type BuilderField =
  | "looks"
  | "style"
  | "personality"
  | "niche"
  | "location"
  | "signature";

const fields: { key: BuilderField; label: string; placeholder: string }[] = [
  {
    key: "looks",
    label: "Looks",
    placeholder: "Soft features, long dark hair, editorial makeup...",
  },
  {
    key: "style",
    label: "Style",
    placeholder: "Quiet luxury, muted tones, cinematic lighting...",
  },
  {
    key: "personality",
    label: "Personality",
    placeholder: "Calm, confident, aspirational...",
  },
  {
    key: "niche",
    label: "Niche",
    placeholder: "Fashion, beauty, lifestyle...",
  },
  {
    key: "location",
    label: "Location",
    placeholder: "Tokyo, Paris, Los Angeles...",
  },
  {
    key: "signature",
    label: "Signature",
    placeholder: "Gold hoop earrings, soft smile, film grain...",
  },
];

export function CharacterBuilder() {
  const [mode, setMode] = useState<"upload" | "generate">("generate");
  const [style, setStyle] = useState<CharacterStyle>("Fashion");
  const [uploadName, setUploadName] = useState("");
  const [values, setValues] = useState<Record<BuilderField, string>>({
    looks: "",
    style: "",
    personality: "",
    niche: "",
    location: "",
    signature: "",
  });
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  function generate() {
    setGenerating(true);
    window.setTimeout(() => {
      setSaved(true);
      setGenerating(false);
    }, 900);
  }

  return (
    <div className="page-shell pb-20 pt-[112px]">
      <div className="max-w-3xl">
        <p className="eyebrow">Create</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Create Your AI Influencer
        </h1>
        <p className="mt-4 max-w-xl text-lg text-fg-muted">
          Build a character from an image or from scratch. Save a Character Sheet
          for consistent identity across photos and videos.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={[
            "rounded-full px-4 py-2 text-sm transition",
            mode === "upload"
              ? "bg-accent text-[#141412]"
              : "border border-border text-fg-muted hover:text-fg",
          ].join(" ")}
        >
          Upload Image
        </button>
        <button
          type="button"
          onClick={() => setMode("generate")}
          className={[
            "rounded-full px-4 py-2 text-sm transition",
            mode === "generate"
              ? "bg-accent text-[#141412]"
              : "border border-border text-fg-muted hover:text-fg",
          ].join(" ")}
        >
          Generate Character
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {mode === "upload" ? (
            <div className="rounded-[1.5rem] border border-border bg-surface p-6 sm:p-8">
              <h2 className="font-display text-2xl font-medium">Upload Image</h2>
              <p className="mt-2 text-sm text-fg-muted">
                Start from a reference photo to lock your influencer look.
              </p>
              <label className="mt-6 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-bg/50 px-6 text-center transition hover:border-accent/40">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setUploadName(file?.name || "");
                    setSaved(false);
                  }}
                />
                <p className="font-medium text-fg">
                  {uploadName || "Drop an image or click to upload"}
                </p>
                <p className="mt-2 text-sm text-fg-subtle">JPG, PNG · mock upload</p>
              </label>
            </div>
          ) : null}

          <div className="rounded-[1.5rem] border border-border bg-surface p-6 sm:p-8">
            <h2 className="font-display text-2xl font-medium">Character Builder</h2>
            <p className="mt-2 text-sm text-fg-muted">
              Define the identity cues that keep your AI character consistent.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {characterStyles.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setStyle(item);
                    setSaved(false);
                  }}
                  className={[
                    "rounded-xl border px-3 py-2.5 text-left text-sm transition",
                    style === item
                      ? "border-accent/50 bg-accent/10 text-fg"
                      : "border-border text-fg-muted hover:text-fg",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-fg-subtle">
                    {field.label}
                  </span>
                  <input
                    value={values[field.key]}
                    onChange={(event) => {
                      setValues((prev) => ({
                        ...prev,
                        [field.key]: event.target.value,
                      }));
                      setSaved(false);
                    }}
                    placeholder={field.placeholder}
                    className="h-11 w-full rounded-xl border border-border-strong bg-bg px-3 text-sm text-fg outline-none transition placeholder:text-fg-subtle focus:border-accent/50"
                  />
                </label>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button type="button" onClick={generate} disabled={generating}>
                {generating ? "Generating..." : "Generate Character"}
              </Button>
              <Button href="/video" variant="secondary">
                Create Video
              </Button>
            </div>
          </div>
        </div>

        <aside className="rounded-[1.5rem] border border-border bg-bg-soft p-5 sm:p-6 lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs uppercase tracking-[0.18em] text-fg-subtle">
            Character Preview
          </p>
          <div className="media-frame mt-4 aspect-[3/4] overflow-hidden rounded-[1.25rem] border border-border">
            <CoverImage src={styleVisuals[style]} alt={`${style} character`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-xl text-white">{style} Creator</p>
              <p className="mt-1 text-sm text-white/75">
                {saved ? "Character identity saved" : "Draft character"}
              </p>
            </div>
          </div>

          {saved ? (
            <div className="mt-5 space-y-3 rounded-2xl border border-border bg-surface p-4 text-sm">
              <p className="font-medium text-fg">Saved</p>
              <ul className="space-y-2 text-fg-muted">
                <li>Character</li>
                <li>Character Sheet</li>
                <li>Character Identity</li>
              </ul>
              <p className="pt-2 text-fg-muted">
                Next: keep identity with{" "}
                <Link href="/soul-id" className="text-accent hover:text-accent-strong">
                  Soul ID
                </Link>{" "}
                or animate with{" "}
                <Link href="/genjutsu" className="text-accent hover:text-accent-strong">
                  Genjutsu
                </Link>
                .
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-fg-muted">
              Generate to save Character, Character Sheet and Character Identity.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
