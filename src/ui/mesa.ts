// La Mesa: un escritorio a lo «Papers, Please». Los vecinos hacen fila en la
// ventanilla y cada uno trae un documento (un decreto, una resolución, una
// solicitud). Dos pasos por documento: primero se señala dónde está el problema
// —la línea que lo muestra, o «Todo en orden»— y después se timbra (tocando el
// sello o arrastrándolo al papel). Racha que multiplica el Saber, una fila que
// se impacienta (sólo quita el bono; nunca en modo historia) y la explicación
// de cada sello. Con `infinito`, el «Turno de urgencia»: documentos sin fin y
// tres corazones.
import "./minijuegos.css";
import gsap from "gsap";
import type { Expediente, Sello } from "../content/tipos";
import { PARTES, PERSONAJES } from "../content/personajes";
import { retrato } from "../game/art/characters";
import { estado, guardar } from "../game/estado";
import { ajustes, holgura } from "../juego/ajustes";
import { ganarSaber, logro } from "../juego/progreso";
import { confeti, flotar } from "./efectos";
import { sonido } from "./sonido";
import { ui } from "./ui";

const PACIENCIA = 30; // segundos de paciencia de la fila por documento (× holgura)
const BASE = 40; // Saber por expediente bien timbrado, antes del multiplicador
const VISTO = 15; // Saber por encontrar dónde está el problema
const EN_COLA = 6; // personas que se ven en la fila
const RECORD = "eva-potestas:record-urgencia";
const SVG = "http://www.w3.org/2000/svg";

export type OpcionesMesa = {
  titulo: string;
  expedientes: Expediente[];
  alAcertar?: (ex: Expediente) => Promise<void> | void;
  /** Se llama justo después de un sello equivocado. */
  alFallar?: (ex: Expediente) => void;
  /** Turno de urgencia: los documentos no se acaban; cada sello equivocado cuesta un corazón. */
  infinito?: { vidas: number; generar: () => Expediente };
};
export type ResultadoMesa = { aciertos: number; total: number; racha?: number };

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
const esperar = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const sacudir = (x: Element) => { if (ajustes.menosMovimiento) return; x.classList.remove("mj-sacude"); void (x as HTMLElement).offsetWidth; x.classList.add("mj-sacude"); };
const multiplicador = (racha: number) => 1 + Math.floor(racha / 2) * 0.5;
const folio = (id: string) => { let h = 7; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 9000; return 1000 + h; };
/**
 * Un sello puede venir corto («NULO») o con su explicación («VÁLIDO: el Concejo la
 * aprobó…»). La goma lleva la palabra del timbre; el resto va en letra legible.
 */
function partir(t: string): [string, string] {
  const dos = t.indexOf(":");
  if (dos > 0 && dos <= 32) return [t.slice(0, dos).trim(), t.slice(dos + 1).trim()];
  const m = /^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 .,-]*?[A-ZÁÉÍÓÚÑ0-9])(?=\s+[a-záéíóúñ«(]|$)/.exec(t);
  if (m && m[1].length >= 3 && m[1].length < t.length) return [m[1], t.slice(m[1].length).trim()];
  return [t, ""];
}
const paraTimbre = (t: string) => { const c = partir(t)[0]; return c.length <= 28 ? c : c.split(/\s+/).slice(0, 3).join(" ") + "…"; };
const hoy = () => new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
const leerRecord = () => { try { return Number(localStorage.getItem(RECORD)) || 0; } catch { return 0; } };
const guardarRecord = (n: number) => { try { localStorage.setItem(RECORD, String(n)); } catch { /* sin almacenamiento */ } };

/**
 * Un círculo de plumón rojo, trazado a mano, que se dibuja sobre una línea del documento.
 * Se arma al tamaño real de la línea (ancho × alto en px) para que el trazo no se deforme.
 */
function circulo(ancho: number, alto: number, clase = ""): { s: SVGSVGElement; p: SVGPathElement } {
  const W = Math.max(40, ancho + 14), H = Math.max(30, alto + 10);
  const s = document.createElementNS(SVG, "svg");
  s.setAttribute("class", `mj-tinta ${clase}`.trim());
  s.setAttribute("viewBox", `0 0 ${W} ${H}`);
  s.setAttribute("aria-hidden", "true");
  // La misma elipse imperfecta en coordenadas 200 × 60, escalada a la línea.
  const pts = [[34, 8], [90, 1], [172, 3], [193, 20], [204, 38], [158, 56], [96, 56], [38, 57], [4, 47], [6, 29], [9, 13], [44, 5], [80, 5]];
  const q = pts.map(([x, y]) => `${((x / 200) * (W - 8) + 4).toFixed(1)} ${((y / 60) * (H - 6) + 3).toFixed(1)}`);
  const p = document.createElementNS(SVG, "path");
  p.setAttribute("d", `M ${q[0]} C ${q[1]}, ${q[2]}, ${q[3]} C ${q[4]}, ${q[5]}, ${q[6]} C ${q[7]}, ${q[8]}, ${q[9]} C ${q[10]}, ${q[11]}, ${q[12]}`);
  p.setAttribute("pathLength", "100");
  s.append(p);
  return { s, p };
}

type Fase = "busca" | "elige" | "lee" | "pausa" | "fin" | "cerrando";

/** La Mesa: señalar el problema y timbrar expedientes. Devuelve cuántos se timbraron bien. */
export function mesa(o: OpcionesMesa): Promise<ResultadoMesa> {
  const inf = o.infinito;
  const lista = [...o.expedientes];
  const asegurar = (hasta: number) => { if (inf) while (lista.length < hasta) lista.push(inf.generar()); };
  asegurar(EN_COLA);
  const total = lista.length; // en el turno de urgencia no hay total: se cuenta lo resuelto
  if (!total) return Promise.resolve({ aciertos: 0, total: 0, racha: 0 });

  // Caras de la fila: la gente de Potestas (Marisol atiende la ventanilla).
  const caras = PERSONAJES.filter((p) => p.id !== PARTES.id).map((p) => retrato(p.a, 3));
  const caraDe = (ex: Expediente) => caras[folio(ex.id) % caras.length];

  // ── Esqueleto ────────────────────────────────────────────────────────────
  const raiz = el("div", "mj-capa mj-mesa");
  raiz.id = "mj-mesa";
  if (inf) raiz.classList.add("mj-urgencia");
  const hoja = el("div", "mj-hoja mj-mesa-hoja");
  hoja.setAttribute("role", "dialog");
  hoja.setAttribute("aria-label", o.titulo);

  const cab = el("header", "mj-cab");
  const titulo = el("h3", "mj-titulo");
  titulo.append(el("span", "mj-titulo-ico", inf ? "🚨" : "🗂"), el("span", "", o.titulo));
  const marcador = el("div", "mj-marcador");
  const vidasEl = el("span", "mj-vidas");
  const rachaEl = el("span", "mj-racha");
  rachaEl.setAttribute("aria-live", "polite");
  const saberEl = el("span", "mj-saber");
  const saberN = el("b", "", "0");
  saberEl.append(saberN, el("small", "", "Saber"));
  if (inf) marcador.append(vidasEl);
  marcador.append(rachaEl, saberEl);
  cab.append(titulo, marcador);

  // La fila: quienes esperan (los documentos que faltan) y su paciencia.
  const cola = el("div", "mj-cola");
  const colaFila = el("div", "mj-cola-fila");
  const ventanilla = el("span", "mj-ventanilla", "Ventanilla");
  ventanilla.setAttribute("aria-hidden", "true");
  const gente = el("div", "mj-cola-gente");
  gente.setAttribute("role", "img");
  const info = el("div", "mj-cola-info");
  const puntos = el("div", "mj-puntos");
  const atendidos = el("span", "mj-atendidos");
  if (inf) info.append(atendidos);
  else { lista.forEach(() => puntos.append(el("i"))); info.append(puntos); }
  colaFila.append(ventanilla, gente, info);
  const pacEl = el("div", "mj-reloj mj-paciencia");
  const pacBarra = el("i");
  const pacEt = el("small", "", "Paciencia de la fila");
  const pacPista = el("span", "mj-reloj-pista");
  pacPista.append(pacBarra);
  pacEl.append(pacPista, pacEt);
  cola.append(colaFila, pacEl);

  const cuerpo = el("div", "mj-mesa-cuerpo");
  const docZona = el("div", "mj-doc-zona");
  const doc = el("article", "mj-doc");
  docZona.append(doc);

  const lado = el("div", "mj-lado");
  const relato = el("div", "mj-relato");
  const cara = el("img", "mj-cara");
  cara.alt = "";
  cara.src = retrato(PARTES.a, 3);
  const relatoTxt = el("div", "mj-relato-txt");
  const relatoP = el("p");
  relatoTxt.append(el("b", "", `${PARTES.nombre} · ${PARTES.cargo}`), relatoP);
  relato.append(cara, relatoTxt);
  // El paso en curso: «Paso 1 de 2 · ¿Dónde está el problema?» y una ayuda corta.
  const etapa = el("div", "mj-etapa");
  const etapaN = el("span", "mj-etapa-n");
  const pregunta = el("p", "mj-pregunta");
  const ayuda = el("p", "mj-etapa-ayuda");
  ayuda.setAttribute("aria-live", "polite");
  etapa.append(etapaN, pregunta, ayuda);
  const paso1 = el("div", "mj-paso1");
  const todo = el("button", "mj-todo-orden");
  todo.type = "button";
  todo.append(el("span", "mj-todo-ico", "✓"), el("span", "mj-todo-t", "Todo en orden"), el("span", "mj-tecla", "0"));
  paso1.append(todo);
  const sellosEl = el("div", "mj-sellos");
  sellosEl.hidden = true;
  const veredicto = el("div", "mj-veredicto");
  veredicto.hidden = true;
  veredicto.setAttribute("aria-live", "polite");
  lado.append(relato, etapa, paso1, sellosEl, veredicto);
  cuerpo.append(docZona, lado);

  hoja.append(cab, cola, cuerpo);
  raiz.append(hoja);
  document.getElementById("ui")!.append(raiz);
  // Un botón tocado no se queda con el foco del navegador (Enter lo volvería a pulsar).
  raiz.addEventListener("click", () => (document.activeElement as HTMLElement | null)?.blur?.(), true);
  gsap.fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  gsap.fromTo(hoja, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.4)" });

  return new Promise((fin) => {
    let i = 0, aciertos = 0, racha = 0, mejor = 0, ganado = 0, foco = 0;
    let vidas = inf ? Math.max(1, inf.vidas) : 0;
    let fase: Fase = "pausa";
    let aTiempo = true, ultimoBien = false;
    /** Paso 1: true si dio con el problema, false si no, null si el expediente no lo trae. */
    let visto: boolean | null = null;
    let vistos = 0, conPaso1 = 0;
    const historial: boolean[] = [];
    let paciencia: gsap.core.Tween | null = null;
    let orden: Sello[] = [];
    let botones: HTMLButtonElement[] = [];
    let filas: HTMLButtonElement[] = [];
    let arrastrado = 0; // cuándo terminó el último arrastre (para no contarlo además como toque)
    let arrastrando = false;
    /** En el paso 1 el foco no se pinta hasta que se usa el teclado (o el mouse): si no, parece una pista. */
    let verFoco = true;

    const actual = () => lista[i];
    const objetivos = (): HTMLButtonElement[] => (fase === "busca" ? [...filas, todo] : fase === "elige" ? botones : []);
    const pintarRacha = () => {
      rachaEl.textContent = racha >= 2 ? `🔥 ${racha} · ×${multiplicador(racha).toFixed(1)}` : "";
      if (racha >= 2) gsap.fromTo(rachaEl, { scale: 1.4 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    };
    const pintarSaber = () => {
      const v = { n: Number(saberN.textContent) || 0 };
      gsap.to(v, { n: ganado, duration: 0.6, ease: "power2.out", onUpdate: () => { saberN.textContent = String(Math.round(v.n)); } });
      gsap.fromTo(saberEl, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
    };
    const pintarVidas = (perdio = false) => {
      if (!inf) return;
      vidasEl.replaceChildren();
      vidasEl.setAttribute("aria-label", `${vidas} de ${inf.vidas} corazones`);
      const hs: HTMLElement[] = [];
      for (let k = 0; k < inf.vidas; k++) { const h = el("i", k < vidas ? "" : "perdido", k < vidas ? "♥" : "♡"); vidasEl.append(h); hs.push(h); }
      if (perdio && hs[vidas]) {
        sonido.efecto("grieta");
        gsap.fromTo(hs[vidas], { scale: 1.9, rotation: -25 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(3)" });
      }
    };
    const marcarFoco = () => {
      [...filas, todo, ...botones].forEach((b) => b.classList.remove("foco"));
      const obj = objetivos();
      if (!obj.length || (fase === "busca" && !verFoco)) return;
      foco = Math.max(0, Math.min(obj.length - 1, foco));
      obj[foco].classList.add("foco");
    };

    // ── La fila ──────────────────────────────────────────────────────────
    const pintarCola = (animar: boolean) => {
      gente.replaceChildren();
      const hasta = inf ? i + EN_COLA : Math.min(total, i + EN_COLA);
      for (let k = i; k < hasta; k++) {
        const p = el("span", k === i ? "mj-persona ventanilla" : "mj-persona");
        const img = el("img");
        img.alt = "";
        img.src = caraDe(lista[k]);
        p.style.setProperty("--k", String(k - i));
        p.append(img);
        gente.append(p);
      }
      const resto = inf ? 0 : total - hasta;
      if (resto > 0) gente.append(el("span", "mj-cola-mas", `+${resto}`));
      const esperan = inf ? "La fila no se acaba" : `${total - i} en la fila`;
      gente.setAttribute("aria-label", esperan);
      if (inf) atendidos.textContent = `Atendidos: ${historial.length}`;
      else [...puntos.children].forEach((d, k) => d.classList.toggle("actual", k === i));
      if (animar && !ajustes.menosMovimiento) gsap.from(gente.children, { x: 46, duration: 0.35, stagger: 0.04, ease: "power2.out" });
    };
    const impacientar = () => {
      aTiempo = false;
      pacEl.classList.add("agotado");
      pacEl.classList.remove("poco");
      pacEt.textContent = "¡La fila se impacienta! · sin bono";
      sonido.efecto("tiempo");
      const quien = (gente.children[1] ?? gente.children[0]) as HTMLElement | undefined;
      if (quien?.classList.contains("mj-persona")) {
        quien.classList.add("impaciente");
        const bufido = el("b", "mj-bufido", "💢");
        bufido.setAttribute("aria-hidden", "true");
        quien.append(bufido);
        if (!ajustes.menosMovimiento) gsap.fromTo(bufido, { scale: 0, y: 6 }, { scale: 1, y: 0, duration: 0.3, ease: "back.out(3)" });
        sacudir(quien);
      }
    };
    const arrancarPaciencia = () => {
      paciencia?.kill();
      aTiempo = true;
      pacEl.classList.remove("agotado", "poco");
      pacEt.textContent = "Paciencia de la fila";
      if (ajustes.modoHistoria) { pacEl.hidden = true; return; }
      pacEl.hidden = false;
      paciencia = gsap.fromTo(pacBarra, { scaleX: 1 }, {
        scaleX: 0, duration: PACIENCIA * holgura(), ease: "none",
        onUpdate: () => { pacEl.classList.toggle("poco", Number(gsap.getProperty(pacBarra, "scaleX")) < 0.25); },
        onComplete: impacientar,
      });
    };

    // ── El documento ─────────────────────────────────────────────────────
    const pintarDoc = (ex: Expediente, conPaso: boolean) => {
      doc.replaceChildren();
      const membrete = el("header", "mj-membrete");
      const escudo = el("span", "mj-escudo");
      escudo.setAttribute("aria-hidden", "true");
      escudo.append(el("i", "", "★"));
      const inst = el("div", "mj-inst");
      inst.append(el("strong", "", "I. MUNICIPALIDAD DE POTESTAS"), el("small", "", "Secretaría Municipal · Oficina de Partes"));
      const fol = el("span", "mj-folio", `N° ${folio(ex.id)}`);
      membrete.append(escudo, inst, fol);
      const tipo = el("h4", "mj-doc-tipo", ex.documento.tipo);
      const lugar = el("p", "mj-doc-fecha", `Potestas, ${hoy()}`);
      const mat = el("p", "mj-doc-mat");
      mat.append(el("b", "", "MAT.: "), document.createTextNode(ex.titulo));
      const campos = el("div", "mj-campos");
      campos.setAttribute("role", "group");
      campos.setAttribute("aria-label", "Contenido del documento");
      filas = ex.documento.campos.map((c, k) => {
        const f = el("button", "mj-campo");
        f.type = "button";
        f.append(el("span", "mj-campo-k", c.k), el("span", "mj-campo-v", c.v));
        if (k < 9) f.append(el("span", "mj-tecla", String(k + 1)));
        f.disabled = !conPaso;
        f.addEventListener("click", () => señalar(k));
        f.addEventListener("pointerenter", (ev) => { if (ev.pointerType === "mouse" && fase === "busca") { foco = k; verFoco = true; marcarFoco(); } });
        campos.append(f);
        return f;
      });
      const firma = el("footer", "mj-firma");
      firma.append(el("span", "mj-firma-linea"), el("small", "", "Firma y timbre"));
      doc.append(membrete, tipo, lugar, mat, campos, firma);
      doc.classList.toggle("buscando", conPaso);
    };

    /** Cuál es la respuesta del paso 1: un índice de fila, `filas.length` (todo en orden) o -1 (sin paso 1). */
    const dondeEsta = (ex: Expediente) => {
      if (ex.vicio === undefined) return -1;
      if (ex.vicio === null) return ex.documento.campos.length;
      const k = ex.documento.campos.findIndex((c) => c.k === ex.vicio);
      if (k < 0) console.warn(`La Mesa: el vicio «${ex.vicio}» de ${ex.id} no es un campo del documento`);
      return k;
    };

    const pintarSellos = (ex: Expediente) => {
      sellosEl.replaceChildren();
      orden = mezclar(ex.sellos).slice(0, 4);
      if (!orden.some((s) => s.correcto)) { const c = ex.sellos.find((s) => s.correcto); if (c) orden[orden.length - 1] = c; orden = mezclar(orden); }
      botones = orden.map((s, k) => {
        const b = el("button", "mj-sello-btn");
        b.type = "button";
        const mango = el("span", "mj-sello-mango");
        mango.setAttribute("aria-hidden", "true");
        const goma = el("span", "mj-sello-goma");
        const [corto, resto] = partir(s.texto);
        goma.append(el("b", "mj-sello-corto", corto));
        if (resto) goma.append(el("span", "mj-sello-resto", resto));
        b.setAttribute("aria-label", s.texto);
        b.append(mango, goma, el("span", "mj-tecla", String(k + 1)));
        b.addEventListener("click", () => { if (performance.now() - arrastrado < 450) return; elegir(k); });
        b.addEventListener("pointerenter", (ev) => { if (ev.pointerType === "mouse" && fase === "elige" && !arrastrando) { foco = k; marcarFoco(); } });
        arrastrable(b, k);
        sellosEl.append(b);
        return b;
      });
      sellosEl.hidden = true;
      veredicto.hidden = true;
    };

    /** El sello se puede llevar con el dedo (o el mouse) hasta el documento. */
    const arrastrable = (b: HTMLButtonElement, k: number) => {
      let id = -1, x0 = 0, y0 = 0, dx = 0, dy = 0, movido = false;
      let fantasma: HTMLElement | null = null;
      let encima = false;
      const sobreDoc = (x: number, y: number) => { const r = doc.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; };
      const poner = (x: number, y: number) => { if (fantasma) gsap.set(fantasma, { x: x - dx, y: y - dy, rotation: -5 }); };
      b.addEventListener("pointerdown", (ev) => {
        if (fase !== "elige" || ev.button > 0 || id !== -1) return;
        id = ev.pointerId; x0 = ev.clientX; y0 = ev.clientY; movido = false;
        try { b.setPointerCapture(id); } catch { /* nada */ }
      });
      b.addEventListener("pointermove", (ev) => {
        if (ev.pointerId !== id || fase !== "elige") return;
        if (!movido) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return;
          movido = true; arrastrando = true;
          const r = b.getBoundingClientRect();
          dx = x0 - r.left; dy = y0 - r.top;
          fantasma = b.cloneNode(true) as HTMLElement;
          fantasma.classList.remove("foco");
          fantasma.classList.add("mj-sello-fantasma");
          fantasma.setAttribute("aria-hidden", "true");
          fantasma.style.width = `${r.width}px`;
          fantasma.style.fontSize = getComputedStyle(hoja).fontSize;
          raiz.append(fantasma);
          b.classList.add("levantado");
          foco = k; marcarFoco();
          sonido.efecto("mover");
        }
        poner(ev.clientX, ev.clientY);
        encima = sobreDoc(ev.clientX, ev.clientY);
        docZona.classList.toggle("mj-blanco", encima);
        // En el celular el documento puede estar arriba, fuera de la vista: la hoja se desplaza sola.
        const rh = hoja.getBoundingClientRect();
        if (ev.clientY < rh.top + 56) hoja.scrollTop -= 14;
        else if (ev.clientY > rh.bottom - 56) hoja.scrollTop += 14;
      });
      const soltar = (ev: PointerEvent, cancelado: boolean) => {
        if (ev.pointerId !== id) return;
        id = -1;
        try { b.releasePointerCapture(ev.pointerId); } catch { /* nada */ }
        if (!movido) return;
        arrastrando = false;
        arrastrado = performance.now();
        docZona.classList.remove("mj-blanco");
        b.classList.remove("levantado");
        const f = fantasma;
        fantasma = null;
        if (!cancelado && encima && fase === "elige") {
          f?.remove();
          const r = doc.getBoundingClientRect();
          const px = Math.max(26, Math.min(74, ((ev.clientX - r.left) / r.width) * 100));
          const py = Math.max(18, Math.min(86, ((ev.clientY - r.top) / r.height) * 100));
          elegir(k, { x: px, y: py });
        } else if (f) {
          const r = b.getBoundingClientRect();
          gsap.to(f, { x: r.left, y: r.top, rotation: 0, duration: ajustes.menosMovimiento ? 0.01 : 0.22, ease: "power2.out", onComplete: () => f.remove() });
        }
        encima = false;
      };
      b.addEventListener("pointerup", (ev) => soltar(ev, false));
      b.addEventListener("pointercancel", (ev) => soltar(ev, true));
    };

    // ── Paso 1: ¿dónde está el problema? ─────────────────────────────────
    const pasoUno = () => {
      fase = "busca";
      conPaso1++;
      etapaN.textContent = "Paso 1 de 2";
      pregunta.textContent = "¿Dónde está el problema?";
      ayuda.textContent = "Toca la línea del documento que lo muestra, o «Todo en orden» si no hay ninguno.";
      todo.disabled = false;
      todo.classList.remove("mj-aqui", "mj-errado", "mj-ok");
      todo.querySelector(".mj-aqui-et")?.remove();
      todo.querySelector(".mj-tinta")?.remove();
      paso1.hidden = false;
      sellosEl.hidden = true;
      foco = 0;
      verFoco = false;
      marcarFoco();
      if (!ajustes.menosMovimiento) gsap.fromTo([etapa, paso1], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.2, stagger: 0.08 });
    };

    const rodear = (b: HTMLElement, clase: string) => {
      const { s, p } = circulo(b.offsetWidth, b.offsetHeight, clase);
      b.append(s);
      if (ajustes.menosMovimiento) return;
      gsap.fromTo(p, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" });
    };

    const señalar = async (k: number) => {
      if (fase !== "busca") return;
      fase = "pausa";
      const ex = actual();
      const correcta = dondeEsta(ex);
      const bien = k === correcta;
      visto = bien;
      [...filas, todo].forEach((b) => { b.disabled = true; b.classList.remove("foco"); });
      doc.classList.remove("buscando");
      const elegida = k < filas.length ? filas[k] : todo;
      const buena = correcta < filas.length ? filas[correcta] : todo;
      if (bien) {
        vistos++;
        ganado += VISTO;
        pintarSaber();
        rodear(elegida, "");
        elegida.classList.add("mj-ok");
        if (correcta === filas.length) {
          // Una nota a mano en el papel: queda a la vista mientras se elige el sello.
          const nota = el("span", "mj-revisado", "✓ Revisado: en orden");
          doc.append(nota);
          if (!ajustes.menosMovimiento) gsap.fromTo(nota, { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "power3.in" });
        }
        const r = elegida.getBoundingClientRect();
        flotar(`¡Bien visto! +${VISTO}`, r.left + Math.min(r.width / 2, 120) - 50, r.top - 4, "saber mj-flota");
        sonido.efecto("objetivo");
        ayuda.textContent = correcta < filas.length ? `¡Bien visto! El problema está en «${ex.documento.campos[correcta].k}».` : "¡Bien visto! El documento está en orden.";
        await esperar(ajustes.menosMovimiento ? 450 : 750);
      } else {
        sonido.efecto("elegir");
        elegida.classList.add("mj-errado");
        sacudir(elegida);
        buena.classList.add("mj-aqui");
        const et = el("span", "mj-aqui-et", correcta < filas.length ? "El problema estaba aquí" : "Todo estaba en orden");
        buena.append(et);
        rodear(buena, "guia");
        buena.scrollIntoView({ block: "center", behavior: ajustes.menosMovimiento ? "auto" : "smooth" });
        ayuda.textContent = correcta < filas.length
          ? `El problema estaba en «${ex.documento.campos[correcta].k}». Sin bono de racha en éste, pero sigue: falta el sello.`
          : "No había problema: el documento estaba en orden. Sin bono de racha en éste; ahora, el sello.";
        await esperar(ajustes.menosMovimiento ? 1200 : 1700);
      }
      if (fase === "pausa") pasoDos(true);
    };

    // ── Paso 2: el sello ─────────────────────────────────────────────────
    const pasoDos = (despuesDelUno: boolean) => {
      const ex = actual();
      fase = "elige";
      etapaN.textContent = despuesDelUno ? "Paso 2 de 2" : "";
      pregunta.textContent = ex.pregunta;
      if (!despuesDelUno || visto) ayuda.textContent = "Arrastra un sello hasta el documento, o tócalo.";
      paso1.hidden = true;
      sellosEl.hidden = false;
      foco = 0;
      marcarFoco();
      gsap.fromTo(botones, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.06, delay: despuesDelUno ? 0 : 0.25, ease: "back.out(2)" });
      if (despuesDelUno) sellosEl.scrollIntoView({ block: "nearest", behavior: ajustes.menosMovimiento ? "auto" : "smooth" });
    };

    // ── Un expediente ────────────────────────────────────────────────────
    const mostrar = () => {
      asegurar(i + EN_COLA);
      const ex = actual();
      const conPaso = dondeEsta(ex) >= 0;
      visto = null;
      pintarDoc(ex, conPaso);
      pintarSellos(ex);
      pintarCola(i > 0);
      relatoP.textContent = ex.relato;
      veredicto.hidden = true;
      sonido.efecto("papel");
      const quieto = ajustes.menosMovimiento;
      gsap.fromTo(doc, quieto ? { opacity: 0 } : { x: 220, y: -40, rotation: 14, opacity: 0 }, { x: 0, y: 0, rotation: quieto ? 0 : -1.2, opacity: 1, duration: 0.45, ease: "back.out(1.3)" });
      gsap.fromTo(relato, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.15 });
      hoja.scrollTop = 0;
      arrancarPaciencia();
      if (conPaso) pasoUno(); else pasoDos(false);
    };

    /** El timbre cae sobre el documento (donde se soltó el sello, si se arrastró). */
    const timbrar = async (texto: string, bien: boolean, punto?: { x: number; y: number }) => {
      const t = el("div", `mj-timbre ${bien ? "bien" : "mal"}`);
      t.append(el("b", "", paraTimbre(texto)), el("small", "", `I.M. POTESTAS · ${new Date().getFullYear()}`));
      for (let k = 0; k < 6; k++) {
        const g = el("i", "mj-gota");
        const ang = Math.random() * Math.PI * 2, r = 52 + Math.random() * 30;
        g.style.left = `${50 + Math.cos(ang) * r}%`; g.style.top = `${50 + Math.sin(ang) * r * 0.75}%`;
        g.style.width = g.style.height = `${4 + Math.random() * 6}px`;
        t.append(g);
      }
      doc.append(t);
      if (punto) {
        // Donde se soltó, pero sin que el timbre se salga del papel.
        const w = t.offsetWidth, h = t.offsetHeight, W = doc.clientWidth, H = doc.clientHeight;
        t.style.left = `${Math.max(w / 2 + 6, Math.min(W - w / 2 - 6, (punto.x / 100) * W))}px`;
        t.style.top = `${Math.max(h / 2 + 6, Math.min(H - h / 2 - 6, (punto.y / 100) * H))}px`;
      }
      const giro = bien ? -6 - Math.random() * 5 : 5 + Math.random() * 5;
      await gsap.fromTo(t, { xPercent: -50, yPercent: -50, scale: 2.4, rotation: giro - 20, opacity: 0 }, { scale: 1, rotation: giro, opacity: 0.94, duration: 0.22, ease: "power4.in" });
      sonido.efecto("timbre"); if (!bien) sonido.efecto("golpe");
      sacudir(hoja);
      gsap.fromTo(t.querySelectorAll(".mj-gota"), { scale: 0 }, { scale: 1, duration: 0.18, stagger: 0.02 });
      return t;
    };

    const elegir = async (k: number, punto?: { x: number; y: number }) => {
      if (fase !== "elige" || !orden[k]) return;
      fase = "lee";
      paciencia?.kill();
      const ex = actual();
      const s = orden[k];
      const bien = s.correcto;
      ultimoBien = bien;
      const correcto = ex.sellos.find((x) => x.correcto);
      botones.forEach((b, j) => { b.disabled = true; b.classList.remove("foco"); b.classList.toggle("elegido", j === k); });
      sonido.efecto("elegir");
      if (!ajustes.menosMovimiento && !punto) gsap.fromTo(botones[k], { y: 0 }, { y: 7, duration: 0.09, yoyo: true, repeat: 1 });
      // En el celular el documento puede haber quedado arriba: se trae a la vista antes del golpe.
      if (!punto) {
        const rd = doc.getBoundingClientRect(), rh = hoja.getBoundingClientRect();
        if (rd.top + rd.height * 0.4 < rh.top || rd.top + rd.height * 0.7 > rh.bottom) {
          doc.scrollIntoView({ block: "center", behavior: ajustes.menosMovimiento ? "auto" : "smooth" });
          await esperar(ajustes.menosMovimiento ? 30 : 420);
        }
      }
      const t = await timbrar(s.texto, bien, punto);

      const conBono = aTiempo && visto !== false;
      const mult = conBono ? multiplicador(racha + (bien ? 1 : 0)) : 1;
      let g = 0;
      historial.push(bien);
      if (bien) {
        aciertos++; racha++; mejor = Math.max(mejor, racha);
        g = Math.round(BASE * mult);
        ganado += g;
        const r = t.getBoundingClientRect();
        confeti(r.left + r.width / 2, r.top + r.height / 2, 18);
        flotar(`+${g} Saber`, r.left + r.width / 2 - 40, r.top - 6, "saber mj-flota");
        sonido.efecto("cobrar");
        logro("primer-sello");
        if (racha >= 5) logro("racha-mesa");
        pintarSaber();
      } else {
        racha = 0;
        if (inf) { vidas = Math.max(0, vidas - 1); pintarVidas(true); }
        try { o.alFallar?.(ex); } catch (err) { console.error(err); }
      }
      pintarRacha();
      if (!inf) {
        const dot = puntos.children[i] as HTMLElement | undefined;
        dot?.classList.remove("actual"); dot?.classList.add(bien ? "bien" : "mal");
      } else atendidos.textContent = `Atendidos: ${historial.length}`;
      if (estado) {
        const m = estado.mesa ?? { resueltos: 0, aciertos: 0, mejorRacha: 0 };
        estado.mesa = { resueltos: m.resueltos + 1, aciertos: m.aciertos + (bien ? 1 : 0), mejorRacha: Math.max(m.mejorRacha, racha) };
        guardar();
      }

      // Veredicto: el porqué del sello elegido y, si falló, el del correcto.
      veredicto.replaceChildren();
      veredicto.dataset.bien = String(bien);
      const sinBono = !bien ? "" : !aTiempo && !ajustes.modoHistoria ? " · sin bono" : visto === false ? " · sin bono de racha" : "";
      veredicto.append(el("p", "mj-ver-titulo", bien ? `¡Bien timbrado! +${g} Saber${mult > 1 ? ` (×${mult.toFixed(1)})` : ""}${sinBono}` : `No era «${partir(s.texto)[0]}».`));
      if (!bien && inf) veredicto.append(el("p", "mj-ver-vidas", vidas > 0 ? `Pierdes un corazón: te ${vidas === 1 ? "queda 1" : `quedan ${vidas}`}.` : "Era tu último corazón: se acabó el turno."));
      veredicto.append(el("p", "mj-ver-porque", s.porque));
      if (!bien && correcto) {
        const c = el("p", "mj-ver-correcto");
        const [corto, resto] = partir(correcto.texto);
        c.append(el("b", "", `Lo correcto: «${corto}». `), document.createTextNode(`${resto ? resto.charAt(0).toUpperCase() + resto.slice(1) + ". " : ""}${correcto.porque}`));
        veredicto.append(c);
      }
      veredicto.append(el("p", "mj-norma", ex.norma));
      const queda = inf ? vidas > 0 : i + 1 < total;
      const sig = el("button", "boton grande mj-siguiente foco", queda ? "Siguiente ›" : inf ? "Terminar el turno ›" : "Ver resultado ›");
      sig.type = "button";
      sig.addEventListener("click", () => siguiente());
      veredicto.append(sig);
      await esperar(260);
      sellosEl.hidden = true;
      etapa.hidden = true;
      veredicto.hidden = false;
      gsap.fromTo(veredicto, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
      veredicto.scrollIntoView({ block: "nearest", behavior: ajustes.menosMovimiento ? "auto" : "smooth" });
    };

    const siguiente = async () => {
      if (fase !== "lee") return;
      fase = "pausa";
      sonido.efecto("elegir");
      const ex = actual();
      if (ultimoBien && o.alAcertar) {
        // Lo que quiera mostrar quien llama (un hallazgo): la Mesa espera debajo.
        ui.cerrarPanel();
        raiz.classList.add("mj-en-pausa");
        try { await o.alAcertar(ex); } catch (err) { console.error(err); }
        raiz.classList.remove("mj-en-pausa");
        ui.abrirPanel(accion, tecla);
      }
      // El expediente se archiva hacia la izquierda y quien estaba en la ventanilla se va.
      const quien = gente.children[0] as HTMLElement | undefined;
      if (quien && !ajustes.menosMovimiento) gsap.to(quien, { x: -36, y: -8, opacity: 0, duration: 0.3, ease: "power2.in" });
      await gsap.to(doc, ajustes.menosMovimiento ? { opacity: 0, duration: 0.15 } : { x: -260, y: 30, rotation: -16, opacity: 0, duration: 0.3, ease: "power2.in" });
      i++;
      etapa.hidden = false;
      const sigue = inf ? vidas > 0 : i < total;
      if (sigue) mostrar(); else final();
    };

    // ── Resultado ────────────────────────────────────────────────────────
    const final = () => {
      fase = "fin";
      paciencia?.kill();
      const resueltos = historial.length;
      const tarjeta = el("div", "mj-final mj-mesa-final");
      tarjeta.append(el("p", "mj-final-cinta", inf ? "Turno terminado" : "Mesa despachada"), el("h3", "", o.titulo));
      let estrellas = 0;
      let spans: HTMLElement[] = [];
      let nuevoRecord = false;
      if (!inf) {
        estrellas = aciertos === total ? 3 : aciertos >= total - 1 && total >= 3 ? 2 : aciertos >= Math.ceil(total / 2) ? 1 : 0;
        const est = el("p", "mj-estrellas");
        est.setAttribute("aria-label", `${estrellas} de 3 estrellas`);
        spans = [0, 1, 2].map((k) => { const s = el("span", k < estrellas ? "llena" : "", k < estrellas ? "★" : "☆"); est.append(s); return s; });
        tarjeta.append(est);
      } else {
        const previo = leerRecord();
        nuevoRecord = aciertos > previo;
        if (nuevoRecord) guardarRecord(aciertos);
        const rec = el("p", nuevoRecord ? "mj-record nuevo" : "mj-record", nuevoRecord ? "¡Nuevo récord!" : `Récord: ${previo} bien timbrados`);
        tarjeta.append(rec);
        if (nuevoRecord && !ajustes.menosMovimiento) gsap.fromTo(rec, { scale: 0.3, rotation: -12, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.5, delay: 0.2, ease: "back.out(2.6)" });
      }
      const cifras = el("div", "mj-cifras");
      const cifra = (n: string, t: string) => { const c = el("div", "mj-cifra"); c.append(el("b", "", n), el("small", "", t)); cifras.append(c); };
      if (inf) { cifra(`${resueltos}`, "documentos"); cifra(`${aciertos}`, "bien timbrados"); }
      else cifra(`${aciertos}/${total}`, "bien timbrados");
      if (conPaso1 && !inf) cifra(`${vistos}/${conPaso1}`, "problemas vistos");
      cifra(`${mejor}`, "mejor racha");
      cifra(`+${ganado}`, "Saber");
      cifras.classList.toggle("cuatro", cifras.children.length === 4);
      const msj = inf
        ? (aciertos >= 10 ? "Turno heroico: la Oficina de Partes te pide autógrafos." : aciertos >= 5 ? "Buen turno. La fila salió conforme (casi toda)." : "Turno duro. Mañana la fila vuelve, y tú con más ojo.")
        : estrellas === 3 ? "Ni un vicio se te escapó. La Contraloría no tendrá nada que observar."
        : estrellas >= 2 ? "Muy buen ojo. Repasa el que se te fue y la próxima es perfecta."
        : "Cada sello equivocado es un acto que alguien va a impugnar. Vuelve a leer los fundamentos.";

      // Compartir, como Wordle: una línea con los sellos de la jornada.
      const MAX = 24;
      const marcas = historial.slice(0, MAX).map((b) => (b ? "✅" : "❌")).join("") + (historial.length > MAX ? "…" : "");
      const linea = `POTESTAS · ${inf ? "Turno de urgencia" : "Mesa"} · ${marcas} · ${inf ? `${aciertos} bien timbrados` : `${aciertos}/${total}`}`;
      const compartir = el("div", "mj-compartir");
      const lineaEl = el("p", "mj-compartir-txt", linea);
      const copiar = el("button", "boton mj-copiar", "Compartir");
      copiar.type = "button";
      copiar.addEventListener("click", async () => {
        let ok = false;
        try { await navigator.clipboard.writeText(linea); ok = true; } catch { /* sin permiso: se selecciona */ }
        if (!ok) {
          const r = document.createRange();
          r.selectNodeContents(lineaEl);
          const sel = getSelection();
          sel?.removeAllRanges(); sel?.addRange(r);
          try { ok = document.execCommand("copy"); } catch { ok = false; }
        }
        copiar.textContent = ok ? "¡Copiado!" : "Seleccionado: cópialo";
        sonido.efecto("elegir");
        if (!ajustes.menosMovimiento) gsap.fromTo(copiar, { scale: 1.12 }, { scale: 1, duration: 0.25, ease: "back.out(3)" });
      });
      compartir.append(lineaEl, copiar);

      const seguir = el("button", "boton grande foco", "Seguir");
      seguir.type = "button";
      seguir.addEventListener("click", () => salir());
      tarjeta.append(cifras, el("p", "mj-final-msj", msj), compartir, seguir);
      hoja.replaceChildren(tarjeta);
      hoja.classList.add("mj-hoja-final");
      hoja.scrollTop = 0;
      gsap.fromTo(tarjeta, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
      if (spans.length) gsap.fromTo(spans, { scale: 0.2, opacity: 0, rotation: -30 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.4, stagger: 0.16, delay: 0.15, ease: "back.out(2.4)" });
      const fiesta = estrellas === 3 || nuevoRecord;
      sonido.efecto(fiesta ? "hallazgo" : "campana");
      if (fiesta) setTimeout(() => confeti(innerWidth / 2, innerHeight * 0.35, 60), 450);
      if (ganado) ganarSaber(ganado);
      if (!inf && aciertos === total && total >= 4) logro("sin-vicios");
    };

    const salir = () => {
      if (fase !== "fin") return;
      fase = "cerrando";
      ui.cerrarPanel();
      removeEventListener("keydown", teclas);
      sonido.efecto("elegir");
      gsap.to(raiz, { opacity: 0, duration: 0.22, onComplete: () => { raiz.remove(); fin({ aciertos, total: inf ? historial.length : total, racha: mejor }); } });
    };

    // ── Controles ────────────────────────────────────────────────────────
    const accion = () => {
      if (fase === "busca" && !verFoco) { verFoco = true; marcarFoco(); sonido.efecto("mover"); }
      else if (fase === "busca") señalar(foco);
      else if (fase === "elige") elegir(foco);
      else if (fase === "lee") siguiente();
      else if (fase === "fin") salir();
    };
    const tecla = (code: string) => {
      const obj = objetivos();
      if (!obj.length || arrastrando) return;
      if (fase === "busca" && !verFoco) { verFoco = true; marcarFoco(); obj[foco]?.scrollIntoView({ block: "nearest" }); sonido.efecto("mover"); return; }
      if (fase === "busca") {
        foco += /Down|KeyS|Right|KeyD/.test(code) ? 1 : -1;
      } else {
        const cols = Math.max(1, Math.round(sellosEl.clientWidth / Math.max(1, botones[0].offsetWidth)));
        foco += /Right|KeyD/.test(code) ? 1 : /Left|KeyA/.test(code) ? -1 : /Down|KeyS/.test(code) ? cols : -cols;
      }
      foco = Math.max(0, Math.min(obj.length - 1, foco));
      marcarFoco();
      obj[foco]?.scrollIntoView({ block: "nearest" });
      sonido.efecto("mover");
    };
    const teclas = (ev: KeyboardEvent) => {
      if (!document.body.contains(raiz)) { removeEventListener("keydown", teclas); return; }
      if (ev.target instanceof HTMLInputElement || ev.target instanceof HTMLTextAreaElement) return;
      const n = Number(ev.key);
      if (fase === "busca") {
        if (ev.key === "0" || ev.code === "KeyT") { ev.preventDefault(); señalar(filas.length); }
        else if (n >= 1 && n <= Math.min(9, filas.length)) { ev.preventDefault(); señalar(n - 1); }
      } else if (fase === "elige") {
        if (n >= 1 && n <= botones.length) { ev.preventDefault(); elegir(n - 1); }
      }
    };
    todo.addEventListener("click", () => señalar(filas.length));
    todo.addEventListener("pointerenter", (ev) => { if (ev.pointerType === "mouse" && fase === "busca") { foco = filas.length; verFoco = true; marcarFoco(); } });
    addEventListener("keydown", teclas);
    ui.abrirPanel(accion, tecla);
    pintarVidas();
    mostrar();
  });
}
