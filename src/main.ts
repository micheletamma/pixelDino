import "./style.css";
import { Bubble } from "./bubble.ts";
import { Dino, dinoDefs } from "./dinos.ts";
import { randomPhrase } from "./phrases.ts";
import { createBackground, groundTopFor } from "./scene.ts";
import { setupWelcome } from "./welcome.ts";

/** 1 pixel logico = 4 pixel dello schermo. */
const PIXEL_SCALE = 4;

const canvas = document.getElementById("scene") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const bubble = new Bubble();

let background = document.createElement("canvas");
let groundTop = 0;
let dinos: Dino[] = [];

/** Tiene i piedi dei dinosauri sul terreno. */
function clampY(y: number): number {
  return Math.min(Math.max(y, groundTop + 6), canvas.height - 2);
}

function resize(): void {
  const oldW = canvas.width;
  const oldH = canvas.height;
  canvas.width = Math.ceil(window.innerWidth / PIXEL_SCALE);
  canvas.height = Math.ceil(window.innerHeight / PIXEL_SCALE);
  ctx.imageSmoothingEnabled = false;

  groundTop = groundTopFor(canvas.height);
  background = createBackground(canvas.width, canvas.height);

  if (dinos.length === 0) {
    // Prima volta: i dinosauri partono al centro del terreno, affiancati.
    dinos = dinoDefs.map((def, i) => {
      const spread = (i - (dinoDefs.length - 1) / 2) * 30;
      return new Dino(def, canvas.width / 2 + spread, clampY((groundTop + canvas.height) / 2));
    });
  } else {
    // Ridimensionamento: riproporziona le posizioni.
    for (const dino of dinos) {
      dino.x = (dino.x / oldW) * canvas.width;
      dino.y = clampY((dino.y / oldH) * canvas.height);
    }
  }
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) * canvas.width) / rect.width;
  const y = ((event.clientY - rect.top) * canvas.height) / rect.height;

  dinos.forEach((dino, i) => {
    // Con più dinosauri, ognuno si ferma un po' di lato rispetto al punto cliccato.
    dino.walkTo(x + (i - (dinos.length - 1) / 2) * 24, clampY(y));
  });
  bubble.say(randomPhrase(), event.clientX, event.clientY);
});

setupWelcome();
window.addEventListener("resize", resize);
resize();

let last = performance.now();
function frame(now: number): void {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  ctx.drawImage(background, 0, 0);
  // Dal più lontano al più vicino, per una corretta sovrapposizione.
  const sorted = [...dinos].sort((a, b) => a.y - b.y);
  for (const dino of sorted) {
    dino.update(dt);
    dino.draw(ctx);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
