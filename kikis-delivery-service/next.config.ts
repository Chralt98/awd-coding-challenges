import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  // the root is this project's directory, not the parent. Without it, you get a warning about inferred workspace root and detected additional lockfiles.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
