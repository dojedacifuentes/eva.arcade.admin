import Phaser from "phaser";
import { lienzo, plantilla } from "../pixel";

export type Dir = "abajo" | "arriba" | "izquierda" | "derecha";
export type Emote = "corazon" | "exclamacion" | "pregunta" | "puntos" | "nota" | "gota" | "enojo";

const VELOCIDAD = 84; // px por segundo, en píxeles del mundo
const QUIETO: Record<Dir, number> = { abajo: 0, arriba: 4, izquierda: 8, derecha: 8 };

const EMOTES: Record<Emote, { filas: string[]; c: string }> = {
  corazon: { c: "#e8576b", filas: [".OO.OO.", "OccOccO", "OcccccO", ".OcccO.", "..OcO..", "...O..."] },
  exclamacion: { c: "#f2b53c", filas: ["..OOO..", "..OcO..", "..OcO..", "..OcO..", "..OOO..", "..OcO..", "..OOO.."] },
  pregunta: { c: "#5fa3d6", filas: [".OOOO..", "OccccO.", "O..OcO.", "..OcO..", "..OOO..", "..OcO..", "..OOO.."] },
  puntos: { c: "#6b6370", filas: [".......", ".......", ".......", "OO.OO.OO", "cO.cO.cO", "OO.OO.OO"] },
  nota: { c: "#9a6fc4", filas: ["...OOOO", "...OccO", "...O..O", "...O..O", ".OOO.OO", "OccOOcO", ".OO..O."] },
  gota: { c: "#6cb6d6", filas: ["...O...", "..OcO..", ".OcccO.", ".OcccO.", "..OOO.."] },
  enojo: { c: "#d24e4e", filas: ["Oc.O.cO", ".OcOcO.", "..O.O..", ".OcOcO.", "Oc.O.cO"] },
};

export function texturaEmote(scene: Phaser.Scene, e: Emote) {
  const k = `emote-${e}`;
  if (scene.textures.exists(k)) return k;
  const { c, g } = lienzo(13, 13);
  // globito
  plantilla(g, [
    "..OOOOOOOOO..", ".OwwwwwwwwwO.", "OwwwwwwwwwwwO", "OwwwwwwwwwwwO", "OwwwwwwwwwwwO", "OwwwwwwwwwwwO",
    "OwwwwwwwwwwwO", "OwwwwwwwwwwwO", "OwwwwwwwwwwwO", ".OwwwwwwwwwO.", "..OOOwwOOOO..", "....OwO......", ".....O.......",
  ], { O: "#2a1d2b", w: "#fffaf0" });
  plantilla(g, EMOTES[e].filas, { O: "#2a1d2b", c: EMOTES[e].c }, 3, 2);
  scene.textures.addCanvas(k, c);
  return k;
}

/** Cualquier persona del mundo: jugador, pareja o vecino. */
export class Personaje extends Phaser.GameObjects.Container {
  readonly cuerpo: Phaser.GameObjects.Sprite;
  private sombra: Phaser.GameObjects.Image;
  dir: Dir = "abajo";
  private andando = false;

  constructor(scene: Phaser.Scene, readonly clave: string, x: number, y: number) {
    super(scene, x, y);
    this.sombra = scene.add.image(0, 0, "sombra").setOrigin(0.5, 0.6);
    this.cuerpo = scene.add.sprite(0, 1, clave, 0).setOrigin(0.5, 1);
    this.add([this.sombra, this.cuerpo]);
    scene.add.existing(this);
    this.setDepth(y);
  }

  mirar(d: Dir) {
    this.dir = d;
    this.andando = false;
    this.cuerpo.stop();
    this.cuerpo.setFrame(QUIETO[d]);
    this.cuerpo.setFlipX(d === "izquierda");
  }

  mirarHacia(x: number, y: number) {
    const dx = x - this.x, dy = y - this.y;
    this.mirar(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "derecha" : "izquierda") : dy > 0 ? "abajo" : "arriba");
  }

  andar(d: Dir) {
    const anim = `${this.clave}-${d === "izquierda" || d === "derecha" ? "lado" : d}`;
    this.cuerpo.setFlipX(d === "izquierda");
    if (!this.andando || this.dir !== d || this.cuerpo.anims.currentAnim?.key !== anim) this.cuerpo.play(anim, true);
    this.dir = d;
    this.andando = true;
  }

  detener() {
    if (this.andando) this.mirar(this.dir);
  }

  /**
   * Mueve con colisión por ejes: deslizarse contra una pared se siente natural.
   * Si una esquina corta el paso por pocos píxeles, el personaje se corre hacia
   * el hueco (como en los buenos RPG): nadie se traba en un pasillo angosto.
   */
  mover(dx: number, dy: number, dt: number, libre: (x: number, y: number) => boolean, rapidez = 1) {
    const len = Math.hypot(dx, dy);
    if (len < 0.15) { this.detener(); return; }
    const k = Math.min(1, len);
    const vx = (dx / len) * VELOCIDAD * rapidez * k * (dt / 1000), vy = (dy / len) * VELOCIDAD * rapidez * k * (dt / 1000);
    const paso = Math.max(Math.abs(vx), Math.abs(vy), 0.6);
    if (libre(this.x + vx, this.y)) this.x += vx;
    else if (Math.abs(dx) > Math.abs(dy)) this.esquivar(0, Math.sign(vx) * paso, paso, libre);
    if (libre(this.x, this.y + vy)) this.y += vy;
    else if (Math.abs(dy) >= Math.abs(dx)) this.esquivar(Math.sign(vy) * paso, 0, paso, libre, true);
    this.andar(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "derecha" : "izquierda") : dy > 0 ? "abajo" : "arriba");
    this.cuerpo.anims.timeScale = (0.6 + 0.6 * k) * (rapidez > 1 ? 1.4 : 1);
    this.setDepth(this.y);
  }

  /** Busca, a pocos píxeles a cada lado, una posición desde la que sí se avanza. */
  private esquivar(ay: number, ax: number, paso: number, libre: (x: number, y: number) => boolean, vertical = false) {
    for (let o = 1; o <= 7; o++) for (const lado of [1, -1]) {
      const ox = vertical ? o * lado : 0, oy = vertical ? 0 : o * lado;
      if (libre(this.x + ox, this.y + oy) && libre(this.x + ox + ax, this.y + oy + ay)) {
        if (vertical) this.x += Math.sign(ox) * Math.min(paso, 1.2); else this.y += Math.sign(oy) * Math.min(paso, 1.2);
        return;
      }
    }
  }

  puntoDelante(d: number) {
    const v = { abajo: [0, 1], arriba: [0, -1], izquierda: [-1, 0], derecha: [1, 0] }[this.dir];
    return { x: this.x + v[0] * d, y: this.y - 4 + v[1] * d };
  }

  emote(e: Emote, ms = 1600) {
    const s = this.scene.add.image(this.x + 6, this.y - 26, texturaEmote(this.scene, e)).setOrigin(0.5, 1).setDepth(9000).setScale(0);
    this.scene.tweens.add({ targets: s, scale: 1, y: s.y - 3, duration: 220, ease: "Back.out" });
    this.scene.tweens.add({ targets: s, alpha: 0, delay: ms, duration: 250, onComplete: () => s.destroy() });
  }
}
