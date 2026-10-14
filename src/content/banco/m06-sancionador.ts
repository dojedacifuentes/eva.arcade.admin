// Módulo 6 · La multa: policía u ordenación y potestad sancionadora.
// Fuente principal: derecho-sancionador-admin (MODULES M8 y M9, FLASHCARDS de
// Sanción/Policía/Control, QUIZ, ORAL y COMPS «Sanción vs. medida correctiva»);
// se completa con la Constitución (art. 19 N.º 3), la Ley 19.880 (arts. 10, 11,
// 17, 41), la Ley 18.695 (art. 12) y el Estatuto Administrativo (arts. 121, 140 y
// 158 Ley 18.834). Verificado contra cpr.xml, l19880.xml, locmun.xml y l18834.xml
// de la BCN el 12-10-2026. Lo que es doctrina o jurisprudencia sin rol se marca.
import type { BancoModulo } from "../tipos";

export const BANCO_M06: BancoModulo = {
  modulo: 6,

  hallazgos: [
    {
      id: "m06-ley-habilita", modulo: 6,
      titulo: "Sin ley no hay multa",
      texto: "La potestad sancionadora es el poder que la ley da a un órgano administrativo para imponer consecuencias desfavorables por infracciones. Necesita órgano competente, potestad atribuida por ley e infracción previamente descrita: la Constitución prohíbe castigar conductas que la ley no describe expresamente.",
      norma: "Art. 19 N.º 3 CPR; arts. 6 y 7 CPR",
      simple: "La Administración puede castigar, pero no inventar el castigo. Eso lo hace el Congreso.",
    },
    {
      id: "m06-multa-ordenanza", modulo: 6,
      titulo: "La multa de la ordenanza la cobra el juez",
      texto: "Las ordenanzas municipales pueden fijar multas para los infractores, pero con tope de cinco unidades tributarias mensuales y las aplican los juzgados de policía local, no la Municipalidad.",
      norma: "Art. 12 Ley 18.695",
      simple: "La Municipalidad escribe la regla; la multa la pone un juez. Separación de poderes, versión comunal.",
    },
    {
      id: "m06-audiencia", modulo: 6,
      titulo: "Primero los cargos, después la sanción",
      texto: "El procedimiento racional y justo también rige en sede administrativa: antes de sancionar hay que comunicar los hechos y cargos, dejar alegar y aportar documentos, permitir prueba y decidir con imparcialidad. Sancionar sin oír es indefensión.",
      norma: "Art. 19 N.º 3 inc. 6 CPR; arts. 10, 11 y 17 Ley 19.880",
      simple: "Antes de multar hay que escuchar. No por cortesía: por la Constitución.",
    },
    {
      id: "m06-motivacion", modulo: 6,
      titulo: "Una sanción se explica",
      texto: "Los actos que limitan, restringen, privan o perturban derechos deben expresar siempre los hechos y los fundamentos de derecho. Una sanción sin hechos acreditados, sin norma infringida y sin calificación no es una decisión: es un número.",
      norma: "Art. 11 inc. 2 y art. 41 Ley 19.880",
      simple: "«Multa por infracción» no es motivación: es un título. Falta la película.",
    },
    {
      id: "m06-sancion-vs-medida", modulo: 6,
      titulo: "Castigar no es lo mismo que corregir",
      texto: "La sanción reprocha una infracción imputable y exige las máximas garantías. La medida correctiva restablece la legalidad o previene un riesgo: una orden de subsanar o una clausura preventiva. Una clausura puede ser una u otra según su régimen legal; hay que clasificarla antes de discutir su validez.",
      norma: "Doctrina (apuntes de derecho sancionador); arts. 10 y 11 Ley 19.880",
      simple: "Cerrar un local para que no se incendie no es castigarlo. Cerrarlo porque se portó mal, sí. Mismo candado, distinto Derecho.",
    },
    {
      id: "m06-non-bis", modulo: 6,
      titulo: "Una vez por hecho",
      texto: "No se puede sancionar dos veces el mismo hecho con el mismo fundamento (non bis in idem). Otra cosa es que un mismo hecho genere responsabilidad disciplinaria y además civil o penal: la sanción administrativa del funcionario es independiente de ésas.",
      norma: "Art. 19 N.º 3 CPR (doctrina); art. 120 Ley 18.834",
      simple: "Repetir la multa «por si la primera fue poca» no es rigor: es ilegal.",
    },
    {
      id: "m06-cargos-y-tiempo", modulo: 6,
      titulo: "Sólo por lo que se acusó, y a tiempo",
      texto: "En el sumario, nadie puede ser sancionado por hechos que no fueron materia de cargos, y toda medida disciplinaria se notifica. La acción disciplinaria prescribe en cuatro años. Y la jurisprudencia ha declarado el decaimiento de procedimientos sancionadores por dilaciones extremas e injustificadas.",
      norma: "Arts. 140 y 158 Ley 18.834; decaimiento: jurisprudencia de la Corte Suprema (doctrina)",
      simple: "La Administración también tiene fecha de vencimiento para castigar. Y no puede cambiar la acusación en el último minuto.",
    },
  ],

  afirmaciones: [
    { id: "m06-af-01", modulo: 6, hallazgo: "m06-ley-habilita", texto: "Un órgano administrativo sólo puede sancionar si una ley le atribuye esa potestad y describe la infracción.", verdad: true, porque: "Legalidad y tipicidad: los órganos actúan dentro de su competencia y en la forma que prescribe la ley; ninguna conducta se castiga sin estar expresamente descrita (arts. 7 y 19 N.º 3 CPR)." },
    { id: "m06-af-02", modulo: 6, hallazgo: "m06-ley-habilita", texto: "Basta el interés público para que la Municipalidad cree una nueva sanción por decreto.", verdad: false, porque: "La potestad sancionadora y la infracción necesitan fundamento legal; el interés público no reemplaza a la ley (arts. 6, 7 y 19 N.º 3 CPR)." },
    { id: "m06-af-03", modulo: 6, hallazgo: "m06-multa-ordenanza", texto: "Las multas de las ordenanzas municipales tienen un tope de cinco UTM.", verdad: true, porque: "Su monto no excederá de cinco unidades tributarias mensuales (art. 12 Ley 18.695)." },
    { id: "m06-af-04", modulo: 6, hallazgo: "m06-multa-ordenanza", texto: "La Dirección de Fiscalización aplica directamente las multas de la ordenanza.", verdad: false, porque: "Las aplican los juzgados de policía local correspondientes (art. 12 Ley 18.695)." },
    { id: "m06-af-05", modulo: 6, hallazgo: "m06-audiencia", texto: "La garantía de un procedimiento racional y justo también se aplica a los procedimientos administrativos sancionadores.", verdad: true, porque: "El legislador debe establecer siempre las garantías de un procedimiento racional y justo (art. 19 N.º 3 CPR); los interesados pueden alegar y aportar documentos en cualquier momento (art. 10 Ley 19.880)." },
    { id: "m06-af-06", modulo: 6, hallazgo: "m06-audiencia", texto: "Si la multa es baja, se puede aplicar sin oír al afectado.", verdad: false, porque: "La contradictoriedad y la defensa no dependen del monto; omitirlas produce indefensión (art. 10 Ley 19.880; art. 19 N.º 3 CPR)." },
    { id: "m06-af-07", modulo: 6, hallazgo: "m06-motivacion", texto: "Una resolución que impone una sanción debe expresar los hechos y los fundamentos de derecho.", verdad: true, porque: "Siempre deben expresarse en los actos que afecten derechos de los particulares (art. 11 inc. 2 Ley 19.880)." },
    { id: "m06-af-08", modulo: 6, hallazgo: "m06-motivacion", texto: "Basta citar el número de la norma infringida para que la sanción esté motivada.", verdad: false, porque: "La motivación exige hechos acreditados, norma infringida, calificación y sanción aplicada; la decisión será fundada (arts. 11 y 41 Ley 19.880)." },
    { id: "m06-af-09", modulo: 6, hallazgo: "m06-sancion-vs-medida", texto: "Una clausura preventiva para evitar un riesgo es una medida correctiva, no una sanción.", verdad: true, porque: "La medida correctiva restablece la legalidad o previene un riesgo; la sanción reprocha una infracción (doctrina de los apuntes de derecho sancionador)." },
    { id: "m06-af-10", modulo: 6, hallazgo: "m06-sancion-vs-medida", texto: "Toda clausura es siempre una sanción administrativa.", verdad: false, porque: "Depende de su régimen: puede ser medida correctiva, cautelar o sanción; hay que clasificarla antes de discutir su validez (doctrina)." },
    { id: "m06-af-11", modulo: 6, hallazgo: "m06-non-bis", texto: "La sanción disciplinaria de un funcionario es independiente de su responsabilidad civil y penal.", verdad: true, porque: "La absolución o el sobreseimiento penal no excluyen la medida disciplinaria por los mismos hechos, salvo la regla especial de la destitución (art. 120 Ley 18.834)." },
    { id: "m06-af-12", modulo: 6, hallazgo: "m06-non-bis", texto: "Se puede imponer una segunda multa administrativa por el mismo hecho y con el mismo fundamento si la primera resultó insuficiente.", verdad: false, porque: "Non bis in idem: un mismo hecho, con el mismo fundamento, no se sanciona dos veces (art. 19 N.º 3 CPR, doctrina)." },
    { id: "m06-af-13", modulo: 6, hallazgo: "m06-cargos-y-tiempo", texto: "Ningún funcionario puede ser sancionado por hechos que no fueron materia de cargos.", verdad: true, porque: "Lo dice expresamente el art. 140 Ley 18.834." },
    { id: "m06-af-14", modulo: 6, hallazgo: "m06-cargos-y-tiempo", texto: "La acción disciplinaria contra un funcionario no prescribe nunca.", verdad: false, porque: "Prescribe en cuatro años desde la acción u omisión; si hay delito, junto con la acción penal (art. 158 Ley 18.834)." },
  ],

  fichas: [
    { id: "m06-f-01", modulo: 6, frente: "Actividad de policía u ordenación", dorso: "Limitación de la libertad o la propiedad para proteger el orden público en sentido amplio: habilitar, condicionar, vigilar, inspeccionar y corregir conductas privadas.", etiqueta: "Policía", prioridad: "S", fuente: "sancionador" },
    { id: "m06-f-02", modulo: 6, frente: "Orden público «amplio»", dorso: "No sólo seguridad: salubridad, urbanismo, medio ambiente, mercados, consumo, transporte y otros sectores regulados.", etiqueta: "Policía", prioridad: "A", fuente: "sancionador" },
    { id: "m06-f-03", modulo: 6, frente: "Instrumentos preventivos de policía", dorso: "Autorizaciones, permisos, registros, licencias y fiscalización previa.", etiqueta: "Policía", prioridad: "A", fuente: "sancionador" },
    { id: "m06-f-04", modulo: 6, frente: "Instrumentos correctivos de policía", dorso: "Órdenes, instrucciones, medidas provisionales, clausuras o suspensiones: restablecen la legalidad o previenen un riesgo.", etiqueta: "Policía", prioridad: "A", fuente: "sancionador" },
    { id: "m06-f-05", modulo: 6, frente: "Instrumentos represivos de policía", dorso: "Sanciones administrativas por infracciones: multa, revocación-sanción, amonestación.", etiqueta: "Policía", prioridad: "A", fuente: "sancionador" },
    { id: "m06-f-06", modulo: 6, frente: "Límites de la actividad de policía", dorso: "Legalidad, competencia, finalidad de orden público sectorial, proporcionalidad (idónea, necesaria, equilibrada), motivación, igualdad y no arbitrariedad, procedimiento cuando afecta derechos.", etiqueta: "Policía", prioridad: "S", fuente: "sancionador" },
    { id: "m06-f-07", modulo: 6, frente: "Inspección", dorso: "Actividad material de verificación de hechos; puede preceder a actos formales o sanciones, y sigue sometida al Derecho.", etiqueta: "Policía", prioridad: "B", fuente: "sancionador" },
    { id: "m06-f-08", modulo: 6, frente: "Potestad sancionadora", dorso: "Poder atribuido por ley a órganos administrativos para imponer consecuencias desfavorables frente a infracciones administrativas.", norma: "Arts. 6, 7 y 19 N.º 3 CPR", etiqueta: "Sanción", prioridad: "S", fuente: "sancionador" },
    { id: "m06-f-09", modulo: 6, frente: "Legalidad sancionadora", dorso: "La potestad y la infracción deben tener fundamento en una norma de rango legal; el interés público no reemplaza a la ley.", norma: "Art. 19 N.º 3 CPR", etiqueta: "Sanción", prioridad: "S", fuente: "sancionador" },
    { id: "m06-f-10", modulo: 6, frente: "Tipicidad", dorso: "La conducta sancionada debe encajar en una infracción previamente definida con suficiente determinación: «ninguna ley podrá establecer penas sin que la conducta que se sanciona esté expresamente descrita en ella».", norma: "Art. 19 N.º 3 inc. final CPR", etiqueta: "Sanción", prioridad: "S", fuente: "sancionador" },
    { id: "m06-f-11", modulo: 6, frente: "Culpabilidad o responsabilidad", dorso: "Debe existir imputación de la conducta al presunto infractor según el régimen aplicable; no basta el resultado.", etiqueta: "Sanción", prioridad: "A", fuente: "sancionador" },
    { id: "m06-f-12", modulo: 6, frente: "Proporcionalidad de la sanción", dorso: "La intensidad de la sanción debe guardar relación con gravedad, daño, reiteración y circunstancias. Aplicar el máximo sin motivar es el error clásico.", etiqueta: "Sanción", prioridad: "A", fuente: "sancionador" },
    { id: "m06-f-13", modulo: 6, frente: "Formulación de cargos", dorso: "Acto que comunica los hechos y las infracciones imputadas y abre la defensa. Sin cargos, no hay sanción posible por esos hechos.", norma: "Art. 140 Ley 18.834 (sumario)", etiqueta: "Sanción", prioridad: "S", fuente: "sancionador" },
    { id: "m06-f-14", modulo: 6, frente: "Prueba en el procedimiento sancionador", dorso: "Debe acreditar los hechos y permitir la contradicción del administrado: alegar, aportar documentos y controvertir.", norma: "Arts. 10 y 17 Ley 19.880", etiqueta: "Sanción", prioridad: "A", fuente: "sancionador" },
    { id: "m06-f-15", modulo: 6, frente: "Motivación sancionadora", dorso: "Debe explicar hechos acreditados, norma infringida, calificación jurídica y sanción aplicada.", norma: "Arts. 11 inc. 2 y 41 Ley 19.880", etiqueta: "Sanción", prioridad: "S", fuente: "sancionador" },
    { id: "m06-f-16", modulo: 6, frente: "Decaimiento sancionador", dorso: "Pérdida de eficacia o extinción del procedimiento sancionador por dilación extrema e injustificada que lo vuelve inútil o ilegítimo. No es cualquier atraso: se razona duración, falta de justificación, afectación de la finalidad y consecuencia.", norma: "Jurisprudencia de la Corte Suprema (doctrina, sin rol en los apuntes)", etiqueta: "Sanción", prioridad: "A", fuente: "sancionador" },
    { id: "m06-f-17", modulo: 6, frente: "Sanción encubierta", dorso: "Acto aparentemente organizativo (un traslado, por ejemplo) que materialmente castiga sin procedimiento sancionador: desviación de poder.", etiqueta: "Sanción", prioridad: "B", fuente: "sancionador" },
    { id: "m06-f-18", modulo: 6, frente: "Sanción vs. medida correctiva", dorso: "Sanción: reprocha una infracción imputable, máximas garantías; ejemplo, multa. Medida correctiva: restablece la legalidad o previene un riesgo, proporcionalidad y procedimiento según la afectación; ejemplo, orden de subsanar o clausura preventiva.", etiqueta: "Sanción", prioridad: "S", fuente: "sancionador" },
    { id: "m06-f-19", modulo: 6, frente: "Multas en las ordenanzas municipales", dorso: "Hasta cinco UTM; las aplican los juzgados de policía local.", norma: "Art. 12 Ley 18.695", etiqueta: "Sanción", prioridad: "S", fuente: "nuevo" },
    { id: "m06-f-20", modulo: 6, frente: "Medidas disciplinarias del Estatuto Administrativo", dorso: "Censura, multa, suspensión del empleo de treinta días a tres meses y destitución; se aplican según la gravedad de la falta y las atenuantes o agravantes.", norma: "Art. 121 Ley 18.834", etiqueta: "Sanción", prioridad: "A", fuente: "nuevo" },
    { id: "m06-f-21", modulo: 6, frente: "Prescripción de la acción disciplinaria", dorso: "Cuatro años desde la acción u omisión; si los hechos son delito, prescribe junto con la acción penal.", norma: "Art. 158 Ley 18.834", etiqueta: "Sanción", prioridad: "A", fuente: "nuevo" },
    { id: "m06-f-22", modulo: 6, frente: "Independencia de la sanción administrativa", dorso: "La sanción disciplinaria es independiente de la responsabilidad civil y penal: el archivo, la absolución o el sobreseimiento no la excluyen (con la regla especial de reincorporación si la destitución se fundó sólo en hechos declarados no delictivos).", norma: "Art. 120 Ley 18.834", etiqueta: "Control", prioridad: "B", fuente: "nuevo" },
    { id: "m06-f-23", modulo: 6, frente: "Control de una sanción: ¿qué se revisa?", dorso: "Competencia, potestad legal, tipicidad, hechos acreditados, calificación, procedimiento y defensa, motivación y proporcionalidad. Remedios: recursos administrativos, invalidación, nulidad judicial, responsabilidad.", etiqueta: "Control", prioridad: "S", fuente: "sancionador" },
    { id: "m06-f-24", modulo: 6, frente: "Checklist sancionador (ocho preguntas)", dorso: "¿Órgano competente? ¿Potestad legal? ¿Infracción prevista? ¿Hechos acreditados? ¿La conducta califica? ¿Procedimiento racional y justo? ¿Sanción motivada y proporcional? ¿Recursos o control judicial? Si falla una pieza, hay argumento de invalidez.", etiqueta: "Control", prioridad: "S", fuente: "sancionador" },
  ],

  quiz: [
    { id: "m06-q-01", modulo: 6, texto: "La actividad de policía u ordenación busca principalmente…", opciones: ["Prestar servicios continuos", "Incentivar conductas mediante beneficios", "Limitar libertad o propiedad para proteger el orden público", "Resolver controversias judiciales"], correcta: 2, porque: "La policía administrativa ordena actividades privadas mediante limitaciones justificadas en fines de orden público, entendido en sentido amplio.", fuente: "sancionador" },
    { id: "m06-q-02", modulo: 6, texto: "Si un órgano sanciona sin tener potestad legal, falla principalmente…", opciones: ["El motivo de derecho y la competencia", "La notificación", "La publicidad", "El silencio administrativo"], correcta: 0, porque: "Sin potestad legal no hay habilitación jurídica para sancionar (arts. 6, 7 y 19 N.º 3 CPR).", norma: "Arts. 6, 7 y 19 N.º 3 CPR", fuente: "sancionador" },
    { id: "m06-q-03", modulo: 6, texto: "Tipicidad significa que…", opciones: ["La sanción debe estar en una tabla visual", "La conducta debe encajar en una infracción previamente descrita", "El órgano decide sin norma", "La multa siempre es leve"], correcta: 1, porque: "Ninguna conducta se sanciona sin estar expresamente descrita en una ley anterior (art. 19 N.º 3 inc. final CPR).", norma: "Art. 19 N.º 3 CPR", fuente: "sancionador" },
    { id: "m06-q-04", modulo: 6, texto: "¿Quién aplica las multas que fija una ordenanza municipal?", opciones: ["La Alcaldesa por decreto", "La Dirección de Fiscalización", "Los juzgados de policía local", "Contraloría"], correcta: 2, porque: "Las multas de las ordenanzas (hasta 5 UTM) son aplicadas por los juzgados de policía local correspondientes (art. 12 Ley 18.695).", norma: "Art. 12 Ley 18.695", fuente: "nuevo" },
    { id: "m06-q-05", modulo: 6, texto: "Si se sanciona una conducta que no fue acreditada, falla principalmente…", opciones: ["El objeto físico", "El motivo de hecho", "La publicación", "El plazo de información pública"], correcta: 1, porque: "La sanción requiere hechos acreditados que funden la imputación; sin prueba suficiente falla el motivo de hecho.", fuente: "sancionador" },
    { id: "m06-q-06", modulo: 6, texto: "La Administración no permite alegar ni aportar documentos antes de multar. ¿Qué pasa?", opciones: ["Nada, si la multa es baja", "Puede vulnerar la defensa y la contradictoriedad: indefensión", "Sólo afecta el estilo del acto", "Es válido si la Alcaldesa lo autoriza"], correcta: 1, porque: "Los interesados pueden alegar y aportar documentos en cualquier momento (art. 10 Ley 19.880) y el procedimiento debe ser racional y justo (art. 19 N.º 3 CPR).", norma: "Art. 10 Ley 19.880; art. 19 N.º 3 CPR", fuente: "sancionador" },
    { id: "m06-q-07", modulo: 6, texto: "La motivación de una sanción debe explicar…", opciones: ["Hechos, norma infringida, calificación y sanción", "Sólo el nombre del infractor", "Sólo la fecha", "Sólo la autoridad que firma"], correcta: 0, porque: "Los hechos y fundamentos de derecho deben expresarse siempre en los actos que afecten derechos (art. 11 inc. 2 Ley 19.880); la decisión será fundada (art. 41).", norma: "Arts. 11 y 41 Ley 19.880", fuente: "sancionador" },
    { id: "m06-q-08", modulo: 6, texto: "Una clausura por incumplimiento puede ser…", opciones: ["Instrumento correctivo o sancionatorio según su régimen legal", "Siempre un contrato", "Siempre fomento", "Siempre silencio positivo"], correcta: 0, porque: "Debe analizarse su naturaleza: medida correctiva, cautelar o sanción. Clasificar antes de discutir la validez.", fuente: "sancionador" },
    { id: "m06-q-09", modulo: 6, texto: "El decaimiento del procedimiento sancionador se asocia a…", opciones: ["Dilación extrema e injustificada", "Inicio oportuno", "Silencio positivo automático", "Autorización expresa"], correcta: 0, porque: "La jurisprudencia lo vincula a demoras que tornan inútil o ilegítimo el procedimiento; no a cualquier atraso (doctrina).", fuente: "sancionador" },
    { id: "m06-q-10", modulo: 6, texto: "Un traslado funcionarial usado para castigar sin sumario puede plantear…", opciones: ["Desviación de poder o sanción encubierta", "Silencio positivo", "Fomento cultural", "Servicio público"], correcta: 0, porque: "La forma organizativa puede encubrir una finalidad sancionadora: vicio en el fin y omisión de garantías del procedimiento disciplinario.", fuente: "sancionador" },
    { id: "m06-q-11", modulo: 6, texto: "En un sumario, el fiscal formuló cargos por atrasos reiterados, pero la autoridad sanciona por «mal trato a usuarios». ¿Es válido?", opciones: ["Sí, si consta en el expediente", "No: ningún funcionario puede ser sancionado por hechos que no fueron materia de cargos", "Sí, si la sanción es sólo censura", "Sí, porque la autoridad es libre de calificar"], correcta: 1, porque: "Art. 140 Ley 18.834: si de nuevas diligencias resultan nuevos cargos, se notifican y el afectado tiene tres días para observaciones; sin cargos no hay sanción.", norma: "Art. 140 Ley 18.834", fuente: "nuevo" },
    { id: "m06-q-12", modulo: 6, texto: "Si un fiscalizador detecta infracciones fuera de su competencia material…", opciones: ["Puede sancionar igual", "Debe denunciar o remitir a la autoridad competente", "Debe aplicar silencio negativo", "Debe invalidar el acto"], correcta: 1, porque: "La competencia material limita el ejercicio de la potestad sancionadora; lo que no es suyo se remite (arts. 7 CPR y 14 Ley 19.880).", fuente: "sancionador" },
    { id: "m06-q-13", modulo: 6, texto: "¿Cuáles son las medidas disciplinarias del Estatuto Administrativo?", opciones: ["Amonestación, multa y despido", "Censura, multa, suspensión del empleo y destitución", "Multa, clausura y destitución", "Sólo la destitución"], correcta: 1, porque: "Art. 121 Ley 18.834: censura, multa, suspensión del empleo de treinta días a tres meses, y destitución.", norma: "Art. 121 Ley 18.834", fuente: "nuevo" },
    { id: "m06-q-14", modulo: 6, texto: "La pregunta estratégica ante una multa administrativa es…", opciones: ["¿Qué potestad, hecho, norma, procedimiento y proporcionalidad existen?", "¿Quién imprimió el papel?", "¿Cuál es el rumor?", "¿Hay contrato civil?"], correcta: 0, porque: "Esa secuencia (potestad, acto, procedimiento, garantías, control) permite responder con precisión cualquier caso sancionador.", fuente: "sancionador" },
  ],

  orales: [
    {
      id: "m06-o-01", modulo: 6,
      pregunta: "¿Qué es la potestad sancionadora del Estado y qué exige su ejercicio válido?",
      profesor: "Comisión de Derecho Administrativo",
      claves: ["Poder legal de imponer consecuencias desfavorables", "Órgano competente y potestad atribuida por ley", "Infracción previamente descrita (tipicidad)", "Hechos acreditados y bien calificados", "Procedimiento racional y justo: cargos, defensa, prueba", "Motivación y proporcionalidad", "Recursos y control judicial", "Cierre del sistema de policía u ordenación"],
      trampas: ["Basta el interés público para sancionar", "Es una potestad propia de Carabineros", "La sanción no necesita motivación si es leve", "No se distingue de la medida correctiva", "El procedimiento es un trámite decorativo"],
      modelo: "Es el poder atribuido por ley a órganos administrativos para imponer consecuencias desfavorables frente a infracciones administrativas. Requiere órgano competente, potestad legal, infracción previamente descrita, hechos acreditados, correcta calificación jurídica y un procedimiento racional y justo (art. 19 N.º 3 CPR). Sus garantías incluyen conocimiento de los cargos, defensa, prueba, contradicción, imparcialidad, motivación (art. 11 Ley 19.880), proporcionalidad y recursos. Se relaciona con la actividad de policía porque muchas sanciones son la reacción frente al incumplimiento de normas de ordenación sectorial.",
      repregunta: "¿Qué distingue una sanción de una medida correctiva?",
      prioridad: "S", fuente: "sancionador",
    },
    {
      id: "m06-o-02", modulo: 6,
      pregunta: "¿Cómo se controlan los vicios de una sanción administrativa?",
      profesor: "Comisión de Derecho Administrativo",
      claves: ["Competencia del órgano y potestad legal", "Tipicidad de la infracción", "Acreditación de los hechos", "Respeto del procedimiento y la defensa", "Motivación suficiente", "Proporcionalidad de la sanción", "Remedios: recursos, invalidación, nulidad judicial"],
      trampas: ["Atacar sólo el monto de la multa", "Todo vicio produce nulidad automática", "La presunción de legalidad impide el control", "Sólo se controla la firma de la autoridad", "La responsabilidad civil excluye la sanción"],
      modelo: "Una sanción se controla revisando la competencia del órgano, la existencia de potestad legal, la tipicidad de la infracción, la acreditación de los hechos, la calificación jurídica, el respeto del procedimiento y la defensa, la motivación y la proporcionalidad. Si falla la competencia o la habilitación, el problema es estructural; si fallan hechos o calificación, hay vicio en los motivos; si se omitió audiencia, hay vicio procedimental; si la sanción es excesiva, se discute proporcionalidad. Los remedios son los recursos administrativos (art. 59 Ley 19.880), la invalidación (art. 53), la nulidad judicial y la responsabilidad.",
      repregunta: "¿Y si el procedimiento lleva años paralizado?",
      prioridad: "A", fuente: "sancionador",
    },
    {
      id: "m06-o-03", modulo: 6,
      pregunta: "Explique el decaimiento en los procedimientos sancionadores.",
      profesor: "Comisión de Derecho Administrativo",
      claves: ["Pérdida de eficacia o legitimidad del procedimiento", "Dilación extrema e injustificada", "Lo vuelve inútil o ilegítimo", "No es cualquier atraso", "Se razona duración, justificación, finalidad y consecuencia", "Construcción jurisprudencial"],
      trampas: ["Opera con cualquier demora", "Está regulado expresamente en la Ley 19.880", "Equivale al silencio positivo", "Lo declara Contraloría", "Sólo se aplica a multas pequeñas"],
      modelo: "El decaimiento se vincula con la pérdida de eficacia o legitimidad del procedimiento sancionador cuando una dilación extrema e injustificada lo vuelve inútil o abiertamente ilegítimo. La jurisprudencia lo ha aplicado frente a demoras excesivas entre los cargos y la resolución. No toda demora lo produce: debe analizarse la extensión, la falta de justificación, la afectación de la finalidad y la consecuencia sobre la defensa o la utilidad del procedimiento. Es una construcción jurisprudencial y doctrinal, no una regla expresa de la Ley 19.880.",
      prioridad: "B", fuente: "sancionador",
    },
  ],

  columnas: [
    {
      id: "m06-c-01", modulo: 6, titulo: "¿Sanción o medida correctiva?",
      izq: "Sanción", der: "Medida correctiva",
      items: [
        { texto: "Reprocha una infracción cometida", lado: 0, porque: "La sanción mira hacia atrás: castiga." },
        { texto: "Restablece la legalidad o previene un riesgo", lado: 1, porque: "La medida correctiva mira hacia adelante." },
        { texto: "Multa de 50 UTM por ruidos reiterados", lado: 0, porque: "Es la consecuencia desfavorable típica." },
        { texto: "Orden de subsanar instalaciones eléctricas en 10 días", lado: 1, porque: "Busca corregir, no castigar." },
        { texto: "Clausura preventiva mientras dura el peligro de derrumbe", lado: 1, porque: "Previene un riesgo; cesa cuando cesa el peligro." },
        { texto: "Exige las máximas garantías: cargos, defensa, prueba, motivación", lado: 0, porque: "Es el núcleo del derecho sancionador." },
        { texto: "Presupuesto: infracción imputable", lado: 0, porque: "Sin culpabilidad no hay sanción." },
        { texto: "Presupuesto: riesgo, incumplimiento o necesidad de corrección", lado: 1, porque: "No exige reproche, sí proporcionalidad." },
        { texto: "Se rige por proporcionalidad y procedimiento según la afectación", lado: 1, porque: "Las garantías se gradúan por lo que afecta." },
        { texto: "Revocación de un permiso como castigo por infracción grave", lado: 0, porque: "Revocación-sanción: instrumento represivo." },
      ],
      fuente: "sancionador",
    },
    {
      id: "m06-c-02", modulo: 6, titulo: "Instrumentos de policía: ¿preventivo o represivo?",
      izq: "Preventivo", der: "Represivo",
      items: [
        { texto: "Permiso de funcionamiento", lado: 0, porque: "Habilita y condiciona antes de la actividad." },
        { texto: "Multa por infracción", lado: 1, porque: "Reacción posterior a la infracción." },
        { texto: "Registro de proveedores", lado: 0, porque: "Ordena preventivamente." },
        { texto: "Inspección previa a la apertura", lado: 0, porque: "Verifica antes." },
        { texto: "Amonestación por incumplimiento", lado: 1, porque: "Reprocha." },
        { texto: "Licencia de conducir", lado: 0, porque: "Autorización previa." },
        { texto: "Revocación de la autorización como sanción", lado: 1, porque: "Castiga una infracción." },
        { texto: "Patente comercial", lado: 0, porque: "Habilita la actividad." },
      ],
      fuente: "sancionador",
    },
  ],

  cadenas: [
    {
      id: "m06-k-01", modulo: 6, titulo: "Un procedimiento sancionador bien hecho",
      pasos: ["Fiscalización o denuncia pone los hechos en conocimiento de la autoridad", "Información previa: se evalúa si conviene iniciar", "Resolución fundada que inicia el procedimiento e instruye", "Formulación de cargos: hechos e infracciones imputadas", "Descargos del afectado, con alegaciones y documentos", "Prueba y contradicción", "Resolución motivada: hechos, norma, calificación, sanción proporcional", "Notificación y recursos"],
      nota: "Si falta la formulación de cargos o la oportunidad de descargos, lo que sigue es indefensión, no procedimiento.",
      norma: "Art. 19 N.º 3 CPR; arts. 10, 11, 17 y 41 Ley 19.880", fuente: "sancionador",
    },
  ],

  expedientes: [
    {
      id: "m06-e-01", modulo: 6,
      titulo: "La multa que firmó la Alcaldesa",
      relato: "El Director de Fiscalización, Benito Muñoz, trae un decreto listo para la firma: multa de 3 UTM a la fuente de soda «El Decreto» por ruidos, según la ordenanza de convivencia. «Así no esperamos al juzgado», dice.",
      documento: { tipo: "Decreto alcaldicio", campos: [ { k: "Órgano", v: "Alcaldesa Ruperta Cañas" }, { k: "Dispone", v: "Aplica multa de 3 UTM por infracción a la ordenanza de ruidos" }, { k: "Infractor", v: "Fuente de soda «El Decreto»" }, { k: "Fundamento", v: "Ordenanza municipal N.º 12, art. 8" }, { k: "Procedimiento", v: "Acta de fiscalización" } ] },
      vicio: "Órgano",
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "VÁLIDO: la multa está dentro de las 5 UTM", correcto: false, porque: "El tope es correcto, pero el órgano no: las multas de las ordenanzas las aplican los juzgados de policía local (art. 12 Ley 18.695)." },
        { texto: "INCOMPETENCIA: la aplica el juzgado de policía local", correcto: true, porque: "Las ordenanzas pueden fijar multas de hasta 5 UTM, «las que serán aplicadas por los juzgados de policía local correspondientes» (art. 12 Ley 18.695). La Municipalidad denuncia; no multa." },
        { texto: "SUBSANAR: falta citar el art. 59 Ley 19.880", correcto: false, porque: "Indicar los recursos es necesario (art. 41), pero no arregla la falta de competencia (art. 7 CPR)." },
        { texto: "VÁLIDO: la ordenanza es ley municipal", correcto: false, porque: "La ordenanza es norma general obligatoria, pero quien aplica sus multas es el juez de policía local (art. 12 Ley 18.695)." },
      ],
      norma: "Art. 12 Ley 18.695; art. 7 CPR", fuente: "nuevo", hallazgo: "m06-multa-ordenanza",
    },
    {
      id: "m06-e-02", modulo: 6,
      titulo: "Clausura por denuncias",
      relato: "Varios vecinos se quejaron de un taller mecánico. La Alcaldesa quiere clausurarlo «como sanción ejemplar» hoy mismo. No hubo cargos, ni descargos, ni inspección: sólo las denuncias.",
      documento: { tipo: "Decreto alcaldicio", campos: [ { k: "Órgano", v: "Alcaldesa Ruperta Cañas" }, { k: "Dispone", v: "Clausura definitiva del taller «Frenos Pérez» como sanción" }, { k: "Motivo", v: "«Reiteradas denuncias de vecinos»" }, { k: "Cargos formulados", v: "Ninguno" }, { k: "Descargos", v: "No se abrió plazo" }, { k: "Inspección", v: "No consta" } ] },
      vicio: "Cargos formulados",
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "VÁLIDO: la Alcaldesa dirige la comuna", correcto: false, porque: "Dirigir la comuna no exime de un procedimiento racional y justo antes de sancionar (art. 19 N.º 3 CPR)." },
        { texto: "SIN PROCEDIMIENTO: indefensión; formular cargos y oír antes", correcto: true, porque: "Sancionar exige comunicar los cargos, permitir alegaciones y documentos (art. 10 Ley 19.880) y acreditar los hechos (art. 11); omitirlo produce indefensión (art. 19 N.º 3 CPR). Las denuncias abren un procedimiento, no lo cierran." },
        { texto: "VÁLIDO COMO MEDIDA CORRECTIVA", correcto: false, porque: "El decreto la califica como sanción definitiva y no invoca riesgo alguno que corregir; además, incluso una medida correctiva necesita hechos acreditados y proporcionalidad." },
      ],
      norma: "Art. 19 N.º 3 CPR; arts. 10 y 11 Ley 19.880", fuente: "sancionador", hallazgo: "m06-audiencia",
    },
    {
      id: "m06-e-03", modulo: 6,
      titulo: "Por si la primera fue poca",
      relato: "El juzgado de policía local ya multó al local «La Última Instancia» por venta de alcohol fuera de horario. La Alcaldesa quiere «reforzar» con otra multa municipal por el mismo hecho y la misma infracción.",
      documento: { tipo: "Decreto alcaldicio", campos: [ { k: "Órgano", v: "Alcaldesa Ruperta Cañas" }, { k: "Dispone", v: "Aplica multa adicional por venta de alcohol fuera de horario" }, { k: "Hecho", v: "El mismo ya sancionado por el JPL el mes pasado" }, { k: "Fundamento", v: "La misma infracción de la ordenanza" }, { k: "Motivo declarado", v: "«La primera multa fue insuficiente»" } ] },
      vicio: "Hecho",
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "VÁLIDO: dos órganos, dos multas", correcto: false, porque: "Mismo hecho, mismo fundamento: non bis in idem (art. 19 N.º 3 CPR, doctrina). Además, la Municipalidad no aplica multas de ordenanza (art. 12 Ley 18.695)." },
        { texto: "NON BIS IN IDEM: no se sanciona dos veces el mismo hecho", correcto: true, porque: "Un mismo hecho, con el mismo fundamento, no admite doble sanción; distinto sería si del hecho surgieran responsabilidades de naturaleza distinta (por ejemplo, art. 120 Ley 18.834 para funcionarios). Y la multa de ordenanza, además, la aplica el JPL (art. 12 Ley 18.695)." },
        { texto: "SUBSANAR: bajar la multa a 5 UTM", correcto: false, porque: "El problema no es el monto, sino que ya hubo sanción por el mismo hecho." },
        { texto: "VÁLIDO COMO MEDIDA CORRECTIVA", correcto: false, porque: "Una multa reprocha; no corrige ni previene nada. Es sanción, y repetida." },
      ],
      norma: "Art. 19 N.º 3 CPR (doctrina); art. 12 Ley 18.695", fuente: "sancionador", hallazgo: "m06-non-bis",
    },
    {
      id: "m06-e-04", modulo: 6,
      titulo: "Multa sin película",
      relato: "Una resolución de la Dirección de Fiscalización impone 50 UTM a una constructora. En los «considerandos» dice: «Que se verificó una infracción». Nada más. Ni fecha, ni lugar, ni norma, ni por qué 50.",
      documento: { tipo: "Resolución sancionatoria", campos: [ { k: "Órgano", v: "Dirección de Fiscalización" }, { k: "Dispone", v: "Multa de 50 UTM a Constructora Columna Ltda." }, { k: "Considerandos", v: "«Que se verificó una infracción»" }, { k: "Hechos", v: "No se describen" }, { k: "Norma infringida", v: "No se cita" }, { k: "Graduación", v: "Sin explicación" } ] },
      vicio: "Considerandos",
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "VÁLIDA: los actos se presumen legales", correcto: false, porque: "La presunción de legalidad no suple la motivación exigida a los actos que afectan derechos (art. 11 inc. 2 Ley 19.880)." },
        { texto: "FALTA MOTIVACIÓN: hechos, norma, calificación y graduación", correcto: true, porque: "Los hechos y fundamentos de derecho deben expresarse siempre en los actos que limiten, restrinjan o priven de derechos (art. 11 inc. 2) y la decisión será fundada (art. 41 Ley 19.880). Sin eso no hay cómo controlar tipicidad ni proporcionalidad." },
        { texto: "SUBSANAR: basta agregar el número de la norma", correcto: false, porque: "La motivación sancionadora exige hechos acreditados, norma, calificación y por qué esa sanción; citar un artículo no es explicar." },
      ],
      norma: "Arts. 11 inc. 2 y 41 Ley 19.880", fuente: "sancionador", hallazgo: "m06-motivacion",
    },
    {
      id: "m06-e-05", modulo: 6,
      titulo: "Un sumario como corresponde",
      relato: "El Secretario Municipal te pasa el sumario contra un funcionario de Tránsito: cargos notificados, descargos presentados, prueba rendida, vista del fiscal y resolución fundada que aplica censura por los hechos acusados. Notificada.",
      documento: { tipo: "Resolución que afina sumario administrativo", campos: [ { k: "Órgano", v: "Alcaldesa Ruperta Cañas" }, { k: "Cargos", v: "Formulados y notificados: atrasos reiterados en marzo" }, { k: "Descargos", v: "Presentados dentro de plazo" }, { k: "Prueba", v: "Rendida; registros de asistencia" }, { k: "Dispone", v: "Censura, por atrasos reiterados en marzo" }, { k: "Motivación", v: "Hechos acreditados, norma infringida, gravedad y atenuantes" }, { k: "Notificado el", v: "Sí, personalmente" } ] },
      vicio: null,
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "VÁLIDO", correcto: true, porque: "Cargos, descargos, prueba, resolución fundada sobre los mismos hechos de los cargos y notificación: es el procedimiento disciplinario como manda el Estatuto (arts. 121 y 140 Ley 18.834) y el art. 19 N.º 3 CPR. La censura es la medida más leve del catálogo." },
        { texto: "INVÁLIDO: la censura es desproporcionada", correcto: false, porque: "La censura es la medida disciplinaria más leve (art. 121 Ley 18.834) y la resolución gradúa según gravedad y atenuantes." },
        { texto: "INVÁLIDO: faltó la toma de razón", correcto: false, porque: "Las resoluciones municipales están exentas de toma de razón; se registran en Contraloría cuando afectan a funcionarios (art. 53 Ley 18.695)." },
        { texto: "INVÁLIDO: debió resolver el juzgado de policía local", correcto: false, porque: "La responsabilidad disciplinaria de un funcionario se persigue en sumario administrativo, no ante el JPL (arts. 121 y ss. Ley 18.834)." },
      ],
      norma: "Arts. 121 y 140 Ley 18.834; art. 53 Ley 18.695", fuente: "nuevo", hallazgo: "m06-cargos-y-tiempo",
    },
    {
      id: "m06-e-06", modulo: 6,
      titulo: "Cargos por una cosa, castigo por otra",
      relato: "Otro sumario: el fiscal formuló cargos por atrasos. La Alcaldesa, leyendo el expediente, «descubrió» que el funcionario además trataba mal a los usuarios y quiere destituirlo por eso, sin nuevos cargos.",
      documento: { tipo: "Proyecto de resolución", campos: [ { k: "Órgano", v: "Alcaldesa Ruperta Cañas" }, { k: "Cargos formulados", v: "Atrasos reiterados" }, { k: "Hechos por los que se sanciona", v: "Mal trato a usuarios" }, { k: "Nuevos cargos notificados", v: "No" }, { k: "Dispone", v: "Destitución" } ] },
      vicio: "Hechos por los que se sanciona",
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "VÁLIDO: los hechos constan en el expediente", correcto: false, porque: "Constar no basta: ningún funcionario puede ser sancionado por hechos que no han sido materia de cargos (art. 140 Ley 18.834)." },
        { texto: "SÓLO POR LOS CARGOS: formular nuevos cargos y oír tres días", correcto: true, porque: "La autoridad puede ordenar nuevas diligencias; si resultan nuevos cargos, se notifican y el afectado tiene tres días para observaciones. Sin eso, no hay sanción por esos hechos (art. 140 Ley 18.834)." },
        { texto: "VÁLIDO: la destitución la decide libremente la autoridad", correcto: false, porque: "Toda medida se aplica según la gravedad y el mérito de los antecedentes del sumario (art. 121 Ley 18.834), y sólo por hechos acusados (art. 140)." },
      ],
      norma: "Art. 140 Ley 18.834", fuente: "nuevo", hallazgo: "m06-cargos-y-tiempo",
    },
  ],
};

// PENDIENTE DE REVISIÓN: los funcionarios municipales se rigen por la Ley 18.883
// (Estatuto Administrativo para Funcionarios Municipales), que no está entre los
// XML bajados; el juego cita las reglas equivalentes de la Ley 18.834 (arts. 120,
// 121, 140 y 158). Confirmar que la Ley 18.883 las reproduce (debería: arts. 118 y
// ss.) antes de publicar.
// PENDIENTE DE REVISIÓN: la clausura de locales por la Municipalidad tiene base en
// la Ley de Rentas Municipales (DL 3.063, art. 58), no bajada; los expedientes
// m06-e-02 y m06-e-03 no afirman nada sobre esa habilitación, sólo sobre
// procedimiento, motivación y non bis in idem.
// PENDIENTE DE REVISIÓN: non bis in idem y decaimiento se presentan como doctrina y
// jurisprudencia de la Corte Suprema sin rol (los apuntes no lo traen); la
// aplicación de las garantías penales del art. 19 N.º 3 CPR al derecho
// administrativo sancionador es jurisprudencia del Tribunal Constitucional, citada
// aquí sin número de rol.
