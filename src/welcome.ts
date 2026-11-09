/** Pagina di benvenuto: si chiude al primo click (o tasto) in qualsiasi punto. */
export function setupWelcome(): void {
  const welcome = document.getElementById("welcome");
  if (!welcome) return;

  const close = (): void => {
    welcome.classList.add("closing");
    welcome.addEventListener("transitionend", () => welcome.remove(), { once: true });
    window.removeEventListener("keydown", close);
  };
  welcome.addEventListener("click", close, { once: true });
  window.addEventListener("keydown", close);
}
