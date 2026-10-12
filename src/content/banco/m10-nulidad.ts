// Módulo 10 · Nulo de pleno derecho · Nulidad de derecho público, invalidación y revocación.
// Fuentes: iuspublic (definiciones, columnas, comisión, Domic Bezic), ACTO-ADMIN (anulabilidad
// vs. nulidad ipso iure, principios de la nulidad), más contenido nuevo para el juego. Normas
// verificadas contra los XML de la BCN el 12-10-2026: CPR arts. 6, 7 y 38; Ley 19.880 arts. 3,
// 13, 51, 53 y 61; Ley 18.695 art. 12; CC art. 2332. Ojo: en el texto vigente del art. 13 de la
// Ley 19.880 la regla del vicio de forma es el inciso 3 y la subsanación el inciso 4 (el inciso 2
// prohíbe exigir autorizaciones notariales).
import type { BancoModulo } from "../tipos";

export const BANCO_M10: BancoModulo = {
  modulo: 10,

  hallazgos: [
    {
      id: "m10-ndp", modulo: 10,
      titulo: "Todo acto en contravención es nulo",
      texto: "Los órganos del Estado actúan válidamente con investidura regular, dentro de su competencia y en la forma que prescribe la ley. El acto que contraviene eso es nulo y origina responsabilidades: esa es la nulidad de derecho público, y la declara el juez.",
      norma: "Art. 7 incs. 1 y 3 CPR; art. 38 inc. 2 CPR",
      simple: "La Constitución no pide permiso para anular: el juez sólo le pone la firma.",
    },
    {
      id: "m10-invalidacion", modulo: 10,
      titulo: "Invalidar: la Administración se corrige sola",
      texto: "La autoridad administrativa puede, de oficio o a petición de parte, invalidar sus actos contrarios a derecho, previa audiencia del interesado, siempre que lo haga dentro de los dos años desde la notificación o publicación. El acto invalidatorio es siempre impugnable ante los tribunales en procedimiento breve y sumario.",
      norma: "Art. 53 Ley 19.880",
      simple: "La Administración también tiene fecha de vencimiento: dos años para arrepentirse.",
    },
    {
      id: "m10-revocacion", modulo: 10,
      titulo: "Revocar no es invalidar",
      texto: "La revocación la hace el mismo órgano que dictó el acto por razones de mérito, oportunidad o conveniencia, sin que haya vicio. No procede contra actos declarativos o creadores de derechos adquiridos legítimamente, cuando la ley fijó otra forma de extinción o cuando la regulación del acto lo impide.",
      norma: "Art. 61 Ley 19.880",
      simple: "Cambiar de opinión está permitido; quitarle a alguien lo que ya es suyo, no.",
    },
    {
      id: "m10-anulabilidad", modulo: 10,
      titulo: "Presunto legal hasta que alguien diga lo contrario",
      texto: "Los actos administrativos gozan de presunción de legalidad, imperio y exigibilidad desde su entrada en vigencia. Por eso la regla general es la anulabilidad: el acto viciado produce efectos hasta que la Administración lo invalida o el juez lo anula. La nulidad «ipso iure» de Soto Kloss es doctrina.",
      norma: "Art. 3 inc. final Ley 19.880; art. 7 inc. 3 CPR",
      simple: "Nulo de pleno derecho suena contundente, pero el acto sigue funcionando hasta que alguien lo apague.",
    },
    {
      id: "m10-conservacion", modulo: 10,
      titulo: "No toda ilegalidad mata el acto",
      texto: "El vicio de procedimiento o de forma sólo afecta la validez del acto cuando recae en un requisito esencial, por su naturaleza o por mandato del ordenamiento, y además genera perjuicio al interesado. Y la invalidación puede ser parcial: lo invalidado no arrastra las disposiciones independientes.",
      norma: "Art. 13 inc. 3 Ley 19.880; art. 53 inc. 2 Ley 19.880",
      simple: "Un decreto con una coma mal puesta sigue siendo un decreto.",
    },
    {
      id: "m10-subsanacion", modulo: 10,
      titulo: "Subsanar antes que anular",
      texto: "La Administración puede subsanar los vicios de que adolezcan los actos que emita, siempre que con ello no se afecten intereses de terceros. Es la salida barata para los vicios de forma no esenciales.",
      norma: "Art. 13 inc. 4 Ley 19.880",
      simple: "Antes de botar el expediente, prueba a corregirlo: la ley prefiere el corrector al basurero.",
    },
    {
      id: "m10-prescripcion", modulo: 10,
      titulo: "La nulidad no prescribe; la plata sí",
      texto: "Según la Corte Suprema desde Domic Bezic (2002), la acción de nulidad de derecho público es imprescriptible, pero las acciones patrimoniales que derivan de ella prescriben según las reglas del Código Civil (cuatro años para la indemnización).",
      norma: "Art. 7 inc. 3 CPR; art. 2332 CC; Domic Bezic con Fisco (2002, rol 4.753-2001)",
      simple: "Puedes pedir que declaren nulo el decreto de tu abuelo; cobrar por él, ya no.",
    },
  ],

  afirmaciones: [
    { id: "m10-af-01", modulo: 10, hallazgo: "m10-ndp", texto: "La nulidad de derecho público la declara la propia Administración que dictó el acto.", verdad: false, porque: "La declara el juez; la Administración lo que puede es invalidar (art. 7 inc. 3 y art. 38 inc. 2 CPR; art. 53 Ley 19.880)." },
    { id: "m10-af-02", modulo: 10, hallazgo: "m10-ndp", texto: "Investidura regular, competencia y forma legal son requisitos copulativos de validez.", verdad: true, porque: "Art. 7 inc. 1 CPR: los tres deben concurrir; el acto que falla en cualquiera es nulo (inc. 3)." },
    { id: "m10-af-03", modulo: 10, hallazgo: "m10-invalidacion", texto: "La Administración puede invalidar un acto ilegal en cualquier tiempo, porque la ilegalidad no se sanea.", verdad: false, porque: "Sólo dentro de los dos años desde la notificación o publicación (art. 53 Ley 19.880); después, la vía es judicial." },
    { id: "m10-af-04", modulo: 10, hallazgo: "m10-invalidacion", texto: "Antes de invalidar hay que oír al interesado.", verdad: true, porque: "Art. 53 Ley 19.880: «previa audiencia del interesado»." },
    { id: "m10-af-05", modulo: 10, hallazgo: "m10-revocacion", texto: "La revocación procede porque el acto tiene un vicio de legalidad.", verdad: false, porque: "La revocación es por mérito, oportunidad o conveniencia; el vicio se corrige por invalidación (arts. 53 y 61 Ley 19.880)." },
    { id: "m10-af-06", modulo: 10, hallazgo: "m10-revocacion", texto: "No se puede revocar un acto que creó derechos adquiridos legítimamente.", verdad: true, porque: "Art. 61 letra a) Ley 19.880." },
    { id: "m10-af-07", modulo: 10, hallazgo: "m10-anulabilidad", texto: "Un acto con un vicio de competencia deja de producir efectos desde el momento en que se dicta.", verdad: false, porque: "Goza de presunción de legalidad y exigibilidad hasta que se invalide o anule (art. 3 inc. final Ley 19.880); la regla general es la anulabilidad." },
    { id: "m10-af-08", modulo: 10, hallazgo: "m10-anulabilidad", texto: "La presunción de legalidad puede suspenderse por orden de la autoridad administrativa en el procedimiento impugnatorio o por el juez.", verdad: true, porque: "Art. 3 inc. final Ley 19.880: salvo orden de suspensión administrativa o judicial." },
    { id: "m10-af-09", modulo: 10, hallazgo: "m10-conservacion", texto: "Cualquier vicio de forma, por menor que sea, invalida el acto.", verdad: false, porque: "Sólo si recae en un requisito esencial y genera perjuicio al interesado (art. 13 inc. 3 Ley 19.880)." },
    { id: "m10-af-10", modulo: 10, hallazgo: "m10-conservacion", texto: "La invalidación de un artículo del decreto no afecta las disposiciones que sean independientes de él.", verdad: true, porque: "Art. 53 inc. 2 Ley 19.880: invalidación total o parcial; la parcial no afecta lo independiente." },
    { id: "m10-af-11", modulo: 10, hallazgo: "m10-subsanacion", texto: "La Administración puede subsanar un vicio de su acto aunque con ello perjudique a un tercero.", verdad: false, porque: "Art. 13 inc. 4 Ley 19.880: sólo «siempre que con ello no se afectaren intereses de terceros»." },
    { id: "m10-af-12", modulo: 10, hallazgo: "m10-subsanacion", texto: "El principio de no formalización pide que las formalidades sean sólo las indispensables para dejar constancia de lo actuado y evitar perjuicios.", verdad: true, porque: "Art. 13 inc. 1 Ley 19.880." },
    { id: "m10-af-13", modulo: 10, hallazgo: "m10-prescripcion", texto: "Si el acto es nulo de derecho público, la indemnización que deriva de esa nulidad también es imprescriptible.", verdad: false, porque: "Domic Bezic (2002): la acción de nulidad no prescribe, pero las acciones patrimoniales sí, según el Código Civil." },
    { id: "m10-af-14", modulo: 10, hallazgo: "m10-prescripcion", texto: "Para la Corte Suprema, la acción de nulidad de derecho público es imprescriptible.", verdad: true, porque: "Así lo sostuvo en Domic Bezic (2002, rol 4.753-2001), distinguiéndola de las acciones patrimoniales." },
  ],

  fichas: [
    { id: "m10-f-01", modulo: 10, frente: "Nulidad de derecho público (NDP)", dorso: "Sanción de ineficacia jurídica que priva de efectos al acto de un órgano del Estado dictado en contravención a los requisitos de validez del art. 7 de la Constitución: investidura regular, competencia y forma legal.", norma: "Art. 7 CPR", etiqueta: "conceptos", prioridad: "S", fuente: "iuspublic" },
    { id: "m10-f-02", modulo: 10, frente: "Invalidación administrativa", dorso: "Potestad de autotutela por la cual la propia Administración deja sin efecto un acto contrario a derecho que ella dictó: de oficio o a petición de parte, previa audiencia del interesado, dentro de dos años desde la notificación o publicación.", norma: "Art. 53 Ley 19.880", etiqueta: "conceptos", prioridad: "S", fuente: "iuspublic" },
    { id: "m10-f-03", modulo: 10, frente: "Revocación", dorso: "El órgano que dictó el acto lo deja sin efecto por mérito, oportunidad o conveniencia; opera hacia el futuro. No procede contra actos declarativos o creadores de derechos adquiridos legítimamente, si la ley fijó otra forma de extinción o si la regulación del acto lo impide.", norma: "Art. 61 Ley 19.880", etiqueta: "conceptos", prioridad: "S", fuente: "acto-admin" },
    { id: "m10-f-04", modulo: 10, frente: "Art. 7 inc. 1 CPR", dorso: "«Los órganos del Estado actúan válidamente previa investidura regular de sus integrantes, dentro de su competencia y en la forma que prescriba la ley.» Tres requisitos copulativos.", norma: "Art. 7 inc. 1 CPR", etiqueta: "normas", prioridad: "S", fuente: "iuspublic" },
    { id: "m10-f-05", modulo: 10, frente: "Art. 7 inc. 3 CPR", dorso: "«Todo acto en contravención a este artículo es nulo y originará las responsabilidades y sanciones que la ley señale.» Fundamento de la NDP.", norma: "Art. 7 inc. 3 CPR", etiqueta: "normas", prioridad: "S", fuente: "iuspublic" },
    { id: "m10-f-06", modulo: 10, frente: "Presunción de legalidad", dorso: "Los actos administrativos gozan de presunción de legalidad, imperio y exigibilidad desde su entrada en vigencia, y se ejecutan de oficio salvo orden de suspensión administrativa (en el procedimiento impugnatorio) o judicial.", norma: "Art. 3 inc. final Ley 19.880", etiqueta: "normas", prioridad: "S", fuente: "acto-admin" },
    { id: "m10-f-07", modulo: 10, frente: "Nulidad ipso iure vs. anulabilidad", dorso: "En la nulidad de pleno derecho validez y eficacia van juntas: el acto nulo no produce efecto alguno. En la anulabilidad son independientes: el acto viciado produce efectos hasta que se declare su ilegalidad. La regla general en Chile es la anulabilidad.", norma: "Art. 3 inc. final Ley 19.880", etiqueta: "doctrina", prioridad: "S", fuente: "acto-admin" },
    { id: "m10-f-08", modulo: 10, frente: "La tesis de Soto Kloss", dorso: "La NDP opera ipso iure, es insanable, imprescriptible y retroactiva. La doctrina mayoritaria y la Ley 19.880 la reconducen a la anulabilidad: el acto produce efectos hasta su declaración, y la Corte Suprema exige sentencia.", norma: "Art. 7 inc. 3 CPR (doctrina)", etiqueta: "doctrina", prioridad: "A", fuente: "iuspublic" },
    { id: "m10-f-09", modulo: 10, frente: "¿Quién declara qué?", dorso: "Invalidación: la propia Administración (art. 53). Revocación: el órgano que dictó el acto (art. 61). Nulidad de derecho público: el juez, por vía jurisdiccional (art. 7 inc. 3 y art. 38 inc. 2 CPR).", norma: "Arts. 53 y 61 Ley 19.880; art. 38 inc. 2 CPR", etiqueta: "comparación", prioridad: "S", fuente: "iuspublic" },
    { id: "m10-f-10", modulo: 10, frente: "Plazos", dorso: "Invalidación: dos años desde la notificación o publicación, plazo que la doctrina llama de caducidad. Acción de NDP: imprescriptible según la CS (Domic Bezic, 2002). Acciones patrimoniales derivadas: prescriben según el Código Civil.", norma: "Art. 53 Ley 19.880; art. 2332 CC", etiqueta: "comparación", prioridad: "S", fuente: "iuspublic" },
    { id: "m10-f-11", modulo: 10, frente: "Efectos en el tiempo", dorso: "La invalidación y la nulidad miran al pasado (ex tunc): el acto se tiene por ilegal desde su origen. La revocación mira al futuro (ex nunc): el acto fue válido y deja de regir desde la revocación.", norma: "Arts. 53 y 61 Ley 19.880 (doctrina)", etiqueta: "comparación", prioridad: "A", fuente: "acto-admin" },
    { id: "m10-f-12", modulo: 10, frente: "Principio de trascendencia", dorso: "El vicio de procedimiento o de forma sólo afecta la validez del acto cuando recae en un requisito esencial, por su naturaleza o por mandato del ordenamiento jurídico, y genera perjuicio al interesado.", norma: "Art. 13 inc. 3 Ley 19.880", etiqueta: "principios", prioridad: "S", fuente: "acto-admin" },
    { id: "m10-f-13", modulo: 10, frente: "Principio de conservación", dorso: "La invalidación puede ser total o parcial; la parcial no afecta las disposiciones independientes de la parte invalidada. Se prefiere salvar lo que se pueda del acto.", norma: "Art. 53 inc. 2 Ley 19.880", etiqueta: "principios", prioridad: "A", fuente: "acto-admin" },
    { id: "m10-f-14", modulo: 10, frente: "Subsanación (convalidación)", dorso: "La Administración puede subsanar los vicios de los actos que emita, siempre que no afecte intereses de terceros. Sirve para vicios de forma no esenciales; un acto sin competencia o sin investidura no se arregla con una firma posterior.", norma: "Art. 13 inc. 4 Ley 19.880", etiqueta: "principios", prioridad: "A", fuente: "nuevo" },
    { id: "m10-f-15", modulo: 10, frente: "Control judicial del acto invalidatorio", dorso: "El acto invalidatorio es siempre impugnable ante los Tribunales de Justicia, en procedimiento breve y sumario.", norma: "Art. 53 inc. 3 Ley 19.880", etiqueta: "normas", prioridad: "A", fuente: "nuevo" },
    { id: "m10-f-16", modulo: 10, frente: "Vicio de investidura", dorso: "Actúa por el órgano alguien sin nombramiento válido, que no ha asumido o cuyo nombramiento fue anulado. La «teoría del funcionario de hecho» puede atenuar los efectos frente a terceros de buena fe (doctrina).", norma: "Art. 7 inc. 1 CPR", etiqueta: "vicios", prioridad: "A", fuente: "acto-admin" },
    { id: "m10-f-17", modulo: 10, frente: "Vicio de incompetencia", dorso: "El órgano actúa fuera de sus atribuciones: en materia ajena (material), fuera de su territorio (territorial) o en un nivel que no le corresponde (de grado). Nadie puede atribuirse otra autoridad que la conferida expresamente.", norma: "Art. 7 incs. 1 y 2 CPR", etiqueta: "vicios", prioridad: "A", fuente: "acto-admin" },
    { id: "m10-f-18", modulo: 10, frente: "Domic Bezic con Fisco (2002) y la NDP", dorso: "La acción de nulidad es imprescriptible, pero las acciones patrimoniales que derivan de ella prescriben por las reglas del Código Civil (cuatro años para la indemnización).", norma: "Rol 4.753-2001; art. 2332 CC", etiqueta: "casos", prioridad: "S", fuente: "iuspublic" },
    { id: "m10-f-19", modulo: 10, frente: "¿Por qué la invalidación le restó importancia a la NDP?", dorso: "Porque la Administración puede corregir sola sus actos ilegales dentro de dos años, con audiencia previa y control judicial posterior: muchos vicios se resuelven sin juicio ordinario (doctrina).", norma: "Art. 53 Ley 19.880", etiqueta: "doctrina", prioridad: "B", fuente: "iuspublic" },
    { id: "m10-f-20", modulo: 10, frente: "Resoluciones municipales", dorso: "Ordenanzas (normas generales para la comunidad; multas hasta 5 UTM aplicadas por el juzgado de policía local), reglamentos municipales (orden interno), decretos alcaldicios (casos particulares) e instrucciones (directivas a subalternos).", norma: "Art. 12 Ley 18.695", etiqueta: "normas", prioridad: "B", fuente: "nuevo" },
  ],

  quiz: [
    { id: "m10-q-01", modulo: 10, texto: "¿Qué consecuencia fija el art. 7 CPR para el acto dictado sin investidura, competencia o forma legal?", opciones: ["Anulabilidad que debe declarar la Contraloría", "Es nulo y origina las responsabilidades y sanciones que la ley señale", "Sólo responsabilidad disciplinaria", "Suspensión hasta la toma de razón"], correcta: 1, porque: "Art. 7 inc. 3 CPR. La doctrina clásica lo lee como nulidad de pleno derecho; la jurisprudencia exige declaración judicial.", norma: "Art. 7 inc. 3 CPR", fuente: "guia-rpe" },
    { id: "m10-q-02", modulo: 10, texto: "¿Cuál es el plazo para que la Administración invalide un acto contrario a derecho?", opciones: ["Cinco años desde que quedó firme", "No hay plazo: la ilegalidad no se sanea", "Dos años desde la notificación o publicación del acto", "Un año desde que conoció el vicio"], correcta: 2, porque: "Art. 53 Ley 19.880. Pasado el plazo, la Administración pierde la potestad y sólo queda la vía judicial.", norma: "Art. 53 Ley 19.880", fuente: "acto-admin" },
    { id: "m10-q-03", modulo: 10, texto: "¿En qué se diferencian la invalidación y la revocación?", opciones: ["Sólo en el plazo", "La invalidación procede por ilegalidad y mira al pasado; la revocación por mérito y mira al futuro", "La revocación exige audiencia previa y la invalidación no", "Son lo mismo ante órganos distintos"], correcta: 1, porque: "Arts. 53 y 61 Ley 19.880: una corrige un vicio, la otra cambia una decisión válida que dejó de convenir.", norma: "Arts. 53 y 61 Ley 19.880", fuente: "acto-admin" },
    { id: "m10-q-04", modulo: 10, texto: "¿Cuál es la regla general del sistema de nulidad en la Ley 19.880?", opciones: ["La nulidad de pleno derecho", "La anulabilidad: los actos se presumen legales y producen efectos hasta que se declare su ilegalidad", "Todo vicio produce nulidad", "Sólo la Administración puede dejar sin efecto sus actos"], correcta: 1, porque: "Art. 3 inc. final Ley 19.880 (presunción de legalidad). Sólo las violaciones groseras permitirían hablar de nulidad de pleno derecho.", norma: "Art. 3 inc. final Ley 19.880", fuente: "acto-admin" },
    { id: "m10-q-05", modulo: 10, texto: "¿Cuándo un vicio de forma afecta la validez del acto?", opciones: ["Siempre", "Sólo cuando recae en un requisito esencial y genera perjuicio al interesado", "Sólo si el interesado lo alega en un recurso", "Nunca"], correcta: 1, porque: "Art. 13 inc. 3 Ley 19.880: esencialidad (por naturaleza o por mandato del ordenamiento) más perjuicio.", norma: "Art. 13 inc. 3 Ley 19.880", fuente: "acto-admin" },
    { id: "m10-q-06", modulo: 10, texto: "¿Quién declara la nulidad de derecho público?", opciones: ["La Contraloría al tomar razón", "La propia Administración, de oficio", "El juez, por vía jurisdiccional", "El Tribunal Constitucional"], correcta: 2, porque: "La NDP se obtiene ante los tribunales (art. 7 inc. 3 y art. 38 inc. 2 CPR); lo que hace la Administración es invalidar (art. 53 Ley 19.880).", norma: "Art. 7 inc. 3 CPR", fuente: "iuspublic" },
    { id: "m10-q-07", modulo: 10, texto: "Según Domic Bezic (2002), ¿qué prescribe y qué no?", opciones: ["Todo prescribe en cuatro años", "Nada prescribe: la nulidad es constitucional", "La acción de nulidad es imprescriptible; las acciones patrimoniales prescriben según el Código Civil", "La acción de nulidad prescribe en dos años"], correcta: 2, porque: "La CS separó la declaración de nulidad (imprescriptible) de sus consecuencias patrimoniales (prescriptibles, art. 2332 CC).", norma: "Art. 2332 CC", fuente: "iuspublic" },
    { id: "m10-q-08", modulo: 10, texto: "¿Contra qué actos no procede la revocación?", opciones: ["Contra los actos de trámite", "Contra los actos declarativos o creadores de derechos adquiridos legítimamente", "Contra los decretos alcaldicios", "Contra los actos notificados"], correcta: 1, porque: "Art. 61 letra a) Ley 19.880; también cuando la ley fijó otra forma de extinción o la naturaleza del acto lo impide.", norma: "Art. 61 Ley 19.880", fuente: "acto-admin" },
    { id: "m10-q-09", modulo: 10, texto: "¿Qué puede hacer la Administración con un vicio de forma no esencial de un acto propio?", opciones: ["Nada: sólo el juez lo corrige", "Subsanarlo, siempre que no afecte intereses de terceros", "Revocarlo por mérito", "Esperar dos años a que caduque"], correcta: 1, porque: "Art. 13 inc. 4 Ley 19.880.", norma: "Art. 13 inc. 4 Ley 19.880", fuente: "nuevo" },
    { id: "m10-q-10", modulo: 10, texto: "La Alcaldesa invalida sólo el artículo 3 de una ordenanza. ¿Qué pasa con el resto?", opciones: ["Cae completa: la invalidación es siempre total", "Sigue vigente en lo que sea independiente de la parte invalidada", "Queda suspendido hasta nueva ordenanza", "Debe revocarse"], correcta: 1, porque: "Art. 53 inc. 2 Ley 19.880: invalidación total o parcial; la parcial no afecta las disposiciones independientes.", norma: "Art. 53 inc. 2 Ley 19.880", fuente: "nuevo" },
    { id: "m10-q-11", modulo: 10, texto: "¿Qué recurso tiene el afectado contra el acto que invalida?", opciones: ["Ninguno: la invalidación es definitiva", "Impugnarlo ante los Tribunales de Justicia en procedimiento breve y sumario", "Sólo el recurso de reposición", "Requerimiento al Tribunal Constitucional"], correcta: 1, porque: "Art. 53 inc. 3 Ley 19.880: el acto invalidatorio es siempre impugnable judicialmente.", norma: "Art. 53 inc. 3 Ley 19.880", fuente: "nuevo" },
    { id: "m10-q-12", modulo: 10, texto: "¿Qué trámite exige el art. 53 antes de invalidar?", opciones: ["Informe de Contraloría", "Audiencia previa del interesado", "Acuerdo del concejo", "Publicación en el Diario Oficial"], correcta: 1, porque: "Art. 53 inc. 1 Ley 19.880: «previa audiencia del interesado».", norma: "Art. 53 Ley 19.880", fuente: "iuspublic" },
  ],

  orales: [
    {
      id: "m10-o-01", modulo: 10,
      pregunta: "Explique la naturaleza jurídica de la nulidad de derecho público y su fundamento normativo.",
      profesor: "Prof. Bronfman",
      claves: ["art. 7 CPR: investidura, competencia, forma", "sanción de ineficacia", "Soto Kloss: ipso iure, imprescriptible", "presunción de legalidad, art. 3 Ley 19.880", "regla general: anulabilidad", "la declara el juez", "Domic Bezic: acción imprescriptible, patrimoniales no"],
      trampas: ["la declara la Contraloría", "el acto nulo nunca produjo efectos", "la Administración la declara por el art. 53", "prescribe en dos años", "sólo procede por vicios de forma"],
      modelo: "La NDP es la sanción de ineficacia que afecta al acto dictado contra los requisitos del art. 7 CPR: investidura regular, competencia y forma legal; «todo acto en contravención es nulo». Soto Kloss la entiende ipso iure, insanable, retroactiva e imprescriptible. La doctrina mayoritaria y la Ley 19.880, con la presunción de legalidad del art. 3, la reconducen a la anulabilidad: el acto produce efectos hasta que el juez lo declara nulo. La Corte Suprema, desde Domic Bezic (2002), tiene por imprescriptible la acción de nulidad, pero no las acciones patrimoniales.",
      repregunta: "Dijo imprescriptible según Soto Kloss: ¿qué resolvió Domic Bezic sobre la prescripción?",
      prioridad: "S", fuente: "iuspublic",
    },
    {
      id: "m10-o-02", modulo: 10,
      pregunta: "Diferencie la invalidación administrativa de la nulidad de derecho público.",
      profesor: "Prof. Charney",
      claves: ["invalidación: la propia Administración", "art. 53 Ley 19.880", "dos años desde notificación o publicación", "audiencia previa", "NDP: la declara el juez", "art. 7 inc. 3 CPR", "acción imprescriptible (Domic Bezic)", "acto invalidatorio impugnable, breve y sumario"],
      trampas: ["la invalidación es por razones de mérito", "la NDP la declara la Contraloría", "ambas tienen plazo de dos años", "la invalidación no admite control judicial", "la NDP exige acuerdo del concejo"],
      modelo: "La invalidación es autotutela: la propia Administración deja sin efecto su acto contrario a derecho (art. 53 Ley 19.880), de oficio o a petición de parte, previa audiencia del interesado y dentro de dos años desde la notificación o publicación; el acto invalidatorio es impugnable ante los tribunales en procedimiento breve y sumario. La nulidad de derecho público la declara el juez, fundada en el art. 7 inc. 3 CPR, por acción que la Corte Suprema considera imprescriptible (Domic Bezic, 2002), aunque las acciones patrimoniales derivadas sí prescriben. Ambas se distinguen de la revocación, que procede por mérito y no por vicio (art. 61).",
      repregunta: "¿Por qué se dice que la invalidación le ha restado importancia práctica a la NDP?",
      prioridad: "S", fuente: "iuspublic",
    },
  ],

  columnas: [
    {
      id: "m10-c-01", modulo: 10,
      titulo: "Invalidación o nulidad de derecho público",
      izq: "Invalidación", der: "Nulidad de derecho público",
      items: [
        { texto: "La declara la propia Administración", lado: 0, porque: "Art. 53 Ley 19.880." },
        { texto: "La declara el juez", lado: 1, porque: "Art. 7 inc. 3 y art. 38 inc. 2 CPR." },
        { texto: "Art. 53 Ley 19.880", lado: 0 },
        { texto: "Art. 7 inc. 3 de la Constitución", lado: 1 },
        { texto: "Dos años desde la notificación o publicación", lado: 0, porque: "Plazo de caducidad de la potestad." },
        { texto: "La acción es imprescriptible", lado: 1, porque: "Domic Bezic (2002); las acciones patrimoniales sí prescriben." },
        { texto: "Procedimiento administrativo con audiencia previa", lado: 0 },
        { texto: "Juicio ordinario ante tribunales", lado: 1, porque: "No hay procedimiento especial; doctrina." },
        { texto: "Autotutela administrativa", lado: 0 },
        { texto: "Acción contencioso-administrativa general", lado: 1 },
      ],
      norma: "Art. 53 Ley 19.880; art. 7 inc. 3 CPR", fuente: "iuspublic",
    },
    {
      id: "m10-c-02", modulo: 10,
      titulo: "¿Invalidar o revocar?",
      izq: "Invalidación", der: "Revocación",
      items: [
        { texto: "El acto es contrario a derecho", lado: 0, porque: "Art. 53 Ley 19.880." },
        { texto: "El acto es legal, pero dejó de convenir", lado: 1, porque: "Mérito, oportunidad o conveniencia (art. 61)." },
        { texto: "Plazo de dos años desde la notificación o publicación", lado: 0 },
        { texto: "No procede contra actos que crearon derechos adquiridos legítimamente", lado: 1, porque: "Art. 61 letra a)." },
        { texto: "Exige audiencia previa del interesado", lado: 0 },
        { texto: "Mira al futuro: el acto deja de regir desde ahora", lado: 1 },
        { texto: "Mira al pasado: el acto se tiene por ilegal desde su origen", lado: 0 },
        { texto: "Puede ser total o parcial, sin afectar lo independiente", lado: 0, porque: "Art. 53 inc. 2." },
        { texto: "No procede si la ley fijó otra forma de extinción del acto", lado: 1, porque: "Art. 61 letra b)." },
        { texto: "Siempre impugnable en procedimiento breve y sumario", lado: 0, porque: "Art. 53 inc. 3." },
      ],
      norma: "Arts. 53 y 61 Ley 19.880", fuente: "acto-admin",
    },
  ],

  cadenas: [
    {
      id: "m10-k-01", modulo: 10,
      titulo: "El camino de la invalidación",
      pasos: [
        "Se detecta que el acto es contrario a derecho",
        "Se verifica el plazo: menos de dos años desde la notificación o publicación",
        "Se inicia de oficio o a petición de parte",
        "Audiencia previa del interesado",
        "Se resuelve: invalidación total o parcial",
        "Se notifica el acto invalidatorio",
        "El afectado puede impugnarlo ante los tribunales, en procedimiento breve y sumario",
      ],
      nota: "Si pasaron los dos años, la Administración ya no puede invalidar: queda la acción de nulidad ante el juez.",
      norma: "Art. 53 Ley 19.880", fuente: "nuevo",
    },
  ],

  expedientes: [
    {
      id: "m10-exp-tres-anos", modulo: 10,
      titulo: "El decreto de hace tres años",
      relato: "La Alcaldesa Ruperta Cañas descubre que un decreto de la administración anterior otorgó una subvención sin el acuerdo del concejo que exigía la ley. «Invalídalo hoy mismo», ordena. El decreto se notificó hace tres años y un mes.",
      documento: { tipo: "Decreto alcaldicio N.º 412", campos: [
        { k: "Órgano", v: "Alcalde de Potestas (administración anterior)" },
        { k: "Dispone", v: "Otorga subvención a una corporación cultural" },
        { k: "Vicio", v: "Sin el acuerdo del concejo exigido por la ley" },
        { k: "Notificado el", v: "Hace tres años y un mes" },
        { k: "Estado", v: "Subvención pagada y rendida" },
      ] },
      pregunta: "¿Qué le respondes a la Alcaldesa?",
      sellos: [
        { texto: "NO SE PUEDE INVALIDAR: PASARON LOS DOS AÑOS; LA VÍA ES JUDICIAL", correcto: true, porque: "La potestad invalidatoria sólo puede ejercerse dentro de dos años desde la notificación o publicación (art. 53 Ley 19.880). Después, sólo queda pedir la nulidad de derecho público ante el juez (art. 7 inc. 3 CPR), cuya acción es imprescriptible según Domic Bezic." },
        { texto: "INVALIDAR", correcto: false, porque: "El plazo del art. 53 Ley 19.880 ya venció: la Administración perdió la potestad." },
        { texto: "REVOCAR", correcto: false, porque: "La revocación no corrige vicios y además no procede contra actos que crearon derechos adquiridos legítimamente (art. 61 letra a) Ley 19.880)." },
        { texto: "NULO DE PLENO DERECHO: BASTA DEJARLO SIN EFECTO", correcto: false, porque: "El acto goza de presunción de legalidad (art. 3 inc. final Ley 19.880); la nulidad la declara el juez." },
      ],
      norma: "Art. 53 Ley 19.880; art. 7 inc. 3 CPR", fuente: "nuevo", hallazgo: "m10-invalidacion",
    },
    {
      id: "m10-exp-investidura", modulo: 10,
      titulo: "El director que no era director",
      relato: "Jurídica revisa un permiso de edificación firmado por «Director de Obras (S)». El decreto de subrogancia nunca se dictó: quien firmó era jefe de sección y no tenía ninguna delegación. El permiso se notificó hace cuatro meses.",
      documento: { tipo: "Resolución de la Dirección de Obras N.º 88", campos: [
        { k: "Órgano", v: "Dirección de Obras Municipales" },
        { k: "Firma", v: "«Director de Obras (S)», sin decreto de subrogancia ni delegación" },
        { k: "Dispone", v: "Otorga permiso de edificación" },
        { k: "Notificado el", v: "Hace cuatro meses" },
        { k: "Vicio", v: "Investidura irregular (art. 7 inc. 1 CPR)" },
      ] },
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "INVALIDAR: FALTA INVESTIDURA (ART. 7 CPR, ART. 53)", correcto: true, porque: "Actuó alguien sin investidura regular: vicio del art. 7 inc. 1 CPR, que no es de mera forma. Estamos dentro de los dos años, así que la Dirección Jurídica propone invalidar, previa audiencia del interesado (art. 53 Ley 19.880)." },
        { texto: "VÁLIDO: FIRMÓ ALGUIEN DE LA DIRECCIÓN", correcto: false, porque: "La investidura regular es requisito de validez; trabajar en la Dirección no reemplaza el nombramiento o la delegación." },
        { texto: "SUBSANAR CON LA FIRMA DEL DIRECTOR TITULAR HOY", correcto: false, porque: "El art. 13 inc. 4 Ley 19.880 permite subsanar vicios de forma no esenciales; la falta de investidura es un vicio esencial del art. 7 CPR." },
        { texto: "REVOCAR POR MÉRITO", correcto: false, porque: "Aquí hay un vicio de legalidad, no un cambio de criterio: la vía es la invalidación (art. 53), no la revocación (art. 61)." },
      ],
      norma: "Art. 7 inc. 1 CPR; art. 53 Ley 19.880", fuente: "nuevo", hallazgo: "m10-ndp",
    },
    {
      id: "m10-exp-horario", modulo: 10,
      titulo: "El horario que no le gusta",
      relato: "La Alcaldesa quiere «invalidar» el decreto que fijó el horario de atención de la Oficina de Partes, porque prefiere abrir más temprano. El decreto es impecable: lo dictó ella, dentro de su competencia, motivado y publicado.",
      documento: { tipo: "Decreto alcaldicio N.º 15", campos: [
        { k: "Órgano", v: "Alcaldesa de Potestas" },
        { k: "Dispone", v: "Fija horario de atención de la Oficina de Partes: 9:00 a 14:00" },
        { k: "Motivo", v: "Organización interna del servicio" },
        { k: "Competencia", v: "Art. 63 letra i) Ley 18.695 (resoluciones de carácter general)" },
        { k: "Publicado", v: "Sí, en el sitio electrónico municipal" },
        { k: "Vicio", v: "Ninguno" },
      ] },
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "VÁLIDO: SIN VICIO; CAMBIARLO ES REVOCAR, NO INVALIDAR", correcto: true, porque: "No hay nada contrario a derecho que invalidar (art. 53). Un acto válido que dejó de convenir se deja sin efecto por revocación, por mérito u oportunidad (art. 61 Ley 19.880); aquí no hay derechos adquiridos que lo impidan." },
        { texto: "INVALIDAR", correcto: false, porque: "La invalidación exige un acto contrario a derecho; preferir otro horario no es un vicio." },
        { texto: "NULO: LA ALCALDESA NO FIJA HORARIOS", correcto: false, porque: "Está dentro de su competencia dictar resoluciones de carácter general (art. 63 letra i) Ley 18.695)." },
        { texto: "SUBSANAR", correcto: false, porque: "No hay vicio de forma que subsanar (art. 13 inc. 4 Ley 19.880)." },
      ],
      norma: "Arts. 53 y 61 Ley 19.880", fuente: "nuevo", hallazgo: "m10-revocacion",
    },
    {
      id: "m10-exp-becas", modulo: 10,
      titulo: "Las becas que ya se entregaron",
      relato: "Por «cambio de prioridades», la Alcaldesa quiere revocar el decreto que otorgó becas municipales de estudio a veinte vecinos, ya notificados y con el primer pago hecho. El decreto cumplió todos los requisitos de las bases.",
      documento: { tipo: "Decreto alcaldicio N.º 203", campos: [
        { k: "Órgano", v: "Alcaldesa de Potestas" },
        { k: "Dispone", v: "Otorga beca municipal de estudios a 20 vecinos" },
        { k: "Procedimiento", v: "Concurso según bases; todos los requisitos cumplidos" },
        { k: "Notificado el", v: "Hace dos meses; primer pago realizado" },
        { k: "Motivo de la revocación", v: "Cambio de prioridades presupuestarias" },
      ] },
      pregunta: "¿Procede revocar?",
      sellos: [
        { texto: "NO PROCEDE: DERECHOS ADQUIRIDOS LEGÍTIMAMENTE (ART. 61 a)", correcto: true, porque: "La revocación no procede contra actos declarativos o creadores de derechos adquiridos legítimamente (art. 61 letra a) Ley 19.880). Las becas se otorgaron conforme a las bases: son derechos adquiridos." },
        { texto: "REVOCAR: EL MÉRITO LO DECIDE LA ALCALDESA", correcto: false, porque: "El mérito justifica revocar sólo cuando el acto no creó derechos adquiridos legítimamente." },
        { texto: "INVALIDAR", correcto: false, porque: "No hay vicio de legalidad: el acto cumplió las bases (art. 53 exige un acto contrario a derecho)." },
        { texto: "NULO DE PLENO DERECHO POR FALTA DE PRESUPUESTO", correcto: false, porque: "Un cambio de prioridades no es un vicio del art. 7 CPR." },
      ],
      norma: "Art. 61 letra a) Ley 19.880", fuente: "nuevo", hallazgo: "m10-revocacion",
    },
    {
      id: "m10-exp-ndp-juicio", modulo: 10,
      titulo: "La demanda de nulidad del decreto antiguo",
      relato: "Un vecino demanda la nulidad de derecho público de un decreto de hace nueve años que le cobró un derecho municipal creado por el alcalde de entonces sin ordenanza. Pide, además, la devolución de todo lo pagado. El abogado del CDE que asesora al municipio dice que «todo está prescrito».",
      documento: { tipo: "Demanda de nulidad de derecho público", campos: [
        { k: "Acto impugnado", v: "Decreto alcaldicio de hace nueve años" },
        { k: "Vicio alegado", v: "Incompetencia: el derecho se creó sin ordenanza" },
        { k: "Pide", v: "Nulidad del decreto y devolución de lo pagado en nueve años" },
        { k: "Fundamento", v: "Art. 7 inc. 3 CPR" },
        { k: "Tribunal", v: "Juzgado Civil de Potestas" },
      ] },
      pregunta: "¿Qué informas sobre la prescripción?",
      sellos: [
        { texto: "LA NULIDAD NO PRESCRIBE; LAS DEVOLUCIONES SÍ (DOMIC BEZIC)", correcto: true, porque: "Según la CS desde Domic Bezic (2002), la acción de nulidad de derecho público es imprescriptible, pero las acciones patrimoniales derivadas prescriben según el Código Civil: se discute la nulidad y se opone prescripción a las devoluciones antiguas." },
        { texto: "TODO PRESCRITO: DOS AÑOS", correcto: false, porque: "Los dos años del art. 53 Ley 19.880 limitan a la Administración para invalidar, no al vecino para demandar la nulidad." },
        { texto: "TODO PRESCRITO: CUATRO AÑOS", correcto: false, porque: "Los plazos civiles afectan a las acciones patrimoniales, no a la declaración de nulidad." },
        { texto: "INVALIDARLO AHORA PARA EVITAR EL JUICIO", correcto: false, porque: "Pasaron más de dos años desde la notificación: la municipalidad ya no puede invalidar (art. 53)." },
      ],
      norma: "Art. 7 inc. 3 CPR; art. 2332 CC; Domic Bezic con Fisco (2002, rol 4.753-2001)", fuente: "nuevo", hallazgo: "m10-prescripcion",
    },
    {
      id: "m10-exp-parcial", modulo: 10,
      titulo: "La multa de diez UTM",
      relato: "Una ordenanza de ruidos, publicada hace ocho meses, trae un artículo 3 con multas de hasta 10 UTM. La ley sólo permite multas de hasta 5 UTM en ordenanzas. El resto de la ordenanza (horarios, prohibiciones, fiscalización) es correcto. El concejo pregunta si hay que botarla entera.",
      documento: { tipo: "Ordenanza municipal N.º 9, sobre ruidos molestos", campos: [
        { k: "Órgano", v: "Municipalidad de Potestas, con acuerdo del concejo" },
        { k: "Publicada", v: "Hace ocho meses" },
        { k: "Art. 3", v: "Multas de 1 a 10 UTM" },
        { k: "Norma infringida", v: "Art. 12 Ley 18.695: multas hasta 5 UTM" },
        { k: "Resto del texto", v: "Horarios, prohibiciones y fiscalización, sin vicio" },
      ] },
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "INVALIDACIÓN PARCIAL: SÓLO EL ARTÍCULO VICIADO", correcto: true, porque: "La invalidación puede ser parcial y no afecta las disposiciones independientes (art. 53 inc. 2 Ley 19.880). Estamos dentro de los dos años; se corrige el art. 3 (art. 12 Ley 18.695) y se conserva el resto." },
        { texto: "INVALIDAR TODA LA ORDENANZA", correcto: false, porque: "El principio de conservación manda salvar lo independiente de la parte viciada (art. 53 inc. 2)." },
        { texto: "VÁLIDA: LA MULTA ES PROPORCIONAL", correcto: false, porque: "La proporción no importa: las ordenanzas no pueden exceder 5 UTM (art. 12 Ley 18.695)." },
        { texto: "REVOCAR", correcto: false, porque: "Hay un vicio de legalidad; la revocación es para actos válidos que dejaron de convenir (art. 61)." },
      ],
      norma: "Art. 53 inc. 2 Ley 19.880; art. 12 Ley 18.695", fuente: "nuevo", hallazgo: "m10-conservacion",
    },
  ],
};

// PENDIENTE DE REVISIÓN: la calificación del plazo del art. 53 como «caducidad», los efectos ex tunc /
// ex nunc y la tesis de Soto Kloss son doctrina sin texto legal expreso. La imprescriptibilidad de la
// acción de NDP se cita según Domic Bezic (2002, rol 4.753-2001, de guia-rpe) y no se contrastó con el
// Poder Judicial. El art. 13 inc. 2 que citaban los apuntes es hoy el inc. 3 (texto verificado en el XML);
// la cita de ACTO-ADMIN («omisión de trámites esenciales o realización de éstos de modo diferente al
// prescrito por la ley») no corresponde al texto vigente y no se copió. La «teoría del funcionario de
// hecho» y la convalidación de la incompetencia relativa son doctrina.
