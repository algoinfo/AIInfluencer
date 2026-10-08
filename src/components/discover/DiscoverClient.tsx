"use client";

import { useMemo, useState } from "react";
import { InfluencerCard } from "@/components/influencers/InfluencerCard";
import { Button } from "@/components/ui/Button";
import { influencers } from "@/data/influencers";

const filters = ["All", "Fashion", "Lifestyle", "Beauty", "Fitness", "Luxury", "Travel", "Gaming", "Anime"] as const;

export function DiscoverClient() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return influencers.filter((item) => {
      const matchesFilter =
        filter === "All" ||
        item.type.toLowerCase().includes(filter.toLowerCase());
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.platforms.some((platform) => platform.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div className="page-shell pb-20 pt-[112px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Discover</p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Discover AI Influencers
          </h1>
          <p className="mt-4 text-lg text-fg-muted">
            Browse characters, styles and creators shaping the next generation of
            social media.
          </p>
        </div>
        <Button href="/create">Create Influencer</Button>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">Search influencers</span>
          <input
            id="discover-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search creators, styles, platforms..."
            className="h-12 w-full rounded-full border border-border-strong bg-surface px-5 text-sm text-fg outline-none transition placeholder:text-fg-subtle focus:border-accent/50"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={[
                  "shrink-0 rounded-full px-4 py-2 text-sm transition",
                  active
                    ? "bg-accent text-[#141412]"
                    : "border border-border text-fg-muted hover:text-fg",
                ].join(" ")}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {results.length ? (
        <div className="masonry mt-10">
          {results.map((influencer) => (
            <InfluencerCard key={influencer.slug} influencer={influencer} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-[1.5rem] border border-dashed border-border-strong bg-surface/60 px-6 py-16 text-center">
          <p className="font-display text-2xl">No creators found</p>
          <p className="mt-3 text-fg-muted">
            Try another style, or create your own AI influencer.
          </p>
          <div className="mt-6">
            <Button href="/create">Create Influencer</Button>
          </div>
        </div>
      )}
    </div>
  );
}
