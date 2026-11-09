import { hideScreen, showScreen } from "./screens.ts";

/**
 * Il videomessaggio sta in public/messaggio.mp4 (sostituisci quel file con il tuo video).
 * Consigliato: mp4 con video H.264 e audio AAC, breve (pochi MB), così parte su ogni telefono.
 */
const VIDEO_URL = "/messaggio.mp4";

export interface Message {
  /** Apre la schermata e fa partire il video. */
  play(): void;
}

/** `onDone` viene chiamato alla fine del video, se lo salti o se il file non si carica. */
export function setupMessage(onDone: () => void): Message {
  const screen = document.getElementById("video-screen") as HTMLElement;
  const video = document.getElementById("message-video") as HTMLVideoElement;
  const skip = document.getElementById("video-skip") as HTMLButtonElement;
  let active = false;

  const finish = (): void => {
    if (!active) return;
    active = false;
    video.pause();
    video.removeAttribute("src");
    video.load();
    hideScreen(screen);
    onDone();
  };

  video.addEventListener("ended", finish);
  video.addEventListener("error", finish); // file mancante o vuoto: si passa direttamente al finale
  skip.addEventListener("click", finish);

  return {
    play(): void {
      active = true;
      showScreen(screen);
      video.src = VIDEO_URL;
      // Se il browser blocca l'avvio automatico, basta premere play sul video.
      void video.play().catch(() => undefined);
    },
  };
}
