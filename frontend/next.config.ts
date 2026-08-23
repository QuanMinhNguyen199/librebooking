import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages ? {
    output: "export",
    basePath: "/librebooking",
    assetPrefix: "/librebooking/",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
