// El Duelo: un contrainterrogatorio a lo «Ace Attorney». El rival (el abogado
// del CDE, el Contralor, la Ministra) declara una serie de afirmaciones, unas
// ciertas y otras falsas. Se recorre su testimonio (← →) y en cada declaración
// se decide: «Dejar pasar» o «¡OBJECIÓN!». Objetar abre el Expediente: hay que
// presentar el hallazgo que contradice lo declarado. Acertar le quita
// convicción al rival; objetar una verdad, o con la prueba equivocada, te la
// quita a ti (aguantas tres). El testimonio da vueltas hasta que cae cada
// falsedad. Si pierdes, puedes pedir la palabra una vez.
import "./minijuegos.css";
import gsap from "gsap";
import type { Afirmacion, Hallazgo } from "../content/tipos";
import { HALLAZGOS } from "../content/hallazgos";
import { retrato, type Apariencia } from "../game/art/characters";
import { estado } from "../game/estado";
import { ajustes, holgura, letrasPorSegundo, pausa } from "../juego/ajustes";
import { ganarSaber, logro } from "../juego/progreso";
import { confeti, destello, flotar } from "./efectos";
import { sonido } from "./sonido";
import { ui } from "./ui";

const TIEMPO = 20; // segundos por declaración (sólo hace avanzar el testimonio)
const VIDA_YO = 3;
const POR_REFUTAR = 60; // Saber por declaración refutada

/** Lo que dice el rival cuando le tumban una declaración. */
const ACUSA_GOLPE = [
  "¡Ngh…! Eso… eso lo dije sin pensar.",
  "¡¿Qué?! …Bueno, quizás me apresuré.",
  "¡Gah! Retiro esa parte, señoría.",
  "Hmpf. Un detalle menor. Sigo.",
  "¡Objeción a su objeción…! No, espere. Continúo.",
];
/** Lo que dice cuando el tribunal te rechaza la objeción. */
const SE_RIE = [
  "Como iba diciendo…",
  "¿Terminó, colega? Prosigo.",
  "Je. Le recomiendo leer el expediente.",
];

function el<K extends keyof HTMLElementTagNameMap>(tag: K, clase = "", texto?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (clase) e.className = clase;
  if (texto !== undefined) e.textContent = texto;
  return e;
}
const azar = <T>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];
const espera = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const sacudir = (x: HTMLElement) => { if (ajustes.menosMovimiento) return; x.classList.remove("mj-sacude"); void x.offsetWidth; x.classList.add("mj-sacude"); };
const centro = (e: Element) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
const YO_POR_DEFECTO: Apariencia = { piel: "#eab68f", pelo: "#2b2026", peinado: "largo", polera: "#3b3f4f", pantalon: "#2b2026" };

type Fase = "intro" | "testimonio" | "expediente" | "anima" | "lee" | "fin" | "cerrando";

export type DueloOpciones = {
  rival: { nombre: string; cargo: string; a: Apariencia };
  /** Quien preside: dice «No ha lugar» cuando la objeción no corresponde. */
  juez?: { nombre: string; a: Apariencia };
  /** El testimonio, en orden (conviene mezclar verdaderas y falsas; típicamente 6). */
  afirmaciones: Afirmacion[];
  /** Las pruebas del Expediente. Deben incluir el hallazgo de cada afirmación falsa. */
  hallazgos: Hallazgo[];
  titulo?: string;
  /** La manía del rival: se ve bajo su nombre y la dice al empezar. */
  mania?: string;
};

/** Contrainterrogatorio contra un rival. */
export function duelo(o: DueloOpciones): Promise<{ gano: boolean; perfecto: boolean }> {
  const afs = o.afirmaciones;
  const N = afs.length;
  const F = afs.filter((a) => !a.verdad).length;
  const tituloTxt = o.titulo ?? "Contrainterrogatorio";

  // Las pruebas: las dadas y, por si faltara, la que refuta cada falsedad.
  const pruebas: Hallazgo[] = [...o.hallazgos];
  for (const a of afs) {
    if (a.verdad || pruebas.some((h) => h.id === a.hallazgo)) continue;
    pruebas.push(HALLAZGOS.find((h) => h.id === a.hallazgo) ?? { id: a.hallazgo, modulo: a.modulo, titulo: "Prueba sin rotular", texto: "", norma: "", simple: "Un papel del expediente que nadie ha leído con calma." });
  }
  const tengo = (h: Hallazgo) => !!estado?.hallazgos.includes(h.id);

  // ── Armado ─────────────────────────────────────────────────────────────
  const raiz = el("div", "mj-capa mj-duelo");
  raiz.id = "mj-duelo";
  const hoja = el("div", "mj-hoja mj-duelo-hoja");
  hoja.setAttribute("role", "dialog");
  hoja.setAttribute("aria-label", tituloTxt);

  const cab = el("header", "mj-cab");
  const titulo = el("h3", "mj-titulo");
  titulo.append(el("span", "mj-titulo-ico", "⚖"), el("span", "", tituloTxt));
  const marcador = el("div", "mj-marcador");
  const cuentaEl = el("span", "mj-cuenta");
  const saberEl = el("span", "mj-saber");
  const saberN = el("b", "", "0");
  saberEl.append(saberN, el("small", "", "Saber"));
  marcador.append(cuentaEl, saberEl);
  cab.append(titulo, marcador);

  const juego = el("div", "mj-duelo-juego");
  const ring = el("div", "mj-ring");
  const luchador = (lado: "yo" | "rival", nombre: string, cargo: string, a: Apariencia, vida: number, mania?: string) => {
    const caja = el("div", `mj-luchador ${lado}`);
    const marco = el("div", "mj-marco");
    const img = el("img");
    img.alt = "";
    img.src = retrato(a, 6);
    marco.append(img);
    const ficha = el("div", "mj-ficha");
    const barra = el("div", "mj-conviccion");
    barra.setAttribute("role", "meter");
    barra.setAttribute("aria-label", `Convicción de ${nombre}`);
    barra.setAttribute("aria-valuemin", "0");
    barra.setAttribute("aria-valuemax", String(vida));
    const segs = Array.from({ length: vida }, () => { const s = el("i"); barra.append(s); return s; });
    ficha.append(el("b", "", nombre), el("small", "", cargo));
    if (mania) ficha.append(el("small", "mj-mania", `«${mania}»`));
    ficha.append(barra);
    caja.append(marco, ficha);
    return { caja, marco, segs, barra };
  };
  const nombreYo = estado?.nombre ?? "Tú";
  const yo = luchador("yo", nombreYo, "Tu convicción", estado?.apariencia ?? YO_POR_DEFECTO, VIDA_YO);
  const rival = luchador("rival", o.rival.nombre, o.rival.cargo, o.rival.a, Math.max(1, F), o.mania);
  // Al centro, quien preside (o un «VS» si no hay juez).
  const centroRing = el("div", "mj-ring-centro");
  let juezMarco: HTMLElement | null = null;
  if (o.juez) {
    const juez = el("div", "mj-juez");
    juezMarco = el("div", "mj-marco mj-juez-marco");
    const img = el("img");
    img.alt = "";
    img.src = retrato(o.juez.a, 4);
    juezMarco.append(img, el("span", "mj-mazo", "🔨"));
    juez.append(juezMarco, el("small", "", o.juez.nombre));
    centroRing.append(juez);
  } else centroRing.append(el("span", "mj-vs", "VS"));
  ring.append(yo.caja, centroRing, rival.caja);

  // Puntos del testimonio: uno por declaración.
  const puntos = el("div", "mj-puntos mj-testimonio-puntos");
  puntos.setAttribute("aria-hidden", "true");
  const pips = afs.map(() => { const i = el("i"); puntos.append(i); return i; });

  const bocadillo = el("div", "mj-bocadillo rival mj-declaracion");
  bocadillo.setAttribute("aria-live", "polite");
  const bocCab = el("div", "mj-decl-cab");
  const bocQuien = el("b", "", o.rival.nombre);
  const bocN = el("span", "mj-decl-n");
  const vueltaEl = el("span", "mj-vuelta");
  bocCab.append(bocQuien, bocN, vueltaEl);
  const bocP = el("p");
  bocadillo.append(bocCab, bocP);

  const relojEl = el("div", "mj-reloj");
  const relojPista = el("span", "mj-reloj-pista");
  const relojBarra = el("i");
  relojPista.append(relojBarra);
  relojEl.append(relojPista);
  relojEl.hidden = true;

  const acciones = el("div", "mj-duelo-acciones");
  const boton = (clase: string, texto: string, tecla?: string, etiqueta?: string) => {
    const b = el("button", clase);
    b.type = "button";
    if (tecla) b.append(el("span", "mj-tecla", tecla));
    b.append(el("span", "mj-accion-t", texto));
    if (etiqueta) b.setAttribute("aria-label", etiqueta);
    acciones.append(b);
    return b;
  };
  const bAtras = boton("mj-flecha", "‹", undefined, "Declaración anterior");
  const bPasar = boton("mj-dejar", "Dejar pasar", "1");
  const bObjetar = boton("mj-objetar", "¡OBJECIÓN!", "2");
  const bAdelante = boton("mj-flecha", "›", undefined, "Declaración siguiente");
  const botonesAcc = [bPasar, bObjetar];

  const veredicto = el("div", "mj-veredicto");
  veredicto.hidden = true;
  veredicto.setAttribute("aria-live", "polite");
  juego.append(ring, puntos, bocadillo, relojEl, acciones, veredicto);

  const finalEl = el("div", "mj-final");
  finalEl.hidden = true;

  // El Expediente: otra hoja, encima de la del duelo.
  const exp = el("div", "mj-hoja mj-exp");
  exp.hidden = true;
  exp.setAttribute("role", "dialog");
  exp.setAttribute("aria-label", "Expediente: presenta una prueba");
  const expCab = el("header", "mj-cab");
  const expTit = el("h3", "mj-titulo");
  expTit.append(el("span", "mj-titulo-ico", "📁"), el("span", "", "Expediente"));
  const bVolver = el("button", "boton mj-exp-volver", "Volver");
  bVolver.type = "button";
  expCab.append(expTit, bVolver);
  const expCita = el("p", "mj-exp-cita");
  const expAyuda = el("p", "mj-ayuda", "¿Qué prueba contradice esa declaración? Elígela y preséntala.");
  const rejilla = el("div", "mj-pruebas");
  const cartas = pruebas.map((h, k) => {
    const b = el("button", `mj-prueba${tengo(h) ? "" : " sin-investigar"}`);
    b.type = "button";
    const cab = el("span", "mj-prueba-cab");
    cab.append(el("span", "mj-prueba-n", String(k + 1)), el("span", "mj-prueba-estado", tengo(h) ? "✓ Investigado" : "Sin investigar"));
    b.append(cab, el("b", "mj-prueba-t", h.titulo), el("span", "mj-prueba-s", h.simple || h.texto));
    if (h.norma) b.append(el("small", "mj-prueba-norma", h.norma));
    rejilla.append(b);
    return b;
  });
  const expPie = el("div", "mj-exp-pie");
  const bPresentar = el("button", "boton grande mj-presentar", "¡Presentar!");
  bPresentar.type = "button";
  expPie.append(bPresentar);
  exp.append(expCab, expCita, expAyuda, rejilla, expPie);

  hoja.append(cab, juego, finalEl);
  raiz.append(hoja, exp);
  document.getElementById("ui")!.append(raiz);
  raiz.addEventListener("click", () => (document.activeElement as HTMLElement | null)?.blur?.(), true);
  gsap.fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  gsap.fromTo(hoja, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.4)" });
  if (!ajustes.menosMovimiento) {
    gsap.fromTo(yo.caja, { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, delay: 0.1, ease: "back.out(1.6)" });
    gsap.fromTo(rival.caja, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, delay: 0.1, ease: "back.out(1.6)" });
    gsap.fromTo(centroRing, { scale: 2.4, opacity: 0, rotation: -14 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.35, delay: 0.45, ease: "back.out(2.5)" });
  }

  return new Promise((fin) => {
    let vidaYo = VIDA_YO, ganado = 0, danoTotal = 0;
    let idx = 0, vuelta = 1, turno = 0;
    let focoAcc = 0, focoCarta = 0, focoFin = 0;
    let reintentado = false;
    let fase: Fase = "intro";
    let tras: "mismo" | "siguiente" = "siguiente";
    const refutadas = new Set<number>();
    let botonesFin: HTMLButtonElement[] = [];
    let reloj: gsap.core.Tween | null = null;
    let tipeo: gsap.core.Tween | null = null;
    let acabarTipeo: (() => void) | null = null;
    const vidaRival = () => F - refutadas.size;

    const pintarSaber = () => {
      const v = { n: Number(saberN.textContent) || 0 };
      gsap.to(v, { n: ganado, duration: 0.5, onUpdate: () => { saberN.textContent = String(Math.round(v.n)); } });
      gsap.fromTo(saberEl, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
    };
    const pintarBarras = () => {
      yo.segs.forEach((s, k) => s.classList.toggle("vacia", k >= vidaYo));
      rival.segs.forEach((s, k) => s.classList.toggle("vacia", k >= vidaRival()));
      yo.barra.setAttribute("aria-valuenow", String(vidaYo));
      rival.barra.setAttribute("aria-valuenow", String(vidaRival()));
      yo.caja.classList.toggle("en-peligro", vidaYo === 1);
    };
    const pintarPuntos = () => {
      pips.forEach((p, k) => {
        p.classList.toggle("actual", k === idx && fase !== "fin");
        p.classList.toggle("refutada", refutadas.has(k));
      });
      cuentaEl.textContent = `Declaración ${idx + 1}/${N}`;
      bocN.textContent = `${idx + 1} de ${N}`;
    };
    const marcarFoco = () => {
      botonesAcc.forEach((b, k) => b.classList.toggle("foco", fase === "testimonio" && k === focoAcc));
      cartas.forEach((b, k) => { b.classList.toggle("foco", k === focoCarta); b.setAttribute("aria-pressed", String(k === focoCarta)); });
      botonesFin.forEach((b, k) => b.classList.toggle("foco", fase === "fin" && k === focoFin));
    };
    const habilitar = (si: boolean) => { for (const b of [bAtras, bPasar, bObjetar, bAdelante]) b.disabled = !si; };

    /** Lo que dice el rival se escribe rápido; tocar el bocadillo lo completa. */
    const escribir = (texto: string) => new Promise<void>((r) => {
      acabarTipeo?.();
      tipeo?.kill();
      const lps = Math.max(letrasPorSegundo(), 90);
      const v = { n: 0 };
      let ultimo = 0;
      bocP.textContent = "";
      bocadillo.setAttribute("aria-label", `${o.rival.nombre}: ${texto}`);
      const listo = () => { bocP.textContent = texto; tipeo = null; acabarTipeo = null; r(); };
      acabarTipeo = listo;
      tipeo = gsap.to(v, {
        n: texto.length, duration: Number.isFinite(lps) ? texto.length / lps : 0, ease: "none",
        onUpdate: () => {
          const k = Math.round(v.n);
          bocP.textContent = texto.slice(0, k);
          if (k - ultimo >= 3) { ultimo = k; sonido.blip("voz"); }
        },
        onComplete: listo,
      });
    });
    const completarTipeo = () => { if (tipeo) { tipeo.kill(); acabarTipeo?.(); } };

    /** Algo vuela de un lado al otro: tu prueba o el «no ha lugar» del tribunal. */
    const proyectil = async (desde: Element, hacia: Element, texto: string, quien: "yo" | "rival") => {
      const a = centro(desde), b = centro(hacia);
      const p = el("div", `mj-proyectil ${quien}`, texto);
      p.style.left = `${a.x}px`; p.style.top = `${a.y}px`;
      document.getElementById("ui")!.append(p);
      if (ajustes.menosMovimiento) {
        gsap.set(p, { xPercent: -50, yPercent: -50, x: b.x - a.x, y: b.y - a.y });
        await espera(160);
      } else {
        const alto = Math.min(120, Math.abs(b.x - a.x) * 0.3 + 40);
        await gsap.fromTo(p, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.4, rotation: quien === "yo" ? -14 : 14 }, {
          keyframes: [
            { x: (b.x - a.x) * 0.5, y: (b.y - a.y) * 0.5 - alto, scale: 1.15, rotation: 0, duration: 0.24, ease: "power1.out" },
            { x: b.x - a.x, y: b.y - a.y, scale: 0.9, rotation: quien === "yo" ? 10 : -10, duration: 0.2, ease: "power2.in" },
          ],
        });
      }
      p.remove();
      return b;
    };

    /** El grito que cruza la pantalla: «¡OBJECIÓN!» o el aviso de «Testimonio». */
    const grito = async (texto: string, tipo: "objecion" | "testimonio") => {
      const g = el("div", `mj-grito ${tipo}`);
      g.setAttribute("aria-hidden", "true");
      g.append(el("span", "", texto));
      document.getElementById("ui")!.append(g);
      if (tipo === "objecion") { sonido.efecto("golpe"); destello("rgba(255, 255, 255, 0.7)"); } else sonido.efecto("campana");
      if (ajustes.menosMovimiento) {
        gsap.set(g, { xPercent: -50, yPercent: -50, opacity: 1 });
        await espera(tipo === "objecion" ? 750 : 900);
      } else {
        await gsap.fromTo(g, { xPercent: -50, yPercent: -50, scale: tipo === "objecion" ? 2.6 : 0.6, opacity: 0, rotation: tipo === "objecion" ? -12 : 0 },
          { scale: 1, opacity: 1, rotation: tipo === "objecion" ? -5 : 0, duration: tipo === "objecion" ? 0.2 : 0.3, ease: tipo === "objecion" ? "power3.in" : "back.out(2)" });
        if (tipo === "objecion") { sacudir(hoja); gsap.fromTo(g, { x: -6 }, { x: 0, duration: 0.35, ease: "elastic.out(1.2, 0.25)" }); }
        await espera(tipo === "objecion" ? 620 : 700);
      }
      await gsap.to(g, { opacity: 0, scale: ajustes.menosMovimiento ? 1 : 1.12, duration: 0.2 });
      g.remove();
    };

    const impacto = (lado: typeof yo, seg: HTMLElement | undefined) => {
      sonido.efecto("golpe");
      lado.marco.classList.remove("golpeado"); void lado.marco.offsetWidth; lado.marco.classList.add("golpeado");
      if (!ajustes.menosMovimiento) gsap.fromTo(lado.caja, { x: lado === rival ? 16 : -16 }, { x: 0, duration: 0.55, ease: "elastic.out(1.2, 0.3)" });
      if (seg) gsap.fromTo(seg, { scale: 1.6 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
      pintarBarras();
    };

    // ── El reloj: sólo hace avanzar el testimonio, nunca castiga ────────────
    const pararReloj = () => { reloj?.kill(); reloj = null; };
    const iniciarReloj = () => {
      pararReloj();
      relojEl.classList.remove("poco");
      gsap.set(relojBarra, { scaleX: 1 });
      if (ajustes.modoHistoria) return;
      reloj = gsap.fromTo(relojBarra, { scaleX: 1 }, {
        scaleX: 0, duration: TIEMPO * holgura(), ease: "none",
        onUpdate: () => { if (reloj && reloj.progress() > 0.75) relojEl.classList.add("poco"); },
        onComplete: () => { reloj = null; if (fase === "testimonio") mover(1); },
      });
    };

    // ── El testimonio ──────────────────────────────────────────────────────
    const pendientes = () => afs.map((_, k) => k).filter((k) => !refutadas.has(k));
    /** La siguiente declaración en pie después de «desde» (da la vuelta si hace falta). */
    const siguienteDe = (desde: number) => {
      const p = pendientes();
      const k = p.find((j) => j > desde);
      if (k !== undefined) return { k, vuelve: false };
      return { k: p[0], vuelve: true };
    };

    const mostrar = async (dir: number) => {
      fase = "testimonio";
      const este = ++turno;
      pararReloj();
      veredicto.hidden = true;
      acciones.hidden = false;
      relojEl.hidden = ajustes.modoHistoria;
      habilitar(true);
      const p = pendientes();
      bAtras.disabled = p.indexOf(idx) <= 0;
      pintarPuntos();
      marcarFoco();
      if (!ajustes.menosMovimiento) {
        gsap.fromTo(bocP, { x: dir * 26, opacity: 0 }, { x: 0, opacity: 1, duration: 0.2, ease: "power2.out" });
        gsap.fromTo(rival.caja, { x: 0 }, { x: -14, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
      }
      await escribir(afs[idx].texto);
      if (este !== turno || fase !== "testimonio") return;
      iniciarReloj();
    };

    const avisarVuelta = () => {
      vueltaEl.textContent = `Vuelta ${vuelta}: lo repite`;
      gsap.fromTo(vueltaEl, { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.5)" });
    };

    const mover = (d: 1 | -1) => {
      if (fase !== "testimonio") return;
      const p = pendientes();
      const pos = p.indexOf(idx);
      if (d === -1) {
        if (pos <= 0) { if (!ajustes.menosMovimiento) gsap.fromTo(bocadillo, { x: -6 }, { x: 0, duration: 0.3, ease: "elastic.out(1.2, 0.3)" }); return; }
        idx = p[pos - 1];
      } else {
        const s = siguienteDe(idx);
        idx = s.k;
        if (s.vuelve) { vuelta++; avisarVuelta(); }
      }
      sonido.efecto("mover");
      void mostrar(d);
    };

    const dejarPasar = () => {
      if (fase !== "testimonio") return;
      completarTipeo();
      mover(1);
    };

    // ── El Expediente ──────────────────────────────────────────────────────
    const abrirExpediente = () => {
      if (fase !== "testimonio") return;
      completarTipeo();
      pararReloj();
      fase = "expediente";
      sonido.efecto("papel");
      expCita.textContent = `«${afs[idx].texto}»`;
      hoja.classList.add("mj-atenuada");
      exp.hidden = false;
      exp.scrollTop = 0;
      marcarFoco();
      gsap.fromTo(exp, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "back.out(1.6)" });
      gsap.fromTo(cartas, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, stagger: 0.03, ease: "power2.out" });
    };
    const ocultarExpediente = () => {
      exp.hidden = true;
      hoja.classList.remove("mj-atenuada");
    };
    const cerrarExpediente = () => {
      if (fase !== "expediente") return;
      sonido.efecto("mover");
      ocultarExpediente();
      fase = "testimonio";
      marcarFoco();
      iniciarReloj();
    };
    const elegirCarta = (k: number) => {
      if (fase !== "expediente") return;
      if (k === focoCarta) return void presentar();
      focoCarta = k;
      sonido.efecto("mover");
      marcarFoco();
    };

    const presentar = async () => {
      if (fase !== "expediente") return;
      fase = "anima";
      const h = pruebas[focoCarta];
      const a = afs[idx];
      sonido.efecto("elegir");
      ocultarExpediente();
      habilitar(false);
      await grito("¡OBJECIÓN!", "objecion");
      const bien = !a.verdad && h.id === a.hallazgo;
      veredicto.replaceChildren();
      veredicto.dataset.bien = String(bien);
      const presentada = el("p", "mj-presentada");
      presentada.append(el("b", "", "Presentaste: "), document.createTextNode(`«${h.titulo}»${h.norma ? ` (${h.norma})` : ""}`));
      if (bien) {
        refutadas.add(idx);
        ganado += POR_REFUTAR;
        const pos = await proyectil(yo.marco, rival.marco, "¡TOMA ESTO!", "yo");
        impacto(rival, rival.segs[vidaRival()]);
        flotar(`+${POR_REFUTAR} Saber`, pos.x - 40, pos.y - 70, "saber mj-flota");
        if (!ajustes.menosMovimiento) confeti(pos.x, pos.y, 14);
        pintarSaber();
        pintarPuntos();
        void ui.sello("¡HA LUGAR!", true);
        const cita = el("p", "mj-cita-caida", `«${a.texto}»`);
        const arg = el("p", "mj-ver-correcto");
        arg.append(el("b", "", "Tu argumento: "), document.createTextNode(a.porque));
        veredicto.append(el("p", "mj-ver-titulo", "¡Ha lugar! La declaración se cae."), cita, presentada, arg);
        tras = "siguiente";
        void escribir(vidaRival() > 0 ? azar(ACUSA_GOLPE) : "¡No…! ¡Mi caso entero…!");
      } else {
        danoTotal++;
        vidaYo--;
        const quien = o.juez ? o.juez.nombre : "El tribunal";
        await proyectil(juezMarco ?? rival.marco, yo.marco, "¡NO HA LUGAR!", "rival");
        impacto(yo, yo.segs[vidaYo]);
        sonido.efecto("grieta");
        sacudir(hoja);
        const tit = a.verdad ? `${quien}: «No ha lugar». Esa declaración es cierta.` : `${quien}: «No ha lugar». Esa prueba no la contradice.`;
        veredicto.append(el("p", "mj-ver-titulo", tit));
        if (!a.verdad) veredicto.append(presentada);
        const por = el("p", "mj-ver-porque");
        por.append(el("b", "", "Por qué: "), document.createTextNode(a.porque));
        veredicto.append(por);
        if (vidaYo > 0) veredicto.append(el("p", "mj-nota-rival", a.verdad ? "Lo que es verdad se deja pasar." : "La declaración sigue en pie: vuelve a objetarla con la prueba correcta."));
        tras = a.verdad ? "siguiente" : "mismo";
        void escribir(azar(SE_RIE));
      }
      const termina = vidaRival() <= 0 || vidaYo <= 0;
      const sig = el("button", "boton grande mj-siguiente foco", termina ? (vidaRival() <= 0 ? "¡Rematar! ›" : "Continuar ›") : "Seguir el testimonio ›");
      sig.type = "button";
      sig.addEventListener("click", () => siguiente());
      veredicto.append(sig);
      acciones.hidden = true;
      relojEl.hidden = true;
      veredicto.hidden = false;
      gsap.fromTo(veredicto, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
      veredicto.scrollIntoView({ block: "nearest" });
      fase = "lee";
    };

    const siguiente = () => {
      if (fase !== "lee") return;
      sonido.efecto("mover");
      if (vidaRival() <= 0) return void victoria();
      if (vidaYo <= 0) return void derrota();
      if (tras === "siguiente" || refutadas.has(idx)) {
        const s = siguienteDe(idx);
        idx = s.k;
        if (s.vuelve) { vuelta++; avisarVuelta(); }
      }
      focoAcc = 0;
      void mostrar(1);
    };

    // ── Final ────────────────────────────────────────────────────────────
    const pintarFinal = (titulo: string, texto: string, botonesDef: { t: string; f: () => void; grande?: boolean }[], cinta: string, cifras = true) => {
      pararReloj();
      completarTipeo();
      ocultarExpediente();
      finalEl.replaceChildren();
      cuentaEl.hidden = true;
      finalEl.append(el("p", "mj-final-cinta", cinta), el("h3", "", titulo), el("p", "mj-final-msj", texto));
      if (cifras) {
        const c = el("div", "mj-cifras");
        const cifra = (v: string, t: string) => { const d = el("div", "mj-cifra"); d.append(el("b", "", v), el("small", "", t)); c.append(d); };
        cifra(`${refutadas.size}/${F}`, "declaraciones refutadas");
        cifra(`${danoTotal}`, danoTotal === 1 ? "objeción rechazada" : "objeciones rechazadas");
        cifra(`+${ganado}`, "Saber");
        finalEl.append(c);
      }
      const fila = el("div", "mj-final-botones");
      botonesFin = botonesDef.map((d) => {
        const b = el("button", `boton${d.grande ? " grande" : ""}`, d.t);
        b.type = "button";
        b.addEventListener("click", d.f);
        fila.append(b);
        return b;
      });
      finalEl.append(fila);
      focoFin = Math.max(0, botonesDef.findIndex((d) => d.grande));
      juego.hidden = true;
      finalEl.hidden = false;
      hoja.classList.add("mj-hoja-final");
      fase = "fin";
      marcarFoco();
      gsap.fromTo(finalEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 });
    };

    const victoria = async () => {
      fase = "anima";
      sonido.efecto("hallazgo");
      if (!ajustes.menosMovimiento) await gsap.to(rival.marco, { rotation: 14, y: 14, filter: "grayscale(1) brightness(0.8)", duration: 0.5, ease: "power2.in" });
      confeti(innerWidth / 2, innerHeight * 0.35, 70);
      const limpio = danoTotal === 0;
      logro("duelo");
      if (limpio) logro("duelo-limpio");
      if (ganado) ganarSaber(ganado);
      pintarFinal("¡Ganaste el duelo!", limpio ? `Refutaste a ${o.rival.nombre} sin una sola objeción rechazada.` : `${o.rival.nombre} se queda sin declaraciones en pie. Convicción: la tuya.`,
        [{ t: "Seguir", f: () => salir(true), grande: true }], "Veredicto");
      const est = el("p", "mj-estrellas");
      const n = limpio ? 3 : danoTotal === 1 ? 2 : 1;
      const spans = [0, 1, 2].map((k) => { const s = el("span", k < n ? "llena" : "", k < n ? "★" : "☆"); est.append(s); return s; });
      finalEl.children[1].after(est);
      gsap.fromTo(spans, { scale: 0.2, opacity: 0, rotation: -30 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.4, stagger: 0.16, delay: 0.15, ease: "back.out(2.4)" });
    };

    const derrota = async () => {
      fase = "anima";
      sonido.efecto("grieta");
      if (!ajustes.menosMovimiento) await gsap.to(yo.marco, { rotation: -12, y: 12, filter: "grayscale(1) brightness(0.8)", duration: 0.5, ease: "power2.in" });
      if (!reintentado) {
        pintarFinal("Perdiste la convicción", "El tribunal duda de ti… pero aún puedes pedir la palabra y volver a empezar con todo.",
          [{ t: "Retirarse", f: () => salir(false) }, { t: "Pedir la palabra", f: () => reintentar(), grande: true }], "Derrota");
      } else {
        if (ganado) ganarSaber(ganado);
        pintarFinal("Esta vez no", `${o.rival.nombre} se impuso. Repasa los porqués: la próxima vez el expediente será tuyo.`,
          [{ t: "Seguir", f: () => salir(false), grande: true }], "Derrota");
      }
    };

    const reintentar = () => {
      if (fase !== "fin" || reintentado) return;
      reintentado = true;
      sonido.efecto("campana");
      vidaYo = VIDA_YO;
      refutadas.clear();
      idx = 0; vuelta = 1; focoAcc = 0;
      vueltaEl.textContent = "";
      pintarBarras();
      gsap.set([yo.marco, rival.marco], { rotation: 0, y: 0, filter: "none" });
      finalEl.hidden = true;
      juego.hidden = false;
      cuentaEl.hidden = false;
      hoja.classList.remove("mj-hoja-final");
      gsap.fromTo([yo.segs, rival.segs].flat(), { scale: 0 }, { scale: 1, duration: 0.25, stagger: 0.04, ease: "back.out(3)" });
      void mostrar(1);
    };

    const salir = (gano: boolean) => {
      if (fase !== "fin") return;
      fase = "cerrando";
      ui.cerrarPanel();
      removeEventListener("keydown", teclas);
      sonido.efecto("elegir");
      gsap.to(raiz, { opacity: 0, duration: 0.22, onComplete: () => { raiz.remove(); fin({ gano, perfecto: gano && danoTotal === 0 }); } });
    };

    // ── Controles ────────────────────────────────────────────────────────
    bAtras.addEventListener("click", () => mover(-1));
    bAdelante.addEventListener("click", () => { completarTipeo(); mover(1); });
    bPasar.addEventListener("click", dejarPasar);
    bObjetar.addEventListener("click", abrirExpediente);
    botonesAcc.forEach((b, k) => b.addEventListener("pointerenter", (ev) => { if (ev.pointerType === "mouse" && fase === "testimonio") { focoAcc = k; marcarFoco(); } }));
    cartas.forEach((b, k) => b.addEventListener("click", () => elegirCarta(k)));
    bPresentar.addEventListener("click", () => void presentar());
    bVolver.addEventListener("click", cerrarExpediente);
    exp.addEventListener("click", () => (document.activeElement as HTMLElement | null)?.blur?.(), true);

    // Deslizar el bocadillo cambia de declaración; tocarlo completa el texto.
    let toque: { x: number; y: number } | null = null;
    bocadillo.addEventListener("pointerdown", (ev) => { toque = { x: ev.clientX, y: ev.clientY }; });
    bocadillo.addEventListener("pointerup", (ev) => {
      if (!toque) return;
      const dx = ev.clientX - toque.x, dy = ev.clientY - toque.y;
      toque = null;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) { completarTipeo(); mover(dx < 0 ? 1 : -1); }
      else completarTipeo();
    });
    bocadillo.addEventListener("pointercancel", () => { toque = null; });

    const accion = () => {
      if (fase === "testimonio") (focoAcc === 0 ? dejarPasar : abrirExpediente)();
      else if (fase === "expediente") void presentar();
      else if (fase === "lee") siguiente();
      else if (fase === "fin") botonesFin[focoFin]?.click();
      else if (fase === "intro") completarTipeo();
    };
    const tecla = (code: string) => {
      const izq = /Left|KeyA/.test(code), der = /Right|KeyD/.test(code);
      if (fase === "fin") {
        focoFin = /Left|KeyA|Up|KeyW/.test(code) ? 0 : botonesFin.length - 1;
        marcarFoco(); sonido.efecto("mover");
      } else if (fase === "testimonio") {
        if (izq) mover(-1);
        else if (der) { completarTipeo(); mover(1); }
        else { focoAcc = 1 - focoAcc; marcarFoco(); sonido.efecto("mover"); }
      } else if (fase === "expediente") {
        const cols = Math.max(1, Math.round(rejilla.clientWidth / Math.max(1, cartas[0].offsetWidth)));
        const d = der ? 1 : izq ? -1 : /Down|KeyS/.test(code) ? cols : -cols;
        focoCarta = Math.max(0, Math.min(cartas.length - 1, focoCarta + d));
        marcarFoco();
        cartas[focoCarta].scrollIntoView({ block: "nearest" });
        sonido.efecto("mover");
      }
    };
    const teclas = (ev: KeyboardEvent) => {
      if (!document.body.contains(raiz)) { removeEventListener("keydown", teclas); return; }
      if (fase === "expediente" && ev.code === "Escape") { ev.preventDefault(); cerrarExpediente(); return; }
      if (fase !== "testimonio") return;
      if (ev.key === "1") { ev.preventDefault(); focoAcc = 0; dejarPasar(); }
      else if (ev.key === "2") { ev.preventDefault(); focoAcc = 1; abrirExpediente(); }
    };
    addEventListener("keydown", teclas);
    ui.abrirPanel(accion, tecla);
    pintarBarras();
    pintarPuntos();
    habilitar(false);

    // ── Empieza ──────────────────────────────────────────────────────────
    const empezar = async () => {
      if (F === 0) {
        // Sin nada falso que refutar: el tribunal no tiene nada que discutir.
        if (N) await escribir(afs[0].texto);
        pintarFinal("Nada que objetar", `${o.rival.nombre} sólo dijo verdades: no hay contradicción que buscar. El tribunal te da la razón.`,
          [{ t: "Seguir", f: () => salir(true), grande: true }], "Veredicto", false);
        return;
      }
      if (o.mania) {
        bocN.textContent = "";
        await escribir(`«${o.mania}»`);
        await espera(1000 * pausa());
      }
      await grito("— Testimonio —", "testimonio");
      if (fase !== "intro") return;
      void mostrar(1);
    };
    setTimeout(() => void empezar(), ajustes.menosMovimiento ? 100 : 650);
  });
}
