"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CoverImage } from "@/components/ui/CoverImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  characterStyles,
  contentActions,
  styleVisuals,
  type CharacterStyle,
} from "@/data/create";

export function CreatePreview() {
  const [style, setStyle] = useState<CharacterStyle>("Fashion");
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState(false);

  return (
    <section className="section-pad border-y border-border bg-bg-soft">
      <div className="page-shell">
        <SectionHeading
          title="Create Your AI Influencer"
          subtitle="Build a unique digital creator in minutes."
          align="center"
        />

        <div className="mt-12 space-y-8">
          <div className="rounded-[1.5rem] border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl font-medium">Choose a Style</h3>
              <span className="text-xs uppercase tracking-[0.18em] text-fg-subtle">
                Step 01
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {characterStyles.map((item) => {
                const active = style === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setStyle(item);
                      setGenerated(false);
                    }}
                    className={[
                      "group overflow-hidden rounded-2xl border text-left transition-all duration-300",
                      active
                        ? "border-accent/50 ring-1 ring-accent/30"
                        : "border-border hover:border-border-strong",
                    ].join(" ")}
                  >
                    <div className="media-frame aspect-[4/5]">
                      <CoverImage
                        src={styleVisuals[item]}
                        alt={item}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                      <p className="absolute inset-x-0 bottom-0 p-3 text-sm font-medium text-white">
                        {item}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl font-medium">
                Create Your Character
              </h3>
              <span className="text-xs uppercase tracking-[0.18em] text-fg-subtle">
                Step 02
              </span>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder='An elegant fashion influencer living in Tokyo...'
                  className="h-12 flex-1 rounded-full border border-border-strong bg-bg px-5 text-sm text-fg outline-none transition placeholder:text-fg-subtle focus:border-accent/50"
                />
                <Button
                  type="button"
                  onClick={() => setGenerated(true)}
                  className="sm:min-w-[180px]"
                >
                  Generate Character
                </Button>
              </div>
            </div>
            <div className="mt-5 min-h-[120px] rounded-2xl border border-dashed border-border-strong bg-bg/50 p-5">
              {generated ? (
                <div>
                  <p className="font-display text-lg text-fg">Preview Character</p>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    A refined {style.toLowerCase()} creator with a consistent look,
                    ready for photo, video and social content.
                    {prompt ? ` Inspired by: “${prompt}”.` : ""}
                  </p>
                  <Link
                    href={`/create?style=${encodeURIComponent(style)}`}
                    className="mt-4 inline-flex text-sm text-accent transition hover:text-accent-strong"
                  >
                    Continue in Create →
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-fg-subtle">
                  Your generated character preview will appear here.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl font-medium">Create Content</h3>
              <span className="text-xs uppercase tracking-[0.18em] text-fg-subtle">
                Step 03
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {contentActions.map((action) => (
                <Link
                  key={action.slug}
                  href={`/create?step=3&action=${action.slug}`}
                  className="group rounded-2xl border border-border bg-bg/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover"
                >
                  <p className="font-medium text-fg transition-colors group-hover:text-accent-strong">
                    {action.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
