import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CLAUDE.md is a hand-maintained governance document; keep `next dev` from appending to it.
  agentRules: false,
};

export default nextConfig;
