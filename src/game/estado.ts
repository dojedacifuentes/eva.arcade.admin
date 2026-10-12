// Estado de la partida de POTESTAS: quién eres, en qué jornada vas, qué
// descubriste y cómo va tu aprendizaje. Se guarda en el navegador.
import type { Apariencia } from "./art/characters";

export type Sexo = "mujer" | "hombre";
export type Papel = { id: string; titulo: string; detalle: string; fecha: string };

export type Estado = {
  version: 1;
  nombre: string;
  sexo: Sexo;
  apariencia: Apariencia;
  /** Jornada (módulo) en curso, 1 a 12. */
  jornada: number;
  /** En qué parte de la jornada vamos («j1-inicio», «j1-mesa», «fin-j1»…). */
  paso: string;
  fecha: string;
  minuto: number; // minutos desde medianoche
  flags: string[];
  papeles: Papel[];
  hallazgos: string[];
  /** Fichas de estudio coleccionadas (ids del banco). */
  fichas: string[];
  /** Jornadas terminadas. */
  completadas: number[];
  /** Capa de juego: Saber, logros, desafío, apuestas. */
  saber?: number;
  logros?: string[];
  desafio?: { jugados: number; mejor: number };
  vistoExp?: number;
  apuestas?: { total: number; aciertos: number; racha: number };
  /** La Mesa: expedientes resueltos, aciertos y mejor racha. */
  mesa?: { resueltos: number; aciertos: number; mejorRacha: number };
  /** Repaso espaciado: por afirmación, cuántas veces se vio, cuántas se falló y cuándo toca de nuevo. */
  repaso?: Record<string, { vistos: number; fallos: number; prox: number }>;
  /** Estrellas por jornada (0 a 3), según aciertos. */
  estrellas?: Record<number, number>;
};

const CLAVE = "eva-potestas:partida";

export let estado: Estado | null = null;

export type Identidad = { nombre: string; sexo: Sexo; apariencia: Apariencia };

export const INICIO = { fecha: "Jornada 1 · Lunes", minuto: 8 * 60 + 55 };

export function nuevaPartida(d: Identidad, jornada = 1) {
  estado = {
    version: 1, ...d,
    jornada, paso: `j${jornada}-inicio`, ...INICIO, fecha: `Jornada ${jornada} · ${DIA[(jornada - 1) % 5]}`,
    flags: [], papeles: [], hallazgos: [], fichas: [], completadas: [],
  };
  guardar();
  return estado;
}

export const DIA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export function cargar(): Estado | null {
  try {
    const s = localStorage.getItem(CLAVE);
    estado = s ? (JSON.parse(s) as Estado) : null;
    if (estado) { estado.fichas ??= []; estado.completadas ??= []; estado.papeles ??= []; }
  } catch { estado = null; }
  return estado;
}

export function guardar() {
  try { if (estado) localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch { /* sin almacenamiento: se juega igual */ }
}

export function borrar() {
  try { localStorage.removeItem(CLAVE); } catch { /* nada */ }
  estado = null;
}

export const e = () => estado!;
export const tiene = (f: string) => e().flags.includes(f);
export const marcar = (f: string) => { if (!tiene(f)) e().flags.push(f); guardar(); };

/** Concordancia: g("listo", "lista") según el sexo del jugador. */
export const g = (m: string, f: string) => (e().sexo === "mujer" ? f : m);

export function hora() {
  const m = e().minuto;
  return `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** Reemplaza la partida (por ejemplo, al elegir una jornada desde el título). */
export function reemplazar(nueva: Estado) {
  estado = nueva;
  guardar();
}
