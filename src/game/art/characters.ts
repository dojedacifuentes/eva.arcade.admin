// Personajes: un solo cuerpo de 16×24 px en tres vistas (frente, espalda,
// perfil), con capas de peinado y colores intercambiables. El jugador, la
// pareja y cada NPC salen del mismo molde: así el estilo es consistente y
// crear un personaje nuevo es elegir colores, no dibujar de cero.
import Phaser from "phaser";
import { lienzo, plantilla, tono, type Paleta } from "../pixel";

export const FW = 16;
export const FH = 24;

export type Peinado = "corto" | "largo" | "mono" | "rizado";
export type Apariencia = {
  piel: string;
  pelo: string;
  peinado: Peinado;
  polera: string;
  pantalon: string;
  zapatos?: string;
};

export const PIELES = ["#f7d7bd", "#eab68f", "#c98d63", "#94603f", "#5f3b27"];
export const PELOS = ["#2b2026", "#5c3423", "#9a4a2c", "#d9a94f", "#b9b1ad", "#3d4a7a"];
export const ROPAS = ["#e2725b", "#f0b44c", "#5fa37a", "#4f86c6", "#9a6fc4", "#e8e1d4", "#3b3f4f", "#d46a9b"];

// ── Cuerpo ─────────────────────────────────────────────────────────────────
const CABEZA_FRENTE = [
  "................", "................", "................",
  ".....OOOOOO.....",
  "....OSSSSSSO....",
  "...OSSSSSSSSO...",
  "...OSSSSSSSSO...",
  "...OSSSSSSSSO...",
  "...OSESSSSESO...",
  "...OSESSSSESO...",
  "...OkSSSSSSkO...",
  "....OsSSSSsO....",
  ".....OOSSOO.....",
];
const CABEZA_ESPALDA = CABEZA_FRENTE.map((f) => f.replace(/E/g, "S").replace(/k/g, "S"));
const CABEZA_PERFIL = [
  "................", "................", "................",
  ".....OOOOOO.....",
  "....OSSSSSSO....",
  "...OSSSSSSSSO...",
  "...OSSSSSSSSO...",
  "...OSSSSSSSSO...",
  "...OSSSSSSESO...",
  "...OSSSSSSESO...",
  "...OSSSSSSSkO...",
  "....OsSSSSSO....",
  ".....OOSSOO.....",
];
const TORSO_FRENTE = [
  "....OTTTTTTO....",
  "...OtTTTTTTtO...",
  "...OtTTTTTTtO...",
  "...OtTTTTTTtO...",
  "...OSttttttSO...",
  "....OBBBBBBO....",
];
const TORSO_PERFIL = (brazo: number) => {
  const fila = (c: string) => {
    const base = "....OTTTTTTO....".split("");
    base[brazo] = c;
    return base.join("");
  };
  return [".....OTTTTO.....", "....OTTTTTTO....", fila("t"), fila("t"), fila("S"), ".....OBBBBO....."];
};
const PIERNAS_FRENTE = {
  quieto: ["....OBBOOBBO....", "....OBBOOBBO....", "....OFFOOFFO....", "....OOO..OOO...."],
  izq: ["....OBBOOBBO....", "....OFFOOBBO....", "....OOOOOFFO....", "........OOOO...."],
  der: ["....OBBOOBBO....", "....OBBOOFFO....", "....OFFOOOOO....", "....OOOO........"],
};
const PIERNAS_PERFIL = {
  quieto: ["......OBBO......", "......OBBO......", "......OFFFO.....", "......OOOO......"],
  paso: [".....OBBBBO.....", "....OBBOOBBO....", "...OFFO..OFFFO..", "...OOO....OOOO.."],
};

// ── Peinados (capas que se pintan sobre la cabeza) ─────────────────────────
type Vistas = { frente: string[]; espalda: string[]; perfil: string[] };
const C = (filas: string[], desde = 0) => [...Array(desde).fill("................"), ...filas];

const CORTO: Vistas = {
  frente: C([".....OOOOOO.....", "....OHHHHHHO....", "...OHHHHHHHHO...", "..OHHHHHHHHhHO..", "..OHhHHHhHHhHO..", "..OHh.......hO.."], 2),
  espalda: C([".....OOOOOO.....", "....OHHHHHHO....", "...OHHHHHHHHO...", "..OHHHHHHHHHHO..", "..OHHhHHHHHHHO..", "..OHHHHHHHhHHO..", "..OHHHHHHHHHHO..", "...OHHHhHHHHO...", "...OHHHHHHHHO...", "....OhhhhhhO...."], 2),
  perfil: C([".....OOOOOO.....", "....OHHHHHHO....", "...OHHHHHHHHO...", "..OHHHHHHHHHHO..", "..OHHHHHHHhhhO..", "..OHHHHHHh..O...", "..OHHHHHO.......", "..OHHHHHO.......", "...OHHHO........", "....OOO........."], 2),
};
const LARGO: Vistas = {
  frente: C([
    ".....OOOOOO.....", "....OHHHHHHO....", "...OHHHHHHHHO...", "..OHHHHHHHHhHO..", "..OHhHHHhHHhHO..", "..OHh......hHO..",
    "..OH........HO..", "..OH........HO..", "..OH........HO..", "..OH........HO..", "..OH........HO..", "..OH........HO..", "..OhO......OhO..", "...O........O...",
  ], 2),
  espalda: C([
    ".....OOOOOO.....", "....OHHHHHHO....", "...OHHHHHHHHO...", "..OHHHHHHHHHHO..", "..OHHhHHHHHHHO..", "..OHHHHHHHhHHO..", "..OHHHHHHHHHHO..",
    "..OHHHhHHHHHHO..", "..OHHHHHHHHHHO..", "..OHHHHHHHHHHO..", "..OHHhHHHHhHHO..", "..OHHHHHHHHHHO..", "..OHHHHHHHHHHO..", "...OhhhhhhhhO...",
  ], 2),
  perfil: C([
    ".....OOOOOO.....", "....OHHHHHHO....", "...OHHHHHHHHO...", "..OHHHHHHHHHHO..", "..OHHHHHHHhhhO..", "..OHHHHHHh..O...",
    "..OHHHHHO.......", "..OHHHHHO.......", "..OHHHHO........", "..OHHHHO........", "..OHHHO.........", "..OHHHO.........", "..OhhO..........", "...OO...........",
  ], 2),
};
const MONO: Vistas = {
  frente: [
    "......OOOO......", ".....OHHHHO.....", ...CORTO.frente.slice(2),
  ],
  espalda: ["......OOOO......", ".....OHHhHO.....", ...CORTO.espalda.slice(2)],
  perfil: ["...OOOO.........", "..OHHHHO........", ...CORTO.perfil.slice(2)],
};
const RIZADO: Vistas = {
  frente: C([
    "....OOOOOOOO....", "...OHHHHHHHHO...", "..OHHhHHHHhHHO..", ".OHHHHHHHHHHHHO.", ".OHhHHHHHHHHhHO.", ".OHHhHHhhHHhHHO.",
    ".OHH........HHO.", ".OHO........OHO.", "..O..........O..",
  ], 1),
  espalda: C([
    "....OOOOOOOO....", "...OHHHHHHHHO...", "..OHHhHHHHhHHO..", ".OHHHHHHHHHHHHO.", ".OHHHhHHHHhHHHO.", ".OHHHHHHHHHHHHO.",
    ".OHhHHHHHHHHhHO.", ".OHHHHHhHHHHHHO.", ".OHHHHHHHHHHHHO.", "..OHHHHHHHHHHO..", "...OhhhhhhhhO...",
  ], 1),
  perfil: C([
    "....OOOOOOOO....", "...OHHHHHHHHO...", "..OHHhHHHHhHHO..", ".OHHHHHHHHHHHHO.", ".OHhHHHHHHHHhHO.", ".OHHHHHHHHhhhO..",
    ".OHHHHHHh..O....", ".OHHHHHO........", ".OHHHHO.........", "..OHHO..........", "...OO...........",
  ], 1),
};
export const PEINADOS: Record<Peinado, Vistas> = { corto: CORTO, largo: LARGO, mono: MONO, rizado: RIZADO };

function paleta(a: Apariencia): Paleta {
  return {
    O: "#2a1d2b",
    S: a.piel, s: tono(a.piel, -0.14), k: tono(a.piel, -0.06),
    E: "#2a1d2b",
    H: a.pelo, h: tono(a.pelo, -0.28),
    T: a.polera, t: tono(a.polera, -0.22),
    B: a.pantalon, b: tono(a.pantalon, -0.2),
    F: a.zapatos ?? "#4a3a36",
  };
}

type Vista = "frente" | "espalda" | "perfil";

function cuadro(g: CanvasRenderingContext2D, ox: number, a: Apariencia, vista: Vista, paso: 0 | 1 | 2 | 3) {
  const pal = paleta(a);
  const pelo = PEINADOS[a.peinado][vista];
  const bob = paso === 1 || paso === 3 ? 1 : 0; // el cuerpo baja un píxel al dar el paso
  // Pelo largo por detrás del cuerpo en la vista de espalda: se pinta al final igual.
  const cabeza = vista === "frente" ? CABEZA_FRENTE : vista === "espalda" ? CABEZA_ESPALDA : CABEZA_PERFIL;
  plantilla(g, cabeza, pal, ox, bob);
  const torso = vista === "perfil" ? TORSO_PERFIL(paso === 1 ? 9 : paso === 3 ? 6 : 7) : TORSO_FRENTE;
  plantilla(g, torso, pal, ox, 13 + bob);
  const piernas =
    vista === "perfil"
      ? paso === 0 || paso === 2 ? PIERNAS_PERFIL.quieto : PIERNAS_PERFIL.paso
      : paso === 1 ? PIERNAS_FRENTE.izq : paso === 3 ? PIERNAS_FRENTE.der : PIERNAS_FRENTE.quieto;
  plantilla(g, piernas, pal, ox, 19);
  plantilla(g, pelo, pal, ox, bob);
}

/**
 * Hoja de 12 cuadros: frente 0–3, espalda 4–7, perfil (mirando a la derecha)
 * 8–11. Cuadro 0 de cada vista = quieto; 1 y 3 = pasos.
 */
export function hojaPersonaje(scene: Phaser.Scene, clave: string, a: Apariencia) {
  if (scene.textures.exists(clave)) scene.textures.remove(clave);
  const { c, g } = lienzo(FW * 12, FH);
  (["frente", "espalda", "perfil"] as Vista[]).forEach((v, vi) => {
    for (let p = 0; p < 4; p++) cuadro(g, (vi * 4 + p) * FW, a, v, p as 0 | 1 | 2 | 3);
  });
  const tex = scene.textures.addSpriteSheet(clave, c as unknown as HTMLImageElement, { frameWidth: FW, frameHeight: FH });
  const anims: [string, number][] = [["abajo", 0], ["arriba", 4], ["lado", 8]];
  for (const [dir, base] of anims) {
    const k = `${clave}-${dir}`;
    if (scene.anims.exists(k)) scene.anims.remove(k);
    scene.anims.create({ key: k, frames: scene.anims.generateFrameNumbers(clave, { frames: [base + 1, base, base + 3, base + 2] }), frameRate: 8, repeat: -1 });
  }
  return tex;
}

/** Retrato para la caja de diálogo: la cabeza de frente, ampliada. */
export function retrato(a: Apariencia, escala = 6): string {
  const { c, g } = lienzo(16, 16);
  const pal = paleta(a);
  plantilla(g, CABEZA_FRENTE, pal, 0, 2);
  plantilla(g, ["....OTTTTTTO....", "...OtTTTTTTtO..."], pal, 0, 15);
  plantilla(g, PEINADOS[a.peinado].frente, pal, 0, 2);
  const big = lienzo(16 * escala, 16 * escala);
  big.g.drawImage(c, 0, 0, 16 * escala, 16 * escala);
  return big.c.toDataURL();
}

/** Figura de cuerpo entero (de frente), para la pantalla de creación. */
export function figura(a: Apariencia, escala = 8): string {
  const { c, g } = lienzo(FW, FH);
  cuadro(g, 0, a, "frente", 0);
  const big = lienzo(FW * escala, FH * escala);
  big.g.drawImage(c, 0, 0, FW * escala, FH * escala);
  return big.c.toDataURL();
}
