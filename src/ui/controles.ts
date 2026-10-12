// Controles: teclado (WASD / flechas + E, Espacio o Enter) y, en pantallas
// táctiles, un joystick que aparece donde se apoya el pulgar izquierdo y un
// solo botón de acción contextual a la derecha.

const teclas = new Set<string>();
let accion = false;
let joy = { x: 0, y: 0, activo: false };

const MAPA: Record<string, [number, number]> = {
  ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1],
  ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
};
const ACCION = new Set(["KeyE", "Space", "Enter", "KeyZ"]);

const sostenidas = new Set<string>();
let botonSostenido = false;
addEventListener("keydown", (e) => {
  if (ACCION.has(e.code)) sostenidas.add(e.code);
  if (MAPA[e.code]) { teclas.add(e.code); e.preventDefault(); }
  if (ACCION.has(e.code) && !e.repeat) { accion = true; e.preventDefault(); }
});
addEventListener("keyup", (e) => { teclas.delete(e.code); sostenidas.delete(e.code); });
let mayus = false;
addEventListener("keydown", (e) => { if (e.key === "Shift") mayus = true; });
addEventListener("keyup", (e) => { if (e.key === "Shift") mayus = false; });
addEventListener("blur", () => { teclas.clear(); sostenidas.clear(); botonSostenido = false; });

export const esTactil = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

export function montarControlesTactiles(raiz: HTMLElement) {
  const zona = document.createElement("div");
  zona.className = "joy-zona";
  const base = document.createElement("div");
  base.className = "joy-base";
  const pomo = document.createElement("div");
  pomo.className = "joy-pomo";
  base.append(pomo);
  zona.append(base);
  const boton = document.createElement("button");
  boton.className = "boton-a";
  boton.setAttribute("aria-label", "Acción");
  boton.textContent = "A";
  raiz.append(zona, boton);

  let id: number | null = null, cx = 0, cy = 0;
  const R = 44;
  zona.addEventListener("pointerdown", (e) => {
    id = e.pointerId; cx = e.clientX; cy = e.clientY;
    zona.setPointerCapture(e.pointerId);
    base.style.left = `${cx}px`; base.style.top = `${cy}px`;
    base.classList.add("visible");
    joy = { x: 0, y: 0, activo: true };
  });
  zona.addEventListener("pointermove", (e) => {
    if (e.pointerId !== id) return;
    let dx = e.clientX - cx, dy = e.clientY - cy;
    const d = Math.hypot(dx, dy);
    if (d > R) { dx = (dx / d) * R; dy = (dy / d) * R; }
    pomo.style.transform = `translate(${dx}px, ${dy}px)`;
    joy = { x: dx / R, y: dy / R, activo: true };
  });
  const soltar = (e: PointerEvent) => {
    if (e.pointerId !== id) return;
    id = null; joy = { x: 0, y: 0, activo: false };
    pomo.style.transform = "";
    base.classList.remove("visible");
  };
  zona.addEventListener("pointerup", soltar);
  zona.addEventListener("pointercancel", soltar);
  boton.addEventListener("pointerdown", (e) => { e.preventDefault(); accion = true; botonSostenido = true; boton.classList.add("pulsado"); });
  const soltarA = () => { botonSostenido = false; boton.classList.remove("pulsado"); };
  boton.addEventListener("pointerup", soltarA);
  boton.addEventListener("pointercancel", soltarA);
  boton.addEventListener("pointerleave", soltarA);
  return { boton };
}

export const controles = {
  direccion() {
    if (joy.activo) return { dx: joy.x, dy: joy.y };
    let dx = 0, dy = 0;
    for (const k of teclas) { dx += MAPA[k][0]; dy += MAPA[k][1]; }
    return { dx: Math.sign(dx), dy: Math.sign(dy) };
  },
  /** Correr: Mayús en el teclado o el joystick empujado hasta el borde. */
  corriendo() { return mayus || (joy.activo && Math.hypot(joy.x, joy.y) > 0.92); },
  /** La tecla de acción (o el botón A) sigue apretada: para pasar diálogos rápido. */
  mantenida() { return botonSostenido || sostenidas.size > 0; },
  /** true una sola vez por pulsación. */
  accionPulsada() {
    const a = accion;
    accion = false;
    return a;
  },
  /** Descarta una pulsación pendiente (al cerrar un diálogo, por ejemplo). */
  limpiar() { accion = false; },
};
