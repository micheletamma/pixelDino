// Frasi del gioco. Per aggiungerne una basta inserirla nella lista giusta.
// Quando una lista finisce, ricomincia (mescolata) senza ripetere subito la stessa frase.

/** Livello 1: clicca il dinosauro. */
export const tapPhrases: readonly string[] = [
  "Rawr! Mi hai trovato, Annina, che bell'antenna!",
  "Il tuo dinosauro preferito sono io. Anzi, Bik.",
  "Ahia! Accidenti, mi hai fatto male! Ma ti perdono.",
  "Rawr significa «ti amo» in dinosauro.",
  "Hai un tocco da paleontologa psicologa!",
  "Sei più bella di un orecchio di mucca!",
];

/** Livello 2: cuori. */
export const heartPhrases: readonly string[] = [
  "Se fuori piove, io dentro nevico.",
  "Te l’ho già detto una volta, mi ricordavi il mare, le luci di Natale, gli schiaffi sul sedere e lo spazzolino uguale, la Panda manuale, bruciare in una notte come una cattedrale. ",
  "Se tornassero i tirannosauri io vorrei stare con te, anche sott’acqua con te, mentre ci mangiano eh...",
  "Che mi hai portato via da un lago nero e denso ma era soltanto un brutto sogno se ci penso... che stare insieme a te è come stare sul tetto, dell’universo.",
  "E forse faremo un figlio all’isola del Giglio, sopra una barca a vela fatta coi nostri vestiti tolti.",
  "E sei stupenda quando parli, quando ridi e piangi e sei stupenda quando guardi con quegli occhi grandi e tutto il resto sembra diventare piccolissimo.",
  "Anche se ho gli occhi perduti in mezzo alla giungla con gli alberi neri e il cielo che urla.",
  "Che mi hai tirato su quando sembravo un puzzle e sai disinnescarmi quando faccio il pazzo...che stare insieme a te è come stare su un razzo, Verso lo spazio.",
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
