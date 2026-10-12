// Logros: pequeños reconocimientos que aparecen como aviso y quedan en el
// expediente. Premian explorar, resolver y aprender.
export type Logro = { id: string; titulo: string; texto: string; icono: string };

export const LOGROS: Logro[] = [
  { id: "primer-hallazgo", titulo: "Primera pista", texto: "Descubriste tu primer hallazgo jurídico.", icono: "🔍" },
  { id: "primer-sello", titulo: "Primer timbre", texto: "Resolviste tu primer expediente en la Mesa.", icono: "📮" },
  { id: "racha-mesa", titulo: "Mano firme", texto: "Cinco expedientes seguidos bien timbrados.", icono: "🔥" },
  { id: "sin-vicios", titulo: "Ojo clínico", texto: "Una Mesa completa sin errores.", icono: "👁️" },
  { id: "buen-ojo", titulo: "Buen ojo", texto: "Acertaste tres apuestas de EVA seguidas.", icono: "🎯" },
  { id: "cadena", titulo: "Paso a paso", texto: "Ordenaste una cadena completa a la primera.", icono: "🔗" },
  { id: "columnas", titulo: "Cada cosa en su lugar", texto: "Clasificaste todo sin equivocarte.", icono: "🗂️" },
  { id: "duelo", titulo: "Convicción", texto: "Ganaste un duelo de argumentos.", icono: "⚔️" },
  { id: "duelo-limpio", titulo: "Sin fisuras", texto: "Ganaste un duelo sin perder convicción.", icono: "🛡️" },
  { id: "comision", titulo: "Aprobado con distinción", texto: "Respondiste una pregunta oral con todas las claves.", icono: "🎓" },
  { id: "repaso-perfecto", titulo: "Cinco de cinco", texto: "Un desafío de repaso sin errores.", icono: "⭐" },
  { id: "racha-5", titulo: "En racha", texto: "Cinco respuestas correctas seguidas.", icono: "🔥" },
  { id: "coleccionista", titulo: "Coleccionista", texto: "Veinte fichas de estudio en el expediente.", icono: "🃏" },
  { id: "biblioteca", titulo: "Biblioteca", texto: "Cien fichas de estudio.", icono: "📚" },
  { id: "vecinos", titulo: "Buen vecino", texto: "Hablaste con todos los vecinos de la plaza.", icono: "🏘️" },
  { id: "madrugador", titulo: "Antes que el Contralor", texto: "Terminaste una jornada antes de las 12.", icono: "⏰" },
  { id: "tres-estrellas", titulo: "Tres estrellas", texto: "Una jornada con todo bien.", icono: "🌟" },
  { id: "mitad", titulo: "Media carrera", texto: "Seis jornadas terminadas.", icono: "🏛️" },
  { id: "fin", titulo: "El poder tiene límites", texto: "Terminaste las doce jornadas.", icono: "🎬" },
  { id: "expediente-completo", titulo: "Expediente completo", texto: "Descubriste todos los hallazgos.", icono: "📁" },
];
