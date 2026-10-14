// Partidas de inicio por jornada: para saltar directo a cualquiera desde el
// título. Toman tu nombre y tu aspecto si ya tenías una partida, y dan por
// hechas las jornadas anteriores (con sus hallazgos).
import { DIA, type Estado, type Sexo } from "../game/estado";
import type { Apariencia } from "../game/art/characters";
import { MODULOS } from "./modulos";
import { BANCOS } from "./banco";

type Yo = { nombre: string; sexo: Sexo; apariencia: Apariencia };
const YO_BASE: Yo = {
  nombre: "Valentina", sexo: "mujer",
  apariencia: { piel: "#c98d63", pelo: "#2b2026", peinado: "largo", polera: "#3b3f4f", pantalon: "#2b2026", corbata: "#8a2e2e" },
};

/** Una partida lista para empezar la jornada `n` (1 a 12), con tu identidad si la hay. */
export function partidaDesde(n: number, previa?: Partial<Estado> | null): Estado {
  const yo: Yo = previa?.nombre && previa.sexo && previa.apariencia
    ? { nombre: previa.nombre, sexo: previa.sexo, apariencia: previa.apariencia }
    : YO_BASE;
  const previas = MODULOS.filter((m) => m.n < n).map((m) => m.n);
  const hallazgos = BANCOS.filter((b) => previas.includes(b.modulo)).flatMap((b) => b.hallazgos.map((h) => h.id));
  return {
    version: 1, ...yo,
    jornada: n, paso: `j${n}-inicio`, fecha: `Jornada ${n} · ${DIA[(n - 1) % 5]}`, minuto: 8 * 60 + 55,
    flags: ["tuto-medalla", "tuto-saber"], papeles: [], hallazgos, fichas: [], completadas: previas,
    saber: hallazgos.length * 100, logros: hallazgos.length ? ["primer-hallazgo"] : [],
  };
}
