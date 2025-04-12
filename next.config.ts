import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Updated from experimental.serverComponentsExternalPackages to serverExternalPackages
  serverExternalPackages: ['pdf-parse', 'tesseract.js'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          }
        ],
      },
    ]
  }
};

export default nextConfig;