import { drawSprite, spriteSize } from "./sprite.ts";
import type { Palette, Sprite } from "./sprite.ts";

/** Descrizione di un tipo di dinosauro: sprite (uno per fotogramma di camminata), colori e velocità. */
export interface DinoDef {
  name: string;
  frames: readonly Sprite[];
  palette: Palette;
  /** Velocità in pixel logici al secondo. */
  speed: number;
}

// Gli sprite guardano verso DESTRA: il flip a sinistra è gestito in fase di disegno.
export const greenRex: DinoDef = {
  name: "Rex verde",
  speed: 38,
  palette: {
    G: "#3fae4a", // verde
    D: "#1f6b2c", // verde scuro (bocca)
    L: "#a6e08a", // pancia chiara
    W: "#ffffff", // occhio (bianco)
    K: "#111111", // occhio (pupilla)
  },
  frames: [
    [
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
    ],
    [
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
      ".......GGGG..GGGG.....",
      ".......GGGGG.GGGGG....",
    ],
  ],
};

/** Elenco dei dinosauri presenti nella scena: aggiungi qui nuove definizioni. */
export const dinoDefs: readonly DinoDef[] = [greenRex];

const FRAME_TIME = 0.16; // secondi per fotogramma
const HOP_HEIGHT = 3; // altezza del saltello in pixel logici
const HOPS_PER_SECOND = 3;

export class Dino {
  /** Posizione dei piedi (centro) in pixel logici. */
  x: number;
  y: number;
  private facing: 1 | -1 = 1;
  private target: { x: number; y: number } | null = null;
  private walkTime = 0;
  readonly def: DinoDef;

  constructor(def: DinoDef, x: number, y: number) {
    this.def = def;
    this.x = x;
    this.y = y;
  }

  get isMoving(): boolean {
    return this.target !== null;
  }

  walkTo(x: number, y: number): void {
    this.target = { x, y };
  }

  update(dt: number): void {
    if (!this.target) {
      this.walkTime = 0;
      return;
    }
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (Math.abs(dx) > 0.5) this.facing = dx > 0 ? 1 : -1;

    const step = this.def.speed * dt;
    if (dist <= step) {
      this.x = this.target.x;
      this.y = this.target.y;
      this.target = null;
    } else {
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
    }
    this.walkTime += dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const { frames, palette } = this.def;
    const moving = this.isMoving;
    const frame = moving ? frames[Math.floor(this.walkTime / FRAME_TIME) % frames.length] : frames[0];
    if (!frame) return;
    const { width, height } = spriteSize(frame);
    const hop = moving ? Math.round(Math.abs(Math.sin(this.walkTime * Math.PI * HOPS_PER_SECOND)) * HOP_HEIGHT) : 0;
    const left = Math.round(this.x - width / 2);
    const feet = Math.round(this.y);

    // Ombra a terra (si restringe quando il dinosauro salta).
    ctx.fillStyle = "rgba(120, 90, 40, 0.35)";
    const shadowHalf = Math.floor(width / 2) - hop;
    ctx.fillRect(Math.round(this.x) - shadowHalf, feet, shadowHalf * 2, 1);

    drawSprite(ctx, frame, palette, left, feet - height - hop, this.facing === -1);
  }
}
