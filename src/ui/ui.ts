// Capa de interfaz en HTML sobre el lienzo: texto nítido en cualquier pantalla,
// animado con GSAP. Todo lo que espera al jugador devuelve una promesa, así el
// guion de cada escena se lee de arriba abajo.
import gsap from "gsap";
import { controles } from "./controles";
import { retrato, type Apariencia } from "../game/art/characters";
import { sonido } from "./sonido";
import { MARCA } from "../marca-eva";
import { HALLAZGOS, EN_SIMPLE, type Hallazgo } from "../content/hallazgos";
import { estado } from "../game/estado";
import { ajustes, guardarAjustes, letrasPorSegundo, pausa } from "../juego/ajustes";
import { LOGROS } from "../content/logros";
import { nivel, ganarSaber, pintarNuevo } from "../juego/progreso";
import { PREGUNTAS } from "../content/preguntas";
import { aviso, confeti, monedas } from "./efectos";
import { BANCOS } from "../content/banco";
import { MODULOS } from "../content/modulos";

export type Linea = { quien?: string; texto: string; apariencia?: Apariencia };

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector(sel) as T;
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Diálogo ────────────────────────────────────────────────────────────────
let cola: Linea[] = [];
let alTerminar: (() => void) | undefined;
let escribiendo: gsap.core.Tween | null = null;
let modo: "libre" | "dialogo" | "eleccion" | "modal" | "panel" = "libre";

function mostrarLinea(l: Linea) {
  dispatchEvent(new CustomEvent("eva-habla", { detail: l.apariencia }));
  const caja = $("#dialogo");
  caja.classList.toggle("es-eva", l.quien === "EVA");
  $("#dialogo-nombre").textContent = l.quien ?? "";
  $("#dialogo-nombre").hidden = !l.quien;
  const img = $<HTMLImageElement>("#dialogo-retrato");
  const evaImg = $("#dialogo-eva");
  evaImg.hidden = l.quien !== "EVA";
  if (l.apariencia) { img.src = retrato(l.apariencia); img.hidden = false; }
  else img.hidden = true;
  // El retrato rebota al hablar; si la línea grita (¡…! o MAYÚSCULAS), la caja tiembla un poco.
  if (!ajustes.menosMovimiento) {
    if (l.apariencia) gsap.fromTo(img, { scale: 0.86, y: 3 }, { scale: 1, y: 0, duration: 0.28, ease: "back.out(3)" });
    if (/¡[^!]*!|[A-ZÁÉÍÓÚÑ]{4,}/.test(l.texto)) gsap.fromTo(caja, { x: -5 }, { x: 0, duration: 0.4, ease: "elastic.out(1.2, 0.3)" });
  }
  caja.classList.toggle("con-retrato", !!l.apariencia || l.quien === "EVA");
  // «Saltar ⏭» solo si a la conversación le quedan líneas.
  $("#dialogo-saltar").hidden = cola.length === 0;
  const texto = $("#dialogo-texto");
  const obj = { n: 0 };
  texto.textContent = "";
  $("#dialogo-sigue").classList.remove("visible");
  let ultimo = 0;
  escribiendo = gsap.to(obj, {
    n: l.texto.length, duration: l.texto.length / letrasPorSegundo(), ease: "none",
    onUpdate: () => {
      const n = Math.round(obj.n);
      texto.textContent = l.texto.slice(0, n);
      if (n - ultimo >= 3) { ultimo = n; sonido.blip(l.quien === "EVA" ? "eva" : "voz"); }
    },
    onComplete: () => { escribiendo = null; $("#dialogo-sigue").classList.add("visible"); },
  });
}

function avanzar() {
  if (escribiendo) { escribiendo.progress(1); return; }
  const l = cola.shift();
  if (l) { mostrarLinea(l); return; }
  modo = "libre";
  gsap.to("#dialogo", { y: 16, opacity: 0, duration: 0.15, onComplete: () => { if (modo !== "dialogo") $("#dialogo").hidden = true; } });
  controles.limpiar();
  const fn = alTerminar; alTerminar = undefined;
  fn?.();
}

// ── Elecciones ─────────────────────────────────────────────────────────────
let resolverEleccion: ((i: number) => void) | null = null;
let foco = 0;

function marcarFoco(i: number) {
  const botones = [...document.querySelectorAll<HTMLButtonElement>("#elecciones button")];
  foco = (i + botones.length) % botones.length;
  botones.forEach((b, j) => b.classList.toggle("foco", j === foco));
  botones[foco]?.scrollIntoView({ block: "nearest" });
}

function elegirOpcion(i: number) {
  if (!resolverEleccion) return;
  const r = resolverEleccion; resolverEleccion = null;
  $("#elecciones").dataset.cerrando = "1";
  sonido.efecto("elegir");
  const botones = [...document.querySelectorAll<HTMLButtonElement>("#elecciones button")];
  gsap.to(botones[i], { scale: 1.04, duration: 0.08, yoyo: true, repeat: 1 });
  gsap.to("#elecciones", { opacity: 0, y: 10, duration: 0.18, delay: 0.12, onComplete: () => { $("#elecciones").hidden = true; } });
  modo = "libre";
  controles.limpiar();
  setTimeout(() => r(i), 160);
}

addEventListener("keydown", (ev) => {
  if (modo !== "eleccion") return;
  if (ev.code === "ArrowUp" || ev.code === "KeyW") { marcarFoco(foco - 1); sonido.efecto("mover"); ev.preventDefault(); }
  if (ev.code === "ArrowDown" || ev.code === "KeyS") { marcarFoco(foco + 1); sonido.efecto("mover"); ev.preventDefault(); }
  const n = Number(ev.key);
  if (n >= 1 && n <= 4) elegirOpcion(n - 1);
});

// Un solo bucle atiende la tecla de acción según lo que esté abierto. Lo que
// recién se abre ignora la tecla un instante: así un doble toque para pasar un
// diálogo no elige ni cierra nada sin querer.
let sordoHasta = 0;
const ensordecer = () => { sordoHasta = performance.now() + 320; controles.limpiar(); };
let mantenidoDesde = 0, ultimoAvance = 0;
function bucle() {
  const ahora = performance.now();
  // Mantener A pasa los diálogos solos; elegir o cerrar una carta siempre pide un toque nuevo.
  if (modo === "dialogo" && controles.mantenida()) {
    if (!mantenidoDesde) mantenidoDesde = ahora;
    else if (ahora - mantenidoDesde > 450 && ahora - ultimoAvance > 170) { ultimoAvance = ahora; controles.limpiar(); avanzar(); }
  } else mantenidoDesde = 0;
  if (performance.now() < sordoHasta) controles.limpiar();
  else if (modo === "dialogo" && controles.accionPulsada()) avanzar();
  else if (modo === "eleccion" && controles.accionPulsada()) elegirOpcion(foco);
  else if (modo === "modal" && !document.getElementById("ajustes") && controles.accionPulsada()) cerrarModal?.();
  else if (modo === "panel" && controles.accionPulsada()) panelAccion?.();
  requestAnimationFrame(bucle);
}
requestAnimationFrame(bucle);

let cerrarModal: (() => void) | null = null;
let tieneDato = () => false;

// Código de partida: la partida en base64, para seguir en otro aparato.
const CLAVE_PARTIDA = "eva-potestas:partida";
function codigoPartida() {
  try { const j = localStorage.getItem(CLAVE_PARTIDA); return j ? "EVA1-" + btoa(unescape(encodeURIComponent(j))) : null; } catch { return null; }
}
function cargarCodigo(codigo: string) {
  try {
    const j = decodeURIComponent(escape(atob(codigo.trim().replace(/^EVA1-/, ""))));
    const p = JSON.parse(j);
    if (!p || p.version !== 1 || !p.paso || !p.nombre || !p.jornada) return false;
    localStorage.setItem(CLAVE_PARTIDA, JSON.stringify(p));
    return true;
  } catch { return false; }
}

// ── La mesa de mediación: paneles que se manipulan (calendario, monto) ─────
export type Juicio = { hijo: number; otro: number; consejo: string };
export type Persona = { nombre: string; apariencia: Apariencia };
export type Lado = "yo" | "otro";
export type Carta = { id: string; titulo: string; detalle: string; icono: string };
let panelAccion: (() => void) | null = null;
let panelTecla: ((code: string) => void) | null = null;
addEventListener("keydown", (ev) => {
  if (ev.code === "Escape" && modo === "modal") { cerrarModal?.(); return; }
  if (modo !== "panel" || !panelTecla) return;
  if (/^(Arrow|Key[WASD])/.test(ev.code)) { panelTecla(ev.code); ev.preventDefault(); }
});

/** Abre la mesa: título, cuerpo propio y dos medidores (el hijo y la otra persona). */
function abrirMesa(titulo: string, hijo: Persona, otro: Persona) {
  const m = $("#mesa");
  $("#mesa-titulo").textContent = titulo;
  $("#mesa-cuerpo").innerHTML = "";
  $<HTMLImageElement>("#medidor-hijo img").src = retrato(hijo.apariencia, 2);
  $("#medidor-hijo b").textContent = hijo.nombre;
  $<HTMLImageElement>("#medidor-otro img").src = retrato(otro.apariencia, 2);
  $("#medidor-otro b").textContent = otro.nombre;
  m.hidden = false;
  modo = "panel";
  ensordecer();
  gsap.fromTo(".mesa-hoja", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.4)" });
  return $("#mesa-cuerpo");
}
let ultimoConsejo = "";
function pintarJuicio(j: Juicio) {
  for (const [id, v] of [["hijo", j.hijo], ["otro", j.otro]] as const) {
    const barra = $(`#medidor-${id} i`);
    gsap.to(barra, { width: `${Math.round(Math.max(0.04, Math.min(1, v)) * 100)}%`, duration: 0.3 });
    barra.dataset.n = v < 0.35 ? "mal" : v < 0.7 ? "medio" : "bien";
    $(`#medidor-${id} .cara`).textContent = v < 0.35 ? "☹" : v < 0.7 ? "😐" : "☺";
  }
  if (j.consejo !== ultimoConsejo) {
    ultimoConsejo = j.consejo;
    $("#mesa-consejo").textContent = j.consejo;
    gsap.fromTo("#mesa-consejo", { opacity: 0.3 }, { opacity: 1, duration: 0.25 });
  }
}
function cerrarMesa<T>(r: (v: T) => void, v: T) {
  panelAccion = null; panelTecla = null;
  sonido.efecto("elegir");
  gsap.to(".mesa-hoja", { y: 30, opacity: 0, duration: 0.2, onComplete: () => { $("#mesa").hidden = true; modo = "libre"; controles.limpiar(); r(v); } });
}

// ── Dinero ─────────────────────────────────────────────────────────────────
let dineroMostrado = 0;
function pintarDinero(n: number, animar: boolean) {
  const el = $("#hud-dinero");
  if (!animar) { dineroMostrado = n; el.textContent = "$" + n.toLocaleString("es-CL"); return; }
  const delta = n - dineroMostrado;
  const obj = { v: dineroMostrado };
  gsap.to(obj, { v: n, duration: 0.7, ease: "power2.out", onUpdate: () => { el.textContent = "$" + Math.round(obj.v).toLocaleString("es-CL"); } });
  dineroMostrado = n;
  const flot = document.createElement("span");
  flot.className = `dinero-flota ${delta < 0 ? "menos" : "mas"}`;
  flot.textContent = `${delta < 0 ? "−" : "+"}$${Math.abs(delta).toLocaleString("es-CL")}`;
  $(".hud-dinero").append(flot);
  gsap.fromTo(flot, { y: 0, opacity: 1 }, { y: 26, opacity: 0, duration: 1.4, ease: "power1.out", onComplete: () => flot.remove() });
  sonido.efecto(delta < 0 ? "pagar" : "cobrar");
  if (delta > 0) monedas(el);
}

// ── API ────────────────────────────────────────────────────────────────────
export const ui = {
  montar() {
    $("#dialogo").addEventListener("pointerdown", (ev) => { ev.preventDefault(); if (modo === "dialogo") avanzar(); });
    // Saltar: termina la conversación de una vez (lo jurídico queda igual en el expediente).
    $("#dialogo-saltar").addEventListener("pointerdown", (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      if (modo !== "dialogo") return;
      cola = [];
      escribiendo?.kill(); escribiendo = null;
      sonido.efecto("mover");
      avanzar();
    });
    addEventListener("keydown", (ev) => { if (ev.code === "Tab" && modo === "dialogo" && cola.length) { ev.preventDefault(); $("#dialogo-saltar").dispatchEvent(new Event("pointerdown")); } });
    $("#hud-expediente").addEventListener("click", () => ui.expediente());
    $("#simbolo-eva").innerHTML = MARCA.poses.simbolo.svg;
  },
  /** Un panel propio (desafío, ajustes) toma la tecla de acción y las flechas. */
  abrirPanel(accion: () => void, tecla: (code: string) => void) {
    panelAccion = accion; panelTecla = tecla; modo = "panel"; ensordecer();
  },
  cerrarPanel() { panelAccion = null; panelTecla = null; modo = "libre"; controles.limpiar(); },
  /** true mientras hay diálogo, elección o ventana abierta: el mundo se pausa. */
  ocupado: () => modo !== "libre",

  decir(lineas: Linea[]): Promise<void> {
    return new Promise((r) => {
      cola = [...lineas];
      alTerminar = r;
      gsap.killTweensOf("#dialogo");
      modo = "dialogo";
      ensordecer();
      const caja = $("#dialogo");
      caja.hidden = false;
      gsap.fromTo(caja, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" });
      avanzar();
    });
  },

  /** Muestra opciones grandes y espera la elección. Devuelve el índice. */
  elegir(pregunta: string | null, opciones: string[]): Promise<number> {
    return new Promise((r) => {
      const caja = $("#elecciones");
      gsap.killTweensOf(caja); // si la elección anterior aún se está cerrando, no debe esconder ésta
      delete caja.dataset.cerrando;
      caja.innerHTML = "";
      caja.classList.toggle("muchas", opciones.length > 5);
      if (pregunta) { const p = document.createElement("p"); p.className = "pregunta"; p.textContent = pregunta; caja.append(p); }
      opciones.forEach((t, i) => {
        const b = document.createElement("button");
        b.innerHTML = `<span class="num">${i + 1}</span><span></span>`;
        (b.lastChild as HTMLElement).textContent = t;
        b.addEventListener("pointerenter", () => marcarFoco(i));
        b.addEventListener("click", () => elegirOpcion(i));
        caja.append(b);
      });
      caja.hidden = false;
      resolverEleccion = r;
      modo = "eleccion";
      ensordecer();
      marcarFoco(0);
      gsap.fromTo(caja.children, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.2, stagger: 0.05, ease: "power2.out" });
      gsap.set(caja, { opacity: 1, y: 0 });
    });
  },

  /**
   * El calendario de dos semanas: cada día, con quién está el hijo o la hija.
   * Se toca un día para cambiarlo. Devuelve el reparto cuando se propone.
   */
  calendario(o: { titulo: string; yo: Persona; otro: Persona; hijo: Persona; inicial: Lado[]; evaluar: (d: Lado[]) => Juicio; minimo?: (d: Lado[]) => string | null; sugerencia?: Lado[] }): Promise<Lado[]> {
    return new Promise((r) => {
      const cuerpo = abrirMesa(o.titulo, o.hijo, o.otro);
      const dias = [...o.inicial];
      const caras = { yo: retrato(o.yo.apariencia, 2), otro: retrato(o.otro.apariencia, 2) };
      const rejilla = document.createElement("div");
      rejilla.className = "calendario";
      const LETRAS = ["L", "M", "M", "J", "V", "S", "D"];
      const leyenda = document.createElement("p");
      leyenda.className = "calendario-leyenda";
      leyenda.innerHTML = `<span class="yo"></span> <span class="otro"></span>`;
      (leyenda.children[0] as HTMLElement).textContent = "Contigo";
      (leyenda.children[1] as HTMLElement).textContent = `Con ${o.otro.nombre}`;
      const botones: HTMLButtonElement[] = [];
      let foco = 0;
      const pintar = () => {
        botones.forEach((b, i) => {
          b.dataset.lado = dias[i];
          (b.querySelector("img") as HTMLImageElement).src = caras[dias[i]];
          b.classList.toggle("foco", i === foco);
        });
        pintarJuicio(o.evaluar(dias));
      };
      const cambiar = (i: number) => {
        dias[i] = dias[i] === "yo" ? "otro" : "yo";
        sonido.efecto("mover");
        gsap.fromTo(botones[i], { scale: 0.85 }, { scale: 1, duration: 0.2, ease: "back.out(3)" });
        pintar();
      };
      for (let i = 0; i < 14; i++) {
        if (i % 7 === 0) { const sem = document.createElement("span"); sem.className = "semana"; sem.textContent = i ? "Semana 2" : "Semana 1"; rejilla.append(sem); }
        const b = document.createElement("button");
        b.innerHTML = `<small>${LETRAS[i % 7]}</small><img alt="" />`;
        b.classList.toggle("finde", i % 7 >= 5);
        b.addEventListener("click", () => { foco = i; cambiar(i); });
        botones.push(b);
        rejilla.append(b);
      }
      const ok = $<HTMLButtonElement>("#mesa-ok");
      ok.textContent = "Proponer este calendario";
      cuerpo.append(leyenda, rejilla);
      if (o.sugerencia) {
        const sug = document.createElement("button");
        sug.className = "boton calendario-sugerir";
        sug.textContent = "💡 Pedir una sugerencia a la mediadora";
        sug.addEventListener("click", () => { o.sugerencia!.forEach((v, i) => { dias[i] = v; }); sonido.efecto("objetivo"); gsap.fromTo(botones, { scale: 0.8 }, { scale: 1, duration: 0.25, stagger: 0.02, ease: "back.out(3)" }); pintar(); });
        cuerpo.append(sug);
      }
      const proponer = () => {
        const falta = o.minimo?.(dias);
        if (falta) { $("#mesa-consejo").textContent = falta; ultimoConsejo = falta; gsap.fromTo(".mesa-hoja", { x: -6 }, { x: 0, duration: 0.3, ease: "elastic.out(1, 0.3)" }); return; }
        cerrarMesa(r, dias);
      };
      ok.onclick = proponer;
      panelAccion = () => (foco === 14 ? proponer() : cambiar(foco));
      panelTecla = (code) => {
        const d = code === "ArrowRight" || code === "KeyD" ? 1 : code === "ArrowLeft" || code === "KeyA" ? -1 : code === "ArrowDown" || code === "KeyS" ? 7 : -7;
        foco = Math.max(0, Math.min(14, foco + d));
        ok.classList.toggle("foco", foco === 14);
        sonido.efecto("mover");
        pintar();
      };
      ok.classList.remove("foco");
      pintar();
    });
  },

  /** Un monto que se ajusta con una barra (la pensión): marcas de la ley y lo que cubre. */
  monto(o: { titulo: string; hijo: Persona; otro: Persona; min: number; max: number; paso: number; inicial: number; marcas: { valor: number; texto: string }[]; gastos: { que: string; cuesta: number }[]; quien: string; evaluar: (v: number) => Juicio }): Promise<number> {
    return new Promise((r) => {
      const cuerpo = abrirMesa(o.titulo, o.hijo, o.otro);
      let v = o.inicial;
      const cifra = document.createElement("p"); cifra.className = "monto-cifra";
      const quien = document.createElement("p"); quien.className = "monto-quien"; quien.textContent = o.quien;
      const pista = document.createElement("div"); pista.className = "monto-pista";
      const barra = document.createElement("input");
      barra.type = "range"; barra.min = String(o.min); barra.max = String(o.max); barra.step = String(o.paso); barra.value = String(v);
      pista.append(barra);
      for (const mk of o.marcas) {
        const t = document.createElement("span"); t.className = "monto-marca";
        t.style.left = `${((mk.valor - o.min) / (o.max - o.min)) * 100}%`;
        t.textContent = mk.texto;
        pista.append(t);
      }
      const lista = document.createElement("ul"); lista.className = "monto-gastos";
      const filas = o.gastos.map((g) => { const li = document.createElement("li"); li.innerHTML = `<span></span><i></i>`; (li.firstChild as HTMLElement).textContent = g.que; lista.append(li); return li; });
      const pintar = () => {
        cifra.textContent = "$" + v.toLocaleString("es-CL") + " al mes";
        let resto = v;
        o.gastos.forEach((g, i) => { const k = Math.max(0, Math.min(1, resto / g.cuesta)); resto -= g.cuesta; (filas[i].querySelector("i") as HTMLElement).style.width = `${Math.round(k * 100)}%`; filas[i].classList.toggle("cubierto", k >= 1); });
        pintarJuicio(o.evaluar(v));
      };
      barra.addEventListener("input", () => { v = Number(barra.value); pintar(); });
      cuerpo.append(quien, cifra, pista, lista);
      const ok = $<HTMLButtonElement>("#mesa-ok");
      ok.textContent = "Proponer este monto";
      ok.classList.remove("foco");
      ok.onclick = () => cerrarMesa(r, v);
      panelAccion = () => cerrarMesa(r, v);
      panelTecla = (code) => {
        const d = code === "ArrowRight" || code === "KeyD" || code === "ArrowUp" || code === "KeyW" ? 1 : -1;
        v = Math.max(o.min, Math.min(o.max, v + d * o.paso));
        barra.value = String(v);
        sonido.efecto("mover");
        pintar();
      };
      pintar();
    });
  },

  /** Un pensamiento que flota sobre tu personaje unos segundos (no bloquea). */
  pensar(texto: string, x: number, y: number) {
    if (modo !== "libre") return;
    const el = document.createElement("div");
    el.className = "pensamiento";
    el.textContent = texto;
    el.style.left = `${Math.max(90, Math.min(innerWidth - 90, x))}px`;
    el.style.top = `${Math.max(70, y)}px`;
    document.getElementById("ui")!.append(el);
    sonido.blip("voz");
    gsap.fromTo(el, { opacity: 0, y: 8, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(2)" });
    gsap.to(el, { opacity: 0, y: -10, duration: 0.5, delay: 3.6, onComplete: () => el.remove() });
  },

  /** Ajustes: velocidad, letra, contraste, movimiento, modo historia, correr. */
  ajustes(): Promise<void> {
    return new Promise((r) => {
      if (modo !== "libre") { r(); return; }
      const raiz = document.createElement("div");
      raiz.id = "ajustes";
      raiz.innerHTML = `<div class="ajustes-hoja" role="dialog" aria-label="Ajustes">
        <header><h2>Ajustes</h2><button class="cerrar" aria-label="Cerrar">✕</button></header>
        <div class="ajuste"><span>Velocidad del texto</span><div class="segmentos" data-k="texto">
          <button data-v="normal">Normal</button><button data-v="rapida">Rápida</button><button data-v="instantanea">Al tiro</button></div></div>
        <label class="ajuste interruptor"><span>Letra grande</span><input type="checkbox" data-k="letraGrande" /></label>
        <label class="ajuste interruptor"><span>Alto contraste</span><input type="checkbox" data-k="contraste" /></label>
        <label class="ajuste interruptor"><span>Menos movimiento</span><input type="checkbox" data-k="menosMovimiento" /></label>
        <label class="ajuste interruptor"><span>Modo historia <small>minijuegos más amables, sin reloj</small></span><input type="checkbox" data-k="modoHistoria" /></label>
        <div class="ajuste"><span>Seguir en otro aparato <small>Copia el código de tu partida y pégalo allá.</small></span><div class="segmentos"><button data-p="copiar">Copiar código</button><button data-p="cargar">Pegar código</button></div></div>
        <label class="ajuste interruptor"><span>Hallazgos en tarjeta completa <small>pausa el juego para leer con calma; si no, una medallita que no frena</small></span><input type="checkbox" data-k="hallazgoCompleto" /></label>
        <label class="ajuste interruptor"><span>Correr siempre <small>o mantén Mayús / empuja el joystick al borde</small></span><input type="checkbox" data-k="correrSiempre" /></label>
      </div>`;
      document.getElementById("ui")!.append(raiz);
      const pintar = () => {
        raiz.querySelectorAll<HTMLButtonElement>("[data-k=texto] button").forEach((b) => b.classList.toggle("activo", b.dataset.v === ajustes.texto));
        raiz.querySelectorAll<HTMLInputElement>("input[data-k]").forEach((i) => { i.checked = !!ajustes[i.dataset.k as "contraste"]; });
      };
      raiz.querySelectorAll<HTMLButtonElement>("[data-k=texto] button").forEach((b) => b.addEventListener("click", () => { ajustes.texto = b.dataset.v as typeof ajustes.texto; guardarAjustes(); pintar(); sonido.efecto("elegir"); }));
      raiz.querySelectorAll<HTMLInputElement>("input[data-k]").forEach((i) => i.addEventListener("change", () => { (ajustes as Record<string, unknown>)[i.dataset.k!] = i.checked; guardarAjustes(); sonido.efecto("elegir"); }));
      raiz.querySelector<HTMLButtonElement>("[data-p=copiar]")!.addEventListener("click", async (ev) => {
        const b = ev.currentTarget as HTMLButtonElement;
        const codigo = codigoPartida();
        if (!codigo) { b.textContent = "No hay partida"; return; }
        try { await navigator.clipboard.writeText(codigo); b.textContent = "¡Copiado!"; } catch { prompt("Copia este código:", codigo); }
        sonido.efecto("cobrar");
      });
      raiz.querySelector<HTMLButtonElement>("[data-p=cargar]")!.addEventListener("click", () => {
        const codigo = prompt("Pega aquí el código de tu partida:");
        if (!codigo) return;
        if (cargarCodigo(codigo)) location.reload();
        else alert("Ese código no sirve. Revisa que esté completo.");
      });
      pintar();
      modo = "modal";
      ensordecer();
      gsap.fromTo(".ajustes-hoja", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" });
      cerrarModal = () => {
        cerrarModal = null;
        gsap.to(".ajustes-hoja", { y: 30, opacity: 0, duration: 0.2, onComplete: () => { raiz.remove(); modo = "libre"; controles.limpiar(); r(); } });
      };
      raiz.querySelector<HTMLButtonElement>(".cerrar")!.onclick = () => cerrarModal?.();
      raiz.addEventListener("pointerdown", (ev) => { if (ev.target === raiz) cerrarModal?.(); });
    });
  },

  /**
   * Presentar una prueba: la jueza pregunta y el jugador elige una carta de su
   * expediente. Devuelve el id de la carta elegida.
   */
  presentar(o: { quien: string; apariencia: Apariencia; pregunta: string; cartas: Carta[] }): Promise<string> {
    return new Promise((r) => {
      const raiz = document.createElement("div");
      raiz.id = "pruebas";
      raiz.innerHTML = `<div class="pruebas-hoja" role="dialog">
        <header><img alt="" /><div><b></b><p></p></div></header>
        <p class="pruebas-ayuda">Elige una prueba de tu expediente</p>
        <div class="pruebas-cartas"></div></div>`;
      (raiz.querySelector("header img") as HTMLImageElement).src = retrato(o.apariencia, 3);
      raiz.querySelector("header b")!.textContent = o.quien;
      raiz.querySelector("header p")!.textContent = o.pregunta;
      const cont = raiz.querySelector(".pruebas-cartas")!;
      const botones = o.cartas.map((c) => {
        const b = document.createElement("button");
        b.className = "carta-prueba";
        b.innerHTML = `<span class="ico"></span><strong></strong><small></small>`;
        (b.querySelector(".ico") as HTMLElement).textContent = c.icono;
        b.querySelector("strong")!.textContent = c.titulo;
        b.querySelector("small")!.textContent = c.detalle;
        b.addEventListener("click", () => elegirCarta(c.id, b));
        cont.append(b);
        return b;
      });
      document.getElementById("ui")!.append(raiz);
      gsap.fromTo(".pruebas-hoja", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.4)" });
      gsap.from(botones, { y: 20, opacity: 0, rotation: () => Math.random() * 10 - 5, duration: 0.3, stagger: 0.05, delay: 0.1 });
      let foco = 0, listo = false;
      const marcar = () => botones.forEach((b, i) => b.classList.toggle("foco", i === foco));
      const elegirCarta = (id: string, b: HTMLElement) => {
        if (listo) return;
        listo = true;
        sonido.efecto("papel");
        ui.cerrarPanel();
        gsap.to(b, { scale: 1.12, y: -10, duration: 0.15, yoyo: true, repeat: 1 });
        gsap.to(raiz, { opacity: 0, duration: 0.25, delay: 0.3, onComplete: () => { raiz.remove(); r(id); } });
      };
      ui.abrirPanel(() => elegirCarta(o.cartas[foco].id, botones[foco]), (code) => {
        const cols = Math.max(1, Math.round(cont.clientWidth / 132));
        const d = /Right|KeyD/.test(code) ? 1 : /Left|KeyA/.test(code) ? -1 : /Down|KeyS/.test(code) ? cols : -cols;
        foco = Math.max(0, Math.min(botones.length - 1, foco + d)); marcar(); sonido.efecto("mover");
      });
      marcar();
    });
  },

  /** Un timbre que cae sobre la pantalla («PRUEBA ACEPTADA»). No bloquea más de un segundo. */
  async sello(texto: string, bien: boolean) {
    const el = document.createElement("div");
    el.className = `sello ${bien ? "bien" : "mal"}`;
    el.textContent = texto;
    document.getElementById("ui")!.append(el);
    sonido.efecto(bien ? "hallazgo" : "golpe");
    if (bien) confeti(innerWidth / 2, innerHeight * 0.45, 24);
    await gsap.fromTo(el, { scale: 2.6, opacity: 0, rotation: -18 }, { scale: 1, opacity: 1, rotation: -8, duration: 0.28, ease: "power3.in" });
    gsap.fromTo(el, { x: -4 }, { x: 0, duration: 0.25, ease: "elastic.out(1, 0.3)" });
    await espera(850);
    await gsap.to(el, { opacity: 0, scale: 0.9, duration: 0.25 });
    el.remove();
  },

  /** La balanza: cómo quedan repartidos los bienes. Espera a que el jugador siga. */
  balanza(o: { titulo: string; izq: { nombre: string; apariencia: Apariencia; monto: number }; der: { nombre: string; apariencia: Apariencia; monto: number }; nota: string }): Promise<void> {
    return new Promise((r) => {
      const raiz = document.createElement("div");
      raiz.id = "balanza";
      const plato = (p: typeof o.izq, lado: string) => `<div class="plato ${lado}"><img alt="" src="${retrato(p.apariencia, 3)}" /><b></b><span class="cifra">$0</span></div>`;
      raiz.innerHTML = `<div class="balanza-hoja"><h3></h3>
        <div class="balanza-cuerpo"><div class="viga">${plato(o.izq, "izq")}<span class="fiel">⚖</span>${plato(o.der, "der")}</div></div>
        <p class="balanza-nota"></p><button class="boton grande">Entendido</button></div>`;
      raiz.querySelector("h3")!.textContent = o.titulo;
      raiz.querySelector(".plato.izq b")!.textContent = o.izq.nombre;
      raiz.querySelector(".plato.der b")!.textContent = o.der.nombre;
      raiz.querySelector(".balanza-nota")!.textContent = o.nota;
      document.getElementById("ui")!.append(raiz);
      const cuenta = (sel: string, n: number) => { const el = raiz.querySelector(sel)!; const v = { x: 0 }; gsap.to(v, { x: n, duration: 1.1, ease: "power2.out", onUpdate: () => { el.textContent = "$" + Math.round(v.x).toLocaleString("es-CL"); } }); };
      cuenta(".plato.izq .cifra", o.izq.monto); cuenta(".plato.der .cifra", o.der.monto);
      const total = Math.max(1, o.izq.monto + o.der.monto);
      const giro = Math.max(-14, Math.min(14, ((o.der.monto - o.izq.monto) / total) * 28));
      gsap.fromTo(".viga", { rotation: 0 }, { rotation: giro, duration: 1.4, ease: "elastic.out(1, 0.4)", delay: 0.2 });
      gsap.fromTo(".balanza-hoja", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
      const cerrar = () => { ui.cerrarPanel(); sonido.efecto("elegir"); gsap.to(raiz, { opacity: 0, duration: 0.2, onComplete: () => { raiz.remove(); r(); } }); };
      raiz.querySelector("button")!.addEventListener("click", cerrar);
      ui.abrirPanel(cerrar, () => undefined);
    });
  },

  /** Notificación del teléfono: llega, se lee y se va sola. */
  async telefono(de: string, texto: string, apariencia?: Apariencia) {
    const t = $("#telefono");
    $("#telefono-de").textContent = de;
    $("#telefono-texto").textContent = texto;
    const img = $<HTMLImageElement>("#telefono-retrato");
    if (apariencia) { img.src = retrato(apariencia, 3); img.hidden = false; } else img.hidden = true;
    t.hidden = false;
    sonido.efecto("telefono");
    gsap.fromTo(t, { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.6)" });
    gsap.fromTo(t, { rotation: -2 }, { rotation: 2, duration: 0.06, repeat: 5, yoyo: true, clearProps: "rotation" });
    await espera(Math.max(2600, texto.length * 55) * pausa());
    await gsap.to(t, { y: -90, opacity: 0, duration: 0.3 });
    t.hidden = true;
  },

  objetivo(texto: string | null) {
    const el = $("#objetivo");
    if (!texto) { el.hidden = true; return; }
    const nuevo = el.hidden || $("#objetivo-texto").textContent !== texto;
    $("#objetivo-texto").textContent = texto;
    el.hidden = false;
    if (nuevo) { gsap.fromTo(el, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power2.out" }); sonido.efecto("objetivo"); }
  },

  /** Fichas nuevas en la colección: aviso que no frena. */
  avisoFichas(n: number) {
    if (n > 0) aviso("🃏", `+${n} fichas de estudio`, "Están en tu expediente (⚖ arriba). Tócalas para darlas vuelta.");
  },

  /** EVA aparece: el mundo se tiñe y ella habla desde fuera. */
  async eva(lineas: string[]) {
    document.body.classList.add("modo-eva");
    sonido.atenuar(true);
    sonido.efecto("eva");
    await espera(250);
    await ui.decir(lineas.map((texto) => ({ quien: "EVA", texto })));
    document.body.classList.remove("modo-eva");
    sonido.atenuar(false);
  },

  /**
   * Medallita de hallazgo: aparece arriba sin pausar el juego, con su frase en
   * simple; se va volando al expediente. Tocarla abre el detalle (sin pausar).
   */
  medalla(h: Hallazgo, total: number, n: number) {
    let cont = document.getElementById("medallas");
    if (!cont) { cont = document.createElement("div"); cont.id = "medallas"; $("#ui").append(cont); }
    const m = document.createElement("button");
    m.className = "medalla";
    m.innerHTML = `<span class="medalla-ico">📜</span><span class="medalla-t"><small>Hallazgo ${n} de ${total} · toca para leer</small><strong></strong><em></em></span>`;
    m.querySelector("strong")!.textContent = h.titulo;
    m.querySelector("em")!.textContent = EN_SIMPLE[h.id] ?? h.norma;
    cont.append(m);
    sonido.efecto("hallazgo");
    gsap.fromTo(m, { x: 60, opacity: 0, scale: 0.8 }, { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" });
    const r0 = m.getBoundingClientRect();
    confeti(r0.left + 24, r0.top + r0.height / 2, 14);
    let ida = false;
    const irse = () => {
      if (ida) return;
      ida = true;
      const a = m.getBoundingClientRect(), b = $("#hud-expediente").getBoundingClientRect();
      gsap.to(m, { x: b.left - a.left - a.width / 2 + b.width / 2, y: b.top - a.top, scale: 0.15, opacity: 0, duration: 0.55, ease: "power2.in", onComplete: () => {
        m.remove();
        gsap.fromTo("#hud-expediente", { scale: 1 }, { scale: 1.35, duration: 0.15, yoyo: true, repeat: 1 });
      } });
    };
    const t = setTimeout(irse, 5200);
    m.addEventListener("pointerdown", (ev) => { ev.stopPropagation(); clearTimeout(t); ui.detalleHallazgo(h); irse(); });
  },

  /** El detalle de un hallazgo en una hoja flotante: no pausa nada; se cierra con un toque. */
  detalleHallazgo(h: Hallazgo) {
    document.getElementById("hallazgo-detalle")?.remove();
    const d = document.createElement("div");
    d.id = "hallazgo-detalle";
    d.innerHTML = `<div class="detalle-carta"><div class="hallazgo-cinta">Hallazgo jurídico</div><h3></h3><p class="detalle-texto"></p><p class="detalle-norma"></p><p class="detalle-simple"></p><span class="hallazgo-sigue">Toca para cerrar</span></div>`;
    d.querySelector("h3")!.textContent = h.titulo;
    d.querySelector(".detalle-texto")!.textContent = h.texto;
    d.querySelector(".detalle-norma")!.textContent = h.norma;
    d.querySelector(".detalle-simple")!.textContent = EN_SIMPLE[h.id] ? `EVA, en simple: «${EN_SIMPLE[h.id]}»` : "";
    $("#ui").append(d);
    gsap.fromTo(d.querySelector(".detalle-carta"), { y: -20, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" });
    const cerrar = () => { removeEventListener("keydown", tecla); gsap.to(d, { opacity: 0, duration: 0.2, onComplete: () => d.remove() }); };
    const tecla = (ev: KeyboardEvent) => { if (ev.code === "Escape") cerrar(); };
    addEventListener("keydown", tecla);
    d.addEventListener("pointerdown", (ev) => { ev.stopPropagation(); cerrar(); });
  },

  /**
   * Apuesta EVA: antes de una consecuencia legal, ¿qué crees que pasa? Dos
   * opciones (en orden al azar) y un reloj corto (sin reloj en modo historia).
   * Devuelve si acertó, o null si se acabó el tiempo.
   */
  apuesta(pregunta: string, opciones: [string, string], correcta: number): Promise<boolean | null> {
    return new Promise((r) => {
      const orden = Math.random() < 0.5 ? [0, 1] : [1, 0];
      const raiz = document.createElement("div");
      raiz.id = "apuesta";
      raiz.innerHTML = `<div class="apuesta-hoja"><header><span class="apuesta-eva">${MARCA.poses.simbolo.svg}</span><b>Apuesta EVA</b><small>¿Qué crees que pasa?</small></header><p class="apuesta-q"></p><div class="apuesta-ops"></div><i class="apuesta-reloj"></i><p class="apuesta-res" aria-live="polite"></p></div>`;
      raiz.querySelector(".apuesta-q")!.textContent = pregunta;
      const ops = raiz.querySelector(".apuesta-ops")!;
      orden.forEach((k, i) => {
        const b = document.createElement("button");
        b.className = "apuesta-op";
        b.dataset.i = String(k);
        b.innerHTML = `<span class="num">${i + 1}</span><span></span>`;
        b.lastElementChild!.textContent = opciones[k];
        ops.append(b);
      });
      $("#ui").append(raiz);
      modo = "modal";
      cerrarModal = null;
      ensordecer();
      sonido.efecto("eva");
      gsap.fromTo(".apuesta-hoja", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "back.out(1.6)" });
      const reloj = raiz.querySelector<HTMLElement>(".apuesta-reloj")!;
      let tw: gsap.core.Tween | null = null;
      let hecho = false;
      const resolver = (k: number | null) => {
        if (hecho) return;
        hecho = true;
        raiz.dataset.cerrando = "1";
        tw?.kill();
        removeEventListener("keydown", teclas);
        const bien = k === correcta;
        raiz.querySelectorAll<HTMLButtonElement>(".apuesta-op").forEach((b) => {
          const i = Number(b.dataset.i);
          if (i === correcta) b.classList.add("bien");
          else if (i === k) b.classList.add("mal");
        });
        const res = raiz.querySelector(".apuesta-res")!;
        res.textContent = k === null ? "Se acabó el tiempo. Mira lo que pasa…" : bien ? "¡Bien visto! +50 Saber" : "Casi. Mira lo que pasa…";
        sonido.efecto(bien ? "cobrar" : "golpe");
        if (bien) { ganarSaber(50); const rr = raiz.querySelector(".bien")!.getBoundingClientRect(); confeti(rr.left + rr.width / 2, rr.top, 22); }
        else if (!ajustes.menosMovimiento) gsap.fromTo(".apuesta-hoja", { x: -8 }, { x: 0, duration: 0.45, ease: "elastic.out(1.2, 0.3)" });
        setTimeout(() => gsap.to(raiz, { opacity: 0, duration: 0.2, onComplete: () => { raiz.remove(); modo = "libre"; controles.limpiar(); r(k === null ? null : bien); } }), 1250 * pausa());
      };
      raiz.querySelectorAll<HTMLButtonElement>(".apuesta-op").forEach((b) => b.addEventListener("click", () => resolver(Number(b.dataset.i))));
      const teclas = (ev: KeyboardEvent) => { const n = Number(ev.key); if (n === 1 || n === 2) resolver(orden[n - 1]); };
      addEventListener("keydown", teclas);
      if (ajustes.modoHistoria) reloj.hidden = true;
      else tw = gsap.fromTo(reloj, { scaleX: 1 }, { scaleX: 0, duration: 9, ease: "none", onComplete: () => resolver(null) });
    });
  },

  /** La carta de un hallazgo jurídico: se gira y queda en el expediente. */
  hallazgo(h: Hallazgo, total: number, n: number, nota?: string): Promise<void> {
    return new Promise((r) => {
      const m = $("#hallazgo");
      $(".hallazgo-sigue").textContent = nota ?? "Toca para guardarlo en tu expediente";
      $("#hallazgo-titulo").textContent = h.titulo;
      $("#hallazgo-texto").textContent = h.texto;
      $("#hallazgo-norma").textContent = h.norma;
      $("#hallazgo-simple").textContent = EN_SIMPLE[h.id] ? `EVA, en simple: «${EN_SIMPLE[h.id]}»` : "";
      $("#hallazgo-cuenta").textContent = `Hallazgo ${n} de ${total}`;
      // «¿Lo pillaste?»: una afirmación opcional sobre lo que se acaba de leer (+30 de Saber si aciertas).
      const opciones = PREGUNTAS.filter((p) => p.hallazgo === h.id);
      const q = opciones[Math.floor(Math.random() * opciones.length)];
      const caja = $("#hallazgo-pillaste");
      caja.hidden = !q;
      caja.dataset.estado = "";
      let quitarTeclas = () => {};
      if (q) {
        $("#pillaste-texto").textContent = q.texto;
        $("#pillaste-resultado").textContent = "";
        const responder = (v: boolean) => {
          if (caja.dataset.estado) return;
          const bien = v === q.verdad;
          caja.dataset.estado = bien ? "bien" : "mal";
          $("#pillaste-resultado").textContent = bien ? "¡Bien! +30 Saber" : `No: es ${q.verdad ? "verdadero" : "falso"}.`;
          sonido.efecto(bien ? "cobrar" : "golpe");
          if (bien) { ganarSaber(30); const r = caja.getBoundingClientRect(); confeti(r.left + r.width / 2, r.top, 16); }
          ensordecer();
        };
        caja.querySelectorAll<HTMLButtonElement>("button").forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); responder(b.dataset.v === "1"); }; });
        const teclas = (ev: KeyboardEvent) => { if (ev.key === "1") responder(true); if (ev.key === "2") responder(false); };
        addEventListener("keydown", teclas);
        quitarTeclas = () => removeEventListener("keydown", teclas);
      }
      m.hidden = false;
      modo = "modal";
      ensordecer();
      sonido.efecto("hallazgo");
      dispatchEvent(new CustomEvent("eva-hallazgo", { detail: true }));
      const carta = $(".hallazgo-carta");
      gsap.fromTo(m, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(carta, { rotationY: 90, scale: 0.7 }, { rotationY: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)" });
      setTimeout(() => confeti(innerWidth / 2, innerHeight * 0.38), 250);
      cerrarModal = () => {
        cerrarModal = null;
        quitarTeclas();
        modo = "libre";
        controles.limpiar();
        gsap.to(carta, { y: -40, scale: 0.4, opacity: 0, duration: 0.35, ease: "power2.in" });
        gsap.to(m, { opacity: 0, duration: 0.35, onComplete: () => { m.hidden = true; gsap.set(carta, { clearProps: "all" }); r(); } });
        gsap.fromTo("#hud-expediente", { scale: 1 }, { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, delay: 0.3 });
        dispatchEvent(new CustomEvent("eva-hallazgo", { detail: false }));
      };
      m.onclick = () => { if (performance.now() >= sordoHasta) cerrarModal?.(); };
    });
  },

  /** Cartel de salto de tiempo («Seis meses después»). */
  async tiempo(texto: string, sub?: string, cambio?: () => void) {
    const c = $("#tiempo");
    $("#tiempo-texto").textContent = texto;
    $("#tiempo-sub").textContent = sub ?? "";
    // Dato EVA: algo que ya aprendiste, para que no se olvide (solo de hallazgos descubiertos).
    const vistos = estado?.hallazgos ?? [];
    const datos = PREGUNTAS.filter((p) => p.verdad && vistos.includes(p.hallazgo));
    const dato = $("#tiempo-dato");
    tieneDato = () => !dato.hidden;
    if (datos.length && Math.random() < 0.75) {
      const d = datos[Math.floor(Math.random() * datos.length)];
      const pre = ["Dato EVA", "Para el expediente", "EVA recuerda", "Lo que ya sabes"][Math.floor(Math.random() * 4)];
      dato.textContent = `${pre} · ${d.texto}`;
      dato.hidden = false;
    } else dato.hidden = true;
    c.hidden = false;
    modo = "modal";
    controles.limpiar();
    // Un toque (o A) salta el cartel.
    let saltar = () => {};
    const salto = new Promise<void>((r) => { saltar = r; });
    cerrarModal = () => saltar();
    c.onclick = () => saltar();
    await gsap.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    cambio?.();
    sonido.efecto("tiempo");
    await Promise.race([gsap.fromTo("#tiempo-texto", { letterSpacing: "0.3em", opacity: 0 }, { letterSpacing: "0.06em", opacity: 1, duration: 0.6, ease: "power2.out" }).then(() => espera((tieneDato() ? 1700 : 1100) * pausa())), salto]);
    gsap.set("#tiempo-texto", { letterSpacing: "0.06em", opacity: 1 });
    cerrarModal = null;
    c.onclick = null;
    await gsap.to(c, { opacity: 0, duration: 0.35 * pausa() });
    c.hidden = true;
    modo = "libre";
    controles.limpiar();
  },

  indicar(etiqueta: string | null) {
    const el = $("#indicador");
    document.body.classList.toggle("hay-accion", !!etiqueta);
    if (!etiqueta) { if (!el.hidden) el.hidden = true; return; }
    if (el.hidden || el.dataset.e !== etiqueta) {
      el.dataset.e = etiqueta;
      $("#indicador-texto").textContent = etiqueta;
      el.hidden = false;
      gsap.fromTo(el, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: "back.out(2)" });
    }
  },

  hud(d: { fecha?: string; hora?: string; dinero?: number; animar?: boolean }) {
    if (d.fecha) $("#hud-fecha").textContent = d.fecha;
    if (d.hora) $("#hud-hora").textContent = d.hora;
    if (d.dinero !== undefined) pintarDinero(d.dinero, !!d.animar);
    $("#hud").hidden = false;
  },

  /** Ayuda de controles: sólo la primera vez, se va al moverse. */
  ayuda(tactil: boolean) {
    const el = $("#ayuda");
    el.innerHTML = tactil
      ? "<b>Arrastra</b> el pulgar para caminar (al borde, corres) · <b>A</b> para hablar y usar (mantén para pasar rápido)"
      : "<b>WASD</b> o <b>flechas</b> para caminar · <b>Mayús</b> para correr · <b>E</b> o <b>Espacio</b> para hablar y usar (mantén para pasar rápido)";
    el.hidden = false;
    gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.6 });
    const quitar = () => gsap.to(el, { opacity: 0, duration: 0.4, onComplete: () => { el.hidden = true; } });
    setTimeout(quitar, 14000);
    return quitar;
  },

  /** Expediente: los papeles que guardaste y lo que descubriste. */
  expediente() {
    const panel = $("#expediente");
    const d = estado;
    if (!d || modo !== "libre") return;
    const lista = $("#expediente-lista");
    lista.innerHTML = "";
    d.vistoExp = d.hallazgos.length + (d.logros ?? []).length;
    pintarNuevo();
    const h2 = (t: string) => { const e = document.createElement("h3"); e.textContent = t; lista.append(e); };
    const nv = nivel();
    const cabeza = document.createElement("div");
    cabeza.className = "exp-nivel";
    cabeza.innerHTML = `<div class="exp-nivel-n"></div><div class="exp-nivel-info"><strong></strong><span class="barra"><i></i></span><small></small></div>`;
    (cabeza.querySelector(".exp-nivel-n") as HTMLElement).textContent = String(nv.n);
    cabeza.querySelector("strong")!.textContent = nv.titulo;
    (cabeza.querySelector(".barra i") as HTMLElement).style.width = `${Math.round(nv.avance * 100)}%`;
    cabeza.querySelector("small")!.textContent = nv.hasta > nv.desde ? `${d.saber ?? 0} Saber · siguiente nivel en ${nv.hasta}` : `${d.saber ?? 0} Saber · nivel máximo`;
    lista.append(cabeza);
    if (d.hallazgos.length) {
      const b = document.createElement("button");
      b.className = "boton grande exp-desafio";
      b.textContent = "⚡ Desafío de repaso";
      b.onclick = () => {
        cerrarModal = null;
        panel.hidden = true; modo = "libre"; controles.limpiar();
        void import("./desafio").then(({ desafio }) => desafio());
      };
      lista.append(b);
    }
    h2(`Hallazgos · ${d.hallazgos.length} de ${HALLAZGOS.length}`);
    const orden = [...HALLAZGOS].sort((a, b) => Number(d.hallazgos.includes(b.id)) - Number(d.hallazgos.includes(a.id)));
    for (const h of orden) {
      const el = document.createElement("div");
      const visto = d.hallazgos.includes(h.id);
      el.className = `ficha ${visto ? "" : "bloqueada"}`;
      el.innerHTML = `<strong></strong><p></p><small></small>`;
      el.querySelector("strong")!.textContent = visto ? h.titulo : "???";
      el.querySelector("p")!.textContent = visto ? h.texto : `Jornada ${h.modulo}.`;
      el.querySelector("small")!.textContent = visto ? h.norma : "";
      lista.append(el);
    }
    const totalFichas = BANCOS.reduce((s, b) => s + b.fichas.length, 0);
    h2(`Fichas de estudio · ${d.fichas.length} de ${totalFichas}`);
    for (const b of BANCOS) {
      const mias = b.fichas.filter((f) => d.fichas.includes(f.id));
      if (!mias.length) continue;
      const m = MODULOS.find((x) => x.n === b.modulo);
      const grupo = document.createElement("details");
      grupo.className = "fichas-grupo";
      grupo.style.setProperty("--color", m?.color ?? "#2f5fa8");
      const sum = document.createElement("summary");
      sum.textContent = `${b.modulo} · ${m?.titulo ?? ""} (${mias.length}/${b.fichas.length})`;
      grupo.append(sum);
      const rej = document.createElement("div");
      rej.className = "fichas";
      for (const f of mias) {
        const c = document.createElement("button");
        c.className = "ficha-estudio";
        c.innerHTML = `<span class="cara frente"><strong></strong><small></small></span><span class="cara dorso"><span></span><small></small></span>`;
        c.querySelector(".frente strong")!.textContent = f.frente;
        c.querySelector(".frente small")!.textContent = f.etiqueta ?? "Toca para ver";
        c.querySelector(".dorso span")!.textContent = f.dorso;
        c.querySelector(".dorso small")!.textContent = f.norma ?? "";
        c.addEventListener("click", () => { c.classList.toggle("vuelta"); sonido.efecto("papel"); });
        rej.append(c);
      }
      grupo.append(rej);
      lista.append(grupo);
    }
    if (!d.fichas.length) { const p = document.createElement("p"); p.className = "vacio"; p.textContent = "Las fichas se ganan resolviendo la Mesa, el terreno y el jefe de cada jornada."; lista.append(p); }
    const logros = d.logros ?? [];
    h2(`Logros · ${logros.length} de ${LOGROS.length}`);
    const rejilla = document.createElement("div");
    rejilla.className = "logros";
    for (const l of LOGROS) {
      const el = document.createElement("div");
      const tiene = logros.includes(l.id);
      el.className = `logro ${tiene ? "" : "bloqueado"}`;
      el.innerHTML = `<span></span><strong></strong><small></small>`;
      (el.firstChild as HTMLElement).textContent = tiene ? l.icono : "🔒";
      el.querySelector("strong")!.textContent = tiene ? l.titulo : "???";
      el.querySelector("small")!.textContent = tiene ? l.texto : "";
      rejilla.append(el);
    }
    lista.append(rejilla);
    if (d.papeles.length) h2(`Cajón de papeles · ${d.papeles.length}`);
    for (const p of d.papeles) {
      const el = document.createElement("div");
      el.className = "ficha papel";
      el.innerHTML = `<strong></strong><p></p>`;
      el.querySelector("strong")!.textContent = p.titulo;
      el.querySelector("p")!.textContent = p.detalle;
      lista.append(el);
    }
    panel.hidden = false;
    modo = "modal";
    ensordecer();
    sonido.efecto("papel");
    gsap.fromTo(".expediente-hoja", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" });
    cerrarModal = () => {
      cerrarModal = null;
      gsap.to(".expediente-hoja", { y: 30, opacity: 0, duration: 0.2, onComplete: () => { panel.hidden = true; modo = "libre"; controles.limpiar(); } });
    };
    $("#expediente-cerrar").onclick = () => cerrarModal?.();
  },
};
