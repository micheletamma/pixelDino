/** Fumetto HTML che si sposta con una transizione CSS verso il punto cliccato. */
export class Bubble {
  private readonly root: HTMLElement;
  private readonly box: HTMLElement;
  private readonly text: HTMLElement;
  private visible = false;

  constructor() {
    this.root = document.getElementById("bubble") as HTMLElement;
    this.box = this.root.querySelector(".bubble-box") as HTMLElement;
    this.text = document.getElementById("bubble-text") as HTMLElement;
  }

  /** Mostra `message` con la codina puntata su (x, y), in pixel dello schermo. */
  say(message: string, x: number, y: number): void {
    this.text.textContent = message;
    if (!this.visible) this.root.hidden = false;

    // Evita che il fumetto esca dallo schermo.
    const half = this.box.offsetWidth / 2 + 8;
    const cx = Math.min(Math.max(x, half), window.innerWidth - half);
    const cy = Math.max(y, this.box.offsetHeight + 28);
    const transform = `translate(${cx}px, ${cy}px)`;

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
}
