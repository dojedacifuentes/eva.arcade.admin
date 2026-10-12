// La Comisión: el examen oral. Tres examinadores, una pregunta y un puñado de
// ideas revueltas: las claves de la respuesta modelo y algunas trampas. Se arma
// la respuesta eligiendo ideas; cada clave suma, cada trampa resta (como el
// scoreKeys de iuspublic). Después, la respuesta modelo y la repregunta.
import "./minijuegos.css";
import gsap from "gsap";
import type { Oral } from "../content/tipos";
import { retrato, type Apariencia } from "../game/art/characters";
import { ajustes, letrasPorSegundo } from "../juego/ajustes";
import { ganarSaber, logro } from "../juego/progreso";
import { confeti, flotar } from "./efectos";
import { sonido } from "./sonido";
import { ui } from "./ui";

const POR_CLAVE = 30;
const EXAMINADORES: { a: Apariencia; rol: string }[] = [
  { a: { piel: "#c98d63", pelo: "#b9b1ad", peinado: "corto", polera: "#3b3f4f", pantalon: "#2b2026" }, rol: "Vocal" },
  { a: { piel: "#eab68f", pelo: "#2b2026", peinado: "mono", polera: "#2b2026", pantalon: "#2b2026" }, rol: "Preside" },
  { a: { piel: "#f7d7bd", pelo: "#5c3423", peinado: "largo", polera: "#3d4a7a", pantalon: "#2b2026" }, rol: "Vocal" },
];

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
/** Escala chilena con 60 % de exigencia: 4,0 es el aprobado. */
const notaChilena = (p: number) => (p >= 0.6 ? 4 + (3 * (p - 0.6)) / 0.4 : 1 + (3 * p) / 0.6);

type Idea = { texto: string; clave: boolean; i: number; boton: HTMLButtonElement };

/** Examen oral. Devuelve cuántas claves se dijeron de cuántas había. */
export function comision(o: Oral): Promise<{ claves: number; total: number }> {
  const total = o.claves.length;
  const max = total + 1;

  const raiz = el("div", "mj-capa mj-comision");
  raiz.id = "mj-comision";
  const hoja = el("div", "mj-hoja mj-comision-hoja");
  hoja.setAttribute("role", "dialog");
  hoja.setAttribute("aria-label", "Examen oral");

  const cab = el("header", "mj-cab");
  const titulo = el("h3", "mj-titulo");
  titulo.append(el("span", "mj-titulo-ico", "🎓"), el("span", "", "Examen de grado"));
  const marcador = el("div", "mj-marcador");
  const crono = el("span", "mj-cuenta", "⏱ 0:00");
  const saberEl = el("span", "mj-saber");
  const saberN = el("b", "", "0");
  saberEl.append(saberN, el("small", "", "Saber"));
  marcador.append(crono, saberEl);
  cab.append(titulo, marcador);

  // La comisión, detrás de su mesa.
  const tribunal = el("div", "mj-tribunal");
  const sillas = el("div", "mj-examinadores");
  const caras = EXAMINADORES.map((ex, k) => {
    const f = el("figure", "mj-examinador");
    const img = el("img");
    img.alt = "";
    img.src = retrato(ex.a, 4);
    const nombre = k === 1 ? (o.profesor ?? "La Comisión") : ex.rol;
    const cap = el("figcaption");
    cap.append(el("b", "", nombre));
    if (k === 1) cap.append(el("small", "", "Preside"));
    f.append(img, cap);
    sillas.append(f);
    return f;
  });
  tribunal.append(sillas, el("div", "mj-mesa-tribunal", "COMISIÓN EXAMINADORA"));

  const bocadillo = el("div", "mj-bocadillo profe");
  bocadillo.append(el("b", "", o.profesor ?? "La Comisión"), el("p", "", o.pregunta));

  const ayuda = el("p", "mj-ayuda", "Arma tu respuesta con las ideas correctas. Ojo: hay trampas.");
  ayuda.setAttribute("aria-live", "polite");
  const pool = el("div", "mj-ideas");
  pool.setAttribute("aria-label", "Ideas disponibles");

  const bandeja = el("section", "mj-bandeja");
  const bandejaCab = el("header");
  const bandejaN = el("span", "mj-bandeja-n", `0/${max}`);
  bandejaCab.append(el("b", "", "Tu respuesta"), bandejaN);
  const bandejaChips = el("div", "mj-bandeja-chips");
  const vacia = el("p", "mj-bandeja-vacia", "Toca una idea para sumarla a tu respuesta.");
  bandejaChips.append(vacia);
  bandeja.append(bandejaCab, bandejaChips);

  const responderBtn = el("button", "boton grande mj-responder", "Responder");
  responderBtn.type = "button";
  responderBtn.disabled = true;
  const acciones = el("div", "mj-acciones");
  acciones.append(responderBtn);

  const resultado = el("div", "mj-resultado");
  resultado.hidden = true;

  const cuerpo = el("div", "mj-comision-cuerpo");
  const izqCol = el("div", "mj-comision-izq");
  const derCol = el("div", "mj-comision-der");
  izqCol.append(tribunal, bocadillo, ayuda, pool);
  derCol.append(bandeja, acciones);
  cuerpo.append(izqCol, derCol);
  hoja.append(cab, cuerpo, resultado);
  raiz.append(hoja);
  document.getElementById("ui")!.append(raiz);
  raiz.addEventListener("click", () => (document.activeElement as HTMLElement | null)?.blur?.(), true);
  gsap.fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  gsap.fromTo(hoja, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.4)" });
  if (!ajustes.menosMovimiento) gsap.fromTo(caras, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.1, delay: 0.1, ease: "back.out(2)" });

  return new Promise((fin) => {
    let fase: "arma" | "evalua" | "fin" | "cerrando" = "arma";
    let cambios = 0, ganado = 0, claves = 0;
    const t0 = performance.now();
    const elegidas: Idea[] = [];
    const ideas: Idea[] = mezclar([...o.claves.map((texto) => ({ texto, clave: true })), ...o.trampas.map((texto) => ({ texto, clave: false }))]).map((d, i) => {
      const b = el("button", "mj-idea");
      b.type = "button";
      b.append(el("span", "mj-idea-t", d.texto));
      const idea: Idea = { ...d, i, boton: b };
      b.addEventListener("click", () => alternar(idea));
      b.addEventListener("pointerenter", (ev) => { if (ev.pointerType === "mouse" && fase === "arma") { focoEl = b; marcarFoco(); } });
      pool.append(b);
      return idea;
    });
    gsap.fromTo(ideas.map((d) => d.boton), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.04, delay: 0.25, ease: "back.out(2.2)" });
    sonido.efecto("escuchar");

    const reloj = setInterval(() => {
      const s = Math.floor((performance.now() - t0) / 1000);
      crono.textContent = `⏱ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    }, 500);

    // ── Foco con teclado: ideas, después tu respuesta, después «Responder» ──
    let focoEl: HTMLElement = ideas[0]?.boton ?? responderBtn;
    const recorrido = (): HTMLElement[] => [
      ...[...pool.children].filter((x): x is HTMLButtonElement => x instanceof HTMLButtonElement),
      ...elegidas.map((d) => d.boton),
      ...(responderBtn.disabled ? [] : [responderBtn]),
    ];
    const marcarFoco = () => {
      for (const d of ideas) d.boton.classList.toggle("foco", d.boton === focoEl && fase === "arma");
      responderBtn.classList.toggle("foco", focoEl === responderBtn && fase === "arma");
    };

    const pintarBandeja = () => {
      bandejaN.textContent = `${elegidas.length}/${max}`;
      bandeja.classList.toggle("llena", elegidas.length >= max);
      vacia.hidden = elegidas.length > 0;
      responderBtn.disabled = elegidas.length === 0;
      responderBtn.textContent = elegidas.length ? `Responder · ${elegidas.length}/${max}` : "Responder";
    };

    /** Mueve la idea entre el montón y tu respuesta (con un FLIP: vuela de un lugar a otro). */
    const alternar = (d: Idea) => {
      if (fase !== "arma") return;
      const antes = d.boton.getBoundingClientRect();
      const k = elegidas.indexOf(d);
      if (k >= 0) {
        elegidas.splice(k, 1);
        cambios++;
        const siguiente = ideas.filter((x) => x.i > d.i && !elegidas.includes(x)).map((x) => x.boton).find((b) => b.parentElement === pool);
        pool.insertBefore(d.boton, siguiente ?? null);
        d.boton.classList.remove("elegida");
        sonido.efecto("mover");
      } else {
        if (elegidas.length >= max) {
          sonido.efecto("golpe");
          sacudir(bandeja);
          ayuda.textContent = `Tu respuesta ya tiene ${max} ideas: quita una para cambiarla.`;
          return;
        }
        elegidas.push(d);
        bandejaChips.append(d.boton);
        d.boton.classList.add("elegida");
        sonido.efecto("papel");
        if (!ajustes.menosMovimiento) gsap.fromTo(responderBtn, { scale: 1.08 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
      }
      pintarBandeja();
      const despues = d.boton.getBoundingClientRect();
      if (!ajustes.menosMovimiento) gsap.fromTo(d.boton, { x: antes.left - despues.left, y: antes.top - despues.top, scale: 1.08 }, { x: 0, y: 0, scale: 1, duration: 0.32, ease: "power3.out" });
      ayuda.textContent = elegidas.length >= max ? "Tu respuesta está completa. ¿Respondes?" : "Arma tu respuesta con las ideas correctas. Ojo: hay trampas.";
      // Con la respuesta llena, el foco salta a «Responder».
      if (elegidas.length >= max && k < 0) { focoEl = responderBtn; responderBtn.scrollIntoView({ block: "nearest", behavior: ajustes.menosMovimiento ? "auto" : "smooth" }); }
      marcarFoco();
    };

    // ── Responder ────────────────────────────────────────────────────────
    const escribir = (p: HTMLElement, texto: string) => new Promise<void>((r) => {
      const lps = Math.max(letrasPorSegundo(), 90);
      const v = { n: 0 };
      let ultimo = 0;
      p.textContent = "";
      gsap.to(v, {
        n: texto.length, duration: Number.isFinite(lps) ? texto.length / lps : 0, ease: "none",
        onUpdate: () => { const k = Math.round(v.n); p.textContent = texto.slice(0, k); if (k - ultimo >= 3) { ultimo = k; sonido.blip("voz"); } },
        onComplete: () => { p.textContent = texto; r(); },
      });
    });

    const medidor = (nombre: string) => {
      const m = el("div", "mj-medidor");
      const barra = el("span", "mj-medidor-barra");
      const i = el("i");
      barra.append(i);
      const n = el("b", "", "0 %");
      m.append(el("span", "mj-medidor-t", nombre), barra, n);
      return { m, i, n };
    };
    const llenar = (x: ReturnType<typeof medidor>, v: number, delay: number) => {
      const o2 = { n: 0 };
      x.i.dataset.n = v < 0.4 ? "mal" : v < 0.7 ? "medio" : "bien";
      gsap.fromTo(x.i, { width: "0%" }, { width: `${Math.round(v * 100)}%`, duration: 0.8, delay, ease: "power2.out" });
      gsap.to(o2, { n: v * 100, duration: 0.8, delay, ease: "power2.out", onUpdate: () => { x.n.textContent = `${Math.round(o2.n)} %`; } });
    };

    const responder = async () => {
      if (fase !== "arma" || !elegidas.length) return;
      fase = "evalua";
      clearInterval(reloj);
      marcarFoco();
      sonido.efecto("elegir");
      const segundos = (performance.now() - t0) / 1000;
      claves = elegidas.filter((d) => d.clave).length;
      const trampas = elegidas.length - claves;
      const precision = Math.max(0, Math.min(1, (claves - trampas) / Math.max(1, total)));
      const aplomo = Math.max(0.1, Math.min(1, 1 - Math.max(0, segundos - 25) / 120 - cambios * 0.06));
      for (const d of ideas) d.boton.disabled = true;
      acciones.hidden = true;
      ayuda.hidden = true;
      // La comisión revisa idea por idea.
      for (const d of elegidas) {
        d.boton.classList.add(d.clave ? "bien" : "mal");
        sonido.efecto(d.clave ? "elegir" : "golpe");
        if (!ajustes.menosMovimiento) gsap.fromTo(d.boton, { scale: 1.18 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
        if (d.clave) {
          const r = d.boton.getBoundingClientRect();
          flotar(`+${POR_CLAVE}`, r.left + r.width / 2 - 14, r.top - 4, "saber mj-flota");
          ganado += POR_CLAVE;
          saberN.textContent = String(ganado);
        }
        await espera(ajustes.menosMovimiento ? 80 : 280);
      }
      for (const d of ideas) if (d.clave && !elegidas.includes(d)) d.boton.classList.add("falto");
      for (const d of ideas) if (!d.clave && !elegidas.includes(d)) d.boton.classList.add("apagada");
      await espera(300);

      // Las caras de la comisión.
      const bien = precision >= 0.75;
      if (!ajustes.menosMovimiento) {
        if (bien) gsap.fromTo(caras, { y: 0 }, { y: -8, duration: 0.14, yoyo: true, repeat: 3, stagger: 0.08 });
        else gsap.fromTo(caras, { x: 0 }, { x: 5, duration: 0.08, yoyo: true, repeat: 5, stagger: 0.08 });
      }

      const nota = Math.round(notaChilena(precision) * 10) / 10;
      const aprobado = nota >= 4;
      resultado.replaceChildren();
      const fila = el("div", "mj-resultado-fila");
      const medidores = el("div", "mj-medidores");
      const mp = medidor("Precisión"), ma = medidor("Aplomo");
      medidores.append(mp.m, ma.m);
      const notaEl = el("div", `mj-nota ${aprobado ? "bien" : "mal"}`);
      notaEl.append(el("small", "", "Nota"), el("b", "", nota.toFixed(1).replace(".", ",")), el("small", "", aprobado ? "Aprobado" : "Reprobado"));
      fila.append(medidores, notaEl);
      const resumen = el("p", "mj-resumen", `Claves: ${claves} de ${total} · Trampas: ${trampas}`);
      const modelo = el("div", "mj-modelo");
      modelo.append(el("h4", "", "Respuesta modelo"), el("p", "", o.modelo));
      resultado.append(fila, resumen, modelo);
      let repreP: HTMLElement | null = null;
      if (o.repregunta) {
        const rep = el("div", "mj-bocadillo profe repregunta");
        repreP = el("p");
        rep.append(el("b", "", `${o.profesor ?? "La Comisión"} repregunta`), repreP);
        resultado.append(rep);
      }
      const seguir = el("button", "boton grande foco", "Seguir");
      seguir.type = "button";
      seguir.addEventListener("click", () => salir());
      resultado.append(seguir);
      resultado.hidden = false;
      gsap.fromTo(resultado, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 });
      llenar(mp, precision, 0.1);
      llenar(ma, aplomo, 0.3);
      gsap.fromTo(notaEl, { scale: 2.4, rotation: -18, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.25, delay: 0.9, ease: "power4.in", onComplete: () => { sonido.efecto(aprobado ? "papel" : "golpe"); sacudir(notaEl); } });
      fase = "fin";
      const perfecta = claves === total && trampas === 0;
      setTimeout(() => {
        sonido.efecto(perfecta ? "hallazgo" : aprobado ? "campana" : "escuchar");
        if (perfecta) { const r = notaEl.getBoundingClientRect(); confeti(r.left + r.width / 2, r.top + r.height / 2, 50); }
      }, 1150);
      if (perfecta) logro("comision");
      if (ganado) ganarSaber(ganado);
      resultado.scrollIntoView({ block: "nearest", behavior: ajustes.menosMovimiento ? "auto" : "smooth" });
      if (repreP && o.repregunta) { await espera(1200); await escribir(repreP, o.repregunta); }
    };
    responderBtn.addEventListener("click", () => void responder());

    const salir = () => {
      if (fase !== "fin") return;
      fase = "cerrando";
      clearInterval(reloj);
      ui.cerrarPanel();
      sonido.efecto("elegir");
      gsap.to(raiz, { opacity: 0, duration: 0.22, onComplete: () => { raiz.remove(); fin({ claves, total }); } });
    };

    ui.abrirPanel(
      () => {
        if (fase === "fin") { salir(); return; }
        if (fase !== "arma") return;
        if (focoEl === responderBtn) { void responder(); return; }
        const d = ideas.find((x) => x.boton === focoEl);
        if (d) alternar(d);
      },
      (code) => {
        if (fase !== "arma") return;
        const lista = recorrido();
        if (!lista.length) return;
        const k = Math.max(0, lista.indexOf(focoEl));
        const d = /Right|KeyD|Down|KeyS/.test(code) ? 1 : -1;
        focoEl = lista[(k + d + lista.length) % lista.length];
        marcarFoco();
        focoEl.scrollIntoView({ block: "nearest" });
        sonido.efecto("mover");
      },
    );
    marcarFoco();
  });
}
