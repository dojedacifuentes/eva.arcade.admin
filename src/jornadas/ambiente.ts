// La vida de la ciudad: vecinos en la plaza y gente en las oficinas, con una
// frase distinta en cada jornada (humor y, a veces, un guiño a lo ya visto).
// Se ponen cada vez que se carga un lugar (Mundo.decorar) y nunca estorban la
// historia: usan puntos que los guiones no ocupan. Hablar con todos los de la
// plaza da un logro.
import type { Mundo } from "../game/scenes/Mundo";
import type { Apariencia } from "../game/art/characters";
import { e, guardar } from "../game/estado";
import { ui } from "../ui/ui";
import { ganarSaber, logro } from "../juego/progreso";

type Vecino = { id: string; nombre: string; a: Apariencia; mapa: string; punto: string; dir: "abajo" | "izquierda" | "derecha" | "arriba"; dice: (j: number) => string };

const PALOMA: Apariencia = { piel: "#eab68f", pelo: "#b9b1ad", peinado: "corto", polera: "#5fa37a", pantalon: "#5c3423" };
const ESTUDIANTE: Apariencia = { piel: "#c98d63", pelo: "#2b2026", peinado: "mono", polera: "#d46a9b", pantalon: "#3b3f4f" };
const CARTERO: Apariencia = { piel: "#94603f", pelo: "#2b2026", peinado: "corto", polera: "#3a62b8", pantalon: "#3b3f4f" };
const GUARDIA: Apariencia = { piel: "#f7d7bd", pelo: "#5c3423", peinado: "corto", polera: "#2f3540", pantalon: "#2b2026" };
const SENORA: Apariencia = { piel: "#5f3b27", pelo: "#2b2026", peinado: "rizado", polera: "#f0b44c", pantalon: "#5c3423" };

const VECINOS: Vecino[] = [
  { id: "amb-palomas", nombre: "Don Efraín", a: PALOMA, mapa: "ciudad", punto: "amb-2", dir: "izquierda", dice: (j) => [
    "Cuarenta años dándole de comer a las palomas. Ninguna ordenanza me ha parado. Todavía.",
    "Dicen que la Alcaldesa firma rápido. Yo firmo lento y me va igual.",
    "Si un decreto no dice por qué, ¿es como un chiste sin remate?",
    "La fila de Atención avanza. Lento, pero avanza. Como yo.",
    "Pedí un permiso en marzo. Estamos en… ¿qué mes es? Ah, por eso.",
    "A mi compadre lo multaron dos veces por lo mismo. Pidió la plata de vuelta.",
    "La Contraloría me da miedo y no he hecho nada malo.",
    "Mi nieta quiere ser jueza. Le dije que estudie, que la Corte no abre los sábados.",
    "¿Supo del hoyo? Lo taparon. Tres meses tarde, pero lo taparon.",
    "Nulo de pleno derecho. Así me dejó la jubilación.",
    "El Tribunal Constitucional. Diez personas leyendo la misma ley. Qué paciencia.",
    "La avenida nueva. Ojalá le paguen bien a la Rosita.",
  ][j - 1] },
  { id: "amb-estudiante", nombre: "Catalina", a: ESTUDIANTE, mapa: "ciudad", punto: "amb-1", dir: "abajo", dice: (j) => [
    "Estudio Derecho. Primer año. «El Estado sólo puede lo que la ley le permite.» Ya me lo sé.",
    "Órgano, investidura, competencia. Lo repito en la ducha.",
    "Invalidar o revocar. Mi profe dice que es la pregunta favorita del examen.",
    "Contradictoriedad: que te dejen hablar. Debería aplicarse en mi casa.",
    "Días hábiles. El sábado no cuenta. El domingo, menos.",
    "Non bis in idem. Lo tengo tatuado. Mentira, en un post-it.",
    "Mañana tengo prueba de recursos administrativos. ¿Reposición son cinco días? Sí, ¿no?",
    "¿Protección o reclamación de ilegalidad? Siempre me confundo.",
    "Falta de servicio. Me lo explicó un hoyo, literalmente.",
    "La nulidad no prescribe. La plata sí. Me lo voy a aprender así.",
    "Inaplicabilidad: para un caso. Inconstitucionalidad: para todos. ¿Ves? Sí sé.",
    "Expropiación: con ley, con causa y con cheque. ¿Vas a la Corte? Te acompaño a mirar.",
  ][j - 1] },
  { id: "amb-cartero", nombre: "El cartero", a: CARTERO, mapa: "ciudad", punto: "amb-3", dir: "abajo", dice: (j) => [
    "Traigo cuarenta decretos para la Oficina de Partes. Ninguno dice «urgente». Todos lo son.",
    "Una notificación por carta certificada. Al tercer día hábil ya está notificada, ¿sabía?",
    "Llevo veinte años repartiendo actos administrativos. Ni uno me ha dado las gracias.",
    "Traigo una solicitud sin firma. Ya sé, ya sé.",
    "¿Un domingo? No reparto. La ley tampoco cuenta los domingos.",
    "Traigo una citación de Fiscalización. No mire, no es para usted.",
    "Un oficio de la Contraloría. Sobre grueso. Mala señal.",
    "Una cédula de notificación de la Corte. Esta sí que es urgente.",
    "Me tropecé en ese hoyo antes que don Lucho. No demandé. Debí demandar.",
    "Un decreto de hace cinco años. Encontrado en un cajón. Clásico.",
    "¿El Tribunal Constitucional manda cartas? No. Manda sentencias.",
    "Una carta para doña Rosa. Del Ministerio. No me gusta ese timbre.",
  ][j - 1] },
  { id: "amb-guardia", nombre: "Guardia", a: GUARDIA, mapa: "corte", punto: "publico", dir: "arriba", dice: () => "Silencio en la sala, por favor. Los celulares, también en silencio." },
  { id: "amb-fila", nombre: "Señora en la fila", a: SENORA, mapa: "atencion", punto: "fila-3", dir: "arriba", dice: (j) => j === 4 ? "¿Usted también viene por el papel para el papel?" : "Llevo número 47. Van en el 12." },
];

/** Vecinos de la plaza con los que hay que hablar para el logro. */
const DE_PLAZA = VECINOS.filter((v) => v.mapa === "ciudad").map((v) => v.id);

export function decorar(m: Mundo) {
  const j = e().jornada;
  for (const v of VECINOS) {
    if (v.mapa !== m.mapa) continue;
    let pos;
    try { pos = m.punto(v.punto); } catch { continue; }
    const n = m.npc(v.id, v.a, pos, v.dir);
    m.interactuar(v.id, `Hablar con ${v.nombre}`, () => ({ x: n.x, y: n.y }), () => {
      void ui.decir([{ quien: v.nombre, texto: v.dice(j), apariencia: v.a }]).then(() => {
        const marca = `hablo:${v.id}`;
        if (!e().flags.includes(marca)) { e().flags.push(marca); guardar(); ganarSaber(10); }
        if (DE_PLAZA.every((id) => e().flags.includes(`hablo:${id}`))) logro("vecinos");
      });
    }, 20);
  }
}
