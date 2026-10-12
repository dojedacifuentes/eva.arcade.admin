// Los guiones de las doce jornadas: quién te llama, adónde vas y qué se dice.
// El Derecho no está aquí (está en el banco de cada módulo): aquí está la
// historia de Potestas, corta, con humor, y con el problema que la jornada
// resuelve. Las líneas son breves a propósito: el juego se juega, no se lee.
import type { Guion } from "./motor";
import { ALCALDESA, DIRECTOR, PARTES, OBRAS, FISCAL, CONTRALOR, JUEZA, MINISTRA, MINISTRO_TC, CDE, ROSA, VECINO, JOVEN, ABOGADA } from "../content/personajes";

export const GUIONES: Guion[] = [
  // ── 1 · El primer día ───────────────────────────────────────────────────
  {
    n: 1,
    encargo: {
      lugar: "municipalidad", objetivo: "Primer día: preséntate ante la Alcaldesa", quien: ALCALDESA, punto: "alcaldesa",
      extras: [{ p: DIRECTOR, punto: "director", dir: "izquierda" }],
      dichos: [
        ["alcaldesa", "¡Por fin! La abogada nueva. O el abogado. Da igual: hay trabajo."],
        ["alcaldesa", "Quiero cobrar un impuesto a las bicicletas, cerrar la feria y multar a los perros que ladran. Hoy."],
        ["director", "Alcaldesa… antes de firmar, que lo revise Jurídica."],
        ["yo", "¿Y quién dice que la Municipalidad puede hacer todo eso?"],
        ["alcaldesa", "Yo. Soy la Alcaldesa."],
      ],
      eva: ["Primera regla de Potestas: una persona puede hacer todo lo que la ley no le prohíbe. El Estado, solo lo que la ley le permite.", "La Alcaldesa todavía no se entera. Tú sí."],
    },
    apuesta: "Antes de revisar la pila, una apuesta:",
    mesa: {
      lugar: "juridica", punto: "escritorio", objetivo: "Ve a la Dirección Jurídica: tu escritorio te espera",
      con: { p: DIRECTOR, punto: "director" },
      dichos: [["director", "Tu escritorio. La pila de la izquierda es «urgente»; la de la derecha, «muy urgente»."], ["director", "Timbra con cuidado: cada decreto que dejas pasar lo firma la Alcaldesa."]],
    },
    terreno: {
      lugar: "ciudad", objetivo: "Sal a la plaza: un vecino reclama", quien: VECINO, punto: "vecino-1", juego: "columnas",
      dichos: [
        ["vecino", "¿Usted es de la Municipalidad? ¿Por qué el Servicio de Salud no me contesta y el municipio sí?"],
        ["yo", "Porque no son el mismo: unos dependen del Presidente y otros tienen su propia personalidad jurídica."],
        ["vecino", "Ah. ¿Y eso en castellano?"],
        ["eva", "Ordenemos el Estado en dos cajas. Rápido, que don Lucho se aburre."],
      ],
      despues: [["vecino", "Ahora entiendo por qué me mandan de una ventanilla a otra. Gracias, mijo."]],
    },
    jefe: {
      lugar: "municipalidad", objetivo: "Vuelve donde la Alcaldesa: defiende tu informe", quien: ALCALDESA, punto: "alcaldesa", tipo: "duelo",
      extras: [{ p: DIRECTOR, punto: "director", dir: "izquierda" }],
      dichos: [["alcaldesa", "¿Me está diciendo que no puedo? Convénzame. Tiene cinco preguntas."]],
      despues: [["alcaldesa", "Está bien. Nada de impuesto a las bicicletas. Pero la feria la vemos el lunes."], ["director", "Eso, abogada, se llama sobrevivir al primer día."]],
    },
    cierre: ["El poder público no se presume: se lee en la ley. Hoy aprendiste a buscarla antes de firmar.", "Mañana, la fábrica de decretos."],
  },
  // ── 2 · La fábrica de actos ─────────────────────────────────────────────
  {
    n: 2,
    encargo: {
      lugar: "partes", objetivo: "La Oficina de Partes te necesita", quien: PARTES, punto: "marisol",
      extras: [{ p: JOVEN, punto: "vecino", dir: "derecha" }],
      dichos: [
        ["partes", "Llegaron treinta decretos alcaldicios. Uno lo firmó el Director de Tránsito «por mientras»."],
        ["joven", "Y a mí me rechazaron la patente con una palabra: «Rechácese». ¿Eso es legal?"],
        ["yo", "Un acto administrativo tiene que tener quién lo dicta, por qué y para qué. Revisemos."],
      ],
      eva: ["Un decreto es como un pastel: si le falta un ingrediente, no es pastel. Es una masa con timbre."],
    },
    apuesta: "Mientras Marisol ordena la pila:",
    mesa: {
      lugar: "partes", punto: "mesa", objetivo: "Siéntate en la Mesa de Partes", con: { p: PARTES, punto: "marisol" },
      dichos: [["partes", "Lee cada uno como si lo fueras a firmar tú. Órgano, investidura, competencia, motivo, objeto, fin, forma."]],
    },
    terreno: {
      lugar: "atencion", objetivo: "Ve a Atención Ciudadana: hay un decreto que explicar", quien: JOVEN, punto: "vecino", juego: "columnas",
      dichos: [["joven", "Me notificaron otro decreto. Este me da un permiso, pero me cobra un derecho. ¿Me favorece o me perjudica?"], ["eva", "Clasificar actos es como ordenar el refrigerador: según para qué sirve cada cosa."]],
      despues: [["joven", "O sea que el «Rechácese» sin motivo lo puedo pelear. Vuelvo mañana con un recurso."]],
    },
    jefe: {
      lugar: "juridica", objetivo: "Don Aurelio quiere tomarte la lección", quien: DIRECTOR, punto: "director", tipo: "comision",
      dichos: [["director", "Antes de que firmes nada más, una pregunta de examen. Como en la universidad, pero con sueldo."]],
      despues: [["director", "Bien. Ahora sí te dejo firmar visaciones. Pocas."]],
    },
    cierre: ["Un acto nace con presunción de legalidad. Que nazca presumido no lo hace sano.", "Mañana lo abrimos para ver qué tiene adentro."],
  },
  // ── 3 · La autopsia ─────────────────────────────────────────────────────
  {
    n: 3,
    encargo: {
      lugar: "municipalidad", objetivo: "La Alcaldesa quiere «borrar» un permiso", quien: ALCALDESA, punto: "alcaldesa",
      extras: [{ p: OBRAS, punto: "director", dir: "izquierda" }],
      dichos: [
        ["alcaldesa", "Hace tres años dimos un permiso para una bodega. Ahora ahí quiero un parque. Bórrelo."],
        ["obras", "El permiso está bien dado, Alcaldesa. Lo firmé yo."],
        ["yo", "Si está bien dado no se invalida. Y si se revoca, hay límites. Déjenme revisar."],
      ],
      eva: ["Invalidar es corregir un error. Revocar es cambiar de opinión. La ley trata muy distinto a los dos."],
    },
    apuesta: "Una apuesta antes de abrir el expediente:",
    mesa: {
      lugar: "juridica", punto: "escritorio", objetivo: "Vuelve a tu escritorio: hay autopsias pendientes", con: { p: DIRECTOR, punto: "director" },
      dichos: [["director", "Seis actos con problemas. O sin ellos: no todo lo que molesta es ilegal."]],
    },
    terreno: {
      lugar: "fiscalizacion", objetivo: "Fiscalización tiene un acto «retroactivo»", quien: FISCAL, punto: "inspectora", juego: "cadena",
      dichos: [["fiscal", "Quiero invalidar una patente que dimos mal. ¿Cómo lo hago sin que me la anulen después?"], ["yo", "Paso a paso, y con audiencia del interesado. Ordenémoslo."]],
      despues: [["fiscal", "Audiencia, dos años, decisión fundada. Lo anoto en la pizarra."]],
    },
    jefe: {
      lugar: "municipalidad", objetivo: "Defiende tu informe ante la Alcaldesa", quien: ALCALDESA, punto: "alcaldesa", tipo: "duelo",
      extras: [{ p: OBRAS, punto: "director", dir: "izquierda" }],
      dichos: [["alcaldesa", "¿Por qué no puedo borrar el permiso? Explíquemelo, que yo pago su sueldo. Bueno, los vecinos."]],
      despues: [["alcaldesa", "Entonces el parque va en otra parte. Pero que conste que me gusta el parque."], ["obras", "Y a mí que no me invaliden lo bien hecho."]],
    },
    cierre: ["Un vicio no siempre mata un acto: hay que ver si es esencial y si perjudica.", "Mañana: la fila de la Municipalidad, que también tiene reglas."],
  },
  // ── 4 · La fila ─────────────────────────────────────────────────────────
  {
    n: 4,
    encargo: {
      lugar: "atencion", objetivo: "Atención Ciudadana colapsó: ve a ayudar", quien: ROSA, punto: "vecino",
      extras: [{ p: VECINO, punto: "fila-1", dir: "arriba" }, { p: JOVEN, punto: "fila-2", dir: "arriba" }],
      dichos: [
        ["rosa", "Llevo dos horas en la fila y me piden un papel notarial para pedir… un papel."],
        ["vecino", "Y a mí me dijeron que el trámite lo tengo que empujar yo."],
        ["yo", "El procedimiento tiene principios. Uno de ellos: no pedir formalismos inútiles."],
      ],
      eva: ["La Ley 19.880 es la fila bien hecha: con orden, con plazos y sin pedirte la partida de nacimiento de tu abuela."],
    },
    apuesta: "Mientras avanza la fila:",
    mesa: {
      lugar: "atencion", punto: "jugador", objetivo: "Toma la ventanilla libre", con: { p: { ...PARTES, nombre: "Marisol" }, punto: "funcionaria" },
      dichos: [["partes", "Te presto la ventanilla. Los expedientes de hoy vienen con sorpresa."]],
    },
    terreno: {
      lugar: "partes", objetivo: "Oficina de Partes: ordena un procedimiento completo", quien: PARTES, punto: "marisol", juego: "cadena",
      dichos: [["partes", "Llegó una solicitud de permiso. Ayúdame a ordenar todo lo que viene después, de principio a fin."]],
      despues: [["partes", "Iniciación, instrucción, finalización. Lo voy a pegar en la pared."]],
    },
    jefe: {
      lugar: "juridica", objetivo: "Don Aurelio tiene una pregunta oral", quien: DIRECTOR, punto: "director", tipo: "comision",
      dichos: [["director", "La pregunta favorita de la Contraloría. Si la respondes bien, te invito un café de máquina."]],
      despues: [["director", "Café de máquina ganado. No es un premio, es una advertencia."]],
    },
    cierre: ["Un procedimiento es la forma en que el Estado decide sin atropellar. La fila también es un derecho.", "Mañana: el reloj."],
  },
  // ── 5 · El reloj ────────────────────────────────────────────────────────
  {
    n: 5,
    encargo: {
      lugar: "partes", objetivo: "Una vecina pregunta por su solicitud", quien: ROSA, punto: "vecino",
      extras: [{ p: PARTES, punto: "marisol" }],
      dichos: [
        ["rosa", "Pedí un permiso hace meses y nadie me contesta. ¿El silencio significa que sí?"],
        ["partes", "Depende. Y depende de muchas cosas."],
        ["yo", "Hay un camino para que el silencio hable. Pero tiene pasos y plazos."],
      ],
      eva: ["Los plazos de la Ley 19.880 se cuentan en días hábiles. El sábado no existe para la Administración. Ni para mí, pero por otras razones."],
    },
    apuesta: "Marisol mira el calendario:",
    mesa: {
      lugar: "partes", punto: "mesa", objetivo: "La Mesa de Partes: plazos y notificaciones", con: { p: PARTES, punto: "marisol" },
      dichos: [["partes", "Fíjate en las fechas. Aquí todo se gana o se pierde por un día."]],
    },
    terreno: {
      lugar: "atencion", objetivo: "Atención Ciudadana: arma la ruta del silencio", quien: ROSA, punto: "vecino", juego: "cadena",
      extras: [{ p: PARTES, punto: "funcionaria" }],
      dichos: [["rosa", "Entonces, ¿qué hago para que mi silencio sea un sí?"], ["eva", "Ordena los pasos. Si te saltas uno, el silencio sigue siendo silencio."]],
      despues: [["rosa", "Denuncia, cinco días, certificado. Lo voy a anotar en el refrigerador."]],
    },
    jefe: {
      lugar: "juridica", objetivo: "Una abogada reclama un plazo vencido", quien: ABOGADA, punto: "colega", tipo: "duelo",
      extras: [{ p: DIRECTOR, punto: "director" }],
      dichos: [["abogada", "Mi cliente presentó su recurso a tiempo. Ustedes lo rechazaron por extemporáneo. Defiéndase."]],
      despues: [["abogada", "Bien contados los días. Esta vez."], ["director", "Los plazos son la mitad del Derecho Administrativo. La otra mitad también."]],
    },
    cierre: ["Notificar bien es la mitad de decidir bien. Sin notificación, el acto no le corre a nadie.", "Mañana: las multas."],
  },
  // ── 6 · La multa ────────────────────────────────────────────────────────
  {
    n: 6,
    encargo: {
      lugar: "fiscalizacion", objetivo: "Fiscalización quiere clausurar un local", quien: FISCAL, punto: "inspectora",
      extras: [{ p: JOVEN, punto: "multado", dir: "izquierda" }],
      dichos: [
        ["fiscal", "Tres denuncias por ruido. Clausuro el local hoy mismo y le pongo dos multas, por si una es poca."],
        ["joven", "¡Ni siquiera me dejaron explicar!"],
        ["yo", "Sancionar es castigar, y castigar tiene reglas: ley previa, cargos, descargos y proporción."],
      ],
      eva: ["La potestad sancionadora se parece al Derecho Penal: con matices, pero con las mismas garantías de fondo."],
    },
    apuesta: "Antes de leer el sumario:",
    mesa: {
      lugar: "fiscalizacion", punto: "jugador", objetivo: "Revisa las actas de Fiscalización", con: { p: FISCAL, punto: "inspectora" },
      dichos: [["fiscal", "Estas son las multas del mes. Dime cuáles se caen antes de que se caigan solas."]],
    },
    terreno: {
      lugar: "ciudad", objetivo: "En la plaza, un comerciante pregunta", quien: VECINO, punto: "vecino-2", juego: "columnas",
      dichos: [["vecino", "Me retiraron la mercadería de la vereda. ¿Eso es una multa o qué es?"], ["eva", "No todo lo que molesta es sanción. Sepáralas."]],
      despues: [["vecino", "Así que retirar el puesto no es castigo: es poner orden. Igual me molesta."]],
    },
    jefe: {
      lugar: "fiscalizacion", objetivo: "Audiencia de descargos", quien: ABOGADA, punto: "multado", tipo: "duelo",
      extras: [{ p: FISCAL, punto: "inspectora" }],
      dichos: [["abogada", "Represento al dueño del local. Vengo a que la multa se caiga. Prepárese."]],
      despues: [["fiscal", "Una sola sanción, bien fundada. Ya entendí."], ["abogada", "Mi cliente pagará la que corresponde. Una."]],
    },
    cierre: ["Una vez por hecho, con cargos claros y a tiempo: así se castiga en un Estado de Derecho.", "Mañana vamos a Contraloría."],
  },
  // ── 7 · Contraloría ─────────────────────────────────────────────────────
  {
    n: 7,
    encargo: {
      lugar: "municipalidad", objetivo: "Llegó un oficio de la Contraloría", quien: ALCALDESA, punto: "alcaldesa",
      dichos: [
        ["alcaldesa", "La Contraloría me manda un oficio. Lo voy a guardar en el cajón de las cosas que no leo."],
        ["yo", "Alcaldesa, sus dictámenes obligan a la Municipalidad. Ese cajón no existe para la Contraloría."],
      ],
      eva: ["La Contraloría controla la legalidad de los actos de la Administración. Tiene memoria de elefante y paciencia de tortuga."],
    },
    apuesta: "Mientras la Alcaldesa abre el cajón:",
    mesa: {
      lugar: "juridica", punto: "escritorio", objetivo: "En tu escritorio: recursos y oficios", con: { p: DIRECTOR, punto: "director" },
      dichos: [["director", "Reposiciones, jerárquicos, una revisión y un oficio. Lo de siempre un martes."]],
    },
    terreno: {
      lugar: "partes", objetivo: "Un vecino quiere reclamar contra la Alcaldesa", quien: VECINO, punto: "vecino", juego: "cadena",
      extras: [{ p: PARTES, punto: "marisol" }],
      dichos: [["vecino", "Me negaron la patente. Quiero pedir que lo revisen. ¿Ante quién y en cuánto tiempo?"], ["eva", "Arma el viaje del recurso, de la notificación a la respuesta."]],
      despues: [["vecino", "Cinco días. Ni uno más. Lo presento mañana temprano."]],
    },
    jefe: {
      lugar: "contraloria", objetivo: "La Contraloría Regional te cita", quien: CONTRALOR, punto: "contralor", tipo: "comision",
      dichos: [["contralor", "Abogada de Potestas. Siéntese. Le haré una pregunta. Le recomiendo responderla bien."]],
      despues: [["contralor", "Correcto. Dígale a su Alcaldesa que el cajón se abre."]],
    },
    cierre: ["Contra el acto que te perjudica hay recursos: reposición, jerárquico y, por excepción, revisión. Y sobre todos, la Contraloría.", "Mañana: los tribunales."],
  },
  // ── 8 · Tribunales ──────────────────────────────────────────────────────
  {
    n: 8,
    encargo: {
      lugar: "ciudad", objetivo: "Doña Rosa te busca en la plaza", quien: ROSA, punto: "vecino-3",
      dichos: [
        ["rosa", "La Municipalidad me cerró el negocio de costura con un decreto. ¿A qué tribunal voy?"],
        ["yo", "Hay más de una puerta: protección, reclamación de ilegalidad municipal, nulidad. Cada una con su plazo."],
      ],
      eva: ["Elegir la acción es la mitad del juicio. La otra mitad es no llegar tarde."],
    },
    apuesta: "Una apuesta mientras doña Rosa busca el decreto en su cartera:",
    mesa: {
      lugar: "juridica", punto: "escritorio", objetivo: "En tu escritorio: elige la acción correcta", con: { p: DIRECTOR, punto: "director" },
      dichos: [["director", "Cada vecino quiere demandar. Tu trabajo: decirles por dónde y cuándo."]],
    },
    terreno: {
      lugar: "ciudad", objetivo: "En la plaza: el camino de un reclamo", quien: ROSA, punto: "vecino-3", juego: "cadena",
      dichos: [["rosa", "Entonces, ¿primero la Alcaldesa y después la Corte? Ordénemelo, mijita."]],
      despues: [["rosa", "Primero el alcalde, después la Corte. Como en la vida: primero se conversa."]],
    },
    jefe: {
      lugar: "corte", objetivo: "Alegato en la Corte de Apelaciones", quien: ABOGADA, punto: "rival", tipo: "duelo",
      juez: { p: MINISTRA, punto: "ministra" },
      dichos: [["ministra", "Tiene la palabra la abogada de la Municipalidad. Breve, por favor."], ["abogada", "La Municipalidad actuó fuera de la ley. Voy a demostrarlo."]],
      despues: [["ministra", "Se tiene presente. La Corte resolverá."], ["abogada", "Buen alegato. Nos vemos en la próxima."]],
    },
    cierre: ["Cuando la Administración no escucha, un juez sí. Pero hay que tocar la puerta correcta, a tiempo.", "Mañana: alguien se cayó en un hoyo."],
  },
  // ── 9 · El hoyo en la vereda ────────────────────────────────────────────
  {
    n: 9,
    encargo: {
      lugar: "ciudad", objetivo: "Hubo un accidente en la calle de los tribunales", quien: VECINO, punto: "hoyo",
      extras: [{ p: OBRAS, punto: "vecino-4" }],
      dichos: [
        ["vecino", "¡Me caí en este hoyo! Tres meses lleva abierto. Me quebré la muñeca."],
        ["obras", "El hoyo estaba en la lista. En el lugar ciento catorce."],
        ["yo", "Si el servicio no funcionó como debía y eso causó el daño, la Municipalidad responde."],
      ],
      eva: ["La falta de servicio: el Estado no responde por todo lo malo que pasa, sino cuando el servicio funcionó mal, tarde o no funcionó."],
    },
    apuesta: "Mientras don Lucho se sacude el polvo:",
    mesa: {
      lugar: "juridica", punto: "escritorio", objetivo: "En tu escritorio: demandas contra la Municipalidad", con: { p: DIRECTOR, punto: "director" },
      dichos: [["director", "Cinco demandas y un camión de la basura. Dime cuáles perdemos."]],
    },
    terreno: {
      lugar: "ciudad", objetivo: "Junto al hoyo: ¿Código Civil o falta de servicio?", quien: OBRAS, punto: "vecino-4", juego: "columnas",
      dichos: [["obras", "¿Y por qué no nos demandan como a cualquier vecino, con el Código Civil?"], ["eva", "Separa lo que es responsabilidad del Estado de lo que es responsabilidad civil común."]],
      despues: [["obras", "Mañana tapamos el hoyo. Hoy mismo, mejor."]],
    },
    jefe: {
      lugar: "juzgado", objetivo: "Audiencia en el Juzgado Civil", quien: ABOGADA, punto: "rival", tipo: "duelo",
      juez: { p: JUEZA, punto: "jueza" },
      extras: [{ p: VECINO, punto: "vecino" }],
      dichos: [["jueza", "Causa por indemnización de perjuicios contra la Municipalidad de Potestas. Comiencen."], ["abogada", "Mi cliente cayó por un hoyo que todos conocían. Eso es falta de servicio."]],
      despues: [["jueza", "Resolveré conforme a derecho. Se levanta la audiencia."], ["vecino", "Al menos ya taparon el hoyo."]],
    },
    cierre: ["El Estado también paga: no por ser Estado, sino cuando el servicio falla y eso causa daño.", "Mañana: algo que es nulo de pleno derecho."],
  },
  // ── 10 · Nulo de pleno derecho ──────────────────────────────────────────
  {
    n: 10,
    encargo: {
      lugar: "municipalidad", objetivo: "La Alcaldesa encontró un decreto viejo", quien: ALCALDESA, punto: "alcaldesa",
      extras: [{ p: DIRECTOR, punto: "director", dir: "izquierda" }],
      dichos: [
        ["alcaldesa", "Este decreto lo firmó alguien que ni siquiera era director. Hace cinco años. ¡Que se anule ya!"],
        ["director", "Ya pasó el plazo para invalidar, Alcaldesa."],
        ["yo", "Invalidar lo hace la Administración, con plazo. Anular por nulidad de derecho público lo hace un juez."],
      ],
      eva: ["Un acto contrario a la Constitución es nulo. Pero hasta que alguien lo declare, sigue ahí, muy tranquilo, produciendo efectos."],
    },
    apuesta: "Antes de abrir el archivo de hace cinco años:",
    mesa: {
      lugar: "juridica", punto: "escritorio", objetivo: "En tu escritorio: ¿invalidar, revocar o demandar?", con: { p: DIRECTOR, punto: "director" },
      dichos: [["director", "Cada acto con su remedio. Y cada remedio con su plazo."]],
    },
    terreno: {
      lugar: "contraloria", objetivo: "La Contraloría pregunta por una invalidación", quien: CONTRALOR, punto: "contralor", juego: "cadena",
      dichos: [["contralor", "Si la Municipalidad quiere invalidar, que lo haga bien. Muéstreme el camino."]],
      despues: [["contralor", "Con audiencia y dentro de plazo. Así me gusta."]],
    },
    jefe: {
      lugar: "corte", objetivo: "La Corte revisa una nulidad de derecho público", quien: ABOGADA, punto: "rival", tipo: "duelo",
      juez: { p: MINISTRA, punto: "ministra" },
      dichos: [["abogada", "Pido que se declare la nulidad de derecho público del decreto. Y que la Municipalidad pague."], ["ministra", "Escuchemos a la Municipalidad."]],
      despues: [["ministra", "La Corte tiene presentes ambas posiciones."], ["abogada", "La nulidad no prescribe. La plata sí: eso me lo enseñó usted."]],
    },
    cierre: ["Invalidar es corregirse a uno mismo, dentro de plazo. La nulidad de derecho público la declara un juez.", "Mañana: el Tribunal Constitucional."],
  },
  // ── 11 · El Tribunal Constitucional ─────────────────────────────────────
  {
    n: 11,
    encargo: {
      lugar: "juridica", objetivo: "Don Aurelio tiene un juicio difícil", quien: DIRECTOR, punto: "director",
      dichos: [
        ["director", "En un juicio contra la Municipalidad nos quieren aplicar una ley que creo inconstitucional."],
        ["yo", "Entonces el camino es el Tribunal Constitucional. La inaplicabilidad, si hay gestión pendiente."],
      ],
      eva: ["Hasta la ley tiene un juez. Se llama Tribunal Constitucional, y no revisa si la ley es buena: revisa si es constitucional."],
    },
    apuesta: "Mientras don Aurelio busca la Constitución en el estante:",
    mesa: {
      lugar: "juridica", punto: "escritorio", objetivo: "Revisa los requerimientos antes de presentarlos", con: { p: DIRECTOR, punto: "director" },
      dichos: [["director", "Antes de ir al TC, mira bien: si falta algo, ni lo admiten."]],
    },
    terreno: {
      lugar: "ciudad", objetivo: "Un vecino quiere ir al TC", quien: JOVEN, punto: "vecino-2", juego: "columnas",
      dichos: [["joven", "Quiero que el TC elimine la ordenanza de los carritos. ¿Inaplicabilidad o inconstitucionalidad?"], ["eva", "Separa los efectos: para un caso o para todos."]],
      despues: [["joven", "Ah, y las ordenanzas no van al TC. Bueno, lo intentaré por otro lado."]],
    },
    jefe: {
      lugar: "tc", objetivo: "Alegato ante el Tribunal Constitucional", quien: MINISTRO_TC, punto: "ministro", tipo: "comision",
      dichos: [["ministro-tc", "Abogada, antes de los alegatos, el Tribunal tiene una pregunta."]],
      despues: [["ministro-tc", "El Tribunal toma nota. Se levanta la sesión."]],
    },
    cierre: ["La Constitución manda sobre todo, y el Tribunal Constitucional es quien la cuida frente a la ley.", "Mañana, la última jornada: la franja."],
  },
  // ── 12 · La franja ──────────────────────────────────────────────────────
  {
    n: 12,
    encargo: {
      lugar: "casa-rosa", objetivo: "Doña Rosa recibió una carta y te llama", quien: ROSA, punto: "rosa",
      dichos: [
        ["rosa", "Me llegó una carta: la avenida nueva pasa por mi living. ¿Me pueden quitar la casa?"],
        ["yo", "Pueden expropiarla, pero solo con una ley que lo autorice, por utilidad pública y pagando antes la indemnización."],
        ["rosa", "¿Y si no estoy de acuerdo con lo que me pagan?"],
      ],
      eva: ["Expropiar no es quitar: es comprar a la fuerza, con ley, con causa y con cheque. En ese orden."],
    },
    apuesta: "Mientras doña Rosa sirve té:",
    mesa: {
      lugar: "juridica", punto: "escritorio", objetivo: "En tu escritorio: el expediente de la avenida", con: { p: DIRECTOR, punto: "director" },
      dichos: [["director", "La avenida es del Ministerio, pero los vecinos son nuestros. Revisa todo."]],
    },
    terreno: {
      lugar: "ciudad", objetivo: "Camina la franja con doña Rosa", quien: ROSA, punto: "franja", juego: "cadena",
      dichos: [["rosa", "Cuénteme qué viene, paso a paso. Desde la carta hasta las máquinas."]],
      despues: [["rosa", "Primero el pago, después las máquinas. Eso lo voy a gritar si hace falta."]],
    },
    jefe: {
      lugar: "juzgado", objetivo: "Reclamo de monto en el Juzgado Civil", quien: CDE, punto: "rival", tipo: "duelo",
      juez: { p: JUEZA, punto: "jueza" },
      extras: [{ p: ROSA, punto: "vecino" }],
      dichos: [["jueza", "Reclamo del monto provisional de la indemnización. El Fisco tiene la palabra."], ["cde", "El monto es justo. La señora no ha probado más daño."]],
      despues: [["jueza", "Se recibe la causa a prueba."], ["rosa", "Gracias, mijita. Ahora sé que tengo derechos. Y una avenida."]],
    },
    cierre: ["Doce jornadas. El poder del Estado es grande, pero no infinito: sus límites están escritos, y ahora sabes leerlos.", "Potestas te queda chica. Bienvenida al Derecho Público."],
  },
];

export const guion = (n: number) => GUIONES.find((g) => g.n === n)!;
