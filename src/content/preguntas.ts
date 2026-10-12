// Afirmaciones de verdadero o falso (dos por hallazgo): «¿Lo pillaste?», Dato
// EVA y el desafío de repaso. Salen del banco de cada módulo.
import { BANCOS } from "./banco";
import type { Afirmacion } from "./tipos";

export type Pregunta = Afirmacion;

export const PREGUNTAS: Pregunta[] = BANCOS.flatMap((b) => b.afirmaciones);
