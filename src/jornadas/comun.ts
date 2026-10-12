// Utilidades que comparten las jornadas: descubrir un hallazgo y la Apuesta EVA.
import { e, guardar } from "../game/estado";
import { HALLAZGOS } from "../content/hallazgos";
import { ui } from "../ui/ui";
import { alDescubrir, logro } from "../juego/progreso";
import { ajustes } from "../juego/ajustes";

export const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Muestra la carta de un hallazgo (una sola vez por partida) y lo guarda en el expediente. */
export async function descubrir(id: string) {
  if (e().hallazgos.includes(id)) return;
  const h = HALLAZGOS.find((x) => x.id === id);
  if (!h) return;
  e().hallazgos.push(id);
  guardar();
  // El primero de la partida se muestra entero (enseña dónde quedan); los demás, como medallita que no frena.
  const primero = !e().flags.includes("tuto-medalla");
  if (ajustes.hallazgoCompleto || primero) {
    await ui.hallazgo(h, HALLAZGOS.length, e().hallazgos.length, primero && !ajustes.hallazgoCompleto ? "Los próximos llegan como medallita, sin parar el juego: tócala para leerla. Toca para seguir." : undefined);
    if (primero) { e().flags.push("tuto-medalla"); guardar(); }
  } else ui.medalla(h, HALLAZGOS.length, e().hallazgos.length);
  alDescubrir();
}

/** Apuesta EVA: ¿qué crees que pasa? Lleva la cuenta y la racha. */
export async function apostar(pregunta: string, opciones: [string, string], correcta: 0 | 1) {
  const r = await ui.apuesta(pregunta, opciones, correcta);
  const a = (e().apuestas ??= { total: 0, aciertos: 0, racha: 0 });
  a.total++;
  if (r) { a.aciertos++; a.racha++; } else a.racha = 0;
  guardar();
  if (a.racha >= 3) logro("buen-ojo");
}
