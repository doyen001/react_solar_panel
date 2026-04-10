import type { GeoTiffRaster } from "@/utils/geotiff";

export type LatLngRing = { lat: number; lng: number }[];

function pixelToLatLng(
  col: number,
  row: number,
  raster: GeoTiffRaster,
): { lat: number; lng: number } {
  const { bounds, width, height } = raster;
  const lng = bounds.west + (col / width) * (bounds.east - bounds.west);
  const lat = bounds.north + (row / height) * (bounds.south - bounds.north);
  return { lat, lng };
}

function latLngToMaskPixel(
  lat: number,
  lng: number,
  raster: GeoTiffRaster,
): { col: number; row: number } {
  const { bounds, width, height } = raster;
  const col = Math.round(
    ((lng - bounds.west) / (bounds.east - bounds.west)) * width,
  );
  const row = Math.round(
    ((lat - bounds.north) / (bounds.south - bounds.north)) * height,
  );
  return { col, row };
}

function isRoof(
  data: GeoTiffRaster["data"],
  idx: number,
  noData: number | null,
): boolean {
  const v = data[idx];
  if (typeof v !== "number") return false;
  if (noData !== null && Math.abs(v - noData) < 1e-6) return false;
  return v > 0;
}

function connectedComponentMask(
  raster: GeoTiffRaster,
  seedCol: number,
  seedRow: number,
): Uint8Array | null {
  const { data, width, height, noDataValue } = raster;
  const n = width * height;
  const idx = seedRow * width + seedCol;
  if (seedCol < 0 || seedCol >= width || seedRow < 0 || seedRow >= height)
    return null;
  if (!isRoof(data, idx, noDataValue)) return null;

  const comp = new Uint8Array(n);
  const q: number[] = [idx];
  comp[idx] = 1;

  while (q.length > 0) {
    const cur = q.pop()!;
    const r = Math.floor(cur / width);
    const c = cur - r * width;
    const nbs = [
      c - 1 + r * width,
      c + 1 + r * width,
      c + (r - 1) * width,
      c + (r + 1) * width,
    ];
    for (const ni of nbs) {
      if (ni < 0 || ni >= n) continue;
      const nr = Math.floor(ni / width);
      const nc = ni - nr * width;
      if (Math.abs(nr - r) + Math.abs(nc - c) !== 1) continue;
      if (comp[ni] || !isRoof(data, ni, noDataValue)) continue;
      comp[ni] = 1;
      q.push(ni);
    }
  }
  return comp;
}

function nearestRoofSeed(
  raster: GeoTiffRaster,
  col: number,
  row: number,
  maxSteps: number,
): { col: number; row: number } | null {
  const { data, width, height, noDataValue } = raster;
  if (col >= 0 && col < width && row >= 0 && row < height) {
    if (isRoof(data, row * width + col, noDataValue)) return { col, row };
  }
  for (let s = 1; s <= maxSteps; s++) {
    for (let dr = -s; dr <= s; dr++) {
      for (const dc of [-s, s]) {
        const c = col + dc;
        const r = row + dr;
        if (
          c >= 0 &&
          c < width &&
          r >= 0 &&
          r < height &&
          isRoof(data, r * width + c, noDataValue)
        )
          return { col: c, row: r };
      }
    }
    for (let dc = -s + 1; dc <= s - 1; dc++) {
      for (const r of [row - s, row + s]) {
        const c = col + dc;
        if (
          c >= 0 &&
          c < width &&
          r >= 0 &&
          r < height &&
          isRoof(data, r * width + c, noDataValue)
        )
          return { col: c, row: r };
      }
    }
  }
  return null;
}

/**
 * Padded Moore–Neighborhood boundary (8-connected). `comp` is 0/1, same size as raster.
 * Returns vertex list in pixel coords (col, row) along the outer boundary.
 */
function mooreBoundaryRing(comp: Uint8Array, width: number, height: number): [number, number][] {
  const pw = width + 2;
  const ph = height + 2;
  const pad = new Uint8Array(pw * ph);
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      pad[(r + 1) * pw + (c + 1)] = comp[r * width + c] ? 1 : 0;
    }
  }

  let sc = -1;
  let sr = -1;
  for (let r = 1; r < ph - 1 && sc < 0; r++) {
    for (let c = 1; c < pw - 1; c++) {
      const i = r * pw + c;
      if (pad[i] && !pad[i - pw]) {
        sc = c;
        sr = r;
        break;
      }
    }
  }
  if (sc < 0) return [];

  const dr = [-1, -1, 0, 1, 1, 1, 0, -1];
  const dc = [0, 1, 1, 1, 0, -1, -1, -1];

  const path: [number, number][] = [];
  let r = sr;
  let c = sc;
  let dir = 7;

  const maxSteps = pw * ph * 8 + 20;
  for (let step = 0; step < maxSteps; step++) {
    path.push([c - 1, r - 1]);

    let found = false;
    for (let k = 0; k < 8; k++) {
      const d = (dir + k) % 8;
      const nr = r + dr[d];
      const nc = c + dc[d];
      const ni = nr * pw + nc;
      if (pad[ni]) {
        r = nr;
        c = nc;
        dir = (d + 6) % 8;
        found = true;
        break;
      }
    }
    if (!found) break;

    if (r === sr && c === sc && path.length > 2) break;
  }

  return path;
}

function douglasPeucker(
  pts: [number, number][],
  eps: number,
): [number, number][] {
  if (pts.length <= 2) return pts;
  let maxD = 0;
  let idx = 0;
  const [sx, sy] = pts[0];
  const [ex, ey] = pts[pts.length - 1];
  for (let i = 1; i < pts.length - 1; i++) {
    const d = pointSegDist(pts[i][0], pts[i][1], sx, sy, ex, ey);
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD > eps) {
    const a = douglasPeucker(pts.slice(0, idx + 1), eps);
    const b = douglasPeucker(pts.slice(idx), eps);
    return [...a.slice(0, -1), ...b];
  }
  return [pts[0], pts[pts.length - 1]];
}

function pointSegDist(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
  const qx = x1 + t * dx;
  const qy = y1 + t * dy;
  return Math.hypot(px - qx, py - qy);
}

function ringToLatLng(ring: [number, number][], raster: GeoTiffRaster): LatLngRing {
  const { bounds, width, height } = raster;
  const out: LatLngRing = [];
  for (const [col, row] of ring) {
    const lng =
      bounds.west + (col / width) * (bounds.east - bounds.west);
    const lat =
      bounds.north + (row / height) * (bounds.south - bounds.north);
    out.push({ lat, lng });
  }
  return out;
}

/**
 * Roof outline traced from the Solar roof mask: connected component under the pin,
 * then Moore boundary in pixel space → simplified → lat/lng.
 * The Building Insights API does not expose roof vertices; this derives a polygon from raster data.
 */
export function extractRoofOutlineFromMask(
  maskRaster: GeoTiffRaster,
  pinLat: number,
  pinLng: number,
): LatLngRing | null {
  const { col, row } = latLngToMaskPixel(pinLat, pinLng, maskRaster);
  const seed = nearestRoofSeed(maskRaster, col, row, 120);
  if (!seed) return null;

  const comp = connectedComponentMask(maskRaster, seed.col, seed.row);
  if (!comp) return null;

  const { width, height } = maskRaster;
  const ringPx = mooreBoundaryRing(comp, width, height);
  if (ringPx.length < 3) return null;

  const simplified = douglasPeucker(ringPx, 1.0);
  if (simplified.length < 3) return null;

  return ringToLatLng(simplified, maskRaster);
}
