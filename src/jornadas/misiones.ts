// Misiones en terreno de algunas jornadas: rompen la receta (una carrera, una
// inspección, una investigación, un recorrido). Las preguntas aplican lo que
// el banco del módulo ya enseña; no agregan Derecho nuevo.
import type { Busqueda } from "./busqueda";

export const MISIONES: Record<number, Busqueda> = {
  // ── 5 · El reloj: una carrera contra el plazo ───────────────────────────
  5: {
    tipo: "carrera", lugar: "ciudad", objetivo: "El recurso de doña Rosa vence hoy: llévalo a tiempo",
    intro: "Doña Rosa dejó su reposición en el paradero. Vence hoy. Corre: los plazos no esperan, y Marisol cierra a las 14:00.",
    tiempo: 75,
    pistas: [
      { punto: "paradero", etiqueta: "Recoger el escrito", texto: "Un sobre: «Reposición contra el decreto que me cerró el taller. Doña Rosa». Quinto día hábil desde la notificación." ,
        pregunta: { texto: "La reposición, ¿se presenta dentro de cinco días desde la notificación?", si: true, porque: "Cinco días: por eso hoy es el último. Mañana sería tarde." } },
      { punto: "puerta-partes", dx: 22, etiqueta: "Ingresar en Partes", texto: "Marisol estampa el timbre de recepción: fecha y hora. «Llegaste. Raspando, pero llegaste».",
        pregunta: { texto: "¿El sábado cuenta en esos cinco días?", si: false, porque: "Los plazos de la Ley 19.880 son de días hábiles: sábados, domingos y festivos no cuentan." } },
      { punto: "plaza", etiqueta: "Avisarle a doña Rosa", texto: "Doña Rosa aplaude desde un banco: «¡Ingresado! Ahora que lo piensen de nuevo»." },
    ],
    cierre: "Un escrito a tiempo vale más que el mejor escrito tarde.",
  },
  // ── 6 · La multa: inspección en la plaza ────────────────────────────────
  6: {
    tipo: "inspeccion", lugar: "ciudad", objetivo: "Inspecciona la plaza con la Inspectora Lagos",
    intro: "Cuatro situaciones en la plaza. Encuéntralas (brillan) y di si la Municipalidad puede actuar así.",
    tiempo: 90,
    pistas: [
      { punto: "vecino-2", dx: 26, etiqueta: "Revisar el puesto", texto: "Un puesto de verduras ocupa media vereda. La inspectora quiere retirarlo ya.",
        pregunta: { texto: "Retirar el puesto de la vereda para despejarla, ¿es una sanción?", si: false, porque: "Es una medida para restablecer el orden, no un castigo: sanción es reprochar una infracción." } },
      { punto: "vecino-1", dx: -26, etiqueta: "Mirar el cartel", texto: "Un cartel enorme: «Prohibido mirar feo». Lo puso el Concejal Morales. Quiere multar a quien mire feo.",
        pregunta: { texto: "¿Se puede sancionar una conducta que ninguna ley ni ordenanza describe?", si: false, porque: "Sin una norma previa que describa la infracción no hay sanción posible." } },
      { punto: "vecino-3", dy: -24, etiqueta: "Escuchar la música", texto: "Un parlante a todo volumen frente al café. La inspectora: «Multa y listo».",
        pregunta: { texto: "Antes de sancionar, ¿hay que formular cargos y oír al afectado?", si: true, porque: "Primero los cargos, después los descargos, después la sanción. Sin audiencia no hay sanción válida." } },
      { punto: "vecino-4", dx: 28, etiqueta: "Revisar la basura", texto: "Bolsas en la esquina. Ya hubo una multa por esto ayer. La inspectora quiere otra, por el mismo hecho.",
        pregunta: { texto: "¿Se puede sancionar dos veces el mismo hecho?", si: false, porque: "Una vez por hecho: castigar dos veces lo mismo rompe el non bis in idem." } },
    ],
    cierre: "Sancionar también tiene reglas: ley previa, cargos, descargos y una sola vez.",
  },
  // ── 9 · El hoyo: investigación ──────────────────────────────────────────
  9: {
    tipo: "investigacion", lugar: "ciudad", objetivo: "Investiga el hoyo: busca las pistas",
    intro: "Antes de la audiencia, junta pruebas. Hay cuatro pistas alrededor del hoyo.",
    pistas: [
      { punto: "hoyo", dx: -24, etiqueta: "Mirar el cono", texto: "Un cono tirado lejos del hoyo. Ninguna señal, ninguna cinta. Tres meses así, según los reclamos.",
        pregunta: { texto: "Un hoyo sin señalizar por meses, ¿puede ser falta de servicio?", si: true, porque: "El servicio no funcionó como debía: ni reparó ni advirtió. Eso es falta de servicio." } },
      { punto: "hoyo", dx: 26, etiqueta: "Leer la receta", texto: "La receta de don Lucho: muñeca fracturada, tres semanas de licencia.",
        pregunta: { texto: "¿Basta con que haya daño para que pague la Municipalidad, aunque el servicio funcionara bien?", si: false, porque: "Hay que probar tres cosas: falta de servicio, daño y que uno causó el otro. El daño solo no basta." } },
      { punto: "hoyo", dy: 26, etiqueta: "Hablar con el testigo", texto: "Una vecina vio todo: «Don Lucho iba mirando el celular, pero el hoyo era enorme».",
        pregunta: { texto: "Si la víctima se expuso imprudentemente, ¿puede rebajarse la indemnización?", si: true, porque: "Si quien sufre el daño se expuso a él imprudentemente, la apreciación del daño se reduce." } },
      { punto: "hoyo", dy: -22, etiqueta: "Revisar el letrero", texto: "Un letrero municipal descolorido: «Reparación de veredas: programada»."
        , pregunta: { texto: "La mantención de las veredas de la comuna, ¿le toca a la Municipalidad?", si: true, porque: "Las veredas son bienes nacionales de uso público que administra la Municipalidad: el mal estado es su responsabilidad." } },
    ],
    cierre: "Falta de servicio, daño y causalidad. Con las tres pistas, el caso se arma solo.",
  },
  // ── 12 · La franja: recorrido por el barrio ─────────────────────────────
  12: {
    tipo: "recorrido", lugar: "ciudad", objetivo: "Recorre la franja: habla con los vecinos",
    intro: "Tres casas en la franja de la avenida. Visítalas: cada una está en una etapa distinta.",
    pistas: [
      { punto: "puerta-casa-2", dx: 22, etiqueta: "Golpear donde los Pérez", texto: "El señor Pérez: «Leímos en el diario que expropian por la avenida. ¿Y si no hay ley que lo diga?».",
        pregunta: { texto: "¿Se puede expropiar sin una ley que lo autorice?", si: false, porque: "Sin ley no hay expropiación: tiene que haber una ley que la autorice por utilidad pública o interés nacional." } },
      { punto: "puerta-casa-3", dx: 22, etiqueta: "Golpear en la casa amarilla", texto: "La vecina de la casa amarilla: «Vinieron tres peritos a tasar. ¿Me pagan lo que vale la casa?».",
        pregunta: { texto: "¿La indemnización cubre el daño patrimonial efectivamente causado?", si: true, porque: "Se indemniza el daño patrimonial efectivamente causado; si no hay acuerdo, lo fija el tribunal." } },
      { punto: "puerta-casa-rosa", dx: 22, etiqueta: "Visitar a doña Rosa", texto: "Doña Rosa: «Dicen que las máquinas llegan el lunes. Todavía no me pagan nada».",
        pregunta: { texto: "¿Pueden tomar posesión material de la casa antes de pagar la indemnización?", si: false, porque: "Primero el pago (total o el provisional), después la posesión. Las máquinas esperan al cheque." } },
    ],
    cierre: "Con ley, con causa y con cheque. En ese orden.",
  },
};
