import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "103.183.38.66" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
  experimental: {
    // Limit build workers to avoid exhausting DB connections on Aiven free tier
    cpus: 1,
  },
};

export default nextConfig;
