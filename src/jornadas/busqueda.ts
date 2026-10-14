// Misiones en terreno: buscar cosas en un lugar (inspección, investigación,
// recorrido) o llegar a algún sitio antes de que se acabe el tiempo (carrera).
// Rompen la receta de la jornada: en vez de un panel, se juega caminando.
//
// Cada pista es un brillo en el mapa. Al usarla se oye lo que es y, si trae una
// afirmación, se responde «¿Se puede?» (sí o no) en un toque: el Derecho
// aplicado al lugar. Un contador arriba y, si hay reloj, una cuenta atrás que
// nunca hace perder: sólo quita la estrella de rapidez.
import type { Mundo, NombreMapa } from "../game/scenes/Mundo";
import { e, guardar } from "../game/estado";
import { ui } from "../ui/ui";
import { sonido } from "../ui/sonido";
import { ganarSaber } from "../juego/progreso";
import { ajustes, holgura } from "../juego/ajustes";
import { aviso } from "../ui/efectos";
import { ir } from "./motor";

export type Pista = {
  /** Punto del mapa y desplazamiento en píxeles. */
  punto: string; dx?: number; dy?: number;
  etiqueta: string;
  /** Lo que se ve o se oye (una línea). */
  texto: string;
  /** Pregunta de sí o no sobre lo que se encontró (opcional). */
  pregunta?: { texto: string; si: boolean; porque: string };
};

export type Busqueda = {
  tipo: "inspeccion" | "investigacion" | "recorrido" | "carrera";
  lugar: NombreMapa;
  objetivo: string;
  /** Lo que dice EVA al empezar (una línea). */
  intro: string;
  pistas: Pista[];
  /** Segundos (opcional). En una carrera, el tiempo para llegar a la última pista. */
  tiempo?: number;
  /** Lo que dice EVA al terminar (una línea). */
  cierre: string;
};

const P = (m: Mundo, n: string) => { try { return m.punto(n); } catch { return m.punto(m.mapa === "ciudad" ? "inicio" : "entrada"); } };
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, Math.ceil(s % 60))).padStart(2, "0")}`;

/** Juega una misión de búsqueda. Devuelve aciertos y total (para las estrellas). */
export async function buscar(m: Mundo, b: Busqueda): Promise<{ aciertos: number; total: number }> {
  await ir(m, b.lugar, b.objetivo);
  m.bloquear(true);
  await ui.eva([b.intro]);
  m.bloquear(false);
  const carrera = b.tipo === "carrera";
  // En una carrera no hay viaje rápido: se corre de verdad.
  m.sinAtajo = carrera;
  let aciertos = 0, total = 0;
  const pendientes = new Set(b.pistas.map((_, i) => i));
  const etiqueta = () => carrera ? b.objetivo : `${b.objetivo} · ${b.pistas.length - pendientes.size}/${b.pistas.length}`;
  let restante = b.tiempo ? b.tiempo * holgura() : 0;
  const conReloj = !!b.tiempo && !ajustes.modoHistoria;
  let aTiempo = true;
  const pintar = () => ui.objetivo(conReloj ? `${etiqueta()} · ⏱ ${mmss(restante)}` : etiqueta());
  pintar();
  const reloj = conReloj ? setInterval(() => {
    if (ui.ocupado()) return;
    restante -= 1;
    if (restante <= 0 && aTiempo) { aTiempo = false; sonido.efecto("tiempo"); aviso("⏱", "Se acabó el tiempo", "Sigue igual: sólo pierdes la estrella de rapidez."); }
    pintar();
  }, 1000) : null;

  await new Promise<void>((listo) => {
    const ponerPista = (i: number) => {
      const p = b.pistas[i];
      const base = P(m, p.punto);
      const pos = { x: base.x + (p.dx ?? 0), y: base.y + (p.dy ?? 0) };
      const id = `pista-${i}`;
      const im = m.colocar(id, "brillo", pos).setScale(1.6).setDepth(9300);
      m.tweens.add({ targets: im, scale: { from: 1.2, to: 2 }, alpha: { from: 0.65, to: 1 }, duration: 520, yoyo: true, repeat: -1 });
      m.interactuar(id, p.etiqueta, pos, async () => {
        if (!pendientes.has(i)) return;
        pendientes.delete(i);
        m.quitar(id);
        m.chispas(pos);
        m.bloquear(true);
        sonido.efecto("objetivo");
        await ui.decir([{ texto: p.texto }]);
        if (p.pregunta) {
          total++;
          const r = await ui.apuesta(p.pregunta.texto, ["Sí", "No"], p.pregunta.si ? 0 : 1);
          if (r) aciertos++;
          await ui.decir([{ quien: "EVA", texto: p.pregunta.porque }]);
        } else ganarSaber(15);

        m.bloquear(false);
        pintar();
        if (carrera) { if (pendientes.size) ponerSiguiente(); }
        if (!pendientes.size) listo();
      }, 22);
      if (carrera || b.tipo === "recorrido") m.meta(pos);
    };
    // Carrera y recorrido: de a una, con flecha. Inspección e investigación: todas a la vez, sin flecha (hay que mirar).
    const ponerSiguiente = () => { const i = [...pendientes][0]; if (i !== undefined) ponerPista(i); };
    if (carrera || b.tipo === "recorrido") ponerSiguiente();
    else for (const i of pendientes) ponerPista(i);
  });

  if (reloj) clearInterval(reloj);
  m.sinAtajo = false;
  m.meta(null);
  ui.objetivo(null);
  m.bloquear(true);
  if (conReloj && aTiempo) { ganarSaber(60); aviso("⚡", "¡A tiempo!", "+60 Saber de rapidez."); }
  await ui.eva([b.cierre]);
  m.bloquear(false);
  e().flags.push(`busqueda:${b.tipo}`); guardar();
  // La rapidez cuenta como un acierto más (si había reloj).
  return { aciertos: aciertos + (conReloj && aTiempo ? 1 : 0), total: total + (conReloj ? 1 : 0) };
}
