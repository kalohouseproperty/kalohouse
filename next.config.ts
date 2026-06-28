import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Required for property wizard (9 images + ID via Server Action)
    serverActions: {
      bodySizeLimit: "100mb",
    },
    // Allow large multipart bodies through the proxy/middleware layer
    proxyClientMaxBodySize: "100mb",
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
    ],
  },
};

export default nextConfig;
