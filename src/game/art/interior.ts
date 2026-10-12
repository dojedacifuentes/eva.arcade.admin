// Interiores: pisos y muros (un tileset propio, "casa") y muebles (una imagen
// por mueble). Mismo contorno oscuro que los personajes y el barrio. Se
// exportan a PNG (tools/exportar-arte.mjs) para que Tiled los muestre.
import { anchoTexto, lienzo, rect, tono, plantilla, texto as pxTexto } from "../pixel";

const O = "#2a1d2b";
const T = 16;

function elipse(g: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, color: string) {
  g.fillStyle = color;
  for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry))); g.fillRect(cx - w, cy + y, w * 2 + 1, 1); }
}
const sombra = (g: CanvasRenderingContext2D, cx: number, cy: number, rx: number) => elipse(g, cx, cy, rx, 2, "rgba(30,20,30,0.22)");

// ── Tileset "casa" ─────────────────────────────────────────────────────────
// Índices (8 columnas):
//  0 vacío · 1–2 madera clara · 3–4 madera oscura · 5 baldosa cálida · 6 baldosa gris · 7 alfombra
//  8–11 muro crema (tapa, alto, medio, zócalo) · 12–15 muro verde · 16–19 muro institucional
//  20 muro lateral · 21 muro de abajo · 22 felpudo de salida · 23 piso de madera con luz
export const TEMAS = {
  crema: { tapa: 8, alto: 9, medio: 10, zocalo: 11 },
  verde: { tapa: 12, alto: 13, medio: 14, zocalo: 15 },
  institucional: { tapa: 16, alto: 17, medio: 18, zocalo: 19 },
} as const;
export const PISOS = { madera: [1, 2], oscura: [3, 4], baldosa: [5, 5], gris: [6, 6], alfombra: [7, 7] } as const;
export const MURO_LADO = 20, MURO_ABAJO = 21, FELPUDO = 22;

function madera(g: CanvasRenderingContext2D, x: number, y: number, base: string, v: number) {
  rect(g, x, y, T, T, base);
  for (let f = 0; f < 4; f++) {
    rect(g, x, y + f * 4 + 3, T, 1, tono(base, -0.18));
    const corte = (f * 7 + v * 5) % 14 + 1;
    rect(g, x + corte, y + f * 4, 1, 3, tono(base, -0.14));
  }
  rect(g, x + 2 + v * 3, y + 1, 3, 1, tono(base, 0.12));
}

function muro(g: CanvasRenderingContext2D, x: number, y: number, color: string, parte: "tapa" | "alto" | "medio" | "zocalo") {
  if (parte === "tapa") { rect(g, x, y, T, T, tono(color, -0.55)); rect(g, x, y + 12, T, 4, tono(color, -0.4)); rect(g, x, y + 15, T, 1, O); return; }
  rect(g, x, y, T, T, color);
  for (let i = 0; i < T; i += 4) rect(g, x + i + 1, y, 1, T, tono(color, -0.06)); // papel mural a rayas
  if (parte === "alto") rect(g, x, y, T, 2, tono(color, -0.25));
  if (parte === "medio") rect(g, x, y + 6, T, 1, tono(color, -0.15));
  if (parte === "zocalo") { rect(g, x, y + 10, T, 6, tono(color, -0.38)); rect(g, x, y + 10, T, 1, tono(color, 0.1)); rect(g, x, y + 15, T, 1, O); }
}

export function tilesetCasa() {
  const { c, g } = lienzo(8 * T, 3 * T);
  const pos = (i: number) => [(i % 8) * T, Math.floor(i / 8) * T] as const;
  const en = (i: number, f: (x: number, y: number) => void) => { const [x, y] = pos(i); f(x, y); };
  en(1, (x, y) => madera(g, x, y, "#c98f5a", 0));
  en(2, (x, y) => madera(g, x, y, "#c98f5a", 1));
  en(3, (x, y) => madera(g, x, y, "#8a5a3c", 0));
  en(4, (x, y) => madera(g, x, y, "#8a5a3c", 1));
  en(5, (x, y) => { rect(g, x, y, T, T, "#efd9b0"); rect(g, x, y, 8, 8, "#e4c99b"); rect(g, x + 8, y + 8, 8, 8, "#e4c99b"); rect(g, x, y + 15, T, 1, "#d2b585"); rect(g, x + 15, y, 1, T, "#d2b585"); });
  en(6, (x, y) => { rect(g, x, y, T, T, "#cfd3d6"); rect(g, x, y, 8, 8, "#bfc4c8"); rect(g, x + 8, y + 8, 8, 8, "#bfc4c8"); rect(g, x, y + 15, T, 1, "#a9aeb3"); rect(g, x + 15, y, 1, T, "#a9aeb3"); });
  en(7, (x, y) => { rect(g, x, y, T, T, "#b8574a"); for (let i = 0; i < 4; i++) rect(g, x + i * 4 + 1, y + ((i % 2) ? 3 : 9), 2, 2, "#d27a62"); });
  const temas: [number, string][] = [[8, "#f1dcb8"], [12, "#a9c79a"], [16, "#c9d3dc"]];
  for (const [base, col] of temas) (["tapa", "alto", "medio", "zocalo"] as const).forEach((p, k) => en(base + k, (x, y) => muro(g, x, y, col, p)));
  en(20, (x, y) => { rect(g, x, y, T, T, "#5b4038"); rect(g, x + 6, y, 4, T, "#6d4d43"); rect(g, x, y, 1, T, O); rect(g, x + 15, y, 1, T, O); });
  en(21, (x, y) => { rect(g, x, y, T, T, "#5b4038"); rect(g, x, y, T, 4, "#6d4d43"); rect(g, x, y, T, 1, O); });
  en(22, (x, y) => { madera(g, x, y, "#c98f5a", 0); rect(g, x + 1, y + 3, 14, 10, O); rect(g, x + 2, y + 4, 12, 8, "#7a8f5a"); rect(g, x + 4, y + 6, 8, 1, "#94aa70"); rect(g, x + 4, y + 9, 8, 1, "#94aa70"); });
  en(23, (x, y) => { madera(g, x, y, "#d29c66", 1); });
  return c;
}

// ── Muebles ────────────────────────────────────────────────────────────────
type Mueble = { c: HTMLCanvasElement; solido: number; pasable?: boolean };

function cama(sabana: string): Mueble {
  const { c, g } = lienzo(34, 46);
  sombra(g, 17, 43, 15);
  rect(g, 1, 0, 32, 14, O); rect(g, 2, 1, 30, 12, "#8a5a3c"); rect(g, 2, 1, 30, 2, "#a8744e");
  rect(g, 1, 12, 32, 30, O); rect(g, 2, 13, 30, 28, "#f6efe2");
  rect(g, 4, 14, 11, 7, O); rect(g, 5, 15, 9, 5, "#ffffff"); rect(g, 19, 14, 11, 7, O); rect(g, 20, 15, 9, 5, "#ffffff");
  rect(g, 2, 22, 30, 19, sabana); rect(g, 2, 22, 30, 2, tono(sabana, 0.2)); rect(g, 2, 39, 30, 2, tono(sabana, -0.2));
  for (let x = 6; x < 30; x += 7) rect(g, x, 28, 3, 3, tono(sabana, 0.15));
  rect(g, 2, 41, 2, 3, "#5b4038"); rect(g, 30, 41, 2, 3, "#5b4038");
  return { c, solido: 30 };
}

function cocina(): Mueble {
  const { c, g } = lienzo(64, 36);
  sombra(g, 32, 34, 30);
  // refri
  rect(g, 0, 0, 18, 34, O); rect(g, 1, 1, 16, 32, "#e9edf0"); rect(g, 1, 12, 16, 1, "#b8c0c6"); rect(g, 13, 4, 2, 6, "#9aa3ad"); rect(g, 13, 15, 2, 8, "#9aa3ad");
  rect(g, 3, 3, 5, 4, "#f2b53c"); rect(g, 9, 5, 3, 3, "#e86a7a"); // imanes
  // mueble
  rect(g, 17, 10, 47, 24, O); rect(g, 18, 11, 45, 6, "#d9d3c7"); rect(g, 18, 17, 45, 16, "#c98f5a");
  for (let x = 19; x < 62; x += 11) { rect(g, x, 19, 10, 13, tono("#c98f5a", -0.12)); rect(g, x + 4, 24, 2, 2, "#5b4038"); }
  // fogón y lavaplatos
  rect(g, 22, 12, 14, 4, "#3d3340"); rect(g, 24, 13, 3, 2, "#6b6370"); rect(g, 31, 13, 3, 2, "#6b6370");
  rect(g, 44, 12, 12, 4, "#9fc4d6"); rect(g, 49, 6, 2, 6, "#9aa3ad"); rect(g, 47, 6, 6, 1, "#9aa3ad");
  rect(g, 58, 7, 4, 4, "#e86a7a"); rect(g, 57, 6, 6, 1, O); // tetera
  return { c, solido: 22 };
}

function mesa(): Mueble {
  const { c, g } = lienzo(36, 30);
  sombra(g, 18, 27, 16);
  rect(g, 2, 8, 32, 12, O); rect(g, 3, 9, 30, 9, "#a8744e"); rect(g, 3, 9, 30, 2, "#c4905f");
  rect(g, 5, 20, 2, 7, "#5b4038"); rect(g, 29, 20, 2, 7, "#5b4038");
  // sillas
  for (const sx of [0, 28]) { rect(g, sx, 2, 8, 9, O); rect(g, sx + 1, 3, 6, 7, "#8a5a3c"); }
  rect(g, 14, 5, 6, 5, "#ffffff"); rect(g, 15, 3, 4, 3, "#63b35a"); // florero
  return { c, solido: 14 };
}

function librero(): Mueble {
  const { c, g } = lienzo(32, 40);
  sombra(g, 16, 38, 14);
  rect(g, 0, 0, 32, 38, O); rect(g, 1, 1, 30, 36, "#8a5a3c");
  const libros = ["#d24e4e", "#4f86c6", "#f2b53c", "#5fa37a", "#9a6fc4", "#e8e1d4"];
  for (let f = 0; f < 3; f++) {
    rect(g, 2, 2 + f * 12, 28, 10, "#5b4038");
    for (let x = 3, i = f; x < 28; i++) { const w = 2 + (i % 3); const h = 6 + (i % 4); rect(g, x, 12 + f * 12 - h, w, h, libros[i % libros.length]); x += w + 1; }
    rect(g, 1, 12 + f * 12, 30, 1, "#a8744e");
  }
  return { c, solido: 10 };
}

function planta(grande: boolean): Mueble {
  const { c, g } = lienzo(18, grande ? 34 : 24);
  const h = grande ? 34 : 24;
  sombra(g, 9, h - 2, 7);
  rect(g, 4, h - 11, 10, 9, O); rect(g, 5, h - 11, 8, 8, "#c0673f"); rect(g, 5, h - 11, 8, 2, "#de8a5c");
  const hojas = grande ? [[9, 6, 7, 6], [5, 12, 4, 5], [13, 13, 4, 5], [9, 16, 5, 4]] : [[9, 6, 6, 5], [6, 10, 4, 4], [12, 10, 4, 4]];
  for (const [cx, cy, rx, ry] of hojas) { elipse(g, cx, cy, rx + 1, ry + 1, O); }
  for (const [cx, cy, rx, ry] of hojas) { elipse(g, cx, cy, rx, ry, "#4f9a4a"); elipse(g, cx - 1, cy - 1, Math.max(1, rx - 2), Math.max(1, ry - 2), "#63b35a"); }
  return { c, solido: 6 };
}

function lampara(): Mueble {
  const { c, g } = lienzo(14, 36);
  sombra(g, 7, 34, 5);
  plantilla(g, ["...OOOOOOOO...", "..OyyyyyyyyO..", ".OyyyyyyyyyyO.", "OyyyyyyyyyyyyO", "OOOOOOOOOOOOOO"], { O, y: "#f6e3a8" }, 0, 0);
  rect(g, 6, 5, 2, 26, O); rect(g, 3, 31, 8, 3, O);
  return { c, solido: 4 };
}

function alfombra(color: string): Mueble {
  const { c, g } = lienzo(52, 30);
  rect(g, 0, 0, 52, 30, O); rect(g, 1, 1, 50, 28, color); rect(g, 4, 4, 44, 22, tono(color, 0.18)); rect(g, 7, 7, 38, 16, color);
  for (let x = 2; x < 50; x += 3) { rect(g, x, 0, 1, 1, "#f6efe2"); rect(g, x, 29, 1, 1, "#f6efe2"); }
  return { c, solido: 0, pasable: true };
}

function tele(): Mueble {
  const { c, g } = lienzo(36, 30);
  sombra(g, 18, 28, 16);
  rect(g, 0, 14, 36, 13, O); rect(g, 1, 15, 34, 11, "#8a5a3c"); rect(g, 3, 18, 13, 6, "#5b4038"); rect(g, 20, 18, 13, 6, "#5b4038");
  rect(g, 6, 0, 24, 15, O); rect(g, 7, 1, 22, 12, "#2f3540"); rect(g, 8, 2, 6, 2, "#5a6a7a");
  return { c, solido: 12 };
}

function caja(abierta: boolean): Mueble {
  const { c, g } = lienzo(18, 18);
  sombra(g, 9, 16, 8);
  rect(g, 0, 3, 18, 13, O); rect(g, 1, 4, 16, 11, "#c99a62"); rect(g, 1, 4, 16, 3, "#dcb27a");
  if (abierta) { rect(g, 0, 0, 6, 5, O); rect(g, 1, 1, 4, 3, "#dcb27a"); rect(g, 12, 0, 6, 5, O); rect(g, 13, 1, 4, 3, "#dcb27a"); rect(g, 3, 5, 12, 3, "#7a5a3a"); }
  else { rect(g, 7, 4, 4, 11, "#e8dcc0"); rect(g, 4, 9, 10, 2, "#5b4038"); }
  return { c, solido: 10 };
}

function tocadiscos(): Mueble {
  const { c, g } = lienzo(24, 24);
  sombra(g, 12, 22, 10);
  rect(g, 2, 12, 20, 10, O); rect(g, 3, 13, 18, 8, "#a8744e"); rect(g, 5, 21, 2, 2, "#5b4038"); rect(g, 17, 21, 2, 2, "#5b4038");
  rect(g, 0, 4, 24, 9, O); rect(g, 1, 5, 22, 7, "#5b4038");
  elipse(g, 10, 8, 6, 3, "#1b1420"); elipse(g, 10, 8, 2, 1, "#d24e4e"); rect(g, 18, 5, 1, 5, "#d9d3c7");
  return { c, solido: 8 };
}

function sofaCasa(color: string): Mueble {
  const { c, g } = lienzo(36, 24);
  sombra(g, 18, 22, 16);
  rect(g, 1, 2, 34, 18, O);
  rect(g, 2, 3, 32, 8, tono(color, -0.1)); rect(g, 2, 3, 32, 2, tono(color, 0.15));
  rect(g, 2, 11, 32, 7, color); rect(g, 17, 11, 1, 7, tono(color, -0.25));
  rect(g, 0, 7, 5, 12, O); rect(g, 1, 8, 3, 10, tono(color, -0.05));
  rect(g, 31, 7, 5, 12, O); rect(g, 32, 8, 3, 10, tono(color, -0.05));
  rect(g, 4, 19, 2, 3, "#3d3340"); rect(g, 30, 19, 2, 3, "#3d3340");
  return { c, solido: 10 };
}

function ventana(): Mueble {
  const { c, g } = lienzo(30, 24);
  rect(g, 0, 0, 30, 22, O); rect(g, 1, 1, 28, 20, "#9fd0e6"); rect(g, 1, 13, 28, 8, "#7fb55a"); elipse(g, 8, 13, 5, 3, "#5a8a40");
  rect(g, 14, 1, 2, 20, "#f6efe2"); rect(g, 1, 10, 28, 2, "#f6efe2"); rect(g, 3, 3, 4, 2, "#ffffff");
  rect(g, 0, 0, 5, 22, "#e8a0a8"); rect(g, 25, 0, 5, 22, "#e8a0a8"); rect(g, -1, 21, 32, 3, "#f6efe2");
  return { c, solido: 0, pasable: true };
}

function cuadro(color: string): Mueble {
  const { c, g } = lienzo(18, 14);
  rect(g, 0, 0, 18, 14, O); rect(g, 1, 1, 16, 12, "#c4905f"); rect(g, 3, 3, 12, 8, color); elipse(g, 7, 8, 3, 2, tono(color, -0.3)); rect(g, 11, 4, 3, 3, "#f2d16b");
  return { c, solido: 0, pasable: true };
}

function retratoFamiliar(): Mueble {
  const { c, g } = lienzo(24, 16);
  rect(g, 0, 0, 24, 16, O); rect(g, 1, 1, 22, 14, "#e9d9b6");
  for (const [x, col] of [[5, "#5c3423"], [11, "#b9b1ad"], [17, "#2b2026"]] as [number, string][]) { elipse(g, x, 6, 2, 2, "#eab68f"); rect(g, x - 2, 3, 5, 2, col); rect(g, x - 2, 9, 5, 5, "#4f86c6"); }
  return { c, solido: 0, pasable: true };
}

function escritorioOficial(): Mueble {
  const { c, g } = lienzo(56, 32);
  sombra(g, 28, 30, 26);
  rect(g, 0, 10, 56, 18, O); rect(g, 1, 11, 54, 16, "#7a4e33"); rect(g, 1, 11, 54, 3, "#a06a45");
  rect(g, 4, 16, 14, 9, "#6a432c"); rect(g, 38, 16, 14, 9, "#6a432c");
  rect(g, 20, 2, 16, 10, O); rect(g, 21, 3, 14, 7, "#2f3540"); rect(g, 22, 4, 4, 2, "#5a6a7a"); // pantalla
  rect(g, 40, 6, 10, 5, O); rect(g, 41, 7, 8, 3, "#f6efe2"); rect(g, 6, 7, 8, 4, "#3a2a2a"); // libro de actas y timbre
  return { c, solido: 16 };
}

function bandera(): Mueble {
  const { c, g } = lienzo(16, 44);
  sombra(g, 6, 42, 5);
  rect(g, 5, 2, 2, 38, "#3d3340"); rect(g, 2, 39, 8, 3, "#3d3340"); rect(g, 5, 0, 2, 2, "#f2d16b");
  rect(g, 7, 3, 9, 4, "#3a62b8"); rect(g, 7, 7, 9, 4, "#f6efe2"); rect(g, 7, 11, 9, 4, "#d24e4e"); rect(g, 7, 3, 4, 4, "#3a62b8"); rect(g, 8, 4, 1, 1, "#ffffff");
  return { c, solido: 4 };
}

function bancaEspera(): Mueble {
  const { c, g } = lienzo(40, 20);
  sombra(g, 20, 18, 18);
  for (let x = 0; x < 40; x += 13) { rect(g, x, 2, 12, 12, O); rect(g, x + 1, 3, 10, 5, "#4f86c6"); rect(g, x + 1, 8, 10, 5, "#3f6fa8"); }
  rect(g, 2, 14, 36, 2, "#3d3340"); rect(g, 3, 16, 2, 3, "#3d3340"); rect(g, 35, 16, 2, 3, "#3d3340");
  return { c, solido: 8 };
}

function letrero(texto: string): Mueble {
  const W = Math.max(64, texto.length * 5 + 12);
  const { c, g } = lienzo(W, 14);
  rect(g, 0, 0, W, 14, O); rect(g, 1, 1, W - 2, 12, "#3a4a5e");
  g.fillStyle = "#f6efe2"; g.font = "8px monospace"; g.textBaseline = "middle"; g.textAlign = "center"; g.fillText(texto, W / 2, 7.5);
  return { c, solido: 0, pasable: true };
}

function mesaComedor(): Mueble {
  const { c, g } = lienzo(60, 36);
  sombra(g, 30, 33, 28);
  for (const sx of [6, 22, 38]) { rect(g, sx, 0, 10, 10, O); rect(g, sx + 1, 1, 8, 8, "#8a5a3c"); }
  rect(g, 0, 8, 60, 18, O); rect(g, 1, 9, 58, 15, "#f6efe2"); rect(g, 1, 9, 58, 2, "#ffffff");
  for (let x = 4; x < 56; x += 6) rect(g, x, 22, 3, 2, "#d24e4e"); // mantel con borde
  rect(g, 8, 12, 8, 5, "#ffffff"); rect(g, 9, 13, 6, 3, "#c0673f"); rect(g, 26, 11, 9, 7, O); rect(g, 27, 12, 7, 5, "#a8744e"); rect(g, 28, 13, 5, 2, "#d9a94f");
  rect(g, 44, 12, 8, 5, "#ffffff"); rect(g, 45, 13, 6, 3, "#63b35a");
  rect(g, 4, 26, 2, 8, "#5b4038"); rect(g, 54, 26, 2, 8, "#5b4038");
  return { c, solido: 16 };
}

function sillon(): Mueble {
  const { c, g } = lienzo(26, 26);
  sombra(g, 13, 24, 11);
  rect(g, 1, 0, 24, 22, O); rect(g, 2, 1, 22, 10, "#8a6fc4"); rect(g, 2, 11, 22, 9, "#9a7fd4");
  rect(g, 0, 8, 5, 13, O); rect(g, 1, 9, 3, 11, "#7a5fb4"); rect(g, 21, 8, 5, 13, O); rect(g, 22, 9, 3, 11, "#7a5fb4");
  rect(g, 8, 4, 10, 6, "#f6efe2"); rect(g, 10, 6, 6, 2, "#e8a0a8"); // cojín bordado
  return { c, solido: 10 };
}

function canastoRopa(): Mueble {
  const { c, g } = lienzo(20, 18);
  sombra(g, 10, 16, 9);
  rect(g, 1, 5, 18, 11, O); rect(g, 2, 6, 16, 9, "#d9b27a");
  for (let x = 3; x < 17; x += 3) rect(g, x, 7, 1, 7, "#b8905a");
  rect(g, 3, 1, 6, 6, "#4f86c6"); rect(g, 8, 0, 6, 6, "#e86a7a"); rect(g, 12, 2, 5, 5, "#f2d16b"); rect(g, 3, 1, 14, 1, O);
  return { c, solido: 8 };
}

function platosSucios(): Mueble {
  const { c, g } = lienzo(18, 14);
  for (let i = 0; i < 4; i++) { elipse(g, 9, 11 - i * 2, 7, 2, O); elipse(g, 9, 10 - i * 2, 6, 1, i % 2 ? "#f6efe2" : "#e9e2d6"); }
  rect(g, 4, 4, 2, 1, "#c0673f"); rect(g, 12, 3, 2, 1, "#63b35a"); rect(g, 14, 0, 2, 5, "#9aa3ad");
  return { c, solido: 0, pasable: true };
}

function cuentas(): Mueble {
  const { c, g } = lienzo(18, 14);
  rect(g, 1, 3, 12, 10, O); rect(g, 2, 4, 10, 8, "#ffffff"); for (let y = 6; y < 11; y += 2) rect(g, 3, y, 8, 1, "#9aa3ad");
  rect(g, 6, 0, 11, 10, O); rect(g, 7, 1, 9, 8, "#fff6c8"); rect(g, 8, 3, 6, 1, "#d24e4e"); rect(g, 8, 5, 4, 1, "#9aa3ad");
  return { c, solido: 0, pasable: true };
}

function camaPerro(): Mueble {
  const { c, g } = lienzo(22, 14);
  sombra(g, 11, 12, 10);
  elipse(g, 11, 8, 10, 5, O); elipse(g, 11, 8, 9, 4, "#c0563f"); elipse(g, 11, 8, 6, 2, "#e8a0a8");
  return { c, solido: 0, pasable: true };
}

function letreroBanco(): Mueble {
  const { c, g } = lienzo(100, 14);
  rect(g, 0, 0, 100, 14, O); rect(g, 1, 1, 98, 12, "#3f6b5a");
  g.fillStyle = "#f6efe2"; g.font = "8px monospace"; g.textBaseline = "middle"; g.textAlign = "center"; g.fillText("BANCO DEL PACIFICO", 50, 7.5);
  return { c, solido: 0, pasable: true };
}

function cuna(): Mueble {
  const { c, g } = lienzo(28, 30);
  sombra(g, 14, 28, 12);
  rect(g, 1, 6, 26, 20, O); rect(g, 2, 7, 24, 18, "#f6efe2");
  for (let x = 4; x < 25; x += 4) rect(g, x, 7, 2, 12, "#d9c9a8");
  rect(g, 2, 18, 24, 7, "#9fc4d6"); rect(g, 2, 18, 24, 2, "#c6e5ef");
  rect(g, 1, 2, 3, 26, O); rect(g, 24, 2, 3, 26, O); rect(g, 2, 3, 1, 24, "#c98f5a"); rect(g, 25, 3, 1, 24, "#c98f5a");
  // móvil colgante
  rect(g, 13, 0, 1, 5, O); rect(g, 8, 2, 12, 1, O); rect(g, 7, 3, 3, 3, "#f2d16b"); rect(g, 18, 3, 3, 3, "#e86a7a");
  return { c, solido: 10 };
}

/** La guagua en su cuna o en brazos: un bulto con cara. */
function guagua(): Mueble {
  const { c, g } = lienzo(14, 12);
  elipse(g, 7, 7, 6, 4, O); elipse(g, 7, 7, 5, 3, "#f6e3a8");
  elipse(g, 5, 5, 3, 3, O); elipse(g, 5, 5, 2, 2, "#eab68f");
  rect(g, 4, 5, 1, 1, O); rect(g, 6, 5, 1, 1, O);
  return { c, solido: 0, pasable: true };
}

function mamadera(): Mueble {
  const { c, g } = lienzo(10, 16);
  rect(g, 2, 4, 6, 11, O); rect(g, 3, 5, 4, 9, "#ffffff"); rect(g, 3, 9, 4, 5, "#f6efe2");
  rect(g, 3, 3, 4, 2, "#9fc4d6"); rect(g, 4, 0, 2, 3, "#e8a87a");
  return { c, solido: 0, pasable: true };
}

function panales(): Mueble {
  const { c, g } = lienzo(18, 14);
  for (let i = 0; i < 3; i++) { rect(g, 1, 9 - i * 4, 16, 5, O); rect(g, 2, 10 - i * 4, 14, 3, i % 2 ? "#ffffff" : "#e8f2f6"); rect(g, 7, 10 - i * 4, 4, 3, "#9fc4d6"); }
  return { c, solido: 0, pasable: true };
}

function juguetes(): Mueble {
  const { c, g } = lienzo(22, 12);
  rect(g, 1, 4, 7, 7, O); rect(g, 2, 5, 5, 5, "#d24e4e"); rect(g, 3, 6, 3, 1, "#ffffff");
  elipse(g, 13, 7, 4, 4, O); elipse(g, 13, 7, 3, 3, "#4f86c6"); rect(g, 12, 5, 2, 1, "#ffffff");
  rect(g, 17, 6, 4, 5, O); rect(g, 18, 7, 2, 3, "#f2b53c");
  return { c, solido: 0, pasable: true };
}

// ── Capítulo 5: el Centro de Mediación y lo que se lleva quien se va ──────
/** La mesa de mediación: redonda (nadie se sienta a la cabecera), con pañuelos y galletas. */
function mesaRedonda(): Mueble {
  const { c, g } = lienzo(64, 34);
  sombra(g, 32, 31, 28);
  elipse(g, 32, 16, 31, 12, O); elipse(g, 32, 15, 30, 11, "#d9b27a"); elipse(g, 32, 14, 28, 9, "#e6c48e");
  for (let x = 8; x < 58; x += 9) rect(g, x, 20 + (x % 2), 4, 1, "#c99a62"); // vetas
  rect(g, 30, 26, 4, 6, "#8a5a3c"); rect(g, 24, 30, 16, 2, "#5b4038");
  // pañuelos (siempre a mano)
  rect(g, 10, 9, 12, 7, O); rect(g, 11, 10, 10, 5, "#9fc4d6"); rect(g, 11, 10, 10, 1, "#c6e5ef");
  rect(g, 14, 5, 5, 5, O); rect(g, 15, 5, 3, 5, "#ffffff"); rect(g, 13, 6, 1, 2, "#ffffff");
  // galletas
  elipse(g, 46, 13, 8, 3, O); elipse(g, 46, 12, 7, 2, "#ffffff");
  for (const [x, y] of [[42, 10], [47, 9], [50, 11], [44, 12]]) { rect(g, x, y, 3, 2, O); rect(g, x, y, 2, 1, "#c98446"); }
  // dos vasos de agua
  rect(g, 30, 7, 4, 5, O); rect(g, 31, 8, 2, 3, "#c6e5ef"); rect(g, 36, 9, 4, 5, O); rect(g, 37, 10, 2, 3, "#c6e5ef");
  return { c, solido: 14 };
}

function dispensador(): Mueble {
  const { c, g } = lienzo(16, 34);
  sombra(g, 8, 32, 7);
  rect(g, 3, 0, 10, 13, O); rect(g, 4, 1, 8, 11, "#6cb6d6"); rect(g, 5, 2, 2, 8, "#c6e5ef"); rect(g, 6, 12, 4, 2, O);
  rect(g, 1, 13, 14, 19, O); rect(g, 2, 14, 12, 17, "#f6efe2"); rect(g, 2, 14, 12, 2, "#ffffff");
  rect(g, 4, 18, 3, 3, O); rect(g, 5, 19, 1, 1, "#4f86c6"); rect(g, 9, 18, 3, 3, O); rect(g, 10, 19, 1, 1, "#d24e4e");
  rect(g, 4, 24, 8, 5, "#d9d3c7"); rect(g, 6, 22, 4, 2, "#ffffff"); // vasitos
  return { c, solido: 6 };
}

/** El corcho con dibujos de niños: casas, soles y familias de todos los tamaños. */
function pizarraDibujos(): Mueble {
  const { c, g } = lienzo(46, 26);
  rect(g, 0, 0, 46, 26, O); rect(g, 1, 1, 44, 24, "#c99a62");
  for (let i = 0; i < 30; i++) rect(g, 2 + ((i * 13) % 42), 2 + ((i * 7) % 21), 1, 1, "#b8864f");
  const hoja = (x: number, y: number, fondo: string, f: (x: number, y: number) => void) => { rect(g, x, y, 13, 11, O); rect(g, x + 1, y + 1, 11, 9, fondo); f(x, y); rect(g, x + 6, y, 1, 1, "#d24e4e"); };
  hoja(3, 3, "#ffffff", (x, y) => { rect(g, x + 2, y + 5, 5, 4, "#d24e4e"); rect(g, x + 2, y + 3, 5, 2, "#8a5a3c"); rect(g, x + 8, y + 2, 2, 2, "#f2d16b"); });
  hoja(17, 2, "#fff6c8", (x, y) => { for (const [dx, col] of [[2, "#4f86c6"], [5, "#e86a7a"], [8, "#63b35a"]] as [number, string][]) { rect(g, x + dx, y + 3, 2, 2, "#eab68f"); rect(g, x + dx, y + 5, 2, 3, col); } });
  hoja(31, 4, "#ffffff", (x, y) => { rect(g, x + 3, y + 3, 6, 1, "#f2b53c"); rect(g, x + 5, y + 2, 2, 3, "#f2b53c"); rect(g, x + 2, y + 7, 8, 2, "#63b35a"); });
  hoja(10, 13, "#e8f2f6", (x, y) => { rect(g, x + 2, y + 4, 3, 3, "#c98446"); rect(g, x + 7, y + 3, 3, 4, "#5c3423"); rect(g, x + 5, y + 6, 2, 1, "#e86a7a"); });
  hoja(25, 14, "#ffffff", (x, y) => { rect(g, x + 2, y + 2, 8, 6, "#9fc4d6"); rect(g, x + 4, y + 5, 2, 3, "#2a1d2b"); });
  return { c, solido: 0, pasable: true };
}

function reloj(): Mueble {
  const { c, g } = lienzo(14, 14);
  elipse(g, 7, 7, 6, 6, O); elipse(g, 7, 7, 5, 5, "#f6efe2");
  rect(g, 7, 3, 1, 4, O); rect(g, 7, 7, 3, 1, O); rect(g, 7, 2, 1, 1, "#d24e4e");
  return { c, solido: 0, pasable: true };
}

/** Para quien se va: un colchón en el suelo. */
function colchon(): Mueble {
  const { c, g } = lienzo(36, 18);
  sombra(g, 18, 16, 16);
  rect(g, 0, 4, 36, 11, O); rect(g, 1, 5, 34, 9, "#e8e1d4"); rect(g, 1, 5, 34, 2, "#ffffff");
  for (let x = 5; x < 34; x += 6) rect(g, x, 9, 1, 1, "#c9bfae");
  rect(g, 2, 2, 11, 7, O); rect(g, 3, 3, 9, 5, "#f6efe2"); // almohada
  rect(g, 16, 6, 18, 8, "#9fc4d6"); rect(g, 16, 6, 18, 1, "#c6e5ef"); // frazada arrugada
  return { c, solido: 8 };
}

function maleta(): Mueble {
  const { c, g } = lienzo(18, 22);
  sombra(g, 9, 20, 8);
  rect(g, 6, 0, 6, 4, O); rect(g, 7, 1, 4, 2, "#3d3340");
  rect(g, 1, 3, 16, 16, O); rect(g, 2, 4, 14, 14, "#d24e4e"); rect(g, 2, 4, 14, 2, "#e87a6e");
  rect(g, 5, 4, 1, 14, "#a83a3a"); rect(g, 12, 4, 1, 14, "#a83a3a");
  rect(g, 3, 19, 2, 2, "#3d3340"); rect(g, 13, 19, 2, 2, "#3d3340");
  rect(g, 8, 10, 5, 4, "#f2d16b"); // la etiqueta del viaje a Concepción, todavía
  return { c, solido: 8 };
}

/** Un dibujo del hijo o la hija: la familia, con Pericles más grande que todos. */
function dibujoFamilia(): Mueble {
  const { c, g } = lienzo(20, 16);
  rect(g, 0, 0, 20, 16, O); rect(g, 1, 1, 18, 14, "#ffffff");
  rect(g, 2, 12, 16, 2, "#63b35a"); rect(g, 15, 2, 3, 3, "#f2d16b");
  for (const [x, col] of [[3, "#4f86c6"], [7, "#e2725b"]] as [number, string][]) { rect(g, x, 5, 2, 2, "#eab68f"); rect(g, x, 7, 2, 4, col); }
  rect(g, 5, 9, 1, 3, "#eab68f"); rect(g, 5, 8, 1, 1, "#f2d16b"); // el hijo, chiquitito
  rect(g, 10, 6, 7, 5, "#c98446"); rect(g, 15, 4, 3, 3, "#c98446"); rect(g, 16, 5, 1, 1, O); rect(g, 10, 5, 1, 2, "#c98446"); // Pericles, enorme
  return { c, solido: 0, pasable: true };
}

// ── Capítulo 6: la sala del tribunal ─────────────────────────────────────
/** El estrado de la jueza: madera oscura, alto, con el escudo al frente. */
function estrado(): Mueble {
  const { c, g } = lienzo(96, 44);
  sombra(g, 48, 41, 44);
  rect(g, 0, 10, 96, 30, O); rect(g, 1, 11, 94, 28, "#6a432c"); rect(g, 1, 11, 94, 4, "#8a5a3c");
  for (let x = 6; x < 92; x += 14) { rect(g, x, 18, 10, 18, "#5b3a26"); rect(g, x, 18, 10, 1, "#7a4e33"); }
  rect(g, 40, 17, 16, 18, O); rect(g, 41, 18, 14, 16, "#e9d9b6"); // escudo
  rect(g, 43, 20, 10, 6, "#3a62b8"); rect(g, 43, 26, 10, 6, "#d24e4e"); rect(g, 47, 21, 2, 2, "#ffffff");
  rect(g, 8, 2, 20, 10, O); rect(g, 9, 3, 18, 8, "#f6efe2"); rect(g, 10, 5, 12, 1, "#9aa3ad"); rect(g, 10, 7, 9, 1, "#9aa3ad"); // expediente abierto
  rect(g, 70, 6, 3, 6, "#3d3340"); rect(g, 66, 4, 11, 3, O); rect(g, 67, 4, 9, 2, "#a06a45"); // martillo
  rect(g, 30, 4, 2, 8, "#3d3340"); rect(g, 28, 2, 6, 3, O); // micrófono
  return { c, solido: 18 };
}

/** Mesa de una de las partes, con micrófono y carpetas. */
function mesaParte(color: string): Mueble {
  const { c, g } = lienzo(48, 26);
  sombra(g, 24, 24, 22);
  rect(g, 0, 8, 48, 14, O); rect(g, 1, 9, 46, 12, "#8a5a3c"); rect(g, 1, 9, 46, 3, "#a06a45");
  rect(g, 4, 21, 3, 4, "#3d3340"); rect(g, 41, 21, 3, 4, "#3d3340");
  rect(g, 6, 3, 14, 7, O); rect(g, 7, 4, 12, 5, color); rect(g, 22, 4, 12, 6, O); rect(g, 23, 5, 10, 4, "#f6efe2");
  rect(g, 39, 0, 2, 9, "#3d3340"); rect(g, 37, 0, 6, 2, O);
  return { c, solido: 10 };
}

function escudoPared(): Mueble {
  const { c, g } = lienzo(30, 30);
  rect(g, 0, 0, 30, 30, O); rect(g, 1, 1, 28, 28, "#c9a24f"); rect(g, 3, 3, 24, 24, "#e9d9b6");
  plantilla(g, ["....OOOO....", "...O....O...", "..O......O..", "OOOOOOOOOOOO", ".O.O....O.O.", "O...O..O...O", "OOOOO..OOOOO", ".....OO.....", ".....OO.....", "...OOOOOO..."], { O: O }, 9, 8);
  return { c, solido: 0, pasable: true };
}

// ── Prólogo: la sala de parto ────────────────────────────────────────────
/** Cama de hospital: barandas de metal, sábana celeste, ruedas y la manivela. */
function camaHospital(): Mueble {
  const { c, g } = lienzo(36, 48);
  sombra(g, 18, 45, 16);
  rect(g, 2, 0, 32, 10, O); rect(g, 3, 1, 30, 8, "#e9edf0"); rect(g, 3, 1, 30, 2, "#ffffff"); rect(g, 6, 4, 24, 2, "#b8c0c6");
  rect(g, 1, 9, 34, 33, O); rect(g, 2, 10, 32, 31, "#f6f8fa");
  rect(g, 6, 11, 24, 8, O); rect(g, 7, 12, 22, 6, "#ffffff"); rect(g, 7, 17, 22, 1, "#dfe5ea"); // almohada
  rect(g, 2, 20, 32, 21, "#9fd0e0"); rect(g, 2, 20, 32, 2, "#c6e5ef"); rect(g, 2, 39, 32, 2, "#7fb5c8");
  for (let x = 5; x < 32; x += 6) rect(g, x, 27, 2, 2, "#c6e5ef");
  rect(g, 0, 14, 2, 24, "#9aa3ad"); rect(g, 34, 14, 2, 24, "#9aa3ad"); // barandas
  for (let y = 16; y < 36; y += 5) { rect(g, 0, y, 2, 1, "#6b7480"); rect(g, 34, y, 2, 1, "#6b7480"); }
  rect(g, 4, 42, 4, 4, O); rect(g, 28, 42, 4, 4, O); rect(g, 5, 43, 2, 2, "#6b7480"); rect(g, 29, 43, 2, 2, "#6b7480"); // ruedas
  rect(g, 16, 41, 4, 3, "#6b7480"); // manivela
  return { c, solido: 30 };
}

/** Monitor con la línea del corazón (verde, latiendo) en su pedestal con ruedas. */
function monitor(): Mueble {
  const { c, g } = lienzo(22, 40);
  sombra(g, 11, 38, 9);
  rect(g, 0, 0, 22, 16, O); rect(g, 1, 1, 20, 14, "#3a4a5e"); rect(g, 2, 2, 18, 11, "#0f2a22");
  plantilla(g, ["......o...........", "......o...........", "ooooo.o.o.oooooooo", ".....o.o.o........", "........o........."], { o: "#5fe08a" }, 2, 4);
  rect(g, 16, 13, 3, 1, "#e86a7a"); rect(g, 3, 13, 5, 1, "#f2d16b");
  rect(g, 10, 16, 2, 18, "#9aa3ad"); rect(g, 9, 16, 1, 18, O);
  rect(g, 3, 34, 16, 2, O); rect(g, 3, 36, 3, 2, O); rect(g, 16, 36, 3, 2, O);
  return { c, solido: 4 };
}

/** Biombo de hospital: tres paneles de tela verde agua. */
function biombo(): Mueble {
  const { c, g } = lienzo(40, 34);
  sombra(g, 20, 32, 18);
  for (let k = 0; k < 3; k++) {
    const x = k * 13;
    rect(g, x, 0, 14, 30, O); rect(g, x + 1, 1, 12, 28, "#bfe3d6"); rect(g, x + 1, 1, 12, 2, "#9aa3ad");
    for (let y = 6; y < 28; y += 5) rect(g, x + 2, y, 10, 1, "#a9d4c4");
    rect(g, x + 1, 29, 2, 4, "#6b7480"); rect(g, x + 11, 29, 2, 4, "#6b7480");
  }
  return { c, solido: 6 };
}

/** Cuna de hospital: una cubeta transparente sobre un carrito. */
function cunaHospital(): Mueble {
  const { c, g } = lienzo(26, 26);
  sombra(g, 13, 24, 11);
  rect(g, 2, 2, 22, 12, O); rect(g, 3, 3, 20, 10, "#dff1f7"); rect(g, 3, 3, 20, 2, "#ffffff"); rect(g, 3, 10, 20, 3, "#f6c1cf");
  rect(g, 4, 14, 18, 3, O); rect(g, 5, 14, 16, 2, "#9aa3ad");
  rect(g, 5, 17, 2, 6, "#6b7480"); rect(g, 19, 17, 2, 6, "#6b7480");
  rect(g, 3, 22, 4, 3, O); rect(g, 19, 22, 4, 3, O);
  return { c, solido: 8 };
}

/** Cuadro de una cigüeña con su paquete (decoración obligatoria de toda maternidad). */
function cuadroCiguena(): Mueble {
  const { c, g } = lienzo(28, 22);
  rect(g, 0, 0, 28, 22, O); rect(g, 1, 1, 26, 20, "#c98f5a"); rect(g, 3, 3, 22, 16, "#cfe8f2");
  plantilla(g, [
    "......OO..........",
    ".....OwwO.........",
    ".....OwwOrrr......",
    "......OwwO........",
    "...OOOwwwwOO......",
    "..OwwwwwwwwwO.....",
    "...OOwwwwwOO......",
    ".....O..O.........",
    ".....O..O..OOOO...",
    "....OO..OO.OppO...",
    "...........OppO...",
    "............OO....",
  ], { O, w: "#ffffff", r: "#e8a87a", p: "#f6c1cf" }, 5, 4);
  return { c, solido: 0, pasable: true };
}

// ── Oficinas públicas de Potestas ──────────────────────────────────────────
function letreroPx(texto: string, fondo = "#3a4a5e", tinta = "#f6efe2"): Mueble {
  const tw = anchoTexto(texto);
  const W = Math.max(40, tw + 12);
  const { c, g } = lienzo(W, 13);
  rect(g, 0, 0, W, 13, O); rect(g, 1, 1, W - 2, 11, fondo); rect(g, 1, 1, W - 2, 1, tono(fondo, 0.18));
  rect(g, 2, 2, 1, 1, tono(fondo, 0.35)); rect(g, W - 3, 2, 1, 1, tono(fondo, 0.35));
  pxTexto(g, texto, Math.round((W - tw) / 2), 4, tinta);
  return { c, solido: 0, pasable: true };
}

function archivador(): Mueble {
  const { c, g } = lienzo(16, 30);
  sombra(g, 8, 28, 7);
  rect(g, 0, 0, 16, 27, O); rect(g, 1, 1, 14, 25, "#8a96a3"); rect(g, 1, 1, 14, 2, "#b3bdc7");
  for (let i = 0; i < 3; i++) { rect(g, 2, 4 + i * 8, 12, 7, "#7a8693"); rect(g, 2, 4 + i * 8, 12, 1, "#a3aeb9"); rect(g, 6, 7 + i * 8, 4, 1, O); rect(g, 6, 6 + i * 8, 4, 1, "#d9dee3"); }
  return { c, solido: 6 };
}

function pilaExpedientes(): Mueble {
  const { c, g } = lienzo(18, 18);
  sombra(g, 9, 16, 8);
  const colores = ["#e9d9a6", "#c9d8e8", "#f0c9a8", "#e9d9a6", "#d6e6c4"];
  colores.forEach((col, i) => { const y = 13 - i * 3, x = 1 + (i % 2); rect(g, x, y, 15, 3, O); rect(g, x + 1, y, 13, 2, col); rect(g, x + 10, y, 3, 1, "#d24e4e"); });
  return { c, solido: 6 };
}

function escritorioAbogado(): Mueble {
  const { c, g } = lienzo(48, 30);
  sombra(g, 24, 28, 22);
  rect(g, 0, 10, 48, 16, O); rect(g, 1, 11, 46, 14, "#6a432c"); rect(g, 1, 11, 46, 3, "#8f5d3d");
  rect(g, 3, 16, 12, 8, "#5a3824"); rect(g, 8, 19, 3, 1, "#d9a94f");
  rect(g, 18, 6, 12, 7, O); rect(g, 19, 7, 10, 5, "#f6efe2"); rect(g, 20, 8, 7, 1, "#9aa3ad"); rect(g, 20, 10, 5, 1, "#9aa3ad");
  rect(g, 33, 2, 1, 9, O); rect(g, 30, 1, 8, 4, O); rect(g, 31, 2, 6, 2, "#3f8a5a"); rect(g, 31, 2, 6, 1, "#5fb37a");
  rect(g, 6, 7, 5, 5, O); rect(g, 7, 8, 3, 3, "#ffffff"); rect(g, 7, 8, 3, 1, "#8a5a3c");
  rect(g, 40, 7, 6, 4, O); rect(g, 41, 8, 4, 2, "#d24e4e");
  return { c, solido: 14 };
}

function mostrador(): Mueble {
  const { c, g } = lienzo(64, 34);
  sombra(g, 32, 32, 30);
  rect(g, 0, 14, 64, 16, O); rect(g, 1, 15, 62, 14, "#c9b38f"); rect(g, 1, 15, 62, 3, "#e2d0ae");
  for (let x = 4; x < 60; x += 15) rect(g, x, 20, 11, 7, "#b39d78");
  rect(g, 2, 0, 60, 15, O); rect(g, 3, 1, 58, 13, "#bfe0ec"); rect(g, 4, 2, 2, 9, "#e9f6fb"); rect(g, 30, 2, 1, 11, "#9cc9da");
  rect(g, 12, 11, 12, 3, O); rect(g, 40, 11, 12, 3, O);
  return { c, solido: 14 };
}

function turnos(): Mueble {
  const { c, g } = lienzo(14, 30);
  sombra(g, 7, 28, 6);
  rect(g, 4, 10, 6, 18, O); rect(g, 5, 11, 4, 16, "#5a6a7a");
  rect(g, 0, 0, 14, 12, O); rect(g, 1, 1, 12, 10, "#d24e4e"); rect(g, 2, 2, 10, 5, "#2a1d2b");
  pxTexto(g, "07", 3, 2, "#ff6b5a");
  rect(g, 4, 8, 6, 2, "#f6efe2");
  return { c, solido: 4 };
}

function estanteCodigos(): Mueble {
  const { c, g } = lienzo(32, 34);
  sombra(g, 16, 32, 14);
  rect(g, 0, 0, 32, 31, O); rect(g, 1, 1, 30, 29, "#7a4e33");
  const lomos = ["#b8352f", "#2f5fa8", "#b8352f", "#e9d9a6", "#2f5fa8", "#3f8a5a", "#b8352f", "#d9a94f"];
  for (let f = 0; f < 3; f++) {
    rect(g, 1, 9 + f * 10, 30, 1, O);
    for (let i = 0; i < 7; i++) { const col = lomos[(i + f * 3) % lomos.length]; const h = 7 - ((i + f) % 3 === 0 ? 1 : 0); rect(g, 2 + i * 4, 9 + f * 10 - h, 3, h, col); rect(g, 2 + i * 4, 9 + f * 10 - h + 2, 3, 1, "#f2d16b"); }
  }
  return { c, solido: 8 };
}

function sillaOficina(): Mueble {
  const { c, g } = lienzo(14, 18);
  sombra(g, 7, 16, 6);
  rect(g, 2, 0, 10, 9, O); rect(g, 3, 1, 8, 7, "#2f3540"); rect(g, 3, 1, 8, 2, "#4a5260");
  rect(g, 1, 8, 12, 4, O); rect(g, 2, 9, 10, 2, "#3b414d");
  rect(g, 6, 12, 2, 3, O); rect(g, 2, 15, 10, 1, O);
  return { c, solido: 4 };
}

function maquinaCafe(): Mueble {
  const { c, g } = lienzo(18, 30);
  sombra(g, 9, 28, 8);
  rect(g, 0, 0, 18, 27, O); rect(g, 1, 1, 16, 25, "#3b414d"); rect(g, 2, 2, 14, 8, "#d24e4e");
  pxTexto(g, "CAFE", 2, 4, "#ffffff");
  rect(g, 6, 14, 6, 7, "#1e2228"); rect(g, 8, 18, 3, 3, "#f6efe2");
  rect(g, 13, 12, 2, 2, "#5fb37a");
  return { c, solido: 6 };
}

function pizarraPlazos(): Mueble {
  const { c, g } = lienzo(40, 26);
  rect(g, 0, 0, 40, 24, O); rect(g, 1, 1, 38, 22, "#f6f3ea");
  pxTexto(g, "PLAZOS", 3, 2, "#2f5fa8");
  for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { rect(g, 3 + i * 7, 9 + j * 5, 6, 4, "#d9dee3"); if ((i + j * 2) % 4 === 1) rect(g, 4 + i * 7, 10 + j * 5, 4, 2, "#d24e4e"); }
  rect(g, 36, 4, 2, 2, "#d24e4e");
  return { c, solido: 0, pasable: true };
}

function escudoMunicipal(): Mueble {
  const { c, g } = lienzo(22, 24);
  plantilla(g, [
    "..OOOOOOOOOOOOOOOOOO..",
    ".OyyyyyyyyyyyyyyyyyyO.",
    "OyBBBBBBBBBRRRRRRRRRyO",
    "OyBBBBBBBBBRRRRRRRRRyO",
    "OyBBBwBBBBBRRRRwRRRRyO",
    "OyBBwwwBBBBRRRwwwRRRyO",
    "OyBBBwBBBBBRRRRwRRRRyO",
    "OyBBBBBBBBBRRRRRRRRRyO",
    "OyGGGGGGGGGGGGGGGGGGyO",
    "OyGGGGGGGGGGGGGGGGGGyO",
    "OyGGGwwwGGGGGGwwwGGGyO",
    "OyGGwwwwwGGGGwwwwwGGyO",
    ".OyGGGGGGGGGGGGGGGGyO.",
    ".OyGGGGGGGGGGGGGGGGyO.",
    "..OyGGGGGGGGGGGGGGyO..",
    "...OyGGGGGGGGGGGGyO...",
    "....OyGGGGGGGGGGyO....",
    ".....OyGGGGGGGGyO.....",
    "......OyyGGGGyyO......",
    ".......OOyyyyOO.......",
    ".........OOOO.........",
  ], { O, y: "#f2d16b", B: "#3a62b8", R: "#d24e4e", G: "#3f8a5a", w: "#ffffff" }, 0, 2);
  return { c, solido: 0, pasable: true };
}

function maqueta(): Mueble {
  const { c, g } = lienzo(48, 28);
  sombra(g, 24, 26, 22);
  rect(g, 0, 8, 48, 16, O); rect(g, 1, 9, 46, 14, "#7fb55a");
  rect(g, 1, 14, 46, 4, "#9aa3ad"); rect(g, 1, 15, 46, 1, "#f2d16b");
  for (const [x, col] of [[4, "#e8c9a0"], [12, "#f3dcd0"], [30, "#f6e7a8"], [38, "#e8c9a0"]] as [number, string][]) { rect(g, x, 3, 7, 7, O); rect(g, x + 1, 4, 5, 5, col); rect(g, x + 1, 4, 5, 2, "#a8553c"); }
  rect(g, 20, 4, 7, 6, O); rect(g, 21, 5, 5, 4, "#f3dcd0"); rect(g, 19, 3, 9, 1, "#d24e4e");
  rect(g, 4, 23, 2, 4, "#5b4038"); rect(g, 42, 23, 2, 4, "#5b4038");
  return { c, solido: 12 };
}

function plano(): Mueble {
  const { c, g } = lienzo(40, 26);
  rect(g, 0, 0, 40, 24, O); rect(g, 1, 1, 38, 22, "#f3ead2");
  for (let x = 3; x < 38; x += 6) rect(g, x, 3, 4, 4, "#d9c9a8");
  for (let x = 3; x < 38; x += 6) rect(g, x, 16, 4, 4, "#d9c9a8");
  rect(g, 1, 10, 38, 4, "#e2725b"); rect(g, 1, 11, 38, 1, "#f2a090");
  pxTexto(g, "D.U.P.", 9, 17, "#2a1d2b");
  return { c, solido: 0, pasable: true };
}

function hoyo(): Mueble {
  const { c, g } = lienzo(20, 12);
  elipse(g, 10, 6, 9, 5, O); elipse(g, 10, 6, 8, 4, "#4a3a36"); elipse(g, 10, 7, 6, 2, "#2a1d2b");
  rect(g, 2, 2, 2, 1, "#b8ada0"); rect(g, 15, 9, 3, 1, "#b8ada0");
  return { c, solido: 0, pasable: true };
}

function cono(): Mueble {
  const { c, g } = lienzo(10, 14);
  sombra(g, 5, 12, 4);
  plantilla(g, ["....OO....", "...OooO...", "...OwwO...", "..OooooO..", "..OwwwwO..", ".OooooooO.", "OOOOOOOOOO"], { O, o: "#f07a2a", w: "#ffffff" }, 0, 5);
  return { c, solido: 3 };
}

function vallaPeatonal(): Mueble {
  const { c, g } = lienzo(32, 16);
  sombra(g, 16, 14, 14);
  rect(g, 1, 2, 2, 12, O); rect(g, 29, 2, 2, 12, O);
  rect(g, 0, 3, 32, 6, O);
  for (let x = 1; x < 31; x++) rect(g, x, 4, 1, 4, Math.floor(x / 4) % 2 ? "#ffffff" : "#d24e4e");
  return { c, solido: 4 };
}

export const MUEBLES: Record<string, () => Mueble> = {
  "cama": () => cama("#6f9fc4"),
  "cocina": cocina,
  "mesa": mesa,
  "librero": librero,
  "planta": () => planta(false),
  "planta-grande": () => planta(true),
  "lampara": lampara,
  "alfombra": () => alfombra("#b8574a"),
  "alfombra-verde": () => alfombra("#5f8a5a"),
  "tele": tele,
  "caja": () => caja(false),
  "caja-abierta": () => caja(true),
  "tocadiscos": tocadiscos,
  "sofa-casa-abrazo": () => sofaCasa("#d46a6a"),
  "sofa-casa-siesta": () => sofaCasa("#6f9fc4"),
  "sofa-casa-imperio": () => sofaCasa("#8a6fc4"),
  "sofa-viejo": () => sofaCasa("#9a8f6a"),
  "ventana": ventana,
  "cuadro": () => cuadro("#6cb6d6"),
  "retrato-familiar": retratoFamiliar,
  "escritorio-oficial": escritorioOficial,
  "bandera": bandera,
  "banca-espera": bancaEspera,
  "letrero-registro": () => letrero("REGISTRO CIVIL"),
  "mesa-comedor": mesaComedor,
  "sillon": sillon,
  "canasto-ropa": canastoRopa,
  "platos-sucios": platosSucios,
  "cuentas": cuentas,
  "cama-perro": camaPerro,
  "letrero-banco": letreroBanco,
  "cama-doble": () => cama("#e8a0a8"),
  "cuna": cuna,
  "guagua": guagua,
  "mamadera": mamadera,
  "panales": panales,
  "juguetes": juguetes,
  "mesa-redonda": mesaRedonda,
  "dispensador": dispensador,
  "pizarra-dibujos": pizarraDibujos,
  "reloj": reloj,
  "letrero-mediacion": () => letrero("MEDIACION FAMILIAR"),
  "cuadro-paisaje": () => cuadro("#7fb55a"),
  "colchon": colchon,
  "maleta": maleta,
  "dibujo-familia": dibujoFamilia,
  "estrado": estrado,
  "mesa-parte-a": () => mesaParte("#4f86c6"),
  "mesa-parte-b": () => mesaParte("#d24e4e"),
  "escudo-pared": escudoPared,
  "letrero-tribunal": () => letrero("TRIBUNAL DE FAMILIA"),
  "cama-hospital": camaHospital,
  "monitor": monitor,
  "biombo": biombo,
  "cuna-hospital": cunaHospital,
  "cuadro-ciguena": cuadroCiguena,
  "letrero-maternidad": () => letrero("MATERNIDAD"),
  // Potestas
  "archivador": archivador,
  "pila-expedientes": pilaExpedientes,
  "escritorio-abogado": escritorioAbogado,
  "mostrador": mostrador,
  "turnos": turnos,
  "estante-codigos": estanteCodigos,
  "silla-oficina": sillaOficina,
  "maquina-cafe": maquinaCafe,
  "pizarra-plazos": pizarraPlazos,
  "escudo-municipal": escudoMunicipal,
  "maqueta": maqueta,
  "plano": plano,
  "hoyo": hoyo,
  "cono": cono,
  "valla": vallaPeatonal,
  "letrero-alcaldia": () => letreroPx("ALCALDIA", "#7a2e2e", "#f2d16b"),
  "letrero-partes": () => letreroPx("OFICINA DE PARTES"),
  "letrero-juridica": () => letreroPx("DIRECCION JURIDICA", "#4a3a6e"),
  "letrero-atencion": () => letreroPx("ATENCION CIUDADANA", "#2f6a50"),
  "letrero-fiscalizacion": () => letreroPx("FISCALIZACION", "#7a2e2e"),
  "letrero-contraloria": () => letreroPx("CONTRALORIA REGIONAL", "#2f4a3e", "#f2d16b"),
  "letrero-corte": () => letreroPx("CORTE DE APELACIONES", "#2a1d2b", "#f2d16b"),
  "letrero-juzgado": () => letreroPx("JUZGADO CIVIL", "#2a1d2b", "#f2d16b"),
  "letrero-tc": () => letreroPx("TRIBUNAL CONSTITUCIONAL", "#24346e", "#f2d16b"),
  "letrero-concejo": () => letreroPx("SALA DEL CONCEJO", "#7a2e2e", "#f2d16b"),
};
