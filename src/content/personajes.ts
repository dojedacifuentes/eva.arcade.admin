// Quiénes viven en Ciudad Potestas. Mismo molde que el jugador: elegir colores,
// no dibujar. El jugador y los abogados visten traje (polera oscura).
import type { Apariencia } from "../game/art/characters";

export type Personaje = { id: string; nombre: string; cargo: string; a: Apariencia };

export const ALCALDESA: Personaje = { id: "alcaldesa", nombre: "Ruperta Cañas", cargo: "Alcaldesa", a: { piel: "#eab68f", pelo: "#9a4a2c", peinado: "mono", polera: "#d24e4e", pantalon: "#2b2026" } };
export const DIRECTOR: Personaje = { id: "director", nombre: "Don Aurelio", cargo: "Director Jurídico", a: { piel: "#c98d63", pelo: "#b9b1ad", peinado: "corto", polera: "#3b3f4f", pantalon: "#2b2026" } };
export const PARTES: Personaje = { id: "partes", nombre: "Marisol", cargo: "Oficina de Partes", a: { piel: "#f7d7bd", pelo: "#2b2026", peinado: "largo", polera: "#4f86c6", pantalon: "#3b3f4f" } };
export const OBRAS: Personaje = { id: "obras", nombre: "Ingeniero Pavez", cargo: "Director de Obras", a: { piel: "#94603f", pelo: "#2b2026", peinado: "corto", polera: "#f0b44c", pantalon: "#3b3f4f" } };
export const FISCAL: Personaje = { id: "fiscal", nombre: "Inspectora Lagos", cargo: "Fiscalizadora", a: { piel: "#c98d63", pelo: "#5c3423", peinado: "corto", polera: "#5fa37a", pantalon: "#2b2026" } };
export const CONTRALOR: Personaje = { id: "contralor", nombre: "Contralor Regional Ossandón", cargo: "Contraloría", a: { piel: "#f7d7bd", pelo: "#b9b1ad", peinado: "corto", polera: "#3d4a7a", pantalon: "#2b2026" } };
export const JUEZA: Personaje = { id: "jueza", nombre: "Jueza Ibáñez", cargo: "Juzgado Civil", a: { piel: "#94603f", pelo: "#2b2026", peinado: "mono", polera: "#2b2026", pantalon: "#2b2026" } };
export const MINISTRA: Personaje = { id: "ministra", nombre: "Ministra Fuenzalida", cargo: "Corte de Apelaciones", a: { piel: "#eab68f", pelo: "#d9a94f", peinado: "largo", polera: "#2b2026", pantalon: "#2b2026" } };
export const MINISTRO_TC: Personaje = { id: "ministro-tc", nombre: "Ministro Saavedra", cargo: "Tribunal Constitucional", a: { piel: "#5f3b27", pelo: "#2b2026", peinado: "corto", polera: "#2b2026", pantalon: "#2b2026" } };
export const CDE: Personaje = { id: "cde", nombre: "Abogado Quiroga", cargo: "Consejo de Defensa del Estado", a: { piel: "#f7d7bd", pelo: "#2b2026", peinado: "corto", polera: "#3b3f4f", pantalon: "#2b2026" } };
export const ROSA: Personaje = { id: "rosa", nombre: "Doña Rosa", cargo: "Vecina", a: { piel: "#eab68f", pelo: "#d9d3c7", peinado: "rizado", polera: "#d46a9b", pantalon: "#5c3423" } };
export const VECINO: Personaje = { id: "vecino", nombre: "Don Lucho", cargo: "Vecino", a: { piel: "#c98d63", pelo: "#3d4a7a", peinado: "corto", polera: "#e8e1d4", pantalon: "#3b3f4f" } };
export const JOVEN: Personaje = { id: "joven", nombre: "Benja", cargo: "Vecino", a: { piel: "#f7d7bd", pelo: "#9a4a2c", peinado: "rizado", polera: "#d24e4e", pantalon: "#4f86c6" } };
export const ABOGADA: Personaje = { id: "abogada", nombre: "Abogada Riquelme", cargo: "Abogada de los vecinos", a: { piel: "#94603f", pelo: "#2b2026", peinado: "largo", polera: "#3b3f4f", pantalon: "#2b2026" } };

export const PERSONAJES: Personaje[] = [ALCALDESA, DIRECTOR, PARTES, OBRAS, FISCAL, CONTRALOR, JUEZA, MINISTRA, MINISTRO_TC, CDE, ROSA, VECINO, JOVEN, ABOGADA];
