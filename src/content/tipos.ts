// Tipos del banco de contenido de POTESTAS. Un archivo por módulo en
// src/content/banco/. Cada ítem lleva el módulo, la norma en que se apoya y
// la fuente (de qué repo de apuntes salió) para poder rastrearlo.

/** De qué repo de apuntes salió el ítem (o "nuevo" si se escribió para el juego). */
export type Fuente = "acto-admin" | "procedimiento-admin" | "guia-rpe" | "iuspublic" | "sancionador" | "proceadmin" | "nuevo";
export type Prioridad = "S" | "A" | "B" | "C";

/** Tarjeta de estudio (coleccionable en el expediente; alimenta el repaso). */
export type Ficha = {
  id: string; modulo: number;
  frente: string; dorso: string;
  norma?: string; etiqueta?: string; prioridad?: Prioridad; fuente: Fuente;
};

/** Pregunta de alternativas (3 o 4 opciones). */
export type PreguntaQuiz = {
  id: string; modulo: number;
  texto: string; opciones: string[]; correcta: number;
  porque: string; norma?: string; fuente: Fuente;
};

/** Afirmación de verdadero o falso (Apuesta EVA, «¿Lo pillaste?», desafío). Va ligada a un hallazgo. */
export type Afirmacion = { id: string; modulo: number; hallazgo: string; texto: string; verdad: boolean; porque: string };

/** Examen oral: la respuesta modelo se arma eligiendo ideas (claves) y evitando trampas. */
export type Oral = {
  id: string; modulo: number;
  pregunta: string; profesor?: string;
  claves: string[]; trampas: string[];
  modelo: string; repregunta?: string; prioridad?: Prioridad; fuente: Fuente;
};

/** Clasificar afirmaciones en dos columnas. */
export type Columnas = {
  id: string; modulo: number; titulo: string;
  izq: string; der: string;
  items: { texto: string; lado: 0 | 1; porque?: string }[];
  norma?: string; fuente: Fuente;
};

/** Ordenar pasos (una cadena). `pasos` va en el orden correcto. */
export type Cadena = { id: string; modulo: number; titulo: string; pasos: string[]; nota?: string; norma?: string; fuente: Fuente };

/** Un sello que se puede poner en la Mesa. */
export type Sello = { texto: string; correcto: boolean; porque: string };
/** Un expediente de la Mesa: un documento con un problema (o sin él) y los sellos posibles. */
export type Expediente = {
  id: string; modulo: number;
  titulo: string;
  /** Quién lo trae y qué pasa (1–2 frases). */
  relato: string;
  documento: { tipo: string; campos: { k: string; v: string }[] };
  pregunta: string;
  /**
   * Dónde está el problema: la `k` del campo del documento que lo muestra, o `null`
   * si el documento está en orden. La Mesa lo usa en el paso «¿Dónde está el
   * problema?»; si falta (undefined), ese paso se salta.
   */
  vicio?: string | null;
  sellos: Sello[];
  norma: string; fuente: Fuente;
  /** Qué hallazgo se descubre al resolverlo bien (opcional). */
  hallazgo?: string;
};

/** Hallazgo jurídico: lo que se descubre jugando (medallita → expediente). */
export type Hallazgo = {
  id: string; modulo: number;
  titulo: string;
  /** 1–3 frases, en voz de EVA (ver docs/CONTENT_GUIDE del repo principal): directa, sin jerga innecesaria. */
  texto: string;
  norma: string;
  /** «EVA, en simple»: una frase corta, con humor, que lo resume. */
  simple: string;
};

/** Calendario: contar un plazo de días hábiles y tocar el día en que vence. */
export type Plazo = {
  id: string; modulo: number; titulo: string;
  /** Qué pasó y qué plazo corre (1–2 frases). */
  relato: string;
  /** Mes que muestra el calendario (`mes` de 0 a 11). */
  anio: number; mes: number;
  /** Día del mes en que se notificó (el plazo corre desde el día siguiente). */
  inicio: number;
  /** Feriados de ese mes (además de sábados y domingos). */
  feriados: { dia: number; nombre: string }[];
  /** Largo del plazo, en días hábiles. */
  dias: number;
  /** Respuesta: día del mes en que vence. */
  vence: number;
  porque: string; norma: string; fuente: Fuente;
};

/** Armar un acto: poner cada trozo en su parte del documento y descartar los que sobran. */
export type Armado = {
  id: string; modulo: number; titulo: string;
  /** Encabezado del documento, p. ej. «Decreto Alcaldicio N.º 1.913». */
  tipo: string;
  relato: string;
  /** Las partes en orden, con el trozo correcto de cada una. */
  partes: { parte: string; texto: string; porque: string }[];
  /** Trozos que no van en este acto y por qué. */
  sobran: { texto: string; porque: string }[];
  norma: string; fuente: Fuente;
};

/** El banco de un módulo. */
export type BancoModulo = {
  modulo: number;
  hallazgos: Hallazgo[];
  afirmaciones: Afirmacion[];
  fichas: Ficha[];
  quiz: PreguntaQuiz[];
  orales: Oral[];
  columnas: Columnas[];
  cadenas: Cadena[];
  expedientes: Expediente[];
  /** Modalidades extra (opcionales): calendario de plazos, armar el acto, cinta contrarreloj. */
  plazos?: Plazo[];
  armados?: Armado[];
  cintas?: Columnas[];
};
