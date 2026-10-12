// El motor de las jornadas. Cada jornada (un módulo del banco) se juega igual
// de bien y con su propia historia: un encargo, una apuesta, la Mesa de
// expedientes, un trabajo en terreno (cadena o columnas), el jefe (un duelo de
// argumentos o la comisión oral) y el cierre. El guion de cada jornada
// (src/jornadas/guiones.ts) pone las personas, los lugares y lo que dicen; el
// Derecho sale del banco del módulo (src/content/banco/).
//
// Cada parte es un «paso» con nombre: si se cierra el juego a mitad de
// jornada, al volver se retoma en el primer paso sin hacer.
import type { Mundo, NombreMapa } from "../game/scenes/Mundo";
import type { Dir } from "../game/actors/Personaje";
import { e, guardar, hora, DIA } from "../game/estado";
import { banco } from "../content/banco";
import { modulo } from "../content/modulos";
import type { BancoModulo, Hallazgo, PreguntaQuiz } from "../content/tipos";
import type { Personaje } from "../content/personajes";
import { ui, type Linea } from "../ui/ui";
import { sonido } from "../ui/sonido";
import { descubrir, apostar, espera } from "./comun";
import { coleccionar, logro } from "../juego/progreso";
import { mesa } from "../ui/mesa";
import { cadena } from "../ui/cadena";
import { columnas } from "../ui/columnas";
import { duelo } from "../ui/duelo";
import { comision } from "../ui/comision";

/** Quién dice cada línea: «yo» (el jugador), «eva» o el id de un personaje del guion. */
export type Dicho = [quien: string, texto: string];

export type Escena = {
  lugar: NombreMapa;
  /** Objetivo que se muestra arriba mientras se va. */
  objetivo: string;
  quien: Personaje;
  /** Punto del mapa donde está la persona. */
  punto: string;
  dir?: Dir;
  /** Otras personas presentes (no se habla con ellas para avanzar). */
  extras?: { p: Personaje; punto: string; dir?: Dir }[];
  dichos: Dicho[];
};

export type Guion = {
  n: number;
  /** El encargo: quién te llama y para qué. Revela el primer hallazgo. */
  encargo: Escena & { eva: string[] };
  /** La Apuesta EVA antes de la Mesa (sobre el segundo hallazgo). */
  apuesta: string;
  /** Dónde se sienta uno a timbrar y qué se dice antes. */
  mesa: { lugar: NombreMapa; punto: string; objetivo: string; dichos: Dicho[]; con?: { p: Personaje; punto: string } };
  /** Trabajo en terreno: una persona, un problema y un minijuego (cadena o columnas). */
  terreno: Escena & { juego: "cadena" | "columnas"; despues: Dicho[] };
  /** El jefe: duelo de argumentos o comisión oral. `juez` preside si lo hay. */
  jefe: Escena & { tipo: "duelo" | "comision"; juez?: { p: Personaje; punto: string }; despues: Dicho[] };
  /** Lo último que dice EVA. */
  cierre: string[];
};

type Marcador = { aciertos: number; total: number };

const P = (m: Mundo, n: string) => { try { return m.punto(n); } catch { return m.punto(m.mapa === "ciudad" ? "inicio" : "entrada"); } };

/** Pasa de la ciudad a un lugar (o de vuelta): objetivo, puerta abierta, flecha y esperar. */
export async function ir(m: Mundo, lugar: NombreMapa, objetivo: string) {
  if (m.mapa === lugar) return;
  if (m.mapa !== "ciudad") {
    m.puedeSalir = true;
    ui.objetivo(lugar === "ciudad" ? objetivo : "Sal a la calle");
    m.meta(() => P(m, "salida"));
    await m.entrarA("ciudad");
  }
  if (lugar === "ciudad") return;
  m.cerradas.delete(lugar);
  ui.objetivo(objetivo);
  m.meta(() => P(m, `puerta-${lugar}`));
  await m.entrarA(lugar);
  m.meta(null);
}

/** Convierte los dichos del guion en líneas de diálogo con su retrato. */
function lineas(dichos: Dicho[], gente: Personaje[]): Linea[] {
  return dichos.map(([q, texto]) => {
    if (q === "yo") return { quien: e().nombre, texto, apariencia: e().apariencia };
    if (q === "eva") return { quien: "EVA", texto };
    const p = gente.find((x) => x.id === q);
    return p ? { quien: p.nombre, texto, apariencia: p.a } : { texto };
  });
}

/** Una conversación: EVA habla aparte (el mundo se tiñe); los demás, en la caja normal. */
async function conversar(dichos: Dicho[], gente: Personaje[]) {
  let tramo: Dicho[] = [];
  const soltar = async () => { if (tramo.length) { await ui.decir(lineas(tramo, gente)); tramo = []; } };
  for (const d of dichos) {
    if (d[0] === "eva") { await soltar(); await ui.eva([d[1]]); }
    else tramo.push(d);
  }
  await soltar();
}

/** Pone a la persona de una escena, flecha encima, y espera a que el jugador le hable. */
async function encontrar(m: Mundo, s: Escena) {
  for (const x of s.extras ?? []) m.npc(x.p.id, x.p.a, P(m, x.punto), x.dir ?? "abajo");
  const n = m.npc(s.quien.id, s.quien.a, P(m, s.punto), s.dir ?? "abajo");
  const pos = () => ({ x: n.x, y: n.y });
  m.interactuar(s.quien.id, `Hablar con ${s.quien.nombre.split(" ")[0]}`, pos, undefined, 22);
  m.meta(() => ({ x: n.x, y: n.y - 4 }));
  ui.objetivo(`Habla con ${s.quien.nombre}`);
  await m.esperar(s.quien.id);
  m.meta(null);
  m.bloquear(true);
  await conversar(s.dichos, [s.quien, ...(s.extras ?? []).map((x) => x.p)]);
  m.bloquear(false);
}

/** El reloj de la jornada: cada parte del día a su hora (la luz cambia con ella). */
function aLas(m: Mundo, h: number, min = 0) {
  e().minuto = h * 60 + min;
  guardar();
  ui.hud({ hora: hora() });
  m.luz();
}

const mezclar = <T,>(a: readonly T[]) => [...a].sort(() => Math.random() - 0.5);

/** Juega una jornada completa (o lo que le falte). Devuelve las estrellas (1 a 3). */
export async function jugarJornada(m: Mundo, g: Guion): Promise<number> {
  const n = g.n, mod = modulo(n), b: BancoModulo = banco(n);
  const d = e();
  d.jornada = n;
  d.fecha = `Jornada ${n} · ${DIA[(n - 1) % 5]}`;
  ui.hud({ fecha: d.fecha, hora: hora() });
  const marca: Marcador = { aciertos: 0, total: 0 };
  const sumar = (r: Marcador) => { marca.aciertos += r.aciertos; marca.total += r.total; d.flags.push(`j${n}-r:${r.aciertos}/${r.total}`); guardar(); };
  // Al retomar, lo ya jugado cuenta para las estrellas.
  for (const f of d.flags) { const k = f.match(new RegExp(`^j${n}-r:(\\d+)/(\\d+)$`)); if (k) { marca.aciertos += +k[1]; marca.total += +k[2]; } }
  const hecho = (p: string) => d.flags.includes(`j${n}:${p}`);
  const paso = async (p: string, fn: () => Promise<void>) => {
    if (hecho(p)) return;
    d.paso = `j${n}-${p}`; guardar();
    await fn();
    d.flags.push(`j${n}:${p}`); guardar();
  };
  // Los hallazgos del módulo, en orden: cada parte del día descubre el siguiente.
  const siguiente = (): Hallazgo | undefined => b.hallazgos.find((h) => !d.hallazgos.includes(h.id));
  const revelar = async (h?: Hallazgo) => { const x = h && !d.hallazgos.includes(h.id) ? h : siguiente(); if (x) await descubrir(x.id); };
  const fichas = (desde: number, hasta: number) => { const ids = b.fichas.slice(Math.floor(b.fichas.length * desde), Math.ceil(b.fichas.length * hasta)).map((f) => f.id); if (coleccionar(ids)) ui.avisoFichas(ids.length); };

  await paso("cartel", async () => {
    aLas(m, 8, 55);
    sonido.musica("musica-barrio");
    await ui.tiempo(`Jornada ${n}`, `${mod.titulo} · ${mod.lema}`);
  });

  await paso("encargo", async () => {
    aLas(m, 9, 0);
    await ir(m, g.encargo.lugar, g.encargo.objetivo);
    await encontrar(m, g.encargo);
    await revelar(b.hallazgos[0]);
    if (g.encargo.eva.length) await ui.eva(g.encargo.eva);
  });

  await paso("apuesta", async () => {
    const h = b.hallazgos[1];
    const af = h ? mezclar(b.afirmaciones.filter((a) => a.hallazgo === h.id))[0] : undefined;
    if (af) await apostar(`${g.apuesta} «${af.texto}»`, ["Verdadero", "Falso"], af.verdad ? 0 : 1);
    await revelar(h);
  });

  await paso("mesa", async () => {
    aLas(m, 11, 0);
    await ir(m, g.mesa.lugar, g.mesa.objetivo);
    if (g.mesa.con) m.npc(g.mesa.con.p.id, g.mesa.con.p.a, P(m, g.mesa.con.punto), "abajo");
    m.interactuar("mesa", "Sentarse a timbrar", () => P(m, g.mesa.punto), undefined, 22);
    m.meta(() => P(m, g.mesa.punto));
    ui.objetivo("Resuelve los expedientes de la Mesa");
    await m.esperar("mesa");
    m.meta(null);
    m.bloquear(true);
    if (g.mesa.dichos.length) await conversar(g.mesa.dichos, g.mesa.con ? [g.mesa.con.p] : []);
    const r = await mesa({
      titulo: `Mesa · ${mod.titulo}`,
      expedientes: b.expedientes,
      alAcertar: async (ex) => { const h = b.hallazgos.find((x) => x.id === ex.hallazgo); if (h && !d.hallazgos.includes(h.id)) await descubrir(h.id); },
    });
    sumar(r);
    fichas(0, 0.4);
    m.bloquear(false);
  });

  await paso("terreno", async () => {
    aLas(m, 15, 10);
    await ir(m, g.terreno.lugar, g.terreno.objetivo);
    await encontrar(m, g.terreno);
    m.bloquear(true);
    let jugado = false;
    if (g.terreno.juego === "cadena" && b.cadenas.length) {
      const c = b.cadenas[0];
      const r = await cadena(c);
      sumar({ aciertos: r.perfecto ? 1 : 0, total: 1 });
      jugado = true;
    }
    if (!jugado && b.columnas.length) { sumar(await columnas(b.columnas[0])); jugado = true; }
    if (!jugado && b.cadenas.length) { const r = await cadena(b.cadenas[0]); sumar({ aciertos: r.perfecto ? 1 : 0, total: 1 }); }
    await revelar();
    if (g.terreno.despues.length) await conversar(g.terreno.despues, [g.terreno.quien, ...(g.terreno.extras ?? []).map((x) => x.p)]);
    // Si el módulo trae otra comparación, una ronda rápida de columnas.
    const otra = b.columnas[g.terreno.juego === "columnas" ? 1 : 0];
    if (otra) sumar(await columnas(otra));
    fichas(0.4, 0.7);
    m.bloquear(false);
  });

  await paso("jefe", async () => {
    aLas(m, 17, 40);
    await ir(m, g.jefe.lugar, g.jefe.objetivo);
    if (g.jefe.juez) m.npc(g.jefe.juez.p.id, g.jefe.juez.p.a, P(m, g.jefe.juez.punto), "abajo");
    sonido.musica("musica-tribunal");
    await encontrar(m, { ...g.jefe, extras: [...(g.jefe.extras ?? []), ...(g.jefe.juez ? [{ p: g.jefe.juez.p, punto: g.jefe.juez.punto }] : [])] });
    m.bloquear(true);
    if (g.jefe.tipo === "duelo" && b.quiz.length) {
      const preguntas: PreguntaQuiz[] = mezclar(b.quiz).slice(0, 5);
      for (;;) {
        const r = await duelo({ rival: { nombre: g.jefe.quien.nombre, cargo: g.jefe.quien.cargo, a: g.jefe.quien.a }, preguntas, titulo: `Duelo · ${mod.titulo}` });
        if (r.gano) { sumar({ aciertos: r.perfecto ? 3 : 2, total: 3 }); break; }
        const otra = await ui.elegir("Perdiste el duelo. ¿Otra vez?", ["Pedir la palabra de nuevo", "Seguir de todos modos"]);
        if (otra === 1) { sumar({ aciertos: 0, total: 3 }); break; }
      }
    } else if (b.orales.length) {
      sumar(await comision(mezclar(b.orales)[0]).then((r) => ({ aciertos: r.claves, total: r.total })));
    }
    await revelar();
    if (g.jefe.despues.length) await conversar(g.jefe.despues, [g.jefe.quien, ...(g.jefe.juez ? [g.jefe.juez.p] : []), ...(g.jefe.extras ?? []).map((x) => x.p)]);
    fichas(0.7, 1);
    m.bloquear(false);
    sonido.musica("musica-barrio");
  });

  await paso("cierre", async () => {
    aLas(m, 19, 45);
    await ir(m, "ciudad", "Sal a la ciudad: terminó la jornada");
    m.meta(null);
    ui.objetivo(null);
    m.bloquear(true);
    while (siguiente()) await revelar();
    await espera(400);
    await ui.eva(g.cierre);
    m.bloquear(false);
  });

  const k = marca.total ? marca.aciertos / marca.total : 1;
  const estrellas = k >= 0.9 ? 3 : k >= 0.65 ? 2 : 1;
  d.estrellas = { ...(d.estrellas ?? {}), [n]: Math.max(estrellas, d.estrellas?.[n] ?? 0) };
  if (!d.completadas.includes(n)) d.completadas.push(n);
  d.paso = `fin-j${n}`;
  guardar();
  if (estrellas === 3) logro("tres-estrellas");
  if (d.completadas.length >= 6) logro("mitad");
  return estrellas;
}
