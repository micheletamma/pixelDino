import { artSize } from "./art.ts";
import type { Bubble } from "./bubble.ts";
import { levels } from "./levels.ts";
import type { LevelSpec, TargetSpec } from "./levels.ts";
import { Deck, decoyPhrases } from "./phrases.ts";
import { createBackground, themes } from "./scene.ts";
import { drawSprite } from "./sprite.ts";
import type { ThemeName } from "./scene.ts";

const HIT_PADDING = 3; // pixel logici di tolleranza intorno ai bersagli
const BOTTOM_MARGIN = 24; // margine di sicurezza in basso (barre del browser, tacca home di iPhone), pixel logici
const TOP_MARGIN = 22; // spazio in alto riservato alla barra con il suggerimento (pixel logici)
const BUBBLE_MARGIN = 4; // pixel logici di distanza minima dal fumetto
const ROUND_DELAY = 800; // ms tra un round e il successivo
const LEVEL_DELAY = 4500; // ms di attesa a fine livello, per leggere l'ultima frase

interface LiveTarget {
  spec: TargetSpec;
  /** Centro del bersaglio come frazione dello schermo, così resiste al ridimensionamento. */
  fx: number;
  fy: number;
  phase: number;
  shakeUntil: number;
}

export interface GameElements {
  canvas: HTMLCanvasElement;
  bubble: Bubble;
  hudLevel: HTMLElement;
  hudHint: HTMLElement;
}

/** Motore dei mini giochi: legge i livelli da levels.ts e gestisce bersagli, frasi e avanzamento. */
export class Game {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly bubble: Bubble;
  private readonly hudLevel: HTMLElement;
  private readonly hudHint: HTMLElement;
  private readonly onFinish: () => void;
  private readonly decoyDeck = new Deck(decoyPhrases);

  private background: HTMLCanvasElement = document.createElement("canvas");
  private backgroundKey = "";
  private levelIndex = 0;
  private roundIndex = 0;
  private targets: LiveTarget[] = [];
  private levelDeck = new Deck([]);
  private collectTotal = 0;
  private locked = false;
  private timer: number | undefined;

  constructor(els: GameElements, onFinish: () => void) {
    this.canvas = els.canvas;
    this.ctx = els.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.bubble = els.bubble;
    this.hudLevel = els.hudLevel;
    this.hudHint = els.hudHint;
    this.onFinish = onFinish;
  }

  private get level(): LevelSpec {
    return levels[this.levelIndex] as LevelSpec;
  }

  start(): void {
    window.clearTimeout(this.timer);
    this.bubble.hide();
    this.levelIndex = 0;
    this.startLevel();
  }

  private startLevel(): void {
    this.roundIndex = 0;
    this.levelDeck = new Deck(this.level.phrases);
    this.bubble.hide();
    this.loadRound();
  }

  private loadRound(): void {
    const round = this.level.rounds[this.roundIndex];
    if (!round) return;
    this.locked = false;
    this.hudLevel.textContent = `Livello ${this.levelIndex + 1} di ${levels.length} · ${this.level.title}`;
    this.hudHint.textContent = round.hint;
    this.collectTotal = round.targets.filter((t) => t.kind === "collect").length;
    this.refreshBackground();

    const w = this.canvas.width;
    const h = this.canvas.height;
    const placed: { x: number; y: number; r: number }[] = [];
    const positions: { x: number; y: number }[] = new Array(round.targets.length);

    // Prima i bersagli a posizione fissa, poi quelli casuali (che li evitano).
    round.targets.forEach((spec, i) => {
      if (!spec.at) return;
      const pos = { x: spec.at[0] * w, y: spec.at[1] * h };
      positions[i] = pos;
      placed.push({ ...pos, r: this.radius(spec) });
    });
    round.targets.forEach((spec, i) => {
      if (spec.at) return;
      const pos = this.findSpot(spec, placed);
      positions[i] = pos;
      placed.push({ ...pos, r: this.radius(spec) });
    });

    this.targets = round.targets.map((spec, i) => ({
      spec,
      fx: (positions[i] as { x: number }).x / w,
      fy: (positions[i] as { y: number }).y / h,
      phase: Math.random() * Math.PI * 2,
      shakeUntil: 0,
    }));
  }

  private radius(spec: TargetSpec): number {
    const { width, height } = artSize(spec.art);
    return Math.max(width, height) / 2;
  }

  /** Cerca un punto libero, rilassando via via la distanza minima e evitando il fumetto visibile. */
  private findSpot(spec: TargetSpec, placed: readonly { x: number; y: number; r: number }[]): { x: number; y: number } {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const size = artSize(spec.art);
    const r = this.radius(spec);
    const minX = Math.min(size.width / 2 + 2, w / 2);
    const maxX = Math.max(w - size.width / 2 - 2, minX);
    const minY = Math.min(TOP_MARGIN + size.height / 2, h / 2);
    const maxY = Math.max(h - size.height / 2 - BOTTOM_MARGIN, minY);

    // Zona del fumetto in pixel logici, con un po' di margine.
    const area = this.bubble.area;
    const k = this.canvas.width / this.canvas.getBoundingClientRect().width;
    const avoid = area
      ? { left: area.left * k - BUBBLE_MARGIN, right: area.right * k + BUBBLE_MARGIN, top: area.top * k - BUBBLE_MARGIN, bottom: area.bottom * k + BUBBLE_MARGIN }
      : null;
    const overlapsBubble = (p: { x: number; y: number }): boolean =>
      avoid !== null &&
      p.x + size.width / 2 > avoid.left &&
      p.x - size.width / 2 < avoid.right &&
      p.y + size.height / 2 > avoid.top &&
      p.y - size.height / 2 < avoid.bottom;

    let spot = { x: minX, y: minY };
    // Prima si evita anche il fumetto; se non c'è proprio posto, si rinuncia a questo vincolo.
    for (const useAvoid of [true, false]) {
      for (let gap = 8; gap >= -10; gap -= 3) {
        for (let tries = 0; tries < 60; tries++) {
          spot = { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * (maxY - minY) };
          if (useAvoid && overlapsBubble(spot)) continue;
          if (placed.every((p) => Math.hypot(p.x - spot.x, p.y - spot.y) >= r + p.r + gap)) return spot;
        }
      }
    }
    return spot;
  }

  /** Va chiamato all'avvio e a ogni ridimensionamento, dopo aver aggiornato la dimensione del canvas. */
  refreshBackground(): void {
    const themeName: ThemeName = this.level.theme;
    const key = `${themeName}:${this.canvas.width}x${this.canvas.height}`;
    if (key === this.backgroundKey) return;
    this.backgroundKey = key;
    this.background = createBackground(this.canvas.width, this.canvas.height, themes[themeName]);
  }

  click(clientX: number, clientY: number): void {
    if (this.locked) return;
    const rect = this.canvas.getBoundingClientRect();
    const k = this.canvas.width / rect.width;
    const x = (clientX - rect.left) * k;
    const y = (clientY - rect.top) * k;

    // Dall'ultimo disegnato (in primo piano) al primo.
    const hit = [...this.sortedTargets()].reverse().find((t) => this.contains(t, x, y));
    if (!hit) {
      this.bubble.hide(); // click sullo sfondo: il fumetto sparisce
      return;
    }
    this.tap(hit, performance.now());
  }

  private contains(t: LiveTarget, x: number, y: number): boolean {
    const { width, height } = artSize(t.spec.art);
    const cx = t.fx * this.canvas.width;
    const cy = t.fy * this.canvas.height;
    return Math.abs(x - cx) <= width / 2 + HIT_PADDING && Math.abs(y - cy) <= height / 2 + HIT_PADDING;
  }

  private tap(target: LiveTarget, now: number): void {
    const { spec } = target;
    const phrase = spec.phrase ?? (spec.kind === "decoy" ? this.decoyDeck.next() : this.levelDeck.next());

    // Il fumetto si sposta sopra il bersaglio cliccato.
    const scale = this.canvas.getBoundingClientRect().width / this.canvas.width;
    const { height } = artSize(spec.art);
    const bx = target.fx * this.canvas.width * scale;
    const by = (target.fy * this.canvas.height - height / 2) * scale;
    this.bubble.say(phrase, bx, by);

    if (spec.kind === "decoy") {
      target.shakeUntil = now + 400;
      return;
    }
    if (spec.kind === "collect") {
      this.targets = this.targets.filter((t) => t !== target);
      if (this.targets.filter((t) => t.spec.kind === "collect").length === 0 && this.collectTotal > 0) this.completeRound();
      return;
    }
    this.completeRound(); // advance
  }

  private completeRound(): void {
    this.locked = true;
    this.targets = [];
    this.roundIndex++;
    const levelDone = this.roundIndex >= this.level.rounds.length;

    if (levelDone) {
      this.hudHint.textContent = this.levelIndex + 1 >= levels.length ? "Hai finito tutti i livelli!" : "Livello superato!";
      this.timer = window.setTimeout(() => {
        this.bubble.hide(); // il nuovo livello parte senza il fumetto del precedente
        this.levelIndex++;
        if (this.levelIndex >= levels.length) {
          this.levelIndex = 0;
          this.onFinish();
        } else {
          this.startLevel();
        }
      }, LEVEL_DELAY);
    } else {
      this.timer = window.setTimeout(() => this.loadRound(), ROUND_DELAY);
    }
  }

  private sortedTargets(): LiveTarget[] {
    return [...this.targets].sort((a, b) => a.fy - b.fy);
  }

  draw(now: number): void {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.background, 0, 0);

    for (const t of this.sortedTargets()) {
      const { art } = t.spec;
      const { width, height } = artSize(art);
      const bob = Math.round(Math.sin((now / 1000) * 3 + t.phase)); // piccolo ondeggiamento
      const shake = now < t.shakeUntil ? Math.round(Math.sin(now / 25) * 2) : 0;
      const left = Math.round(t.fx * this.canvas.width - width / 2) + shake;
      const top = Math.round(t.fy * this.canvas.height - height / 2) + bob * art.scale;
      // I bersagli guardano verso il centro dello schermo.
      drawSprite(ctx, art.sprite, art.palette, left, top, t.fx > 0.5, art.scale);
    }
  }
}
