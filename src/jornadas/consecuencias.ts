// Consecuencias: lo que haces en una jornada se nota en las siguientes.
//
// Dos medidores visibles en el HUD (0 a 100):
//   · Confianza de los vecinos: sube cuando timbras bien; baja cuando un vecino
//     sale perjudicado por un error tuyo.
//   · Respaldo de la Alcaldesa: sube cuando ganas sus duelos y exámenes; baja
//     cuando los pierdes.
// Y los casos que vuelven: un expediente mal timbrado queda anotado y, en una
// jornada posterior, el vecino vuelve con un recurso. Es una segunda
// oportunidad: si esta vez lo resuelves bien, recuperas la confianza perdida.
import { e, guardar } from "../game/estado";
import type { Expediente } from "../content/tipos";
import { BANCOS } from "../content/banco";
import { flotar } from "../ui/efectos";

export type Medidores = { confianza: number; respaldo: number };

export const medidores = (): Medidores => (e().medidores ??= { confianza: 60, respaldo: 50 });

export function mover(c: number, r = 0) {
  const m = medidores();
  m.confianza = Math.max(0, Math.min(100, m.confianza + c));
  m.respaldo = Math.max(0, Math.min(100, m.respaldo + r));
  guardar();
  pintarMedidores(c, r);
}

/** Pinta los dos medidores en el HUD (y un «+3» flotando si cambiaron). */
export function pintarMedidores(dc = 0, dr = 0) {
  const hud = document.querySelector(".hud-der");
  if (!hud) return;
  let cont = document.getElementById("hud-medidores");
  if (!cont) {
    cont = document.createElement("div");
    cont.id = "hud-medidores";
    cont.className = "hud-chip hud-medidores";
    cont.innerHTML = `<span class="med" data-k="confianza" title="Confianza de los vecinos"><i>🏘</i><b></b></span><span class="med" data-k="respaldo" title="Respaldo de la Alcaldesa"><i>🏛</i><b></b></span>`;
    hud.prepend(cont);
  }
  const m = medidores();
  for (const k of ["confianza", "respaldo"] as const) {
    const el = cont.querySelector<HTMLElement>(`[data-k="${k}"]`)!;
    el.querySelector("b")!.textContent = String(Math.round(m[k]));
    el.dataset.nivel = m[k] < 35 ? "bajo" : m[k] < 70 ? "medio" : "alto";
    const d = k === "confianza" ? dc : dr;
    if (d) { const r = el.getBoundingClientRect(); flotar(`${d > 0 ? "+" : ""}${d}`, r.left, r.bottom + 4, d > 0 ? "saber" : "menos"); }
  }
}

/** Un expediente mal timbrado: queda pendiente para volver más adelante. */
export function fallo(ex: Expediente) {
  const f = `vuelve:${ex.id}`;
  if (!e().flags.includes(f)) e().flags.push(f);
  mover(-6, 0);
}

/** Un expediente bien timbrado. Si era un caso que volvía, se cierra y se recupera la confianza. */
export function acierto(ex: Expediente) {
  const id = ex.id.replace(/^vuelve-/, "");
  const f = `vuelve:${id}`;
  const i = e().flags.indexOf(f);
  if (i >= 0) { e().flags.splice(i, 1); mover(8, 0); } else mover(3, 0);
}

/** El caso que vuelve en la jornada `n` (uno de una jornada anterior), con su nuevo relato. */
export function casoQueVuelve(n: number): Expediente | null {
  const ids = e().flags.filter((f) => f.startsWith("vuelve:")).map((f) => f.slice(7));
  for (const id of ids) {
    const ex = BANCOS.flatMap((b) => b.expedientes).find((x) => x.id === id);
    if (!ex || ex.modulo >= n) continue;
    return {
      ...ex,
      id: `vuelve-${ex.id}`,
      titulo: `Vuelve: ${ex.titulo}`,
      relato: `Este caso ya pasó por tu mesa en la jornada ${ex.modulo} y salió mal. El vecino volvió con un recurso. Segunda oportunidad. ${ex.relato}`,
    };
  }
  return null;
}

/** Lo que dice EVA al cierre de una jornada según cómo van los medidores (o nada). */
export function comentario(): string | null {
  const m = medidores();
  if (m.confianza < 35) return "Ojo: la confianza de los vecinos está baja. Los errores vuelven, siempre con un recurso bajo el brazo.";
  if (m.respaldo < 30) return "La Alcaldesa ya no te escucha. Gánale un par de argumentos y vuelve a abrir la puerta.";
  if (m.confianza > 85) return "Los vecinos te saludan en la plaza. En Potestas eso es casi un premio Nobel.";
  return null;
}

/** Epílogo del final, según los medidores. */
export function epilogo(): string {
  const m = medidores();
  const v = m.confianza >= 70 ? "Los vecinos de Potestas confían en su Municipalidad: saben que alguien revisa antes de firmar." : m.confianza >= 40 ? "Los vecinos todavía hacen fila con desconfianza, pero ya no sin esperanza." : "Los vecinos siguen reclamando: los errores de la mesa volvieron como recursos, uno por uno.";
  const a = m.respaldo >= 60 ? "La Alcaldesa, a regañadientes, ya no firma sin preguntarle a Jurídica." : "La Alcaldesa sigue firmando rápido. Demasiado rápido.";
  return `${v} ${a}`;
}
