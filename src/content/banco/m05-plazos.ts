// Módulo 5 · El reloj: plazos, notificación y silencio administrativo.
// Fuentes: procedimiento-admin (PLAZOS_DATA, FDECKS, QUIZ), proceadmin-rpg
// (arts. 25, 45–47, 64–66; misión «notificación fantasma»; examen q3) y texto
// nuevo. Verificado contra l19880.xml de la BCN (versión 2026-02-05) el
// 12-10-2026. El silencio administrativo sigue el texto de la ley (arts. 64 a
// 66), no los apuntes de procedimiento-admin, que estaban equivocados.
import type { BancoModulo } from "../tipos";

export const BANCO_M05: BancoModulo = {
  modulo: 5,

  hallazgos: [
    {
      id: "m05-dias-habiles", modulo: 5,
      titulo: "Los días se cuentan hábiles",
      texto: "Los plazos de días de la Ley 19.880 son de días hábiles: no cuentan sábados, domingos ni festivos. Se empiezan a contar desde el día siguiente a la notificación o publicación del acto, y si el último día cae en inhábil, el plazo se corre al primer día hábil siguiente.",
      norma: "Art. 25 Ley 19.880",
      simple: "El sábado no existe para la Administración. Para tu plazo, tampoco.",
    },
    {
      id: "m05-notificar-cinco-dias", modulo: 5,
      titulo: "Cinco días para avisar",
      texto: "Un acto de efectos individuales debe notificarse a los interesados con su texto íntegro, a más tardar cinco días después de quedar totalmente tramitado. Si no se sabe dónde está la persona, se publica en el Diario Oficial.",
      norma: "Art. 45 Ley 19.880",
      simple: "Decidir es la mitad del trabajo; la otra mitad es contarle al afectado, completo y en cinco días.",
    },
    {
      id: "m05-notificacion-electronica", modulo: 5,
      titulo: "Notificado al tercer día hábil",
      texto: "La regla es la notificación electrónica al domicilio digital único, que se entiende practicada al tercer día hábil desde el envío. Quien no tiene medios electrónicos puede pedir otra forma; la carta certificada se entiende practicada al tercer día desde que llega a la oficina de correos.",
      norma: "Art. 46 Ley 19.880",
      simple: "El correo sale hoy, pero la ley lo lee por ti al tercer día hábil. Mirar antes no te adelanta nada.",
    },
    {
      id: "m05-notificacion-tacita", modulo: 5,
      titulo: "Si actuaste, ya sabías",
      texto: "Aunque no haya notificación, o la que hubo esté viciada, el acto se entiende notificado si el interesado hace cualquier gestión posterior que suponga necesariamente que lo conoce, sin haber reclamado antes de la falta o nulidad de la notificación.",
      norma: "Art. 47 Ley 19.880",
      simple: "Si contestas el fondo sin reclamar primero por la notificación, acabas de notificarte solo.",
    },
    {
      id: "m05-silencio-positivo", modulo: 5,
      titulo: "La ruta del silencio positivo",
      texto: "Vencido el plazo legal para resolver una solicitud, el interesado denuncia el incumplimiento ante la autoridad que debía resolver. Esa autoridad da recibo, eleva copia a su superior en 24 horas y, si no se pronuncia en cinco días desde la denuncia, la solicitud se entiende aceptada. Después se pide el certificado.",
      norma: "Art. 64 Ley 19.880",
      simple: "El silencio no aprueba solo: hay que denunciarlo, esperar cinco días y pedir el papel. No existen los «seis meses mágicos».",
    },
    {
      id: "m05-silencio-negativo", modulo: 5,
      titulo: "Cuando callar es decir que no",
      texto: "La solicitud no resuelta en plazo se entiende rechazada si afecta el patrimonio fiscal, si la Administración actúa de oficio, si se trata de impugnaciones o revisiones de actos, o si se ejerce el derecho de petición del art. 19 N.º 14 de la Constitución. El interesado pide el certificado y desde su fecha corren los plazos para recurrir.",
      norma: "Art. 65 Ley 19.880",
      simple: "Con la plata del Fisco y con los recursos, el silencio siempre significa «no». Al menos es un «no» que abre puertas.",
    },
    {
      id: "m05-seis-meses", modulo: 5,
      titulo: "Seis meses, y no se amplía lo vencido",
      texto: "Salvo caso fortuito o fuerza mayor, el procedimiento no puede durar más de seis meses desde su inicio hasta la decisión final. La Administración puede ampliar un plazo hasta la mitad, de oficio o a petición, pero sólo antes de que venza: un plazo vencido no se amplía.",
      norma: "Arts. 26 y 27 Ley 19.880",
      simple: "Se puede pedir más tiempo, pero antes de que se acabe. Después, lo único que se puede pedir es perdón.",
    },
  ],

  afirmaciones: [
    { id: "m05-af-01", modulo: 5, hallazgo: "m05-dias-habiles", texto: "Un plazo de cinco días de la Ley 19.880 que empieza un lunes vence el viernes de esa semana.", verdad: true, porque: "Si el primer día de cómputo es el lunes (porque la notificación fue el viernes anterior), los cinco días hábiles son lunes, martes, miércoles, jueves y viernes (art. 25 Ley 19.880)." },
    { id: "m05-af-02", modulo: 5, hallazgo: "m05-dias-habiles", texto: "El día en que te notifican cuenta como primer día del plazo.", verdad: false, porque: "Los plazos se computan desde el día siguiente a la notificación o publicación (art. 25 Ley 19.880)." },
    { id: "m05-af-03", modulo: 5, hallazgo: "m05-notificar-cinco-dias", texto: "La notificación debe contener el texto íntegro del acto.", verdad: true, porque: "Los actos de efectos individuales se notifican conteniendo su texto íntegro (art. 45 Ley 19.880)." },
    { id: "m05-af-04", modulo: 5, hallazgo: "m05-notificar-cinco-dias", texto: "Si se ignora el paradero del interesado, el acto se notifica por aviso en la Municipalidad.", verdad: false, porque: "Los actos que afecten a personas de paradero ignorado se publican en el Diario Oficial (art. 45 Ley 19.880)." },
    { id: "m05-af-05", modulo: 5, hallazgo: "m05-notificacion-electronica", texto: "La notificación electrónica se entiende practicada al tercer día hábil desde su envío.", verdad: true, porque: "Art. 46 Ley 19.880: producen pleno efecto y se entienden practicadas al tercer día hábil siguiente contado desde la fecha de envío." },
    { id: "m05-af-06", modulo: 5, hallazgo: "m05-notificacion-electronica", texto: "La carta certificada se entiende practicada el día en que el cartero la entrega en la casa.", verdad: false, porque: "Se entiende practicada a contar del tercer día siguiente a su recepción en la oficina de correos que corresponda (art. 46 Ley 19.880)." },
    { id: "m05-af-07", modulo: 5, hallazgo: "m05-notificacion-tacita", texto: "Quien presenta un recurso contra el acto sin reclamar antes por la falta de notificación queda notificado tácitamente.", verdad: true, porque: "Cualquier gestión posterior que suponga necesariamente el conocimiento del acto, sin reclamo previo, notifica (art. 47 Ley 19.880)." },
    { id: "m05-af-08", modulo: 5, hallazgo: "m05-notificacion-tacita", texto: "Si la notificación fue viciada, el acto nunca puede entenderse notificado.", verdad: false, porque: "Aun con notificación viciada, la gestión que supone conocimiento sin reclamo previo sanea la falta (art. 47 Ley 19.880)." },
    { id: "m05-af-09", modulo: 5, hallazgo: "m05-silencio-positivo", texto: "Para que opere el silencio positivo, el interesado debe denunciar el incumplimiento del plazo ante la autoridad que debía resolver.", verdad: true, porque: "Vencido el plazo, el interesado denuncia; si la autoridad no se pronuncia en cinco días desde la denuncia, la solicitud se entiende aceptada (art. 64 Ley 19.880)." },
    { id: "m05-af-10", modulo: 5, hallazgo: "m05-silencio-positivo", texto: "Transcurridos seis meses sin respuesta, la solicitud se entiende aprobada automáticamente.", verdad: false, porque: "No hay aprobación automática: se necesita la denuncia y que pasen cinco días sin pronunciamiento (art. 64 Ley 19.880). El art. 27 fija la duración máxima del procedimiento, no un silencio." },
    { id: "m05-af-11", modulo: 5, hallazgo: "m05-silencio-negativo", texto: "Una reposición no resuelta en plazo se entiende rechazada.", verdad: true, porque: "El silencio es negativo cuando la Administración debe pronunciarse sobre impugnaciones de actos administrativos (art. 65 Ley 19.880)." },
    { id: "m05-af-12", modulo: 5, hallazgo: "m05-silencio-negativo", texto: "En el silencio negativo, los plazos para recurrir corren desde que venció el plazo para resolver.", verdad: false, porque: "Corren desde la fecha en que se expide el certificado de que la solicitud no fue resuelta en plazo (art. 65 Ley 19.880)." },
    { id: "m05-af-13", modulo: 5, hallazgo: "m05-seis-meses", texto: "La ampliación de un plazo no puede exceder de la mitad del plazo original.", verdad: true, porque: "La Administración puede conceder una ampliación que no exceda de la mitad de los plazos establecidos (art. 26 Ley 19.880)." },
    { id: "m05-af-14", modulo: 5, hallazgo: "m05-seis-meses", texto: "Un plazo ya vencido puede ampliarse si el interesado lo pide con buenas razones.", verdad: false, porque: "En ningún caso puede ser objeto de ampliación un plazo ya vencido (art. 26 Ley 19.880)." },
  ],

  fichas: [
    { id: "m05-f-01", modulo: 5, frente: "¿Cómo se cuentan los plazos de días de la Ley 19.880?", dorso: "Son días hábiles (sábados, domingos y festivos son inhábiles) y corren desde el día siguiente a la notificación, publicación o al efecto del silencio.", norma: "Art. 25 Ley 19.880", etiqueta: "Plazos", prioridad: "S", fuente: "proceadmin" },
    { id: "m05-f-02", modulo: 5, frente: "El último día del plazo cae domingo. ¿Cuándo vence?", dorso: "Se prorroga al primer día hábil siguiente: el lunes, si no es festivo.", norma: "Art. 25 Ley 19.880", etiqueta: "Plazos", prioridad: "A", fuente: "nuevo" },
    { id: "m05-f-03", modulo: 5, frente: "Un plazo de meses empieza el 31 de enero. ¿Cuándo vence?", dorso: "Si en el mes de vencimiento no hay un día equivalente, el plazo expira el último día de ese mes (el 28 o 29 de febrero).", norma: "Art. 25 Ley 19.880", etiqueta: "Plazos", prioridad: "B", fuente: "nuevo" },
    { id: "m05-f-04", modulo: 5, frente: "Presentas un escrito en la plataforma electrónica un sábado. ¿Cuándo se entiende presentado?", dorso: "Las plataformas reciben todos los días a toda hora, pero lo presentado en día inhábil se entiende realizado en la primera hora del primer día hábil siguiente.", norma: "Art. 25 Ley 19.880", etiqueta: "Plazos", prioridad: "A", fuente: "nuevo" },
    { id: "m05-f-05", modulo: 5, frente: "Ampliación de plazos: ¿cuánto y cuándo?", dorso: "Hasta la mitad del plazo, de oficio o a petición, si no se perjudican derechos de terceros. La petición y la decisión deben producirse antes del vencimiento; un plazo vencido no se amplía.", norma: "Art. 26 Ley 19.880", etiqueta: "Plazos", prioridad: "A", fuente: "nuevo" },
    { id: "m05-f-06", modulo: 5, frente: "Duración máxima del procedimiento administrativo", dorso: "Seis meses desde su inicio hasta la decisión final, salvo caso fortuito o fuerza mayor. Es un plazo máximo del procedimiento, no el presupuesto del silencio.", norma: "Art. 27 Ley 19.880", etiqueta: "Plazos", prioridad: "S", fuente: "procedimiento-admin" },
    { id: "m05-f-07", modulo: 5, frente: "La solicitud llega incompleta. ¿Qué plazo hay para arreglarla?", dorso: "Se requiere al interesado para que subsane en cinco días, con advertencia de que si no lo hace se le tendrá por desistido.", norma: "Art. 31 Ley 19.880", etiqueta: "Plazos", prioridad: "A", fuente: "proceadmin" },
    { id: "m05-f-08", modulo: 5, frente: "¿Qué actos deben notificarse y cómo?", dorso: "Los de efectos individuales, a los interesados, con su texto íntegro, a más tardar en los cinco días siguientes a quedar totalmente tramitados.", norma: "Art. 45 Ley 19.880", etiqueta: "Notificación", prioridad: "S", fuente: "proceadmin" },
    { id: "m05-f-09", modulo: 5, frente: "Paradero ignorado del interesado", dorso: "El acto se publica en el Diario Oficial.", norma: "Art. 45 Ley 19.880", etiqueta: "Notificación", prioridad: "B", fuente: "nuevo" },
    { id: "m05-f-10", modulo: 5, frente: "Regla general de notificación hoy", dorso: "Por medios electrónicos, al domicilio digital único del registro de la Secretaría de Gobierno Digital. Tiene carácter de personal y se entiende practicada al tercer día hábil desde el envío.", norma: "Art. 46 Ley 19.880", etiqueta: "Notificación", prioridad: "S", fuente: "nuevo" },
    { id: "m05-f-11", modulo: 5, frente: "¿Y quien no tiene medios electrónicos?", dorso: "Pide por formulario una forma distinta; el órgano se pronuncia en tres días y, si niega, debe fundarlo. Si no es posible la forma pedida, carta certificada al domicilio designado.", norma: "Art. 46 Ley 19.880", etiqueta: "Notificación", prioridad: "A", fuente: "nuevo" },
    { id: "m05-f-12", modulo: 5, frente: "Carta certificada: ¿desde cuándo se entiende practicada?", dorso: "Desde el tercer día siguiente a su recepción en la oficina de correos que corresponda.", norma: "Art. 46 Ley 19.880", etiqueta: "Notificación", prioridad: "A", fuente: "nuevo" },
    { id: "m05-f-13", modulo: 5, frente: "Notificación en las oficinas de la Administración", dorso: "Procede si el interesado se apersona a recibirla; se deja constancia en el expediente electrónico con fecha y hora, y se le da copia del acto en el momento si la pide.", norma: "Art. 46 Ley 19.880", etiqueta: "Notificación", prioridad: "B", fuente: "nuevo" },
    { id: "m05-f-14", modulo: 5, frente: "Notificación tácita", dorso: "Sin notificación, o con una viciada, el acto se entiende notificado si el interesado hace cualquier gestión posterior que suponga necesariamente su conocimiento, sin reclamar antes de la falta o nulidad.", norma: "Art. 47 Ley 19.880", etiqueta: "Notificación", prioridad: "S", fuente: "proceadmin" },
    { id: "m05-f-15", modulo: 5, frente: "¿Desde cuándo producen efectos los decretos y resoluciones?", dorso: "Desde su notificación (contenido individual) o publicación (contenido general).", norma: "Art. 51 inc. 2 Ley 19.880", etiqueta: "Notificación", prioridad: "A", fuente: "acto-admin" },
    { id: "m05-f-16", modulo: 5, frente: "Pasos del silencio positivo", dorso: "1) Vence el plazo legal para resolver la solicitud. 2) El interesado denuncia el incumplimiento ante la autoridad que debía resolver. 3) Recibo con fecha y copia al superior en 24 horas. 4) Cinco días sin pronunciamiento: solicitud aceptada. 5) Certificado, sin más trámite.", norma: "Art. 64 Ley 19.880", etiqueta: "Silencio", prioridad: "S", fuente: "proceadmin" },
    { id: "m05-f-17", modulo: 5, frente: "Casos de silencio negativo", dorso: "Solicitud que afecte el patrimonio fiscal; actuación de oficio de la Administración; impugnaciones o revisiones de actos administrativos; ejercicio del derecho de petición (art. 19 N.º 14 CPR).", norma: "Art. 65 Ley 19.880", etiqueta: "Silencio", prioridad: "S", fuente: "proceadmin" },
    { id: "m05-f-18", modulo: 5, frente: "¿Para qué sirve el certificado en el silencio negativo?", dorso: "Acredita que la solicitud no fue resuelta en plazo; desde su fecha corren los plazos para interponer los recursos que procedan.", norma: "Art. 65 Ley 19.880", etiqueta: "Silencio", prioridad: "A", fuente: "nuevo" },
    { id: "m05-f-19", modulo: 5, frente: "Efectos del acto que termina por silencio", dorso: "Los mismos que un acto que termina por resolución expresa, desde la fecha de la certificación respectiva.", norma: "Art. 66 Ley 19.880", etiqueta: "Silencio", prioridad: "A", fuente: "proceadmin" },
    { id: "m05-f-20", modulo: 5, frente: "¿Qué dicen (mal) muchos apuntes sobre el silencio?", dorso: "Que opera a los seis meses y que el negativo es para procedimientos de oficio «que afectan derechos». La ley dice otra cosa: el positivo exige denuncia y cinco días; el negativo tiene cuatro casos tasados.", norma: "Arts. 64 y 65 Ley 19.880", etiqueta: "Silencio", prioridad: "A", fuente: "nuevo" },
    { id: "m05-f-21", modulo: 5, frente: "Plazo para presentar reposición y jerárquico", dorso: "Cinco días desde la notificación del acto, contados como días hábiles desde el día siguiente.", norma: "Arts. 25 y 59 Ley 19.880", etiqueta: "Plazos", prioridad: "S", fuente: "procedimiento-admin" },
    { id: "m05-f-22", modulo: 5, frente: "Recurso extraordinario de revisión: ¿qué plazo?", dorso: "Un año, contado desde el día siguiente a la dictación de la resolución en los casos de falta de emplazamiento y error de hecho o documentos esenciales; en los de sentencia ejecutoriada, desde que ésta queda ejecutoriada.", norma: "Art. 60 Ley 19.880", etiqueta: "Plazos", prioridad: "B", fuente: "procedimiento-admin" },
  ],

  quiz: [
    { id: "m05-q-01", modulo: 5, texto: "Te notifican un decreto el miércoles 1. El plazo de cinco días para reponer vence el…", opciones: ["Lunes 6", "Miércoles 8", "Sábado 4", "Viernes 3"], correcta: 1, porque: "Se cuenta desde el día siguiente y sólo días hábiles: jueves 2, viernes 3, lunes 6, martes 7 y miércoles 8 (art. 25 Ley 19.880).", norma: "Art. 25 Ley 19.880", fuente: "nuevo" },
    { id: "m05-q-02", modulo: 5, texto: "¿Qué plazo tiene la Administración para notificar un acto de efectos individuales?", opciones: ["Tres días desde que se firma", "Cinco días desde que queda totalmente tramitado", "Diez días desde su dictación", "No hay plazo: basta con notificarlo antes de ejecutarlo"], correcta: 1, porque: "A más tardar en los cinco días siguientes a aquel en que quedó totalmente tramitado (art. 45 Ley 19.880).", norma: "Art. 45 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m05-q-03", modulo: 5, texto: "La notificación electrónica al domicilio digital único se entiende practicada…", opciones: ["Cuando el interesado abre el correo", "Al momento del envío", "Al tercer día hábil siguiente al envío", "Al quinto día corrido desde el envío"], correcta: 2, porque: "Producen pleno efecto y se entienden practicadas al tercer día hábil siguiente contado desde la fecha de envío (art. 46 Ley 19.880).", norma: "Art. 46 Ley 19.880", fuente: "nuevo" },
    { id: "m05-q-04", modulo: 5, texto: "Un vecino nunca fue notificado, pero presenta una reposición contra el fondo del decreto sin decir nada de la notificación. ¿Qué pasa?", opciones: ["El acto sigue sin notificarse", "Queda notificado tácitamente", "La reposición es inadmisible", "El acto es nulo por falta de notificación"], correcta: 1, porque: "Hizo una gestión que supone necesariamente conocer el acto, sin reclamar antes de la falta de notificación (art. 47 Ley 19.880).", norma: "Art. 47 Ley 19.880", fuente: "proceadmin" },
    { id: "m05-q-05", modulo: 5, texto: "Vencido el plazo legal para resolver una solicitud, ¿cuál es el primer paso para que opere el silencio positivo?", opciones: ["Pedir el certificado de silencio", "Denunciar el incumplimiento ante la autoridad que debía resolver", "Recurrir de protección", "Esperar seis meses más"], correcta: 1, porque: "El interesado denuncia el incumplimiento del plazo ante la autoridad que debía resolver, requiriéndole una decisión (art. 64 Ley 19.880).", norma: "Art. 64 Ley 19.880", fuente: "proceadmin" },
    { id: "m05-q-06", modulo: 5, texto: "Hecha la denuncia, ¿cuánto tiene la autoridad para pronunciarse antes de que la solicitud se entienda aceptada?", opciones: ["24 horas", "Cinco días", "Treinta días", "Seis meses"], correcta: 1, porque: "Cinco días contados desde la recepción de la denuncia; las 24 horas son para elevar copia de la denuncia al superior (art. 64 Ley 19.880).", norma: "Art. 64 Ley 19.880", fuente: "nuevo" },
    { id: "m05-q-07", modulo: 5, texto: "¿En cuál de estos casos el silencio es negativo?", opciones: ["Solicitud de un permiso de edificación", "Solicitud que afecta el patrimonio fiscal", "Solicitud de copia de un expediente", "Cualquier solicitud que demore más de seis meses"], correcta: 1, porque: "El art. 65 enumera: patrimonio fiscal, actuación de oficio, impugnaciones o revisiones de actos y derecho de petición.", norma: "Art. 65 Ley 19.880", fuente: "proceadmin" },
    { id: "m05-q-08", modulo: 5, texto: "Presentaste una reposición y pasaron 40 días hábiles sin respuesta. ¿Qué corresponde?", opciones: ["Entender acogida la reposición", "Pedir el certificado: el silencio es negativo y desde su fecha corren los plazos para recurrir", "Presentar la misma reposición otra vez", "Nada: el plazo de la Administración no es fatal"], correcta: 1, porque: "En impugnaciones de actos el silencio es negativo; el certificado se otorga sin más trámite y desde su fecha corren los plazos de los recursos (art. 65 Ley 19.880).", norma: "Art. 65 Ley 19.880", fuente: "nuevo" },
    { id: "m05-q-09", modulo: 5, texto: "¿Desde cuándo produce efectos el acto que concluye por silencio administrativo?", opciones: ["Desde el vencimiento del plazo para resolver", "Desde la denuncia", "Desde la fecha de la certificación", "Desde que se publica en el Diario Oficial"], correcta: 2, porque: "Tiene los mismos efectos que una resolución expresa desde la fecha de la certificación respectiva (art. 66 Ley 19.880).", norma: "Art. 66 Ley 19.880", fuente: "proceadmin" },
    { id: "m05-q-10", modulo: 5, texto: "¿Cuánto puede durar, como máximo, un procedimiento administrativo?", opciones: ["30 días hábiles", "3 meses", "6 meses, salvo caso fortuito o fuerza mayor", "1 año"], correcta: 2, porque: "Art. 27 Ley 19.880: no puede exceder de seis meses desde su iniciación hasta la decisión final, salvo caso fortuito o fuerza mayor.", norma: "Art. 27 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m05-q-11", modulo: 5, texto: "La Dirección de Obras pide ampliar en diez días un plazo de diez días que venció ayer. ¿Procede?", opciones: ["Sí, hasta la mitad del plazo", "Sí, si no perjudica a terceros", "No: un plazo vencido no se amplía", "Sí, pero sólo cinco días"], correcta: 2, porque: "La ampliación (máximo la mitad) debe pedirse y decidirse antes del vencimiento; en ningún caso se amplía un plazo ya vencido (art. 26 Ley 19.880).", norma: "Art. 26 Ley 19.880", fuente: "nuevo" },
    { id: "m05-q-12", modulo: 5, texto: "Una solicitud no cumple los requisitos. ¿Qué hace la Administración?", opciones: ["La rechaza de plano", "Requiere al interesado para que subsane en cinco días, bajo apercibimiento de tenerlo por desistido", "La archiva a los 30 días", "La deriva a Contraloría"], correcta: 1, porque: "Art. 31 Ley 19.880: cinco días para subsanar o acompañar documentos, con indicación de que si no lo hace se le tendrá por desistido.", norma: "Art. 31 Ley 19.880", fuente: "proceadmin" },
  ],

  orales: [
    {
      id: "m05-o-01", modulo: 5,
      pregunta: "Un vecino pidió un permiso a la Municipalidad y el plazo legal para resolver venció sin respuesta. Describa la ruta del silencio positivo y sus límites.",
      profesor: "Comisión de Derecho Administrativo",
      claves: ["Vence el plazo legal para resolver", "Denuncia ante la autoridad que debía resolver", "Copia al superior en 24 horas", "Cinco días sin pronunciamiento: aceptada", "Certificado expedido sin más trámite", "Efectos desde la certificación (art. 66)", "No procede en los casos del art. 65"],
      trampas: ["Opera a los seis meses sin más trámite", "Basta pedir el certificado sin denunciar", "Procede en impugnaciones de actos", "El certificado lo emite Contraloría", "Se aplica a solicitudes que afectan el patrimonio fiscal"],
      modelo: "El silencio positivo exige una solicitud, el vencimiento del plazo legal para resolverla y la denuncia del interesado ante la autoridad que debía resolver, que da recibo y eleva copia a su superior en 24 horas. Si esa autoridad no se pronuncia en cinco días desde la denuncia, la solicitud se entiende aceptada y el interesado puede pedir que se certifique, sin más trámite. El acto así concluido tiene los mismos efectos que una resolución expresa desde la certificación. No opera en los casos de silencio negativo del art. 65: patrimonio fiscal, actuación de oficio, impugnaciones o revisiones de actos y derecho de petición.",
      repregunta: "¿Y si la solicitud era una subvención con cargo al presupuesto municipal?",
      prioridad: "S", fuente: "proceadmin",
    },
    {
      id: "m05-o-02", modulo: 5,
      pregunta: "La Municipalidad dice que notificó por correo electrónico, pero no hay constancia. Distinga existencia, validez y eficacia del acto y explique cómo se cuenta el plazo para recurrir.",
      profesor: "Comisión de Derecho Administrativo",
      claves: ["El acto existe y se presume legal", "Sin notificación válida no produce efectos", "Texto íntegro, cinco días desde la total tramitación", "Electrónica: practicada al tercer día hábil del envío", "Plazo corre desde el día siguiente, en días hábiles", "Reclamar la notificación antes de actuar sobre el fondo", "Notificación tácita si se actúa sin reclamar"],
      trampas: ["El acto no existe si no fue notificado", "El plazo corre desde la fecha de la firma", "Los sábados son hábiles para la Ley 19.880", "Reclamar el fondo primero protege mejor", "La carta certificada notifica al entregarse en el domicilio"],
      modelo: "El acto existe desde que se dicta y goza de presunción de legalidad, pero frente al interesado produce efectos desde su notificación (art. 51), que debe practicarse con el texto íntegro dentro de cinco días desde la total tramitación (art. 45). La notificación electrónica se entiende practicada al tercer día hábil desde el envío (art. 46) y el plazo de recursos corre desde el día siguiente, en días hábiles (art. 25). Si no hay constancia fiable, conviene reclamar primero el defecto de notificación: una gestión sobre el fondo sin ese reclamo configura notificación tácita (art. 47).",
      repregunta: "¿Qué pasa si el vecino presentó la reposición alegando el fondo y nada más?",
      prioridad: "A", fuente: "proceadmin",
    },
  ],

  columnas: [
    {
      id: "m05-c-01", modulo: 5, titulo: "¿Silencio positivo o negativo?",
      izq: "Silencio positivo (art. 64)", der: "Silencio negativo (art. 65)",
      items: [
        { texto: "Solicitud de permiso para un kiosco en la plaza", lado: 0, porque: "Solicitud común que no cae en los casos del art. 65." },
        { texto: "Solicitud que afecta el patrimonio fiscal", lado: 1, porque: "Primer caso del art. 65." },
        { texto: "Procedimiento iniciado de oficio por la Administración", lado: 1, porque: "Art. 65: cuando la Administración actúe de oficio." },
        { texto: "Reposición no resuelta en plazo", lado: 1, porque: "Impugnación de un acto administrativo (art. 65)." },
        { texto: "Petición fundada en el derecho de petición del art. 19 N.º 14 CPR", lado: 1, porque: "Art. 65 lo nombra expresamente." },
        { texto: "Exige denuncia del interesado y cinco días más", lado: 0, porque: "Es la ruta del art. 64." },
        { texto: "La solicitud se entiende aceptada", lado: 0, porque: "Efecto del art. 64." },
        { texto: "La solicitud se entiende rechazada", lado: 1, porque: "Efecto del art. 65." },
        { texto: "Desde el certificado corren los plazos para recurrir", lado: 1, porque: "Lo dice el art. 65 inc. 2; el certificado abre la vía impugnatoria." },
        { texto: "Solicitud de invalidación de un acto no resuelta en plazo", lado: 1, porque: "Es una revisión de un acto administrativo (art. 65)." },
      ],
      norma: "Arts. 64 y 65 Ley 19.880", fuente: "nuevo",
    },
  ],

  cadenas: [
    {
      id: "m05-k-01", modulo: 5, titulo: "La ruta del silencio positivo",
      pasos: ["Se presenta la solicitud y empieza el procedimiento", "Vence el plazo legal para resolver sin pronunciamiento", "El interesado denuncia el incumplimiento ante la autoridad que debía resolver", "La autoridad da recibo con fecha y eleva copia al superior en 24 horas", "Pasan cinco días desde la denuncia sin pronunciamiento", "La solicitud se entiende aceptada", "El interesado pide el certificado, que se expide sin más trámite", "El acto produce efectos desde la certificación"],
      nota: "Nada de seis meses: el art. 27 limita la duración del procedimiento, pero el silencio positivo nace de la denuncia y de los cinco días.",
      norma: "Arts. 64 y 66 Ley 19.880", fuente: "proceadmin",
    },
    {
      id: "m05-k-02", modulo: 5, titulo: "De la firma al plazo para recurrir",
      pasos: ["El acto queda totalmente tramitado", "Se notifica con su texto íntegro dentro de cinco días", "La notificación electrónica se entiende practicada al tercer día hábil desde el envío", "El acto produce efectos frente al interesado", "El plazo de recursos empieza a correr al día siguiente", "Corren cinco días hábiles para reposición o jerárquico", "Si el último día es inhábil, vence el primer día hábil siguiente"],
      norma: "Arts. 25, 45, 46, 51 y 59 Ley 19.880", fuente: "nuevo",
    },
  ],

  expedientes: [
    {
      id: "m05-e-01", modulo: 5,
      titulo: "La notificación fantasma",
      relato: "Don Aurelio Pinto llega furioso: la Dirección de Obras le rechazó un permiso y «lo notificó por correo», pero él nunca recibió nada. En el expediente no hay constancia de envío.",
      documento: { tipo: "Resolución de la Dirección de Obras", campos: [ { k: "Órgano", v: "Dirección de Obras Municipales" }, { k: "Dispone", v: "Rechaza solicitud de permiso de edificación" }, { k: "Firma", v: "Director de Obras" }, { k: "Fecha", v: "Totalmente tramitada hace 20 días" }, { k: "Notificado el", v: "«Por correo electrónico» (sin constancia de envío ni de acceso)" } ] },
      pregunta: "¿Qué sello le pones a esta resolución?",
      sellos: [
        { texto: "VÁLIDA Y EFICAZ: el plazo ya venció", correcto: false, porque: "Sin constancia de notificación no hay fecha cierta desde la cual contar nada (arts. 45 y 46 Ley 19.880)." },
        { texto: "VÁLIDA, PERO SIN EFICACIA: notificar con texto íntegro", correcto: true, porque: "El acto existe y se presume legal, pero produce efectos desde su notificación (art. 51 inc. 2); hay que notificarlo con su texto íntegro (art. 45) y el plazo correrá desde entonces (art. 25)." },
        { texto: "NULA: no fue notificada", correcto: false, porque: "La falta de notificación afecta la eficacia frente al interesado, no la validez del acto (arts. 45 y 51 Ley 19.880)." },
        { texto: "ARCHIVAR: el vecino no reclamó a tiempo", correcto: false, porque: "No puede haber reclamo extemporáneo si el plazo nunca empezó a correr (art. 25 Ley 19.880)." },
      ],
      norma: "Arts. 45, 46 y 51 Ley 19.880", fuente: "proceadmin", hallazgo: "m05-notificar-cinco-dias",
    },
    {
      id: "m05-e-02", modulo: 5,
      titulo: "La reposición «atrasada»",
      relato: "La Jefa de Partes, Rosa Tapia, quiere rechazar de plano una reposición: «la notificaron el miércoles 1 y la presentó el miércoles 8, ¡siete días!». Contó el sábado y el domingo.",
      documento: { tipo: "Recurso de reposición", campos: [ { k: "Contra", v: "Decreto alcaldicio que deniega patente" }, { k: "Notificado el", v: "Miércoles 1 (electrónica, ya practicada)" }, { k: "Presentado el", v: "Miércoles 8, 11:40 h" }, { k: "Ante", v: "Alcaldesa Ruperta Cañas (mismo órgano)" }, { k: "Pide", v: "Dejar sin efecto el decreto" } ] },
      pregunta: "¿Está dentro del plazo?",
      sellos: [
        { texto: "EXTEMPORÁNEA: pasaron siete días", correcto: false, porque: "Los sábados, domingos y festivos son inhábiles y no se cuentan (art. 25 Ley 19.880)." },
        { texto: "ADMITIR: es el quinto día hábil", correcto: true, porque: "Desde el día siguiente a la notificación: jueves 2, viernes 3, lunes 6, martes 7 y miércoles 8. Presentada el quinto día hábil, dentro del plazo del art. 59 (art. 25 Ley 19.880)." },
        { texto: "ADMITIR: el plazo de reposición es de 30 días", correcto: false, porque: "Treinta días es el plazo de la autoridad para resolver; el interesado tiene cinco (art. 59 Ley 19.880)." },
      ],
      norma: "Arts. 25 y 59 Ley 19.880", fuente: "nuevo", hallazgo: "m05-dias-habiles",
    },
    {
      id: "m05-e-03", modulo: 5,
      titulo: "El silencio que no gritó",
      relato: "La señora Marta Quilodrán pidió hace ocho meses un permiso para su kiosco y nadie le respondió. Trae redactado un «certificado de silencio positivo» para que lo firmes. Nunca denunció el incumplimiento.",
      documento: { tipo: "Solicitud de certificado", campos: [ { k: "Solicitud original", v: "Permiso para kiosco en la plaza, hace ocho meses" }, { k: "Estado", v: "Sin resolver" }, { k: "Denuncia del incumplimiento", v: "Ninguna" }, { k: "Pide", v: "Certificar que la solicitud se entiende aceptada" } ] },
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "CERTIFICAR: pasaron más de seis meses", correcto: false, porque: "El art. 27 limita la duración del procedimiento; no produce silencio positivo por sí solo (art. 64 Ley 19.880)." },
        { texto: "SILENCIO NEGATIVO: entender rechazada", correcto: false, porque: "Un permiso de kiosco no está en los casos tasados del art. 65 Ley 19.880." },
        { texto: "FALTA LA DENUNCIA: aún no opera el silencio", correcto: true, porque: "Primero debe denunciar el incumplimiento ante la autoridad que debía resolver; sólo si ésta no se pronuncia en cinco días la solicitud se entiende aceptada y procede certificar (art. 64 Ley 19.880)." },
        { texto: "ARCHIVAR POR ABANDONO", correcto: false, porque: "La que no actuó fue la Administración, no la interesada; el deber de resolver es de la Municipalidad (arts. 8 y 14 Ley 19.880)." },
      ],
      norma: "Art. 64 Ley 19.880", fuente: "proceadmin", hallazgo: "m05-silencio-positivo",
    },
    {
      id: "m05-e-04", modulo: 5,
      titulo: "La reposición sin respuesta",
      relato: "Un vecino presentó reposición contra un decreto hace 40 días hábiles. La Alcaldesa no ha resuelto. Él pide un certificado para «ir a tribunales de una vez».",
      documento: { tipo: "Solicitud de certificado", campos: [ { k: "Recurso", v: "Reposición contra decreto alcaldicio" }, { k: "Presentado hace", v: "40 días hábiles" }, { k: "Plazo para resolver", v: "30 días (art. 59)" }, { k: "Estado", v: "Sin resolución" }, { k: "Pide", v: "Certificado de que no fue resuelto en plazo" } ] },
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "SILENCIO POSITIVO: la reposición se entiende acogida", correcto: false, porque: "Las impugnaciones de actos administrativos tienen silencio negativo (art. 65 Ley 19.880)." },
        { texto: "CERTIFICAR: silencio negativo; los plazos de recursos corren desde el certificado", correcto: true, porque: "Cuando la Administración debe pronunciarse sobre impugnaciones, la solicitud se entiende rechazada; el certificado se otorga sin más trámite y desde su fecha corren los plazos para recurrir (art. 65 Ley 19.880)." },
        { texto: "DENEGAR: la Alcaldesa puede resolver cuando quiera", correcto: false, porque: "La autoridad tiene un plazo no superior a 30 días para resolver (art. 59) y el interesado tiene derecho al certificado (art. 65 Ley 19.880)." },
      ],
      norma: "Arts. 59 y 65 Ley 19.880", fuente: "nuevo", hallazgo: "m05-silencio-negativo",
    },
    {
      id: "m05-e-05", modulo: 5,
      titulo: "Carta certificada en regla",
      relato: "El Secretario Municipal te muestra un decreto notificado por carta certificada: el vecino había pedido por formulario esa forma porque no usa correo electrónico. Hay constancia de la recepción en correos.",
      documento: { tipo: "Decreto alcaldicio y constancia de notificación", campos: [ { k: "Órgano", v: "Alcaldesa Ruperta Cañas" }, { k: "Dispone", v: "Deniega permiso de ocupación de bien nacional de uso público" }, { k: "Forma pedida", v: "Carta certificada, por formulario del interesado" }, { k: "Recepción en correos", v: "Lunes 7" }, { k: "Se entiende notificado", v: "Jueves 10 (tercer día)" }, { k: "Contenido", v: "Texto íntegro del decreto" } ] },
      pregunta: "¿Cómo se timbra esta notificación?",
      sellos: [
        { texto: "VÁLIDA: notificación bien practicada", correcto: true, porque: "Quien carece de medios electrónicos puede pedir otra forma; la carta certificada se entiende practicada al tercer día desde la recepción en la oficina de correos y lleva el texto íntegro (arts. 45 y 46 Ley 19.880)." },
        { texto: "INVÁLIDA: la regla es la notificación electrónica", correcto: false, porque: "La regla admite excepción a solicitud de quien carece de medios tecnológicos (art. 46 Ley 19.880)." },
        { texto: "INVÁLIDA: se entiende notificado el lunes 7", correcto: false, porque: "La carta certificada se entiende practicada a contar del tercer día siguiente a su recepción en correos (art. 46 Ley 19.880)." },
        { texto: "REPETIR: faltó publicar en el Diario Oficial", correcto: false, porque: "La publicación en el Diario Oficial es para interesados de paradero ignorado (art. 45 Ley 19.880)." },
      ],
      norma: "Arts. 45 y 46 Ley 19.880", fuente: "nuevo", hallazgo: "m05-notificacion-electronica",
    },
    {
      id: "m05-e-06", modulo: 5,
      titulo: "Más tiempo, pero tarde",
      relato: "El Director de Tránsito pide ampliar en diez días el plazo de diez que tenía para informar. El plazo venció el viernes pasado. «Es por una buena causa», dice.",
      documento: { tipo: "Solicitud de ampliación de plazo", campos: [ { k: "Órgano", v: "Dirección de Tránsito" }, { k: "Plazo original", v: "10 días para informe" }, { k: "Venció el", v: "Viernes pasado" }, { k: "Pide", v: "Ampliación de 10 días" }, { k: "Presentada el", v: "Lunes siguiente" } ] },
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "CONCEDER: hay buenas razones", correcto: false, porque: "En ningún caso puede ampliarse un plazo ya vencido (art. 26 Ley 19.880)." },
        { texto: "CONCEDER SÓLO CINCO DÍAS", correcto: false, porque: "La mitad sería el tope si el plazo estuviera vigente; vencido, no hay ampliación posible (art. 26 Ley 19.880)." },
        { texto: "NO PROCEDE: el plazo ya venció", correcto: true, porque: "La petición y la decisión deben producirse antes del vencimiento; un plazo vencido no se amplía (art. 26 Ley 19.880). El informe atrasado se puede acompañar igual, pero ya sin plazo a su favor." },
      ],
      norma: "Art. 26 Ley 19.880", fuente: "nuevo", hallazgo: "m05-seis-meses",
    },
  ],
};

// PENDIENTE DE REVISIÓN: la notificación electrónica al «domicilio digital único»
// (art. 46 Ley 19.880, versión BCN 2026-02-05) depende de un reglamento conjunto;
// el juego afirma el régimen de la ley sin entrar en su vigencia práctica.
// PENDIENTE DE REVISIÓN: en m05-e-06 se dice que el informe atrasado «se puede
// acompañar igual»; es una consecuencia razonable (el art. 38 permite prescindir
// del informe), no un texto legal expreso.
