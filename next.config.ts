import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** pdf-parse → pdfjs-dist must not be webpacked; it throws at load time in the RSC bundle. */
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
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
