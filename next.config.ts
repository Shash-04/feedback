import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve = {
      ...(config.resolve || {}),
      fallback: {
        ...(config.resolve?.fallback || {}),
        tls: false,
        net: false,
        fs: false,
        crypto: false,
        dns: false,
      },
    };
    return config;
  },
};

export default nextConfig;
