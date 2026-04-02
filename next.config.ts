import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack(config) {
    config.module.rules.unshift({
      test: /\.svg$/i,
      resourceQuery: /component/,
      use: ["@svgr/webpack"],
    });
    config.module.rules.unshift({
      test: /\.svg$/i,
      resourceQuery: { not: [/component/] },
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;
