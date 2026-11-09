export interface Theme {
  sky: string;
  ground: string;
  groundDark: string;
  edge: string;
  cloud: string;
  /** Notte: stelle e luna al posto delle nuvole. */
  night?: boolean;
}

/** Sfondi dei livelli: aggiungi un tema qui e usalo in levels.ts. */
export const themes = {
  day: { sky: "#7ec8f0", ground: "#e8d08a", groundDark: "#d1b66c", edge: "#b99a50", cloud: "#ffffff" },
  pink: { sky: "#f8b9d0", ground: "#f1d9a0", groundDark: "#dcbf7c", edge: "#c4a45e", cloud: "#fff2f7" },
  sunset: { sky: "#f4a261", ground: "#d9a066", groundDark: "#c48a52", edge: "#a87040", cloud: "#ffd9b3" },
  meadow: { sky: "#9bd8f5", ground: "#8fcf6b", groundDark: "#79b857", edge: "#5e9a41", cloud: "#ffffff" },
  night: { sky: "#1f2a5c", ground: "#3f6b4a", groundDark: "#335a3d", edge: "#27472f", cloud: "#ffffff", night: true },
} as const satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;

/** Altezza (in pixel logici) da cui inizia il terreno. */
export function groundTopFor(height: number): number {
  return Math.floor(height * 0.75);
}

const CLOUD_SHAPE: readonly string[] = [
  "....XXXX........",
  "..XXXXXXXX.XXX..",
  ".XXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX",
];

const MOON_SHAPE: readonly string[] = [
  "..XXXX..",
  ".XXX....",
  "XXX.....",
  "XXX.....",
  "XXX.....",
  ".XXX...X",
  "..XXXXX.",
];

function drawShape(ctx: CanvasRenderingContext2D, shape: readonly string[], x: number, y: number, color: string): void {
  ctx.fillStyle = color;
  shape.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      if (row[rx] === "X") ctx.fillRect(x + rx, y + ry, 1, 1);
    }
  });
}

/** Pre-disegna cielo e terreno in un canvas offscreen (da ricopiare a ogni frame). */
export function createBackground(width: number, height: number, theme: Theme): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const groundTop = groundTopFor(height);

  ctx.fillStyle = theme.sky;
  ctx.fillRect(0, 0, width, groundTop);

  if (theme.night) {
    ctx.fillStyle = "#ffffff";
    for (let y = 0; y < groundTop; y++) {
      for (let x = 0; x < width; x++) {
        const hash = (Math.imul(x, 2654435761) ^ Math.imul(y, 40503)) >>> 0;
        if (hash % 211 === 0) ctx.fillRect(x, y, 1, 1);
      }
    }
    drawShape(ctx, MOON_SHAPE, Math.floor(width * 0.82), Math.floor(height * 0.14), "#fff3b0");
  } else {
    drawShape(ctx, CLOUD_SHAPE, Math.floor(width * 0.12), Math.floor(height * 0.2), theme.cloud);
    drawShape(ctx, CLOUD_SHAPE, Math.floor(width * 0.62), Math.floor(height * 0.3), theme.cloud);
    drawShape(ctx, CLOUD_SHAPE, Math.floor(width * 0.85), Math.floor(height * 0.14), theme.cloud);
  }

  ctx.fillStyle = theme.ground;
  ctx.fillRect(0, groundTop, width, height - groundTop);
  ctx.fillStyle = theme.edge;
  ctx.fillRect(0, groundTop, width, 1);

  // Puntini più scuri sul terreno, deterministici.
  ctx.fillStyle = theme.groundDark;
  for (let y = groundTop + 2; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const hash = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) >>> 0;
      if (hash % 53 === 0) ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas;
}
