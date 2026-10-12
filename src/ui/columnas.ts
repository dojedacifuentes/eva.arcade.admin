// Columnas: clasificar afirmaciones en dos cajas, rápido y con racha. La
// tarjeta se lanza con ← / → (o A / D), deslizándola o tocando una caja. Si se
// equivoca, rebota, muestra el porqué y va sola a la caja correcta.
import "./minijuegos.css";
import gsap from "gsap";
import type { Columnas } from "../content/tipos";
import { ajustes, holgura, pausa } from "../juego/ajustes";
import { ganarSaber, logro } from "../juego/progreso";
import { confeti, flotar } from "./efectos";
import { sonido } from "./sonido";
import { ui } from "./ui";

const TIEMPO = 8; // segundos por tarjeta
const BASE = 20; // Saber por acierto, antes del multiplicador

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
const espera = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const sacudir = (x: HTMLElement) => { if (ajustes.menosMovimiento) return; x.classList.remove("mj-sacude"); void x.offsetWidth; x.classList.add("mj-sacude"); };
const multiplicador = (racha: number) => 1 + Math.floor(racha / 2) * 0.5;

/** Clasificar en dos columnas. Devuelve cuántas tarjetas fueron a la caja correcta a la primera. */
export function columnas(c: Columnas): Promise<{ aciertos: number; total: number }> {
  const items = mezclar(c.items);
  const total = items.length;
  if (!total) return Promise.resolve({ aciertos: 0, total: 0 });

  const raiz = el("div", "mj-capa mj-columnas");
  raiz.id = "mj-columnas";
  const hoja = el("div", "mj-hoja mj-columnas-hoja");
  hoja.setAttribute("role", "dialog");
  hoja.setAttribute("aria-label", c.titulo);

  const cab = el("header", "mj-cab");
  const titulo = el("h3", "mj-titulo");
  titulo.append(el("span", "mj-titulo-ico", "🗂"), el("span", "", c.titulo));
  const marcador = el("div", "mj-marcador");
  const rachaEl = el("span", "mj-racha");
  rachaEl.setAttribute("aria-live", "polite");
  const cuentaEl = el("span", "mj-cuenta", `1/${total}`);
  const saberEl = el("span", "mj-saber");
  const saberN = el("b", "", "0");
  saberEl.append(saberN, el("small", "", "Saber"));
  marcador.append(rachaEl, cuentaEl, saberEl);
  cab.append(titulo, marcador);

  const puntos = el("div", "mj-puntos");
  items.forEach(() => puntos.append(el("i")));

  const arena = el("div", "mj-arena");
  // Se define dentro de la promesa; las cajas la llaman al tocarlas.
  let enviar: (lado: 0 | 1 | null) => Promise<void> = async () => undefined;
  const caja = (lado: 0 | 1, texto: string) => {
    const b = el("button", `mj-caja ${lado ? "der" : "izq"}`);
    b.type = "button";
    const n = el("span", "mj-caja-n", "0");
    const pila = el("span", "mj-caja-pila");
    pila.setAttribute("aria-hidden", "true");
    b.append(pila, el("span", "mj-caja-flecha", lado ? "→" : "←"), el("b", "mj-caja-t", texto), n, el("small", "mj-caja-tecla", lado ? "D · →" : "← · A"));
    b.addEventListener("click", () => enviar(lado));
    return { b, n, pila };
  };
  const izq = caja(0, c.izq), der = caja(1, c.der);
  const pista = el("div", "mj-pista");
  const tarjeta = el("div", "mj-tarjeta");
  const tarjetaP = el("p");
  tarjeta.append(tarjetaP);
  tarjeta.setAttribute("aria-live", "polite");
  const relojEl = el("div", "mj-reloj");
  const relojPista = el("span", "mj-reloj-pista");
  const relojBarra = el("i");
  relojPista.append(relojBarra);
  relojEl.append(relojPista);
  pista.append(tarjeta, relojEl);
  arena.append(izq.b, pista, der.b);

  const porque = el("p", "mj-porque");
  porque.hidden = true;
  porque.setAttribute("aria-live", "polite");
  const ayuda = el("p", "mj-ayuda", "Lanza la tarjeta: ← / → (o A / D), desliza, o toca una caja.");

  hoja.append(cab, puntos, arena, porque, ayuda);
  raiz.append(hoja);
  document.getElementById("ui")!.append(raiz);
  raiz.addEventListener("click", () => (document.activeElement as HTMLElement | null)?.blur?.(), true);
  gsap.fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  gsap.fromTo(hoja, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.4)" });
  if (!ajustes.menosMovimiento) gsap.fromTo([izq.b, der.b], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.08, delay: 0.1, ease: "back.out(2)" });

  return new Promise((fin) => {
    let i = 0, aciertos = 0, racha = 0, mejor = 0, ganado = 0;
    let fase: "juega" | "anima" | "fin" | "cerrando" = "anima";
    let reloj: gsap.core.Tween | null = null;
    const cuentas = [0, 0];

    const pintarRacha = () => {
      rachaEl.textContent = racha >= 2 ? `🔥 ${racha} · ×${multiplicador(racha).toFixed(1)}` : "";
      if (racha >= 2) gsap.fromTo(rachaEl, { scale: 1.4 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    };
    const pintarSaber = () => {
      const v = { n: Number(saberN.textContent) || 0 };
      gsap.to(v, { n: ganado, duration: 0.45, onUpdate: () => { saberN.textContent = String(Math.round(v.n)); } });
      gsap.fromTo(saberEl, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
    };

    const mostrar = () => {
      const it = items[i];
      tarjetaP.textContent = it.texto;
      cuentaEl.textContent = `${i + 1}/${total}`;
      [...puntos.children].forEach((d, k) => d.classList.toggle("actual", k === i));
      tarjeta.classList.remove("bien", "mal", "hacia-izq", "hacia-der");
      gsap.set(tarjeta, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });
      gsap.fromTo(tarjeta, ajustes.menosMovimiento ? { opacity: 0 } : { y: -50, scale: 0.7, rotation: Math.random() * 10 - 5, opacity: 0 }, { y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.3, ease: "back.out(2)" });
      sonido.efecto("papel");
      fase = "juega";
      reloj?.kill();
      if (ajustes.modoHistoria) { relojEl.hidden = true; return; }
      relojEl.classList.remove("poco");
      reloj = gsap.fromTo(relojBarra, { scaleX: 1 }, {
        scaleX: 0, duration: TIEMPO * holgura(), ease: "none",
        onUpdate: () => { if (reloj && reloj.progress() > 0.7) relojEl.classList.add("poco"); },
        onComplete: () => enviar(null),
      });
    };

    /** La tarjeta vuela a una caja; la caja late y suma. */
    const volarA = async (lado: 0 | 1, cuenta = true) => {
      const destino = (lado ? der : izq).b;
      const a = tarjeta.getBoundingClientRect(), b = destino.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (a.left + a.width / 2) + Number(gsap.getProperty(tarjeta, "x"));
      const dy = b.top + b.height / 2 - (a.top + a.height / 2) + Number(gsap.getProperty(tarjeta, "y"));
      await gsap.to(tarjeta, { x: dx, y: dy, scale: 0.2, rotation: lado ? 28 : -28, opacity: 0.15, duration: ajustes.menosMovimiento ? 0.01 : 0.28, ease: "power2.in" });
      if (cuenta) {
        cuentas[lado]++;
        const c = lado ? der : izq;
        c.n.textContent = String(cuentas[lado]);
        if (c.pila.children.length < 9) {
          const hojita = el("i");
          hojita.style.rotate = `${Math.random() * 10 - 5}deg`;
          c.pila.append(hojita);
          if (!ajustes.menosMovimiento) gsap.fromTo(hojita, { y: -26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "bounce.out" });
        }
      }
      destino.classList.add("traga");
      setTimeout(() => destino.classList.remove("traga"), 260);
      if (!ajustes.menosMovimiento) gsap.fromTo(destino, { scale: 1.1 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
    };

    enviar = async (lado: 0 | 1 | null) => {
      if (fase !== "juega") return;
      fase = "anima";
      reloj?.kill();
      const it = items[i];
      const bien = lado === it.lado;
      const dot = puntos.children[i] as HTMLElement;
      dot.classList.remove("actual"); dot.classList.add(bien ? "bien" : "mal");
      if (bien) {
        aciertos++; racha++; mejor = Math.max(mejor, racha);
        const g = Math.round(BASE * multiplicador(racha));
        ganado += g;
        tarjeta.classList.add("bien");
        sonido.efecto("elegir");
        await volarA(it.lado);
        sonido.efecto("cobrar");
        const b = (it.lado ? der : izq).b.getBoundingClientRect();
        flotar(`+${g}`, b.left + b.width / 2 - 16, b.top - 4, "saber mj-flota");
        if (!ajustes.menosMovimiento) confeti(b.left + b.width / 2, b.top + 10, 8);
        if (racha >= 5) logro("racha-5");
        pintarSaber();
        pintarRacha();
        await espera(120);
      } else {
        racha = 0;
        pintarRacha();
        tarjeta.classList.add("mal");
        const nombre = it.lado ? c.der : c.izq;
        if (lado === null) sonido.efecto("tiempo");
        else {
          // Amaga hacia la caja equivocada y rebota.
          sonido.efecto("golpe");
          if (!ajustes.menosMovimiento) {
            await gsap.to(tarjeta, { x: lado ? 70 : -70, rotation: lado ? 10 : -10, duration: 0.14, ease: "power2.out" });
            gsap.to(tarjeta, { x: 0, rotation: 0, duration: 0.6, ease: "elastic.out(1.1, 0.3)" });
          }
          sacudir(hoja);
          const caja = (lado ? der : izq).b;
          caja.classList.add("rechaza");
          setTimeout(() => caja.classList.remove("rechaza"), 500);
        }
        porque.replaceChildren(el("b", "", `${lado === null ? "¡Tiempo! " : ""}Va en «${nombre}». `), document.createTextNode(it.porque ?? ""));
        porque.hidden = false;
        gsap.fromTo(porque, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 });
        await espera(Math.max(1700, 1100 + (it.porque?.length ?? 0) * 32) * pausa());
        await volarA(it.lado);
        porque.hidden = true;
      }
      i++;
      if (i < total) mostrar(); else final();
    };

    // Deslizar la tarjeta con el dedo (o el ratón).
    let arrastre: { x0: number; id: number } | null = null;
    tarjeta.addEventListener("pointerdown", (ev) => {
      if (fase !== "juega") return;
      arrastre = { x0: ev.clientX, id: ev.pointerId };
      tarjeta.setPointerCapture(ev.pointerId);
      tarjeta.classList.add("agarrada");
    });
    tarjeta.addEventListener("pointermove", (ev) => {
      if (!arrastre || ev.pointerId !== arrastre.id) return;
      const dx = ev.clientX - arrastre.x0;
      gsap.set(tarjeta, { x: dx, rotation: dx / 14 });
      tarjeta.classList.toggle("hacia-izq", dx < -50);
      tarjeta.classList.toggle("hacia-der", dx > 50);
    });
    const soltar = (ev: PointerEvent) => {
      if (!arrastre || ev.pointerId !== arrastre.id) return;
      const dx = ev.clientX - arrastre.x0;
      arrastre = null;
      tarjeta.classList.remove("agarrada", "hacia-izq", "hacia-der");
      if (Math.abs(dx) > 70 && fase === "juega") enviar(dx < 0 ? 0 : 1);
      else gsap.to(tarjeta, { x: 0, rotation: 0, duration: 0.3, ease: "back.out(2)" });
    };
    tarjeta.addEventListener("pointerup", soltar);
    tarjeta.addEventListener("pointercancel", soltar);

    const final = () => {
      fase = "fin";
      reloj?.kill();
      const estrellas = aciertos === total ? 3 : aciertos >= total - 1 && total >= 3 ? 2 : aciertos >= Math.ceil(total / 2) ? 1 : 0;
      const tarjetaF = el("div", "mj-final");
      tarjetaF.append(el("p", "mj-final-cinta", "Todo en su caja"), el("h3", "", c.titulo));
      const est = el("p", "mj-estrellas");
      est.setAttribute("aria-label", `${estrellas} de 3 estrellas`);
      const spans = [0, 1, 2].map((k) => { const s = el("span", k < estrellas ? "llena" : "", k < estrellas ? "★" : "☆"); est.append(s); return s; });
      const cifras = el("div", "mj-cifras");
      const cifra = (v: string, t: string) => { const d = el("div", "mj-cifra"); d.append(el("b", "", v), el("small", "", t)); cifras.append(d); };
      cifra(`${aciertos}/${total}`, "a la primera");
      cifra(`${mejor}`, "mejor racha");
      cifra(`+${ganado}`, "Saber");
      tarjetaF.append(est, cifras);
      if (c.norma) tarjetaF.append(el("p", "mj-norma", c.norma));
      const seguir = el("button", "boton grande foco", "Seguir");
      seguir.type = "button";
      seguir.addEventListener("click", () => salir());
      tarjetaF.append(seguir);
      hoja.replaceChildren(tarjetaF);
      hoja.classList.add("mj-hoja-final");
      gsap.fromTo(tarjetaF, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
      gsap.fromTo(spans, { scale: 0.2, opacity: 0, rotation: -30 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.4, stagger: 0.16, delay: 0.15, ease: "back.out(2.4)" });
      sonido.efecto(estrellas === 3 ? "hallazgo" : "campana");
      if (estrellas === 3) { setTimeout(() => confeti(innerWidth / 2, innerHeight * 0.35, 60), 450); logro("columnas"); }
      if (ganado) ganarSaber(ganado);
    };

    const salir = () => {
      if (fase !== "fin") return;
      fase = "cerrando";
      ui.cerrarPanel();
      sonido.efecto("elegir");
      gsap.to(raiz, { opacity: 0, duration: 0.22, onComplete: () => { raiz.remove(); fin({ aciertos, total }); } });
    };

    ui.abrirPanel(
      () => { if (fase === "fin") salir(); },
      (code) => {
        if (fase !== "juega") return;
        if (/Left|KeyA/.test(code)) enviar(0);
        else if (/Right|KeyD/.test(code)) enviar(1);
      },
    );
    setTimeout(mostrar, ajustes.menosMovimiento ? 50 : 320);
  });
}
