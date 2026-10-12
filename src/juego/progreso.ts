// Progreso del jugador: puntos de «Saber» (lo que aprende), su nivel de
// jurista y los logros. Se guarda en la partida. El Saber sale de descubrir,
// resolver y repasar el Derecho.
import { estado, guardar } from "../game/estado";
import { LOGROS } from "../content/logros";
import { HALLAZGOS } from "../content/hallazgos";
import { aviso, confeti, destello, flotar } from "../ui/efectos";
import { sonido } from "../ui/sonido";

const NIVELES = [
  { desde: 0, f: "Ciudadana", m: "Ciudadano" },
  { desde: 500, f: "Estudiante de Derecho", m: "Estudiante de Derecho" },
  { desde: 1300, f: "Procuradora", m: "Procurador" },
  { desde: 2400, f: "Abogada", m: "Abogado" },
  { desde: 3800, f: "Abogada Jefa", m: "Abogado Jefe" },
  { desde: 5500, f: "Fiscal", m: "Fiscal" },
  { desde: 7500, f: "Contralora", m: "Contralor" },
  { desde: 10000, f: "Ministra del TC", m: "Ministro del TC" },
];

export function nivel(saber = estado?.saber ?? 0) {
  let i = 0;
  while (i + 1 < NIVELES.length && saber >= NIVELES[i + 1].desde) i++;
  const n = NIVELES[i], sig = NIVELES[i + 1];
  const titulo = estado?.sexo === "hombre" ? n.m : n.f;
  return { n: i + 1, titulo, desde: n.desde, hasta: sig?.desde ?? n.desde, avance: sig ? (saber - n.desde) / (sig.desde - n.desde) : 1 };
}

/** El punto de «nuevo» en el expediente: hay hallazgos o logros que no se han mirado. */
export function pintarNuevo() {
  const b = document.getElementById("hud-expediente");
  if (!b || !estado) return;
  const total = estado.hallazgos.length + (estado.logros ?? []).length;
  b.classList.toggle("nuevo", total > (estado.vistoExp ?? 0));
}

/** Pinta el botón de nivel del HUD (número y anillo de avance). */
export function pintarNivel() {
  const b = document.getElementById("hud-nivel");
  if (!b || !estado) return;
  const nv = nivel();
  b.style.setProperty("--avance", `${Math.round(nv.avance * 100)}%`);
  b.querySelector(".nivel-n")!.textContent = String(nv.n);
  b.setAttribute("aria-label", `Nivel ${nv.n}: ${nv.titulo}. ${estado.saber ?? 0} de Saber.`);
  b.title = `${nv.titulo} · ${estado.saber ?? 0} Saber`;
}

export function ganarSaber(cantidad: number) {
  if (!estado) return;
  const antes = nivel();
  estado.saber = (estado.saber ?? 0) + cantidad;
  guardar();
  const b = document.getElementById("hud-nivel");
  if (b) {
    const r = b.getBoundingClientRect();
    flotar(`+${cantidad} Saber`, Math.max(8, r.left - 110), r.bottom + 6, "saber");
    b.classList.remove("pulso"); void b.offsetWidth; b.classList.add("pulso");
  }
  pintarNivel();
  pintarNuevo();
  // La primera vez, se explica qué es el Saber y dónde mirarlo.
  if (!estado.flags.includes("tuto-saber")) {
    estado.flags.push("tuto-saber");
    guardar();
    setTimeout(() => aviso("⚖️", "Ganaste Saber", "Todo lo que aprendes suma. Toca ⚖ arriba para ver tu nivel, tus fichas y repasar."), 900);
  }
  const ahora = nivel();
  if (ahora.n > antes.n) {
    sonido.efecto("hallazgo");
    destello();
    confeti(innerWidth / 2, innerHeight * 0.3, 50);
    aviso("⚖️", `¡Nivel ${ahora.n}!`, `Ahora eres ${ahora.titulo}.`, "nivel");
  }
}

export function logro(id: string) {
  if (!estado) return;
  const l = LOGROS.find((x) => x.id === id);
  if (!l) return;
  estado.logros ??= [];
  if (estado.logros.includes(id)) return;
  estado.logros.push(id);
  guardar();
  sonido.efecto("objetivo");
  aviso(l.icono, `Logro: ${l.titulo}`, l.texto, "logro");
  ganarSaber(50);
}

/** Lo que pasa cada vez que se descubre un hallazgo (además de su carta). */
export function alDescubrir() {
  ganarSaber(100);
  logro("primer-hallazgo");
  if (estado && HALLAZGOS.every((h) => estado!.hallazgos.includes(h.id))) logro("expediente-completo");
}

/** Partidas guardadas antes de que existiera el Saber: se calcula de lo ya descubierto. */
export function migrarProgreso() {
  if (!estado) return;
  if (estado.saber === undefined) estado.saber = estado.hallazgos.length * 100;
  estado.logros ??= [];
  if (estado.hallazgos.length) estado.logros.includes("primer-hallazgo") || estado.logros.push("primer-hallazgo");
  guardar();
}

/** Guarda las fichas de estudio de un módulo en la colección (sin repetir). */
export function coleccionar(ids: string[]) {
  if (!estado) return 0;
  estado.fichas ??= [];
  let nuevas = 0;
  for (const id of ids) if (!estado.fichas.includes(id)) { estado.fichas.push(id); nuevas++; }
  guardar();
  if (estado.fichas.length >= 20) logro("coleccionista");
  if (estado.fichas.length >= 100) logro("biblioteca");
  return nuevas;
}
