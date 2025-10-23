import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      new URL("https://media.meinl.de/**"),
      new URL("https://apidev.meinl.de/**"),
    ],
  },
};

export default nextConfig;
