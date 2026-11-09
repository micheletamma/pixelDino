import type { Palette, Sprite } from "./sprite.ts";
import { spriteSize } from "./sprite.ts";

/** Uno sprite pronto da mostrare: disegno, colori e ingrandimento. */
export interface Art {
  sprite: Sprite;
  palette: Palette;
  /** Ogni pixel dello sprite diventa scale × scale pixel logici (intero). */
  scale: number;
}

export function artSize(art: Art): { width: number; height: number } {
  const { width, height } = spriteSize(art.sprite);
  return { width: width * art.scale, height: height * art.scale };
}

export const heart = (scale = 3): Art => ({
  scale,
  palette: { R: "#e8344e", W: "#ffd0d8" },
  sprite: [
    ".RR...RR.",
    "RWRR.RRRR",
    "RRRRRRRRR",
    "RRRRRRRRR",
    ".RRRRRRR.",
    "..RRRRR..",
    "...RRR...",
    "....R....",
  ],
});

const EGG_COLORS: readonly (readonly [string, string])[] = [
  ["#f7efe0", "#c9a66b"],
  ["#bfe3ff", "#4a90e2"],
  ["#ffd3e8", "#e0589a"],
  ["#d8f2c2", "#5aa83b"],
  ["#fff0a0", "#e0a020"],
];

/** Uovo con macchioline; `variant` sceglie i colori (0–4). */
export const egg = (variant = 0, scale = 3): Art => {
  const [base, spots] = EGG_COLORS[variant % EGG_COLORS.length] ?? EGG_COLORS[0] ?? ["#fff", "#999"];
  return {
    scale,
    palette: { E: base, P: spots, O: "#8a7048" },
    sprite: [
      "...EE...",
      "..EEEE..",
      ".EEEEEE.",
      ".EEPEEE.",
      "EEEEEEEE",
      "EEEEPEEE",
      "EEEEEEEE",
      ".EEEEEE.",
      "..EEEE..",
    ],
  };
};

export const cup = (scale = 4): Art => ({
  scale,
  palette: { B: "#f4f4f4", C: "#6b3e1f", S: "rgba(255,255,255,0.85)" },
  sprite: [
    "...S..S...",
    "....S..S..",
    "BBBBBBBB..",
    "BCCCCCCBBB",
    "BCCCCCCB.B",
    "BCCCCCCBBB",
    ".BCCCCB...",
    "..BBBB....",
  ],
});

export const pizza = (scale = 4): Art => ({
  scale,
  palette: { C: "#c98a3a", Y: "#f6d04d", R: "#d63b2f" },
  sprite: [
    "CCCCCCCCCC",
    ".CYYRYYYC.",
    ".CYYYYRYC.",
    "..CYRYYC..",
    "..CYYYYC..",
    "...CYYC...",
    "...CYRC...",
    "....CC....",
  ],
});
