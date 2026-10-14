// Tarjeta de jornada completada: estrellas, lo que aprendiste, las fichas
// nuevas, los logros y el Saber ganado. Como el final de un nivel: termina con
// dos botones, el desafío de repaso de esa jornada o seguir.
import gsap from "gsap";
import { HALLAZGOS } from "../content/hallazgos";
import { LOGROS } from "../content/logros";
import { estado } from "../game/estado";
import { confeti } from "./efectos";
import { sonido } from "./sonido";
import { ui } from "./ui";

export type Foto = { hallazgos: string[]; papeles: string[]; logros: string[]; saber: number; fichas: number };

/** Lo que hay al empezar un capítulo, para comparar al final. */
export const foto = (): Foto => ({
  hallazgos: [...(estado?.hallazgos ?? [])], papeles: (estado?.papeles ?? []).map((p) => p.id),
  logros: [...(estado?.logros ?? [])], saber: estado?.saber ?? 0, fichas: estado?.fichas.length ?? 0,
});

export function finJornada(n: number, titulo: string, antes: Foto, estrellas: number, conDesafio: boolean, ultima = false): Promise<"desafio" | "seguir"> {
  const d = estado!;
  const nuevosH = HALLAZGOS.filter((h) => d.hallazgos.includes(h.id) && !antes.hallazgos.includes(h.id));
  const nuevosP = d.papeles.filter((p) => !antes.papeles.includes(p.id));
  const nuevosL = LOGROS.filter((l) => (d.logros ?? []).includes(l.id) && !antes.logros.includes(l.id));
  const saber = (d.saber ?? 0) - antes.saber;
  const fichas = d.fichas.length - antes.fichas;
  const raiz = document.createElement("div");
  raiz.id = "fin-capitulo";
  const lista = (items: string[]) => `<ul>${items.map(() => "<li></li>").join("")}</ul>`;
  raiz.innerHTML = `<div class="fc-hoja" role="dialog">
    <p class="fc-cinta">Jornada ${n} completa</p>
    <h2></h2>
    <p class="fc-estrellas" aria-label="${estrellas} de 3 estrellas">${"★".repeat(estrellas)}<span>${"★".repeat(3 - estrellas)}</span></p>
    <div class="fc-datos"><div><strong>+${saber}</strong><span>Saber</span></div><div><strong>${nuevosH.length}</strong><span>Hallazgos</span></div><div><strong>+${fichas}</strong><span>Fichas</span></div><div><strong>${nuevosL.length}</strong><span>Logros</span></div></div>
    ${nuevosH.length ? `<h3>Lo que aprendiste</h3>${lista(nuevosH.map((h) => h.titulo))}` : ""}
    ${nuevosP.length ? `<h3>Papeles nuevos en tu cajón</h3>${lista(nuevosP.map((p) => p.titulo))}` : ""}
    ${nuevosL.length ? `<h3>Logros</h3>${lista(nuevosL.map((l) => `${l.icono} ${l.titulo}`))}` : ""}
    <div class="fc-compartir"><code></code><button class="boton" data-c="1">📋 Copiar</button></div>
    <div class="fc-botones">${conDesafio ? `<button class="boton grande" data-r="desafio">⚡ Desafío rápido</button>` : ""}<button class="boton${conDesafio ? "" : " grande"}" data-r="seguir">${ultima ? "Ver el final ›" : "Siguiente jornada ›"}</button></div>
  </div>`;
  raiz.querySelector("h2")!.textContent = titulo;
  // Textos con textContent (sin HTML de por medio).
  const textos = [...nuevosH.map((h) => h.titulo), ...nuevosP.map((p) => p.titulo), ...nuevosL.map((l) => `${l.icono} ${l.titulo}`)];
  raiz.querySelectorAll("li").forEach((li, i) => { li.textContent = textos[i]; });
  const linea = `POTESTAS · Jornada ${n} · ${"★".repeat(estrellas)}${"☆".repeat(3 - estrellas)} · +${saber} Saber · ${nuevosH.length} hallazgos`;
  raiz.querySelector(".fc-compartir code")!.textContent = linea;
  raiz.querySelector<HTMLButtonElement>("[data-c]")!.addEventListener("click", async (ev) => {
    const b = ev.currentTarget as HTMLButtonElement;
    try { await navigator.clipboard.writeText(linea); b.textContent = "¡Copiado!"; } catch { b.textContent = "Cópialo a mano"; }
    sonido.efecto("cobrar");
  });
  document.getElementById("ui")!.append(raiz);
  sonido.efecto("hallazgo");
  confeti(innerWidth / 2, innerHeight * 0.25, 60);
  gsap.fromTo(".fc-hoja", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" });
  gsap.from(".fc-datos > div", { y: 20, opacity: 0, duration: 0.35, stagger: 0.1, delay: 0.25 });
  gsap.from(".fc-estrellas", { scale: 0.2, opacity: 0, duration: 0.6, delay: 0.4, ease: "back.out(2.4)" });
  return new Promise((r) => {
    const botones = [...raiz.querySelectorAll<HTMLButtonElement>("button[data-r]")];
    let foco = 0;
    const marcar = () => botones.forEach((b, i) => b.classList.toggle("foco", i === foco));
    const salir = (v: "desafio" | "seguir") => {
      ui.cerrarPanel();
      sonido.efecto("elegir");
      gsap.to(raiz, { opacity: 0, duration: 0.25, onComplete: () => { raiz.remove(); r(v); } });
    };
    botones.forEach((b) => b.addEventListener("click", () => salir(b.dataset.r as "desafio" | "seguir")));
    ui.abrirPanel(() => salir(botones[foco].dataset.r as "desafio" | "seguir"), (code) => { foco = /Left|KeyA|Up|KeyW/.test(code) ? 0 : botones.length - 1; marcar(); sonido.efecto("mover"); });
    marcar();
  });
}
