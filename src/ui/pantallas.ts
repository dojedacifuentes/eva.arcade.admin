// Pantallas fuera del mundo: título, jornadas, créditos, creación de personaje
// y el final. Son cortas a propósito: el juego se juega en la ciudad.
import gsap from "gsap";
import { figura, PIELES, PELOS, type Apariencia, type Peinado } from "../game/art/characters";
import { estado, type Identidad, type Sexo } from "../game/estado";
import { MARCA } from "../marca-eva";
import { sonido } from "./sonido";
import { MODULOS } from "../content/modulos";
import { HALLAZGOS } from "../content/hallazgos";
import { LOGROS } from "../content/logros";
import { BANCOS } from "../content/banco";
import { nivel } from "../juego/progreso";
import { epilogo } from "../jornadas/consecuencias";

const capa = () => document.getElementById("pantalla")!;

function mostrar(html: string) {
  const c = capa();
  c.innerHTML = html;
  c.hidden = false;
  return c;
}
async function ocultar() {
  const c = capa();
  await gsap.to(c, { opacity: 0, duration: 0.4 });
  c.hidden = true;
  c.innerHTML = "";
  gsap.set(c, { opacity: 1 });
}

export type Opcion = "nueva" | "continuar" | "jornadas" | "ajustes" | "creditos" | "urgencia";
/** Título. Devuelve qué eligió el jugador. */
export function titulo(hayPartida: boolean): Promise<Opcion> {
  const c = mostrar(`
    <div class="titulo">
      <div class="titulo-marca"><span class="simbolo">${MARCA.poses.simbolo.svg}</span><span>EVA ARCADE</span></div>
      <h1 class="titulo-potestas" aria-label="Potestas"><span>P</span><span>O</span><span>T</span><span>E</span><span>S</span><span>T</span><span>A</span><span>S</span></h1>
      <p class="titulo-lema">El poder del Estado tiene límites. Encuéntralos.</p>
      <div class="titulo-botones">
        ${hayPartida ? `<button class="boton grande" data-r="continuar">Continuar</button>` : ""}
        <button class="boton ${hayPartida ? "" : "grande"}" data-r="nueva">${hayPartida ? "Nueva partida" : "Comenzar"}</button>
        <div class="titulo-fila"><button class="boton" data-r="jornadas">Jornadas</button><button class="boton" data-r="ajustes" aria-label="Ajustes">⚙ Ajustes</button></div>
        <button class="boton titulo-urgencia" data-r="urgencia">⚡ Turno de urgencia</button>
      </div>
      <p class="titulo-pie">Derecho Administrativo y Público chileno · Un juego de EVA · <button class="enlace" data-r="creditos">Créditos y fuentes</button></p>
    </div>`);
  gsap.from(c.querySelectorAll(".titulo > *"), { opacity: 0, y: 14, duration: 0.6, stagger: 0.12, ease: "power2.out" });
  gsap.from(c.querySelectorAll(".titulo-potestas span"), { y: -40, opacity: 0, rotation: () => gsap.utils.random(-25, 25), duration: 0.7, stagger: 0.06, ease: "bounce.out", delay: 0.2 });
  return new Promise((r) => {
    const elegir = (v: Opcion) => {
      removeEventListener("keydown", tecla);
      sonido.efecto("elegir");
      ocultar().then(() => r(v));
    };
    const tecla = (ev: KeyboardEvent) => { if (ev.code === "Enter" || ev.code === "Space") elegir(hayPartida ? "continuar" : "nueva"); };
    addEventListener("keydown", tecla);
    c.querySelectorAll<HTMLButtonElement>("button[data-r]").forEach((b) => b.addEventListener("click", () => elegir(b.dataset.r as Opcion)));
  });
}

/** Créditos y fuentes: quién hizo qué, de dónde sale el Derecho y qué no es este juego. */
export function creditos(): Promise<void> {
  const c = mostrar(`
    <div class="capitulos creditos">
      <h2>Créditos y fuentes</h2>
      <div class="creditos-hoja">
        <h3>Un juego de EVA</h3>
        <p>Diseño, programación y arte propio (personajes, edificios, muebles y efectos pintados en código).</p>
        <h3>El Derecho</h3>
        <p>El contenido reúne y ordena apuntes de estudio de Derecho Administrativo y Público (acto y procedimiento administrativo, potestad sancionadora, responsabilidad del Estado, nulidad de derecho público, Tribunal Constitucional y expropiación), y se contrastó con el texto vigente en la Biblioteca del Congreso Nacional (LeyChile) en octubre de 2026: Constitución Política, Ley 19.880, Ley 18.575, Ley 18.695, Ley 10.336, Ley 18.834, Ley 20.285, Ley 19.886 y Código Civil.</p>
        <p class="aviso-legal">Este juego enseña Derecho chileno con simplificaciones. No es asesoría legal: ante un caso real, consulta a un abogado o a la Corporación de Asistencia Judicial.</p>
        <h3>Arte y sonido</h3>
        <p>Baldosas de la ciudad: Kenney (Tiny Town y RPG Urban Pack, licencia CC0). Música y efectos sintetizados para el juego.</p>
        <h3>Tipografías</h3>
        <p>Atkinson Hyperlegible, Pixelify Sans y Silkscreen (SIL Open Font License).</p>
        <h3>Herramientas</h3>
        <p>Phaser, TypeScript, Vite, GSAP, Howler y Tiled.</p>
      </div>
      <button class="boton grande" data-n="0">‹ Volver</button>
    </div>`);
  gsap.from(c.querySelector(".creditos-hoja"), { opacity: 0, y: 20, duration: 0.4 });
  return new Promise((r) => {
    c.querySelector<HTMLButtonElement>("button[data-n]")!.addEventListener("click", () => { sonido.efecto("elegir"); ocultar().then(() => r()); });
  });
}

/** Elegir jornada: todas abiertas, con sus estrellas, para saltar a lo que se quiere estudiar. */
export function jornadas(): Promise<number | null> {
  const hechas = new Set(estado?.completadas ?? []);
  const estrellas = estado?.estrellas ?? {};
  const c = mostrar(`
    <div class="capitulos jornadas">
      <h2>Jornadas</h2>
      <p class="capitulos-lema">Doce jornadas, doce módulos. Empieza donde quieras.</p>
      <div class="jornadas-lista"></div>
      <button class="boton" data-n="-1">‹ Volver</button>
    </div>`);
  const lista = c.querySelector(".jornadas-lista")!;
  for (const m of MODULOS) {
    const b = document.createElement("button");
    b.className = `jornada ${hechas.has(m.n) ? "hecha" : ""}`;
    b.dataset.n = String(m.n);
    b.style.setProperty("--color", m.color);
    const banco = BANCOS.find((x) => x.modulo === m.n);
    const e = estrellas[m.n] ?? 0;
    b.innerHTML = `<span class="jornada-n"></span><span class="jornada-t"><strong></strong><small></small><em></em></span><span class="jornada-e" aria-hidden="true"></span>`;
    b.querySelector(".jornada-n")!.textContent = String(m.n);
    b.querySelector("strong")!.textContent = m.titulo;
    b.querySelector("small")!.textContent = m.lema;
    b.querySelector("em")!.textContent = `${m.normas.join(" · ")}${banco ? ` · ${banco.hallazgos.length} hallazgos · ${banco.fichas.length} fichas` : ""}`;
    b.querySelector(".jornada-e")!.textContent = hechas.has(m.n) ? "★".repeat(e) + "☆".repeat(3 - e) : "";
    lista.append(b);
  }
  gsap.from(c.querySelectorAll(".jornada"), { opacity: 0, y: 14, duration: 0.3, stagger: 0.04, ease: "power2.out" });
  return new Promise((r) => {
    c.querySelectorAll<HTMLButtonElement>("button[data-n]").forEach((b) => b.addEventListener("click", () => {
      sonido.efecto("elegir");
      const n = Number(b.dataset.n);
      ocultar().then(() => r(n > 0 ? n : null));
    }));
  });
}

const TRAJES = ["#3b3f4f", "#2b2026", "#3d4a7a", "#5c3423", "#4f86c6", "#9a4a2c", "#5fa37a", "#d46a9b"];

/** Crear personaje: una sola pantalla, todo con un toque. Eres la abogada o el abogado nuevo de la Municipalidad. */
export function creacion(): Promise<Identidad> {
  let sexo: Sexo = "mujer";
  const a: Apariencia = { piel: PIELES[2], pelo: PELOS[0], peinado: "largo", polera: TRAJES[0], pantalon: "#2b2026" };
  const muestras = (id: string, colores: string[]) => `<div class="muestras" data-k="${id}">${colores.map((col) => `<button style="--c:${col}" data-v="${col}" aria-label="${col}"></button>`).join("")}</div>`;
  const c = mostrar(`
    <div class="creacion-fondo"><div class="creacion ficha">
      <p class="ficha-membrete">I. Municipalidad de Potestas · Dirección Jurídica</p>
      <h2>Decreto de nombramiento</h2>
      <p class="ficha-nota">Nómbrase abogada o abogado de la Dirección Jurídica a quien firma abajo. Anótese y comuníquese.</p>
      <div class="creacion-cuerpo">
        <div class="vista"><img id="vista-figura" alt="Tu personaje" /><div class="vista-piso"></div></div>
        <div class="campos">
          <label class="campo">Nombre <span class="nombre-fila"><input id="c-nombre" maxlength="14" placeholder="Valentina" autocomplete="off" /><button type="button" id="c-dado" aria-label="Sorpréndeme: nombre y aspecto al azar">🎲</button></span></label>
          <div class="campo">Soy
            <div class="segmentos" data-k="sexo"><button data-v="mujer" class="activo">Abogada</button><button data-v="hombre">Abogado</button></div>
          </div>
          <div class="campo">Piel ${muestras("piel", PIELES)}</div>
          <div class="campo">Pelo
            <div class="segmentos chico" data-k="peinado">${(["corto", "largo", "mono", "rizado"] as Peinado[]).map((p) => `<button data-v="${p}" class="${p === "largo" ? "activo" : ""}">${{ corto: "Corto", largo: "Largo", mono: "Moño", rizado: "Rizado" }[p]}</button>`).join("")}</div>
            ${muestras("pelo", PELOS)}
          </div>
          <div class="campo">Traje ${muestras("polera", TRAJES)}</div>
        </div>
      </div>
      <button class="boton grande" id="c-listo">Firmar y asumir el cargo</button>
    </div></div>`);
  const pintar = () => { (c.querySelector("#vista-figura") as HTMLImageElement).src = figura(a, 8); };
  const activar = (grupo: Element, v: string) => grupo.querySelectorAll("button").forEach((b) => b.classList.toggle("activo", (b as HTMLElement).dataset.v === v));
  c.querySelectorAll(".segmentos, .muestras").forEach((grupo) => {
    const k = (grupo as HTMLElement).dataset.k!;
    if (k !== "sexo" && k !== "peinado") activar(grupo, (a as unknown as Record<string, string>)[k]);
    grupo.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
      const v = (b as HTMLElement).dataset.v!;
      sonido.efecto("mover");
      if (k === "sexo") {
        sexo = v as Sexo;
        a.peinado = sexo === "mujer" ? "largo" : "corto";
        activar(c.querySelector('[data-k="peinado"]')!, a.peinado);
      } else (a as unknown as Record<string, string>)[k] = v;
      activar(grupo, v);
      pintar();
      gsap.fromTo("#vista-figura", { y: -6 }, { y: 0, duration: 0.25, ease: "bounce.out" });
    }));
  });
  const NOMBRES = { mujer: ["Valentina", "Josefa", "Antonia", "Catalina", "Florencia", "Isidora", "Trinidad", "Amanda"], hombre: ["Martín", "Benjamín", "Vicente", "Agustín", "Matías", "Joaquín", "Cristóbal", "Lucas"] };
  const azar = <T,>(l: readonly T[]) => l[Math.floor(Math.random() * l.length)];
  c.querySelector("#c-dado")!.addEventListener("click", () => {
    (c.querySelector("#c-nombre") as HTMLInputElement).value = azar(NOMBRES[sexo]);
    a.piel = azar(PIELES); a.pelo = azar(PELOS); a.polera = azar(TRAJES);
    a.peinado = azar(sexo === "mujer" ? (["largo", "mono", "rizado", "corto"] as Peinado[]) : (["corto", "rizado", "largo"] as Peinado[]));
    for (const k of ["piel", "pelo", "polera", "peinado"] as const) activar(c.querySelector(`[data-k="${k}"]`)!, a[k]);
    sonido.efecto("elegir");
    pintar();
    gsap.fromTo("#vista-figura", { rotation: -12, scale: 0.85 }, { rotation: 0, scale: 1, duration: 0.4, ease: "back.out(3)" });
    gsap.fromTo("#c-dado", { rotation: 0 }, { rotation: 360, duration: 0.4 });
  });
  pintar();
  gsap.from(c.querySelector(".creacion"), { opacity: 0, y: 20, duration: 0.4 });
  return new Promise((r) => {
    c.querySelector("#c-listo")!.addEventListener("click", async () => {
      const nombre = ((c.querySelector("#c-nombre") as HTMLInputElement).value.trim() || (sexo === "mujer" ? "Valentina" : "Martín")).slice(0, 14);
      sonido.efecto("papel");
      await ocultar();
      r({ nombre, sexo, apariencia: { ...a } });
    });
  });
}

/** El final: lo que se aprendió en números, y qué hacer ahora. */
export function fin(): Promise<"desafio" | "titulo"> {
  const d = estado!;
  const nv = nivel();
  const estrellas = Object.values(d.estrellas ?? {}).reduce((s, n) => s + n, 0);
  const c = mostrar(`
    <div class="fin">
      <p class="fin-marca">Potestas</p>
      <h1>Fin</h1>
      <p class="fin-lema">El poder tiene límites. Ahora sabes dónde.</p>
      <p class="fin-epilogo"></p>
      <div class="fin-datos">
        <div><strong>${nv.n}</strong><span>${nv.titulo}</span></div>
        <div><strong>${d.saber ?? 0}</strong><span>Saber</span></div>
        <div><strong>${d.hallazgos.length}/${HALLAZGOS.length}</strong><span>Hallazgos</span></div>
        <div><strong>${estrellas}/36</strong><span>Estrellas</span></div>
        <div><strong>${d.fichas.length}</strong><span>Fichas</span></div>
        <div><strong>${(d.logros ?? []).length}/${LOGROS.length}</strong><span>Logros</span></div>
      </div>
      <div class="titulo-botones">
        <button class="boton grande" data-r="desafio">⚡ Desafío final (10 preguntas)</button>
        <button class="boton" data-r="titulo">Volver al título</button>
      </div>
      <p class="titulo-pie">Derecho Administrativo y Público chileno · Un juego de EVA · Revisado contra la ley vigente en octubre de 2026</p>
    </div>`);
  c.querySelector(".fin-epilogo")!.textContent = epilogo();
  gsap.from(c.querySelectorAll(".fin > *"), { opacity: 0, y: 16, duration: 0.6, stagger: 0.15, ease: "power2.out" });
  return new Promise((r) => {
    c.querySelectorAll<HTMLButtonElement>("button[data-r]").forEach((b) => b.addEventListener("click", () => { sonido.efecto("elegir"); ocultar().then(() => r(b.dataset.r as "desafio" | "titulo")); }));
  });
}
