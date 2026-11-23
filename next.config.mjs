/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Microphone is needed for speaking practice (Part 7); camera and location are not.
  { key: "Permissions-Policy", value: "microphone=(self), camera=(), geolocation=()" },
];

import { fileURLToPath } from "node:url";
import path from "node:path";

const nextConfig = {
  // This repo sits inside a folder with another lockfile; pin the root to this project.
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
