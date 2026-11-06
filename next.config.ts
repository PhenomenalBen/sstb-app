import type { NextConfig } from "next";

// Extra origins allowed to reach the dev server (e.g. a phone or WSL on your
// local network). Set DEV_ALLOWED_ORIGINS="172.23.224.1,192.168.1.20" in
// .env.local — nothing is hardcoded in the repo.
const devOrigins = (process.env.DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  ...(devOrigins.length > 0 ? { allowedDevOrigins: devOrigins } : {}),
};

export default nextConfig;
