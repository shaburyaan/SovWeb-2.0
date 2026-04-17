import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    prerenderEarlyExit: false,
    serverMinification: false,
    serverSourceMaps: true,
    enablePrerenderSourceMaps: true,
    optimizePackageImports: ["framer-motion", "gsap"],
  },
};

export default nextConfig;
