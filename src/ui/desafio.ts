// Desafío de repaso: cinco afirmaciones sobre lo que ya descubriste, ¿verdadero
// o falso? Con reloj (salvo en modo historia), racha que multiplica el Saber y
// estrellas al final. Repaso espaciado: lo que fallaste vuelve antes; lo que
// aciertas seguido se espacia (cajas de Leitner contadas en desafíos jugados).
import gsap from "gsap";
import { PREGUNTAS, type Pregunta } from "../content/preguntas";
import { estado, guardar } from "../game/estado";
import { ajustes } from "../juego/ajustes";
import { ganarSaber, logro } from "../juego/progreso";
import { confeti } from "./efectos";
import { sonido } from "./sonido";
import { ui } from "./ui";

const TIEMPO = 12; // segundos por pregunta

/** Cuántos desafíos esperar antes de volver a mostrar una afirmación, según cuántas veces seguidas se acertó. */
const ESPERA = [0, 1, 3, 6, 12];

function elegirPreguntas(n: number, modulo?: number): Pregunta[] {
  const vistos = new Set(estado?.hallazgos ?? []);
  const pool = PREGUNTAS.filter((p) => vistos.has(p.hallazgo) && (modulo === undefined || p.modulo === modulo));
  const reloj = estado?.desafio?.jugados ?? 0;
  const rep = estado?.repaso ?? {};
  // Primero las que tocan (vencidas), las más falladas antes; después las nunca vistas; al final el resto.
  const puntaje = (p: Pregunta) => {
    const r = rep[p.id];
    if (!r) return 1000 + Math.random();
    if (r.prox <= reloj) return 2000 + r.fallos * 10 + Math.random();
    return Math.random();
  };
  const orden = [...pool].sort((a, b) => puntaje(b) - puntaje(a));
  // Sin repetir hallazgo mientras se pueda.
  const una: Pregunta[] = [], usados = new Set<string>();
  for (const p of orden) if (!usados.has(p.hallazgo)) { usados.add(p.hallazgo); una.push(p); }
  for (const p of orden) if (!una.includes(p)) una.push(p);
  return una.slice(0, n);
}

/** Anota el resultado de una afirmación en el repaso espaciado. */
function anotar(p: Pregunta, bien: boolean) {
  if (!estado) return;
  const reloj = estado.desafio?.jugados ?? 0;
  const r = ((estado.repaso ??= {})[p.id] ??= { vistos: 0, fallos: 0, prox: 0 });
  r.vistos++;
  if (bien) { const racha = Math.max(1, Math.min(ESPERA.length - 1, r.vistos - r.fallos)); r.prox = reloj + 1 + ESPERA[racha]; }
  else { r.fallos++; r.prox = reloj + 1; }
}

export const hayDesafio = () => (estado?.hallazgos.length ?? 0) > 0;

/** Juega un desafío. Devuelve los aciertos. */
export function desafio(titulo = "Desafío de repaso", cuantas = 5, modulo?: number): Promise<number> {
  const preguntas = elegirPreguntas(cuantas, modulo);
  if (!preguntas.length) return Promise.resolve(0);
  const raiz = document.createElement("div");
  raiz.id = "desafio";
  raiz.innerHTML = `
    <div class="desafio-hoja" role="dialog" aria-label="${titulo}">
      <header><h3></h3><span class="desafio-racha" aria-live="polite"></span></header>
      <div class="desafio-puntos"></div>
      <div class="desafio-reloj"><i></i></div>
      <p class="desafio-texto" aria-live="polite"></p>
      <div class="desafio-botones">
        <button class="vf v" data-v="1"><b>Verdadero</b><small>← o 1</small></button>
        <button class="vf f" data-v="0"><b>Falso</b><small>→ o 2</small></button>
      </div>
      <p class="desafio-porque" hidden></p>
    </div>`;
  raiz.querySelector("h3")!.textContent = titulo;
  document.getElementById("ui")!.append(raiz);
  const $ = <T extends HTMLElement>(s: string) => raiz.querySelector(s) as T;
  const puntos = $(".desafio-puntos");
  preguntas.forEach(() => { const d = document.createElement("i"); puntos.append(d); });
  gsap.fromTo(".desafio-hoja", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.4)" });

  return new Promise((fin) => {
    let i = 0, aciertos = 0, racha = 0, ganado = 0, esperando = false, reloj: gsap.core.Tween | null = null;
    let foco = 0;
    const botones = [...raiz.querySelectorAll<HTMLButtonElement>(".vf")];
    const marcarFoco = () => botones.forEach((b, k) => b.classList.toggle("foco", k === foco));
    const pintarRacha = () => { $(".desafio-racha").textContent = racha >= 2 ? `🔥 Racha ${racha} · ×${multiplicador().toFixed(1)}` : ""; };
    const multiplicador = () => 1 + Math.floor(racha / 2) * 0.5;

    const mostrar = () => {
      const p = preguntas[i];
      esperando = true;
      $(".desafio-porque").hidden = true;
      botones.forEach((b) => { b.disabled = false; b.classList.remove("bien", "mal"); });
      const t = $(".desafio-texto");
      t.textContent = p.texto;
      gsap.fromTo(t, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.25 });
      puntos.children[i]?.classList.add("actual");
      reloj?.kill();
      const barra = $(".desafio-reloj i");
      if (ajustes.modoHistoria) { $(".desafio-reloj").hidden = true; return; }
      gsap.set(barra, { width: "100%" });
      reloj = gsap.to(barra, { width: "0%", duration: TIEMPO, ease: "none", onComplete: () => responder(null) });
    };

    const responder = (v: boolean | null) => {
      if (!esperando) return;
      esperando = false;
      reloj?.kill();
      const p = preguntas[i];
      const bien = v === p.verdad;
      anotar(p, bien);
      const dot = puntos.children[i] as HTMLElement;
      dot.classList.remove("actual"); dot.classList.add(bien ? "bien" : "mal");
      botones.forEach((b) => { b.disabled = true; if ((b.dataset.v === "1") === p.verdad) b.classList.add("bien"); else if (v !== null && (b.dataset.v === "1") === v) b.classList.add("mal"); });
      if (bien) {
        aciertos++; racha++;
        const g = Math.round(20 * multiplicador());
        ganado += g;
        sonido.efecto("cobrar");
        const r = botones.find((b) => b.classList.contains("bien"))!.getBoundingClientRect();
        confeti(r.left + r.width / 2, r.top, 14);
        if (racha >= 5) logro("racha-5");
      } else {
        racha = 0;
        sonido.efecto("golpe");
        gsap.fromTo(".desafio-hoja", { x: -8 }, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" });
      }
      pintarRacha();
      const porque = $(".desafio-porque");
      porque.textContent = `${v === null ? "Se acabó el tiempo. " : bien ? "¡Bien! " : "No. "}${p.verdad ? "Es verdadero" : "Es falso"}: ${p.porque}`;
      porque.hidden = false;
      porque.dataset.bien = String(bien);
      setTimeout(siguiente, bien ? 1500 : 2600);
    };

    const siguiente = () => {
      i++;
      if (i < preguntas.length) { mostrar(); return; }
      // Final
      const estrellas = aciertos === preguntas.length ? 3 : aciertos >= preguntas.length - 1 ? 2 : aciertos >= Math.ceil(preguntas.length / 2) ? 1 : 0;
      const hoja = $(".desafio-hoja");
      hoja.innerHTML = `<h3>¡Desafío terminado!</h3><p class="desafio-estrellas">${"★".repeat(estrellas)}${"☆".repeat(3 - estrellas)}</p>
        <p class="desafio-final">${aciertos} de ${preguntas.length} correctas · +${ganado} Saber</p>
        <div class="desafio-fin-botones"><button class="boton" data-r="otra">Otra vez</button><button class="boton grande" data-r="listo">Seguir</button></div>`;
      gsap.from(".desafio-estrellas", { scale: 0.3, opacity: 0, duration: 0.5, ease: "back.out(2)" });
      if (estrellas === 3) { confeti(innerWidth / 2, innerHeight * 0.4, 60); sonido.efecto("hallazgo"); }
      if (estado) { estado.desafio = { jugados: (estado.desafio?.jugados ?? 0) + 1, mejor: Math.max(estado.desafio?.mejor ?? 0, aciertos) }; guardar(); }
      if (ganado) ganarSaber(ganado);
      if (aciertos === preguntas.length && preguntas.length >= 5) logro("repaso-perfecto");
      let fFoco = 1;
      const fb = [...hoja.querySelectorAll<HTMLButtonElement>("button")];
      const pintarF = () => fb.forEach((b, k) => b.classList.toggle("foco", k === fFoco));
      pintarF();
      const salir = (otra: boolean) => {
        ui.cerrarPanel();
        gsap.to(raiz, { opacity: 0, duration: 0.2, onComplete: () => { raiz.remove(); if (otra) desafio(titulo, cuantas, modulo).then((n) => fin(n)); else fin(aciertos); } });
      };
      fb.forEach((b) => b.addEventListener("click", () => salir(b.dataset.r === "otra")));
      ui.abrirPanel(() => salir(fFoco === 0), (code) => { fFoco = /Left|KeyA|Up|KeyW/.test(code) ? 0 : 1; pintarF(); sonido.efecto("mover"); });
    };

    botones.forEach((b) => b.addEventListener("click", () => responder(b.dataset.v === "1")));
    const teclas = (ev: KeyboardEvent) => {
      if (!document.body.contains(raiz)) { removeEventListener("keydown", teclas); return; }
      if (ev.key === "1") responder(true);
      if (ev.key === "2") responder(false);
    };
    addEventListener("keydown", teclas);
    ui.abrirPanel(
      () => { if (esperando) responder(foco === 0); },
      (code) => { foco = /Left|KeyA/.test(code) ? 0 : /Right|KeyD/.test(code) ? 1 : foco; marcarFoco(); if (esperando) responder(foco === 0 ? true : false); },
    );
    marcarFoco();
    mostrar();
  });
}
