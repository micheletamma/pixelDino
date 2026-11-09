// Frasi del gioco. Per aggiungerne una basta inserirla nella lista giusta.
// Quando una lista finisce, ricomincia (mescolata) senza ripetere subito la stessa frase.

/** Livello 1: clicca il dinosauro. */
export const tapPhrases: readonly string[] = [
  "Rawr! Mi hai trovato, Annina!",
  "Il tuo dinosauro preferito sono io. Anzi, Bik.",
  "Ahia! Dolcissimo ahia.",
  "Rawr significa «ti voglio bene» in dinosauro.",
  "Hai un tocco da paleontologa!",
  "Sei più bella di un fossile intatto.",
];

/** Livello 2: cuori. */
export const heartPhrases: readonly string[] = [
  "Un cuore! Lo metto in tasca.",
  "Ne ho trovato un altro per te.",
  "Questo vale doppio: è pieno di Bik.",
  "Cuori ovunque, colpa tua.",
  "Ne raccogli più tu di un T-rex affamato.",
  "Occhio, questo batte forte!",
  "Quasi tutti! Sei una raccoglitrice nata.",
  "L'ultimo è sempre il più dolce.",
];

/** Livello 5: uova. */
export const eggPhrases: readonly string[] = [
  "Un uovo! Ora una frittata?",
  "Shh, questo si sta schiudendo.",
  "Attenta, sono delicate come il mio cuore davanti a te.",
  "Questo ha le lentiggini, come un vero dinosauro.",
  "Ne manca uno: forse è finito sotto il divano.",
  "Tutte al sicuro. Brava mamma dino!",
];

/** Livello 4: quando clicchi il dinosauro sbagliato. */
export const decoyPhrases: readonly string[] = [
  "Quello è un impostore!",
  "Nope, è un cugino lontano.",
  "Sbagliato, ma ti perdono con un bacio.",
  "Quasi! Ma no.",
  "Rawr? Non sono io quello giusto!",
  "Riprova: questo non ha il tuo stesso fiuto.",
];

/** Mazzo di frasi: ogni frase esce una volta prima che il mazzo si rimescoli. */
export class Deck {
  private queue: string[] = [];
  private last = "";
  private readonly items: readonly string[];

  constructor(items: readonly string[]) {
    this.items = items;
  }

  next(): string {
    if (this.items.length === 0) return "Rawr!";
    if (this.queue.length === 0) {
      this.queue = [...this.items];
      for (let i = this.queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.queue[i], this.queue[j]] = [this.queue[j] as string, this.queue[i] as string];
      }
      // Evita che la prima frase del nuovo giro sia uguale all'ultima del precedente.
      if (this.queue.length > 1 && this.queue[this.queue.length - 1] === this.last) {
        this.queue.unshift(this.queue.pop() as string);
      }
    }
    this.last = this.queue.pop() as string;
    return this.last;
  }
}
