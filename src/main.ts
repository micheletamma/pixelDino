import "./style.css";
import { Bubble } from "./bubble.ts";
import { Game } from "./game.ts";
import { hideScreen, showScreen } from "./screens.ts";

/** 1 pixel logico = 4 pixel dello schermo. */
const PIXEL_SCALE = 4;

const canvas = document.getElementById("scene") as HTMLCanvasElement;
const welcome = document.getElementById("welcome") as HTMLElement;
const finale = document.getElementById("finale") as HTMLElement;

function fitCanvas(): void {
  canvas.width = Math.ceil(window.innerWidth / PIXEL_SCALE);
  canvas.height = Math.ceil(window.innerHeight / PIXEL_SCALE);
}
fitCanvas();

const game = new Game(
  {
    canvas,
    bubble: new Bubble(),
    hudLevel: document.getElementById("hud-level") as HTMLElement,
    hudHint: document.getElementById("hud-hint") as HTMLElement,
  },
  () => showScreen(finale),
);
game.start(); // il gioco parte dietro la schermata di benvenuto

// Benvenuto: un click (o un tasto) ovunque e si passa al gioco.
const closeWelcome = (): void => {
  hideScreen(welcome);
  window.removeEventListener("keydown", closeWelcome);
};
welcome.addEventListener("click", closeWelcome, { once: true });
window.addEventListener("keydown", closeWelcome);

// Finale: un click e si rigioca da capo.
finale.addEventListener("click", () => {
  hideScreen(finale);
  game.start();
});

canvas.addEventListener("click", (event) => game.click(event.clientX, event.clientY));

window.addEventListener("resize", () => {
  fitCanvas();
  game.refreshBackground();
});

function frame(now: number): void {
  game.draw(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
