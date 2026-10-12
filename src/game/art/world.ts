// Arte propio pintado en código: edificios (se exportan a PNG para Tiled con
// tools/exportar-arte.mjs), la fuente y el perro. Paleta cálida de barrio.
import Phaser from "phaser";
import { anchoTexto, azar, lienzo, plantilla, rect, texto, tono } from "../pixel";

export const T = 16;

// Paleta del barrio: tarde de primavera.
export const P = {
  pasto: "#7fb55a", pasto2: "#6fa34e", pasto3: "#92c466", pastoOscuro: "#5a8a40",
  vereda: "#e3cfa6", vereda2: "#d5bd90", veredaBorde: "#b89c6e",
  plaza: "#d99a6c", plaza2: "#c98a5e", plazaJunta: "#b5774e",
  agua: "#6cb6d6", agua2: "#9bd3e6", aguaOscura: "#4a8fb3",
  tronco: "#7a4e33", troncoOscuro: "#55341f",
  hoja: "#4f9a4a", hoja2: "#63b35a", hoja3: "#3c7a3c", hojaLuz: "#8fcf6a",
  contorno: "#2a1d2b",
};

// ── Utilidades de forma ────────────────────────────────────────────────────
function elipse(g: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, color: string) {
  g.fillStyle = color;
  for (let y = -ry; y <= ry; y++) {
    const w = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry)));
    g.fillRect(cx - w, cy + y, w * 2 + 1, 1);
  }
}

function agregar(scene: Phaser.Scene, clave: string, c: HTMLCanvasElement) {
  if (scene.textures.exists(clave)) scene.textures.remove(clave);
  scene.textures.addCanvas(clave, c);
}
function agregarHoja(scene: Phaser.Scene, clave: string, c: HTMLCanvasElement, w: number, h: number) {
  if (scene.textures.exists(clave)) scene.textures.remove(clave);
  scene.textures.addSpriteSheet(clave, c as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
}

export function fuente() {
  // Cuadros 0–2: agua en movimiento. Cuadro 3: seca (así está hasta la boda).
  const W = 56, H = 46;
  const { c, g } = lienzo(W * 4, H);
  for (let f = 0; f < 4; f++) {
    const seca = f === 3;
    const ox = f * W;
    elipse(g, ox + 28, 38, 26, 7, "rgba(30,20,30,0.22)");
    elipse(g, ox + 28, 33, 26, 10, P.contorno);
    elipse(g, ox + 28, 32, 25, 9, "#c9c0b4");
    elipse(g, ox + 28, 30, 22, 7, "#a49a8e");
    elipse(g, ox + 28, 30, 21, 6, seca ? "#8f857a" : P.aguaOscura);
    elipse(g, ox + 28, 29, 20, 5, seca ? "#9c9286" : P.agua);
    if (seca) { for (let i = 0; i < 5; i++) rect(g, ox + 14 + i * 6, 28 + (i % 2) * 2, 2, 1, "#7a7066"); rect(g, ox + 34, 30, 3, 2, "#c98a4b"); }
    else for (let i = 0; i < 6; i++) rect(g, ox + 12 + ((i * 7 + f * 3) % 32), 27 + ((i * 3 + f) % 5), 3, 1, P.agua2);
    // pilar y taza
    rect(g, ox + 25, 14, 6, 16, P.contorno); rect(g, ox + 26, 14, 4, 16, "#d9d1c5"); rect(g, ox + 26, 14, 1, 16, "#f0ebe2");
    elipse(g, ox + 28, 14, 10, 3, P.contorno); elipse(g, ox + 28, 13, 9, 2, "#d9d1c5"); elipse(g, ox + 28, 13, 7, 1, seca ? "#9c9286" : P.agua);
    if (seca) continue;
    // chorro
    const alto = [9, 11, 10][f];
    rect(g, ox + 27, 12 - alto, 2, alto, P.agua2); rect(g, ox + 28, 12 - alto, 1, alto, "#ffffff");
    rect(g, ox + 24 - f, 6 + f, 1, 2, P.agua2); rect(g, ox + 32 + f, 7 - f, 1, 2, P.agua2);
    rect(g, ox + 21 + f, 10, 1, 1, "#ffffff"); rect(g, ox + 34 - f, 9, 1, 1, "#ffffff");
  }
  return { c, W, H };
}

function perro() {
  // Dos cuadros: cola que se mueve.
  const { c, g } = lienzo(32, 14);
  for (let f = 0; f < 2; f++) {
    const ox = f * 16;
    elipse(g, ox + 8, 12, 6, 1, "rgba(30,20,30,0.22)");
    plantilla(g, [
      "..........OO....",
      ".........OccO...",
      f ? "O.......OcEcO..." : ".O......OcEcO...",
      f ? ".O.OOOOOOcccnO.." : "O..OOOOOOcccnO..",
      "..OccccccccOO...",
      "..OccwcccccO....",
      "..OccccccccO....",
      "..OcO.OcO.OcO...",
      "..OO..OO..OO....",
    ], { O: P.contorno, c: "#c98a4b", w: "#f0d2a8", E: P.contorno, n: "#3a2a2a" }, ox, 2);
  }
  return c;
}

// ── Edificios ──────────────────────────────────────────────────────────────
export type Estilo = "tienda" | "civico" | "departamentos" | "casa" | "tribunal" | "mediacion" | "oficina";
export type DefEdificio = {
  clave: string; ancho: number; alto: number; estilo: Estilo;
  techo: string; muro: string; puerta: number; toldo?: string; icono?: Icono; cerrado?: boolean; cartel?: string;
  /** Rótulo con el nombre sobre la fachada (edificios públicos). */
  rotulo?: string;
};
type Icono = "taza" | "sofa" | "moneda" | "anillos" | "corazon" | "balanza" | "manos" | "casa" | "escudo" | "sello" | "lupa" | "columna";

const ICONOS: Record<Icono, string[]> = {
  taza: ["..w.w...", "...w.w..", "OOOOOOO.", "OcccccOO", "OcccccO.O", "OcccccOO", ".OcccO..", "..OOO..."],
  sofa: ["........", ".OOOOOO.", "OcccccccO", "OcOOOOOcO", "OcccccccO", "OOOOOOOOO", ".O.....O."],
  moneda: ["..OOOO..", ".OccccO.", "OccOOccO", "OcOccccO", "OccOOccO", "OccccOcO", ".OcOOcO.", "..OOOO.."],
  anillos: [".OO..OO.", "OccOOccO", "O.cOOc.O", "O..OO..O", "O..OO..O", ".OOcOcOO", "..OO.OO."],
  corazon: [".OO.OO..", "OccOccO.", "OcccccO.", "OcccccO.", ".OcccO..", "..OcO...", "...O...."],
  balanza: ["...O....", "OOOOOOO.", "O..O..O.", "OO.O.OO.", "...O....", "...O....", ".OOOOO.."],
  manos: ["OO....OO", "OcO..OcO", ".OcOOcO.", "..OccO..", "..OccO..", ".OO..OO."],
  casa: ["...OO...", "..OccO..", ".OccccO.", "OccccccO", ".OcOOcO.", ".OcOOcO.", ".OOOOOO."],
  escudo: ["OOOOOOOO", "OccwwccO", "OcwccwcO", "OccwwccO", ".Occcco.", "..OccO..", "...OO..."].map((f) => f.replace("o", "O")),
  sello: ["..OOOO..", "..OccO..", "...OO...", ".OOOOOO.", "OccccccO", "OOOOOOOO", ".wwwwww."],
  lupa: [".OOOO...", "OwwccO..", "OwcccO..", "OcccccO.", ".OOOOOO.", "....OOO.", ".....OOO"],
  columna: ["OOOOOOOO", ".OccccO.", "..OcO...", "..OcO...", "..OcO...", ".OccccO.", "OOOOOOOO"],
};

function ventana(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, encendida: boolean, cortina?: string) {
  rect(g, x - 1, y - 1, w + 2, h + 2, P.contorno);
  rect(g, x, y, w, h, encendida ? "#ffe39a" : "#8fc3d6");
  if (!encendida) { rect(g, x + 1, y + 1, 2, h - 4, "#c6e5ef"); rect(g, x + w - 3, y + 2, 1, 2, "#c6e5ef"); }
  if (cortina) { rect(g, x, y, 3, h, cortina); rect(g, x + w - 3, y, 3, h, cortina); }
  rect(g, x + Math.floor(w / 2), y, 1, h, "#e9e2d6");
  rect(g, x - 2, y + h + 1, w + 4, 2, "#e9e2d6");
}

/**
 * Edificio público de fachada clásica (Municipalidad, Contraloría, tribunales):
 * frontón con escudo, friso con el nombre, columnas con capitel, ventanales
 * altos entre columnas, puerta doble con arco y escalinata.
 */
function civicoClasico(d: DefEdificio, encendido: boolean) {
  const W = d.ancho * T, H = d.alto * T;
  const { c, g } = lienzo(W, H + 4);
  const r = azar(W * 17 + H * 3);
  const O = P.contorno;
  const piedra = d.muro, piedraSombra = tono(d.muro, -0.18), piedraLuz = tono(d.muro, 0.35);
  const fronH = Math.max(22, Math.round(W * 0.16));
  const frisoY = fronH, frisoH = 13;
  const colY = frisoY + frisoH;
  const escalones = 3, escY = H - escalones * 3;
  rect(g, 2, H, W - 4, 4, "rgba(30,20,30,0.22)");
  // Cuerpo
  rect(g, 0, colY, W, escY - colY, O);
  rect(g, 1, colY, W - 2, escY - colY, tono(piedra, -0.06));
  for (let y = colY + 4; y < escY - 2; y += 5) rect(g, 1, y, W - 2, 1, tono(piedra, -0.1)); // hiladas de piedra
  for (let i = 0; i < W * 0.4; i++) rect(g, 1 + Math.floor(r() * (W - 2)), colY + Math.floor(r() * (escY - colY - 2)), 2, 1, tono(piedra, -0.14));
  // Frontón
  for (let y = 0; y < fronH; y++) {
    const half = Math.round((W / 2 - 2) * ((y + 1) / fronH));
    rect(g, W / 2 - half, y, half * 2, 1, O);
    if (half > 2) rect(g, W / 2 - half + 2, y, half * 2 - 4, 1, y < 2 ? O : tono(d.techo, y % 4 === 0 ? -0.08 : 0));
  }
  // Tímpano más claro y su moldura
  for (let y = 6; y < fronH - 3; y++) {
    const half = Math.round((W / 2 - 2) * ((y + 1) / fronH)) - 6;
    if (half > 0) rect(g, W / 2 - half, y, half * 2, 1, tono(d.techo, 0.28));
  }
  rect(g, 0, fronH - 3, W, 3, O); rect(g, 1, fronH - 3, W - 2, 2, piedraLuz);
  // Friso con el nombre
  rect(g, 0, frisoY, W, frisoH, O);
  rect(g, 1, frisoY, W - 2, frisoH - 1, piedra); rect(g, 1, frisoY, W - 2, 1, piedraLuz); rect(g, 1, frisoY + frisoH - 3, W - 2, 2, piedraSombra);
  for (let x = 3; x < W - 3; x += 6) rect(g, x, frisoY + frisoH - 2, 3, 1, piedraLuz); // dentículos
  // Columnas
  const n = Math.max(4, Math.min(8, Math.round(W / 26)));
  const margen = 8, paso = (W - margen * 2 - 8) / (n - 1);
  const puertaX = d.puerta * T + 1;
  const xs: number[] = [];
  for (let i = 0; i < n; i++) xs.push(Math.round(margen + i * paso));
  const altoCol = escY - colY;
  // Ventanales altos entre columnas (de dos hojas, con dintel)
  for (let i = 0; i < n - 1; i++) {
    const a = xs[i] + 8, b = xs[i + 1];
    const vw = Math.min(14, b - a - 4), vx = Math.round((a + b) / 2 - vw / 2);
    if (vw < 6 || Math.abs(vx + vw / 2 - (puertaX + 8)) < 14) continue;
    const filas = Math.max(1, Math.floor((altoCol - 8) / 44));
    for (let fila = 0; fila < filas; fila++) {
    const vy = colY + 6 + fila * 44, vh = Math.min(28, altoCol - 16);
    if (fila > 0 && Math.abs(vx + vw / 2 - (puertaX + 8)) < 18) continue;
    rect(g, vx - 2, vy - 3, vw + 4, 3, O); rect(g, vx - 1, vy - 2, vw + 2, 1, piedraLuz);
    rect(g, vx - 1, vy - 1, vw + 2, vh + 2, O);
    const luz = encendido && r() < 0.65;
    rect(g, vx, vy, vw, vh, luz ? "#ffe39a" : "#7fb3c9");
    if (!luz) { rect(g, vx + 1, vy + 1, 2, vh - 6, "#bfe0ec"); rect(g, vx + vw - 3, vy + 3, 1, 3, "#bfe0ec"); }
    rect(g, vx + Math.floor(vw / 2), vy, 1, vh, piedraSombra);
    rect(g, vx, vy + Math.floor(vh / 2), vw, 1, piedraSombra);
    rect(g, vx - 2, vy + vh + 1, vw + 4, 2, piedraLuz);
    }
  }
  for (const x of xs) {
    if (Math.abs(x + 4 - (puertaX + 8)) < 13) continue;
    rect(g, x - 1, colY, 10, 3, O); rect(g, x, colY, 8, 2, piedraLuz); // capitel
    rect(g, x, colY + 3, 8, altoCol - 6, O);
    rect(g, x + 1, colY + 3, 6, altoCol - 6, "#f1ece2");
    rect(g, x + 1, colY + 3, 1, altoCol - 6, "#ffffff");
    rect(g, x + 5, colY + 3, 2, altoCol - 6, "#d6cfc2");
    for (let y = colY + 6; y < escY - 4; y += 4) rect(g, x + 3, y, 1, 2, "#e2dbcf"); // estrías
    rect(g, x - 1, escY - 3, 10, 3, O); rect(g, x, escY - 3, 8, 2, piedraLuz); // basa
  }
  // Puerta doble con arco
  const pw = 18, ph = Math.min(32, altoCol - 6), px = puertaX - 1, py = escY - ph;
  rect(g, px - 2, py - 4, pw + 4, ph + 4, O);
  rect(g, px - 1, py - 3, pw + 2, 3, piedraLuz);
  rect(g, px, py, pw, ph, tono(d.techo, -0.45));
  rect(g, px + 1, py + 1, pw / 2 - 1, ph - 1, "#5b3a28"); rect(g, px + pw / 2 + 1, py + 1, pw / 2 - 2, ph - 1, "#5b3a28");
  for (const k of [0, 1]) { const ox = px + 2 + k * (pw / 2); rect(g, ox, py + 4, pw / 2 - 4, 8, "#6d4632"); rect(g, ox, py + 15, pw / 2 - 4, ph - 18, "#6d4632"); }
  rect(g, px + pw / 2 - 2, py + ph / 2, 1, 2, "#f2d16b"); rect(g, px + pw / 2 + 1, py + ph / 2, 1, 2, "#f2d16b");
  if (d.cerrado) for (let y = py + 3; y < escY - 2; y += 5) rect(g, px, y, pw, 1, "#3d3340");
  // Escalinata
  for (let k = 0; k < escalones; k++) {
    const inset = (escalones - k) * 2, y = escY + k * 3;
    rect(g, inset, y, W - inset * 2, 3, O);
    rect(g, inset + 1, y, W - inset * 2 - 2, 2, k % 2 ? "#cfc8bb" : "#e2dccf");
  }
  // Nombre en el friso y escudo en el tímpano
  if (d.rotulo) {
    const tw = anchoTexto(d.rotulo);
    texto(g, d.rotulo, Math.round((W - tw) / 2), frisoY + 3, tono(d.techo, -0.55));
  }
  if (d.icono) {
    const lx = Math.round(W / 2 - 9), ly = Math.max(4, fronH - 17);
    rect(g, lx, ly, 18, 13, O); rect(g, lx + 1, ly + 1, 16, 11, "#f6efe2");
    plantilla(g, ICONOS[d.icono], { O, c: d.estilo === "tribunal" ? "#7a7466" : "#3a62b8", w: "#ffffff" }, lx + 4, ly + 2);
  }
  // Mástil con la bandera, a la derecha del frontón
  if (d.estilo === "civico") {
    const fx = W - 10;
    rect(g, fx, fronH - 28, 1, 26, "#3d3340");
    rect(g, fx + 1, fronH - 28, 9, 3, "#3a62b8"); rect(g, fx + 1, fronH - 25, 9, 3, "#f6efe2"); rect(g, fx + 1, fronH - 22, 9, 3, "#d24e4e");
    rect(g, fx + 1, fronH - 28, 3, 3, "#3a62b8"); rect(g, fx + 2, fronH - 27, 1, 1, "#ffffff");
  }
  return c;
}

export function edificio(d: DefEdificio, encendido: boolean) {
  if ((d.estilo === "civico" || d.estilo === "tribunal") && d.rotulo) return civicoClasico(d, encendido);
  const W = d.ancho * T, H = d.alto * T;
  const { c, g } = lienzo(W, H + 4);
  const r = azar(W * 31 + H);
  const civico = d.estilo === "civico" || d.estilo === "tribunal";
  const oficina = d.estilo === "oficina";
  const techoH = d.estilo === "departamentos" ? 12 : oficina ? 14 : civico ? 30 : Math.round(H * 0.42);
  // sombra al pie
  rect(g, 2, H, W - 4, 4, "rgba(30,20,30,0.22)");
  // muro
  rect(g, 0, techoH, W, H - techoH, P.contorno);
  rect(g, 1, techoH, W - 2, H - techoH - 1, d.muro);
  for (let i = 0; i < W * 0.6; i++) rect(g, 1 + Math.floor(r() * (W - 2)), techoH + Math.floor(r() * (H - techoH - 6)), 2, 1, tono(d.muro, -0.05));
  rect(g, 1, H - 7, W - 2, 6, tono(d.muro, -0.25)); // zócalo
  rect(g, 1, techoH, W - 2, 2, tono(d.muro, -0.2)); // sombra del alero
  // techo
  if (d.estilo === "departamentos") {
    rect(g, 0, 0, W, techoH + 2, P.contorno); rect(g, 1, 1, W - 2, techoH, tono(d.techo, 0.05)); rect(g, 1, techoH - 2, W - 2, 2, tono(d.techo, -0.2));
    rect(g, W - 22, 0, 12, 8, P.contorno); rect(g, W - 21, 1, 10, 6, "#9aa3ad"); // estanque de agua
  } else if (oficina) {
    // Edificio público moderno: azotea plana con antepecho, franja de color y equipos en el techo.
    rect(g, 0, 0, W, techoH + 1, P.contorno);
    rect(g, 1, 1, W - 2, techoH - 1, tono(d.muro, -0.12));
    rect(g, 1, 1, W - 2, 2, tono(d.muro, 0.2));
    rect(g, 1, techoH - 4, W - 2, 4, d.techo); rect(g, 1, techoH - 4, W - 2, 1, tono(d.techo, 0.25));
    rect(g, 6, 3, 10, 5, P.contorno); rect(g, 7, 4, 8, 3, "#9aa3ad"); rect(g, 8, 4, 2, 1, "#c6ccd3");
    rect(g, W - 14, 2, 6, 6, P.contorno); rect(g, W - 13, 3, 4, 4, "#b8bfc7");
  } else if (civico) {
    // frontón triangular + cornisa
    rect(g, 0, techoH - 6, W, 6, P.contorno); rect(g, 1, techoH - 5, W - 2, 4, tono(d.techo, 0.2));
    for (let y = 0; y < techoH - 6; y++) {
      const half = Math.round((W / 2) * (y / (techoH - 6)));
      rect(g, W / 2 - half, y, half * 2, 1, y === 0 ? P.contorno : d.techo);
      rect(g, W / 2 - half, y, 1, 1, P.contorno); rect(g, W / 2 + half - 1, y, 1, 1, P.contorno);
    }
    // columnas
    for (let i = 0; i < 4; i++) {
      const cx = Math.round(8 + i * ((W - 22) / 3));
      if (Math.abs(cx + 3 - W / 2) < 12) continue;
      rect(g, cx, techoH, 6, H - techoH - 7, P.contorno); rect(g, cx + 1, techoH, 4, H - techoH - 7, "#f1ece2"); rect(g, cx + 1, techoH, 1, H - techoH - 7, "#ffffff");
    }
  } else {
    rect(g, 0, 0, W, techoH + 1, P.contorno);
    for (let y = 1; y < techoH; y++) {
      const col = y % 5 === 0 ? tono(d.techo, -0.25) : y < 4 ? tono(d.techo, 0.18) : d.techo;
      rect(g, 1, y, W - 2, 1, col);
    }
    for (let y = 5; y < techoH; y += 5) for (let x = (y / 5) % 2 ? 3 : 8; x < W - 2; x += 10) rect(g, x, y - 4, 1, 4, tono(d.techo, -0.18));
    rect(g, 0, techoH - 2, W, 3, tono(d.techo, -0.35));
    if (d.estilo === "casa") { rect(g, W - 26, 0, 8, 10, P.contorno); rect(g, W - 25, 1, 6, 9, "#a65a40"); }
  }
  // puerta
  const px = d.puerta * T + 1, pw = 14, ph = 22;
  rect(g, px - 1, H - ph - 2, pw + 2, ph + 2, P.contorno);
  rect(g, px, H - ph - 1, pw, ph, d.cerrado ? "#5b5560" : tono(d.techo, -0.3));
  if (d.estilo === "tienda") { rect(g, px + 2, H - ph + 1, pw - 4, 9, "#ffe39a"); }
  else { rect(g, px + 2, H - ph + 2, pw - 4, 7, tono(d.techo, -0.15)); rect(g, px + 2, H - ph + 11, pw - 4, 7, tono(d.techo, -0.15)); }
  rect(g, px + pw - 4, H - 12, 2, 2, "#f2d16b");
  rect(g, px - 2, H - 1, pw + 4, 1, "#b8ada0");
  if (d.cerrado) { rect(g, px - 1, H - ph + 4, pw + 2, 2, "#3d3340"); rect(g, px - 1, H - ph + 12, pw + 2, 2, "#3d3340"); }
  // ventanas
  const pisos = d.estilo === "departamentos" ? Math.floor((H - techoH - 30) / 26) + 1 : 1;
  for (let piso = 0; piso < pisos; piso++) {
    const vy = d.estilo === "departamentos" ? techoH + 8 + piso * 26 : H - 28;
    for (let vx = 6; vx < W - 16; vx += 22) {
      if (piso === pisos - 1 && Math.abs(vx + 7 - (px + pw / 2)) < 16) continue;
      if (civico && piso === 0) continue;
      ventana(g, vx, vy, 14, 13, encendido && r() < 0.6, d.estilo === "casa" ? "#e8a0a8" : undefined);
    }
  }
  if (oficina) {
    const vy = techoH + 4;
    rect(g, 4, vy - 1, W - 8, 11, P.contorno);
    for (let vx = 5; vx < W - 5; vx += 8) {
      const w = Math.min(7, W - 5 - vx);
      rect(g, vx, vy, w, 9, encendido && r() < 0.5 ? "#ffe39a" : "#8fc3d6");
      if (!encendido) rect(g, vx + 1, vy + 1, 1, 5, "#c6e5ef");
    }
  }
  if (civico) for (let vx = 14; vx < W - 14; vx += 24) if (Math.abs(vx + 5 - W / 2) > 14) ventana(g, vx, techoH + 6, 10, 14, encendido && r() < 0.4);
  // toldo a rayas
  if (d.toldo) {
    const ty = H - 34, tw = W - 8;
    rect(g, 3, ty - 1, tw + 2, 9, P.contorno);
    for (let x = 0; x < tw; x++) rect(g, 4 + x, ty, 1, 7, Math.floor(x / 5) % 2 ? "#f6efe2" : d.toldo);
    for (let x = 0; x < tw; x += 5) rect(g, 4 + x, ty + 7, 5, 2, Math.floor(x / 5) % 2 ? "#f6efe2" : d.toldo);
  }
  // cartel en un poste (p. ej., «SE VENDE»)
  if (d.cartel) {
    const cx = px + pw + 8;
    rect(g, cx + 9, H - 22, 2, 20, "#5b4038");
    rect(g, cx, H - 32, 20, 12, P.contorno); rect(g, cx + 1, H - 31, 18, 10, "#d24e4e"); rect(g, cx + 1, H - 31, 18, 2, "#e87a6e");
    g.fillStyle = "#ffffff"; g.font = "bold 5px monospace"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(d.cartel, cx + 10, H - 25.5);
  }
  // rótulo con el nombre (letras de 3×5 px)
  if (d.rotulo) {
    const tw = anchoTexto(d.rotulo), bw = Math.min(W - 4, tw + 6);
    const bx = Math.round((W - bw) / 2), by = oficina ? techoH + 17 : civico ? techoH + 2 : techoH + 3;
    rect(g, bx, by, bw, 9, P.contorno); rect(g, bx + 1, by + 1, bw - 2, 7, oficina ? tono(d.techo, -0.15) : "#2f3a4f");
    rect(g, bx + 1, by + 1, bw - 2, 1, oficina ? tono(d.techo, 0.1) : "#45526b");
    texto(g, d.rotulo, Math.round(bx + (bw - tw) / 2), by + 2, oficina ? "#ffffff" : "#f2d16b");
  }
  // letrero con icono
  if (d.icono && !(oficina && d.rotulo)) {
    const lx = d.estilo === "departamentos" ? px - 2 : Math.round(W / 2 - 9), ly = civico ? techoH - 26 : d.estilo === "departamentos" ? H - ph - 15 : techoH + 3;
    rect(g, lx, ly, 18, 13, P.contorno); rect(g, lx + 1, ly + 1, 16, 11, "#f6efe2");
    plantilla(g, ICONOS[d.icono], { O: P.contorno, c: d.toldo ?? d.techo, w: "#ffffff" }, lx + 4, ly + 2);
  }
  // bandera en edificios públicos
  if (civico && d.estilo === "civico") {
    rect(g, W - 12, techoH - 28, 1, 26, "#3d3340");
    rect(g, W - 11, techoH - 28, 8, 3, "#3a62b8"); rect(g, W - 11, techoH - 25, 8, 3, "#f6efe2"); rect(g, W - 11, techoH - 22, 8, 3, "#d24e4e");
    rect(g, W - 11, techoH - 28, 3, 3, "#3a62b8"); rect(g, W - 10, techoH - 27, 1, 1, "#ffffff");
  }
  return c;
}

/**
 * Texturas que siguen pintándose en código porque se animan o cambian con la
 * historia (la fuente, el perro, los pétalos). El resto del barrio viene de los
 * tilesets y del mapa de Tiled.
 */
// ── Objetos de la historia ────────────────────────────────────────────────
function mesaCafe() {
  const { c, g } = lienzo(32, 40);
  elipse(g, 16, 37, 13, 2, "rgba(30,20,30,0.25)");
  // quitasol
  rect(g, 15, 10, 2, 26, P.contorno);
  for (let y = 0; y < 9; y++) { const w = 4 + y * 1.6; rect(g, 16 - w, 2 + y, w * 2, 1, P.contorno); rect(g, 17 - w, 2 + y, w * 2 - 2, 1, y % 2 ? "#f6efe2" : "#d9534f"); }
  for (let x = 3; x < 29; x += 4) rect(g, x, 11, 2, 2, "#d9534f");
  // mesa
  elipse(g, 16, 28, 10, 4, P.contorno); elipse(g, 16, 27, 9, 3, "#e9e2d6"); rect(g, 13, 26, 3, 1, "#ffffff");
  rect(g, 15, 31, 2, 5, "#3d3340");
  // tazas
  rect(g, 10, 24, 3, 3, "#ffffff"); rect(g, 10, 24, 3, 1, "#8a5a3c"); rect(g, 20, 25, 3, 3, "#ffffff"); rect(g, 20, 25, 3, 1, "#8a5a3c");
  return c;
}

function silla() {
  const { c, g } = lienzo(10, 14);
  rect(g, 1, 0, 8, 7, P.contorno); rect(g, 2, 1, 6, 5, "#b3713f");
  rect(g, 1, 7, 8, 3, P.contorno); rect(g, 2, 7, 6, 2, "#c98446");
  rect(g, 1, 10, 1, 4, "#3d3340"); rect(g, 8, 10, 1, 4, "#3d3340");
  return c;
}

/** Sofá de exhibición con su etiqueta de precio. */
function sofa(color: string) {
  const { c, g } = lienzo(36, 26);
  elipse(g, 18, 23, 16, 2, "rgba(30,20,30,0.25)");
  rect(g, 1, 4, 34, 18, P.contorno);
  rect(g, 2, 5, 32, 8, tono(color, -0.1)); rect(g, 2, 5, 32, 2, tono(color, 0.15));
  rect(g, 2, 13, 32, 7, color); rect(g, 17, 13, 1, 7, tono(color, -0.25));
  rect(g, 0, 9, 5, 12, P.contorno); rect(g, 1, 10, 3, 10, tono(color, -0.05));
  rect(g, 31, 9, 5, 12, P.contorno); rect(g, 32, 10, 3, 10, tono(color, -0.05));
  rect(g, 4, 21, 2, 3, "#3d3340"); rect(g, 30, 21, 2, 3, "#3d3340");
  // etiqueta
  rect(g, 26, 0, 9, 6, P.contorno); rect(g, 27, 1, 7, 4, "#fff6c8"); rect(g, 28, 2, 5, 1, "#d24e4e"); rect(g, 29, 3, 3, 1, "#d24e4e");
  return c;
}

function flecha() {
  // Tres cuadros: la flecha que marca el objetivo, rebotando.
  const { c, g } = lienzo(30, 12);
  for (let f = 0; f < 3; f++) plantilla(g, ["OOOOOOOOO", "OyyyyyyyO", ".OyyyyyO.", "..OyyyO..", "...OyO...", "....O...."].map((r) => r), { O: P.contorno, y: f === 1 ? "#ffe39a" : "#f2b53c" }, f * 10, f === 1 ? 1 : 0);
  return c;
}

export function texturasVivas(scene: Phaser.Scene) {
  agregar(scene, "mesa-cafe", mesaCafe());
  agregar(scene, "silla", silla());
  agregar(scene, "sofa-abrazo", sofa("#d46a6a"));
  agregar(scene, "sofa-siesta", sofa("#6f9fc4"));
  agregar(scene, "sofa-imperio", sofa("#8a6fc4"));
  agregarHoja(scene, "flecha", flecha(), 10, 12);
  const ho = lienzo(3, 3); rect(ho.g, 1, 0, 1, 1, "#e08a3c"); rect(ho.g, 0, 1, 3, 1, "#d9752a"); rect(ho.g, 1, 2, 1, 1, "#b85e22");
  agregar(scene, "hoja", ho.c);
  const f = fuente();
  agregarHoja(scene, "fuente", f.c, f.W, f.H);
  agregarHoja(scene, "perro", perro(), 16, 14);
  const pe = lienzo(3, 2); rect(pe.g, 0, 0, 2, 1, "#f2bfd3"); rect(pe.g, 1, 1, 2, 1, "#e7a6c2");
  agregar(scene, "petalo", pe.c);
  const so = lienzo(10, 4); elipse(so.g, 5, 2, 4, 1, "rgba(30,20,30,0.28)");
  agregar(scene, "sombra", so.c);
}
