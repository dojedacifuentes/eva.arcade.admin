// Efectos de interfaz: confeti, monedas, números que flotan y el destello de
// subir de nivel. Son decorativos: nunca bloquean el juego y respetan
// «menos movimiento».
import gsap from "gsap";
import { ajustes } from "../juego/ajustes";

const capa = () => document.getElementById("ui")!;
const COLORES = ["#f2b53c", "#e2725b", "#5a60ff", "#6fbf5a", "#e86a7a", "#2a8cff", "#ffe39a"];

/** Confeti desde un punto de la pantalla (por defecto, el centro). */
export function confeti(x = innerWidth / 2, y = innerHeight * 0.42, n = 36) {
  if (ajustes.menosMovimiento) n = Math.min(n, 10);
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.className = "confeti";
    p.style.background = COLORES[i % COLORES.length];
    p.style.left = `${x}px`; p.style.top = `${y}px`;
    capa().append(p);
    const ang = Math.random() * Math.PI * 2, v = 120 + Math.random() * 220;
    gsap.to(p, {
      x: Math.cos(ang) * v, y: Math.sin(ang) * v - 80, rotation: Math.random() * 720 - 360, duration: 0.9 + Math.random() * 0.5, ease: "power2.out",
      onComplete: () => { gsap.to(p, { y: `+=${80 + Math.random() * 80}`, opacity: 0, duration: 0.6, ease: "power1.in", onComplete: () => p.remove() }); },
    });
  }
}

/** Monedas que saltan desde un elemento (el dinero del HUD). */
export function monedas(desde: Element, n = 7) {
  const r = desde.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const m = document.createElement("i");
    m.className = "moneda-vuela";
    m.style.left = `${r.left + 12}px`; m.style.top = `${r.top + r.height / 2}px`;
    capa().append(m);
    gsap.fromTo(m, { x: 0, y: 0, scale: 0.6 }, {
      x: (Math.random() - 0.5) * 70, y: -30 - Math.random() * 40, scale: 1, duration: 0.35, delay: i * 0.03, ease: "power2.out",
      onComplete: () => { gsap.to(m, { y: "+=50", opacity: 0, duration: 0.45, ease: "power2.in", onComplete: () => m.remove() }); },
    });
  }
}

/** Un número que sube y se desvanece («+100 Saber»). */
export function flotar(texto: string, x: number, y: number, clase = "") {
  const t = document.createElement("span");
  t.className = `flota ${clase}`;
  t.textContent = texto;
  t.style.left = `${x}px`; t.style.top = `${y}px`;
  capa().append(t);
  gsap.fromTo(t, { y: 0, opacity: 0, scale: 0.7 }, { y: -34, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)",
    onComplete: () => { gsap.to(t, { y: -60, opacity: 0, duration: 0.6, delay: 0.5, onComplete: () => t.remove() }); } });
}

/** Aviso que entra por arriba y se va solo (logros, nivel). No bloquea. */
export function aviso(icono: string, titulo: string, texto: string, clase = "") {
  let cont = document.getElementById("avisos");
  if (!cont) { cont = document.createElement("div"); cont.id = "avisos"; capa().append(cont); }
  const a = document.createElement("div");
  a.className = `aviso ${clase}`;
  a.innerHTML = `<span class="aviso-icono"></span><div><strong></strong><p></p></div>`;
  (a.querySelector(".aviso-icono") as HTMLElement).textContent = icono;
  a.querySelector("strong")!.textContent = titulo;
  a.querySelector("p")!.textContent = texto;
  cont.append(a);
  gsap.fromTo(a, { y: -30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.8)" });
  gsap.to(a, { opacity: 0, y: -20, duration: 0.4, delay: 3.4, onComplete: () => a.remove() });
}

/** Destello de pantalla completa (subir de nivel). */
export function destello(color = "rgba(255, 227, 154, 0.55)") {
  if (ajustes.menosMovimiento) return;
  const d = document.createElement("div");
  d.className = "destello";
  d.style.background = `radial-gradient(circle at 50% 45%, ${color}, transparent 70%)`;
  capa().append(d);
  gsap.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1, onComplete: () => d.remove() });
}
