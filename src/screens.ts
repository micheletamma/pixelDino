/** Mostra una schermata a tutto schermo con dissolvenza. */
export function showScreen(el: HTMLElement): void {
  el.hidden = false;
  el.classList.add("closing");
  void el.offsetWidth; // reflow: parte la dissolvenza in entrata
  el.classList.remove("closing");
}

/** Nasconde una schermata con dissolvenza. */
export function hideScreen(el: HTMLElement): void {
  el.classList.add("closing");
  el.addEventListener(
    "transitionend",
    () => {
      if (el.classList.contains("closing")) el.hidden = true;
    },
    { once: true },
  );
}
