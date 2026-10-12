// Ajustes de accesibilidad y ritmo: se guardan en el navegador y valen para
// todas las partidas. Por defecto el juego va rápido (el encargo: más fluido).
export type Ajustes = {
  /** Cuán rápido se escriben los diálogos. */
  texto: "normal" | "rapida" | "instantanea";
  letraGrande: boolean;
  contraste: boolean;
  menosMovimiento: boolean;
  /** Minijuegos más amables: reproches lentos, más tiempo en las tareas, desafíos sin reloj. */
  modoHistoria: boolean;
  correrSiempre: boolean;
  /** Hallazgos en tarjeta completa (pausa el juego) en vez de la medallita que no frena. */
  hallazgoCompleto: boolean;
};

const CLAVE = "eva-potestas:ajustes";
const BASE: Ajustes = { texto: "rapida", letraGrande: false, contraste: false, menosMovimiento: false, modoHistoria: false, correrSiempre: false, hallazgoCompleto: false };

function leer(): Ajustes {
  try { return { ...BASE, ...JSON.parse(localStorage.getItem(CLAVE) ?? "{}") }; } catch { return { ...BASE }; }
}

export const ajustes: Ajustes = leer();
if (matchMedia("(prefers-reduced-motion: reduce)").matches && localStorage.getItem(CLAVE) === null) ajustes.menosMovimiento = true;

export function guardarAjustes() {
  try { localStorage.setItem(CLAVE, JSON.stringify(ajustes)); } catch { /* sin almacenamiento */ }
  aplicarAjustes();
}

export function aplicarAjustes() {
  const b = document.body.classList;
  b.toggle("letra-grande", ajustes.letraGrande);
  b.toggle("contraste", ajustes.contraste);
  b.toggle("menos-movimiento", ajustes.menosMovimiento);
}

/** Letras por segundo de los diálogos. */
export const letrasPorSegundo = () => ({ normal: 60, rapida: 120, instantanea: Infinity }[ajustes.texto]);
/** Multiplicador de las pausas (carteles de tiempo, teléfono): más corto si el texto va rápido. */
export const pausa = () => ({ normal: 1, rapida: 0.75, instantanea: 0.55 }[ajustes.texto]);
/** Los minijuegos con reloj dan más tiempo en modo historia. */
export const holgura = () => (ajustes.modoHistoria ? 1.6 : 1);
