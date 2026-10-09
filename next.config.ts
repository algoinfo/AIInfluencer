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
