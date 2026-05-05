import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** pdf-parse → pdfjs-dist must not be webpacked; it throws at load time in the RSC bundle. */
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  turbopack: {},
  webpack(config, { dev }) {
    // Windows can intermittently hit EBUSY when webpack's filesystem cache packfiles
    // are being renamed/locked by other processes (AV scanners, parallel Next tasks, etc.).
    // Disabling persistent cache for production builds avoids flaky `next build` failures.
    if (!dev && process.platform === "win32") {
      config.cache = false;
    }

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
