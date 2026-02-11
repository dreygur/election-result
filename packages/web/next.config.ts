import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "103.183.38.66" },
    ],
  },
};

export default nextConfig;
