const SKY = "#7ec8f0";
const SAND = "#e8d08a";
const SAND_DARK = "#d1b66c";
const SAND_EDGE = "#b99a50";
const CLOUD = "#ffffff";

/** Altezza (in pixel logici) da cui inizia il terreno. */
export function groundTopFor(height: number): number {
  return Math.floor(height * 0.6);
}

const CLOUD_SHAPE: readonly string[] = [
  "....XXXX........",
  "..XXXXXXXX.XXX..",
  ".XXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX",
];

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = CLOUD;
  CLOUD_SHAPE.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      if (row[rx] === "X") ctx.fillRect(x + rx, y + ry, 1, 1);
    }
  });
}

/** Pre-disegna cielo e terreno in un canvas offscreen (da ricopiare a ogni frame). */
export function createBackground(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const groundTop = groundTopFor(height);

  ctx.fillStyle = SKY;
  ctx.fillRect(0, 0, width, groundTop);

  drawCloud(ctx, Math.floor(width * 0.15), Math.floor(height * 0.1));
  drawCloud(ctx, Math.floor(width * 0.6), Math.floor(height * 0.2));
  drawCloud(ctx, Math.floor(width * 0.85), Math.floor(height * 0.06));

  ctx.fillStyle = SAND;
  ctx.fillRect(0, groundTop, width, height - groundTop);
  ctx.fillStyle = SAND_EDGE;
  ctx.fillRect(0, groundTop, width, 1);

  // Puntini di sabbia più scura, deterministici.
  ctx.fillStyle = SAND_DARK;
  for (let y = groundTop + 2; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const hash = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) >>> 0;
      if (hash % 53 === 0) ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas;
}
