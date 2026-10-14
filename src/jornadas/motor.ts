// El motor de las jornadas. Cada jornada (un módulo del banco) tiene su propia
// historia y el mismo pulso, pensado para que se juegue más de lo que se lee:
//
//   09:00  Encargo: apareces ya en el lugar y la conversación empieza sola.
//          Una Apuesta EVA en el acto.
//   11:00  Mesa: tres expedientes (más un caso que vuelve, si dejaste uno mal).
//   15:00  Terreno: una misión caminando (carrera, inspección, investigación,
//          recorrido) o, si la jornada no tiene, un minijuego con alguien.
//   16:30  Urgentes: suena el teléfono y llegan dos expedientes más, ahí mismo.
//   17:40  Jefe: contrainterrogatorio («¡Objeción!») o comisión oral.
//   19:45  Cierre: la ciudad de noche y EVA.
//
// «Ir ›» lleva directo al siguiente lugar: caminar es opcional. El guion de
// cada jornada (guiones.ts) pone personas, lugares y frases; el Derecho sale
// del banco del módulo. Cada parte es un «paso» con nombre: si se cierra el
// juego a mitad de jornada, al volver se retoma en el primero sin hacer.
import type { Mundo, NombreMapa } from "../game/scenes/Mundo";
import type { Dir } from "../game/actors/Personaje";
import { e, guardar, hora, DIA } from "../game/estado";
import { banco } from "../content/banco";
import { modulo } from "../content/modulos";
import type { Afirmacion, BancoModulo, Expediente, Hallazgo } from "../content/tipos";
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
import { MISIONES } from "./misiones";
import { buscar } from "./busqueda";
import { acierto, fallo, casoQueVuelve, comentario, mover, pintarMedidores } from "./consecuencias";

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
  /** La Apuesta EVA del encargo (sobre el segundo hallazgo). */
  apuesta: string;
  /** Dónde se sienta uno a timbrar y qué se dice antes. */
  mesa: { lugar: NombreMapa; punto: string; objetivo: string; dichos: Dicho[]; con?: { p: Personaje; punto: string } };
  /** Trabajo en terreno: una persona, un problema y un minijuego (si la jornada no tiene misión). */
  terreno: Escena & { juego: "cadena" | "columnas"; despues: Dicho[] };
  /** El jefe: contrainterrogatorio o comisión oral. `juez` preside si lo hay. */
  jefe: Escena & { tipo: "duelo" | "comision"; juez?: { p: Personaje; punto: string }; despues: Dicho[]; mania?: string };
  /** Lo último que dice EVA. */
  cierre: string[];
};

type Marcador = { aciertos: number; total: number };

const P = (m: Mundo, n: string) => { try { return m.punto(n); } catch { return m.punto(m.mapa === "ciudad" ? "inicio" : "entrada"); } };

/**
 * Pasa a un lugar. Muestra el objetivo y la flecha (se puede caminar), y deja
 * listo el atajo «Ir ›» que lleva directo adentro.
 */
export async function ir(m: Mundo, lugar: NombreMapa, objetivo: string) {
  if (m.mapa === lugar) return;
  m.cerradas.delete(lugar);
  ui.objetivo(objetivo);
  const directo = () => void m.irA(lugar, lugar === "ciudad" ? `puerta-${m.mapa}` : "entrada", lugar === "ciudad" ? "abajo" : "arriba");
  m.atajo = directo;
  if (m.mapa !== "ciudad") {
    // Desde un interior: la salida, y en la calle, la puerta del destino.
    m.puedeSalir = true;
    m.meta(() => P(m, "salida"));
    await Promise.race([m.entrarA("ciudad"), m.entrarA(lugar)]);
    if (m.mapa === lugar || lugar === "ciudad") { m.atajo = null; m.meta(null); return; }
    m.atajo = directo;
  }
  m.meta(() => P(m, `puerta-${lugar}`));
  await m.entrarA(lugar);
  m.atajo = null;
  m.meta(null);
}

/** Aparece directo en un lugar (sin caminar): para empezar jugando. */
async function aparecer(m: Mundo, lugar: NombreMapa) {
  if (m.mapa === lugar) return;
  m.cerradas.delete(lugar);
  await m.irA(lugar, lugar === "ciudad" ? "inicio" : "entrada", "arriba");
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

/**
 * Pone a la persona de una escena y conversa. Con `auto`, la conversación
 * empieza sola (la persona viene a tu encuentro); si no, hay que hablarle.
 */
async function encontrar(m: Mundo, s: Escena, auto = false) {
  for (const x of s.extras ?? []) m.npc(x.p.id, x.p.a, P(m, x.punto), x.dir ?? "abajo");
  const n = m.npc(s.quien.id, s.quien.a, P(m, s.punto), s.dir ?? "abajo");
  if (auto) {
    m.bloquear(true);
    await espera(350);
    if (m.jugador) n.mirarHacia(m.jugador.x, m.jugador.y);
  } else {
    m.interactuar(s.quien.id, `Hablar con ${s.quien.nombre.split(" ")[0]}`, () => ({ x: n.x, y: n.y }), undefined, 22);
    m.meta(() => ({ x: n.x, y: n.y - 4 }));
    ui.objetivo(`Habla con ${s.quien.nombre}`);
    await m.esperar(s.quien.id);
    m.meta(null);
    m.bloquear(true);
  }
  ui.objetivo(null);
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

/** Seis afirmaciones para el contrainterrogatorio: tres verdaderas y tres falsas, de hallazgos distintos. */
function testimonio(b: BancoModulo): Afirmacion[] {
  const falsas = mezclar(b.afirmaciones.filter((a) => !a.verdad));
  const verdaderas = mezclar(b.afirmaciones.filter((a) => a.verdad));
  const usadas = new Set<string>();
  const tomar = (l: Afirmacion[], k: number) => { const r: Afirmacion[] = []; for (const a of l) { if (r.length >= k) break; if (usadas.has(a.hallazgo)) continue; usadas.add(a.hallazgo); r.push(a); } return r; };
  const f = tomar(falsas, 3), v = tomar(verdaderas, 3);
  return mezclar([...f, ...v]);
}

/** Juega una jornada completa (o lo que le falte). Devuelve las estrellas (1 a 3). */
export async function jugarJornada(m: Mundo, g: Guion): Promise<number> {
  const n = g.n, mod = modulo(n), b: BancoModulo = banco(n);
  const d = e();
  d.jornada = n;
  d.fecha = `Jornada ${n} · ${DIA[(n - 1) % 5]}`;
  ui.hud({ fecha: d.fecha, hora: hora() });
  pintarMedidores();
  m.bloquear(false); // el mundo nace quieto (detrás del título): la jornada lo suelta
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
  /** La Mesa con sus consecuencias: los errores quedan anotados y vuelven más adelante. */
  const timbrar = async (titulo: string, exps: Expediente[]) => {
    const r = await mesa({
      titulo, expedientes: exps,
      alAcertar: async (ex) => { acierto(ex); const h = b.hallazgos.find((x) => x.id === ex.hallazgo); if (h && !d.hallazgos.includes(h.id)) await descubrir(h.id); },
      alFallar: (ex) => fallo({ ...ex, id: ex.id.replace(/^vuelve-/, "") }),
    });
    sumar(r);
  };
  // Los expedientes del día: tres en la Mesa y dos urgentes por la tarde.
  const exps = b.expedientes;

  await paso("cartel", async () => {
    aLas(m, 8, 55);
    sonido.musica("musica-potestas");
    await ui.tiempo(`Jornada ${n}`, `${mod.titulo} · ${mod.lema}`);
  });

  await paso("encargo", async () => {
    aLas(m, 9, 0);
    // Se empieza jugando: ya estás en el lugar y la conversación arranca sola.
    await aparecer(m, g.encargo.lugar);
    await encontrar(m, g.encargo, true);
    await revelar(b.hallazgos[0]);
    if (g.encargo.eva.length) await ui.eva(g.encargo.eva.slice(0, 1));
    const h = b.hallazgos[1];
    const af = h ? mezclar(b.afirmaciones.filter((a) => a.hallazgo === h.id))[0] : undefined;
    if (af) await apostar(`${g.apuesta} «${af.texto}»`, ["Verdadero", "Falso"], af.verdad ? 0 : 1);
    await revelar(h);
  });

  await paso("mesa", async () => {
    aLas(m, 11, 0);
    await ir(m, g.mesa.lugar, g.mesa.objetivo);
    if (g.mesa.con) m.npc(g.mesa.con.p.id, g.mesa.con.p.a, P(m, g.mesa.con.punto), "abajo");
    m.interactuar("mesa", "Sentarse a timbrar", () => P(m, g.mesa.punto), undefined, 24);
    m.meta(() => P(m, g.mesa.punto));
    ui.objetivo("Siéntate a resolver la Mesa");
    m.atajo = () => m.viajar();
    await m.esperar("mesa");
    ui.objetivo(null);
    m.atajo = null;
    m.meta(null);
    m.bloquear(true);
    if (g.mesa.dichos.length) await conversar(g.mesa.dichos.slice(0, 1), g.mesa.con ? [g.mesa.con.p] : []);
    const vuelve = casoQueVuelve(n);
    sonido.musica("musica-mesa");
    await timbrar(`Mesa · ${mod.titulo}`, [...(vuelve ? [vuelve] : []), ...exps.slice(0, 3)]);
    fichas(0, 0.4);
    sonido.musica("musica-potestas");
    m.bloquear(false);
  });

  await paso("terreno", async () => {
    aLas(m, 15, 0);
    const mision = MISIONES[n];
    if (mision) {
      sumar(await buscar(m, mision));
      await revelar();
    } else {
      await ir(m, g.terreno.lugar, g.terreno.objetivo);
      await encontrar(m, g.terreno);
      m.bloquear(true);
      if (g.terreno.juego === "cadena" && b.cadenas.length) { const r = await cadena(b.cadenas[0]); sumar({ aciertos: r.perfecto ? 1 : 0, total: 1 }); }
      else if (b.columnas.length) sumar(await columnas(b.columnas[0]));
      else if (b.cadenas.length) { const r = await cadena(b.cadenas[0]); sumar({ aciertos: r.perfecto ? 1 : 0, total: 1 }); }
      await revelar();
      if (g.terreno.despues.length) await conversar(g.terreno.despues.slice(0, 1), [g.terreno.quien, ...(g.terreno.extras ?? []).map((x) => x.p)]);
      m.bloquear(false);
    }
    fichas(0.4, 0.7);
  });

  await paso("urgentes", async () => {
    aLas(m, 16, 30);
    const quedan = exps.slice(3, 5);
    if (!quedan.length) return;
    // Los urgentes llegan donde estés: sin caminar.
    m.bloquear(true);
    await ui.telefono("Marisol · Oficina de Partes", `Llegaron ${quedan.length} expedientes urgentes. Te los mando al celular: tímbralos ahí mismo.`);
    sonido.musica("musica-urgencia");
    await timbrar("Urgentes de la tarde", quedan);
    sonido.musica("musica-potestas");
    m.bloquear(false);
  });

  await paso("jefe", async () => {
    aLas(m, 17, 40);
    await ir(m, g.jefe.lugar, g.jefe.objetivo);
    if (g.jefe.juez) m.npc(g.jefe.juez.p.id, g.jefe.juez.p.a, P(m, g.jefe.juez.punto), "abajo");
    sonido.musica("musica-tribunal");
    await encontrar(m, { ...g.jefe, dichos: g.jefe.dichos.slice(0, 2), extras: [...(g.jefe.extras ?? []), ...(g.jefe.juez ? [{ p: g.jefe.juez.p, punto: g.jefe.juez.punto }] : [])] });
    m.bloquear(true);
    if (g.jefe.tipo === "duelo") {
      const r = await duelo({
        rival: { nombre: g.jefe.quien.nombre, cargo: g.jefe.quien.cargo, a: g.jefe.quien.a },
        juez: g.jefe.juez ? { nombre: g.jefe.juez.p.nombre, a: g.jefe.juez.p.a } : undefined,
        afirmaciones: testimonio(b), hallazgos: b.hallazgos, titulo: `Contrainterrogatorio · ${mod.titulo}`, mania: g.jefe.mania,
      });
      sumar({ aciertos: r.gano ? (r.perfecto ? 3 : 2) : 0, total: 3 });
      mover(r.gano ? 2 : -2, r.gano ? 8 : -8);
    } else if (b.orales.length) {
      const r = await comision(mezclar(b.orales)[0]);
      sumar({ aciertos: r.claves, total: r.total });
      mover(0, r.claves * 2 >= r.total ? 6 : -6);
    }
    await revelar();
    if (g.jefe.despues.length) await conversar(g.jefe.despues.slice(0, 2), [g.jefe.quien, ...(g.jefe.juez ? [g.jefe.juez.p] : []), ...(g.jefe.extras ?? []).map((x) => x.p)]);
    fichas(0.7, 1);
    m.bloquear(false);
    sonido.musica("musica-potestas");
  });

  await paso("cierre", async () => {
    aLas(m, 19, 45);
    // Directo a la ciudad de noche (las ventanas encendidas), sin caminar.
    ui.objetivo(null);
    await aparecer(m, "ciudad");
    m.bloquear(true);
    while (siguiente()) await revelar();
    await espera(300);
    const extra = comentario();
    await ui.eva([...g.cierre.slice(0, 1), ...(extra ? [extra] : [])]);
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
