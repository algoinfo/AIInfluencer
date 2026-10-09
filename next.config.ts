import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Keep POST /api/paid/callback/ from becoming a 308 that breaks webhooks.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/discover", destination: "/examples", permanent: false },
      { source: "/create", destination: "/motion-transfer", permanent: false },
      { source: "/video", destination: "/motion-transfer", permanent: false },
      { source: "/ai-influencer-generator", destination: "/ai-influencer", permanent: false },
      { source: "/ai-influencer-video", destination: "/ai-influencer", permanent: false },
      { source: "/influencers", destination: "/examples", permanent: false },
      { source: "/influencers/:slug", destination: "/examples", permanent: false },
      { source: "/styles", destination: "/examples", permanent: false },
      { source: "/styles/:slug", destination: "/examples", permanent: false },
      { source: "/soul-id", destination: "/genjutsu-tutorial", permanent: false },
      { source: "/tools", destination: "/", permanent: true },
      { source: "/tools/:slug", destination: "/", permanent: true },
      // Thin guide stubs → hub / product / comparison (avoid empty shells in index)
      { source: "/guides/what-is-genjutsu", destination: "/genjutsu", permanent: true },
      {
        source: "/guides/what-is-ai-motion-transfer",
        destination: "/motion-transfer",
        permanent: true,
      },
      {
        source: "/guides/how-does-genjutsu-work",
        destination: "/guides/how-to-use-genjutsu",
        permanent: true,
      },
      {
        source: "/guides/genjutsu-vs-kling",
        destination: "/genjutsu-alternatives",
        permanent: true,
      },
      {
        source: "/guides/genjutsu-vs-runway",
        destination: "/genjutsu-alternatives",
        permanent: true,
      },
      {
        source: "/guides/genjutsu-alternatives",
        destination: "/genjutsu-alternatives",
        permanent: true,
      },
      {
        source: "/guides/best-ai-motion-transfer-tools",
        destination: "/genjutsu-alternatives",
        permanent: true,
      },
      // Keyword landings: keep one canonical URL per money query
      {
        source: "/ugc-ads",
        destination: "/ugc-video-generator",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
