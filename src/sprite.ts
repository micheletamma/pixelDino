// Sprite in pixel art definiti come array di stringhe: ogni carattere è un pixel logico.
// '.' = trasparente, gli altri caratteri vengono cercati nella palette.
export type Sprite = readonly string[];
export type Palette = Readonly<Record<string, string>>;

export function spriteSize(sprite: Sprite): { width: number; height: number } {
  return { width: sprite[0]?.length ?? 0, height: sprite.length };
}

/** Disegna uno sprite con l'angolo in alto a sinistra in (x, y). `flip` lo specchia in orizzontale. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  palette: Palette,
  x: number,
  y: number,
  flip = false,
): void {
  const { width } = spriteSize(sprite);
  sprite.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const color = palette[row[rx] ?? "."];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + (flip ? width - 1 - rx : rx), y + ry, 1, 1);
    }
  });
}
