import type { Art } from "./art.ts";
import type { Sprite } from "./sprite.ts";

// Lo sprite guarda verso DESTRA (il flip è gestito in fase di disegno).
// G = corpo, D = scuro (bocca), L = pancia, W/K = occhio.
const dinoSprite: Sprite = [
  "..............GGGGGG..",
  ".............GGGGGGGG.",
  ".............GGGWKGGG.",
  ".............GGGGGGGG.",
  ".............GGGGGGGG.",
  ".............GGGGDDDD.",
  ".............GGGGGG...",
  "G...........GGGGGGG...",
  "GG.........GGGGGGGG.G.",
  ".GGG.....GGGGGGGGGGGG.",
  "..GGGGGGGGGGGGGGGGGGG.",
  "...GGGGGGGGGGGGGGGGG..",
  "....GGGGLLLLLLLGGGG...",
  ".....GGGLLLLLLLGGG....",
  "......GGGG....GGGG....",
  "......GGGGG...GGGGG...",
];

/** Colori disponibili: per un nuovo dinosauro aggiungi una voce qui. */
export const dinoColors = {
  green: { G: "#3fae4a", D: "#1f6b2c", L: "#a6e08a" },
  pink: { G: "#f27ab0", D: "#a8346f", L: "#ffd1e6" },
  blue: { G: "#4a90e2", D: "#1f4f8f", L: "#b9d8ff" },
  yellow: { G: "#f2c744", D: "#a8821a", L: "#fff0a0" },
} as const;

export type DinoColor = keyof typeof dinoColors;

export function dino(color: DinoColor, scale = 1): Art {
  return {
    sprite: dinoSprite,
    scale,
    palette: { ...dinoColors[color], W: "#ffffff", K: "#111111" },
  };
}
