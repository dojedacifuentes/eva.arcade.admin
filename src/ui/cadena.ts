// La Cadena: ordenar los pasos de un procedimiento. Las cartas llegan
// revueltas y se arma la línea eligiendo, una a una, la que sigue. Tres vidas:
// si se acaban no hay «game over», EVA completa la cadena y explica.
import "./minijuegos.css";
import gsap from "gsap";
import type { Cadena } from "../content/tipos";
import { ajustes, pausa } from "../juego/ajustes";
import { ganarSaber, logro } from "../juego/progreso";
import { confeti, flotar } from "./efectos";
import { sonido } from "./sonido";
import { ui } from "./ui";

const VIDAS = 3;
const POR_PASO = 25; // Saber por paso bien puesto

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

type Carta = { texto: string; orden: number; boton: HTMLButtonElement };

/** Ordenar una cadena de pasos. `perfecto` si salió sin un solo error. */
export function cadena(c: Cadena): Promise<{ perfecto: boolean }> {
  const n = c.pasos.length;
  if (!n) return Promise.resolve({ perfecto: true });

  const raiz = el("div", "mj-capa mj-cadena");
  raiz.id = "mj-cadena";
  const hoja = el("div", "mj-hoja mj-cadena-hoja");
  hoja.setAttribute("role", "dialog");
  hoja.setAttribute("aria-label", c.titulo);

  const cab = el("header", "mj-cab");
  const titulo = el("h3", "mj-titulo");
  titulo.append(el("span", "mj-titulo-ico", "🔗"), el("span", "", c.titulo));
  const marcador = el("div", "mj-marcador");
  const vidasEl = el("span", "mj-vidas");
  vidasEl.setAttribute("aria-label", `${VIDAS} vidas`);
  const corazones = Array.from({ length: VIDAS }, () => { const h = el("i", "", "♥"); vidasEl.append(h); return h; });
  const saberEl = el("span", "mj-saber");
  const saberN = el("b", "", "0");
  saberEl.append(saberN, el("small", "", "Saber"));
  marcador.append(vidasEl, saberEl);
  cab.append(titulo, marcador);

  const ayuda = el("p", "mj-ayuda", "Arma la cadena: elige el paso que viene ahora.");
  ayuda.setAttribute("aria-live", "polite");

  const cuerpo = el("div", "mj-cadena-cuerpo");
  const linea = el("ol", "mj-linea");
  const huecos = c.pasos.map((_, k) => {
    const li = el("li", "mj-hueco");
    if (k > 0) li.append(el("span", "mj-conector"));
    li.append(el("span", "mj-hueco-n", String(k + 1)), el("span", "mj-hueco-t", "…"));
    linea.append(li);
    return li;
  });
  const mazo = el("div", "mj-mazo");
  mazo.setAttribute("role", "listbox");
  cuerpo.append(linea, mazo);

  const cierre = el("div", "mj-cierre");
  cierre.hidden = true;

  hoja.append(cab, ayuda, cuerpo, cierre);
  raiz.append(hoja);
  document.getElementById("ui")!.append(raiz);
  raiz.addEventListener("click", () => (document.activeElement as HTMLElement | null)?.blur?.(), true);
  gsap.fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  gsap.fromTo(hoja, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.4)" });

  return new Promise((fin) => {
    let puestos = 0, vidas = VIDAS, errores = 0, bienDirectos = 0, ganado = 0, foco = 0;
    let fase: "juega" | "anima" | "auto" | "fin" | "cerrando" = "juega";
    let cartas: Carta[] = [];

    const renumerar = () => {
      cartas.forEach((ct, k) => { (ct.boton.querySelector(".mj-tecla") as HTMLElement).textContent = String(k + 1); });
      foco = Math.min(foco, Math.max(0, cartas.length - 1));
      marcarFoco();
    };
    const marcarFoco = () => cartas.forEach((ct, k) => ct.boton.classList.toggle("foco", k === foco && fase === "juega"));
    const marcarSiguiente = () => huecos.forEach((h, k) => h.classList.toggle("toca", k === puestos && fase !== "fin"));
    const pintarSaber = () => {
      const v = { n: Number(saberN.textContent) || 0 };
      gsap.to(v, { n: ganado, duration: 0.5, onUpdate: () => { saberN.textContent = String(Math.round(v.n)); } });
      gsap.fromTo(saberEl, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
    };

    cartas = mezclar(c.pasos.map((texto, orden) => ({ texto, orden }))).map((p, k) => {
      const b = el("button", "mj-paso");
      b.type = "button";
      b.setAttribute("role", "option");
      b.append(el("span", "mj-tecla", String(k + 1)), el("span", "mj-paso-t", p.texto));
      const carta: Carta = { ...p, boton: b };
      b.addEventListener("click", () => elegir(carta));
      b.addEventListener("pointerenter", (ev) => { if (ev.pointerType === "mouse" && fase === "juega") { foco = cartas.indexOf(carta); marcarFoco(); } });
      mazo.append(b);
      return carta;
    });
    gsap.fromTo(cartas.map((ct) => ct.boton), { y: 30, opacity: 0, rotation: () => Math.random() * 8 - 4 }, { y: 0, opacity: 1, rotation: 0, duration: 0.35, stagger: 0.06, delay: 0.15, ease: "back.out(1.8)" });
    sonido.efecto("papel");

    /** La carta vuela a su hueco de la línea y el conector se enciende. */
    const colocar = async (carta: Carta, auto: boolean) => {
      const hueco = huecos[carta.orden];
      hueco.scrollIntoView({ block: "nearest" });
      const a = carta.boton.getBoundingClientRect();
      const b = hueco.getBoundingClientRect();
      const vuela = carta.boton.cloneNode(true) as HTMLElement;
      vuela.classList.add("mj-vuela");
      vuela.classList.remove("foco");
      Object.assign(vuela.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
      document.getElementById("ui")!.append(vuela);
      carta.boton.style.visibility = "hidden";
      sonido.efecto(auto ? "mover" : "elegir");
      await gsap.to(vuela, { left: b.left, top: b.top, width: b.width, height: b.height, rotation: ajustes.menosMovimiento ? 0 : -2, duration: ajustes.menosMovimiento ? 0.01 : 0.38, ease: "power2.inOut" });
      vuela.remove();
      // La carta sale del mazo con un pliegue suave.
      cartas = cartas.filter((x) => x !== carta);
      gsap.to(carta.boton, { height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, borderWidth: 0, duration: 0.18, onComplete: () => carta.boton.remove() });
      renumerar();
      hueco.classList.add("lleno");
      if (auto) hueco.classList.add("auto");
      (hueco.querySelector(".mj-hueco-t") as HTMLElement).textContent = carta.texto;
      hueco.querySelector(".mj-conector")?.classList.add("encendido");
      gsap.fromTo(hueco, { scale: 1.06 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
      puestos++;
      marcarSiguiente();
    };

    const elegir = async (carta: Carta) => {
      if (fase !== "juega") return;
      if (carta.orden === puestos) {
        fase = "anima";
        bienDirectos++;
        ganado += POR_PASO;
        await colocar(carta, false);
        sonido.efecto("cobrar");
        const h = huecos[carta.orden].getBoundingClientRect();
        flotar(`+${POR_PASO}`, h.right - 60, h.top - 4, "saber mj-flota");
        if (!ajustes.menosMovimiento) confeti(h.left + 24, h.top + h.height / 2, 8);
        pintarSaber();
        ayuda.textContent = puestos < n ? "¡Eso! ¿Y después?" : "¡Cadena completa!";
        if (puestos === n) { await espera(350); terminar(); return; }
        fase = "juega";
        marcarFoco();
      } else {
        errores++;
        vidas--;
        sonido.efecto("golpe");
        carta.boton.classList.add("mal");
        if (!ajustes.menosMovimiento) gsap.fromTo(carta.boton, { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1.2, 0.25)" });
        setTimeout(() => carta.boton.classList.remove("mal"), 650);
        sacudir(hoja);
        const h = corazones[vidas];
        if (h) { h.classList.add("perdido"); gsap.fromTo(h, { scale: 1.8 }, { scale: 1, duration: 0.4, ease: "back.out(3)" }); }
        vidasEl.setAttribute("aria-label", `${vidas} vidas`);
        ayuda.textContent = vidas > 0 ? `Todavía no: ese paso va más adelante. ${vidas === 1 ? "Te queda una vida." : `Te quedan ${vidas} vidas.`}` : "Sin vidas: EVA completa la cadena. Mírala bien.";
        if (vidas <= 0) autocompletar();
      }
    };

    const autocompletar = async () => {
      fase = "auto";
      marcarFoco();
      mazo.classList.add("bloqueado");
      await espera(700 * pausa());
      while (puestos < n) {
        const carta = cartas.find((x) => x.orden === puestos);
        if (!carta) break;
        await colocar(carta, true);
        await espera(260 * pausa());
      }
      terminar();
    };

    const terminar = () => {
      fase = "fin";
      marcarSiguiente();
      const perfecto = errores === 0;
      mazo.hidden = true;
      cuerpo.classList.add("completa");
      ayuda.hidden = true;
      cierre.replaceChildren();
      cierre.dataset.estado = perfecto ? "perfecto" : vidas > 0 ? "tropiezos" : "auto";
      cierre.append(el("p", "mj-ver-titulo", perfecto ? "¡Cadena perfecta, a la primera!" : vidas > 0 ? `Cadena completa · ${errores} ${errores === 1 ? "tropiezo" : "tropiezos"}` : "La cadena, completada por EVA"));
      if (c.nota) cierre.append(el("p", "mj-ver-porque", c.nota));
      if (c.norma) cierre.append(el("p", "mj-norma", c.norma));
      const cifras = el("div", "mj-cifras");
      const cifra = (v: string, t: string) => { const d = el("div", "mj-cifra"); d.append(el("b", "", v), el("small", "", t)); cifras.append(d); };
      cifra(`${bienDirectos}/${n}`, "pasos tuyos");
      cifra(`${vidas}`, vidas === 1 ? "vida" : "vidas");
      cifra(`+${ganado}`, "Saber");
      cierre.append(cifras);
      const seguir = el("button", "boton grande foco", "Seguir");
      seguir.type = "button";
      seguir.addEventListener("click", () => salir());
      cierre.append(seguir);
      cierre.hidden = false;
      gsap.fromTo(cierre, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
      cierre.scrollIntoView({ block: "nearest", behavior: ajustes.menosMovimiento ? "auto" : "smooth" });
      if (!ajustes.menosMovimiento) gsap.fromTo(huecos.map((h) => h.querySelector(".mj-hueco-n")), { scale: 1 }, { scale: 1.3, duration: 0.12, yoyo: true, repeat: 1, stagger: 0.07 });
      sonido.efecto(perfecto ? "hallazgo" : "campana");
      if (perfecto) { confeti(innerWidth / 2, innerHeight * 0.35, 50); logro("cadena"); }
      if (ganado) ganarSaber(ganado);
    };

    const salir = () => {
      if (fase !== "fin") return;
      fase = "cerrando";
      ui.cerrarPanel();
      removeEventListener("keydown", teclas);
      sonido.efecto("elegir");
      gsap.to(raiz, { opacity: 0, duration: 0.22, onComplete: () => { raiz.remove(); fin({ perfecto: errores === 0 }); } });
    };

    const accion = () => {
      if (fase === "juega" && cartas[foco]) elegir(cartas[foco]);
      else if (fase === "fin") salir();
    };
    const tecla = (code: string) => {
      if (fase !== "juega" || !cartas.length) return;
      const cols = Math.max(1, Math.round(mazo.clientWidth / Math.max(1, cartas[0].boton.offsetWidth)));
      const d = /Right|KeyD/.test(code) ? 1 : /Left|KeyA/.test(code) ? -1 : /Down|KeyS/.test(code) ? cols : -cols;
      foco = (foco + d + cartas.length) % cartas.length;
      marcarFoco();
      cartas[foco].boton.scrollIntoView({ block: "nearest" });
      sonido.efecto("mover");
    };
    const teclas = (ev: KeyboardEvent) => {
      if (!document.body.contains(raiz)) { removeEventListener("keydown", teclas); return; }
      if (fase !== "juega") return;
      const k = Number(ev.key);
      if (k >= 1 && k <= cartas.length) { ev.preventDefault(); elegir(cartas[k - 1]); }
    };
    addEventListener("keydown", teclas);
    ui.abrirPanel(accion, tecla);
    marcarSiguiente();
    marcarFoco();
  });
}
