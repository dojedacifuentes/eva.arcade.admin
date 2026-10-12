// La Mesa: los expedientes llegan al escritorio. Se lee el documento (un
// decreto, una resolución, una solicitud), se detecta el problema —o que no lo
// hay— y se timbra. Racha que multiplica el Saber, un reloj suave que sólo quita
// el bono de rapidez (sin reloj en modo historia) y la explicación de cada sello.
import "./minijuegos.css";
import gsap from "gsap";
import type { Expediente, Sello } from "../content/tipos";
import { PARTES } from "../content/personajes";
import { retrato } from "../game/art/characters";
import { estado, guardar } from "../game/estado";
import { ajustes, holgura } from "../juego/ajustes";
import { ganarSaber, logro } from "../juego/progreso";
import { confeti, flotar } from "./efectos";
import { sonido } from "./sonido";
import { ui } from "./ui";

const TIEMPO = 25; // segundos por expediente para el bono de rapidez
const BASE = 40; // Saber por expediente bien timbrado, antes del multiplicador

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

type Fase = "elige" | "lee" | "pausa" | "fin" | "cerrando";

/** La Mesa: timbrar expedientes. Devuelve cuántos se timbraron bien. */
export function mesa(o: { titulo: string; expedientes: Expediente[]; alAcertar?: (ex: Expediente) => Promise<void> | void }): Promise<{ aciertos: number; total: number }> {
  const lista = o.expedientes;
  const total = lista.length;
  if (!total) return Promise.resolve({ aciertos: 0, total: 0 });

  // ── Esqueleto ────────────────────────────────────────────────────────────
  const raiz = el("div", "mj-capa mj-mesa");
  raiz.id = "mj-mesa";
  const hoja = el("div", "mj-hoja mj-mesa-hoja");
  hoja.setAttribute("role", "dialog");
  hoja.setAttribute("aria-label", o.titulo);

  const cab = el("header", "mj-cab");
  const titulo = el("h3", "mj-titulo");
  titulo.append(el("span", "mj-titulo-ico", "🗂"), el("span", "", o.titulo));
  const marcador = el("div", "mj-marcador");
  const rachaEl = el("span", "mj-racha");
  rachaEl.setAttribute("aria-live", "polite");
  const saberEl = el("span", "mj-saber");
  const saberN = el("b", "", "0");
  saberEl.append(saberN, el("small", "", "Saber"));
  marcador.append(rachaEl, saberEl);
  cab.append(titulo, marcador);

  const puntos = el("div", "mj-puntos");
  lista.forEach(() => puntos.append(el("i")));

  const relojEl = el("div", "mj-reloj");
  const relojBarra = el("i");
  const relojEt = el("small", "", "Bono de rapidez");
  const relojPista = el("span", "mj-reloj-pista");
  relojPista.append(relojBarra);
  relojEl.append(relojPista, relojEt);

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
  const pregunta = el("p", "mj-pregunta");
  const sellosEl = el("div", "mj-sellos");
  const veredicto = el("div", "mj-veredicto");
  veredicto.hidden = true;
  veredicto.setAttribute("aria-live", "polite");
  lado.append(relato, pregunta, sellosEl, veredicto);
  cuerpo.append(docZona, lado);

  hoja.append(cab, puntos, relojEl, cuerpo);
  raiz.append(hoja);
  document.getElementById("ui")!.append(raiz);
  // Un botón tocado no se queda con el foco del navegador (Enter lo volvería a pulsar).
  raiz.addEventListener("click", () => (document.activeElement as HTMLElement | null)?.blur?.(), true);
  gsap.fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  gsap.fromTo(hoja, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.4)" });

  return new Promise((fin) => {
    let i = 0, aciertos = 0, racha = 0, mejor = 0, ganado = 0, foco = 0;
    let fase: Fase = "pausa";
    let aTiempo = true, ultimoBien = false;
    let reloj: gsap.core.Tween | null = null;
    let orden: Sello[] = [];
    let botones: HTMLButtonElement[] = [];

    const pintarRacha = () => {
      rachaEl.textContent = racha >= 2 ? `🔥 ${racha} · ×${multiplicador(racha).toFixed(1)}` : "";
      if (racha >= 2) gsap.fromTo(rachaEl, { scale: 1.4 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    };
    const pintarSaber = () => {
      const v = { n: Number(saberN.textContent) || 0 };
      gsap.to(v, { n: ganado, duration: 0.6, ease: "power2.out", onUpdate: () => { saberN.textContent = String(Math.round(v.n)); } });
      gsap.fromTo(saberEl, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
    };
    const marcarFoco = () => {
      if (fase !== "elige") return;
      botones.forEach((b, k) => b.classList.toggle("foco", k === foco));
    };

    // ── El documento ─────────────────────────────────────────────────────
    const pintarDoc = (ex: Expediente) => {
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
      const campos = el("dl", "mj-campos");
      for (const c of ex.documento.campos) {
        const fila = el("div", "mj-campo");
        fila.append(el("dt", "", c.k), el("dd", "", c.v));
        campos.append(fila);
      }
      const firma = el("footer", "mj-firma");
      firma.append(el("span", "mj-firma-linea"), el("small", "", "Firma y timbre"));
      doc.append(membrete, tipo, lugar, mat, campos, firma);
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
        b.addEventListener("click", () => elegir(k));
        b.addEventListener("pointerenter", (ev) => { if (ev.pointerType === "mouse" && fase === "elige") { foco = k; marcarFoco(); } });
        sellosEl.append(b);
        return b;
      });
      sellosEl.hidden = false;
      veredicto.hidden = true;
      foco = 0;
    };

    // ── Un expediente ────────────────────────────────────────────────────
    const mostrar = () => {
      const ex = lista[i];
      pintarDoc(ex);
      pintarSellos(ex);
      relatoP.textContent = ex.relato;
      pregunta.textContent = ex.pregunta;
      [...puntos.children].forEach((d, k) => d.classList.toggle("actual", k === i));
      sonido.efecto("papel");
      const quieto = ajustes.menosMovimiento;
      gsap.fromTo(doc, quieto ? { opacity: 0 } : { x: 220, y: -40, rotation: 14, opacity: 0 }, { x: 0, y: 0, rotation: quieto ? 0 : -1.2, opacity: 1, duration: 0.45, ease: "back.out(1.3)" });
      gsap.fromTo(relato, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.15 });
      gsap.fromTo(botones, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.06, delay: 0.25, ease: "back.out(2)" });
      hoja.scrollTop = 0;
      fase = "elige";
      marcarFoco();
      // Reloj suave: al acabarse sólo se pierde el bono, nunca el expediente.
      aTiempo = true;
      reloj?.kill();
      relojEl.classList.remove("agotado");
      relojEt.textContent = "Bono de rapidez";
      if (ajustes.modoHistoria) { relojEl.hidden = true; return; }
      reloj = gsap.fromTo(relojBarra, { scaleX: 1 }, {
        scaleX: 0, duration: TIEMPO * holgura(), ease: "none",
        onComplete: () => { aTiempo = false; relojEl.classList.add("agotado"); relojEt.textContent = "Sin bono · tómate tu tiempo"; sonido.efecto("tiempo"); },
      });
    };

    /** El timbre cae sobre el documento. */
    const timbrar = async (texto: string, bien: boolean) => {
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
      const giro = bien ? -6 - Math.random() * 5 : 5 + Math.random() * 5;
      await gsap.fromTo(t, { xPercent: -50, yPercent: -50, scale: 2.4, rotation: giro - 20, opacity: 0 }, { scale: 1, rotation: giro, opacity: 0.94, duration: 0.22, ease: "power4.in" });
      sonido.efecto(bien ? "papel" : "golpe");
      sacudir(hoja);
      gsap.fromTo(t.querySelectorAll(".mj-gota"), { scale: 0 }, { scale: 1, duration: 0.18, stagger: 0.02 });
      return t;
    };

    const elegir = async (k: number) => {
      if (fase !== "elige" || !orden[k]) return;
      fase = "lee";
      reloj?.kill();
      const ex = lista[i];
      const s = orden[k];
      const bien = s.correcto;
      ultimoBien = bien;
      const correcto = ex.sellos.find((x) => x.correcto);
      botones.forEach((b, j) => { b.disabled = true; b.classList.remove("foco"); b.classList.toggle("elegido", j === k); });
      sonido.efecto("elegir");
      if (!ajustes.menosMovimiento) gsap.fromTo(botones[k], { y: 0 }, { y: 7, duration: 0.09, yoyo: true, repeat: 1 });
      // En el celular el documento puede haber quedado arriba: se trae a la vista antes del golpe.
      const rd = doc.getBoundingClientRect(), rh = hoja.getBoundingClientRect();
      if (rd.top + rd.height * 0.4 < rh.top || rd.top + rd.height * 0.7 > rh.bottom) {
        doc.scrollIntoView({ block: "center", behavior: ajustes.menosMovimiento ? "auto" : "smooth" });
        await new Promise((r) => setTimeout(r, ajustes.menosMovimiento ? 30 : 420));
      }
      const t = await timbrar(s.texto, bien);

      let g = 0;
      if (bien) {
        aciertos++; racha++; mejor = Math.max(mejor, racha);
        const m = aTiempo ? multiplicador(racha) : 1;
        g = Math.round(BASE * m);
        ganado += g;
        const r = t.getBoundingClientRect();
        confeti(r.left + r.width / 2, r.top + r.height / 2, 18);
        flotar(`+${g} Saber`, r.left + r.width / 2 - 40, r.top - 6, "saber mj-flota");
        sonido.efecto("cobrar");
        logro("primer-sello");
        if (racha >= 5) logro("racha-mesa");
        pintarSaber();
      } else racha = 0;
      pintarRacha();
      const dot = puntos.children[i] as HTMLElement;
      dot.classList.remove("actual"); dot.classList.add(bien ? "bien" : "mal");
      if (estado) {
        const m = estado.mesa ?? { resueltos: 0, aciertos: 0, mejorRacha: 0 };
        estado.mesa = { resueltos: m.resueltos + 1, aciertos: m.aciertos + (bien ? 1 : 0), mejorRacha: Math.max(m.mejorRacha, racha) };
        guardar();
      }

      // Veredicto: el porqué del sello elegido y, si falló, el del correcto.
      veredicto.replaceChildren();
      veredicto.dataset.bien = String(bien);
      const mult = aTiempo ? multiplicador(racha) : 1;
      const sinBono = bien && !aTiempo && !ajustes.modoHistoria ? " · sin bono" : "";
      veredicto.append(el("p", "mj-ver-titulo", bien ? `¡Bien timbrado! +${g} Saber${mult > 1 ? ` (×${mult.toFixed(1)})` : ""}${sinBono}` : `No era «${partir(s.texto)[0]}».`));
      veredicto.append(el("p", "mj-ver-porque", s.porque));
      if (!bien && correcto) {
        const c = el("p", "mj-ver-correcto");
        const [corto, resto] = partir(correcto.texto);
        c.append(el("b", "", `Lo correcto: «${corto}». `), document.createTextNode(`${resto ? resto.charAt(0).toUpperCase() + resto.slice(1) + ". " : ""}${correcto.porque}`));
        veredicto.append(c);
      }
      veredicto.append(el("p", "mj-norma", ex.norma));
      const sig = el("button", "boton grande mj-siguiente foco", i + 1 < total ? "Siguiente ›" : "Ver resultado ›");
      sig.type = "button";
      sig.addEventListener("click", () => siguiente());
      veredicto.append(sig);
      await new Promise((r) => setTimeout(r, 260));
      sellosEl.hidden = true;
      veredicto.hidden = false;
      gsap.fromTo(veredicto, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
      veredicto.scrollIntoView({ block: "nearest", behavior: ajustes.menosMovimiento ? "auto" : "smooth" });
    };

    const siguiente = async () => {
      if (fase !== "lee") return;
      fase = "pausa";
      sonido.efecto("elegir");
      const ex = lista[i];
      if (ultimoBien && o.alAcertar) {
        // Lo que quiera mostrar quien llama (un hallazgo): la Mesa espera debajo.
        ui.cerrarPanel();
        raiz.classList.add("mj-en-pausa");
        try { await o.alAcertar(ex); } catch (err) { console.error(err); }
        raiz.classList.remove("mj-en-pausa");
        ui.abrirPanel(accion, tecla);
      }
      // El expediente se archiva hacia la izquierda.
      await gsap.to(doc, ajustes.menosMovimiento ? { opacity: 0, duration: 0.15 } : { x: -260, y: 30, rotation: -16, opacity: 0, duration: 0.3, ease: "power2.in" });
      i++;
      if (i < total) mostrar(); else final();
    };

    // ── Resultado ────────────────────────────────────────────────────────
    const final = () => {
      fase = "fin";
      reloj?.kill();
      const estrellas = aciertos === total ? 3 : aciertos >= total - 1 && total >= 3 ? 2 : aciertos >= Math.ceil(total / 2) ? 1 : 0;
      const tarjeta = el("div", "mj-final");
      tarjeta.append(el("p", "mj-final-cinta", "Mesa despachada"), el("h3", "", o.titulo));
      const est = el("p", "mj-estrellas");
      est.setAttribute("aria-label", `${estrellas} de 3 estrellas`);
      const spans = [0, 1, 2].map((k) => { const s = el("span", k < estrellas ? "llena" : "", k < estrellas ? "★" : "☆"); est.append(s); return s; });
      const cifras = el("div", "mj-cifras");
      const cifra = (n: string, t: string) => { const c = el("div", "mj-cifra"); c.append(el("b", "", n), el("small", "", t)); cifras.append(c); };
      cifra(`${aciertos}/${total}`, "bien timbrados");
      cifra(`${mejor}`, "mejor racha");
      cifra(`+${ganado}`, "Saber");
      const msj = estrellas === 3 ? "Ni un vicio se te escapó. La Contraloría no tendrá nada que observar."
        : estrellas >= 2 ? "Muy buen ojo. Repasa el que se te fue y la próxima es perfecta."
        : "Cada sello equivocado es un acto que alguien va a impugnar. Vuelve a leer los fundamentos.";
      const seguir = el("button", "boton grande foco", "Seguir");
      seguir.type = "button";
      seguir.addEventListener("click", () => salir());
      tarjeta.append(est, cifras, el("p", "mj-final-msj", msj), seguir);
      hoja.replaceChildren(tarjeta);
      hoja.classList.add("mj-hoja-final");
      gsap.fromTo(tarjeta, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
      gsap.fromTo(spans, { scale: 0.2, opacity: 0, rotation: -30 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.4, stagger: 0.16, delay: 0.15, ease: "back.out(2.4)" });
      sonido.efecto(estrellas === 3 ? "hallazgo" : "campana");
      if (estrellas === 3) setTimeout(() => confeti(innerWidth / 2, innerHeight * 0.35, 60), 450);
      if (ganado) ganarSaber(ganado);
      if (aciertos === total && total >= 4) logro("sin-vicios");
    };

    const salir = () => {
      if (fase !== "fin") return;
      fase = "cerrando";
      ui.cerrarPanel();
      removeEventListener("keydown", teclas);
      sonido.efecto("elegir");
      gsap.to(raiz, { opacity: 0, duration: 0.22, onComplete: () => { raiz.remove(); fin({ aciertos, total }); } });
    };

    // ── Controles ────────────────────────────────────────────────────────
    const accion = () => {
      if (fase === "elige") elegir(foco);
      else if (fase === "lee") siguiente();
      else if (fase === "fin") salir();
    };
    const tecla = (code: string) => {
      if (fase !== "elige" || !botones.length) return;
      const cols = Math.max(1, Math.round(sellosEl.clientWidth / Math.max(1, botones[0].offsetWidth)));
      const d = /Right|KeyD/.test(code) ? 1 : /Left|KeyA/.test(code) ? -1 : /Down|KeyS/.test(code) ? cols : -cols;
      foco = Math.max(0, Math.min(botones.length - 1, foco + d));
      marcarFoco();
      botones[foco]?.scrollIntoView({ block: "nearest" });
      sonido.efecto("mover");
    };
    const teclas = (ev: KeyboardEvent) => {
      if (!document.body.contains(raiz)) { removeEventListener("keydown", teclas); return; }
      if (fase !== "elige") return;
      const n = Number(ev.key);
      if (n >= 1 && n <= botones.length) { ev.preventDefault(); elegir(n - 1); }
    };
    addEventListener("keydown", teclas);
    ui.abrirPanel(accion, tecla);
    mostrar();
  });
}
