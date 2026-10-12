// Pequeño taller de pixel art: todo el arte del prototipo se pinta aquí, en
// lienzos, a partir de plantillas de texto (una letra por píxel) o de trazos
// sencillos. Así el estilo es uno solo y cualquier pieza se puede exportar a PNG
// para retocarla después en Pixelorama o Krita.

export type Paleta = Record<string, string>;

export function lienzo(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.imageSmoothingEnabled = false;
  return { c, g };
}

/** Pinta una plantilla de texto: '.' es transparente; cada letra, un color. */
export function plantilla(g: CanvasRenderingContext2D, filas: string[], pal: Paleta, ox = 0, oy = 0, espejo = false) {
  const ancho = Math.max(...filas.map((f) => f.length));
  filas.forEach((fila, y) => {
    for (let x = 0; x < fila.length; x++) {
      const ch = fila[x];
      if (ch === "." || ch === " ") continue;
      const color = pal[ch];
      if (!color) continue;
      g.fillStyle = color;
      g.fillRect(ox + (espejo ? ancho - 1 - x : x), oy + y, 1, 1);
    }
  });
}

export function rect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
}

/** Generador pseudoaleatorio con semilla: el mismo mapa siempre sale igual. */
export function azar(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Oscurece o aclara un color hex. */
export function tono(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f))));
  const r = ch((n >> 16) & 255), gg = ch((n >> 8) & 255), b = ch(n & 255);
  return "#" + ((1 << 24) | (r << 16) | (gg << 8) | b).toString(16).slice(1);
}

// ── Letras de 3×5 px: rótulos nítidos en el pixel art (sin la borrosidad de fillText) ──
const LETRAS: Record<string, string> = {
  A: "010101111101101", B: "110101110101110", C: "011100100100011", D: "110101101101110", E: "111100110100111",
  F: "111100110100100", G: "011100101101011", H: "101101111101101", I: "111010010010111", J: "001001001101010",
  K: "101101110101101", L: "100100100100111", M: "101111111101101", N: "110101101101101", O: "010101101101010",
  P: "110101110100100", Q: "010101101110011", R: "110101110101101", S: "011100010001110", T: "111010010010010",
  U: "101101101101111", V: "101101101101010", W: "101101111111101", X: "101101010101101", Y: "101101010010010",
  Z: "111001010100111", "0": "111101101101111", "1": "010110010010111", "2": "110001010100111", "3": "110001010001110",
  "4": "101101111001001", "5": "111100110001110", "6": "011100111101111", "7": "111001010010010", "8": "111101111101111",
  "9": "111101111001110", ".": "000000000000010", "-": "000000111000000", "/": "001001010100100", "°": "010101010000000",
  "·": "000000010000000", ":": "000010000010000",
};
const SIN_TILDE: Record<string, string> = { Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U", Ñ: "N", Ü: "U" };

/** Ancho en píxeles de un texto en letras de 3×5 (1 px entre letras). */
export const anchoTexto = (s: string) => Math.max(0, s.length * 4 - 1);

/** Escribe en mayúsculas con letras de 3×5 px. Devuelve el ancho. */
export function texto(g: CanvasRenderingContext2D, s: string, x: number, y: number, color: string) {
  g.fillStyle = color;
  let cx = x;
  for (const ch0 of s.toUpperCase()) {
    const ch = SIN_TILDE[ch0] ?? ch0;
    const m = LETRAS[ch];
    if (m) for (let i = 0; i < 15; i++) if (m[i] === "1") g.fillRect(cx + (i % 3), y + Math.floor(i / 3), 1, 1);
    cx += 4;
  }
  return cx - x - 1;
}
