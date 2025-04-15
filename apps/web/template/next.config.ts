import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@ascend/api-client": path.resolve(__dirname, "../../../packages/api-client/pkg"),
      eslint: {
        ignoreDuringBuilds: true, 
      }
    };
    return config;
  },
};

export default nextConfig;
