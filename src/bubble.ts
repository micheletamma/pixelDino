/** Dopo questo tempo (ms) il fumetto sparisce da solo. */
const HIDE_AFTER = 6000;

/** Rettangolo in pixel dello schermo. */
export interface Area {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Fumetto HTML che si sposta con una transizione CSS verso il bersaglio cliccato. */
export class Bubble {
  private readonly root: HTMLElement;
  private readonly box: HTMLElement;
  private readonly text: HTMLElement;
  private visible = false;
  private hideTimer: number | undefined;
  /** Zona occupata dal fumetto (codina compresa); null se non è visibile. */
  area: Area | null = null;

  constructor() {
    this.root = document.getElementById("bubble") as HTMLElement;
    this.box = this.root.querySelector(".bubble-box") as HTMLElement;
    this.text = document.getElementById("bubble-text") as HTMLElement;
  }

  /** Mostra `message` con la codina puntata su (x, y), in pixel dello schermo. */
  say(message: string, x: number, y: number): void {
    this.text.textContent = message;
    window.clearTimeout(this.hideTimer);
    this.hideTimer = window.setTimeout(() => this.hide(), HIDE_AFTER);
    if (!this.visible) this.root.hidden = false;

    // Evita che il fumetto esca dallo schermo.
    const half = this.box.offsetWidth / 2 + 8;
    const cx = Math.min(Math.max(x, half), window.innerWidth - half);
    const cy = Math.max(y, this.box.offsetHeight + 28);
    const transform = `translate(${cx}px, ${cy}px)`;
    const w = this.box.offsetWidth;
    const h = this.box.offsetHeight;
    // Il riquadro sta sopra il punto (14px di distanza + codina): vedi .bubble-box in style.css.
    this.area = { left: cx - w / 2, right: cx + w / 2, top: cy - 14 - h, bottom: cy };

    if (!this.visible) {
      // Prima apparizione: nessuna transizione, compare già nel punto giusto.
      this.root.style.transition = "none";
      this.root.style.transform = transform;
      void this.root.offsetWidth; // forza il reflow prima di riattivare la transizione
      this.root.style.transition = "";
      this.visible = true;
      return;
    }
    this.root.style.transform = transform;
  }

  hide(): void {
    window.clearTimeout(this.hideTimer);
    this.area = null;
    this.root.hidden = true;
    this.visible = false;
  }
}
