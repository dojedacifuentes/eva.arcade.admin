// El Duelo: un jefe de módulo (el abogado del CDE, el Contralor, la Ministra)
// lanza argumentos; se responde con la carta correcta. Barras de convicción:
// tú aguantas tres golpes; el rival, uno por pregunta. Lo que fallas, el rival
// te lo vuelve a lanzar al final. Si pierdes, puedes pedir la palabra una vez.
import "./minijuegos.css";
import gsap from "gsap";
import type { PreguntaQuiz } from "../content/tipos";
import { retrato, type Apariencia } from "../game/art/characters";
import { estado } from "../game/estado";
import { ajustes, holgura, letrasPorSegundo } from "../juego/ajustes";
import { ganarSaber, logro } from "../juego/progreso";
import { confeti, flotar } from "./efectos";
import { sonido } from "./sonido";
import { ui } from "./ui";

const TIEMPO = 15; // segundos por argumento
const VIDA_YO = 3;
const POR_GOLPE = 60; // Saber por argumento ganado

function el<K extends keyof HTMLElementTagNameMap>(tag: K, clase = "", texto?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (clase) e.className = clase;
  if (texto !== undefined) e.textContent = texto;
  return e;
}
function mezclar<T>(a: readonly T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}
const sacudir = (x: HTMLElement) => { if (ajustes.menosMovimiento) return; x.classList.remove("mj-sacude"); void x.offsetWidth; x.classList.add("mj-sacude"); };
const centro = (e: Element) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
const YO_POR_DEFECTO: Apariencia = { piel: "#eab68f", pelo: "#2b2026", peinado: "largo", polera: "#3b3f4f", pantalon: "#2b2026" };

type Fase = "escucha" | "responde" | "anima" | "lee" | "fin" | "cerrando";

/** Duelo de argumentos contra un rival. */
export function duelo(o: { rival: { nombre: string; cargo: string; a: Apariencia }; preguntas: PreguntaQuiz[]; titulo?: string }): Promise<{ gano: boolean; perfecto: boolean }> {
  const preguntas = o.preguntas.filter((q) => q.opciones.length >= 2);
  const N = preguntas.length;
  if (!N) return Promise.resolve({ gano: true, perfecto: true });
  const tituloTxt = o.titulo ?? "Duelo de argumentos";

  const raiz = el("div", "mj-capa mj-duelo");
  raiz.id = "mj-duelo";
  const hoja = el("div", "mj-hoja mj-duelo-hoja");
  hoja.setAttribute("role", "dialog");
  hoja.setAttribute("aria-label", tituloTxt);

  const cab = el("header", "mj-cab");
  const titulo = el("h3", "mj-titulo");
  titulo.append(el("span", "mj-titulo-ico", "⚔"), el("span", "", tituloTxt));
  const marcador = el("div", "mj-marcador");
  const rondaEl = el("span", "mj-cuenta");
  const saberEl = el("span", "mj-saber");
  const saberN = el("b", "", "0");
  saberEl.append(saberN, el("small", "", "Saber"));
  marcador.append(rondaEl, saberEl);
  cab.append(titulo, marcador);

  const juego = el("div", "mj-duelo-juego");
  const ring = el("div", "mj-ring");
  const luchador = (lado: "yo" | "rival", nombre: string, cargo: string, a: Apariencia, vida: number) => {
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
    const segs = Array.from({ length: vida }, () => { const s = el("i"); barra.append(s); return s; });
    ficha.append(el("b", "", nombre), el("small", "", cargo), barra);
    caja.append(marco, ficha);
    return { caja, marco, segs, barra };
  };
  const nombreYo = estado?.nombre ?? "Tú";
  const yo = luchador("yo", nombreYo, "Tu convicción", estado?.apariencia ?? YO_POR_DEFECTO, VIDA_YO);
  const rival = luchador("rival", o.rival.nombre, o.rival.cargo, o.rival.a, N);
  const vs = el("span", "mj-vs", "VS");
  ring.append(yo.caja, vs, rival.caja);

  const bocadillo = el("div", "mj-bocadillo rival");
  const bocQuien = el("b", "", o.rival.nombre);
  const bocP = el("p");
  bocadillo.append(bocQuien, bocP);
  const relojEl = el("div", "mj-reloj");
  const relojPista = el("span", "mj-reloj-pista");
  const relojBarra = el("i");
  relojPista.append(relojBarra);
  relojEl.append(relojPista);
  const opciones = el("div", "mj-opciones");
  const veredicto = el("div", "mj-veredicto");
  veredicto.hidden = true;
  veredicto.setAttribute("aria-live", "polite");
  juego.append(ring, bocadillo, relojEl, opciones, veredicto);

  const finalEl = el("div", "mj-final");
  finalEl.hidden = true;

  hoja.append(cab, juego, finalEl);
  raiz.append(hoja);
  document.getElementById("ui")!.append(raiz);
  raiz.addEventListener("click", () => (document.activeElement as HTMLElement | null)?.blur?.(), true);
  gsap.fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  gsap.fromTo(hoja, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.4)" });
  if (!ajustes.menosMovimiento) {
    gsap.fromTo(yo.caja, { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, delay: 0.1, ease: "back.out(1.6)" });
    gsap.fromTo(rival.caja, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, delay: 0.1, ease: "back.out(1.6)" });
    gsap.fromTo(vs, { scale: 3, opacity: 0, rotation: -20 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.35, delay: 0.45, ease: "back.out(2.5)" });
  }

  return new Promise((fin) => {
    let vidaYo = VIDA_YO, vidaRival = N, ganado = 0, danoTotal = 0, ronda = 0, foco = 0;
    let reintentado = false;
    let fase: Fase = "escucha";
    let cola: PreguntaQuiz[] = mezclar(preguntas);
    let q: PreguntaQuiz = cola[0];
    let orden: { t: string; k: number }[] = [];
    let botones: HTMLButtonElement[] = [];
    let botonesFin: HTMLButtonElement[] = [];
    let reloj: gsap.core.Tween | null = null;
    let tipeo: gsap.core.Tween | null = null;

    const pintarSaber = () => {
      const v = { n: Number(saberN.textContent) || 0 };
      gsap.to(v, { n: ganado, duration: 0.5, onUpdate: () => { saberN.textContent = String(Math.round(v.n)); } });
      gsap.fromTo(saberEl, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
    };
    const pintarBarras = () => {
      yo.segs.forEach((s, k) => s.classList.toggle("vacia", k >= vidaYo));
      rival.segs.forEach((s, k) => s.classList.toggle("vacia", k >= vidaRival));
      yo.barra.setAttribute("aria-valuenow", String(vidaYo));
      rival.barra.setAttribute("aria-valuenow", String(vidaRival));
      yo.caja.classList.toggle("en-peligro", vidaYo === 1);
    };
    const marcarFoco = () => {
      if (fase === "responde" || fase === "escucha") botones.forEach((b, k) => b.classList.toggle("foco", k === foco));
      if (fase === "fin") botonesFin.forEach((b, k) => b.classList.toggle("foco", k === foco));
    };

    /** El argumento del rival se escribe rápido; tocar el bocadillo lo completa. */
    const escribir = (texto: string) => new Promise<void>((r) => {
      const lps = Math.max(letrasPorSegundo(), 90);
      const v = { n: 0 };
      let ultimo = 0;
      bocP.textContent = "";
      bocadillo.setAttribute("aria-label", `${o.rival.nombre}: ${texto}`);
      tipeo = gsap.to(v, {
        n: texto.length, duration: Number.isFinite(lps) ? texto.length / lps : 0, ease: "none",
        onUpdate: () => {
          const k = Math.round(v.n);
          bocP.textContent = texto.slice(0, k);
          if (k - ultimo >= 3) { ultimo = k; sonido.blip("voz"); }
        },
        onComplete: () => { bocP.textContent = texto; tipeo = null; r(); },
      });
    });
    bocadillo.addEventListener("pointerdown", () => tipeo?.progress(1));

    /** Algo vuela de un lado al otro: tu objeción o el contragolpe del rival. */
    const proyectil = async (desde: Element, hacia: Element, texto: string, quien: "yo" | "rival") => {
      const a = centro(desde), b = centro(hacia);
      const p = el("div", `mj-proyectil ${quien}`, texto);
      p.style.left = `${a.x}px`; p.style.top = `${a.y}px`;
      document.getElementById("ui")!.append(p);
      if (ajustes.menosMovimiento) {
        gsap.set(p, { xPercent: -50, yPercent: -50, x: b.x - a.x, y: b.y - a.y });
        await new Promise((r) => setTimeout(r, 160));
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

    const impacto = (lado: typeof yo, seg: HTMLElement | undefined) => {
      sonido.efecto("golpe");
      lado.marco.classList.remove("golpeado"); void lado.marco.offsetWidth; lado.marco.classList.add("golpeado");
      if (!ajustes.menosMovimiento) gsap.fromTo(lado.caja, { x: lado === rival ? 16 : -16 }, { x: 0, duration: 0.55, ease: "elastic.out(1.2, 0.3)" });
      if (seg) gsap.fromTo(seg, { scale: 1.6 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
      pintarBarras();
    };

    // ── Una ronda ────────────────────────────────────────────────────────
    const nuevaRonda = async () => {
      if (vidaRival <= 0) return victoria();
      if (vidaYo <= 0) return derrota();
      ronda++;
      const esta = ronda;
      q = cola.shift()!;
      rondaEl.textContent = `Ronda ${ronda}`;
      orden = mezclar(q.opciones.map((t, k) => ({ t, k })));
      veredicto.hidden = true;
      opciones.hidden = false;
      bocadillo.hidden = false;
      opciones.replaceChildren();
      botones = orden.map((op, k) => {
        const b = el("button", "mj-opcion");
        b.type = "button";
        b.append(el("span", "mj-tecla", String(k + 1)), el("span", "mj-opcion-t", op.t));
        b.addEventListener("click", () => responder(k));
        b.addEventListener("pointerenter", (ev) => { if (ev.pointerType === "mouse" && (fase === "responde" || fase === "escucha")) { foco = k; marcarFoco(); } });
        opciones.append(b);
        return b;
      });
      foco = 0;
      fase = "escucha";
      marcarFoco();
      relojEl.hidden = ajustes.modoHistoria;
      gsap.set(relojBarra, { scaleX: 1 });
      relojEl.classList.remove("poco");
      // El rival ataca: se adelanta y habla.
      sonido.efecto("escuchar");
      if (!ajustes.menosMovimiento) gsap.fromTo(rival.caja, { x: 0 }, { x: -18, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
      gsap.fromTo(bocadillo, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2)" });
      gsap.fromTo(botones, { y: 26, opacity: 0, rotation: () => Math.random() * 6 - 3 }, { y: 0, opacity: 1, rotation: 0, duration: 0.3, stagger: 0.06, delay: 0.15, ease: "back.out(1.8)" });
      fase = "responde";
      await escribir(q.texto);
      if (esta !== ronda || fase !== "responde" || ajustes.modoHistoria) return;
      reloj = gsap.fromTo(relojBarra, { scaleX: 1 }, {
        scaleX: 0, duration: TIEMPO * holgura(), ease: "none",
        onUpdate: () => { if (reloj && reloj.progress() > 0.7) relojEl.classList.add("poco"); },
        onComplete: () => responder(null),
      });
    };

    const responder = async (k: number | null) => {
      if (fase !== "responde") return;
      fase = "anima";
      tipeo?.progress(1);
      reloj?.kill();
      const bien = k !== null && orden[k]?.k === q.correcta;
      botones.forEach((b, j) => {
        b.disabled = true;
        b.classList.remove("foco");
        if (orden[j].k === q.correcta) b.classList.add("bien");
        else if (j === k) b.classList.add("mal");
      });
      if (bien && k !== null) {
        vidaRival--;
        ganado += POR_GOLPE;
        sonido.efecto("elegir");
        const pos = await proyectil(botones[k], rival.marco, "¡OBJECIÓN!", "yo");
        impacto(rival, rival.segs[vidaRival]);
        flotar(`+${POR_GOLPE} Saber`, pos.x - 40, pos.y - 70, "saber mj-flota");
        if (!ajustes.menosMovimiento) confeti(pos.x, pos.y, 14);
        pintarSaber();
        void ui.sello("¡HA LUGAR!", true);
      } else {
        danoTotal++;
        vidaYo--;
        cola.push(q); // el rival volverá sobre este argumento
        if (k === null) sonido.efecto("tiempo");
        await proyectil(rival.marco, yo.marco, k === null ? "¡TIEMPO!" : "¡NO HA LUGAR!", "rival");
        impacto(yo, yo.segs[vidaYo]);
        sonido.efecto("grieta");
        sacudir(hoja);
      }
      // El porqué, siempre: un duelo también es para aprender.
      const correcta = q.opciones[q.correcta];
      veredicto.replaceChildren();
      veredicto.dataset.bien = String(bien);
      veredicto.append(el("p", "mj-ver-titulo", bien ? "¡Ha lugar! Tu argumento le pega de lleno." : k === null ? "Te quedaste callado: el rival aprovecha." : "No ha lugar: el rival te contragolpea."));
      if (!bien) {
        const c = el("p", "mj-ver-correcto");
        c.append(el("b", "", "La respuesta: "), document.createTextNode(`«${correcta}»`));
        veredicto.append(c);
      }
      veredicto.append(el("p", "mj-ver-porque", q.porque));
      if (q.norma) veredicto.append(el("p", "mj-norma", q.norma));
      if (!bien && vidaYo > 0) veredicto.append(el("p", "mj-nota-rival", "Ojo: volverá sobre este argumento."));
      const termina = vidaRival <= 0 || vidaYo <= 0;
      const sig = el("button", "boton grande mj-siguiente foco", termina ? (vidaRival <= 0 ? "¡Rematar! ›" : "Continuar ›") : "Siguiente argumento ›");
      sig.type = "button";
      sig.addEventListener("click", () => siguiente());
      veredicto.append(sig);
      opciones.hidden = true;
      relojEl.hidden = true;
      veredicto.hidden = false;
      gsap.fromTo(veredicto, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
      veredicto.scrollIntoView({ block: "nearest" });
      fase = "lee";
    };

    const siguiente = () => {
      if (fase !== "lee") return;
      sonido.efecto("mover");
      void nuevaRonda();
    };

    // ── Final ────────────────────────────────────────────────────────────
    const pintarFinal = (titulo: string, texto: string, botonesDef: { t: string; f: () => void; grande?: boolean }[], cinta: string) => {
      finalEl.replaceChildren();
      finalEl.append(el("p", "mj-final-cinta", cinta), el("h3", "", titulo), el("p", "mj-final-msj", texto));
      const cifras = el("div", "mj-cifras");
      const cifra = (v: string, t: string) => { const d = el("div", "mj-cifra"); d.append(el("b", "", v), el("small", "", t)); cifras.append(d); };
      cifra(`${N - vidaRival}/${N}`, "argumentos ganados");
      cifra(`${danoTotal}`, danoTotal === 1 ? "golpe recibido" : "golpes recibidos");
      cifra(`+${ganado}`, "Saber");
      finalEl.append(cifras);
      const fila = el("div", "mj-final-botones");
      botonesFin = botonesDef.map((d) => {
        const b = el("button", `boton${d.grande ? " grande" : ""}`, d.t);
        b.type = "button";
        b.addEventListener("click", d.f);
        fila.append(b);
        return b;
      });
      finalEl.append(fila);
      foco = Math.max(0, botonesFin.findIndex((_, k) => botonesDef[k].grande));
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
      pintarFinal("¡Ganaste el duelo!", limpio ? `${o.rival.nombre} se queda sin argumentos y tú, sin un rasguño.` : `${o.rival.nombre} se queda sin argumentos. Convicción: la tuya.`,
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
        pintarFinal("Esta vez no", `${o.rival.nombre} se impuso. Repasa los porqués: la próxima vez los argumentos serán tuyos.`,
          [{ t: "Seguir", f: () => salir(false), grande: true }], "Derrota");
      }
    };

    const reintentar = () => {
      if (fase !== "fin" || reintentado) return;
      reintentado = true;
      sonido.efecto("campana");
      vidaYo = VIDA_YO; vidaRival = N;
      cola = mezclar(preguntas);
      pintarBarras();
      gsap.set([yo.marco, rival.marco], { rotation: 0, y: 0, filter: "none" });
      finalEl.hidden = true;
      juego.hidden = false;
      hoja.classList.remove("mj-hoja-final");
      gsap.fromTo([yo.segs, rival.segs].flat(), { scale: 0 }, { scale: 1, duration: 0.25, stagger: 0.04, ease: "back.out(3)" });
      void nuevaRonda();
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
    const accion = () => {
      if (fase === "responde") responder(foco);
      else if (fase === "lee") siguiente();
      else if (fase === "fin") botonesFin[foco]?.click();
    };
    const tecla = (code: string) => {
      if (fase === "fin") {
        foco = /Left|KeyA|Up|KeyW/.test(code) ? 0 : botonesFin.length - 1;
        marcarFoco(); sonido.efecto("mover");
        return;
      }
      if (fase !== "responde" || !botones.length) return;
      const cols = Math.max(1, Math.round(opciones.clientWidth / Math.max(1, botones[0].offsetWidth)));
      const d = /Right|KeyD/.test(code) ? 1 : /Left|KeyA/.test(code) ? -1 : /Down|KeyS/.test(code) ? cols : -cols;
      foco = Math.max(0, Math.min(botones.length - 1, foco + d));
      marcarFoco();
      sonido.efecto("mover");
    };
    const teclas = (ev: KeyboardEvent) => {
      if (!document.body.contains(raiz)) { removeEventListener("keydown", teclas); return; }
      if (fase !== "responde") return;
      const n = Number(ev.key);
      if (n >= 1 && n <= botones.length) { ev.preventDefault(); responder(n - 1); }
    };
    addEventListener("keydown", teclas);
    ui.abrirPanel(accion, tecla);
    pintarBarras();
    setTimeout(() => void nuevaRonda(), ajustes.menosMovimiento ? 100 : 650);
  });
}
