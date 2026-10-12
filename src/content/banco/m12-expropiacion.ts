// Módulo 12 · La franja · Expropiación: art. 19 N.º 24 CPR, DL 2.186, etapas, indemnización,
// reclamos y Galletué. Fuentes: proceadmin-rpg (referencias al DL 2.186, siete etapas, misión «la
// franja expropiada», pregunta q4), iuspublic (definición, cloze, comisión c-expr), guia-rpe (Galletué).
// Normas verificadas contra los XML de la BCN el 12-10-2026: CPR art. 19 N.º 20 y N.º 24; DL 2.186
// (descargado de la BCN, idNorma 6848) arts. 1, 2, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 16, 17, 20, 21,
// 23, 38, 39 y 40.
import type { BancoModulo } from "../tipos";

export const BANCO_M12: BancoModulo = {
  modulo: 12,

  hallazgos: [
    {
      id: "m12-ley", modulo: 12,
      titulo: "Sin ley no hay expropiación",
      texto: "Nadie puede ser privado de su propiedad, del bien sobre que recae o de alguno de los atributos esenciales del dominio, sino en virtud de una ley general o especial que autorice la expropiación por causa de utilidad pública o de interés nacional, calificada por el legislador. Toda expropiación, cualquiera sea la ley que la autorice, sigue el procedimiento del DL 2.186.",
      norma: "Art. 19 N.º 24 inc. 3 CPR; art. 1 DL 2.186",
      simple: "Para quedarse con tu franja, la Municipalidad necesita una ley; las ganas de hacer una avenida no bastan.",
    },
    {
      id: "m12-indemnizacion", modulo: 12,
      titulo: "El cheque: daño patrimonial efectivamente causado",
      texto: "El expropiado tiene siempre derecho a indemnización por el daño patrimonial efectivamente causado, fijada de común acuerdo o por sentencia. A falta de acuerdo se paga en dinero efectivo y al contado. «Indemnización» es sólo el daño patrimonial que sea consecuencia directa e inmediata de la expropiación: no hay daño moral.",
      norma: "Art. 19 N.º 24 inc. 3 CPR; arts. 16 y 38 DL 2.186",
      simple: "Te pagan la casa, no la nostalgia.",
    },
    {
      id: "m12-peritos", modulo: 12,
      titulo: "Tres peritos ponen el primer precio",
      texto: "Todo procedimiento expropiatorio se inicia o continúa con una comisión de tres peritos, sacados de una lista oficial y ajenos a la entidad expropiante, que fija el monto provisional de la indemnización. Aceptan en tres días, se constituyen dentro del décimo día y tienen treinta días para informar, prorrogables por otros treinta.",
      norma: "Arts. 4 y 5 DL 2.186",
      simple: "El primer precio lo ponen tres desconocidos con título; el definitivo, el acuerdo o el juez.",
    },
    {
      id: "m12-acto", modulo: 12,
      titulo: "El acto expropiatorio y sus noventa días",
      texto: "La expropiación se dispone por decreto supremo del Presidente o por resolución de la entidad descentralizada o desconcentrada: ese es el acto expropiatorio, que debe individualizar el bien, citar la ley y la causa, nombrar al propietario y fijar el monto provisional y la forma de pago. Se publica en extracto en el Diario Oficial dentro de los noventa días siguientes, y la notificación se entiende perfeccionada con esa publicación.",
      norma: "Arts. 6 y 7 DL 2.186",
      simple: "Un decreto que no dice cuánto, a quién ni por qué, no es un acto expropiatorio: es un susto.",
    },
    {
      id: "m12-reclamos", modulo: 12,
      titulo: "Dos carriles para reclamar",
      texto: "Dentro de treinta días desde la publicación, el expropiado puede reclamar ante el juez la legalidad del acto (falta de ley, no concurrencia de la causa, inexpropiabilidad) o pedir la expropiación total cuando lo que le queda no sirve, en juicio sumario. El monto, en cambio, lo pueden reclamar ambas partes desde la notificación hasta treinta días después de la toma de posesión material; si nadie reclama, el monto provisional queda como definitivo.",
      norma: "Arts. 9, 12 y 13 DL 2.186",
      simple: "Un plazo para discutir si te expropian y otro para discutir cuánto: no los confundas, que el primero vuela.",
    },
    {
      id: "m12-dominio", modulo: 12,
      titulo: "Primero el pago, después las máquinas",
      texto: "La toma de posesión material procede previo pago del total de la indemnización. Pagada al expropiado o consignada ante el tribunal la cuota de contado, el dominio queda radicado de pleno derecho en el expropiante y se extinguen los derechos reales y arriendos sobre el bien; la indemnización lo subroga. La entidad debe instar por la toma de posesión dentro de sesenta días desde la publicación o el expropiado puede pedir que el acto quede sin efecto.",
      norma: "Art. 19 N.º 24 inc. 3 CPR; arts. 20 y 21 DL 2.186",
      simple: "La retroexcavadora entra cuando el dinero ya salió; nunca al revés.",
    },
    {
      id: "m12-galletue", modulo: 12,
      titulo: "Galletué: limitar también puede costar",
      texto: "La función social del dominio permite limitaciones por ley, en principio sin indemnización. Pero en Galletué (1984) la Corte Suprema hizo pagar al Fisco por un decreto válido que prohibió explotar la araucaria: cuando una limitación lícita impone a uno solo un sacrificio especial, se rompe la igualdad ante las cargas públicas y se indemniza.",
      norma: "Art. 19 N.º 24 inc. 2 y N.º 20 CPR; Comunidad Galletué con Fisco (1984, rol 16.743)",
      simple: "Si el bien común lo paga un solo vecino, deja de ser bien común y pasa a ser cuenta pendiente.",
    },
  ],

  afirmaciones: [
    { id: "m12-af-01", modulo: 12, hallazgo: "m12-ley", texto: "Una ordenanza municipal basta para autorizar la expropiación de una franja para una avenida.", verdad: false, porque: "Sólo una ley general o especial puede autorizar la expropiación, por causa de utilidad pública o interés nacional calificada por el legislador (art. 19 N.º 24 inc. 3 CPR)." },
    { id: "m12-af-02", modulo: 12, hallazgo: "m12-ley", texto: "Toda expropiación, cualquiera sea la ley que la autorice, se sujeta al procedimiento del DL 2.186.", verdad: true, porque: "Art. 1 DL 2.186." },
    { id: "m12-af-03", modulo: 12, hallazgo: "m12-indemnizacion", texto: "La indemnización expropiatoria cubre también el daño moral por perder la casa familiar.", verdad: false, porque: "Sólo el daño patrimonial efectivamente causado, consecuencia directa e inmediata de la expropiación (art. 19 N.º 24 CPR; art. 38 DL 2.186)." },
    { id: "m12-af-04", modulo: 12, hallazgo: "m12-indemnizacion", texto: "A falta de acuerdo, la indemnización se paga en dinero efectivo y al contado.", verdad: true, porque: "Art. 19 N.º 24 inc. 3 CPR; art. 16 DL 2.186 (si la ley no fija plazo, de contado y en dinero efectivo)." },
    { id: "m12-af-05", modulo: 12, hallazgo: "m12-peritos", texto: "Los peritos de la comisión los designa la entidad expropiante de entre sus propios funcionarios.", verdad: false, porque: "Los designa de una lista aprobada por el Presidente, y no pueden figurar profesionales de la propia entidad (art. 4 DL 2.186)." },
    { id: "m12-af-06", modulo: 12, hallazgo: "m12-peritos", texto: "La comisión de peritos tiene treinta días para informar, prorrogables por otros treinta.", verdad: true, porque: "Art. 4 DL 2.186." },
    { id: "m12-af-07", modulo: 12, hallazgo: "m12-acto", texto: "La notificación del acto expropiatorio se perfecciona con la sola publicación del extracto en el Diario Oficial.", verdad: true, porque: "Art. 7 DL 2.186; su fecha es la de esa publicación." },
    { id: "m12-af-08", modulo: 12, hallazgo: "m12-acto", texto: "El acto expropiatorio puede omitir el monto provisional, porque lo fija después el juez.", verdad: false, porque: "Debe contener el monto provisional, la comisión que lo fijó y la fecha de su informe, además de la forma y plazos de pago (art. 6 DL 2.186)." },
    { id: "m12-af-09", modulo: 12, hallazgo: "m12-reclamos", texto: "El reclamo de legalidad del acto expropiatorio se puede presentar hasta treinta días después de la toma de posesión material.", verdad: false, porque: "Ese es el plazo del reclamo de monto (art. 12); la legalidad se reclama dentro de treinta días desde la publicación (art. 9 DL 2.186)." },
    { id: "m12-af-10", modulo: 12, hallazgo: "m12-reclamos", texto: "Si ni el expropiante ni el expropiado reclaman el monto, la indemnización provisional se tiene por definitiva.", verdad: true, porque: "Art. 13 DL 2.186." },
    { id: "m12-af-11", modulo: 12, hallazgo: "m12-dominio", texto: "La municipalidad puede tomar posesión material de la franja apenas publique el acto expropiatorio.", verdad: false, porque: "La toma de posesión material requiere el pago previo del total de la indemnización (art. 19 N.º 24 CPR) y, a falta de acuerdo, la consignación y la autorización judicial (art. 21 DL 2.186)." },
    { id: "m12-af-12", modulo: 12, hallazgo: "m12-dominio", texto: "Pagada o consignada la cuota de contado, el dominio queda radicado de pleno derecho en el expropiante.", verdad: true, porque: "Art. 20 DL 2.186, a título originario; la indemnización subroga al bien." },
    { id: "m12-af-13", modulo: 12, hallazgo: "m12-galletue", texto: "En Galletué, el Fisco pagó porque el decreto que declaró monumento natural la araucaria era ilegal.", verdad: false, porque: "El decreto era válido; se indemnizó el sacrificio especial de una limitación lícita, por igualdad ante las cargas públicas (art. 19 N.º 20 CPR)." },
    { id: "m12-af-14", modulo: 12, hallazgo: "m12-galletue", texto: "La ley puede imponer limitaciones y obligaciones al dominio que deriven de su función social.", verdad: true, porque: "Art. 19 N.º 24 inc. 2 CPR: intereses generales de la Nación, seguridad nacional, utilidad y salubridad públicas y conservación del patrimonio ambiental." },
  ],

  fichas: [
    { id: "m12-f-01", modulo: 12, frente: "Expropiación", dorso: "Acto unilateral y coercitivo de la Administración que priva a una persona de un bien o de atributos esenciales del dominio, por utilidad pública o interés nacional, previa ley y con pago de indemnización por el daño patrimonial efectivamente causado.", norma: "Art. 19 N.º 24 CPR; DL 2.186", etiqueta: "conceptos", prioridad: "A", fuente: "iuspublic" },
    { id: "m12-f-02", modulo: 12, frente: "Art. 19 N.º 24 inc. 2 CPR: función social", dorso: "Sólo la ley puede establecer el modo de adquirir la propiedad, de usar, gozar y disponer de ella, y las limitaciones y obligaciones que deriven de su función social: intereses generales de la Nación, seguridad nacional, utilidad y salubridad públicas y conservación del patrimonio ambiental.", norma: "Art. 19 N.º 24 inc. 2 CPR", etiqueta: "normas", prioridad: "A", fuente: "nuevo" },
    { id: "m12-f-03", modulo: 12, frente: "Art. 19 N.º 24 inc. 3 CPR: la garantía expropiatoria", dorso: "Privación sólo por ley general o especial que autorice la expropiación por utilidad pública o interés nacional; reclamo de legalidad ante los tribunales ordinarios; indemnización siempre, por el daño patrimonial efectivamente causado, de común acuerdo o por sentencia; a falta de acuerdo, dinero efectivo al contado; toma de posesión previo pago del total; el juez puede suspenderla si se reclama la procedencia.", norma: "Art. 19 N.º 24 inc. 3 CPR", etiqueta: "normas", prioridad: "S", fuente: "proceadmin" },
    { id: "m12-f-04", modulo: 12, frente: "Art. 1 DL 2.186", dorso: "Toda expropiación por causa de utilidad pública o de interés social o nacional, cualquiera sea la ley que la autorice o la institución que la decreta, se sujeta al procedimiento del DL 2.186. Es procedimiento especial; la Ley 19.880 es supletoria.", norma: "Art. 1 DL 2.186; art. 1 Ley 19.880", etiqueta: "normas", prioridad: "A", fuente: "proceadmin" },
    { id: "m12-f-05", modulo: 12, frente: "Resolución de estudio", dorso: "La entidad autorizada puede ordenar el estudio de la expropiación de un bien; publicada en extracto y anotada al margen de la inscripción, el bien se hace incomerciable. Sus efectos expiran ipso jure a los noventa días de publicada y no puede renovarse antes de tres años. Es opcional: se puede expropiar sin estudio previo.", norma: "Art. 2 DL 2.186", etiqueta: "etapas", prioridad: "B", fuente: "proceadmin" },
    { id: "m12-f-06", modulo: 12, frente: "Comisión de peritos", dorso: "Tres miembros de la lista de peritos aprobada por decreto de Hacienda; sin profesionales de la entidad expropiante y con no más de uno de la Administración. Aceptan en tres días, se constituyen dentro del décimo día, informan en treinta días prorrogables por otros treinta, por mayoría; sin mayoría, promedio.", norma: "Art. 4 DL 2.186", etiqueta: "etapas", prioridad: "A", fuente: "proceadmin" },
    { id: "m12-f-07", modulo: 12, frente: "Monto provisional", dorso: "Es el que fija la comisión. Si entre el informe y la notificación del acto expropiatorio pasan más de treinta días, se reajusta por IPC.", norma: "Art. 5 DL 2.186", etiqueta: "etapas", prioridad: "B", fuente: "nuevo" },
    { id: "m12-f-08", modulo: 12, frente: "Acto expropiatorio: quién y qué", dorso: "Decreto supremo del Presidente o resolución de la entidad descentralizada o desconcentrada, previo acuerdo según sus normas. Contiene fecha, individualización del bien y su rol de avalúo, la ley y la causa, el nombre del propietario, el monto provisional con la comisión y la fecha de su informe, y la forma y plazos de pago. Los errores se corrigen antes de la publicación.", norma: "Art. 6 DL 2.186", etiqueta: "etapas", prioridad: "S", fuente: "proceadmin" },
    { id: "m12-f-09", modulo: 12, frente: "Publicación y notificación", dorso: "Dentro de los noventa días siguientes al acto, se publica en extracto en el Diario Oficial (días 1 o 15) y en un diario de la provincia; copia a Carabineros para entregar al ocupante. La notificación se perfecciona con la sola publicación en el Diario Oficial; los errores en los demás trámites no la invalidan.", norma: "Art. 7 DL 2.186", etiqueta: "etapas", prioridad: "S", fuente: "proceadmin" },
    { id: "m12-f-10", modulo: 12, frente: "Reclamo de legalidad (art. 9)", dorso: "Treinta días desde la publicación en el Diario Oficial, ante el juez, en juicio sumario: a) dejar sin efecto por inexpropiabilidad, falta de ley o no concurrencia de la causa; b) expropiación total si el resto carece de significación económica; c) expropiación de otra porción; d) modificar forma y condiciones de pago. No paraliza el procedimiento salvo orden judicial en a) y d). Vencido el plazo, el derecho se extingue.", norma: "Art. 9 DL 2.186", etiqueta: "reclamos", prioridad: "S", fuente: "proceadmin" },
    { id: "m12-f-11", modulo: 12, frente: "Reclamo de monto (art. 12)", dorso: "La entidad expropiante y el expropiado pueden reclamar judicialmente del monto provisional y pedir la determinación definitiva, desde la notificación del acto hasta el trigésimo día siguiente a la toma de posesión material. Cada parte nombra un perito; sentencia en diez días tras la prueba.", norma: "Arts. 12 y 14 DL 2.186", etiqueta: "reclamos", prioridad: "S", fuente: "proceadmin" },
    { id: "m12-f-12", modulo: 12, frente: "Indemnización definitiva", dorso: "Se fija de común acuerdo (escritura pública, puede incluir dación en pago) o por el tribunal. Si nadie reclama en los términos del art. 12, la provisional se tiene por definitiva y ajustada de común acuerdo.", norma: "Arts. 10, 11 y 13 DL 2.186", etiqueta: "indemnización", prioridad: "A", fuente: "nuevo" },
    { id: "m12-f-13", modulo: 12, frente: "Qué es «indemnización» en el DL 2.186", dorso: "El daño patrimonial efectivamente causado con la expropiación, que sea consecuencia directa e inmediata de ella. Excluye el daño moral y los perjuicios indirectos.", norma: "Art. 38 DL 2.186; art. 19 N.º 24 CPR", etiqueta: "indemnización", prioridad: "S", fuente: "guia-rpe" },
    { id: "m12-f-14", modulo: 12, frente: "Forma de pago", dorso: "Según la ley que autoriza; si no dice plazo, de contado y en dinero efectivo. Si la ley admite plazo sin fijarlo, cinco años en cuotas iguales; nunca más de diez. La pequeña propiedad rústica y urbana, los talleres artesanales, la pequeña empresa y la vivienda habitada por su dueño se pagan previamente y de contado.", norma: "Art. 16 DL 2.186", etiqueta: "indemnización", prioridad: "B", fuente: "nuevo" },
    { id: "m12-f-15", modulo: 12, frente: "Consignación y efectos sobre el dominio", dorso: "A falta de acuerdo, la indemnización provisional (o su cuota de contado) se consigna a la orden del tribunal, reajustada. Pagada o consignada, el dominio queda radicado de pleno derecho, a título originario, en el expropiante; se extinguen los derechos reales (salvo servidumbres legales), arriendos y embargos; la indemnización subroga al bien.", norma: "Arts. 17 y 20 DL 2.186", etiqueta: "etapas", prioridad: "A", fuente: "proceadmin" },
    { id: "m12-f-16", modulo: 12, frente: "Toma de posesión material", dorso: "Con acuerdo, en la forma convenida. Sin acuerdo, el expropiante pide autorización al juez una vez consignada la cuota de contado y hechas las publicaciones del art. 23; debe instar dentro de sesenta días desde la publicación del acto, o el expropiado puede pedir que el acto quede sin efecto. El juez ordena el auxilio de la fuerza pública.", norma: "Art. 21 DL 2.186", etiqueta: "etapas", prioridad: "A", fuente: "proceadmin" },
    { id: "m12-f-17", modulo: 12, frente: "Juez competente", dorso: "El juez de letras en lo civil del lugar del bien expropiado; si el expropiante es el Fisco, el de asiento de la Corte de Apelaciones. La primera gestión radica allí todo el asunto. Los plazos de días se suspenden durante los feriados.", norma: "Arts. 39 y 40 DL 2.186", etiqueta: "reclamos", prioridad: "C", fuente: "nuevo" },
    { id: "m12-f-18", modulo: 12, frente: "Comunidad Galletué con Fisco (1984)", dorso: "Un decreto válido declaró monumento natural la araucaria y prohibió explotarla. La Corte Suprema obligó al Fisco a indemnizar por equidad: la limitación lícita impuso un sacrificio especial que rompe la igualdad ante las cargas públicas. Base de la responsabilidad por actividad lícita.", norma: "Art. 19 N.º 20 CPR; rol 16.743", etiqueta: "casos", prioridad: "A", fuente: "guia-rpe" },
    { id: "m12-f-19", modulo: 12, frente: "Expropiación y requisición", dorso: "La expropiación priva definitivamente del dominio, por ley, con indemnización del daño patrimonial. La requisición es una medida de estados de excepción constitucional, temporal, sobre el uso de bienes, también con derecho a indemnización. Distinción doctrinal.", norma: "Art. 19 N.º 24 CPR; arts. 39 a 45 CPR", etiqueta: "conceptos", prioridad: "C", fuente: "iuspublic" },
  ],

  quiz: [
    { id: "m12-q-01", modulo: 12, texto: "¿Qué exige la Constitución para privar a alguien de su propiedad?", opciones: ["Un decreto fundado del alcalde", "Una ley general o especial que autorice la expropiación por utilidad pública o interés nacional", "El acuerdo del concejo municipal", "Un informe de la Contraloría"], correcta: 1, porque: "Art. 19 N.º 24 inc. 3 CPR: la causa la califica el legislador.", norma: "Art. 19 N.º 24 CPR", fuente: "iuspublic" },
    { id: "m12-q-02", modulo: 12, texto: "¿Qué cubre la indemnización expropiatoria?", opciones: ["Todo daño, incluido el moral", "El daño patrimonial efectivamente causado, consecuencia directa e inmediata de la expropiación", "El avalúo fiscal", "El valor que fije la municipalidad"], correcta: 1, porque: "Art. 19 N.º 24 CPR y art. 38 DL 2.186.", norma: "Art. 38 DL 2.186", fuente: "guia-rpe" },
    { id: "m12-q-03", modulo: 12, texto: "¿Quién fija el monto provisional de la indemnización?", opciones: ["El juez", "La entidad expropiante", "Una comisión de tres peritos de la lista oficial", "El Servicio de Impuestos Internos"], correcta: 2, porque: "Art. 4 DL 2.186: peritos ajenos a la entidad expropiante.", norma: "Art. 4 DL 2.186", fuente: "proceadmin" },
    { id: "m12-q-04", modulo: 12, texto: "¿En qué plazo debe publicarse el acto expropiatorio en el Diario Oficial?", opciones: ["Diez días", "Treinta días", "Noventa días desde la fecha del acto", "No hay plazo"], correcta: 2, porque: "Art. 7 DL 2.186; la notificación se perfecciona con la publicación.", norma: "Art. 7 DL 2.186", fuente: "proceadmin" },
    { id: "m12-q-05", modulo: 12, texto: "¿Cuál es el plazo para reclamar la legalidad del acto expropiatorio?", opciones: ["Treinta días desde la publicación en el Diario Oficial", "Treinta días desde la toma de posesión material", "Dos años desde la notificación", "Cuatro años desde el acto"], correcta: 0, porque: "Art. 9 DL 2.186, en juicio sumario; vencido el plazo, el derecho se extingue.", norma: "Art. 9 DL 2.186", fuente: "proceadmin" },
    { id: "m12-q-06", modulo: 12, texto: "¿Hasta cuándo se puede reclamar el monto de la indemnización?", opciones: ["Hasta la publicación del acto", "Hasta treinta días después de la toma de posesión material", "Hasta la sentencia de legalidad", "Hasta un año después del acto"], correcta: 1, porque: "Art. 12 DL 2.186: desde la notificación hasta el trigésimo día siguiente a la toma de posesión.", norma: "Art. 12 DL 2.186", fuente: "proceadmin" },
    { id: "m12-q-07", modulo: 12, texto: "¿Cuándo queda el dominio radicado en el expropiante?", opciones: ["Con la publicación del acto", "Con la inscripción en el Conservador", "Pagada o consignada la indemnización o su cuota de contado, de pleno derecho", "Con la sentencia que fija el monto definitivo"], correcta: 2, porque: "Art. 20 DL 2.186, a título originario; la indemnización subroga al bien.", norma: "Art. 20 DL 2.186", fuente: "proceadmin" },
    { id: "m12-q-08", modulo: 12, texto: "A falta de acuerdo, ¿cómo se paga la indemnización según la Constitución?", opciones: ["En bonos a diez años", "En dinero efectivo al contado", "Con otro inmueble", "En cuotas mensuales"], correcta: 1, porque: "Art. 19 N.º 24 inc. 3 CPR; el DL 2.186 regula los pagos a plazo sólo cuando la ley que autoriza lo permite (art. 16).", norma: "Art. 19 N.º 24 CPR", fuente: "nuevo" },
    { id: "m12-q-09", modulo: 12, texto: "La avenida sólo necesita una franja, pero al vecino le quedan dos metros de sitio. ¿Qué puede pedir?", opciones: ["Nada: la expropiación es parcial", "La expropiación total, dentro de treinta días desde la publicación, si el resto carece de significación económica", "Daño moral", "Que se anule la ley"], correcta: 1, porque: "Art. 9 letra b) DL 2.186.", norma: "Art. 9 DL 2.186", fuente: "proceadmin" },
    { id: "m12-q-10", modulo: 12, texto: "¿Qué pasa si ni el expropiante ni el expropiado reclaman el monto provisional?", opciones: ["El juez lo fija de oficio", "Se tiene por definitivo y ajustado de común acuerdo", "Se reajusta cada año", "Caduca la expropiación"], correcta: 1, porque: "Art. 13 DL 2.186.", norma: "Art. 13 DL 2.186", fuente: "nuevo" },
    { id: "m12-q-11", modulo: 12, texto: "¿Qué estableció Galletué con Fisco (1984)?", opciones: ["Que las limitaciones al dominio nunca se indemnizan", "Que el Estado indemniza cuando una limitación lícita impone un sacrificio patrimonial especial", "Que la araucaria se puede explotar", "Que la expropiación exige dolo"], correcta: 1, porque: "Igualdad ante las cargas públicas (art. 19 N.º 20 CPR); responsabilidad por actividad lícita.", norma: "Art. 19 N.º 20 CPR", fuente: "guia-rpe" },
    { id: "m12-q-12", modulo: 12, texto: "¿Qué debe hacer la entidad expropiante si el expropiado no se allana y no hay acuerdo sobre la entrega?", opciones: ["Entrar con la fuerza pública directamente", "Consignar la cuota de contado y pedir al juez autorización para tomar posesión material", "Esperar la sentencia de monto definitivo", "Publicar un nuevo acto"], correcta: 1, porque: "Art. 21 DL 2.186, previas publicaciones del art. 23; debe instar dentro de sesenta días desde la publicación del acto.", norma: "Art. 21 DL 2.186", fuente: "proceadmin" },
  ],

  orales: [
    {
      id: "m12-o-01", modulo: 12,
      pregunta: "Describa el procedimiento expropiatorio y distinga el reclamo de legalidad del reclamo indemnizatorio.",
      profesor: "Prof. Aldunate",
      claves: ["ley que autoriza, art. 19 N.º 24", "DL 2.186: procedimiento único", "comisión de tres peritos: monto provisional", "acto expropiatorio: DS o resolución, art. 6", "publicación en el Diario Oficial, 90 días", "legalidad: 30 días desde la publicación, art. 9", "monto: hasta 30 días después de la toma de posesión, art. 12", "pago o consignación: dominio al expropiante, art. 20"],
      trampas: ["la municipalidad expropia por ordenanza", "el monto lo fija el alcalde", "ambos reclamos tienen el mismo plazo", "se indemniza el daño moral", "la toma de posesión es antes del pago"],
      modelo: "La expropiación requiere una ley que la autorice por causa de utilidad pública o interés nacional (art. 19 N.º 24 CPR) y se sujeta siempre al DL 2.186. Una comisión de tres peritos fija el monto provisional; el acto expropiatorio (decreto supremo o resolución) individualiza el bien, la ley, la causa, el propietario y el monto, y se publica en extracto en el Diario Oficial dentro de noventa días, con lo que queda notificado. El art. 9 permite reclamar la legalidad dentro de treinta días desde la publicación, en juicio sumario; el art. 12 permite a ambas partes discutir el monto hasta treinta días después de la toma de posesión material. Pagada o consignada la cuota de contado, el dominio pasa al expropiante y procede la toma de posesión.",
      repregunta: "¿Qué puede pedir el expropiado cuando lo que le queda del predio ya no sirve?",
      prioridad: "S", fuente: "proceadmin",
    },
    {
      id: "m12-o-02", modulo: 12,
      pregunta: "Caso práctico: el acto expropiatorio de la franja se publicó, pero el vecino alega que la ley invocada no autoriza expropiar para avenidas y que, además, el precio es bajo. ¿Qué vías tiene y en qué plazos?",
      profesor: "Jueza del Juzgado Civil",
      claves: ["reclamo de legalidad, art. 9 letra a)", "30 días desde la publicación en el Diario Oficial", "juicio sumario; no paraliza salvo orden del juez", "reclamo de monto, art. 12", "hasta 30 días después de la toma de posesión", "cada parte designa un perito", "sin reclamo, el monto provisional queda definitivo"],
      trampas: ["recurso de protección como vía principal", "reclamo de legalidad hasta la toma de posesión", "la invalidación del art. 53 Ley 19.880", "el reclamo de monto suspende la toma de posesión", "la Contraloría fija el precio"],
      modelo: "Son dos carriles distintos. La falta de ley o la no concurrencia de la causa se alegan por el reclamo de legalidad del art. 9 letra a), ante el juez civil, dentro de treinta días desde la publicación del extracto en el Diario Oficial, en juicio sumario; el reclamo no paraliza el procedimiento salvo que el juez lo ordene con antecedentes calificados. El precio se discute por el reclamo del art. 12, que puede deducir cualquiera de las partes desde la notificación hasta treinta días después de la toma de posesión material, designando cada una un perito. Si nadie reclama el monto, la indemnización provisional queda como definitiva (art. 13).",
      repregunta: "¿En qué se distingue la expropiación de la requisición?",
      prioridad: "A", fuente: "iuspublic",
    },
  ],

  columnas: [
    {
      id: "m12-c-01", modulo: 12,
      titulo: "¿Reclamo de legalidad o reclamo de monto?",
      izq: "Legalidad (art. 9)", der: "Monto (art. 12)",
      items: [
        { texto: "Treinta días desde la publicación en el Diario Oficial", lado: 0 },
        { texto: "Desde la notificación hasta treinta días después de la toma de posesión material", lado: 1 },
        { texto: "No concurre la causa legal invocada", lado: 0, porque: "Art. 9 letra a)." },
        { texto: "El precio de los peritos es bajo", lado: 1 },
        { texto: "Lo puede deducir también la entidad expropiante", lado: 1, porque: "Art. 12: expropiante y expropiado." },
        { texto: "Pedir la expropiación total del bien", lado: 0, porque: "Art. 9 letra b)." },
        { texto: "Se tramita en juicio sumario", lado: 0 },
        { texto: "Cada parte designa un perito", lado: 1, porque: "Art. 14." },
        { texto: "Falta de ley que autorice la expropiación", lado: 0 },
        { texto: "Si nadie lo deduce, el monto provisional queda definitivo", lado: 1, porque: "Art. 13." },
      ],
      norma: "Arts. 9, 12, 13 y 14 DL 2.186", fuente: "proceadmin",
    },
    {
      id: "m12-c-02", modulo: 12,
      titulo: "¿Expropiación o limitación al dominio?",
      izq: "Expropiación", der: "Limitación (función social)",
      items: [
        { texto: "Priva del bien o de atributos esenciales del dominio", lado: 0, porque: "Art. 19 N.º 24 inc. 3 CPR." },
        { texto: "Regula el uso sin privar del bien", lado: 1, porque: "Art. 19 N.º 24 inc. 2 CPR." },
        { texto: "Exige ley que autorice y causa de utilidad pública o interés nacional", lado: 0 },
        { texto: "Se funda en los intereses generales, la seguridad nacional, la utilidad y salubridad públicas o el patrimonio ambiental", lado: 1 },
        { texto: "Siempre con indemnización del daño patrimonial", lado: 0 },
        { texto: "En principio no se indemniza, salvo sacrificio especial (Galletué)", lado: 1 },
        { texto: "Peritos, acto expropiatorio y publicación en el Diario Oficial", lado: 0, porque: "DL 2.186." },
        { texto: "Prohibición de explotar una especie declarada monumento natural", lado: 1, porque: "El supuesto de Galletué." },
      ],
      norma: "Art. 19 N.º 24 incs. 2 y 3 CPR", fuente: "nuevo",
    },
  ],

  cadenas: [
    {
      id: "m12-k-01", modulo: 12,
      titulo: "Las etapas de la expropiación",
      pasos: [
        "Ley que autoriza la expropiación por causa de utilidad pública o interés nacional",
        "Resolución de estudio (opcional): el bien queda incomerciable por noventa días",
        "Comisión de tres peritos fija el monto provisional",
        "Acto expropiatorio: decreto supremo o resolución con las menciones del art. 6",
        "Publicación en extracto en el Diario Oficial dentro de noventa días: queda notificado",
        "Reclamo de legalidad: treinta días desde la publicación, en juicio sumario",
        "Pago o consignación de la cuota de contado: el dominio pasa al expropiante",
        "Toma de posesión material con autorización judicial; reclamo de monto hasta treinta días después",
      ],
      nota: "Sin ley no hay paso 1, y sin pago no hay paso 8: la Constitución cuida las dos puntas.",
      norma: "Art. 19 N.º 24 CPR; arts. 1, 2, 4, 6, 7, 9, 12, 20 y 21 DL 2.186", fuente: "proceadmin",
    },
  ],

  expedientes: [
    {
      id: "m12-exp-sin-ley", modulo: 12,
      titulo: "La avenida por decreto",
      relato: "La Alcaldesa Ruperta Cañas quiere la Avenida Potestas lista antes de las elecciones. Trae firmado un decreto que «expropia» la franja de doce casas del barrio, invocando sólo la ordenanza de urbanismo local.",
      documento: { tipo: "Decreto alcaldicio N.º 500", campos: [
        { k: "Órgano", v: "Alcaldesa de Potestas" },
        { k: "Dispone", v: "Expropia franja de 6 m en doce predios del barrio La Franja" },
        { k: "Norma invocada", v: "Ordenanza municipal de urbanismo N.º 4" },
        { k: "Causa", v: "«Utilidad pública: nueva avenida»" },
        { k: "Monto provisional", v: "No indica" },
        { k: "Comisión de peritos", v: "No se constituyó" },
      ] },
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "NULO: SIN LEY QUE AUTORICE LA EXPROPIACIÓN", correcto: true, porque: "Nadie puede ser privado de su propiedad sino en virtud de una ley general o especial que autorice la expropiación, con causa calificada por el legislador (art. 19 N.º 24 inc. 3 CPR). Una ordenanza no es ley, y además falta la comisión de peritos y el monto provisional (arts. 4 y 6 DL 2.186)." },
        { texto: "VÁLIDO: LA UTILIDAD PÚBLICA ES EVIDENTE", correcto: false, porque: "La causa la califica el legislador en una ley, no la alcaldesa en un decreto (art. 19 N.º 24 CPR)." },
        { texto: "SUBSANAR AGREGANDO EL MONTO", correcto: false, porque: "El monto es una de varias faltas; la raíz es la ausencia de ley habilitante, que no se subsana." },
        { texto: "PUBLICAR Y ESPERAR RECLAMOS", correcto: false, porque: "Publicar un acto sin ley habilitante sólo multiplica los reclamos de legalidad del art. 9 letra a)." },
      ],
      norma: "Art. 19 N.º 24 inc. 3 CPR; arts. 1, 4 y 6 DL 2.186", fuente: "nuevo", hallazgo: "m12-ley",
    },
    {
      id: "m12-exp-valido", modulo: 12,
      titulo: "El acto expropiatorio bien hecho",
      relato: "Esta vez la expropiación de la franja viene autorizada por la ley que corresponde, y la Dirección de Obras preparó la resolución con todo lo que pide el DL 2.186. La Alcaldesa pide el sello antes de mandarla al Diario Oficial.",
      documento: { tipo: "Resolución expropiatoria N.º 12", campos: [
        { k: "Órgano", v: "Municipalidad de Potestas, previo acuerdo del concejo" },
        { k: "Ley que autoriza y causa", v: "Ley general habilitante; causa de utilidad pública: apertura de avenida" },
        { k: "Bien", v: "Franja de 6 m del lote 14, rol de avalúo 123-45, propietario individualizado" },
        { k: "Monto provisional", v: "$ 48.000.000, fijado por comisión de tres peritos; informe de hace 12 días" },
        { k: "Forma de pago", v: "De contado, en dinero efectivo" },
        { k: "Fecha", v: "Hoy; publicación en extracto programada dentro de 90 días" },
      ] },
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "VÁLIDO: CUMPLE EL ART. 6 DEL DL 2.186", correcto: true, porque: "Tiene fecha, individualización del bien y rol de avalúo, ley y causa, propietario, monto provisional con comisión y fecha del informe, y forma de pago (art. 6 DL 2.186); la publicación dentro de noventa días perfecciona la notificación (art. 7)." },
        { texto: "NULO: EL MONTO LO DEBE FIJAR EL JUEZ", correcto: false, porque: "El monto provisional lo fija la comisión de peritos (arts. 4 y 5); el juez interviene sólo si alguien reclama el monto (art. 12)." },
        { texto: "FALTA LA ESCRITURA PÚBLICA", correcto: false, porque: "La escritura pública es para el acuerdo de indemnización (art. 11), no para el acto expropiatorio." },
        { texto: "FALTA EL PAGO ANTES DE DICTARLO", correcto: false, porque: "El pago o consignación viene después del acto y antes de la toma de posesión (arts. 20 y 21)." },
      ],
      norma: "Arts. 6 y 7 DL 2.186", fuente: "nuevo", hallazgo: "m12-acto",
    },
    {
      id: "m12-exp-reclamo-tarde", modulo: 12,
      titulo: "El reclamo de los cuarenta y cinco días",
      relato: "Doña Clotilde, dueña de una de las casas de la franja, presenta un reclamo de legalidad cuarenta y cinco días después de la publicación del extracto en el Diario Oficial. Dice que la causa invocada no corresponde y que el precio es una miseria.",
      documento: { tipo: "Reclamación judicial del expropiado", campos: [
        { k: "Reclamante", v: "Clotilde Barraza, expropiada" },
        { k: "Publicación del acto", v: "Hace 45 días, Diario Oficial" },
        { k: "Pide", v: "Dejar sin efecto la expropiación por no concurrir la causa; subir el monto" },
        { k: "Toma de posesión material", v: "Aún no se produce" },
        { k: "Tribunal", v: "Juzgado Civil de Potestas" },
      ] },
      pregunta: "¿Qué informas al tribunal, como abogado de la municipalidad?",
      sellos: [
        { texto: "LEGALIDAD EXTEMPORÁNEA (30 DÍAS, ART. 9); EL MONTO AÚN SE PUEDE RECLAMAR (ART. 12)", correcto: true, porque: "El reclamo de legalidad vence a los treinta días desde la publicación y el derecho se extingue (art. 9 DL 2.186). El reclamo del monto corre hasta treinta días después de la toma de posesión material (art. 12), así que esa parte sigue viva." },
        { texto: "TODO EXTEMPORÁNEO", correcto: false, porque: "El plazo del art. 12 para el monto no ha vencido: la toma de posesión ni siquiera se ha producido." },
        { texto: "TODO EN PLAZO", correcto: false, porque: "La legalidad se reclama dentro de treinta días desde la publicación (art. 9); pasaron cuarenta y cinco." },
        { texto: "INVALIDAR EL ACTO POR EL ART. 53 DE LA LEY 19.880", correcto: false, porque: "El DL 2.186 es procedimiento especial con sus propios reclamos judiciales; además no hay vicio acreditado." },
      ],
      norma: "Arts. 9 y 12 DL 2.186", fuente: "nuevo", hallazgo: "m12-reclamos",
    },
    {
      id: "m12-exp-toma-sin-pago", modulo: 12,
      titulo: "Las máquinas llegaron antes que el cheque",
      relato: "Don Lalo Fuentes, Director de Obras, quiere entrar mañana con la retroexcavadora a la franja: «el acto ya se publicó y los vecinos no reclamaron». Nada se ha pagado ni consignado.",
      documento: { tipo: "Orden de inicio de obras", campos: [
        { k: "Obra", v: "Apertura de Avenida Potestas, tramo 1" },
        { k: "Acto expropiatorio", v: "Publicado hace 20 días" },
        { k: "Pago o consignación", v: "Ninguno" },
        { k: "Acuerdo con los expropiados", v: "No hay" },
        { k: "Autorización judicial", v: "No se pidió" },
      ] },
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "NO: LA TOMA DE POSESIÓN ES PREVIO PAGO (19 N.º 24; ARTS. 20 Y 21)", correcto: true, porque: "La toma de posesión material tiene lugar previo pago del total de la indemnización (art. 19 N.º 24 inc. 3 CPR). Sin acuerdo, hay que consignar la cuota de contado ante el tribunal y pedir al juez la autorización (arts. 17, 20 y 21 DL 2.186)." },
        { texto: "ADELANTE: EL ACTO ESTÁ PUBLICADO Y NO HUBO RECLAMOS", correcto: false, porque: "La publicación notifica; no transfiere el dominio ni autoriza entrar (arts. 7 y 20 DL 2.186)." },
        { texto: "ADELANTE, PERO CON CARABINEROS", correcto: false, porque: "La fuerza pública la ordena el juez al autorizar la toma de posesión, después de la consignación (art. 21)." },
        { texto: "ESPERAR LA SENTENCIA DE MONTO DEFINITIVO", correcto: false, porque: "No hace falta: consignada la cuota de contado, el juez puede autorizar la toma de posesión aunque el monto se discuta después (arts. 12 y 21)." },
      ],
      norma: "Art. 19 N.º 24 inc. 3 CPR; arts. 20 y 21 DL 2.186", fuente: "nuevo", hallazgo: "m12-dominio",
    },
    {
      id: "m12-exp-resto-inutil", modulo: 12,
      titulo: "Los dos metros que sobran",
      relato: "A don Aurelio le expropian seis de los ocho metros de frente de su sitio. Lo que le queda no sirve ni para estacionar. Viene a Jurídica a preguntar qué puede hacer; el extracto se publicó hace diez días.",
      documento: { tipo: "Consulta del expropiado", campos: [
        { k: "Predio", v: "Sitio de 8 m de frente por 20 m de fondo" },
        { k: "Franja expropiada", v: "6 m de frente, todo el fondo" },
        { k: "Resto", v: "2 m de frente: sin significación económica" },
        { k: "Publicación del acto", v: "Hace 10 días" },
        { k: "Pretensión", v: "Que le expropien todo o le paguen el sitio completo" },
      ] },
      pregunta: "¿Qué le recomiendas?",
      sellos: [
        { texto: "PEDIR LA EXPROPIACIÓN TOTAL (ART. 9 b) DENTRO DE LOS 30 DÍAS", correcto: true, porque: "Cuando la parte no expropiada carece por sí sola de significación económica, el expropiado puede pedir al juez la expropiación total, dentro de treinta días desde la publicación (art. 9 letra b) DL 2.186). Quedan veinte días." },
        { texto: "RECLAMAR SÓLO EL MONTO", correcto: false, porque: "Subir el precio de la franja no resuelve que el resto no sirva; la vía es la expropiación total (art. 9 b)." },
        { texto: "ESPERAR LA TOMA DE POSESIÓN PARA RECLAMAR", correcto: false, porque: "Esperar hace perder el plazo de treinta días del art. 9; sólo el reclamo de monto sobrevive hasta después de la toma de posesión (art. 12)." },
        { texto: "RECURSO DE PROTECCIÓN", correcto: false, porque: "El DL 2.186 contempla el reclamo específico del art. 9 para esta situación." },
      ],
      norma: "Art. 9 letra b) DL 2.186", fuente: "proceadmin", hallazgo: "m12-reclamos",
    },
    {
      id: "m12-exp-dano-moral", modulo: 12,
      titulo: "La casa de la abuela",
      relato: "Una vecina reclama el monto de la indemnización y pide, además de la tasación, cincuenta millones por «daño moral»: la casa fue de su abuela y allí nació. El abogado del CDE que asesora a la municipalidad te pide la respuesta.",
      documento: { tipo: "Reclamo del monto de la indemnización (art. 12)", campos: [
        { k: "Reclamante", v: "Expropiada, dueña de la casa" },
        { k: "Monto provisional", v: "$ 61.000.000" },
        { k: "Pide", v: "$ 80.000.000 por el inmueble más $ 50.000.000 por daño moral" },
        { k: "Plazo", v: "Dentro del art. 12" },
        { k: "Perito designado", v: "Sí" },
      ] },
      pregunta: "¿Qué sello le pones a la partida de daño moral?",
      sellos: [
        { texto: "SÓLO DAÑO PATRIMONIAL EFECTIVAMENTE CAUSADO (19 N.º 24; ART. 38 DL 2.186)", correcto: true, porque: "La indemnización expropiatoria es el daño patrimonial efectivamente causado, consecuencia directa e inmediata de la expropiación (art. 19 N.º 24 CPR; art. 38 DL 2.186). El valor del inmueble se discute con peritos; el daño moral queda fuera." },
        { texto: "PROCEDE: LA RESPONSABILIDAD DEL ESTADO ES INTEGRAL", correcto: false, porque: "La integralidad vale para la falta de servicio; la expropiación es la excepción expresa (art. 19 N.º 24 CPR)." },
        { texto: "RECHAZAR TODO EL RECLAMO POR EXTEMPORÁNEO", correcto: false, porque: "El reclamo de monto está dentro del plazo del art. 12; sólo la partida de daño moral es improcedente." },
        { texto: "PAGAR LA MITAD DEL DAÑO MORAL POR EQUIDAD", correcto: false, porque: "La ley define la indemnización y no deja espacio para partidas extrapatrimoniales (art. 38 DL 2.186)." },
      ],
      norma: "Art. 19 N.º 24 inc. 3 CPR; art. 38 DL 2.186", fuente: "nuevo", hallazgo: "m12-indemnizacion",
    },
  ],
};

// PENDIENTE DE REVISIÓN: el DL 2.186 se descargó de la BCN (idNorma 6848, versión 1992-10-02) y se citó
// por su texto; los apuntes (iuspublic c-expr) dicen que «si no se publica dentro de 90 días, el acto
// caduca», pero el art. 7 sólo fija el plazo y la única caducidad expresa es la del art. 9 inc. 2 (acto
// adicional no dictado en 90 días) y la pérdida de efecto del art. 21 (no instar la toma de posesión en
// 60 días): esa consecuencia no se afirmó. La distinción expropiación/requisición es doctrinal. Galletué
// (1984, rol 16.743) viene de guia-rpe y no se contrastó con el Poder Judicial. La competencia municipal
// para expropiar depende de la ley sectorial que autorice (no verificada aquí): los expedientes hablan de
// «la ley que corresponde» sin citarla.
