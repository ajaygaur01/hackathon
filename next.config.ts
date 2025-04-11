import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Updated from experimental.serverComponentsExternalPackages to serverExternalPackages
  serverExternalPackages: ['pdf-parse', 'tesseract.js'],
};

export default nextConfig;