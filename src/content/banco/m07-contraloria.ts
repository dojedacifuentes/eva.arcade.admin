// Módulo 7 · Contraloría: control de legalidad, toma de razón, dictámenes y
// recursos administrativos (reposición, jerárquico, revisión) e invalidación como
// control. Fuentes: procedimiento-admin (RECURSOS_DATA, FDECKS.recursos, QUIZ),
// proceadmin-rpg (arts. 59 y 60; decisionSteps, el árbol de recursos), ACTO-ADMIN
// (tabla de recursos) y texto nuevo para la Contraloría (arts. 98 y 99 CPR; Ley
// 10.336 arts. 1, 5, 6, 9, 10, 16, 19, 21; Ley 18.695 arts. 29, 51 a 55).
// Verificado contra cpr.xml, l10336.xml, l19880.xml, locmun.xml y locbgae.xml de
// la BCN el 12-10-2026. Correcciones aplicadas: el recurso de revisión va ante el
// superior jerárquico «si lo hubiere o, en su defecto, ante la autoridad que lo
// hubiere dictado» (no «el jefe superior del servicio») y su plazo de un año se
// cuenta según la causal; el art. 60 no fija plazo para resolverlo.
import type { BancoModulo } from "../tipos";

export const BANCO_M07: BancoModulo = {
  modulo: 7,

  hallazgos: [
    {
      id: "m07-que-es-cgr", modulo: 7,
      titulo: "Quien controla al que manda",
      texto: "La Contraloría General de la República es un organismo autónomo que controla la legalidad de los actos de la Administración, fiscaliza el ingreso y la inversión de los fondos del Fisco y de las municipalidades, examina y juzga las cuentas de quienes manejan esos bienes y lleva la contabilidad general de la Nación.",
      norma: "Art. 98 CPR; art. 1 Ley 10.336",
      simple: "Independiente de todos los ministerios y de todas las alcaldías. Por eso nadie la invita a los asados.",
    },
    {
      id: "m07-toma-razon", modulo: 7,
      titulo: "Tomar razón o representar",
      texto: "En el control de legalidad, el Contralor toma razón de los decretos y resoluciones que por ley deben tramitarse por Contraloría, o representa su ilegalidad, dentro de quince días prorrogables por otros quince. Si representa, el Presidente puede insistir con la firma de todos sus ministros; pero no puede insistir si la representación es por inconstitucionalidad o recae en un DFL: ahí decide el Tribunal Constitucional.",
      norma: "Art. 99 CPR; art. 10 Ley 10.336",
      simple: "Un acto con «tomado razón» no es perfecto; sólo pasó la aduana. Y algunos ni siquiera necesitan pasarla.",
    },
    {
      id: "m07-municipal", modulo: 7,
      titulo: "La Municipalidad no va a toma de razón",
      texto: "Las resoluciones municipales están exentas del trámite de toma de razón, aunque deben registrarse en Contraloría cuando afectan a funcionarios. Eso no las deja sin control: la Contraloría fiscaliza a las municipalidades, puede instruir sumarios, emitir dictámenes sobre todo lo sujeto a su control y hacer cuentadante al funcionario que dañe el patrimonio municipal.",
      norma: "Arts. 51 a 54 Ley 18.695",
      simple: "A la Alcaldesa nadie le toma razón. Pero la Contraloría toma nota, que es peor.",
    },
    {
      id: "m07-dictamenes", modulo: 7,
      titulo: "El dictamen no es una opinión",
      texto: "Cuando el Contralor informa a petición de parte o de una jefatura, lo hace por dictámenes. Sus informes son obligatorios para los funcionarios en el caso concreto, constituyen la jurisprudencia administrativa y los abogados de los servicios fiscalizados quedan bajo su dependencia técnica. La Contraloría no informa asuntos litigiosos ni sometidos a tribunales.",
      norma: "Arts. 5, 6, 9 inc. final y 19 Ley 10.336; art. 52 Ley 18.695",
      simple: "Un dictamen se parece a un consejo como una orden se parece a una sugerencia.",
    },
    {
      id: "m07-reposicion-jerarquico", modulo: 7,
      titulo: "Cinco días para pedir que lo piensen de nuevo",
      texto: "La reposición se interpone dentro de cinco días ante el mismo órgano que dictó el acto; en subsidio, el jerárquico. Sin reposición, el jerárquico va al superior dentro de cinco días. No hay jerárquico contra los actos del Presidente, los ministros, los alcaldes y los jefes superiores de servicios descentralizados: ahí la reposición agota la vía administrativa. La autoridad resuelve en no más de 30 días y, si es jerárquico, oye antes al órgano recurrido.",
      norma: "Art. 59 Ley 19.880; art. 10 Ley 18.575",
      simple: "Contra la Alcaldesa no hay jefe al que apelar. Hay reposición, y después, tribunales.",
    },
    {
      id: "m07-revision", modulo: 7,
      titulo: "La revisión: extraordinaria y con lista cerrada",
      texto: "Contra actos firmes procede el recurso extraordinario de revisión, ante el superior jerárquico si lo hay o, en su defecto, ante la autoridad que dictó el acto, sólo por causales tasadas: falta de emplazamiento; manifiesto error de hecho determinante o documentos esenciales ignorados; sentencia ejecutoriada que declara prevaricación, cohecho, violencia u otra maquinación fraudulenta; documentos o testimonios declarados falsos por sentencia. El plazo es de un año.",
      norma: "Art. 60 Ley 19.880",
      simple: "No es una segunda reposición con disfraz: si no calzas en una de las cuatro letras, no hay revisión.",
    },
    {
      id: "m07-invalidacion-control", modulo: 7,
      titulo: "La Administración se corrige a sí misma",
      texto: "La autoridad puede invalidar, de oficio o a petición de parte, los actos contrarios a derecho, previa audiencia del interesado y dentro de dos años desde la notificación o publicación. La invalidación puede ser total o parcial, y el acto invalidatorio es siempre impugnable ante los tribunales en procedimiento breve y sumario. Mientras tanto, los recursos no suspenden la ejecución del acto, salvo que la autoridad lo decida a petición fundada.",
      norma: "Arts. 53 y 57 Ley 19.880",
      simple: "Dos años para arrepentirse, con audiencia previa. Después, el error queda firme y toca ir donde el juez.",
    },
  ],

  afirmaciones: [
    { id: "m07-af-01", modulo: 7, hallazgo: "m07-que-es-cgr", texto: "La Contraloría fiscaliza el ingreso y la inversión de los fondos de las municipalidades.", verdad: true, porque: "Art. 98 CPR: fiscaliza los fondos del Fisco, de las municipalidades y de los demás organismos que determinen las leyes." },
    { id: "m07-af-02", modulo: 7, hallazgo: "m07-que-es-cgr", texto: "La Contraloría depende del Ministerio de Hacienda.", verdad: false, porque: "Es un organismo autónomo, independiente de todos los ministerios, autoridades y oficinas del Estado (art. 98 CPR; art. 1 Ley 10.336)." },
    { id: "m07-af-03", modulo: 7, hallazgo: "m07-toma-razon", texto: "El Contralor tiene quince días para tomar razón o representar, prorrogables por otros quince con resolución fundada.", verdad: true, porque: "Art. 10 Ley 10.336: quince días desde la recepción, prorrogables hasta por otros quince si hay motivos graves y calificados." },
    { id: "m07-af-04", modulo: 7, hallazgo: "m07-toma-razon", texto: "El Presidente puede insistir con la firma de todos sus ministros cuando la Contraloría representa un decreto por inconstitucional.", verdad: false, porque: "En ese caso no tiene facultad de insistir: debe remitir los antecedentes al Tribunal Constitucional dentro de diez días (art. 99 CPR)." },
    { id: "m07-af-05", modulo: 7, hallazgo: "m07-municipal", texto: "Las resoluciones municipales que afectan a funcionarios se registran en Contraloría aunque estén exentas de toma de razón.", verdad: true, porque: "Art. 53 Ley 18.695: exentas de toma de razón, pero deben registrarse cuando afecten a funcionarios municipales." },
    { id: "m07-af-06", modulo: 7, hallazgo: "m07-municipal", texto: "Los decretos alcaldicios deben enviarse a Contraloría para su toma de razón.", verdad: false, porque: "Las resoluciones municipales están exentas del trámite de toma de razón (art. 53 Ley 18.695)." },
    { id: "m07-af-07", modulo: 7, hallazgo: "m07-dictamenes", texto: "Los informes de la Contraloría son obligatorios para los funcionarios en el caso concreto a que se refieren.", verdad: true, porque: "Art. 9 inc. final Ley 10.336." },
    { id: "m07-af-08", modulo: 7, hallazgo: "m07-dictamenes", texto: "La Contraloría puede dictaminar sobre un asunto que ya está en manos de un tribunal.", verdad: false, porque: "No interviene ni informa los asuntos propiamente litigiosos o sometidos al conocimiento de los Tribunales de Justicia (art. 6 Ley 10.336)." },
    { id: "m07-af-09", modulo: 7, hallazgo: "m07-reposicion-jerarquico", texto: "Contra un decreto alcaldicio no procede recurso jerárquico.", verdad: true, porque: "No procede jerárquico contra los actos de los alcaldes; la reposición agota la vía administrativa (art. 59 Ley 19.880)." },
    { id: "m07-af-10", modulo: 7, hallazgo: "m07-reposicion-jerarquico", texto: "La reposición se interpone dentro de diez días ante el superior del órgano que dictó el acto.", verdad: false, porque: "Son cinco días y ante el mismo órgano que dictó el acto (art. 59 Ley 19.880)." },
    { id: "m07-af-11", modulo: 7, hallazgo: "m07-revision", texto: "El recurso de revisión procede sólo contra actos firmes y por causales tasadas.", verdad: true, porque: "Art. 60 Ley 19.880: contra actos administrativos firmes, cuando concurra alguna de las circunstancias de sus letras a) a d)." },
    { id: "m07-af-12", modulo: 7, hallazgo: "m07-revision", texto: "La revisión sirve para reabrir cualquier ilegalidad cuando se perdió el plazo de reposición.", verdad: false, porque: "Sólo procede por las causales del art. 60; no es una reposición tardía (art. 60 Ley 19.880)." },
    { id: "m07-af-13", modulo: 7, hallazgo: "m07-invalidacion-control", texto: "La invalidación exige audiencia previa del interesado y debe hacerse dentro de dos años.", verdad: true, porque: "Art. 53 Ley 19.880: previa audiencia del interesado, dentro de los dos años contados desde la notificación o publicación." },
    { id: "m07-af-14", modulo: 7, hallazgo: "m07-invalidacion-control", texto: "La sola interposición de un recurso suspende la ejecución del acto impugnado.", verdad: false, porque: "No la suspende; la autoridad puede suspenderla a petición fundada si hay riesgo de daño irreparable o de imposibilidad de cumplir lo que se resuelva (art. 57 Ley 19.880)." },
  ],

  fichas: [
    { id: "m07-f-01", modulo: 7, frente: "Funciones de la Contraloría según la Constitución", dorso: "Control de legalidad de los actos de la Administración; fiscalización del ingreso e inversión de fondos del Fisco, municipalidades y demás organismos; examen y juzgamiento de cuentas; contabilidad general de la Nación; lo demás que encargue su ley orgánica.", norma: "Art. 98 CPR", etiqueta: "Contraloría", prioridad: "S", fuente: "nuevo" },
    { id: "m07-f-02", modulo: 7, frente: "El Contralor General: requisitos y período", dorso: "Diez años de título de abogado, cuarenta años de edad y calidades de ciudadano con derecho a sufragio. Lo designa el Presidente con acuerdo de tres quintos del Senado, por ocho años, sin reelección para el período siguiente; cesa a los 75.", norma: "Art. 98 CPR", etiqueta: "Contraloría", prioridad: "B", fuente: "nuevo" },
    { id: "m07-f-03", modulo: 7, frente: "Toma de razón", dorso: "Control preventivo de legalidad: el Contralor toma razón de los decretos y resoluciones que por ley deben tramitarse por Contraloría o representa su ilegalidad. Plazo: quince días desde la recepción, prorrogables por otros quince con resolución fundada.", norma: "Art. 99 CPR; art. 10 Ley 10.336", etiqueta: "Contraloría", prioridad: "S", fuente: "nuevo" },
    { id: "m07-f-04", modulo: 7, frente: "Decreto de insistencia", dorso: "Representado un decreto, el Presidente puede insistir con la firma de todos sus ministros; la Contraloría le da curso y envía copia a la Cámara de Diputados. No cabe insistir en DFL, decretos promulgatorios que se apartan del texto ni actos contrarios a la Constitución: van al Tribunal Constitucional en diez días.", norma: "Art. 99 CPR", etiqueta: "Contraloría", prioridad: "A", fuente: "nuevo" },
    { id: "m07-f-05", modulo: 7, frente: "Exención de toma de razón", dorso: "El Contralor puede eximir del trámite, por resolución fundada, a decretos o resoluciones sobre licencias, feriados, permisos u otras materias que no considere esenciales; para decretos supremos, sólo los firmados «por orden del Presidente».", norma: "Art. 10 Ley 10.336", etiqueta: "Contraloría", prioridad: "A", fuente: "nuevo" },
    { id: "m07-f-06", modulo: 7, frente: "Cumplimiento antes de la toma de razón", dorso: "Por resolución fundada, el Contralor puede autorizar que se cumplan antes de la toma de razón las medidas para evitar o reparar daños por terremotos, incendios, calamidades u otras emergencias, o que perderían su oportunidad, siempre que no afecten derechos esenciales.", norma: "Art. 10 Ley 10.336", etiqueta: "Contraloría", prioridad: "B", fuente: "nuevo" },
    { id: "m07-f-07", modulo: 7, frente: "¿Qué es un dictamen?", dorso: "La forma en que el Contralor informa a petición de parte, de jefaturas de servicio o de otras autoridades. Las decisiones y dictámenes de la Contraloría son los únicos medios que constituyen jurisprudencia administrativa.", norma: "Arts. 5 y 6 Ley 10.336", etiqueta: "Dictámenes", prioridad: "S", fuente: "nuevo" },
    { id: "m07-f-08", modulo: 7, frente: "¿Los dictámenes obligan?", dorso: "Sí: los informes del Contralor son obligatorios para los funcionarios correspondientes en el caso o casos concretos a que se refieren.", norma: "Art. 9 inc. final Ley 10.336", etiqueta: "Dictámenes", prioridad: "S", fuente: "nuevo" },
    { id: "m07-f-09", modulo: 7, frente: "Dependencia técnica de los abogados públicos", dorso: "Los abogados, fiscales y asesores jurídicos de los servicios fiscalizados que no tienen a su cargo defensa judicial quedan sujetos a la dependencia técnica de la Contraloría, cuya jurisprudencia y resoluciones deben observar.", norma: "Art. 19 Ley 10.336", etiqueta: "Dictámenes", prioridad: "A", fuente: "nuevo" },
    { id: "m07-f-10", modulo: 7, frente: "Lo que la Contraloría no informa", dorso: "Asuntos que por su naturaleza sean propiamente litigiosos o estén sometidos a los Tribunales de Justicia, que son de competencia del Consejo de Defensa del Estado.", norma: "Art. 6 Ley 10.336", etiqueta: "Dictámenes", prioridad: "A", fuente: "nuevo" },
    { id: "m07-f-11", modulo: 7, frente: "El Contralor pide datos y nadie responde. ¿Qué pasa?", dorso: "Puede sancionar directamente con multa de hasta quince días de remuneraciones y disponer la suspensión sin goce de remuneraciones hasta que se remitan los antecedentes. El secreto o reserva no es excusa frente a la Contraloría.", norma: "Art. 9 Ley 10.336", etiqueta: "Contraloría", prioridad: "B", fuente: "nuevo" },
    { id: "m07-f-12", modulo: 7, frente: "Control de la Contraloría sobre las municipalidades", dorso: "Las fiscaliza según su ley orgánica, sin perjuicio de la fiscalización interna del alcalde, el concejo y las unidades municipales. Si detecta actos u omisiones ilegales, puede instruir el procedimiento disciplinario; si acredita responsabilidad del alcalde, remite los antecedentes al concejo.", norma: "Art. 51 Ley 18.695", etiqueta: "Municipal", prioridad: "S", fuente: "nuevo" },
    { id: "m07-f-13", modulo: 7, frente: "Resoluciones municipales y toma de razón", dorso: "Están exentas del trámite, pero deben registrarse en Contraloría cuando afecten a funcionarios municipales.", norma: "Art. 53 Ley 18.695", etiqueta: "Municipal", prioridad: "S", fuente: "nuevo" },
    { id: "m07-f-14", modulo: 7, frente: "Dictámenes sobre materias municipales", dorso: "En el control de legalidad, la Contraloría puede emitir dictámenes jurídicos sobre todas las materias sujetas a su control; sus informes se ponen en conocimiento del concejo.", norma: "Arts. 52 y 55 Ley 18.695", etiqueta: "Municipal", prioridad: "A", fuente: "nuevo" },
    { id: "m07-f-15", modulo: 7, frente: "Cuentadante municipal", dorso: "La Contraloría puede constituir en cuentadante y hacer efectiva la responsabilidad de cualquier funcionario municipal que haya causado detrimento al patrimonio municipal, fijando la proporción según su grado de intervención.", norma: "Art. 54 Ley 18.695", etiqueta: "Municipal", prioridad: "B", fuente: "nuevo" },
    { id: "m07-f-16", modulo: 7, frente: "La unidad de control interno de la Municipalidad", dorso: "Representa al alcalde los actos municipales que estime ilegales, dentro de diez días desde que los conoce, e informa al concejo. Si el alcalde no enmienda, remite la información a la Contraloría.", norma: "Art. 29 letra c) Ley 18.695", etiqueta: "Municipal", prioridad: "A", fuente: "nuevo" },
    { id: "m07-f-17", modulo: 7, frente: "Principio de impugnabilidad", dorso: "Todo acto es impugnable por reposición y jerárquico, sin perjuicio de la revisión y de los recursos de leyes especiales. Los actos de mero trámite sólo cuando impidan continuar el procedimiento o produzcan indefensión.", norma: "Art. 15 Ley 19.880; art. 10 Ley 18.575", etiqueta: "Recursos", prioridad: "A", fuente: "procedimiento-admin" },
    { id: "m07-f-18", modulo: 7, frente: "Recurso de reposición", dorso: "Dentro de cinco días, ante el mismo órgano que dictó el acto; puede llevar el jerárquico en subsidio. La autoridad resuelve en no más de 30 días. No suspende la ejecución.", norma: "Arts. 57 y 59 Ley 19.880", etiqueta: "Recursos", prioridad: "S", fuente: "acto-admin" },
    { id: "m07-f-19", modulo: 7, frente: "Recurso jerárquico", dorso: "Subsidiario de la reposición (rechazada ésta, se eleva el expediente al superior) o directo, dentro de cinco días desde la notificación, para ante el superior jerárquico. El superior oye antes al órgano recurrido, que puede formular descargos.", norma: "Art. 59 Ley 19.880", etiqueta: "Recursos", prioridad: "S", fuente: "acto-admin" },
    { id: "m07-f-20", modulo: 7, frente: "¿Contra quién no hay jerárquico?", dorso: "Contra los actos del Presidente de la República, los ministros de Estado, los alcaldes y los jefes superiores de los servicios públicos descentralizados. La reposición agota la vía administrativa.", norma: "Art. 59 Ley 19.880", etiqueta: "Recursos", prioridad: "S", fuente: "proceadmin" },
    { id: "m07-f-21", modulo: 7, frente: "¿Qué puede hacer la resolución que acoge un recurso?", dorso: "Modificar, reemplazar o dejar sin efecto el acto impugnado; la autoridad que acoge puede dictar por sí misma el acto de reemplazo.", norma: "Arts. 15 y 59 Ley 19.880", etiqueta: "Recursos", prioridad: "B", fuente: "nuevo" },
    { id: "m07-f-22", modulo: 7, frente: "Recurso extraordinario de revisión: causales", dorso: "a) Resolución dictada sin el debido emplazamiento; b) manifiesto error de hecho determinante, o documentos esenciales ignorados o imposibles de acompañar; c) sentencia ejecutoriada que declara prevaricación, cohecho, violencia u otra maquinación fraudulenta; d) documentos o testimonios declarados falsos por sentencia ejecutoriada.", norma: "Art. 60 Ley 19.880", etiqueta: "Recursos", prioridad: "S", fuente: "procedimiento-admin" },
    { id: "m07-f-23", modulo: 7, frente: "Recurso de revisión: ante quién y en qué plazo", dorso: "Ante el superior jerárquico si lo hay o, en su defecto, ante la autoridad que dictó el acto. Un año: desde el día siguiente a la dictación en las letras a) y b); desde que la sentencia queda ejecutoriada en las letras c) y d).", norma: "Art. 60 Ley 19.880", etiqueta: "Recursos", prioridad: "A", fuente: "proceadmin" },
    { id: "m07-f-24", modulo: 7, frente: "Invalidación", dorso: "De oficio o a petición de parte, previa audiencia del interesado, dentro de dos años desde la notificación o publicación; total o parcial; el acto invalidatorio es siempre impugnable ante los tribunales en procedimiento breve y sumario.", norma: "Art. 53 Ley 19.880", etiqueta: "Control", prioridad: "S", fuente: "acto-admin" },
    { id: "m07-f-25", modulo: 7, frente: "Suspensión del acto recurrido", dorso: "Los recursos no suspenden la ejecución. La autoridad que resuelve puede suspenderla a petición fundada del interesado cuando el cumplimiento pudiere causar daño irreparable o hacer imposible cumplir lo que se resuelva.", norma: "Art. 57 Ley 19.880", etiqueta: "Control", prioridad: "A", fuente: "acto-admin" },
  ],

  quiz: [
    { id: "m07-q-01", modulo: 7, texto: "¿Cuál de estas funciones NO es de la Contraloría según el art. 98 CPR?", opciones: ["Controlar la legalidad de los actos de la Administración", "Juzgar las cuentas de quienes manejan bienes públicos", "Resolver las acciones de nulidad de derecho público", "Llevar la contabilidad general de la Nación"], correcta: 2, porque: "La nulidad de derecho público la declaran los tribunales; la Contraloría no conoce asuntos litigiosos (art. 98 CPR; art. 6 Ley 10.336).", norma: "Art. 98 CPR", fuente: "nuevo" },
    { id: "m07-q-02", modulo: 7, texto: "Representado un decreto por ilegal, ¿qué puede hacer el Presidente?", opciones: ["Nada: el decreto queda sin efecto", "Insistir con la firma de todos sus ministros", "Recurrir a la Corte Suprema", "Dictarlo de nuevo sin cambios"], correcta: 1, porque: "El Contralor debe darle curso si el Presidente insiste con la firma de todos sus ministros, y envía copia a la Cámara de Diputados (art. 99 CPR).", norma: "Art. 99 CPR", fuente: "nuevo" },
    { id: "m07-q-03", modulo: 7, texto: "¿En qué caso el Presidente NO puede insistir?", opciones: ["Cuando el decreto es de gastos", "Cuando la representación es por inconstitucionalidad", "Cuando la Contraloría se demoró más de quince días", "Nunca puede insistir"], correcta: 1, porque: "Si la representación recae en un DFL, un decreto promulgatorio que se aparta del texto o un acto contrario a la Constitución, no puede insistir: remite los antecedentes al Tribunal Constitucional en diez días (art. 99 CPR).", norma: "Art. 99 CPR", fuente: "nuevo" },
    { id: "m07-q-04", modulo: 7, texto: "¿Cuánto tiene la Contraloría para tomar razón o representar?", opciones: ["Cinco días", "Quince días, prorrogables por otros quince", "Treinta días fijos", "Seis meses"], correcta: 1, porque: "Art. 10 Ley 10.336: quince días desde la recepción, prorrogables hasta por otros quince si hay motivos graves y calificados, por resolución fundada.", norma: "Art. 10 Ley 10.336", fuente: "nuevo" },
    { id: "m07-q-05", modulo: 7, texto: "Un dictamen de Contraloría dice que cierta asignación no procede. ¿Qué valor tiene para la Municipalidad?", opciones: ["Es una recomendación", "Es obligatorio para los funcionarios en el caso concreto", "Sólo vale si lo aprueba el concejo", "Sólo vale si lo confirma un tribunal"], correcta: 1, porque: "Los informes del Contralor son obligatorios para los funcionarios correspondientes en el caso o casos concretos a que se refieren (art. 9 inc. final Ley 10.336).", norma: "Art. 9 Ley 10.336", fuente: "nuevo" },
    { id: "m07-q-06", modulo: 7, texto: "Los decretos alcaldicios…", opciones: ["Van siempre a toma de razón", "Están exentos de toma de razón, pero se registran si afectan a funcionarios", "Sólo van a toma de razón si superan 500 UTM", "Los toma de razón el concejo"], correcta: 1, porque: "Art. 53 Ley 18.695: las resoluciones municipales están exentas del trámite, pero deben registrarse en Contraloría cuando afecten a funcionarios municipales.", norma: "Art. 53 Ley 18.695", fuente: "nuevo" },
    { id: "m07-q-07", modulo: 7, texto: "¿Ante quién y en qué plazo se interpone la reposición?", opciones: ["Ante el superior, en 30 días", "Ante el mismo órgano que dictó el acto, en cinco días", "Ante Contraloría, en cinco días", "Ante el juez civil, en diez días"], correcta: 1, porque: "Art. 59 Ley 19.880: dentro del plazo de cinco días ante el mismo órgano que dictó el acto; en subsidio, el jerárquico.", norma: "Art. 59 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m07-q-08", modulo: 7, texto: "Un vecino quiere recurrir jerárquicamente contra un decreto de la Alcaldesa. ¿Procede?", opciones: ["Sí, ante el Delegado Presidencial", "Sí, ante el concejo", "No: contra los alcaldes no hay jerárquico; la reposición agota la vía", "Sí, ante Contraloría"], correcta: 2, porque: "No procede recurso jerárquico contra los actos del Presidente, los ministros, los alcaldes y los jefes superiores de servicios descentralizados; la reposición agota la vía administrativa (art. 59 Ley 19.880).", norma: "Art. 59 Ley 19.880", fuente: "proceadmin" },
    { id: "m07-q-09", modulo: 7, texto: "¿Cuánto tiene la autoridad para resolver una reposición o un jerárquico?", opciones: ["5 días", "10 días", "No más de 30 días", "6 meses"], correcta: 2, porque: "La autoridad llamada a pronunciarse tiene un plazo no superior a 30 días (art. 59 Ley 19.880). Si no resuelve, el silencio es negativo (art. 65).", norma: "Art. 59 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m07-q-10", modulo: 7, texto: "¿Cuál NO es causal del recurso de revisión?", opciones: ["Falta del debido emplazamiento", "Manifiesto error de hecho determinante", "Cualquier ilegalidad advertida después", "Documentos declarados falsos por sentencia ejecutoriada"], correcta: 2, porque: "Las causales son tasadas (letras a a d del art. 60 Ley 19.880); la revisión no reabre cualquier ilegalidad.", norma: "Art. 60 Ley 19.880", fuente: "proceadmin" },
    { id: "m07-q-11", modulo: 7, texto: "¿Ante quién se interpone el recurso de revisión?", opciones: ["Siempre ante el jefe superior del servicio", "Ante el superior jerárquico si lo hay o, en su defecto, ante la autoridad que dictó el acto", "Ante Contraloría", "Ante la Corte de Apelaciones"], correcta: 1, porque: "Texto del art. 60 Ley 19.880. Los apuntes que dicen «jefe superior del servicio» simplifican de más.", norma: "Art. 60 Ley 19.880", fuente: "nuevo" },
    { id: "m07-q-12", modulo: 7, texto: "¿Qué exige la invalidación de un acto contrario a derecho?", opciones: ["Audiencia previa del interesado y hacerlo dentro de dos años desde la notificación o publicación", "Autorización de Contraloría", "Sentencia judicial previa", "Que el acto no esté firme"], correcta: 0, porque: "Art. 53 Ley 19.880. El acto invalidatorio es siempre impugnable ante los tribunales en procedimiento breve y sumario.", norma: "Art. 53 Ley 19.880", fuente: "acto-admin" },
    { id: "m07-q-13", modulo: 7, texto: "La Contraloría detecta actos ilegales en la Municipalidad. ¿Qué puede hacer?", opciones: ["Anular el decreto directamente", "Instruir el procedimiento disciplinario y, si acredita responsabilidad del alcalde, remitir los antecedentes al concejo", "Destituir a la Alcaldesa", "Nada: las municipalidades son autónomas"], correcta: 1, porque: "Art. 51 Ley 18.695: puede instruir el procedimiento disciplinario (art. 133 bis y ss. Ley 10.336) y, acreditada la responsabilidad del alcalde, remitir al concejo para los efectos del art. 60 letra c).", norma: "Art. 51 Ley 18.695", fuente: "nuevo" },
  ],

  orales: [
    {
      id: "m07-o-01", modulo: 7,
      pregunta: "Explique la toma de razón: qué es, quién la hace, en qué plazo y qué pasa si la Contraloría representa el acto.",
      profesor: "Comisión de Derecho Administrativo",
      claves: ["Control preventivo de legalidad", "Decretos y resoluciones que por ley deben tramitarse por Contraloría", "Quince días, prorrogables por otros quince", "Tomar razón o representar la ilegalidad", "Insistencia con la firma de todos los ministros", "Sin insistencia en DFL o inconstitucionalidad: al TC en diez días", "Las resoluciones municipales están exentas"],
      trampas: ["Es un control posterior a la ejecución", "Todo acto administrativo va a toma de razón", "La representación anula el acto", "El Presidente siempre puede insistir", "Los decretos alcaldicios se toman razón"],
      modelo: "La toma de razón es el control preventivo de legalidad que ejerce la Contraloría sobre los decretos y resoluciones que, conforme a la ley, deben tramitarse por ella (art. 99 CPR). El Contralor tiene quince días desde la recepción, prorrogables por otros quince con resolución fundada, para tomar razón o representar la ilegalidad o inconstitucionalidad (art. 10 Ley 10.336). Representado el acto, el Presidente puede insistir con la firma de todos sus ministros y la Contraloría debe darle curso, enviando copia a la Cámara de Diputados; pero no cabe insistir si la representación recae en un DFL, en un decreto promulgatorio que se aparta del texto aprobado o en un acto contrario a la Constitución: ahí el Presidente debe remitir los antecedentes al Tribunal Constitucional en diez días. Las resoluciones municipales están exentas del trámite, aunque se registran cuando afectan a funcionarios (art. 53 Ley 18.695).",
      repregunta: "¿Puede el Contralor eximir materias de la toma de razón?",
      prioridad: "S", fuente: "nuevo",
    },
    {
      id: "m07-o-02", modulo: 7,
      pregunta: "Un vecino fue notificado de una resolución de la Dirección de Obras que lo perjudica. Arme el árbol de decisión de los recursos administrativos ordinarios.",
      profesor: "Comisión de Derecho Administrativo",
      claves: ["¿Es acto terminal o trámite que produce indefensión?", "¿Dentro de cinco días desde la notificación?", "Reposición ante el mismo órgano", "Jerárquico en subsidio o directo ante el superior", "No hay jerárquico contra alcaldes: reposición agota la vía", "La autoridad resuelve en no más de 30 días", "No suspende, salvo petición fundada", "Vencido el plazo: sólo revisión con causal tasada"],
      trampas: ["Los actos de trámite siempre se impugnan solos", "La reposición se presenta ante el superior", "El jerárquico sólo procede si antes hubo reposición", "Perdido el plazo, la revisión lo reabre por cualquier ilegalidad", "La interposición suspende automáticamente la ejecución"],
      modelo: "Primero se mira si el acto es terminal o un trámite que impide continuar o produce indefensión (art. 15). Si estamos dentro de cinco días desde la notificación válida, procede la reposición ante el mismo órgano que dictó el acto, con el jerárquico en subsidio, o el jerárquico directo ante el superior (art. 59). Si el acto es de la Alcaldesa, no hay jerárquico y la reposición agota la vía administrativa. La autoridad resuelve en no más de 30 días y, en el jerárquico, oye antes al órgano recurrido. La interposición no suspende la ejecución, salvo que la autoridad lo decida a petición fundada (art. 57). Vencido el plazo, sólo queda la revisión extraordinaria contra el acto firme, por causal tasada (art. 60), o la vía judicial.",
      repregunta: "¿Qué cambia si la resolución la firmó la Alcaldesa y no el Director de Obras?",
      prioridad: "S", fuente: "proceadmin",
    },
    {
      id: "m07-o-03", modulo: 7,
      pregunta: "¿Qué valor jurídico tiene un dictamen de la Contraloría y cómo se relaciona con la jurisprudencia administrativa?",
      profesor: "Comisión de Derecho Administrativo",
      claves: ["Forma en que el Contralor informa", "Obligatorio para los funcionarios en el caso concreto", "Constituye la jurisprudencia administrativa", "Dependencia técnica de los abogados de los servicios", "No se informa lo litigioso ni lo sometido a tribunales", "Las municipalidades están sujetas a sus dictámenes"],
      trampas: ["Es una opinión no vinculante", "Obliga a los tribunales", "El concejo puede dejarlo sin efecto", "Sólo obliga a quien lo pidió", "Puede dictaminar sobre un juicio en curso"],
      modelo: "Cuando el Contralor informa a petición de parte, de jefaturas de servicio o de otras autoridades, lo hace por dictámenes (art. 5 Ley 10.336). Esos informes son obligatorios para los funcionarios correspondientes en el caso concreto (art. 9 inc. final) y, junto con las decisiones de la Contraloría, son los únicos medios que constituyen jurisprudencia administrativa (art. 6). Los abogados de los servicios fiscalizados que no llevan defensa judicial quedan bajo la dependencia técnica de la Contraloría y deben observar esa jurisprudencia (art. 19). La Contraloría no informa asuntos propiamente litigiosos ni sometidos a los tribunales (art. 6). Las municipalidades están sujetas a su control de legalidad y a sus dictámenes (art. 52 Ley 18.695).",
      prioridad: "A", fuente: "nuevo",
    },
  ],

  columnas: [
    {
      id: "m07-c-01", modulo: 7, titulo: "¿Recurso ordinario o revisión extraordinaria?",
      izq: "Reposición / jerárquico (art. 59)", der: "Revisión (art. 60)",
      items: [
        { texto: "Plazo de cinco días desde la notificación", lado: 0, porque: "Art. 59." },
        { texto: "Procede contra actos firmes", lado: 1, porque: "La revisión supone un acto firme (art. 60)." },
        { texto: "Plazo de un año", lado: 1, porque: "Art. 60, con cómputo según la causal." },
        { texto: "Cualquier ilegalidad del acto", lado: 0, porque: "Los ordinarios no tienen causales tasadas." },
        { texto: "Sólo por causales tasadas", lado: 1, porque: "Letras a) a d) del art. 60." },
        { texto: "Se interpone ante el mismo órgano que dictó el acto, con jerárquico en subsidio", lado: 0, porque: "Es la reposición del art. 59." },
        { texto: "Ante el superior jerárquico o, si no lo hay, ante la autoridad que dictó el acto", lado: 1, porque: "Art. 60." },
        { texto: "La autoridad tiene no más de 30 días para resolver", lado: 0, porque: "Art. 59; el art. 60 no fija plazo para resolver." },
        { texto: "Sentencia ejecutoriada que declara cohecho en la dictación del acto", lado: 1, porque: "Letra c) del art. 60." },
        { texto: "Agota la vía administrativa contra los actos de un alcalde", lado: 0, porque: "La reposición agota la vía cuando no hay jerárquico (art. 59)." },
      ],
      norma: "Arts. 59 y 60 Ley 19.880", fuente: "procedimiento-admin",
    },
  ],

  cadenas: [
    {
      id: "m07-k-01", modulo: 7, titulo: "El viaje de una reposición con jerárquico en subsidio",
      pasos: ["Se notifica el acto terminal", "Dentro de cinco días, reposición ante el mismo órgano, con jerárquico en subsidio", "El órgano rechaza total o parcialmente la reposición", "Se eleva el expediente al superior jerárquico", "El superior oye al órgano recurrido, que formula sus descargos", "El superior resuelve en no más de 30 días: modifica, reemplaza o deja sin efecto", "Agotada la vía administrativa, queda la acción judicial"],
      nota: "Si el acto es de un alcalde, un ministro, el Presidente o un jefe superior de servicio descentralizado, la cadena se corta en la reposición: no hay superior al que elevar.",
      norma: "Art. 59 Ley 19.880", fuente: "proceadmin",
    },
    {
      id: "m07-k-02", modulo: 7, titulo: "Un decreto supremo pasa por Contraloría",
      pasos: ["El Presidente dicta el decreto que por ley debe tramitarse por Contraloría", "El decreto ingresa a la Contraloría", "Corren quince días, prorrogables por otros quince con resolución fundada", "El Contralor toma razón o representa la ilegalidad", "Representado, el Presidente insiste con la firma de todos sus ministros o se conforma", "La Contraloría da curso al decreto de insistencia y envía copia a la Cámara de Diputados", "Si la representación fue por inconstitucionalidad, no hay insistencia: antecedentes al Tribunal Constitucional en diez días"],
      norma: "Art. 99 CPR; art. 10 Ley 10.336", fuente: "nuevo",
    },
  ],

  expedientes: [
    {
      id: "m07-e-01", modulo: 7,
      titulo: "El oficio que la Alcaldesa quiere ignorar",
      relato: "Llega un oficio de la Contraloría Regional con un dictamen: la asignación que la Municipalidad paga a tres jefaturas no procede. La Alcaldesa Ruperta Cañas te dice: «Es la opinión del Contralor; nosotros tenemos la nuestra».",
      documento: { tipo: "Oficio de la Contraloría Regional", campos: [ { k: "Órgano", v: "Contraloría Regional" }, { k: "Materia", v: "Dictamen sobre procedencia de asignación a jefaturas municipales" }, { k: "Concluye", v: "La asignación no procede; debe cesar su pago" }, { k: "Origen", v: "Consulta de un concejal" }, { k: "Fundamento", v: "Arts. 6 y 9 Ley 10.336" } ] },
      vicio: null,
      pregunta: "¿Qué sello le pones al oficio?",
      sellos: [
        { texto: "ARCHIVAR: es una opinión no vinculante", correcto: false, porque: "Los informes del Contralor son obligatorios para los funcionarios en el caso concreto (art. 9 inc. final Ley 10.336)." },
        { texto: "CUMPLIR: el dictamen obliga a la Municipalidad", correcto: true, porque: "Los dictámenes son la forma en que el Contralor informa (art. 5) y son obligatorios para los funcionarios correspondientes en el caso concreto (art. 9 inc. final Ley 10.336); las municipalidades están sujetas a su control de legalidad (art. 52 Ley 18.695). El desacuerdo se plantea por los cauces legales, no ignorándolo." },
        { texto: "RECURRIR DE REPOSICIÓN ANTE EL CONCEJO", correcto: false, porque: "El concejo no revisa dictámenes de Contraloría; los informes se le ponen en conocimiento (art. 55 Ley 18.695)." },
        { texto: "ESPERAR LA TOMA DE RAZÓN", correcto: false, porque: "Un dictamen no se toma razón; es el informe jurídico de la Contraloría, obligatorio en el caso (arts. 5 y 9 Ley 10.336)." },
      ],
      norma: "Arts. 5, 6 y 9 Ley 10.336; art. 52 Ley 18.695", fuente: "nuevo", hallazgo: "m07-dictamenes",
    },
    {
      id: "m07-e-02", modulo: 7,
      titulo: "Decreto rumbo a toma de razón",
      relato: "La Jefa de Partes, Rosa Tapia, tiene listo un sobre para la Contraloría: un decreto alcaldicio que nombra a un jefe de departamento, «para su toma de razón, como corresponde».",
      documento: { tipo: "Decreto alcaldicio", campos: [ { k: "Órgano", v: "Alcaldesa Ruperta Cañas" }, { k: "Dispone", v: "Nombra jefe del Departamento de Aseo" }, { k: "Afecta a", v: "Un funcionario municipal" }, { k: "Trámite propuesto", v: "Envío a Contraloría para toma de razón" } ] },
      vicio: "Trámite propuesto",
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "A TOMA DE RAZÓN: nombra a un funcionario", correcto: false, porque: "Las resoluciones municipales están exentas de toma de razón (art. 53 Ley 18.695)." },
        { texto: "EXENTO: no va a toma de razón, pero se registra en Contraloría", correcto: true, porque: "Art. 53 Ley 18.695: exentas del trámite de toma de razón, pero deben registrarse en la Contraloría cuando afecten a funcionarios municipales." },
        { texto: "EXENTO Y SIN REGISTRO: la Municipalidad es autónoma", correcto: false, porque: "La autonomía no quita el registro cuando el acto afecta a funcionarios (art. 53) ni la fiscalización de la Contraloría (art. 51 Ley 18.695)." },
      ],
      norma: "Art. 53 Ley 18.695", fuente: "nuevo", hallazgo: "m07-municipal",
    },
    {
      id: "m07-e-03", modulo: 7,
      titulo: "Jerárquico contra la Alcaldesa",
      relato: "Don Aurelio Pinto presenta un «recurso jerárquico» contra un decreto de la Alcaldesa, dirigido al Delegado Presidencial Regional, «que es su jefe». Lo presentó a los tres días de notificado.",
      documento: { tipo: "Recurso jerárquico", campos: [ { k: "Contra", v: "Decreto alcaldicio que deniega permiso de feria" }, { k: "Dirigido a", v: "Delegado Presidencial Regional" }, { k: "Presentado", v: "Al tercer día hábil desde la notificación" }, { k: "Pide", v: "Que el superior deje sin efecto el decreto" } ] },
      vicio: "Dirigido a",
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "ELEVAR AL DELEGADO PRESIDENCIAL", correcto: false, porque: "El alcalde no tiene superior jerárquico para estos efectos: no procede jerárquico contra sus actos (art. 59 Ley 19.880)." },
        { texto: "NO PROCEDE JERÁRQUICO: tramitar como reposición ante la Alcaldesa", correcto: true, porque: "Contra los actos de los alcaldes no procede recurso jerárquico; la reposición agota la vía administrativa (art. 59 Ley 19.880). Está dentro de los cinco días y el principio de no formalización (art. 13) permite darle el curso que corresponde." },
        { texto: "RECHAZAR DE PLANO: se equivocó de recurso", correcto: false, porque: "Está en plazo y el error de nombre no impide tramitarlo como reposición ante el mismo órgano (arts. 13 y 59 Ley 19.880)." },
        { texto: "REMITIR A CONTRALORÍA", correcto: false, porque: "La Contraloría no resuelve recursos administrativos contra decretos alcaldicios; el cauce es el art. 59 Ley 19.880." },
      ],
      norma: "Arts. 13 y 59 Ley 19.880", fuente: "proceadmin", hallazgo: "m07-reposicion-jerarquico",
    },
    {
      id: "m07-e-04", modulo: 7,
      titulo: "Reposición en regla",
      relato: "La señora Marta Quilodrán presenta reposición contra el decreto que le negó la patente, ante la Alcaldesa, al cuarto día hábil. Pide dejarlo sin efecto y acompaña documentos nuevos.",
      documento: { tipo: "Recurso de reposición", campos: [ { k: "Contra", v: "Decreto alcaldicio que deniega patente comercial" }, { k: "Ante", v: "Alcaldesa Ruperta Cañas (mismo órgano)" }, { k: "Presentado", v: "Cuarto día hábil desde la notificación" }, { k: "Pide", v: "Dejar sin efecto el decreto y otorgar la patente" }, { k: "Acompaña", v: "Certificado de recepción final de obras" } ] },
      vicio: null,
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "ADMITIR: resolver en no más de 30 días", correcto: true, porque: "Reposición dentro de cinco días ante el mismo órgano que dictó el acto; la autoridad tiene un plazo no superior a 30 días para resolver y puede modificar, reemplazar o dejar sin efecto el acto (art. 59 Ley 19.880)." },
        { texto: "INADMISIBLE: debió ir al superior", correcto: false, porque: "La reposición va ante el mismo órgano que dictó el acto (art. 59 Ley 19.880)." },
        { texto: "SUSPENDER EL DECRETO DE INMEDIATO", correcto: false, porque: "La interposición no suspende; la suspensión requiere petición fundada y riesgo de daño irreparable (art. 57 Ley 19.880), y aquí no se pidió." },
        { texto: "RECHAZAR: no se pueden acompañar documentos nuevos", correcto: false, porque: "Los interesados pueden aportar documentos en cualquier momento (art. 10 Ley 19.880)." },
      ],
      norma: "Arts. 57 y 59 Ley 19.880", fuente: "acto-admin", hallazgo: "m07-reposicion-jerarquico",
    },
    {
      id: "m07-e-05", modulo: 7,
      titulo: "Revisión catorce meses después",
      relato: "Un vecino pide la revisión de un decreto firme por «manifiesto error de hecho»: dice que la Dirección de Obras midió mal su terreno. El decreto se dictó hace catorce meses.",
      documento: { tipo: "Recurso extraordinario de revisión", campos: [ { k: "Contra", v: "Decreto alcaldicio firme sobre línea de edificación" }, { k: "Causal invocada", v: "Letra b): manifiesto error de hecho determinante" }, { k: "Dictado hace", v: "14 meses" }, { k: "Ante", v: "Alcaldesa (no hay superior jerárquico)" }, { k: "Sentencia judicial", v: "No hay" } ] },
      vicio: "Dictado hace",
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "ADMITIR: el error de hecho es causal", correcto: false, porque: "La causal existe, pero el plazo de un año en la letra b) se cuenta desde el día siguiente a la dictación, y ya pasaron catorce meses (art. 60 Ley 19.880)." },
        { texto: "EXTEMPORÁNEO: un año desde la dictación en las letras a) y b)", correcto: true, porque: "El plazo es de un año desde el día siguiente a aquel en que se dictó la resolución, en los casos de las letras a) y b); sólo en las letras c) y d) se cuenta desde la sentencia ejecutoriada (art. 60 Ley 19.880)." },
        { texto: "ELEVAR A CONTRALORÍA", correcto: false, porque: "La revisión se interpone ante el superior jerárquico o, en su defecto, ante la autoridad que dictó el acto (art. 60 Ley 19.880)." },
        { texto: "ADMITIR COMO REPOSICIÓN", correcto: false, porque: "La reposición tiene cinco días desde la notificación (art. 59); el acto está firme hace más de un año." },
      ],
      norma: "Art. 60 Ley 19.880", fuente: "procedimiento-admin", hallazgo: "m07-revision",
    },
    {
      id: "m07-e-06", modulo: 7,
      titulo: "Invalidar lo de hace tres años",
      relato: "La unidad de control interno detectó que un permiso de edificación otorgado hace dos años y tres meses era ilegal: lo firmó un funcionario sin facultades. La Alcaldesa quiere invalidarlo hoy.",
      documento: { tipo: "Proyecto de decreto invalidatorio", campos: [ { k: "Órgano", v: "Alcaldesa Ruperta Cañas" }, { k: "Dispone", v: "Invalida permiso de edificación" }, { k: "Vicio", v: "Firmado por funcionario sin competencia" }, { k: "Permiso notificado hace", v: "2 años y 3 meses" }, { k: "Audiencia del interesado", v: "Programada" } ] },
      vicio: "Permiso notificado hace",
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "INVALIDAR: el vicio es grave", correcto: false, porque: "La potestad invalidatoria debe ejercerse dentro de dos años desde la notificación o publicación; vencido el plazo, no procede por esta vía (art. 53 Ley 19.880)." },
        { texto: "FUERA DE PLAZO: ya pasaron los dos años", correcto: true, porque: "La autoridad puede invalidar «siempre que lo haga dentro de los dos años contados desde la notificación o publicación del acto» (art. 53 Ley 19.880). Lo que queda es la vía judicial (nulidad de derecho público), y la Contraloría puede perseguir la responsabilidad del funcionario." },
        { texto: "REVOCAR EN VEZ DE INVALIDAR", correcto: false, porque: "La revocación no procede contra actos creadores de derechos adquiridos legítimamente (art. 61 Ley 19.880) y no sirve para corregir ilegalidad." },
      ],
      norma: "Arts. 53 y 61 Ley 19.880", fuente: "acto-admin", hallazgo: "m07-invalidacion-control",
    },
  ],
};

// PENDIENTE DE REVISIÓN: en m07-e-06 se afirma que, vencidos los dos años del art.
// 53, «queda la vía judicial (nulidad de derecho público)»; es doctrina y
// jurisprudencia, no texto expreso. Revisar con el módulo 10.
// PENDIENTE DE REVISIÓN: en m07-e-03 se da curso al «jerárquico» como reposición
// invocando el principio de no formalización (art. 13 Ley 19.880); la
// reconducción del recurso mal nombrado es práctica y doctrina, no regla expresa.
// PENDIENTE DE REVISIÓN: el expediente m07-e-01 presenta al dictamen como obligatorio
// para la Municipalidad (arts. 9 inc. final Ley 10.336 y 52 Ley 18.695); la Ley
// 18.695 no dice textualmente que los dictámenes «obligan» a las municipalidades,
// pero el art. 51 las somete a la fiscalización de la Contraloría y el art. 52 la
// faculta para dictaminar sobre todas las materias sujetas a su control.
