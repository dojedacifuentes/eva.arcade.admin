// La escena del mundo: carga cualquier mapa de Tiled (la ciudad o un interior)
// y pasa de uno a otro por las puertas sin pantallas de carga: un fundido y ya.
// También ofrece al guion lo que necesita: personajes, objetos, objetivos,
// esperar a que el jugador llegue o use algo, el reloj y la estación.
import Phaser from "phaser";
import { T, texturasVivas } from "../art/world";
import { texturasEfectos } from "../art/efectos";
import { hojaPersonaje, type Apariencia } from "../art/characters";
import { MUEBLES } from "../art/interior";
import { LUGARES } from "../maps/ciudad";
import { Personaje, type Dir } from "../actors/Personaje";
import { controles } from "../../ui/controles";
import { ui } from "../../ui/ui";
import { sonido } from "../../ui/sonido";
import { e, estado, hora } from "../estado";
import { ajustes } from "../../juego/ajustes";
import { PENSAMIENTOS } from "../../content/pensamientos";

export type Pos = { x: number; y: number };
type Interactivo = { pos: () => Pos; radio: number; etiqueta: string; fn?: () => void };
type Prop = { name: string; value: unknown };
type ObjTiled = { name: string; type: string; x: number; y: number; width: number; height: number; gid?: number; properties?: Prop[] };
type CapaTiled = { name: string; type: string; data?: number[]; objects?: ObjTiled[] };
type TilesetTiled = { firstgid: number; name: string; tiles?: { id: number; image: string; properties?: Prop[] }[] };
type MapaTiled = { width: number; height: number; layers: CapaTiled[]; tilesets: TilesetTiled[]; properties?: Prop[] };

const prop = (o: { properties?: Prop[] } | undefined, n: string) => o?.properties?.find((p) => p.name === n)?.value;
const ARBOLES_OTONO: Record<number, number> = { 4: 3, 16: 15, 28: 27 }; // Tiny Town: verde → naranjo
export const MAPAS = ["ciudad", "municipalidad", "partes", "juridica", "atencion", "fiscalizacion", "contraloria", "corte", "juzgado", "tc", "casa-rosa"] as const;
export type NombreMapa = (typeof MAPAS)[number];
/** Lugares de la ciudad que tienen interior (el id del lugar es el del mapa). */
const INTERIOR: Partial<Record<string, NombreMapa>> = Object.fromEntries(MAPAS.filter((m) => m !== "ciudad").map((m) => [m, m]));

let avisarListo: (m: Mundo) => void;
export const mundoListo = new Promise<Mundo>((r) => { avisarListo = r; });

export class Mundo extends Phaser.Scene {
  mapa: NombreMapa = "ciudad";
  jugador?: Personaje;
  private bloqueo: boolean[][] = [];
  private npcs = new Map<string, Personaje>();
  private props = new Map<string, Phaser.GameObjects.Image>();
  private interactivos = new Map<string, Interactivo>();
  private esperas = new Map<string, () => void>();
  private llegadas: { pos: Pos; radio: number; r: () => void }[] = [];
  private puntos = new Map<string, Pos>();
  private arboles: Phaser.GameObjects.Image[] = [];
  private flecha!: Phaser.GameObjects.Sprite;
  private fuente?: Phaser.GameObjects.Sprite;
  private metaPos: (() => Pos) | null = null;
  private quieto = true;
  private relojOn = false;
  private relojAcum = 0;
  private particulas?: Phaser.GameObjects.Particles.ParticleEmitter;
  private vitrinaTw?: Phaser.Tweens.Tween;
  private estacionActual: "primavera" | "otono" = "primavera";
  private lloviendo = false;
  private polvo = 0;
  private marca?: Phaser.GameObjects.Image;
  private quietoMs = 0;
  private zoomBase = 0;
  private static escuchando = false;
  private botonIr?: HTMLButtonElement;
  private lluviaFx?: Phaser.GameObjects.Particles.ParticleEmitter;
  private grietas: Phaser.GameObjects.Image[] = [];
  private W = 0;
  private H = 0;
  /** Puertas que la historia todavía no deja usar (por lugar). */
  cerradas = new Set<string>(MAPAS.filter((m) => m !== "ciudad"));
  /** Se llama la primera vez que el jugador se mueve (para quitar la ayuda). */
  alMoverse?: () => void;
  /** Lo que la historia agrega a un lugar cada vez que se carga (el hogar que se llena). */
  decorar?: (m: Mundo) => void;
  /** false: la historia no deja salir del interior todavía. */
  puedeSalir = true;
  private saliendo = false;

  constructor() { super("mundo"); }

  init(datos?: { mapa?: NombreMapa }) { this.mapa = datos?.mapa ?? "ciudad"; }

  preload() {
    for (const m of MAPAS) this.load.tilemapTiledJSON(m, `assets/mapas/${m}.tmj`);
    for (const ts of ["pueblo", "ciudad", "casa"]) {
      this.load.image(ts, `assets/tilesets/${ts}.png`);
      this.load.spritesheet(`${ts}-s`, `assets/tilesets/${ts}.png`, { frameWidth: T, frameHeight: T });
    }
    for (const l of LUGARES) {
      this.load.image(`ed-${l.id}`, `assets/arte/edificios/${l.id}.png`);
      this.load.image(`ed-${l.id}-noche`, `assets/arte/edificios/${l.id}-noche.png`);
    }
    for (const id of Object.keys(MUEBLES)) this.load.image(`mu-${id}`, `assets/arte/muebles/${id}.png`);
  }

  create() {
    // Todo lo que depende del mapa se rehace al cambiar de lugar.
    this.jugador = undefined;
    this.npcs = new Map(); this.props = new Map(); this.interactivos = new Map(); this.esperas = new Map();
    this.llegadas = []; this.puntos = new Map(); this.arboles = []; this.metaPos = null;
    this.particulas = undefined;
    this.lluviaFx = undefined;
    this.grietas = [];
    this.saliendo = false;
    if (!this.textures.exists("fuente")) texturasVivas(this);
    if (!this.textures.exists("gota")) texturasEfectos(this);
    this.crearAnimaciones();
    this.construirMapa();
    this.flecha = this.add.sprite(0, 0, "flecha").setOrigin(0.5, 1).setDepth(9500).setVisible(false).play("flecha-rebote");
    this.marca = this.add.image(0, 0, "marca-a").setOrigin(0.5, 1).setDepth(9400).setVisible(false);
    this.quietoMs = 0;
    this.escucharUi();
    this.cameras.main.setRoundPixels(true);
    this.ajustarCamara();
    this.scale.off("resize", this.ajustarCamara, this);
    this.scale.on("resize", this.ajustarCamara, this);
    if (this.mapa === "ciudad") {
      this.particulas = this.add.particles(0, 0, "petalo", {
        x: { min: 0, max: this.W * T }, y: -10, lifespan: 14000, speedY: { min: 8, max: 16 }, speedX: { min: -6, max: 10 },
        rotate: { min: 0, max: 360 }, frequency: 450, quantity: 1, alpha: { start: 0.95, end: 0.5 },
      }).setDepth(5000);
      this.estacion(this.estacionActual);
      this.vidaDelBarrio();
    }
    if (this.lloviendo) this.lluvia(true);
    this.luz();
    this.decorar?.(this);
    avisarListo(this);
    this.events.emit("mapa-listo");
  }

  // ── Construcción desde Tiled ─────────────────────────────────────────────
  private construirMapa() {
    const datos = this.cache.tilemap.get(this.mapa).data as MapaTiled;
    const W = (this.W = datos.width), H = (this.H = datos.height);
    this.bloqueo = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => x === 0 || y === 0 || x === W - 1 || y === H - 1));
    const mapa = this.make.tilemap({ key: this.mapa });
    const sets = datos.tilesets.filter((t) => !t.tiles).map((t) => mapa.addTilesetImage(t.name, t.name)!);
    const capa = (n: string) => datos.layers.find((l) => l.name === n);
    const hoja = (gid: number) => {
      const ts = [...datos.tilesets].reverse().find((t) => gid >= t.firstgid)!;
      return { clave: `${ts.name}-s`, frame: gid - ts.firstgid, ts };
    };
    mapa.createLayer("suelo", sets, 0, 0)?.setDepth(-20);
    if (capa("caminos")) mapa.createLayer("caminos", sets, 0, 0)?.setDepth(-19);
    if (capa("muros")) {
      mapa.createLayer("muros", sets, 0, 0)?.setDepth(-18);
      const m = capa("muros")!.data!;
      m.forEach((gid, i) => { if (gid) this.bloqueo[Math.floor(i / W)][i % W] = true; });
    }
    // En un interior, la puerta (el hueco del muro de abajo) es la salida, no un borde.
    if (prop(datos, "interior")) {
      const muros = capa("muros")?.data ?? [];
      for (let x = 0; x < W; x++) if (!muros[(H - 1) * W + x]) this.bloqueo[H - 1][x] = false;
    }

    const obj = capa("obj")?.data ?? [], alto = capa("obj-alto")?.data ?? [];
    const sprite = (i: number, gid: number, prof: number) => {
      const h = hoja(gid);
      const im = this.add.image((i % W) * T, (Math.floor(i / W) + 1) * T, h.clave, h.frame).setOrigin(0, 1).setDepth(prof);
      if (h.ts.name === "pueblo" && (h.frame in ARBOLES_OTONO || Object.values(ARBOLES_OTONO).includes(h.frame))) this.arboles.push(im);
    };
    obj.forEach((gid, i) => { if (gid) { sprite(i, gid, (Math.floor(i / W) + 1) * T - 2); this.bloqueo[Math.floor(i / W)][i % W] = true; } });
    alto.forEach((gid, i) => {
      if (!gid) return;
      const x = i % W, y = Math.floor(i / W);
      let base = y + 1;
      while (base < H && base <= y + 2 && !obj[base * W + x]) base++;
      sprite(i, gid, (Math.min(base, H - 1) + 1) * T - 2);
    });

    // Imágenes de colecciones (edificios de la ciudad, muebles de los interiores).
    const tileDe = (gid: number) => { const h = hoja(gid); return { ...h, tile: h.ts.tiles?.find((t) => t.id === h.frame) }; };
    const clave = (gid: number) => {
      const t = tileDe(gid);
      const archivo = (t.tile?.image ?? "").split("/").pop()!.replace(".png", "");
      return t.ts.name === "edificios" ? `ed-${archivo}` : `mu-${archivo}`;
    };
    for (const o of capa("edificios")?.objects ?? []) {
      if (!o.gid) continue;
      // De noche, las ventanas encendidas.
      const noche = this.esNoche() && this.textures.exists(`${clave(o.gid)}-noche`);
      const tex = noche ? `${clave(o.gid)}-noche` : clave(o.gid);
      this.add.image(o.x, o.y, tex).setOrigin(0, 1).setDepth(o.y - 4);
      this.bloquearRect(o.x, o.y - o.height, o.width, o.height - 4);
    }
    for (const o of capa("muebles")?.objects ?? []) {
      if (!o.gid) continue;
      const t = tileDe(o.gid);
      const pasable = prop(t.tile, "pasable") === true, solido = Number(prop(t.tile, "solido") ?? 8);
      this.add.image(o.x, o.y, clave(o.gid)).setOrigin(0, 1).setDepth(pasable ? -15 : o.y);
      if (!pasable && solido > 0) this.bloquearRect(o.x + 2, o.y - solido, o.width - 4, solido - 1);
    }
    for (const o of capa("colision")?.objects ?? []) this.bloquearRect(o.x, o.y, o.width, o.height);

    for (const p of capa("puntos")?.objects ?? []) {
      this.puntos.set(p.name, { x: p.x, y: p.y });
      if (p.type === "fuente") {
        this.fuente = this.add.sprite(p.x, p.y + 8, "fuente", 0).setOrigin(0.5, 1).setDepth(p.y).setScale(1.25);
        this.fuente.play("fuente-agua");
      }
      if (p.type === "puerta") this.ponerPuerta(p);

    }
  }

  private ponerPuerta(p: ObjTiled) {
    const lugar = String(prop(p, "lugar") ?? p.name.replace("puerta-", ""));
    const abierto = prop(p, "abierto") !== false;
    const nombre = String(prop(p, "nombre") ?? p.name);
    const destino = INTERIOR[lugar];
    const etiqueta = () => (destino && !this.cerradas.has(lugar)) || abierto ? "Entrar" : "Mirar";
    this.interactuar(p.name, etiqueta(), { x: p.x, y: p.y }, () => {
      if (destino && !this.cerradas.has(lugar)) { void this.irA(destino, "entrada", "arriba"); return; }
      void ui.decir([{ quien: nombre, texto: abierto ? "Atención con hora. Hoy tu trabajo está en otra parte: sigue la estrella." : String(prop(p, "aviso") ?? "Cerrado.") }]);
    }, 14);
  }

  private crearAnimaciones() {
    const mk = (k: string, tex: string, frames: number[], rate: number) => {
      if (!this.anims.exists(k)) this.anims.create({ key: k, frames: this.anims.generateFrameNumbers(tex, { frames }), frameRate: rate, repeat: -1 });
    };
    mk("fuente-agua", "fuente", [0, 1, 2], 6);
    mk("flecha-rebote", "flecha", [0, 1, 2, 1], 6);
    mk("pajaro-vuela", "pajaro", [0, 1], 7);
  }

  private bloquearRect(px: number, py: number, w: number, h: number) {
    for (let y = Math.floor(py / T); y < Math.ceil((py + h) / T); y++)
      for (let x = Math.floor(px / T); x < Math.ceil((px + w) / T); x++) if (this.bloqueo[y]?.[x] !== undefined) this.bloqueo[y][x] = true;
  }

  /** Zoom entero (pixel art nítido) y, si el lugar es más chico que la pantalla, centrado. */
  private ajustarCamara() {
    const cam = this.cameras.main;
    const { width, height } = this.scale;
    const z = Math.max(2, Math.floor(Math.min(width, height) / 200));
    cam.setZoom(z);
    const vw = width / z, vh = height / z, mw = this.W * T, mh = this.H * T;
    cam.setBounds(Math.min(0, (mw - vw) / 2), Math.min(0, (mh - vh) / 2), Math.max(mw, vw), Math.max(mh, vh));
  }

  // ── API para el guion ────────────────────────────────────────────────────
  punto(n: string): Pos {
    const p = this.puntos.get(n);
    if (!p) throw new Error(`No hay punto «${n}» en el mapa ${this.mapa}`);
    return { ...p };
  }

  /** Cámara paseando por la ciudad detrás del título. */
  vitrina() {
    const cam = this.cameras.main;
    cam.stopFollow();
    cam.centerOn(22 * T, 16 * T);
    this.vitrinaTw = this.tweens.add({ targets: cam, scrollX: cam.scrollX + 20 * T, duration: 32000, yoyo: true, repeat: -1, ease: "Sine.inOut" });
  }

  comenzar(apariencia: Apariencia, pos: Pos, dir: Dir = "abajo") {
    this.vitrinaTw?.stop();
    hojaPersonaje(this, "jugador", apariencia);
    this.jugador?.destroy();
    this.jugador = new Personaje(this, "jugador", pos.x, pos.y);
    this.jugador.mirar(dir);
    const cam = this.cameras.main;
    cam.startFollow(this.jugador, true, 0.12, 0.12);
    cam.centerOn(pos.x, pos.y);
    cam.fadeIn(260, 20, 12, 18);
  }

  /** Cambia de lugar: fundido, carga el otro mapa y deja al jugador en `punto`. */
  irA(mapa: NombreMapa, punto: string, dir: Dir = "abajo"): Promise<void> {
    sonido.efecto("puerta");
    const salida = punto.startsWith("puerta-");
    return new Promise((r) => {
      this.cameras.main.fadeOut(150, 20, 12, 18);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.events.once("mapa-listo", () => {
          const p = this.punto(punto);
          this.comenzar(e().apariencia, salida ? { x: p.x, y: p.y + 10 } : p, dir);
          this.events.emit("lugar", mapa);
          r();
        });
        this.scene.restart({ mapa });
      });
    });
  }

  /** Un personaje de la historia. `escala` < 1 para niños (mismo molde, más chico). */
  npc(id: string, a: Apariencia, pos: Pos, dir: Dir = "abajo", escala = 1) {
    this.npcs.get(id)?.destroy();
    // Si la escena trae a alguien que andaba de vecino, el vecino se retira (nunca hay dos iguales).
    if (!id.startsWith("vecino-")) this.quitarNpc(`vecino-${id}`);
    hojaPersonaje(this, `npc-${id}`, a);
    const n = new Personaje(this, `npc-${id}`, pos.x, pos.y);
    n.setData("apariencia", a);
    if (escala !== 1) n.cuerpo.setScale(escala);
    n.mirar(dir);
    this.npcs.set(id, n);
    return n;
  }
  quitarNpc(id: string) { this.npcs.get(id)?.destroy(); this.npcs.delete(id); this.quitarInteraccion(id); }
  get(id: string) { return this.npcs.get(id); }

  /** Camina por una lista de puntos (sin chocar: es una escena). */
  async caminar(p: Personaje, ruta: Pos[], velocidad = 70) {
    for (const destino of ruta) {
      const dx = destino.x - p.x, dy = destino.y - p.y, d = Math.hypot(dx, dy);
      if (d < 1) continue;
      p.andar(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "derecha" : "izquierda") : dy > 0 ? "abajo" : "arriba");
      await new Promise<void>((r) => this.tweens.add({ targets: p, x: destino.x, y: destino.y, duration: (d / velocidad) * 1000, onUpdate: () => p.setDepth(p.y), onComplete: () => r() }));
    }
    p.detener();
  }

  /** Pone una imagen (mueble o cosa) en el lugar; `solido` en píxeles desde la base. */
  colocar(id: string, textura: string, pos: Pos, solido = 0) {
    this.props.get(id)?.destroy();
    const im = this.add.image(pos.x, pos.y, textura).setOrigin(0.5, 1).setDepth(pos.y);
    if (solido > 0) this.bloquearRect(pos.x - im.width / 2 + 2, pos.y - solido, im.width - 4, solido - 1);
    this.props.set(id, im);
    return im;
  }
  quitar(id: string) { this.props.get(id)?.destroy(); this.props.delete(id); this.quitarInteraccion(id); }
  prop(id: string) { return this.props.get(id); }

  /** Algo con lo que se puede interactuar. `pos` puede seguir a un personaje. */
  interactuar(id: string, etiqueta: string, pos: Pos | (() => Pos), fn?: () => void, radio = 20) {
    this.interactivos.set(id, { pos: typeof pos === "function" ? pos : () => pos, etiqueta, fn, radio });
  }
  quitarInteraccion(id: string) { this.interactivos.delete(id); this.esperas.delete(id); }

  /** Espera a que el jugador use `id`. */
  esperar(id: string) { return new Promise<void>((r) => this.esperas.set(id, r)); }

  /** Espera a que el jugador llegue cerca de `pos`. */
  llegar(pos: Pos, radio = 24) { return new Promise<void>((r) => this.llegadas.push({ pos, radio, r })); }

  /** Espera a que el jugador entre a un lugar (cambio de mapa). */
  entrarA(mapa: NombreMapa) {
    return new Promise<void>((r) => {
      if (this.mapa === mapa) return r();
      const f = (m: NombreMapa) => { if (m === mapa) { this.events.off("lugar", f); r(); } };
      this.events.on("lugar", f);
    });
  }

  /** La flecha amarilla: sobre el objetivo, o en el borde de la pantalla si está lejos. */
  meta(pos: Pos | (() => Pos) | null) { this.metaPos = pos === null ? null : typeof pos === "function" ? pos : () => pos; }

  /** true: el jugador no se mueve (escena). */
  bloquear(si: boolean) { this.quieto = si; if (si) this.jugador?.detener(); }

  reloj(si: boolean) { this.relojOn = si; this.relojAcum = 0; }

  /** ¿Es de noche en la partida? (las ventanas se encienden y la luz cambia) */
  esNoche() { return !!estado && (estado.minuto >= 19 * 60 + 30 || estado.minuto < 6 * 60); }

  /**
   * Luz de la escena según la hora de la partida: mañana neutra, tarde dorada,
   * noche azul con las ventanas encendidas. Es una capa CSS sobre el lienzo
   * (#luz): barata incluso en máquinas lentas.
   */
  luz() {
    const m = estado?.minuto ?? 9 * 60;
    document.body.classList.toggle("noche", this.esNoche() && this.mapa === "ciudad");
    document.body.classList.toggle("tarde", !this.esNoche() && m >= 17 * 60 && this.mapa === "ciudad");
    document.body.classList.toggle("interior", this.mapa !== "ciudad");
  }

  estacion(cual: "primavera" | "otono") {
    this.estacionActual = cual;
    const volver = Object.fromEntries(Object.entries(ARBOLES_OTONO).map(([v, o]) => [o, Number(v)]));
    for (const a of this.arboles) {
      const f = Number(a.frame.name);
      if (cual === "otono" && f in ARBOLES_OTONO) a.setFrame(ARBOLES_OTONO[f]);
      if (cual === "primavera" && f in volver) a.setFrame(volver[f]);
    }
    this.particulas?.setTexture(cual === "otono" ? "hoja" : "petalo");
  }

  /** Nubes que pasan (sus sombras) y algún pájaro: la ciudad respira. */
  private vidaDelBarrio() {
    if (ajustes.menosMovimiento) return;
    const ancho = this.W * T, alto = this.H * T;
    for (let i = 0; i < 3; i++) {
      const n = this.add.image(-160 + i * (ancho / 2.5), 80 + i * 230, "nube-sombra").setDepth(4990).setScale(1.6 + i * 0.4);
      this.tweens.add({ targets: n, x: ancho + 180, duration: 70000 + i * 15000, delay: -i * 20000, repeat: -1, onRepeat: () => { n.x = -180; n.y = 60 + Math.random() * (alto - 120); } });
    }
    const vuelo = () => {
      if (!this.scene.isActive() || this.mapa !== "ciudad") return;
      const y = 40 + Math.random() * (alto * 0.6), izq = Math.random() < 0.5;
      for (let k = 0; k < 1 + Math.floor(Math.random() * 3); k++) {
        const p = this.add.sprite(izq ? -20 - k * 14 : ancho + 20 + k * 14, y + k * 8, "pajaro", 0).setDepth(5002).setFlipX(!izq).play("pajaro-vuela");
        this.tweens.add({ targets: p, x: izq ? ancho + 40 : -40, y: p.y - 30 + Math.random() * 60, duration: 9000 + Math.random() * 3000, onComplete: () => p.destroy() });
      }
      this.time.delayedCall(14000 + Math.random() * 14000, vuelo);
    };
    this.time.delayedCall(3000, vuelo);
  }

  /**
   * Viaje rápido: deja al jugador junto al objetivo (la flecha) y, si ahí hay una
   * puerta o algo que usar, lo usa. Para no caminar la ciudad entera por trámite.
   */
  viajar() {
    if (!this.metaPos || !this.jugador || this.quieto || ui.ocupado()) return;
    const p = this.metaPos(), j = this.jugador;
    const sitios = [[0, 14], [0, 20], [-14, 8], [14, 8], [0, -14], [-20, 0], [20, 0], [0, 28]];
    const s = sitios.find(([dx, dy]) => this.libre(p.x + dx, p.y + dy)) ?? [0, 14];
    sonido.efecto("puerta");
    const cam = this.cameras.main;
    cam.fadeOut(120, 20, 12, 18);
    cam.once("camerafadeoutcomplete", () => {
      j.setPosition(p.x + s[0], p.y + s[1]); j.setDepth(j.y);
      j.mirarHacia(p.x, p.y);
      cam.centerOn(j.x, j.y);
      cam.fadeIn(160, 20, 12, 18);
      // Si en el objetivo hay algo que usar (una puerta, una persona), se usa.
      let mejor: [string, Interactivo] | undefined, dmin = 26;
      for (const par of this.interactivos) { const q = par[1].pos(); const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < dmin) { dmin = d; mejor = par; } }
      if (mejor) {
        const [id, it] = mejor;
        this.time.delayedCall(200, () => {
          if (ui.ocupado() || this.quieto) return;
          const w = this.esperas.get(id);
          if (w) { this.esperas.delete(id); w(); } else it.fn?.();
        });
      }
    });
  }

  /** Escucha a la interfaz: quién habla (da un saltito) y cuándo se abre un hallazgo (acercamiento). */
  private escucharUi() {
    if (Mundo.escuchando) return;
    Mundo.escuchando = true;
    addEventListener("eva-habla", (ev) => {
      const a = (ev as CustomEvent).detail;
      if (!a) return;
      const quien = a === e().apariencia ? this.jugador : [...this.npcs.values()].find((n) => n.getData("apariencia") === a);
      if (!quien) return;
      this.tweens.killTweensOf(quien.cuerpo);
      quien.cuerpo.setScale(quien.cuerpo.scaleX, quien.cuerpo.scaleX);
      const s = quien.cuerpo.scaleX;
      this.tweens.add({ targets: quien.cuerpo, scaleY: { from: s * 0.86, to: s }, y: { from: -3, to: 1 }, duration: 220, ease: "Back.out" });
    });
    addEventListener("eva-hallazgo", (ev) => {
      if (ajustes.menosMovimiento) return;
      const cam = this.cameras.main;
      if ((ev as CustomEvent).detail) { this.zoomBase = cam.zoom; cam.zoomTo(this.zoomBase * 1.14, 420, "Sine.easeOut"); }
      else if (this.zoomBase) { cam.zoomTo(this.zoomBase, 280, "Sine.easeInOut"); this.zoomBase = 0; }
    });
  }

  /** Sacudida de cámara (nada si el jugador pidió menos movimiento). */
  sacudir(ms: number, fuerza: number) { if (!ajustes.menosMovimiento) this.cameras.main.shake(ms, fuerza); }

  /** Chispas doradas donde se usa algo: confirma la acción sin palabras. */
  chispas(p: Pos) {
    const fx = this.add.particles(p.x, p.y - 8, "petalo", { speed: { min: 20, max: 55 }, angle: { min: 200, max: 340 }, lifespan: 420, quantity: 8, scale: { start: 1.2, end: 0 }, tint: [0xffe39a, 0xf2b53c, 0xffffff], emitting: false }).setDepth(9100);
    fx.explode(8);
    this.time.delayedCall(600, () => fx.destroy());
  }

  /** De coordenadas del mundo a píxeles de la pantalla (para globos en HTML). */
  aPantalla(p: Pos) {
    const cam = this.cameras.main, v = cam.worldView;
    return { x: (p.x - v.x) * cam.zoom, y: (p.y - v.y) * cam.zoom };
  }

  /** Lluvia en la ciudad (y su recuerdo en los interiores: no llueve adentro). */
  lluvia(si: boolean) {
    this.lloviendo = si;
    document.body.classList.toggle("lluvia", si);
    this.lluviaFx?.destroy(); this.lluviaFx = undefined;
    if (!si || this.mapa !== "ciudad") return;
    this.particulas?.stop();
    this.lluviaFx = this.add.particles(0, 0, "gota", {
      x: { min: -40, max: this.W * T + 40 }, y: { min: -20, max: this.H * T }, lifespan: { min: 450, max: 900 },
      speedY: { min: 300, max: 360 }, speedX: { min: -60, max: -45 }, frequency: 6, quantity: 4, alpha: { start: 0.9, end: 0.5 }, rotate: 8,
    }).setDepth(5001);
  }

  /** Grietas en el muro de arriba de un interior: `n` en total (se agregan las que falten). */
  agrietar(n: number, animar = false) {
    const posiciones = [3, 11, 7, 13, 5, 1.6, 9.4, 12.2, 4.2, 10.4];
    while (this.grietas.length < Math.min(n, posiciones.length)) {
      const i = this.grietas.length;
      const x = Math.min(posiciones[i], this.W - 1.6) * T, y = (1.15 + (i % 3) * 0.25) * T;
      const im = this.add.image(x, y, `grieta-${i % 4}`).setOrigin(0.5, 0).setDepth(-17).setFlipX(i % 2 === 1);
      if (animar) {
        im.setCrop(0, 0, 16, 0);
        const o = { h: 0 };
        this.tweens.add({ targets: o, h: 24, duration: 450, ease: "Quad.out", onUpdate: () => im.setCrop(0, 0, 16, o.h) });
        this.sacudir(180, 0.006);
      }
      this.grietas.push(im);
    }
  }

  // ── Bucle ────────────────────────────────────────────────────────────────
  libre(px: number, py: number) {
    for (const [dx, dy] of [[-4, -3], [4, -3], [-4, 0], [4, 0]]) {
      if (this.bloqueo[Math.floor((py + dy) / T)]?.[Math.floor((px + dx) / T)] ?? true) return false;
    }
    for (const n of this.npcs.values()) if (Math.abs(n.x - px) < 9 && Math.abs(n.y - py) < 6) return false;
    return true;
  }

  private pintarMeta() {
    const borde = document.getElementById("meta-borde")!;
    if (!this.metaPos || !this.jugador) { this.flecha.setVisible(false); borde.hidden = true; return; }
    const p = this.metaPos();
    const cam = this.cameras.main;
    this.flecha.setPosition(p.x, p.y - 30).setVisible(true);
    const vista = cam.worldView;
    const dentro = p.x > vista.x + 8 && p.x < vista.right - 8 && p.y - 30 > vista.y + 8 && p.y < vista.bottom;
    borde.hidden = dentro;
    if (!dentro) {
      const cx = (p.x - vista.centerX) * cam.zoom, cy = (p.y - 16 - vista.centerY) * cam.zoom;
      const ang = Math.atan2(cy, cx);
      const w = innerWidth / 2 - 34, h = innerHeight / 2 - 60;
      const k = Math.min(Math.abs(w / Math.cos(ang)), Math.abs(h / Math.sin(ang)));
      borde.style.transform = `translate(${innerWidth / 2 + Math.cos(ang) * k - 18}px, ${innerHeight / 2 + Math.sin(ang) * k - 18}px) rotate(${ang}rad)`;
    }
  }

  update(_t: number, dt: number) {
    if (!this.jugador) return;
    this.pintarMeta();
    // «Ir ›»: aparece cuando el objetivo está lejos.
    this.botonIr ??= document.getElementById("objetivo-ir") as HTMLButtonElement;
    if (this.botonIr && !this.botonIr.onclick) {
      this.botonIr.onclick = (ev) => { ev.stopPropagation(); this.viajar(); };
      addEventListener("keydown", (ev) => { if (ev.code === "KeyF" && !this.botonIr!.hidden) this.viajar(); });
    }
    if (this.botonIr) {
      const p = this.metaPos?.();
      this.botonIr.hidden = !p || this.quieto || ui.ocupado() || Math.hypot(p.x - this.jugador.x, p.y - this.jugador.y) < 80;
    }
    if (ui.ocupado() || this.quieto) { this.jugador.detener(); ui.indicar(null); this.marca?.setVisible(false); this.quietoMs = 0; return; }
    const { dx, dy } = controles.direccion();
    if ((dx || dy) && this.alMoverse) { this.alMoverse(); this.alMoverse = undefined; }
    const corre = (dx || dy) && (ajustes.correrSiempre || controles.corriendo());
    this.jugador.mover(dx, dy, dt, (x, y) => this.libre(x, y), corre ? 1.7 : 1);
    if (corre) {
      this.polvo += dt;
      if (this.polvo > 110) { this.polvo = 0; const p = this.add.image(this.jugador.x + (Math.random() - 0.5) * 6, this.jugador.y, "sombra").setDepth(this.jugador.y - 1).setAlpha(0.7); this.tweens.add({ targets: p, alpha: 0, scale: 1.8, y: p.y - 3, duration: 380, onComplete: () => p.destroy() }); }
    }
    // En un interior, cruzar la puerta de abajo es salir a la ciudad.
    if (this.mapa !== "ciudad" && !this.saliendo && this.jugador.y > (this.H - 1) * T + 3) {
      if (this.puedeSalir) { this.saliendo = true; void this.irA("ciudad", `puerta-${this.mapa}`, "abajo"); }
      else { this.jugador.y = (this.H - 1) * T + 2; }
    }

    if (this.relojOn) {
      this.relojAcum += dt;
      if (this.relojAcum > 1500) { this.relojAcum = 0; e().minuto++; ui.hud({ hora: hora() }); }
    }
    for (const l of [...this.llegadas]) {
      if (Phaser.Math.Distance.Between(this.jugador.x, this.jugador.y, l.pos.x, l.pos.y) < l.radio) {
        this.llegadas.splice(this.llegadas.indexOf(l), 1);
        l.r();
      }
    }
    const delante = this.jugador.puntoDelante(10);
    let mejor: [string, Interactivo] | undefined, dmin = Infinity;
    for (const par of this.interactivos) {
      const p = par[1].pos();
      const d = Phaser.Math.Distance.Between(delante.x, delante.y, p.x, p.y - 4);
      if (d < par[1].radio && d < dmin) { mejor = par; dmin = d; }
    }
    ui.indicar(mejor ? mejor[1].etiqueta : null);
    // La marca flota sobre lo que se puede usar.
    if (mejor && this.marca) {
      const p = mejor[1].pos(), n = this.npcs.get(mejor[0]);
      this.marca.setVisible(true).setPosition(p.x, (n ? n.y - 26 : p.y - 18) + Math.sin(this.time.now / 160) * 1.5);
    } else this.marca?.setVisible(false);
    // Si te quedas quieto en la ciudad, tu personaje piensa algo.
    if (dx || dy || this.mapa !== "ciudad") this.quietoMs = 0;
    else if ((this.quietoMs += dt) > 9000) {
      this.quietoMs = -20000;
      const lista = PENSAMIENTOS[e().jornada] ?? PENSAMIENTOS[1];
      const p = this.aPantalla({ x: this.jugador.x, y: this.jugador.y - 30 });
      ui.pensar(lista[Math.floor(Math.random() * lista.length)], p.x, p.y);
    }
    if (mejor && controles.accionPulsada()) {
      const [id, it] = mejor;
      const n = this.npcs.get(id);
      if (n) n.mirarHacia(this.jugador.x, this.jugador.y);
      this.jugador.mirarHacia(it.pos().x, it.pos().y);
      this.chispas(it.pos());
      const w = this.esperas.get(id);
      if (w) { this.esperas.delete(id); w(); } else it.fn?.();
    }
  }
}
