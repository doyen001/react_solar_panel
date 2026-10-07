import { describe, expect, it } from "vitest";
import type { GeoTiffRaster } from "@/utils/geotiff";
import { extractRoofOutlinesFromMask } from "@/utils/roofMaskContour";

/**
 * A raster whose bounds/resolution are chosen so pixel area works out to a
 * clean, hand-checkable ~0.0124 m²/pixel (500×500 pixels over a ~55.6 m
 * square): a lone pixel or a handful of them is obviously noise, a few
 * hundred of them is obviously a real roof section.
 */
function makeRaster(fillRects: { x: number; y: number; w: number; h: number }[]): GeoTiffRaster {
  const width = 500;
  const height = 500;
  const bounds = { north: 0.0005, south: 0, east: 0.0005, west: 0 };
  const data = new Float32Array(width * height);

  for (const rect of fillRects) {
    for (let r = rect.y; r < rect.y + rect.h; r++) {
      for (let c = rect.x; c < rect.x + rect.w; c++) {
        data[r * width + c] = 1;
      }
    }
  }

  return { data, width, height, bounds, noDataValue: null };
}

describe("extractRoofOutlinesFromMask", () => {
  it("returns nothing for a mask with no roof pixels", () => {
    const raster = makeRaster([]);
    expect(extractRoofOutlinesFromMask(raster)).toEqual([]);
  });

  it("traces a single outline for one solid roof blob (the simple-house case)", () => {
    const raster = makeRaster([{ x: 100, y: 100, w: 200, h: 200 }]);
    const outlines = extractRoofOutlinesFromMask(raster);

    expect(outlines).toHaveLength(1);
    expect(outlines[0].ring.length).toBeGreaterThanOrEqual(3);
    // 200×200 px at ~0.0124 m²/px ≈ 496 m².
    expect(outlines[0].areaM2).toBeGreaterThan(400);
    expect(outlines[0].areaM2).toBeLessThan(600);
  });

  it("traces every disconnected roof section, not just the largest", () => {
    const raster = makeRaster([
      // Two well-separated solid blocks — e.g. two wings of a commercial
      // roof split by a ridge line the mask doesn't classify as roof.
      { x: 20, y: 20, w: 30, h: 30 }, // 900 px ≈ 11.2 m²
      { x: 400, y: 400, w: 40, h: 20 }, // 800 px ≈ 9.9 m²
    ]);

    const outlines = extractRoofOutlinesFromMask(raster);

    expect(outlines).toHaveLength(2);
    // Largest first.
    expect(outlines[0].areaM2).toBeGreaterThan(outlines[1].areaM2);
  });

  it("discards specks too small to be a real roof section", () => {
    const raster = makeRaster([
      { x: 100, y: 100, w: 200, h: 200 }, // real roof, ~496 m²
      { x: 10, y: 10, w: 2, h: 2 }, // 4 px ≈ 0.05 m² — noise
    ]);

    const outlines = extractRoofOutlinesFromMask(raster);

    expect(outlines).toHaveLength(1);
    expect(outlines[0].areaM2).toBeGreaterThan(400);
  });

  it("treats the GDAL no-data sentinel as not-roof even though its value is > 0", () => {
    const width = 500;
    const height = 500;
    const bounds = { north: 0.0005, south: 0, east: 0.0005, west: 0 };
    const data = new Float32Array(width * height).fill(0);
    for (let r = 100; r < 300; r++) {
      for (let c = 100; c < 300; c++) {
        data[r * width + c] = 9999; // the no-data sentinel, not a real roof value
      }
    }

    const raster: GeoTiffRaster = {
      data,
      width,
      height,
      bounds,
      noDataValue: 9999,
    };

    expect(extractRoofOutlinesFromMask(raster)).toEqual([]);
  });
});
