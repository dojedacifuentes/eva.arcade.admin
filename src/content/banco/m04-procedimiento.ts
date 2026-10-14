// Módulo 4 · La fila (Servicio de Atención). Ley 19.880: concepto y supletoriedad, principios
// (arts. 4 a 16), derechos e interesados (arts. 17, 20 a 22), etapas: iniciación (28 a 31),
// instrucción (34 a 39) y finalización (40 a 44). Los plazos y las notificaciones quedan para la
// jornada 5; los recursos, para la 7.
// Verificado contra el XML de la BCN (l19880.xml) el 12-10-2026.
import type { BancoModulo } from "../tipos";

export const BANCO_M04: BancoModulo = {
  modulo: 4,

  hallazgos: [
    {
      id: "m04-que-es",
      modulo: 4,
      titulo: "Una fila con tres tramos",
      texto: "El procedimiento administrativo es una sucesión de actos trámite vinculados entre sí, emanados de la Administración y, en su caso, de los interesados, que tiene por finalidad producir un acto administrativo terminal. Consta de iniciación, instrucción y finalización, y todo él debe constar en un expediente electrónico. La Ley 19.880 fija las bases y se aplica con carácter supletorio cuando hay procedimientos especiales.",
      norma: "Arts. 1 y 18 Ley 19.880",
      simple: "Primero se abre la fila, después se junta lo que falta y al final alguien decide: eso es un procedimiento.",
    },
    {
      id: "m04-impulso",
      modulo: 4,
      titulo: "La fila la empuja la Municipalidad",
      texto: "El procedimiento se impulsa de oficio en todos sus trámites: autoridades y funcionarios deben actuar por propia iniciativa, hacer expeditos los trámites y remover todo obstáculo, guardando el orden riguroso de ingreso en asuntos de similar naturaleza. Está destinado a que la Administración dicte un acto decisorio sobre el fondo, y ésta está obligada a dictar resolución expresa en todos los procedimientos y a notificarla; si no es competente, envía de inmediato los antecedentes a quien lo sea e informa al interesado.",
      norma: "Arts. 7, 8 y 14 Ley 19.880",
      simple: "«Vuelva mañana» no es un trámite: es una infracción a tres principios a la vez.",
    },
    {
      id: "m04-contradictoriedad",
      modulo: 4,
      titulo: "Puedes hablar en cualquier momento",
      texto: "Los interesados pueden, en cualquier momento del procedimiento, aducir alegaciones y aportar documentos u otros elementos de juicio; alegar defectos de tramitación; y actuar asistidos de asesor. Son interesados quienes promueven el procedimiento, quienes tienen derechos que pueden resultar afectados aunque no lo iniciaran, y quienes tienen intereses afectados y se apersonan antes de la resolución definitiva.",
      norma: "Arts. 10, 17 y 21 Ley 19.880",
      simple: "En esta fila el que espera también tiene micrófono, y no necesita turno para usarlo.",
    },
    {
      id: "m04-abstencion",
      modulo: 4,
      titulo: "Si es tu primo, no lo firmas tú",
      texto: "Las autoridades y funcionarios deben abstenerse de intervenir, y comunicarlo a su superior, cuando tengan interés personal en el asunto; parentesco hasta el cuarto grado de consanguinidad o segundo de afinidad con los interesados; amistad íntima o enemistad manifiesta; hayan sido peritos o testigos en el procedimiento; o tengan relación de servicio con el interesado o le hayan prestado servicios en los dos últimos años. Actuar igual no invalida necesariamente el acto, pero genera responsabilidad; los interesados pueden promover la inhabilitación en cualquier momento.",
      norma: "Art. 12 Ley 19.880",
      simple: "La imparcialidad no se declara: se prueba saliendo de la sala.",
    },
    {
      id: "m04-no-formalizacion",
      modulo: 4,
      titulo: "Sin notario y sin formalismos inútiles",
      texto: "El procedimiento debe desarrollarse con sencillez y eficacia: sólo se exigen las formalidades indispensables para dejar constancia de lo actuado y evitar perjuicios. Nadie en la Administración puede exigir autorización notarial de firmas salvo mandato legal o reglamentario expreso. El vicio de procedimiento o de forma sólo afecta la validez cuando recae en un requisito esencial y genera perjuicio al interesado.",
      norma: "Art. 13 Ley 19.880",
      simple: "El timbre del notario no hace más verdadera tu solicitud; sólo más cara.",
    },
    {
      id: "m04-inicio",
      modulo: 4,
      titulo: "Cómo se abre la fila",
      texto: "El procedimiento se inicia de oficio —por propia iniciativa, orden superior, petición de otro órgano o denuncia, con posible período de información previa— o a solicitud de parte. La solicitud debe contener nombre del interesado, hechos, razones y peticiones, lugar y fecha, firma u otra acreditación de la voluntad y el órgano al que se dirige. Si le faltan requisitos, se requiere al interesado para que subsane en cinco días, con la advertencia de que, si no lo hace, se le tendrá por desistido.",
      norma: "Arts. 28 a 31 Ley 19.880",
      simple: "Una solicitud incompleta no se rechaza: se devuelve con cinco días y una advertencia escrita.",
    },
    {
      id: "m04-instruccion-fin",
      modulo: 4,
      titulo: "Juntar antecedentes y decidir",
      texto: "Los actos de instrucción determinan, conocen y comprueban los datos sobre los que debe pronunciarse el acto; se realizan de oficio, sin perjuicio del derecho de los interesados a proponer actuaciones. Si los hechos no constan, se abre un período de prueba de entre diez y treinta días, y sólo se rechazan las pruebas manifiestamente improcedentes o innecesarias, por resolución motivada; los informes son facultativos y no vinculantes salvo norma expresa. El procedimiento termina por resolución final —fundada, que decide lo planteado sin agravar la situación del solicitante e indica los recursos—, por desistimiento, renuncia, abandono o imposibilidad material sobreviniente.",
      norma: "Arts. 34, 35, 38, 40 a 43 Ley 19.880",
      simple: "Decidir sin instruir es adivinar con membrete.",
    },
  ],

  afirmaciones: [
    { id: "m04-af-01", modulo: 4, hallazgo: "m04-que-es", texto: "El procedimiento administrativo consta de tres etapas: iniciación, instrucción y finalización.", verdad: true, porque: "Art. 18 inc. 2 Ley 19.880." },
    { id: "m04-af-02", modulo: 4, hallazgo: "m04-que-es", texto: "Cuando una ley establece un procedimiento especial, la Ley 19.880 deja de aplicarse por completo.", verdad: false, porque: "Art. 1 inc. 3: en ese caso la ley «se aplicará con carácter supletorio»." },
    { id: "m04-af-03", modulo: 4, hallazgo: "m04-impulso", texto: "La Administración está obligada a dictar resolución expresa en todos los procedimientos y a notificarla, cualquiera sea su forma de iniciación.", verdad: true, porque: "Art. 14 inc. 1 Ley 19.880 (principio de inexcusabilidad)." },
    { id: "m04-af-04", modulo: 4, hallazgo: "m04-impulso", texto: "Si el vecino no empuja su trámite, la Municipalidad puede dejarlo quieto: el impulso es cosa del interesado.", verdad: false, porque: "Art. 7: el procedimiento «se impulsará de oficio en todos sus trámites»." },
    { id: "m04-af-05", modulo: 4, hallazgo: "m04-contradictoriedad", texto: "Los interesados pueden aportar documentos y alegaciones en cualquier momento del procedimiento.", verdad: true, porque: "Art. 10 inc. 1 Ley 19.880." },
    { id: "m04-af-06", modulo: 4, hallazgo: "m04-contradictoriedad", texto: "Sólo es interesado quien presentó la solicitud; los terceros afectados no pueden intervenir.", verdad: false, porque: "Art. 21 N.º 2 y 3: también los que tengan derechos que puedan resultar afectados y los que, con intereses afectados, se apersonen antes de la resolución definitiva." },
    { id: "m04-af-07", modulo: 4, hallazgo: "m04-abstencion", texto: "El parentesco por consanguinidad hasta el cuarto grado con un interesado obliga al funcionario a abstenerse.", verdad: true, porque: "Art. 12 N.º 2 Ley 19.880." },
    { id: "m04-af-08", modulo: 4, hallazgo: "m04-abstencion", texto: "Si intervino un funcionario que debía abstenerse, el acto es nulo de pleno derecho en todo caso.", verdad: false, porque: "Art. 12 inc. 3: su actuación «no implicará, necesariamente, la invalidez de los actos»; sí da lugar a responsabilidad." },
    { id: "m04-af-09", modulo: 4, hallazgo: "m04-no-formalizacion", texto: "Un funcionario municipal no puede exigir que la firma de una solicitud venga autorizada ante notario, salvo que una ley o reglamento lo exija expresamente.", verdad: true, porque: "Art. 13 inc. 2 Ley 19.880." },
    { id: "m04-af-10", modulo: 4, hallazgo: "m04-no-formalizacion", texto: "El principio de no formalización significa que el procedimiento no tiene ninguna formalidad.", verdad: false, porque: "Art. 13 inc. 1: se exigen las formalidades «indispensables para dejar constancia indubitada de lo actuado y evitar perjuicios a los particulares»." },
    { id: "m04-af-11", modulo: 4, hallazgo: "m04-inicio", texto: "Si la solicitud no reúne los requisitos, se requiere al interesado para que la subsane en cinco días, bajo apercibimiento de tenerlo por desistido.", verdad: true, porque: "Art. 31 inc. 1 Ley 19.880." },
    { id: "m04-af-12", modulo: 4, hallazgo: "m04-inicio", texto: "La Administración tiene cinco días para requerir la subsanación; si no lo hace, la solicitud se entiende bien presentada.", verdad: false, porque: "La ley no fija ese plazo ni ese efecto: el art. 31 da cinco días al interesado para subsanar. (Error del apunte procedimiento-admin, que además citaba el art. 26, que regula la ampliación de plazos.)" },
    { id: "m04-af-13", modulo: 4, hallazgo: "m04-instruccion-fin", texto: "El período de prueba dura entre diez y treinta días.", verdad: true, porque: "Art. 35 inc. 2 Ley 19.880: «por un plazo no superior a treinta días ni inferior a diez»." },
    { id: "m04-af-14", modulo: 4, hallazgo: "m04-instruccion-fin", texto: "Los informes que pide la Administración son siempre vinculantes para quien resuelve.", verdad: false, porque: "Art. 38: salvo disposición expresa en contrario, «los informes serán facultativos y no vinculantes»." },
  ],

  fichas: [
    { id: "m04-f-01", modulo: 4, frente: "Definición de procedimiento administrativo", dorso: "«Sucesión de actos trámite vinculados entre sí, emanados de la Administración y, en su caso, de particulares interesados, que tiene por finalidad producir un acto administrativo terminal.» Etapas: iniciación, instrucción y finalización. Debe constar en un expediente electrónico, salvo excepciones legales.", norma: "Art. 18 Ley 19.880", etiqueta: "Concepto", prioridad: "S", fuente: "proceadmin" },
    { id: "m04-f-02", modulo: 4, frente: "Carácter básico y supletorio de la Ley 19.880", dorso: "Establece y regula las bases del procedimiento administrativo de los actos de la Administración del Estado; se aplica a ministerios, intendencias, gobernaciones, servicios públicos, Contraloría, Fuerzas Armadas y de Orden, gobiernos regionales y municipalidades. Si la ley establece procedimientos especiales, se aplica con carácter supletorio. Las autorizaciones sectoriales a solicitud de parte se rigen primero por la Ley Marco de Autorizaciones Sectoriales.", norma: "Arts. 1 y 2 Ley 19.880", etiqueta: "Concepto", prioridad: "S", fuente: "proceadmin" },
    { id: "m04-f-03", modulo: 4, frente: "Los principios del art. 4", dorso: "Escrituración, gratuidad, celeridad, conclusivo, economía procedimental, contradictoriedad, imparcialidad, abstención, no formalización, inexcusabilidad, impugnabilidad, transparencia y publicidad, y los relativos a los medios electrónicos. Los «doce» de la tradición son esos, contando transparencia y publicidad como uno.", norma: "Art. 4 Ley 19.880", etiqueta: "Principios", prioridad: "S", fuente: "procedimiento-admin" },
    { id: "m04-f-04", modulo: 4, frente: "Escrituración (art. 5) y gratuidad (art. 6)", dorso: "Escrituración: el procedimiento y sus actos se expresan por escrito a través de medios electrónicos, salvo excepción legal. Gratuidad: las actuaciones de la Administración y la obtención de documentos e información necesarios son gratuitas para los interesados, salvo disposición legal en contrario; tampoco hay cobros entre órganos.", norma: "Arts. 5 y 6 Ley 19.880", etiqueta: "Principios", prioridad: "A", fuente: "procedimiento-admin" },
    { id: "m04-f-05", modulo: 4, frente: "Celeridad (art. 7)", dorso: "El procedimiento se impulsa de oficio en todos sus trámites. Autoridades y funcionarios actúan por propia iniciativa en la iniciación y prosecución, haciendo expeditos los trámites y removiendo todo obstáculo. En asuntos de similar naturaleza se guarda el orden riguroso de ingreso, salvo orden motivada del titular de la unidad, de la que queda constancia.", norma: "Art. 7 Ley 19.880", etiqueta: "Principios", prioridad: "A", fuente: "procedimiento-admin" },
    { id: "m04-f-06", modulo: 4, frente: "Conclusivo (art. 8) e inexcusabilidad (art. 14)", dorso: "Conclusivo: todo el procedimiento está destinado a que la Administración dicte un acto decisorio que se pronuncie sobre la cuestión de fondo. Inexcusabilidad: obligación de dictar resolución expresa en todos los procedimientos y notificarla; el órgano incompetente envía de inmediato los antecedentes al competente e informa al interesado; en prescripción, renuncia, abandono, desistimiento o desaparición del objeto, la resolución declara esa circunstancia. La Administración no puede abstenerse de resolver so pretexto de silencio, oscuridad o insuficiencia de la ley (art. 41 inc. 5).", norma: "Arts. 8, 14 y 41 Ley 19.880", etiqueta: "Principios", prioridad: "S", fuente: "procedimiento-admin" },
    { id: "m04-f-07", modulo: 4, frente: "Economía procedimental (art. 9)", dorso: "Máxima economía de medios con eficacia, evitando trámites dilatorios. Se deciden en un solo acto todos los trámites que admitan impulso simultáneo. Las comunicaciones entre órganos van por medios electrónicos con copia a los interesados. Las cuestiones incidentales, incluso de nulidad de actuaciones, no suspenden la tramitación salvo resolución fundada.", norma: "Art. 9 Ley 19.880", etiqueta: "Principios", prioridad: "B", fuente: "procedimiento-admin" },
    { id: "m04-f-08", modulo: 4, frente: "Contradictoriedad (art. 10)", dorso: "Los interesados pueden, en cualquier momento, aducir alegaciones y aportar documentos u otros elementos de juicio; alegar defectos de tramitación (paralización, infracción de plazos, omisión de trámites subsanables), lo que puede dar lugar a responsabilidad disciplinaria; actuar asistidos de asesor. El instructor adopta las medidas para el pleno respeto de la contradicción y la igualdad de los interesados.", norma: "Art. 10 Ley 19.880", etiqueta: "Principios", prioridad: "S", fuente: "procedimiento-admin" },
    { id: "m04-f-09", modulo: 4, frente: "Imparcialidad (art. 11)", dorso: "La Administración actúa con objetividad y respeta la probidad, en la substanciación y en las decisiones. Los hechos y fundamentos de derecho deben expresarse siempre en los actos que afecten derechos de los particulares (los limiten, restrinjan, priven, perturben o amenacen) y en los que resuelvan recursos. Es el estándar; la abstención (art. 12) es el mecanismo.", norma: "Art. 11 Ley 19.880", etiqueta: "Principios", prioridad: "S", fuente: "procedimiento-admin" },
    { id: "m04-f-10", modulo: 4, frente: "Abstención (art. 12): las cinco causales", dorso: "1. Interés personal en el asunto; ser administrador de sociedad interesada; litigio pendiente con un interesado. 2. Parentesco por consanguinidad hasta el cuarto grado o afinidad hasta el segundo con interesados, administradores, asesores o mandatarios; compartir despacho con éstos. 3. Amistad íntima o enemistad manifiesta. 4. Haber sido perito o testigo en el procedimiento. 5. Relación de servicio con el interesado o haberle prestado servicios profesionales en los dos últimos años. Se comunica al superior inmediato; la no abstención «no implicará, necesariamente, la invalidez» y da lugar a responsabilidad; los interesados pueden promover la inhabilitación por escrito ante el propio afectado.", norma: "Art. 12 Ley 19.880", etiqueta: "Principios", prioridad: "S", fuente: "procedimiento-admin" },
    { id: "m04-f-11", modulo: 4, frente: "No formalización (art. 13)", dorso: "Sencillez y eficacia: sólo las formalidades indispensables para dejar constancia indubitada de lo actuado y evitar perjuicios. Prohibido exigir autorizaciones notariales de firmas salvo mandato legal o reglamentario. El vicio de procedimiento o de forma sólo afecta la validez si recae en un requisito esencial y genera perjuicio. La Administración puede subsanar sus vicios sin afectar a terceros.", norma: "Art. 13 Ley 19.880", etiqueta: "Principios", prioridad: "S", fuente: "procedimiento-admin" },
    { id: "m04-f-12", modulo: 4, frente: "Impugnabilidad (art. 15) y transparencia (art. 16)", dorso: "Todo acto es impugnable por reposición y jerárquico, sin perjuicio de la revisión extraordinaria y de los recursos de leyes especiales; los de mero trámite, sólo si impiden continuar o producen indefensión; quien acoge un recurso puede dictar el acto de reemplazo. Transparencia y publicidad: el procedimiento permite y promueve el conocimiento de los contenidos y fundamentos de las decisiones; son públicos los actos, sus fundamentos, documentos y procedimientos, salvo las excepciones de la Ley de Transparencia y otras de quórum calificado.", norma: "Arts. 15 y 16 Ley 19.880", etiqueta: "Principios", prioridad: "A", fuente: "procedimiento-admin" },
    { id: "m04-f-13", modulo: 4, frente: "Derechos de las personas ante la Administración (art. 17)", dorso: "Conocer en cualquier momento el estado del procedimiento y obtener copia de los documentos; identificar a las autoridades y personal responsables; acompañar documentos electrónicos; eximirse de presentar documentos que ya estén en poder de la Administración; acceder a los actos; ser tratados con respeto y deferencia; formular alegaciones y aportar documentos antes del trámite de audiencia, que deben ser tenidos en cuenta en la propuesta de resolución; exigir responsabilidades; obtener información sobre los requisitos jurídicos o técnicos de sus proyectos.", norma: "Art. 17 Ley 19.880", etiqueta: "Sujetos", prioridad: "A", fuente: "proceadmin" },
    { id: "m04-f-14", modulo: 4, frente: "Interesados, capacidad y apoderados", dorso: "Interesados: 1) quienes promueven el procedimiento como titulares de derechos o intereses; 2) los que, sin iniciarlo, tienen derechos que puedan resultar afectados; 3) aquellos con intereses afectados que se apersonan antes de la resolución definitiva (art. 21). Capacidad: la general, y los menores para los derechos que el ordenamiento les permite ejercer sin asistencia (art. 20). Apoderados: con todas las facultades salvo manifestación en contrario; poder por firma electrónica simple o avanzada, escritura pública o documento ante notario (art. 22).", norma: "Arts. 20, 21 y 22 Ley 19.880", etiqueta: "Sujetos", prioridad: "A", fuente: "procedimiento-admin" },
    { id: "m04-f-15", modulo: 4, frente: "Inicio de oficio (arts. 28 y 29)", dorso: "Por propia iniciativa, por orden superior, a petición de otros órganos o por denuncia. Antes del acuerdo de iniciación, el órgano competente puede abrir un período de información previa para conocer las circunstancias del caso y la conveniencia de iniciar el procedimiento. Las medidas provisionales adoptadas antes del inicio deben confirmarse, modificarse o levantarse al iniciar, dentro de quince días (art. 32).", norma: "Arts. 28, 29 y 32 Ley 19.880", etiqueta: "Iniciación", prioridad: "A", fuente: "sancionador" },
    { id: "m04-f-16", modulo: 4, frente: "La solicitud (art. 30)", dorso: "Debe contener: a) nombre y apellidos o razón social del interesado y de su apoderado; b) excepcionalmente, medio electrónico de notificación; c) hechos, razones y peticiones; d) lugar y fecha; e) firma o acreditación de la voluntad por cualquier medio habilitado; f) órgano al que se dirige; g) si autoriza remitir datos sensibles entre órganos. El interesado puede exigir recibo con fecha de presentación. La Administración debe disponer formularios para los procedimientos de común tramitación.", norma: "Art. 30 Ley 19.880", etiqueta: "Iniciación", prioridad: "A", fuente: "procedimiento-admin" },
    { id: "m04-f-17", modulo: 4, frente: "Subsanación (art. 31)", dorso: "Si la solicitud no reúne los requisitos, se requiere al interesado para que, en cinco días, subsane la falta o acompañe los documentos, con indicación de que, si no lo hace, se le tendrá por desistido. El órgano puede además pedir la modificación o mejora voluntaria de la solicitud, levantando acta sucinta. No existe un plazo para que la Administración requiera, ni un «archivo» automático: el efecto es el desistimiento.", norma: "Art. 31 Ley 19.880", etiqueta: "Iniciación", prioridad: "S", fuente: "proceadmin" },
    { id: "m04-f-18", modulo: 4, frente: "Instrucción (art. 34) y prueba (arts. 35 y 36)", dorso: "Actos de instrucción: los necesarios para determinar, conocer y comprobar los datos sobre los que debe pronunciarse el acto; de oficio, sin perjuicio del derecho de los interesados a proponer actuaciones. Prueba: cualquier medio admisible en derecho, apreciada en conciencia; si los hechos no constan o la naturaleza del procedimiento lo exige, período de prueba de entre diez y treinta días; el instructor sólo rechaza pruebas manifiestamente improcedentes o innecesarias, por resolución motivada; se comunica con antelación lugar, fecha y hora, y el interesado puede nombrar peritos.", norma: "Arts. 34, 35 y 36 Ley 19.880", etiqueta: "Instrucción", prioridad: "S", fuente: "procedimiento-admin" },
    { id: "m04-f-19", modulo: 4, frente: "Informes (arts. 37 y 38) e información pública (art. 39)", dorso: "Se piden los informes que exigen las normas y los necesarios para resolver, citando el precepto o fundando la conveniencia. Salvo disposición expresa, son facultativos y no vinculantes; si otro órgano no lo evacúa en plazo, pueden proseguir las actuaciones. Los informes y dictámenes deben evacuarse en diez días (art. 24). Información pública: cuando la naturaleza del procedimiento lo requiera, se anuncia en el Diario Oficial o un diario nacional para que cualquier persona lo examine y formule observaciones en un plazo no inferior a diez días; participar no da la condición de interesado; la Administración responde razonadamente.", norma: "Arts. 24, 37, 38 y 39 Ley 19.880", etiqueta: "Instrucción", prioridad: "A", fuente: "procedimiento-admin" },
    { id: "m04-f-20", modulo: 4, frente: "Resolución final (arts. 40 y 41)", dorso: "Pone término al procedimiento, junto con el desistimiento, la declaración de abandono, la renuncia al derecho y la imposibilidad material sobreviniente; siempre fundada. Decide las cuestiones planteadas; las cuestiones conexas se comunican a los interesados, que tienen quince días para alegar y probar. En procedimientos a solicitud de parte, se ajusta a lo pedido y no puede agravar la situación inicial. Contiene la decisión fundada, los recursos, el órgano y el plazo. No cabe abstenerse de resolver por silencio u oscuridad de la ley. Los informes aceptados sirven de motivación si se incorporan al texto.", norma: "Arts. 40 y 41 Ley 19.880", etiqueta: "Finalización", prioridad: "S", fuente: "proceadmin" },
    { id: "m04-f-21", modulo: 4, frente: "Desistimiento, renuncia y abandono (arts. 42 a 44)", dorso: "Desistimiento de la solicitud y renuncia al derecho (cuando no esté prohibida): por cualquier medio que deje constancia; sólo afectan a quien los formula. Abandono: si por inactividad del interesado el procedimiento iniciado por él se paraliza más de treinta días, la Administración le advierte que, si no actúa en siete días, lo declarará abandonado; luego lo declara y archiva, notificándolo. No produce prescripción por sí solo. La Administración puede no declararlo cuando el asunto afecte el interés general.", norma: "Arts. 42, 43 y 44 Ley 19.880", etiqueta: "Finalización", prioridad: "A", fuente: "procedimiento-admin" },
    { id: "m04-f-22", modulo: 4, frente: "Clasificación de los procedimientos", dorso: "Por la iniciativa: de oficio (art. 29) o a solicitud de parte (art. 30); el silencio positivo sólo opera en los segundos (art. 64). Por el objeto: autorizatorios, sancionatorios, de selección (concursos, licitaciones); el sancionatorio exige mayores garantías (art. 19 N.º 3 CPR). Por la regulación: general (Ley 19.880 en plenitud) o especial (ley sectorial, con la 19.880 supletoria). Por la urgencia: la tramitación de urgencia reduce los plazos a la mitad, salvo los de solicitudes y recursos (art. 63).", norma: "Arts. 1, 28, 63 y 64 Ley 19.880", etiqueta: "Concepto", prioridad: "B", fuente: "procedimiento-admin" },
  ],

  quiz: [
    { id: "m04-q-01", modulo: 4, texto: "¿Qué establece el principio conclusivo (art. 8)?", opciones: ["Que el procedimiento debe durar menos de seis meses", "Que todo el procedimiento está destinado a que la Administración dicte un acto decisorio que se pronuncie sobre la cuestión de fondo", "Que el interesado puede cerrar el procedimiento cuando quiera", "Que la Administración puede archivar sin resolver si no hay interés público"], correcta: 1, porque: "Art. 8 Ley 19.880. Su complemento es la inexcusabilidad (art. 14): resolución expresa y notificada en todos los procedimientos.", norma: "Art. 8 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m04-q-02", modulo: 4, texto: "¿Qué regla fija el art. 13 sobre los vicios de forma?", opciones: ["Todo vicio de forma anula el acto", "El vicio de procedimiento o de forma sólo afecta la validez cuando recae en un requisito esencial y genera perjuicio al interesado", "Los vicios de forma siempre se subsanan si el interesado los alega", "La Administración puede invalidar cualquier acto por vicio de forma"], correcta: 1, porque: "Art. 13 inc. 3 Ley 19.880.", norma: "Art. 13 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m04-q-03", modulo: 4, texto: "¿Cuánto tiempo tiene el interesado para subsanar una solicitud defectuosa y qué pasa si no lo hace?", opciones: ["Tres días; se archiva", "Cinco días; se le tiene por desistido", "Diez días; se rechaza de plano", "Treinta días; se declara el abandono"], correcta: 1, porque: "Art. 31 inc. 1 Ley 19.880: cinco días «con indicación de que, si así no lo hiciere, se le tendrá por desistido de su petición».", norma: "Art. 31 Ley 19.880", fuente: "proceadmin" },
    { id: "m04-q-04", modulo: 4, texto: "¿Qué establece el principio de contradictoriedad (art. 10)?", opciones: ["Que la Administración puede contradecir al interesado", "Que los interesados pueden, en cualquier momento, aducir alegaciones y aportar documentos u otros elementos de juicio", "Que sólo el abogado del interesado puede alegar", "Que los interesados pueden objetar los informes periciales"], correcta: 1, porque: "Art. 10 inc. 1. Además pueden alegar defectos de tramitación y actuar con asesor.", norma: "Art. 10 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m04-q-05", modulo: 4, texto: "¿Cuál es la duración del período de prueba?", opciones: ["Entre 5 y 15 días", "Entre 10 y 30 días", "Entre 15 y 45 días", "No hay plazo legal"], correcta: 1, porque: "Art. 35 inc. 2 Ley 19.880. Se abre cuando a la Administración no le constan los hechos o la naturaleza del procedimiento lo exige.", norma: "Art. 35 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m04-q-06", modulo: 4, texto: "Un órgano distinto del que tramita no evacúa su informe dentro de plazo. ¿Qué puede hacer la Administración?", opciones: ["Debe suspender el procedimiento hasta recibirlo", "Puede proseguir las actuaciones", "Debe archivar el expediente", "Debe pedir al interesado que lo consiga"], correcta: 1, porque: "Art. 38 inc. 2 Ley 19.880. Salvo disposición expresa, los informes son facultativos y no vinculantes.", norma: "Art. 38 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m04-q-07", modulo: 4, texto: "¿En qué consiste el principio de abstención (art. 12)?", opciones: ["La Administración puede abstenerse de resolver asuntos complejos", "Autoridades y funcionarios deben abstenerse de intervenir cuando concurre alguna de las causales legales (interés personal, parentesco, amistad o enemistad, haber sido perito o testigo, relación de servicio) y comunicarlo a su superior", "El interesado puede pedir la abstención por cualquier motivo", "La abstención es voluntaria"], correcta: 1, porque: "Art. 12 Ley 19.880. La no abstención da lugar a responsabilidad, aunque no implica necesariamente la invalidez del acto.", norma: "Art. 12 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m04-q-08", modulo: 4, texto: "¿Qué debe contener la solicitud que inicia un procedimiento a petición de parte?", opciones: ["Sólo el nombre y la petición", "Nombre del interesado y su apoderado, hechos, razones y peticiones, lugar y fecha, firma o acreditación de la voluntad, y órgano al que se dirige", "Sólo la firma autorizada ante notario", "No hay requisitos"], correcta: 1, porque: "Art. 30 Ley 19.880 (más el medio electrónico de notificación en los casos excepcionales del art. 46 y la autorización sobre datos sensibles).", norma: "Art. 30 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m04-q-09", modulo: 4, texto: "¿Cuál es la diferencia entre inexcusabilidad y principio conclusivo?", opciones: ["Son sinónimos", "El conclusivo mira al resultado: un acto decisorio sobre el fondo; la inexcusabilidad obliga a dictar resolución expresa, notificarla y, si el órgano es incompetente, derivar al competente", "El conclusivo se refiere al inicio y la inexcusabilidad al término", "Ninguna: ambos fundan el silencio"], correcta: 1, porque: "Arts. 8 y 14 Ley 19.880. Ojo: el art. 14 no habla de «iniciar» procedimientos, sino de resolver y derivar.", norma: "Arts. 8 y 14 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m04-q-10", modulo: 4, texto: "El vecino pidió un permiso para construir dos pisos; la resolución final le niega el permiso y además le ordena demoler el primer piso ya construido. ¿Qué dice el art. 41?", opciones: ["Es válido: la Administración resuelve lo que estime", "En los procedimientos a solicitud del interesado la resolución no puede agravar su situación inicial; la demolición requiere un procedimiento de oficio aparte", "Es válido si el Concejo lo aprueba", "Es nulo porque el permiso debía otorgarse"], correcta: 1, porque: "Art. 41 inc. 3 Ley 19.880: «sin que en ningún caso pueda agravar su situación inicial y sin perjuicio de la potestad de la Administración de incoar de oficio un nuevo procedimiento».", norma: "Art. 41 inc. 3 Ley 19.880", fuente: "proceadmin" },
    { id: "m04-q-11", modulo: 4, texto: "¿Cómo se declara el abandono del procedimiento?", opciones: ["Automáticamente a los 30 días de inactividad", "Si el interesado paraliza el procedimiento por más de 30 días, la Administración le advierte que si no actúa en 7 días lo declarará abandonado; luego lo declara, archiva y notifica", "Sólo a petición de un tercero", "A los seis meses, por silencio"], correcta: 1, porque: "Art. 43 Ley 19.880. El apunte omitía la advertencia y los siete días.", norma: "Art. 43 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m04-q-12", modulo: 4, texto: "¿Quiénes son interesados en el procedimiento?", opciones: ["Sólo quien presentó la solicitud", "Quienes lo promueven como titulares de derechos o intereses; los que, sin iniciarlo, tienen derechos que puedan resultar afectados; y los que, con intereses afectados, se apersonan antes de la resolución definitiva", "Cualquier vecino de la comuna", "Sólo las personas jurídicas"], correcta: 1, porque: "Art. 21 Ley 19.880.", norma: "Art. 21 Ley 19.880", fuente: "procedimiento-admin" },
    { id: "m04-q-13", modulo: 4, texto: "¿Qué plazo tienen los informes y dictámenes según los plazos internos del art. 24?", opciones: ["48 horas", "10 días desde la petición de la diligencia", "30 días", "No tienen plazo"], correcta: 1, porque: "Art. 24 inc. 3 Ley 19.880. Las providencias de mero trámite, 48 horas; las decisiones definitivas, 20 días desde que se certifica que el acto está en estado de resolverse.", norma: "Art. 24 Ley 19.880", fuente: "nuevo" },
  ],

  orales: [
    {
      id: "m04-o-01", modulo: 4,
      pregunta: "¿Cuál es la función del procedimiento administrativo y qué carácter tiene la Ley 19.880?",
      profesor: "Prof. Cordero",
      claves: ["Cauce formal para producir el acto terminal", "Sucesión de actos trámite vinculados", "Iniciación, instrucción, finalización", "Racionaliza la decisión y permite defensa", "Facilita el control de legalidad", "Bases: se aplica a toda la Administración", "Supletoria ante procedimientos especiales", "Garantía del justo y racional procedimiento"],
      trampas: ["Es pura formalidad interna", "Desplaza siempre a la ley especial", "No se aplica a las municipalidades", "Cada acto de trámite es impugnable por sí solo", "Lo impulsa el interesado"],
      modelo: "El procedimiento administrativo es la sucesión de actos trámite vinculados entre sí, emanados de la Administración y de los interesados, destinada a producir un acto administrativo terminal; consta de iniciación, instrucción y finalización (art. 18). Cumple tres funciones: racionaliza la decisión pública, permite la participación, defensa y contradicción de los interesados, y genera control sobre la legalidad, la motivación y la finalidad del acto. La Ley 19.880 establece las bases del procedimiento y se aplica a toda la Administración del Estado, incluidas las municipalidades; cuando existe un procedimiento especial, rige con carácter supletorio (arts. 1 y 2). Por eso sus garantías —contradictoriedad, prueba, motivación, impugnabilidad— alcanzan también a los procedimientos sectoriales en lo no regulado.",
      repregunta: "Nombre tres principios del art. 4 y diga qué artículo de la ley los desarrolla.",
      prioridad: "S", fuente: "sancionador",
    },
    {
      id: "m04-o-02", modulo: 4,
      pregunta: "Describa las etapas del procedimiento administrativo según la Ley 19.880, con sus plazos.",
      profesor: "Prof. Cordero",
      claves: ["Inicio de oficio: iniciativa, orden, petición, denuncia", "Información previa antes de iniciar", "Solicitud: contenido del art. 30", "Subsanación: cinco días o desistido", "Instrucción de oficio; interesados proponen", "Prueba entre diez y treinta días", "Informes facultativos y no vinculantes", "Resolución final fundada con recursos"],
      trampas: ["La Administración tiene cinco días para pedir la subsanación", "Audiencia previa con propuesta de resolución diez días antes", "Los informes urgentes son de tres días", "El abandono opera solo a los treinta días", "El silencio opera a los seis meses"],
      modelo: "La iniciación puede ser de oficio —por propia iniciativa, orden superior, petición de otro órgano o denuncia, con un posible período de información previa (art. 29)— o a solicitud de parte, mediante una solicitud con el contenido del art. 30; si faltan requisitos, se requiere al interesado para que subsane en cinco días bajo apercibimiento de tenerlo por desistido (art. 31). La instrucción comprende los actos para determinar y comprobar los datos del asunto, de oficio y con derecho de los interesados a proponer actuaciones (art. 34); un período de prueba de entre diez y treinta días cuando los hechos no consten, con rechazo motivado sólo de la prueba manifiestamente improcedente (art. 35); informes facultativos y no vinculantes salvo norma expresa (arts. 37 y 38) e información pública cuando corresponda (art. 39). La finalización normal es la resolución final fundada, que decide lo planteado, no agrava la situación del solicitante e indica los recursos (art. 41); también terminan el procedimiento el desistimiento, la renuncia, el abandono —tras treinta días de paralización y una advertencia de siete días— y la imposibilidad sobreviniente (arts. 40, 42 a 44).",
      repregunta: "¿Qué pasa si la Municipalidad resuelve agravando la situación de quien pidió el permiso?",
      prioridad: "S", fuente: "procedimiento-admin",
    },
  ],

  columnas: [
    {
      id: "m04-c-01", modulo: 4, titulo: "¿Deber de la Municipalidad o derecho del interesado?",
      izq: "Lo debe hacer la Administración", der: "Lo puede hacer el interesado",
      items: [
        { texto: "Impulsar el procedimiento de oficio en todos sus trámites", lado: 0, porque: "Art. 7." },
        { texto: "Aportar documentos y alegaciones en cualquier momento", lado: 1, porque: "Art. 10 inc. 1." },
        { texto: "Dictar resolución expresa y notificarla", lado: 0, porque: "Art. 14 inc. 1." },
        { texto: "Actuar asistido de un asesor", lado: 1, porque: "Art. 10 inc. 3." },
        { texto: "Enviar los antecedentes al órgano competente si no lo es, e informar al interesado", lado: 0, porque: "Art. 14 inc. 2." },
        { texto: "Proponer actuaciones de instrucción", lado: 1, porque: "Art. 34." },
        { texto: "Guardar el orden riguroso de ingreso en asuntos similares", lado: 0, porque: "Art. 7 inc. 3." },
        { texto: "Alegar defectos de tramitación, como paralización o infracción de plazos", lado: 1, porque: "Art. 10 inc. 2." },
        { texto: "Rechazar una prueba sólo por resolución motivada, si es manifiestamente improcedente", lado: 0, porque: "Art. 35 inc. 3." },
        { texto: "Conocer el estado del procedimiento y obtener copia de los documentos", lado: 1, porque: "Art. 17 letra a)." },
        { texto: "Advertir al interesado antes de declarar el abandono", lado: 0, porque: "Art. 43 inc. 1." },
        { texto: "Promover la inhabilitación del funcionario que debió abstenerse", lado: 1, porque: "Art. 12 inc. final." },
      ],
      norma: "Arts. 7, 10, 12, 14, 17, 34, 35 y 43 Ley 19.880", fuente: "nuevo",
    },
  ],

  cadenas: [
    {
      id: "m04-k-01", modulo: 4, titulo: "La fila: de la solicitud a la notificación",
      pasos: [
        "El interesado presenta la solicitud con los requisitos del art. 30 y pide recibo",
        "Si faltan requisitos, se le requiere subsanar en cinco días, bajo apercibimiento de desistimiento (art. 31)",
        "Instrucción: se reúnen y comprueban los datos, de oficio y con las actuaciones que proponga el interesado (art. 34)",
        "Si los hechos no constan, período de prueba de diez a treinta días (art. 35)",
        "Se piden los informes exigidos por la ley o necesarios para resolver (arts. 37 y 38)",
        "Resolución final fundada, que decide lo pedido e indica los recursos (art. 41)",
        "Notificación con el texto íntegro dentro de cinco días (art. 45)",
      ],
      norma: "Arts. 30, 31, 34, 35, 37, 38, 41 y 45 Ley 19.880", fuente: "proceadmin",
    },
    {
      id: "m04-k-02", modulo: 4, titulo: "Cuando el vecino deja botado su trámite",
      pasos: [
        "El procedimiento iniciado por el interesado se paraliza por su inactividad durante más de treinta días",
        "La Administración le advierte que, si no efectúa las diligencias de su cargo en siete días, declarará el abandono",
        "Pasan los siete días sin que el interesado actúe",
        "La Administración declara abandonado el procedimiento y ordena su archivo",
        "Se notifica la declaración al interesado",
        "El abandono no produce por sí solo la prescripción de las acciones del particular ni de la Administración",
      ],
      nota: "La Administración puede no declarar el abandono cuando la cuestión afecte el interés general (art. 44).",
      norma: "Arts. 43 y 44 Ley 19.880", fuente: "procedimiento-admin",
    },
  ],

  expedientes: [
    {
      id: "m04-e-01", modulo: 4,
      titulo: "La solicitud sin firma",
      relato: "La Oficina de Partes devolvió a un vecino su solicitud de patente con un timbre rojo: «RECHAZADA: sin firma ni fecha». El vecino llega contigo, con la solicitud y el timbre.",
      documento: { tipo: "Solicitud de patente comercial, ingreso N.º 2.210", campos: [
        { k: "Solicitante", v: "Rosa Lagos, «Minimarket La Fila»" },
        { k: "Hechos y petición", v: "Completos" },
        { k: "Órgano al que se dirige", v: "Municipalidad de Potestas, Rentas" },
        { k: "Lugar y fecha", v: "Falta la fecha" },
        { k: "Firma", v: "Falta" },
        { k: "Resolución de Partes", v: "«Rechazada de plano»" },
      ] },
      vicio: "Firma",
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "RECHAZO CORRECTO: sin firma no hay solicitud", correcto: false, porque: "La firma es un requisito (art. 30 e), pero su falta no autoriza el rechazo de plano." },
        { texto: "SUBSANAR: requerir al interesado por cinco días, bajo apercibimiento de desistimiento", correcto: true, porque: "Art. 31 inc. 1 Ley 19.880: si la solicitud no reúne los requisitos del art. 30, «se requerirá al interesado para que, en un plazo de cinco días, subsane la falta o acompañe los documentos respectivos», advirtiéndole que, si no, se le tendrá por desistido. Rechazar de plano infringe además la no formalización (art. 13) y la celeridad (art. 7)." },
        { texto: "ARCHIVAR Y QUE PRESENTE UNA NUEVA", correcto: false, porque: "El archivo no es el efecto legal; además obliga a un trámite nuevo donde la ley prevé una ventana corta de corrección." },
        { texto: "EXIGIR FIRMA AUTORIZADA ANTE NOTARIO", correcto: false, porque: "Art. 13 inc. 2: nadie en la Administración puede exigir autorizaciones notariales de firmas salvo mandato legal o reglamentario expreso." },
      ],
      norma: "Arts. 13, 30 y 31 Ley 19.880", fuente: "proceadmin", hallazgo: "m04-inicio",
    },
    {
      id: "m04-e-02", modulo: 4,
      titulo: "El informe del hermano",
      relato: "El jefe de Rentas informó favorablemente la patente de «Distribuidora Hermanos Soto». Uno de los hermanos Soto es su hermano. No lo comunicó a nadie.",
      documento: { tipo: "Informe de Rentas N.º 310", campos: [
        { k: "Órgano", v: "Departamento de Rentas, Municipalidad de Potestas" },
        { k: "Materia", v: "Informa solicitud de patente de Distribuidora Hermanos Soto Ltda." },
        { k: "Conclusión", v: "Favorable" },
        { k: "Firma", v: "Jefe de Rentas, Pedro Soto" },
        { k: "Vínculo", v: "Hermano del socio principal (consanguinidad, segundo grado)" },
        { k: "Comunicación al superior", v: "Ninguna" },
      ] },
      vicio: "Vínculo",
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "VÁLIDO: el informe es técnico y la patente cumple", correcto: false, porque: "El art. 12 no mira si el informe es bueno: mira quién lo hizo." },
        { texto: "DEBIÓ ABSTENERSE: parentesco por consanguinidad dentro del cuarto grado", correcto: true, porque: "Art. 12 N.º 2 Ley 19.880: es motivo de abstención el parentesco de consanguinidad dentro del cuarto grado con cualquiera de los interesados; debió abstenerse y comunicarlo a su superior inmediato. El informe debe rehacerlo otro funcionario; la no abstención genera responsabilidad (inc. 4) y también contraviene la probidad (art. 62 N.º 6 Ley 18.575)." },
        { texto: "NULO DE PLENO DERECHO TODO EL PROCEDIMIENTO", correcto: false, porque: "Art. 12 inc. 3: la actuación de quien debió abstenerse «no implicará, necesariamente, la invalidez de los actos». Se repite el informe y se evalúa el perjuicio." },
        { texto: "NO HAY CAUSAL: los hermanos no están en el art. 12", correcto: false, porque: "Los hermanos son parientes por consanguinidad en segundo grado: dentro del cuarto que exige el N.º 2." },
      ],
      norma: "Art. 12 N.º 2 e incs. 3 y 4 Ley 19.880", fuente: "procedimiento-admin", hallazgo: "m04-abstencion",
    },
    {
      id: "m04-e-03", modulo: 4,
      titulo: "Pidió dos pisos, le demuelen uno",
      relato: "Un vecino pidió permiso para ampliar su casa a dos pisos. La resolución final rechaza el permiso y, de paso, ordena demoler el primer piso «por no ajustarse al plan regulador». No hubo otro procedimiento.",
      documento: { tipo: "Resolución N.º 512, Dirección de Obras", campos: [
        { k: "Órgano", v: "Dirección de Obras Municipales de Potestas" },
        { k: "Procedimiento", v: "Iniciado a solicitud de parte (permiso de ampliación)" },
        { k: "Dispone", v: "1) Rechaza el permiso. 2) Ordena demoler el primer piso en 30 días" },
        { k: "Fundamento", v: "Informe técnico: el primer piso tampoco cumple el plan regulador" },
        { k: "Procedimiento de oficio por el primer piso", v: "No se inició" },
        { k: "Recursos", v: "Indicados" },
      ] },
      vicio: "Dispone",
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "VÁLIDO: si el primer piso es irregular, Obras debe ordenar demoler", correcto: false, porque: "Puede perseguirlo, pero no dentro del procedimiento que el vecino abrió para otra cosa." },
        { texto: "AGRAVA LA SITUACIÓN INICIAL: en un procedimiento a solicitud de parte, la resolución no puede hacerlo", correcto: true, porque: "Art. 41 inc. 3 Ley 19.880: en los procedimientos a solicitud del interesado, la resolución «deberá ajustarse a las peticiones formuladas por éste, sin que en ningún caso pueda agravar su situación inicial», sin perjuicio de que la Administración inicie de oficio un nuevo procedimiento. El punto 1 se mantiene; el punto 2 exige un procedimiento de oficio con contradictoriedad." },
        { texto: "NULO TODO: también el rechazo del permiso", correcto: false, porque: "El rechazo del permiso es la decisión sobre lo pedido y está fundada; sólo sobra la orden de demolición (conservación, art. 13 inc. 4; invalidación parcial, art. 53 inc. 2)." },
        { texto: "FALTA ACUERDO DEL CONCEJO PARA DEMOLER", correcto: false, porque: "Aplicar las normas de construcción es función municipal ejecutada por la Dirección de Obras (art. 3 e Ley 18.695); el Concejo no interviene." },
      ],
      norma: "Art. 41 inc. 3 Ley 19.880", fuente: "proceadmin", hallazgo: "m04-instruccion-fin",
    },
    {
      id: "m04-e-04", modulo: 4,
      titulo: "El local está en la comuna de al lado",
      relato: "Una vecina presentó en Potestas una solicitud de patente de alcoholes para un local que está en la comuna vecina de Jurisdicción. Rentas quiere «rechazarla por incompetencia» y archivar.",
      documento: { tipo: "Solicitud de patente de alcoholes, ingreso N.º 2.260", campos: [
        { k: "Solicitante", v: "Carmen Riquelme" },
        { k: "Dirección del local", v: "Calle Potestad 900, comuna de Jurisdicción" },
        { k: "Órgano al que se dirige", v: "Municipalidad de Potestas" },
        { k: "Propuesta de Rentas", v: "«Rechazar por incompetencia y archivar»" },
        { k: "Información a la interesada", v: "No prevista" },
      ] },
      vicio: "Propuesta de Rentas",
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "RECHAZAR Y ARCHIVAR: Potestas no tiene competencia", correcto: false, porque: "Es cierto que no la tiene; pero la ley dice qué hacer con la solicitud, y no es archivarla." },
        { texto: "DERIVAR DE INMEDIATO al órgano competente e informar a la interesada", correcto: true, porque: "Art. 14 inc. 2 Ley 19.880: «requerido un órgano de la Administración para intervenir en un asunto que no sea de su competencia, enviará de inmediato los antecedentes a la autoridad que deba conocer según el ordenamiento jurídico, informando de ello al interesado»." },
        { texto: "TRAMITAR IGUAL: la competencia territorial no importa", correcto: false, porque: "La competencia se mide también por territorio (art. 7 CPR; art. 2 Ley 18.575); una patente la otorga la municipalidad donde funciona el local." },
        { texto: "PEDIR A LA INTERESADA QUE LA PRESENTE DE NUEVO EN JURISDICCIÓN", correcto: false, porque: "La carga de enviar los antecedentes es de la Administración, no de la vecina (art. 14 inc. 2; celeridad, art. 7)." },
      ],
      norma: "Art. 14 inc. 2 Ley 19.880", fuente: "procedimiento-admin", hallazgo: "m04-impulso",
    },
    {
      id: "m04-e-05", modulo: 4,
      titulo: "«Vuelva con el notario»",
      relato: "La Oficina de Partes tiene un cartel: «Toda solicitud debe traer firma autorizada ante notario». Un vecino pregunta si eso es legal. Ningún reglamento municipal lo exige.",
      documento: { tipo: "Instrucción interna N.º 7, Oficina de Partes", campos: [
        { k: "Órgano", v: "Oficina de Partes, Municipalidad de Potestas" },
        { k: "Dispone", v: "No se recibirán solicitudes sin firma autorizada ante notario" },
        { k: "Fundamento", v: "«Evitar suplantaciones»" },
        { k: "Norma legal o reglamentaria que lo exija", v: "Ninguna" },
        { k: "Firma", v: "Jefa de la Oficina de Partes" },
      ] },
      vicio: "Norma legal o reglamentaria que lo exija",
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "VÁLIDA: la Municipalidad organiza su propia ventanilla", correcto: false, porque: "Organiza la ventanilla, pero no puede agregar formalidades que la ley prohíbe exigir." },
        { texto: "ILEGAL: la ley prohíbe exigir autorizaciones notariales de firma sin mandato legal o reglamentario", correcto: true, porque: "Art. 13 inc. 2 Ley 19.880: quienes desempeñen cargos en la Administración «no podrán exigir la presentación de autorizaciones notariales de firmas en documentos otorgados en soporte de papel o electrónico, salvo que dicha autorización sea expresamente requerida por mandato legal o reglamentario». La identidad se acredita por cualquier medio habilitado (art. 30 e); la instrucción debe dejarse sin efecto." },
        { texto: "VÁLIDA SI LA FIRMA LA ALCALDESA", correcto: false, porque: "La firma de la Alcaldesa no convierte en reglamento lo que la ley prohíbe; además el reglamento municipal requiere acuerdo del concejo (art. 65 l Ley 18.695)." },
        { texto: "SUBSANAR: cobrar sólo el costo del notario", correcto: false, porque: "El problema no es el costo, es la exigencia misma; y el procedimiento es gratuito para los interesados salvo ley en contrario (art. 6)." },
      ],
      norma: "Arts. 6, 13 inc. 2 y 30 Ley 19.880", fuente: "nuevo", hallazgo: "m04-no-formalizacion",
    },
    {
      id: "m04-e-06", modulo: 4,
      titulo: "El permiso de la casa de la esquina",
      relato: "Obras te muestra una resolución antes de notificarla: el permiso de edificación de la casa de la esquina de Juridicidad con Los Jueces. «Dinos si pasa la autopsia.»",
      documento: { tipo: "Resolución N.º 530, Dirección de Obras, permiso de edificación", campos: [
        { k: "Órgano", v: "Dirección de Obras Municipales de Potestas" },
        { k: "Procedimiento", v: "A solicitud de parte, ingreso N.º 2.190; solicitud completa" },
        { k: "Instrucción", v: "Informe de la Secretaría Comunal de Planificación (favorable); revisión del proyecto" },
        { k: "Vistos y Considerando", v: "Normas de urbanismo y construcciones; el proyecto cumple el plan regulador" },
        { k: "Dispone", v: "Otórgase permiso de edificación, exactamente lo solicitado" },
        { k: "Recursos", v: "Reposición en cinco días ante la misma Dirección; jerárquico ante la Alcaldesa" },
        { k: "Notificación prevista", v: "Dentro de cinco días, con texto íntegro" },
      ] },
      vicio: null,
      pregunta: "¿Qué sello le pones?",
      sellos: [
        { texto: "VÁLIDO", correcto: true, porque: "Solicitud completa (art. 30), instrucción con los informes necesarios (arts. 34 y 37), resolución fundada que se ajusta a lo pedido sin agravar (art. 41), con los recursos, el órgano y el plazo, y notificación prevista en cinco días con texto íntegro (art. 45). Pasa la autopsia." },
        { texto: "FALTA PERÍODO DE PRUEBA", correcto: false, porque: "El período de prueba se abre cuando a la Administración no le constan los hechos (art. 35 inc. 2); aquí los antecedentes técnicos constan en el expediente." },
        { texto: "FALTA INFORMACIÓN PÚBLICA", correcto: false, porque: "La información pública es facultativa y procede cuando la naturaleza del procedimiento lo requiere (art. 39); un permiso de edificación individual no la exige por la Ley 19.880." },
        { texto: "ERROR EN LOS RECURSOS: no procede jerárquico", correcto: false, porque: "El jerárquico no procede contra actos de los alcaldes (art. 59 inc. 4); contra la resolución de un Director sí, ante su superior, la Alcaldesa." },
      ],
      norma: "Arts. 30, 34, 37, 41 y 45 Ley 19.880", fuente: "nuevo", hallazgo: "m04-que-es",
    },
  ],
};

// PENDIENTE DE REVISIÓN (docs/REVISION_JURIDICA.md):
// - Errores de los apuntes que NO se copiaron: subsanación citada en el «art. 26» (es el 31; el 26 regula la
//   ampliación de plazos); «la Administración tiene 5 días para requerir la subsanación» y «si no subsana se
//   archiva» (la ley no fija ese plazo y el efecto es tenerlo por desistido); «audiencia del interesado, art. 39,
//   con propuesta de resolución 10 días antes» (el art. 39 es la información pública, con plazo de observaciones
//   no inferior a diez días; la «audiencia» de la ley española no existe en la 19.880, salvo la audiencia previa
//   de la invalidación, art. 53); «informes urgentes: 3 días» (la urgencia del art. 63 reduce los plazos a la
//   mitad); «abandono: 30 días hábiles» (son 30 días de paralización más la advertencia y 7 días, art. 43);
//   «art. 13 inc. 2» para el vicio esencial (es el inc. 3); «la no abstención produce nulidad» (art. 12 inc. 3:
//   no necesariamente); silencio «a los 6 meses» (ver jornada 5, arts. 64 y 65).
// - El dictamen CGR N.º 25.110/2016 citado por el apunte sobre actos verbales no se verificó: no se cita.
// - El art. 5 vigente ya no menciona actos verbales ni la administración militar: no se incluyó esa excepción.
// - Las tres funciones del procedimiento (racionalizar, participar, controlar) y la clasificación de los
//   procedimientos son doctrina (apuntes Cordero y sancionador).
// - El art. 4 enumera trece principios más los de medios electrónicos; «doce» es la cuenta tradicional que usa
//   el lema de la jornada.
