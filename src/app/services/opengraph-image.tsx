import { ImageResponse } from "next/og";

import { SERVICES_PAGE } from "@/utils/constant";

export const alt = SERVICES_PAGE.seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time so the page ships a real 1200x630 PNG for Open Graph
 * and Twitter cards without committing a binary asset. Next also reuses this
 * for `twitter:image` because `metadata.twitter.images` is left unset.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(140deg, #071b38 0%, #0d3566 55%, #071b38 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "999px",
              background: "#05afd1",
            }}
          />
          <div
            style={{
              color: "#b9cbe0",
              fontSize: "24px",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            EasyLink Solar
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: "980px",
            }}
          >
            Website Design &amp; Development
          </div>
          <div
            style={{
              color: "#b9cbe0",
              fontSize: "30px",
              lineHeight: 1.4,
              maxWidth: "900px",
            }}
          >
            Fast, modern, SEO-friendly websites that increase traffic, generate
            leads, and improve customer trust.
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          {["200+ Projects", "98% Satisfaction", "10+ Years", "24/7 Support"].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  padding: "14px 26px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.07)",
                  color: "#ffffff",
                  fontSize: "24px",
                }}
              >
                {chip}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    size,
  );
}
