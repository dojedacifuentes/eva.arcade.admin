// Módulo 8 · Tribunales: contencioso-administrativo. Recurso de protección (art.
// 20 CPR), reclamación de ilegalidad municipal (art. 151 Ley 18.695), acción de
// nulidad de derecho público (arts. 7 y 38 inc. 2 CPR), relación entre la vía
// administrativa y la judicial (art. 54 Ley 19.880; art. 10 Ley 18.575), y
// tribunales especiales con el Tribunal de Contratación Pública como ejemplo
// (arts. 22, 24 y 24 ter Ley 19.886). Contenido nuevo (los repos no lo traen),
// salvo el art. 54, que proceadmin-rpg menciona. Verificado contra cpr.xml,
// locmun.xml, l19880.xml, locbgae.xml y l19886.xml de la BCN el 12-10-2026. El
// plazo de 30 días del recurso de protección no está en la Constitución: lo fija el
// Auto Acordado de la Corte Suprema sobre su tramitación (se cita sin número).
import type { BancoModulo } from "../tipos";

export const BANCO_M08: BancoModulo = {
  modulo: 8,

  hallazgos: [
    {
      id: "m08-proteccion", modulo: 8,
      titulo: "Protección: rápido, pero sólo para algunos derechos",
      texto: "Quien sufre privación, perturbación o amenaza en el legítimo ejercicio de ciertos derechos del art. 19, por un acto u omisión arbitrario o ilegal, puede recurrir por sí o por cualquiera a su nombre a la Corte de Apelaciones, que adopta de inmediato las providencias necesarias para restablecer el imperio del derecho. El plazo es de 30 días corridos, fijado por auto acordado de la Corte Suprema.",
      norma: "Art. 20 CPR; Auto Acordado de la Corte Suprema sobre tramitación del recurso de protección",
      simple: "Es el 911 de los derechos fundamentales: rápido, pero no atiende todos los números.",
    },
    {
      id: "m08-reclamo-ilegalidad", modulo: 8,
      titulo: "Primero el alcalde, después la Corte",
      texto: "Contra resoluciones u omisiones ilegales de la Municipalidad, cualquier particular (si afectan el interés general de la comuna) o el agraviado puede reclamar ante el alcalde dentro de 30 días. Si el alcalde no se pronuncia en 15 días, se entiende rechazado. Rechazado, se reclama en 15 días ante la Corte de Apelaciones, que puede decretar orden de no innovar y, en la sentencia, anular el acto, ordenar dictar el que corresponda y declarar el derecho a los perjuicios.",
      norma: "Art. 151 Ley 18.695",
      simple: "Treinta días para reclamarle a la Alcaldesa, quince para que responda y quince para ir a la Corte. El reloj no tiene botón de pausa.",
    },
    {
      id: "m08-nulidad-dp", modulo: 8,
      titulo: "Nulo de pleno derecho, pero lo declara un juez",
      texto: "Todo acto dictado sin investidura regular, fuera de la competencia o sin la forma legal es nulo y genera responsabilidades. Cualquier persona lesionada en sus derechos por la Administración o las municipalidades puede reclamar ante los tribunales que determine la ley. Sin un procedimiento especial, la acción de nulidad de derecho público se tramita como juicio ordinario ante el juez civil.",
      norma: "Arts. 7 y 38 inc. 2 CPR",
      simple: "La Constitución dice «nulo»; el juez civil es quien lo escribe en la sentencia, y en juicio ordinario, o sea, sin apuro.",
    },
    {
      id: "m08-via-no-obligatoria", modulo: 8,
      titulo: "No es obligatorio agotar la vía administrativa, pero elige",
      texto: "Nadie está obligado a recurrir ante la Administración antes de demandar. Pero si se reclamó ante ella, no se puede deducir la misma pretensión ante los tribunales mientras no se resuelva o venza el plazo para entenderla desestimada; la reclamación interrumpe el plazo judicial, que vuelve a contarse desde la notificación de lo resuelto o desde la desestimación. Y si se demanda primero, la Administración debe inhibirse.",
      norma: "Art. 54 Ley 19.880; art. 10 Ley 18.575",
      simple: "Puedes ir por el pasillo o por la escalera, pero no por los dos a la vez.",
    },
    {
      id: "m08-tribunales-especiales", modulo: 8,
      titulo: "Jueces con especialidad",
      texto: "Hay tribunales especiales para ciertos contenciosos. El Tribunal de Contratación Pública conoce la impugnación de actos u omisiones ilegales o arbitrarios en los procedimientos de contratación con organismos del Estado y en la ejecución de los contratos, con una demanda que debe deducirse en diez días hábiles. Otros ejemplos: los Tribunales Ambientales y los Tribunales Tributarios y Aduaneros.",
      norma: "Arts. 22, 24 y 24 ter Ley 19.886",
      simple: "Para pelear una licitación hay un tribunal que sólo hace eso. Y da diez días hábiles, no un semestre.",
    },
    {
      id: "m08-no-innovar", modulo: 8,
      titulo: "La presunción de legalidad cede ante el juez",
      texto: "El acto se presume legal y puede ejecutarse de oficio, salvo que lo suspenda la autoridad en el procedimiento impugnatorio o el juez por la vía jurisdiccional. En la reclamación de ilegalidad, la Corte puede decretar orden de no innovar cuando la ejecución del acto produzca un daño irreparable al reclamante.",
      norma: "Art. 3 inc. final Ley 19.880; art. 151 letra e) Ley 18.695",
      simple: "La Administración puede ejecutar mientras discute. El juez puede decirle «quieto». A veces lo dice.",
    },
    {
      id: "m08-perjuicios", modulo: 8,
      titulo: "Ganado el reclamo, se cobran los perjuicios",
      texto: "Si la Corte acoge la reclamación de ilegalidad, el interesado puede demandar la indemnización de perjuicios ante los tribunales ordinarios en juicio sumario, y pedir al Ministerio Público la investigación criminal si corresponde. En ambos casos no puede discutirse la ilegalidad ya declarada.",
      norma: "Art. 151 letra i) Ley 18.695",
      simple: "Una vez que la Corte dijo «ilegal», la Municipalidad ya no puede decir «pero».",
    },
  ],

  afirmaciones: [
    { id: "m08-af-01", modulo: 8, hallazgo: "m08-proteccion", texto: "El recurso de protección se interpone ante la Corte de Apelaciones.", verdad: true, porque: "Art. 20 CPR: se ocurre a la Corte de Apelaciones respectiva." },
    { id: "m08-af-02", modulo: 8, hallazgo: "m08-proteccion", texto: "El recurso de protección ampara todos los derechos del art. 19 de la Constitución.", verdad: false, porque: "Sólo los que enumera el art. 20 CPR (y el N.º 8 cuando el daño ambiental proviene de un acto u omisión ilegal imputable a autoridad o persona determinada)." },
    { id: "m08-af-03", modulo: 8, hallazgo: "m08-reclamo-ilegalidad", texto: "El reclamo de ilegalidad municipal se presenta primero ante el alcalde.", verdad: true, porque: "Art. 151 letras a) y b) Ley 18.695: se reclama ante el alcalde dentro de 30 días." },
    { id: "m08-af-04", modulo: 8, hallazgo: "m08-reclamo-ilegalidad", texto: "Si el alcalde no responde el reclamo en 30 días, se entiende acogido.", verdad: false, porque: "Se considera rechazado si no se pronuncia en 15 días desde la recepción (art. 151 letra c) Ley 18.695)." },
    { id: "m08-af-05", modulo: 8, hallazgo: "m08-nulidad-dp", texto: "Cualquier persona lesionada en sus derechos por una municipalidad puede reclamar ante los tribunales que determine la ley.", verdad: true, porque: "Art. 38 inc. 2 CPR." },
    { id: "m08-af-06", modulo: 8, hallazgo: "m08-nulidad-dp", texto: "La nulidad de derecho público la declara la Contraloría.", verdad: false, porque: "La declaran los tribunales; la Contraloría no conoce asuntos litigiosos (arts. 7 y 38 inc. 2 CPR; art. 6 Ley 10.336)." },
    { id: "m08-af-07", modulo: 8, hallazgo: "m08-via-no-obligatoria", texto: "Presentar una reposición interrumpe el plazo para ejercer la acción judicial.", verdad: true, porque: "Planteada la reclamación se interrumpe el plazo para ejercer la acción jurisdiccional (art. 54 Ley 19.880)." },
    { id: "m08-af-08", modulo: 8, hallazgo: "m08-via-no-obligatoria", texto: "Se puede presentar una reposición y, al mismo tiempo, demandar lo mismo ante el juez.", verdad: false, porque: "Interpuesta la reclamación administrativa, no se puede deducir igual pretensión ante los tribunales mientras no se resuelva o venza el plazo (art. 54 Ley 19.880)." },
    { id: "m08-af-09", modulo: 8, hallazgo: "m08-tribunales-especiales", texto: "El Tribunal de Contratación Pública conoce la impugnación de actos ilegales o arbitrarios ocurridos en los procedimientos de contratación del Estado.", verdad: true, porque: "Art. 24 N.º 1 Ley 19.886." },
    { id: "m08-af-10", modulo: 8, hallazgo: "m08-tribunales-especiales", texto: "El Tribunal de Contratación Pública también resuelve las indemnizaciones por incumplimiento de contrato.", verdad: false, porque: "No es competente para las acciones civiles por incumplimiento ni para acciones indemnizatorias de ningún tipo (art. 24 Ley 19.886)." },
    { id: "m08-af-11", modulo: 8, hallazgo: "m08-no-innovar", texto: "En la reclamación de ilegalidad, la Corte puede decretar orden de no innovar si la ejecución del acto causa un daño irreparable.", verdad: true, porque: "Art. 151 letra e) Ley 18.695." },
    { id: "m08-af-12", modulo: 8, hallazgo: "m08-no-innovar", texto: "Presentada una demanda contra un acto, éste deja de ejecutarse automáticamente.", verdad: false, porque: "El acto se presume legal y se ejecuta de oficio salvo orden de suspensión de la autoridad o del juez (art. 3 inc. final Ley 19.880)." },
    { id: "m08-af-13", modulo: 8, hallazgo: "m08-perjuicios", texto: "Acogido el reclamo de ilegalidad, los perjuicios se demandan en juicio sumario sin discutir de nuevo la ilegalidad.", verdad: true, porque: "Art. 151 letra i) Ley 18.695." },
    { id: "m08-af-14", modulo: 8, hallazgo: "m08-perjuicios", texto: "La Corte de Apelaciones fija el monto de la indemnización en la misma sentencia del reclamo de ilegalidad.", verdad: false, porque: "Declara el derecho a los perjuicios cuando se pidió; el monto se demanda después en juicio sumario ante los tribunales ordinarios (art. 151 letras h) e i) Ley 18.695)." },
  ],

  fichas: [
    { id: "m08-f-01", modulo: 8, frente: "Recurso de protección: presupuestos", dorso: "Acto u omisión arbitrario o ilegal; privación, perturbación o amenaza; en el legítimo ejercicio de un derecho de la lista del art. 20.", norma: "Art. 20 CPR", etiqueta: "Protección", prioridad: "S", fuente: "nuevo" },
    { id: "m08-f-02", modulo: 8, frente: "¿Quién y ante quién?", dorso: "El afectado, por sí o por cualquiera a su nombre, ante la Corte de Apelaciones respectiva.", norma: "Art. 20 CPR", etiqueta: "Protección", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-03", modulo: 8, frente: "¿Qué hace la Corte en protección?", dorso: "Adopta de inmediato las providencias que juzgue necesarias para restablecer el imperio del derecho y asegurar la debida protección del afectado, sin perjuicio de los demás derechos que pueda hacer valer ante la autoridad o los tribunales.", norma: "Art. 20 CPR", etiqueta: "Protección", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-04", modulo: 8, frente: "Derechos NO cubiertos por la protección (ejemplos)", dorso: "La igual protección de la ley en general (sólo el inc. 5 del N.º 3, comisiones especiales), el derecho a la educación (N.º 10), la libertad de trabajo salvo en lo relativo a su libre elección y contratación (N.º 16), la seguridad social (N.º 18).", norma: "Art. 20 CPR", etiqueta: "Protección", prioridad: "B", fuente: "nuevo" },
    { id: "m08-f-05", modulo: 8, frente: "Protección ambiental", dorso: "Procede por el N.º 8 del art. 19 cuando el derecho a vivir en un medio ambiente libre de contaminación es afectado por un acto u omisión ilegal (no basta arbitrario) imputable a una autoridad o persona determinada.", norma: "Art. 20 inc. 2 CPR", etiqueta: "Protección", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-06", modulo: 8, frente: "Plazo del recurso de protección", dorso: "30 días corridos desde el acto u omisión o desde que se tuvo conocimiento cierto de ellos. No está en la Constitución: lo fija el Auto Acordado de la Corte Suprema.", norma: "Auto Acordado de la Corte Suprema sobre tramitación del recurso de protección", etiqueta: "Protección", prioridad: "S", fuente: "nuevo" },
    { id: "m08-f-07", modulo: 8, frente: "Reclamo de ilegalidad municipal: ¿quién puede reclamar?", dorso: "a) Cualquier particular, contra resoluciones u omisiones que afecten el interés general de la comuna; b) el particular agraviado por toda resolución u omisión de funcionarios que estime ilegal.", norma: "Art. 151 letras a) y b) Ley 18.695", etiqueta: "Reclamo de ilegalidad", prioridad: "S", fuente: "nuevo" },
    { id: "m08-f-08", modulo: 8, frente: "Reclamo ante el alcalde: plazo", dorso: "30 días, contados desde la publicación del acto (interés general) o desde la notificación administrativa (agraviado); en las omisiones, desde el requerimiento.", norma: "Art. 151 letras a) y b) Ley 18.695", etiqueta: "Reclamo de ilegalidad", prioridad: "S", fuente: "nuevo" },
    { id: "m08-f-09", modulo: 8, frente: "Silencio del alcalde en el reclamo", dorso: "Se considera rechazado si no se pronuncia dentro de 15 días desde la recepción en la Municipalidad; el secretario municipal certifica el vencimiento.", norma: "Art. 151 letras c) y d) Ley 18.695", etiqueta: "Reclamo de ilegalidad", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-10", modulo: 8, frente: "Reclamo ante la Corte de Apelaciones", dorso: "Rechazado el reclamo (ficta o expresamente), 15 días para reclamar ante la Corte, contados desde la certificación del vencimiento o desde la notificación de la resolución del alcalde, personal o por cédula.", norma: "Art. 151 letra d) Ley 18.695", etiqueta: "Reclamo de ilegalidad", prioridad: "S", fuente: "nuevo" },
    { id: "m08-f-11", modulo: 8, frente: "Contenido del escrito de reclamo", dorso: "Con precisión: el acto u omisión reclamado, la norma legal infringida, la forma en que se produjo la infracción y, cuando proceda, las razones por las que el acto u omisión le perjudica.", norma: "Art. 151 letra d) Ley 18.695", etiqueta: "Reclamo de ilegalidad", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-12", modulo: 8, frente: "Tramitación en la Corte", dorso: "Orden de no innovar si hay daño irreparable; traslado al alcalde por diez días; eventual término probatorio con reglas de los incidentes; informe del fiscal judicial; autos en relación con preferencia.", norma: "Art. 151 letras e) a g) Ley 18.695", etiqueta: "Reclamo de ilegalidad", prioridad: "B", fuente: "nuevo" },
    { id: "m08-f-13", modulo: 8, frente: "¿Qué puede decidir la Corte si acoge el reclamo?", dorso: "La anulación total o parcial del acto; la dictación de la resolución que corresponda para subsanar la omisión o reemplazar la anulada; la declaración del derecho a los perjuicios, si se pidieron; el envío de antecedentes al Ministerio Público.", norma: "Art. 151 letra h) Ley 18.695", etiqueta: "Reclamo de ilegalidad", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-14", modulo: 8, frente: "Perjuicios tras el reclamo acogido", dorso: "Se demandan ante los tribunales ordinarios en juicio sumario; no puede discutirse la ilegalidad ya declarada.", norma: "Art. 151 letra i) Ley 18.695", etiqueta: "Reclamo de ilegalidad", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-15", modulo: 8, frente: "Excepción: la Dirección de Obras", dorso: "Los reclamos contra resoluciones de la unidad de obras en permisos y materias urbanísticas se rigen por la Ley General de Urbanismo y Construcciones.", norma: "Art. 151 inc. final Ley 18.695", etiqueta: "Reclamo de ilegalidad", prioridad: "B", fuente: "nuevo" },
    { id: "m08-f-16", modulo: 8, frente: "Nulidad de derecho público: fundamento", dorso: "Los órganos actúan válidamente previa investidura regular, dentro de su competencia y en la forma legal; todo acto en contravención es nulo y origina responsabilidades.", norma: "Art. 7 CPR", etiqueta: "Nulidad", prioridad: "S", fuente: "nuevo" },
    { id: "m08-f-17", modulo: 8, frente: "Nulidad de derecho público: la puerta a los tribunales", dorso: "Cualquier persona lesionada en sus derechos por la Administración, sus organismos o las municipalidades puede reclamar ante los tribunales que determine la ley, sin perjuicio de la responsabilidad del funcionario.", norma: "Art. 38 inc. 2 CPR", etiqueta: "Nulidad", prioridad: "S", fuente: "nuevo" },
    { id: "m08-f-18", modulo: 8, frente: "¿Cómo se tramita la acción de nulidad de derecho público?", dorso: "No hay procedimiento ni plazo especial: se tramita como juicio ordinario ante el juez civil (doctrina y jurisprudencia).", norma: "Arts. 7 y 38 inc. 2 CPR (doctrina)", etiqueta: "Nulidad", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-19", modulo: 8, frente: "Art. 54: regla uno", dorso: "Interpuesta una reclamación ante la Administración, el mismo reclamante no puede deducir igual pretensión ante los tribunales mientras no se resuelva o no venza el plazo para entenderla desestimada.", norma: "Art. 54 inc. 1 Ley 19.880", etiqueta: "Vía administrativa", prioridad: "S", fuente: "proceadmin" },
    { id: "m08-f-20", modulo: 8, frente: "Art. 54: regla dos", dorso: "Planteada la reclamación administrativa se interrumpe el plazo para ejercer la acción jurisdiccional; vuelve a contarse desde la notificación del acto que la resuelve o desde que se entiende desestimada.", norma: "Art. 54 inc. 2 Ley 19.880", etiqueta: "Vía administrativa", prioridad: "S", fuente: "proceadmin" },
    { id: "m08-f-21", modulo: 8, frente: "Art. 54: regla tres", dorso: "Si el interesado deduce acción jurisdiccional contra un acto, la Administración debe inhibirse de conocer cualquier reclamación que interponga sobre la misma pretensión.", norma: "Art. 54 inc. 3 Ley 19.880", etiqueta: "Vía administrativa", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-22", modulo: 8, frente: "¿Hay que agotar la vía administrativa antes de demandar?", dorso: "No, por regla general: los recursos administrativos proceden «sin perjuicio de las acciones jurisdiccionales a que haya lugar». Pero si se elige la vía administrativa, rige el art. 54.", norma: "Art. 10 Ley 18.575; art. 54 Ley 19.880", etiqueta: "Vía administrativa", prioridad: "S", fuente: "nuevo" },
    { id: "m08-f-23", modulo: 8, frente: "Tribunal de Contratación Pública", dorso: "Órgano jurisdiccional especial con asiento en Santiago, falla conforme a derecho, bajo la superintendencia de la Corte Suprema. Competencia: impugnación de actos u omisiones ilegales o arbitrarios en procedimientos de contratación y en la ejecución de contratos; actos de la Dirección de Compras sobre el Registro de Proveedores; nulidad de contratos. No conoce indemnizaciones.", norma: "Arts. 22 y 24 Ley 19.886", etiqueta: "Tribunales especiales", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-24", modulo: 8, frente: "Plazo para demandar ante el Tribunal de Contratación Pública", dorso: "Diez días hábiles, fatales, desde que se conoció o debió conocer la ilegalidad; si antes hubo recurso administrativo, desde la notificación del acto que lo resolvió o la certificación de que no se resolvió en plazo. La acción de nulidad del contrato, nunca después de dos años desde el vicio.", norma: "Art. 24 ter Ley 19.886", etiqueta: "Tribunales especiales", prioridad: "A", fuente: "nuevo" },
    { id: "m08-f-25", modulo: 8, frente: "Suspensión judicial del acto", dorso: "La presunción de legalidad y la ejecución de oficio ceden ante una orden de suspensión de la autoridad en el procedimiento impugnatorio o del juez por la vía jurisdiccional.", norma: "Art. 3 inc. final Ley 19.880", etiqueta: "Vía administrativa", prioridad: "A", fuente: "acto-admin" },
  ],

  quiz: [
    { id: "m08-q-01", modulo: 8, texto: "¿Ante qué tribunal se interpone el recurso de protección?", opciones: ["Juzgado de letras civil", "Corte de Apelaciones respectiva", "Corte Suprema", "Tribunal Constitucional"], correcta: 1, porque: "Art. 20 CPR: se ocurre a la Corte de Apelaciones respectiva.", norma: "Art. 20 CPR", fuente: "nuevo" },
    { id: "m08-q-02", modulo: 8, texto: "¿Qué exige el art. 20 CPR respecto del acto que se reclama?", opciones: ["Que sea ilegal y arbitrario a la vez", "Que sea arbitrario o ilegal y prive, perturbe o amenace un derecho protegido", "Que esté firme", "Que haya sido tomado razón"], correcta: 1, porque: "Basta que el acto u omisión sea arbitrario o ilegal y afecte el legítimo ejercicio de uno de los derechos listados (art. 20 CPR).", norma: "Art. 20 CPR", fuente: "nuevo" },
    { id: "m08-q-03", modulo: 8, texto: "¿De dónde sale el plazo de 30 días del recurso de protección?", opciones: ["Del art. 20 CPR", "De la Ley 19.880", "Del Auto Acordado de la Corte Suprema", "Del Código de Procedimiento Civil"], correcta: 2, porque: "La Constitución no fija plazo; lo establece el Auto Acordado de la Corte Suprema sobre tramitación del recurso de protección.", norma: "Auto Acordado de la Corte Suprema", fuente: "nuevo" },
    { id: "m08-q-04", modulo: 8, texto: "Un vecino quiere reclamar por ilegalidad contra un decreto alcaldicio. ¿Cuál es el primer paso?", opciones: ["Demandar en el juzgado civil", "Reclamar ante el alcalde dentro de 30 días", "Reclamar ante la Corte de Apelaciones dentro de 15 días", "Pedir dictamen a Contraloría"], correcta: 1, porque: "Art. 151 letras a) y b) Ley 18.695: el reclamo se entabla ante el alcalde dentro de 30 días desde la publicación o la notificación.", norma: "Art. 151 Ley 18.695", fuente: "nuevo" },
    { id: "m08-q-05", modulo: 8, texto: "El alcalde no responde el reclamo. ¿Cuándo se entiende rechazado?", opciones: ["A los 5 días", "A los 15 días desde su recepción en la Municipalidad", "A los 30 días", "Nunca: hay que esperar la resolución"], correcta: 1, porque: "Art. 151 letra c) Ley 18.695; el secretario municipal certifica el vencimiento.", norma: "Art. 151 Ley 18.695", fuente: "nuevo" },
    { id: "m08-q-06", modulo: 8, texto: "Rechazado el reclamo por el alcalde, ¿cuánto plazo hay para ir a la Corte de Apelaciones?", opciones: ["5 días", "10 días", "15 días", "30 días"], correcta: 2, porque: "Art. 151 letra d) Ley 18.695: 15 días desde la certificación del vencimiento o desde la notificación de la resolución que rechaza.", norma: "Art. 151 Ley 18.695", fuente: "nuevo" },
    { id: "m08-q-07", modulo: 8, texto: "Si la Corte acoge el reclamo de ilegalidad, ¿qué puede ordenar?", opciones: ["Sólo la anulación del acto", "Anulación total o parcial, dictación de la resolución que corresponda, declaración del derecho a perjuicios y envío al Ministerio Público", "Sólo una multa a la Municipalidad", "La destitución del alcalde"], correcta: 1, porque: "Art. 151 letra h) Ley 18.695.", norma: "Art. 151 Ley 18.695", fuente: "nuevo" },
    { id: "m08-q-08", modulo: 8, texto: "¿Cuál es el fundamento constitucional de la acción de nulidad de derecho público?", opciones: ["Art. 19 N.º 3 CPR", "Arts. 7 y 38 inc. 2 CPR", "Art. 20 CPR", "Art. 99 CPR"], correcta: 1, porque: "Art. 7: todo acto en contravención es nulo; art. 38 inc. 2: cualquier persona lesionada puede reclamar ante los tribunales que determine la ley.", norma: "Arts. 7 y 38 CPR", fuente: "nuevo" },
    { id: "m08-q-09", modulo: 8, texto: "Un vecino presentó reposición y, sin esperar, demandó lo mismo en el juzgado civil. ¿Qué dice el art. 54?", opciones: ["Puede hacerlo: son vías independientes", "No puede deducir igual pretensión ante los tribunales mientras la reclamación no se resuelva o venza el plazo", "La demanda anula la reposición", "Debe pedir permiso a Contraloría"], correcta: 1, porque: "Art. 54 inc. 1 Ley 19.880.", norma: "Art. 54 Ley 19.880", fuente: "proceadmin" },
    { id: "m08-q-10", modulo: 8, texto: "¿Qué efecto tiene la reclamación administrativa sobre el plazo de la acción judicial?", opciones: ["Ninguno", "Lo interrumpe; vuelve a contarse desde la notificación de lo resuelto o desde la desestimación", "Lo suspende por 30 días fijos", "Lo extingue"], correcta: 1, porque: "Art. 54 inc. 2 Ley 19.880.", norma: "Art. 54 Ley 19.880", fuente: "proceadmin" },
    { id: "m08-q-11", modulo: 8, texto: "Si el interesado demanda primero ante los tribunales, la Administración…", opciones: ["Debe resolver igual cualquier recurso que le presente", "Debe inhibirse de conocer cualquier reclamación sobre la misma pretensión", "Debe pedir la suspensión del juicio", "Puede invalidar el acto sin audiencia"], correcta: 1, porque: "Art. 54 inc. 3 Ley 19.880.", norma: "Art. 54 Ley 19.880", fuente: "nuevo" },
    { id: "m08-q-12", modulo: 8, texto: "Una empresa alega que la Municipalidad adjudicó una licitación de forma arbitraria. ¿Qué tribunal conoce la impugnación?", opciones: ["El juzgado de policía local", "El Tribunal de Contratación Pública", "La Contraloría", "El Tribunal Constitucional"], correcta: 1, porque: "Art. 24 N.º 1 Ley 19.886: acción de impugnación contra actos u omisiones ilegales o arbitrarios en los procedimientos de contratación.", norma: "Art. 24 Ley 19.886", fuente: "nuevo" },
    { id: "m08-q-13", modulo: 8, texto: "¿En qué plazo se demanda ante el Tribunal de Contratación Pública?", opciones: ["5 días corridos", "10 días hábiles desde que se conoció o debió conocer la ilegalidad", "30 días corridos", "1 año"], correcta: 1, porque: "Art. 24 ter Ley 19.886: plazo fatal de diez días hábiles.", norma: "Art. 24 ter Ley 19.886", fuente: "nuevo" },
    { id: "m08-q-14", modulo: 8, texto: "¿Qué pasa con la ejecución del acto mientras se discute en tribunales?", opciones: ["Se suspende automáticamente con la demanda", "Sigue: se presume legal y se ejecuta de oficio, salvo suspensión ordenada por la autoridad o por el juez", "Se suspende sólo si lo pide Contraloría", "Depende del monto"], correcta: 1, porque: "Art. 3 inc. final Ley 19.880; en el reclamo de ilegalidad, la Corte puede decretar orden de no innovar (art. 151 letra e) Ley 18.695).", norma: "Art. 3 Ley 19.880; art. 151 Ley 18.695", fuente: "acto-admin" },
  ],

  orales: [
    {
      id: "m08-o-01", modulo: 8,
      pregunta: "Explique el recurso de protección: presupuestos, tribunal, plazo y qué puede resolver la Corte.",
      profesor: "Comisión de Derecho Constitucional y Administrativo",
      claves: ["Acto u omisión arbitrario o ilegal", "Privación, perturbación o amenaza", "Sólo derechos de la lista del art. 20", "Por sí o por cualquiera a su nombre", "Corte de Apelaciones respectiva", "Providencias para restablecer el imperio del derecho", "30 días corridos por auto acordado", "Sin perjuicio de otras acciones"],
      trampas: ["Protege todos los derechos del art. 19", "Se interpone ante la Corte Suprema", "El plazo está en la Constitución", "Exige agotar antes la vía administrativa", "Sólo procede contra la Administración"],
      modelo: "El recurso de protección procede cuando, por causa de actos u omisiones arbitrarios o ilegales, una persona sufre privación, perturbación o amenaza en el legítimo ejercicio de los derechos y garantías que enumera el art. 20 CPR. Puede deducirlo el afectado por sí o cualquiera a su nombre, ante la Corte de Apelaciones respectiva, que adopta de inmediato las providencias necesarias para restablecer el imperio del derecho y asegurar la debida protección del afectado, sin perjuicio de los demás derechos que pueda hacer valer ante la autoridad o los tribunales. El plazo de 30 días corridos no está en la Constitución: lo fija el Auto Acordado de la Corte Suprema. En materia ambiental procede sólo por acto u omisión ilegal imputable a autoridad o persona determinada.",
      repregunta: "¿Procede la protección contra una omisión de la Municipalidad?",
      prioridad: "S", fuente: "nuevo",
    },
    {
      id: "m08-o-02", modulo: 8,
      pregunta: "Describa la reclamación de ilegalidad municipal del art. 151 de la Ley 18.695, con sus plazos y lo que puede resolver la Corte.",
      profesor: "Comisión de Derecho Administrativo",
      claves: ["Contra resoluciones u omisiones ilegales de la Municipalidad", "Cualquier particular (interés general) o el agraviado", "Ante el alcalde, 30 días desde publicación o notificación", "Rechazo ficto a los 15 días", "Corte de Apelaciones, 15 días", "Orden de no innovar si hay daño irreparable", "Sentencia: anular, ordenar dictar, derecho a perjuicios", "Perjuicios en juicio sumario sin discutir la ilegalidad"],
      trampas: ["Se interpone directamente ante la Corte", "El silencio del alcalde acoge el reclamo", "El plazo ante la Corte es de 30 días", "La Corte fija el monto de los perjuicios", "Procede contra actos de cualquier servicio público"],
      modelo: "Contra las resoluciones u omisiones ilegales de la Municipalidad, cualquier particular puede reclamar cuando afecten el interés general de la comuna, y el agraviado contra toda resolución u omisión de funcionarios. El reclamo se entabla ante el alcalde dentro de 30 días desde la publicación o la notificación (o desde el requerimiento, en las omisiones). Si el alcalde no se pronuncia en 15 días se entiende rechazado; rechazado, hay 15 días para reclamar ante la Corte de Apelaciones, que puede decretar orden de no innovar si la ejecución causa daño irreparable. La sentencia puede anular total o parcialmente el acto, ordenar dictar la resolución que corresponda, declarar el derecho a los perjuicios y enviar los antecedentes al Ministerio Público; los perjuicios se demandan después en juicio sumario sin poder discutirse la ilegalidad ya declarada.",
      repregunta: "¿Y si la resolución reclamada es un permiso de edificación de la Dirección de Obras?",
      prioridad: "S", fuente: "nuevo",
    },
    {
      id: "m08-o-03", modulo: 8,
      pregunta: "¿Es obligatorio agotar la vía administrativa antes de ir a tribunales? Explique el art. 54 de la Ley 19.880.",
      profesor: "Comisión de Derecho Administrativo",
      claves: ["No es obligatorio: recursos sin perjuicio de las acciones judiciales", "Interpuesta la reclamación, no se demanda lo mismo mientras no se resuelva", "La reclamación interrumpe el plazo judicial", "El plazo vuelve a contarse desde la notificación o la desestimación", "Si se demanda primero, la Administración se inhibe", "Elegir la vía con el plazo judicial a la vista"],
      trampas: ["Hay que agotar siempre la vía administrativa", "La reposición y la demanda pueden correr en paralelo", "La reclamación suspende el plazo, no lo interrumpe", "La Administración puede seguir resolviendo aunque haya juicio", "El art. 54 sólo rige en Santiago"],
      modelo: "No es obligatorio agotar la vía administrativa: la Ley 18.575 dispone que los recursos proceden sin perjuicio de las acciones jurisdiccionales (art. 10). Pero el art. 54 de la Ley 19.880 ordena la relación entre ambas vías con tres reglas: interpuesta una reclamación ante la Administración, el reclamante no puede deducir igual pretensión ante los tribunales mientras no se resuelva o venza el plazo para entenderla desestimada; planteada la reclamación se interrumpe el plazo para ejercer la acción jurisdiccional, que vuelve a contarse desde la notificación del acto que la resuelve o desde la desestimación; y si se deduce acción jurisdiccional, la Administración debe inhibirse de conocer cualquier reclamación sobre la misma pretensión.",
      repregunta: "¿Qué pasa con el plazo de la reclamación de ilegalidad municipal si antes se presentó reposición?",
      prioridad: "A", fuente: "proceadmin",
    },
  ],

  columnas: [
    {
      id: "m08-c-01", modulo: 8, titulo: "¿Protección o reclamación de ilegalidad municipal?",
      izq: "Recurso de protección", der: "Reclamación de ilegalidad",
      items: [
        { texto: "Fundamento en el art. 20 de la Constitución", lado: 0, porque: "Es la acción constitucional." },
        { texto: "Fundamento en el art. 151 de la Ley 18.695", lado: 1, porque: "Es la acción municipal especial." },
        { texto: "Procede contra actos de cualquier autoridad o particular", lado: 0, porque: "El art. 20 no limita el sujeto pasivo." },
        { texto: "Sólo contra resoluciones u omisiones de la Municipalidad", lado: 1, porque: "Art. 151 Ley 18.695." },
        { texto: "Plazo de 30 días corridos por auto acordado", lado: 0, porque: "La Constitución no fija plazo; lo hace la Corte Suprema." },
        { texto: "Primero 30 días ante el alcalde, luego 15 ante la Corte", lado: 1, porque: "Art. 151 letras a) a d)." },
        { texto: "Exige privación, perturbación o amenaza de un derecho de la lista", lado: 0, porque: "Art. 20 CPR." },
        { texto: "Basta la ilegalidad del acto, con interés general o agravio", lado: 1, porque: "Art. 151 letras a) y b)." },
        { texto: "La sentencia puede declarar el derecho a los perjuicios", lado: 1, porque: "Art. 151 letra h)." },
        { texto: "Providencias inmediatas para restablecer el imperio del derecho", lado: 0, porque: "Art. 20 CPR." },
      ],
      norma: "Art. 20 CPR; art. 151 Ley 18.695", fuente: "nuevo",
    },
  ],

  cadenas: [
    {
      id: "m08-k-01", modulo: 8, titulo: "La reclamación de ilegalidad municipal, paso a paso",
      pasos: ["Se publica o notifica la resolución municipal ilegal", "Dentro de 30 días, reclamo ante el alcalde", "El alcalde resuelve o, a los 15 días, se entiende rechazado (certifica el secretario municipal)", "Dentro de 15 días, reclamo ante la Corte de Apelaciones", "La Corte puede decretar orden de no innovar y da traslado al alcalde por diez días", "Eventual prueba, informe del fiscal judicial y vista preferente", "Sentencia: anula, ordena dictar la resolución, declara derecho a perjuicios", "Perjuicios en juicio sumario sin discutir la ilegalidad"],
      norma: "Art. 151 Ley 18.695", fuente: "nuevo",
    },
    {
      id: "m08-k-02", modulo: 8, titulo: "Vía administrativa y vía judicial según el art. 54",
      pasos: ["Se notifica el acto que afecta al interesado", "El interesado elige: reclamar ante la Administración o demandar", "Si reclama, se interrumpe el plazo de la acción judicial", "Mientras no se resuelva o venza el plazo, no puede demandar lo mismo", "Se resuelve la reclamación o se entiende desestimada", "El plazo judicial vuelve a contarse desde la notificación o la desestimación", "Deduce la acción judicial; la Administración se inhibe de nuevas reclamaciones"],
      norma: "Art. 54 Ley 19.880", fuente: "proceadmin",
    },
  ],

  expedientes: [
    {
      id: "m08-e-01", modulo: 8,
      titulo: "Protección fuera de hora",
      relato: "Don Aurelio Pinto quiere recurrir de protección contra el decreto que le clausuró el local. Lo notificaron hace 45 días; él «estuvo ocupado». Te pide que firmes el escrito como su abogado.",
      documento: { tipo: "Borrador de recurso de protección", campos: [ { k: "Contra", v: "Decreto alcaldicio de clausura" }, { k: "Derecho invocado", v: "Art. 19 N.º 21 (libertad económica)" }, { k: "Notificado hace", v: "45 días corridos" }, { k: "Tribunal", v: "Corte de Apelaciones" }, { k: "Pide", v: "Dejar sin efecto la clausura" } ] },
      pregunta: "¿Qué sello le pones al borrador?",
      sellos: [
        { texto: "PRESENTAR: la Constitución no fija plazo", correcto: false, porque: "La Constitución no lo fija, pero el Auto Acordado de la Corte Suprema establece 30 días corridos; a los 45 está vencido." },
        { texto: "EXTEMPORÁNEO: 30 días corridos; evaluar otras acciones", correcto: true, porque: "El plazo del recurso de protección es de 30 días corridos según el Auto Acordado de la Corte Suprema. Quedan otras vías: la reclamación de ilegalidad municipal si aún hay plazo (art. 151 Ley 18.695) o la acción de nulidad de derecho público (arts. 7 y 38 inc. 2 CPR)." },
        { texto: "PRESENTAR COMO RECLAMO DE ILEGALIDAD ANTE LA CORTE", correcto: false, porque: "El reclamo de ilegalidad se presenta primero ante el alcalde (art. 151 Ley 18.695), no directamente ante la Corte." },
        { texto: "PRESENTAR: el plazo es de 30 días hábiles", correcto: false, porque: "Son días corridos, según el Auto Acordado de la Corte Suprema." },
      ],
      norma: "Art. 20 CPR; Auto Acordado de la Corte Suprema", fuente: "nuevo", hallazgo: "m08-proteccion",
    },
    {
      id: "m08-e-02", modulo: 8,
      titulo: "Directo a la Corte",
      relato: "La junta de vecinos reclama por ilegalidad contra un decreto que cerró una calle para una feria privada. Lo presentaron directamente en la Corte de Apelaciones, al día 10 desde la publicación. La Alcaldesa pregunta si debe contestar.",
      documento: { tipo: "Reclamo de ilegalidad", campos: [ { k: "Contra", v: "Decreto alcaldicio que cierra calle para feria privada" }, { k: "Reclamante", v: "Junta de vecinos (interés general de la comuna)" }, { k: "Presentado ante", v: "Corte de Apelaciones" }, { k: "Día", v: "10 desde la publicación" }, { k: "Reclamo previo ante el alcalde", v: "No" } ] },
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "BIEN PRESENTADO: la Corte conoce el reclamo", correcto: false, porque: "La Corte conoce sólo después del rechazo del reclamo por el alcalde, expreso o ficto (art. 151 letra d) Ley 18.695)." },
        { texto: "PRIMERO ANTE EL ALCALDE: 30 días desde la publicación", correcto: true, porque: "Cualquier particular puede reclamar ante el alcalde contra resoluciones que afecten el interés general de la comuna, dentro de 30 días desde la publicación (art. 151 letra a) Ley 18.695). Rechazado ahí, recién se va a la Corte en 15 días (letra d). Aún están en plazo para reclamar ante la Alcaldesa." },
        { texto: "INADMISIBLE: una junta de vecinos no puede reclamar", correcto: false, porque: "Cualquier particular puede reclamar cuando el acto afecta el interés general de la comuna (art. 151 letra a) Ley 18.695)." },
      ],
      norma: "Art. 151 Ley 18.695", fuente: "nuevo", hallazgo: "m08-reclamo-ilegalidad",
    },
    {
      id: "m08-e-03", modulo: 8,
      titulo: "Dos puertas a la vez",
      relato: "La señora Marta Quilodrán presentó reposición contra el decreto que le negó la patente y, tres días después, demandó lo mismo en el juzgado civil. La Alcaldesa pregunta si debe resolver la reposición.",
      documento: { tipo: "Expediente de reposición", campos: [ { k: "Recurso", v: "Reposición contra decreto que deniega patente" }, { k: "Presentado", v: "Día 3 desde la notificación" }, { k: "Demanda civil", v: "Misma pretensión, presentada tres días después" }, { k: "Estado de la reposición", v: "Pendiente, dentro de los 30 días para resolver" } ] },
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "RESOLVER LA REPOSICIÓN: son vías independientes", correcto: false, porque: "Deducida acción jurisdiccional, la Administración debe inhibirse de conocer cualquier reclamación sobre la misma pretensión (art. 54 inc. 3 Ley 19.880)." },
        { texto: "INHIBIRSE: hay acción judicial sobre la misma pretensión", correcto: true, porque: "Art. 54 Ley 19.880: la reclamante no podía demandar lo mismo mientras la reposición estuviera pendiente (inc. 1), y deducida la acción judicial la Administración debe inhibirse de conocer la reclamación sobre la misma pretensión (inc. 3). La objeción procesal a la demanda prematura se plantea en el juicio." },
        { texto: "RECHAZAR LA REPOSICIÓN COMO SANCIÓN", correcto: false, porque: "No hay sanción: la regla es la inhibición de la Administración (art. 54 inc. 3 Ley 19.880)." },
      ],
      norma: "Art. 54 Ley 19.880", fuente: "proceadmin", hallazgo: "m08-via-no-obligatoria",
    },
    {
      id: "m08-e-04", modulo: 8,
      titulo: "El decreto de hace cinco años",
      relato: "Un vecino descubre que en 2021 un decreto alcaldicio, firmado por un funcionario sin facultades, le canceló un permiso de ocupación de bien nacional de uso público. Quiere anularlo. Ya no hay plazo de protección, ni de reclamo de ilegalidad, ni de invalidación.",
      documento: { tipo: "Consulta de la Alcaldesa", campos: [ { k: "Acto", v: "Decreto de 2021 que cancela permiso" }, { k: "Vicio", v: "Firmado por funcionario sin competencia" }, { k: "Notificado hace", v: "5 años" }, { k: "Plazos vencidos", v: "Protección (30 días), reclamo de ilegalidad (30 + 15), invalidación (2 años)" }, { k: "Pregunta", v: "¿Qué acción queda?" } ] },
      pregunta: "¿Qué acción le indicas?",
      sellos: [
        { texto: "RECURSO DE REVISIÓN", correcto: false, porque: "La incompetencia no es causal del art. 60 Ley 19.880 y el año ya pasó." },
        { texto: "NULIDAD DE DERECHO PÚBLICO, en juicio ordinario", correcto: true, porque: "Un acto dictado fuera de la competencia es nulo (art. 7 CPR) y cualquier persona lesionada puede reclamar ante los tribunales que determine la ley (art. 38 inc. 2 CPR); sin procedimiento especial, se tramita como juicio ordinario ante el juez civil (doctrina). La prescripción de las acciones patrimoniales es discusión aparte." },
        { texto: "RECURSO DE PROTECCIÓN", correcto: false, porque: "El plazo de 30 días corridos venció hace años (Auto Acordado de la Corte Suprema)." },
        { texto: "RECLAMO ANTE CONTRALORÍA", correcto: false, porque: "La Contraloría puede fiscalizar y dictaminar, pero no anula actos ni conoce asuntos litigiosos (art. 6 Ley 10.336)." },
      ],
      norma: "Arts. 7 y 38 inc. 2 CPR", fuente: "nuevo", hallazgo: "m08-nulidad-dp",
    },
    {
      id: "m08-e-05", modulo: 8,
      titulo: "Reclamo en regla",
      relato: "El Secretario Municipal te pasa un reclamo de ilegalidad presentado ante la Alcaldesa por un comerciante agraviado: identifica el decreto, la norma infringida, cómo se infringió y el perjuicio. Llegó al día 20 desde la notificación.",
      documento: { tipo: "Reclamo de ilegalidad ante el alcalde", campos: [ { k: "Reclamante", v: "Comerciante agraviado por la resolución" }, { k: "Contra", v: "Decreto alcaldicio que caduca permiso de kiosco" }, { k: "Presentado", v: "Día 20 desde la notificación administrativa" }, { k: "Contenido", v: "Acto, norma infringida, forma de la infracción y perjuicio" }, { k: "Pide", v: "Dejar sin efecto el decreto" } ] },
      pregunta: "¿Qué sello corresponde?",
      sellos: [
        { texto: "VÁLIDO: tramitar y resolver en 15 días", correcto: true, porque: "El agraviado puede reclamar ante el alcalde dentro de 30 días desde la notificación (art. 151 letra b) Ley 18.695) y el escrito trae lo que exige la letra d). Si la Alcaldesa no se pronuncia en 15 días, se entiende rechazado y se abre la vía ante la Corte." },
        { texto: "EXTEMPORÁNEO: el plazo era de 15 días", correcto: false, porque: "Ante el alcalde el plazo es de 30 días; los 15 son para que el alcalde resuelva y luego para ir a la Corte (art. 151 Ley 18.695)." },
        { texto: "REMITIR A LA CORTE DE APELACIONES", correcto: false, porque: "La Corte conoce sólo después del rechazo del alcalde (art. 151 letra d) Ley 18.695)." },
        { texto: "INADMISIBLE: debió presentar reposición", correcto: false, porque: "El reclamo de ilegalidad es una vía propia del art. 151 Ley 18.695; no exige reposición previa." },
      ],
      norma: "Art. 151 Ley 18.695", fuente: "nuevo", hallazgo: "m08-reclamo-ilegalidad",
    },
    {
      id: "m08-e-06", modulo: 8,
      titulo: "La licitación perdida",
      relato: "Constructora Columna Ltda. perdió una licitación municipal y sostiene que la adjudicación fue arbitraria. Su abogado pregunta por el pasillo si «va por protección o por reclamo de ilegalidad». Supo de la adjudicación hace cuatro días hábiles.",
      documento: { tipo: "Consulta", campos: [ { k: "Acto", v: "Resolución de adjudicación de licitación pública municipal" }, { k: "Reclamo", v: "Adjudicación arbitraria durante el procedimiento de contratación" }, { k: "Conocido hace", v: "4 días hábiles" }, { k: "Pretensión", v: "Impugnar la adjudicación" } ] },
      pregunta: "¿Qué vía le indicas?",
      sellos: [
        { texto: "TRIBUNAL DE CONTRATACIÓN PÚBLICA: demanda en 10 días hábiles", correcto: true, porque: "El Tribunal de Contratación Pública conoce la acción de impugnación contra actos u omisiones ilegales o arbitrarios ocurridos en los procedimientos de contratación con organismos del Estado (art. 24 N.º 1 Ley 19.886); la demanda se deduce en el plazo fatal de diez días hábiles desde que se conoció o debió conocer la ilegalidad (art. 24 ter)." },
        { texto: "JUZGADO DE POLICÍA LOCAL", correcto: false, porque: "El JPL aplica multas de ordenanzas (art. 12 Ley 18.695); no conoce impugnaciones de licitaciones." },
        { texto: "RECLAMO DE ILEGALIDAD, SIN APURO: hay 30 días", correcto: false, porque: "Existe un tribunal especial con competencia expresa (art. 24 Ley 19.886) y su plazo es de diez días hábiles (art. 24 ter), no de 30." },
        { texto: "DEMANDAR LOS PERJUICIOS EN EL MISMO TRIBUNAL", correcto: false, porque: "El Tribunal de Contratación Pública no conoce acciones indemnizatorias de ningún tipo (art. 24 Ley 19.886)." },
      ],
      norma: "Arts. 24 y 24 ter Ley 19.886", fuente: "nuevo", hallazgo: "m08-tribunales-especiales",
    },
  ],
};

// PENDIENTE DE REVISIÓN: el plazo de 30 días corridos del recurso de protección se
// cita por el Auto Acordado de la Corte Suprema sobre tramitación y fallo del
// recurso de protección, sin número ni fecha (no está en los XML bajados).
// PENDIENTE DE REVISIÓN: que la acción de nulidad de derecho público se tramite en
// juicio ordinario ante el juez civil y que no tenga plazo especial es doctrina y
// jurisprudencia (sin rol en los apuntes), no texto legal; la prescripción de las
// acciones patrimoniales derivadas se deja fuera.
// PENDIENTE DE REVISIÓN: los Tribunales Ambientales (Ley 20.600) y los Tribunales
// Tributarios y Aduaneros (Ley 20.322) se mencionan sólo por nombre; sus leyes no
// están en los XML bajados.
// PENDIENTE DE REVISIÓN: en m08-e-01 se sugiere la reclamación de ilegalidad «si aún
// hay plazo» frente a una clausura; la procedencia del art. 151 contra ese acto en
// concreto y su relación con la protección no se afirma, sólo se enumera.
// Nota: m08-e-06 asume que la licitación municipal se rige por la Ley 19.886;
// verificado: su art. 1 inc. 2 la aplica a los organismos del art. 1 inc. 2 de la
// Ley 18.575, que incluye a las municipalidades.
