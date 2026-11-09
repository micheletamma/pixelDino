import { cup, egg, heart, pizza } from "./art.ts";
import type { Art } from "./art.ts";
import { dino } from "./dinos.ts";
import { eggPhrases, heartPhrases, tapPhrases } from "./phrases.ts";
import type { ThemeName } from "./scene.ts";

/**
 * - advance: cliccandolo si passa al round successivo
 * - collect: sparisce al click; quando sono finiti tutti, il round è completato
 * - decoy:   sbagliato, dà una frase buffa e resta lì
 */
export type TargetKind = "advance" | "collect" | "decoy";

export interface TargetSpec {
  art: Art;
  kind: TargetKind;
  /** Posizione fissa come frazione dello schermo [x, y] (0–1). Se manca, è casuale. */
  at?: readonly [number, number];
  /** Frase specifica del bersaglio; se manca si pesca da quelle del livello. */
  phrase?: string;
}

export interface RoundSpec {
  /** Testo mostrato in alto. */
  hint: string;
  targets: readonly TargetSpec[];
}

export interface LevelSpec {
  title: string;
  theme: ThemeName;
  /** Frasi (in sequenza casuale) per i bersagli senza `phrase`. */
  phrases: readonly string[];
  rounds: readonly RoundSpec[];
}

const many = (n: number, make: (i: number) => TargetSpec): TargetSpec[] => Array.from({ length: n }, (_, i) => make(i));

const LEFT = [0.25, 0.55] as const;
const RIGHT = [0.75, 0.55] as const;

/** Livelli del gioco, in ordine. Aggiungi o modifica qui per cambiare i mini giochi. */
export const levels: readonly LevelSpec[] = [
  {
    // 1) Clicca il dinosauro: ogni volta compare in un punto diverso.
    title: "Clicca il dinosauro",
    theme: "day",
    phrases: tapPhrases,
    rounds: [
      { hint: "Clicca il dinosauro!", targets: [{ art: dino("green", 2), kind: "advance" }] },
      { hint: "Bravissima! Di nuovo!", targets: [{ art: dino("green", 2), kind: "advance" }] },
      { hint: "Ancora uno, scappa!", targets: [{ art: dino("green", 2), kind: "advance" }] },
      { hint: "Ultimo, promesso!", targets: [{ art: dino("green", 2), kind: "advance" }] },
    ],
  },
  {
    // 2) Raccogli i cuori.
    title: "Raccogli i cuori",
    theme: "pink",
    phrases: heartPhrases,
    rounds: [{ hint: "Raccogli tutti i cuori!", targets: many(6, () => ({ art: heart(3), kind: "collect" })) }],
  },
  {
    // 3) Scegli: sinistra o destra, ognuno con la sua frase.
    title: "Scegli!",
    theme: "sunset",
    phrases: [],
    rounds: [
      {
        hint: "Colazione a letto o pizza sul divano?",
        targets: [
          { art: cup(4), kind: "advance", at: LEFT, phrase: "Colazione a letto: preparo io, tu ordini. Le briciole le dividiamo." },
          { art: pizza(4), kind: "advance", at: RIGHT, phrase: "Pizza sul divano: scegli tu il film, io rubo il bordo." },
        ],
      },
      {
        hint: "Dinosauro verde o dinosauro viola?",
        targets: [
          { art: dino("green", 2), kind: "advance", at: LEFT, phrase: "Verde! Come una foglia che ti ama." },
          { art: dino("purple", 2), kind: "advance", at: RIGHT, phrase: "Viola! Gusto impeccabile, come sempre." },
        ],
      },
      {
        hint: "Un bacio o un abbraccio da dinosauro?",
        targets: [
          { art: heart(4), kind: "advance", at: LEFT, phrase: "Un bacio! Prenotato, lo riscuoto stasera." },
          { art: dino("yellow", 2), kind: "advance", at: RIGHT, phrase: "Un abbraccio da dinosauro: stretto, ma con le braccia corte." },
        ],
      },
    ],
  },
  {
    // 4) Trova quello giusto: gli altri danno frasi buffe.
    title: "Trova quello giusto",
    theme: "meadow",
    phrases: [],
    rounds: [
      {
        hint: "Trova il dinosauro VIOLA!",
        targets: [
          { art: dino("purple"), kind: "advance", phrase: "Eccolo! Occhio da velociraptor." },
          { art: dino("green"), kind: "decoy" },
          { art: dino("blue"), kind: "decoy" },
          { art: dino("yellow"), kind: "decoy" },
        ],
      },
      {
        hint: "Adesso trova il dinosauro VERDE!",
        targets: [
          { art: dino("green"), kind: "advance", phrase: "Verde! Hai l'occhio lungo, Annina." },
          { art: dino("purple"), kind: "decoy" },
          { art: dino("blue"), kind: "decoy" },
          { art: dino("yellow"), kind: "decoy" },
        ],
      },
    ],
  },
  {
    // 5) Uova da raccogliere, poi un ultimo dinosauro gigante.
    title: "Uova e sorpresa",
    theme: "night",
    phrases: eggPhrases,
    rounds: [
      { hint: "Raccogli tutte le uova!", targets: many(5, (i) => ({ art: egg(i, 3), kind: "collect" })) },
      {
        hint: "Ultimo clic: il dinosauro gigante!",
        targets: [{ art: dino("green", 3), kind: "advance", phrase: "Complimenti, Annina! Hai vinto tutto." }],
      },
    ],
  },
];
