// Las doce jornadas de POTESTAS, en orden pedagógico. `lugar` es el id del
// edificio de la ciudad donde se juega (src/game/maps/ciudad.ts).
export type Modulo = { n: number; id: string; titulo: string; lema: string; lugar: string; color: string; normas: string[] };

export const MODULOS: Modulo[] = [
  { n: 1, id: "bases", titulo: "El primer día", lema: "El Estado sólo puede lo que la ley le permite.", lugar: "municipalidad", color: "#4f86c6", normas: ["Arts. 6 y 7 CPR", "Ley 18.575", "Ley 18.695"] },
  { n: 2, id: "acto", titulo: "La fábrica de actos", lema: "Órgano, investidura, competencia; motivo, objeto, fin.", lugar: "partes", color: "#f0b44c", normas: ["Art. 3 Ley 19.880", "Art. 7 CPR"] },
  { n: 3, id: "vicios", titulo: "La autopsia", lema: "Todo acto nace con presunción de legalidad. Hasta que lo abres.", lugar: "juridica", color: "#e2725b", normas: ["Arts. 51, 52, 53, 61 Ley 19.880"] },
  { n: 4, id: "procedimiento", titulo: "La fila", lema: "Doce principios para que la fila avance.", lugar: "atencion", color: "#5fa37a", normas: ["Arts. 4 a 41 Ley 19.880"] },
  { n: 5, id: "plazos", titulo: "El reloj", lema: "Los plazos corren para todos. Casi.", lugar: "partes", color: "#9a6fc4", normas: ["Arts. 25, 45 a 47, 64 a 66 Ley 19.880"] },
  { n: 6, id: "sancionador", titulo: "La multa", lema: "Sancionar también tiene reglas.", lugar: "fiscalizacion", color: "#d46a9b", normas: ["Art. 19 N.º 3 CPR", "Ley 19.880"] },
  { n: 7, id: "contraloria", titulo: "Contraloría", lema: "Quien controla al que manda.", lugar: "contraloria", color: "#3f6b5a", normas: ["Arts. 98 y 99 CPR", "Ley 10.336", "Arts. 59 y 60 Ley 19.880"] },
  { n: 8, id: "contencioso", titulo: "Tribunales", lema: "Cuando la Administración no escucha, se le demanda.", lugar: "corte", color: "#7d7a8c", normas: ["Art. 20 CPR", "Art. 151 Ley 18.695", "Art. 38 CPR"] },
  { n: 9, id: "responsabilidad", titulo: "El hoyo en la vereda", lema: "El Estado también paga.", lugar: "juzgado", color: "#a8553c", normas: ["Art. 38 inc. 2 CPR", "Arts. 4 y 42 Ley 18.575", "Art. 152 Ley 18.695"] },
  { n: 10, id: "nulidad", titulo: "Nulo de pleno derecho", lema: "Invalidar no es lo mismo que anular.", lugar: "juridica", color: "#c0563f", normas: ["Art. 7 inc. 3 CPR", "Art. 53 Ley 19.880"] },
  { n: 11, id: "tc", titulo: "El Tribunal Constitucional", lema: "Hasta la ley tiene un juez.", lugar: "tc", color: "#2a8cff", normas: ["Arts. 6, 93 CPR"] },
  { n: 12, id: "expropiacion", titulo: "La franja", lema: "Tu casa, el bien común y un cheque.", lugar: "franja", color: "#b9a58c", normas: ["Art. 19 N.º 24 CPR", "DL 2.186"] },
];

export const modulo = (n: number) => MODULOS.find((m) => m.n === n)!;
