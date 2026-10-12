// Efectos del capítulo 5, pintados en código porque dependen de la partida:
// grietas en las paredes (más roce, más grietas), lluvia y las etiquetas de
// colores con que se reparten los muebles.
import Phaser from "phaser";
import { lienzo, rect, tono } from "../pixel";

const O = "#2a1d2b";

function agregar(scene: Phaser.Scene, clave: string, c: HTMLCanvasElement) {
  if (scene.textures.exists(clave)) return;
  scene.textures.addCanvas(clave, c);
}

/** Cuatro grietas distintas: una línea quebrada oscura con un borde claro. */
const TRAZOS: [number, number][][] = [
  [[8, 0], [7, 4], [9, 7], [6, 11], [8, 15], [5, 20], [6, 23]],
  [[2, 2], [6, 5], [5, 9], [10, 12], [9, 16], [13, 19]],
  [[12, 0], [10, 3], [11, 6], [7, 9], [8, 13], [4, 15], [3, 19], [5, 23]],
  [[3, 6], [7, 8], [9, 7], [12, 10], [11, 14]],
];

export function texturasEfectos(scene: Phaser.Scene) {
  TRAZOS.forEach((t, i) => {
    const { c, g } = lienzo(16, 24);
    const linea = (dx: number, color: string) => {
      for (let k = 0; k < t.length - 1; k++) {
        const [x0, y0] = t[k], [x1, y1] = t[k + 1];
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
        for (let s = 0; s <= n; s++) rect(g, Math.round(x0 + ((x1 - x0) * s) / n) + dx, Math.round(y0 + ((y1 - y0) * s) / n), 1, 1, color);
      }
    };
    linea(1, "rgba(255,255,255,0.35)");
    linea(0, "rgba(42,29,43,0.85)");
    // una ramita
    const [bx, by] = t[Math.floor(t.length / 2)];
    rect(g, bx + 1, by + 1, 1, 1, "rgba(42,29,43,0.8)"); rect(g, bx + 2, by + 2, 1, 1, "rgba(42,29,43,0.6)");
    agregar(scene, `grieta-${i}`, c);
  });
  const go = lienzo(2, 8); rect(go.g, 0, 0, 1, 8, "#8fb3d1"); rect(go.g, 1, 1, 1, 7, "#e8f2fa"); rect(go.g, 1, 6, 1, 2, "#ffffff");
  agregar(scene, "gota", go.c);
  const sp = lienzo(5, 2); rect(sp.g, 0, 1, 1, 1, "#bcd8ea"); rect(sp.g, 4, 1, 1, 1, "#bcd8ea"); rect(sp.g, 2, 0, 1, 1, "#ffffff");
  agregar(scene, "salpica", sp.c);
  // Brillo de los secretos del barrio: una estrellita.
  const br = lienzo(9, 9);
  for (const [x, y, w, h, c] of [[4, 0, 1, 9, "#ffe39a"], [0, 4, 9, 1, "#ffe39a"], [3, 3, 3, 3, "#fff6c8"], [4, 4, 1, 1, "#ffffff"], [2, 2, 1, 1, "#f2b53c"], [6, 6, 1, 1, "#f2b53c"], [6, 2, 1, 1, "#f2b53c"], [2, 6, 1, 1, "#f2b53c"]] as [number, number, number, number, string][]) rect(br.g, x, y, w, h, c);
  agregar(scene, "brillo", br.c);
  // La marca que flota sobre lo que se puede usar: un globito con una «A».
  const ma = lienzo(13, 15);
  rect(ma.g, 2, 0, 9, 1, O); rect(ma.g, 1, 1, 11, 1, O); rect(ma.g, 0, 2, 13, 8, O); rect(ma.g, 1, 10, 11, 1, O); rect(ma.g, 2, 11, 9, 1, O); rect(ma.g, 5, 12, 3, 1, O); rect(ma.g, 6, 13, 1, 1, O);
  rect(ma.g, 2, 1, 9, 1, "#e2725b"); rect(ma.g, 1, 2, 11, 8, "#e2725b"); rect(ma.g, 2, 10, 9, 1, "#e2725b"); rect(ma.g, 6, 12, 1, 1, "#e2725b"); rect(ma.g, 2, 2, 9, 1, "#f09a86");
  for (const [x, y, w, h] of [[5, 3, 3, 1], [4, 4, 1, 5], [8, 4, 1, 5], [5, 6, 3, 1]]) rect(ma.g, x, y, w, h, "#ffffff");
  agregar(scene, "marca-a", ma.c);
  // Sombra de nube: una mancha suave que cruza el barrio.
  const nu = lienzo(140, 70);
  const gr = nu.g.createRadialGradient(70, 35, 4, 70, 35, 70);
  gr.addColorStop(0, "rgba(30, 30, 60, 0.16)"); gr.addColorStop(0.6, "rgba(30, 30, 60, 0.09)"); gr.addColorStop(1, "rgba(30, 30, 60, 0)");
  nu.g.fillStyle = gr; nu.g.save(); nu.g.scale(1, 0.5); nu.g.beginPath(); nu.g.arc(70, 70, 70, 0, Math.PI * 2); nu.g.fill(); nu.g.restore();
  agregar(scene, "nube-sombra", nu.c);
  // Pájaro: dos cuadros (alas arriba, alas abajo).
  const pa = lienzo(18, 6);
  for (const [x, y] of [[0, 2], [1, 1], [2, 0], [3, 1], [4, 2], [5, 1], [6, 0], [7, 1], [8, 2]]) rect(pa.g, x, y, 1, 1, "#3d3340");
  for (const [x, y] of [[9, 2], [10, 3], [11, 4], [12, 3], [13, 2], [14, 3], [15, 4], [16, 3], [17, 2]]) rect(pa.g, x, y - 1, 1, 1, "#3d3340");
  if (!scene.textures.exists("pajaro")) scene.textures.addSpriteSheet("pajaro", pa.c as unknown as HTMLImageElement, { frameWidth: 9, frameHeight: 6 });
}

/** La etiqueta de colores que se pega en lo que se lleva cada uno. */
export function etiqueta(scene: Phaser.Scene, color: string) {
  const clave = `etiqueta-${color}`;
  if (scene.textures.exists(clave)) return clave;
  const { c, g } = lienzo(12, 10);
  rect(g, 0, 2, 11, 8, O); rect(g, 1, 3, 9, 6, color); rect(g, 1, 3, 9, 1, tono(color, 0.3));
  rect(g, 3, 5, 1, 1, O); // el hoyito
  rect(g, 3, 0, 1, 3, "#f6efe2"); // el hilo
  scene.textures.addCanvas(clave, c);
  return clave;
}
