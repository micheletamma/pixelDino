// Frasi dei dinosauri. Per aggiungerne una basta inserirla nella lista.
export const phrases: readonly string[] = [
  "Rawr!",
  "Sono un dinosauro.",
  "Estinto? Non direi.",
  "Ho fame. Di foglie. Forse.",
  "Le mie braccia non sono così corte!",
  "Ho sentito un meteorite?",
  "Qui si sta benissimo, nel Cretaceo.",
  "Ciao, umano!",
  "Un altro passo, un altro pixel.",
  "Cerco uova. Non le mie.",
];

export function randomPhrase(): string {
  return phrases[Math.floor(Math.random() * phrases.length)] ?? "Rawr!";
}
