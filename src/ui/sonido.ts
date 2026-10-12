// Audio con Howler: se encarga de desbloquear el sonido en el celular (necesita
// un toque), de los fundidos de la música y de variar el tono de las voces.
// Los archivos salen de tools/sintetizar-sonidos.mjs.
import { Howl, Howler } from "howler";

type Efecto = "elegir" | "mover" | "pagar" | "cobrar" | "telefono" | "objetivo" | "eva" | "hallazgo" | "tiempo" | "papel" | "puerta" | "corazon" | "golpe" | "grieta" | "campana" | "escuchar" | "latido" | "tijera" | "llanto" | "pujar";
const EFECTOS: Efecto[] = ["elegir", "mover", "pagar", "cobrar", "telefono", "objetivo", "eva", "hallazgo", "tiempo", "papel", "puerta", "corazon", "golpe", "grieta", "campana", "escuchar", "latido", "tijera", "llanto", "pujar"];

const ruta = (n: string) => `assets/audio/${n}.mp3`;
const sonidos = new Map<string, Howl>();
let musica: Howl | null = null;
let ultimoBlip = 0;
let silencio = false;
try { silencio = localStorage.getItem("eva-potestas:silencio") === "1"; } catch { /* nada */ }
Howler.mute(silencio);

function cargar(n: string, vol: number) {
  if (!sonidos.has(n)) sonidos.set(n, new Howl({ src: [ruta(n)], volume: vol, preload: true }));
  return sonidos.get(n)!;
}

export const sonido = {
  precargar() {
    for (const e of EFECTOS) cargar(e, 0.7);
    cargar("voz", 0.35); cargar("voz-eva", 0.3);
  },
  efecto(e: Efecto) { cargar(e, 0.7).play(); },
  blip(tipo: "voz" | "eva") {
    const ahora = performance.now();
    if (ahora - ultimoBlip < 45) return;
    ultimoBlip = ahora;
    const s = cargar(tipo === "eva" ? "voz-eva" : "voz", 0.35);
    const id = s.play();
    s.rate(0.9 + Math.random() * 0.25, id);
  },
  musica(n: string | null) {
    if (musica) { const m = musica; m.fade(m.volume(), 0, 600); setTimeout(() => m.unload(), 650); musica = null; }
    if (!n) return;
    musica = new Howl({ src: [ruta(n)], loop: true, volume: 0, html5: false });
    musica.play();
    musica.fade(0, 0.45, 1200);
  },
  /** Baja la música mientras EVA habla o durante un momento serio. */
  atenuar(si: boolean) { musica?.fade(musica.volume(), si ? 0.12 : 0.45, 400); },
  alternarSilencio() {
    silencio = !silencio;
    Howler.mute(silencio);
    try { localStorage.setItem("eva-potestas:silencio", silencio ? "1" : "0"); } catch { /* nada */ }
    return silencio;
  },
  get silenciado() { return silencio; },
};
