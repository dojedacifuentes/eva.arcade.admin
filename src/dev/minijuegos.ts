// Página de desarrollo (minijuegos.html): lanza cada minijuego con datos del
// banco de contenido o, si el módulo aún no existe, con ejemplos de muestra.
// Deja window.__minijuegos y window.__datos para las pruebas automáticas
// (tools/captura.mjs con un guion).
import { ui } from "../ui/ui";
import { sonido } from "../ui/sonido";
import { ajustes, aplicarAjustes } from "../juego/ajustes";
import { estado, nuevaPartida } from "../game/estado";
import { BANCOS } from "../content/banco";
import { CDE, JUEZA } from "../content/personajes";
import type { Afirmacion, Cadena, Columnas, Expediente, Hallazgo, Oral, PreguntaQuiz } from "../content/tipos";
import { HALLAZGOS } from "../content/hallazgos";
import { mesa } from "../ui/mesa";
import { cadena } from "../ui/cadena";
import { columnas } from "../ui/columnas";
import { duelo } from "../ui/duelo";
import { comision } from "../ui/comision";

// ── Ejemplos de muestra (Ley 19.880) ───────────────────────────────────────
const EXPEDIENTES: Expediente[] = [
  {
    id: "dev-mesa-motivacion", modulo: 2, titulo: "Deniega patente de alcoholes",
    relato: "Don Lucho pidió una patente para su almacén. Le llegó esto y dice que no entiende por qué se la negaron.",
    documento: { tipo: "Decreto Alcaldicio", campos: [
      { k: "Solicitante", v: "Luis Muñoz (Don Lucho)" },
      { k: "Resuelvo", v: "Deniégase la patente solicitada." },
      { k: "Fundamentos", v: "— (en blanco)" },
      { k: "Firma", v: "Alcaldesa Ruperta Cañas" },
    ] },
    pregunta: "¿Qué sello le pones a este decreto?",
    sellos: [
      { texto: "Invalidar", correcto: true, porque: "Un acto que deniega lo pedido debe expresar sus fundamentos. Sin motivación es contrario a derecho, y la propia autoridad puede invalidarlo, previa audiencia del interesado." },
      { texto: "Revocar", correcto: false, porque: "La revocación es por mérito, oportunidad o conveniencia. Aquí el problema es de legalidad: falta la motivación." },
      { texto: "Válido", correcto: false, porque: "Las resoluciones que deniegan una solicitud deben ser fundadas. Este decreto no dice por qué." },
    ],
    norma: "Ley 19.880, arts. 11 inc. 2°, 41 inc. 4° y 53", fuente: "nuevo",
  },
  {
    id: "dev-mesa-subsanar", modulo: 3, titulo: "Solicitud de permiso de feria",
    relato: "Doña Rosa dejó su solicitud para instalar un puesto en la feria. Falta su firma y no indica dónde notificarla.",
    documento: { tipo: "Solicitud", campos: [
      { k: "Interesada", v: "Rosa Pérez" },
      { k: "Petición", v: "Permiso para puesto de flores en la feria del sábado" },
      { k: "Domicilio", v: "— (no indica)" },
      { k: "Firma", v: "— (sin firma)" },
    ] },
    pregunta: "La solicitud viene incompleta. ¿Qué haces?",
    sellos: [
      { texto: "Subsanar", correcto: true, porque: "Si la solicitud no reúne los requisitos, se le pide a la interesada que en 5 días subsane la falta, advirtiéndole que si no lo hace se la tendrá por desistida." },
      { texto: "Rechazar de plano", correcto: false, porque: "La ley no permite rechazar sin más una solicitud incompleta: primero hay que dar la oportunidad de subsanar." },
      { texto: "Válido", correcto: false, porque: "Faltan requisitos de la solicitud (firma, lugar de notificación): no se puede tramitar así." },
    ],
    norma: "Ley 19.880, art. 31", fuente: "nuevo",
  },
  {
    id: "dev-mesa-silencio", modulo: 4, titulo: "Certificado de silencio",
    relato: "Benja pidió un permiso hace meses. Venció el plazo, denunció el atraso y pasaron más de 5 días sin respuesta. Ahora pide su certificado.",
    documento: { tipo: "Solicitud de certificado", campos: [
      { k: "Interesado", v: "Benjamín Soto" },
      { k: "Solicitud original", v: "Permiso de ocupación de bien nacional de uso público" },
      { k: "Denuncia de atraso", v: "Presentada hace 9 días hábiles" },
      { k: "Respuesta", v: "Ninguna" },
    ] },
    pregunta: "¿Qué corresponde?",
    sellos: [
      { texto: "Certificar silencio positivo", correcto: true, porque: "Vencido el plazo, denunciado el incumplimiento y sin pronunciamiento en 5 días, la solicitud se entiende aceptada. El interesado puede pedir el certificado." },
      { texto: "Esperar 6 meses", correcto: false, porque: "No existe tal plazo. La ruta es: vence el plazo, se denuncia, la autoridad tiene 5 días y, si calla, se entiende aceptada." },
      { texto: "Silencio negativo", correcto: false, porque: "El silencio negativo es la excepción (patrimonio fiscal, actuaciones de oficio, impugnaciones, derecho de petición). Esto no es ninguno de esos casos." },
    ],
    norma: "Ley 19.880, arts. 64 y 65", fuente: "nuevo",
  },
  {
    id: "dev-mesa-valido", modulo: 2, titulo: "Otorga permiso de edificación",
    relato: "El Director de Obras manda una resolución para archivo. Revísala antes de que salga.",
    documento: { tipo: "Resolución", campos: [
      { k: "Autoridad", v: "Director de Obras Municipales" },
      { k: "Vistos", v: "La solicitud, los planos y el informe técnico favorable" },
      { k: "Considerando", v: "Que el proyecto cumple el plan regulador" },
      { k: "Resuelvo", v: "Otórgase el permiso de edificación N° 88" },
    ] },
    pregunta: "¿Algún vicio?",
    sellos: [
      { texto: "Válido", correcto: true, porque: "Autoridad competente, fundamentos (vistos y considerandos) y una decisión clara. Este acto está bien hecho." },
      { texto: "Invalidar", correcto: false, porque: "Para invalidar hace falta un vicio de legalidad. Aquí no hay ninguno." },
      { texto: "Subsanar", correcto: false, porque: "Subsanar se pide al interesado cuando su solicitud está incompleta; no es el caso." },
    ],
    norma: "Ley 19.880, arts. 3 y 41", fuente: "nuevo",
  },
  {
    id: "dev-mesa-revocar", modulo: 6, titulo: "Revocar el permiso de Pavez",
    relato: "La Alcaldesa quiere revocar el permiso de edificación N° 88, otorgado legalmente, porque «ya no le conviene» al municipio.",
    documento: { tipo: "Memorándum", campos: [
      { k: "De", v: "Alcaldía" },
      { k: "Para", v: "Dirección Jurídica" },
      { k: "Asunto", v: "Revocar permiso N° 88 por razones de conveniencia" },
      { k: "Situación", v: "Permiso legal; la obra ya comenzó" },
    ] },
    pregunta: "¿Se puede revocar?",
    sellos: [
      { texto: "No procede revocar", correcto: true, porque: "No se pueden revocar los actos declarativos o creadores de derechos adquiridos legítimamente. El permiso se otorgó conforme a derecho." },
      { texto: "Revocar", correcto: false, porque: "La revocación tiene límites: no procede contra actos que crearon derechos adquiridos legítimamente." },
      { texto: "Invalidar", correcto: false, porque: "Invalidar exige que el acto sea contrario a derecho. Este permiso es legal." },
    ],
    norma: "Ley 19.880, arts. 53 y 61", fuente: "nuevo",
  },
];

const CADENA: Cadena = {
  id: "dev-cadena-silencio", modulo: 4, titulo: "La ruta del silencio positivo",
  pasos: [
    "Vence el plazo para resolver sin que la autoridad se pronuncie",
    "El interesado denuncia el incumplimiento ante la autoridad que debía resolver",
    "La autoridad da recibo y eleva copia al superior en 24 horas",
    "Pasan 5 días desde la denuncia sin que la autoridad resuelva",
    "La solicitud se entiende aceptada; el interesado pide el certificado",
  ],
  nota: "Ojo con el mito de los «6 meses»: no existe. Lo que manda es el plazo legal, la denuncia y los 5 días.",
  norma: "Ley 19.880, arts. 64 y 65", fuente: "nuevo",
};

const COLUMNAS: Columnas = {
  id: "dev-columnas-inv-rev", modulo: 6, titulo: "¿Invalidación o revocación?",
  izq: "Invalidación", der: "Revocación",
  items: [
    { texto: "El acto es contrario a derecho", lado: 0, porque: "La invalidación ataca la ilegalidad del acto." },
    { texto: "Razones de mérito, oportunidad o conveniencia", lado: 1, porque: "Eso es la revocación: el acto es legal, pero ya no conviene." },
    { texto: "Plazo de 2 años desde la notificación o publicación", lado: 0, porque: "La invalidación sólo puede hacerse dentro de 2 años (art. 53)." },
    { texto: "Requiere audiencia previa del interesado", lado: 0, porque: "El art. 53 exige oír al interesado antes de invalidar." },
    { texto: "No procede contra actos que crearon derechos adquiridos legítimamente", lado: 1, porque: "Es uno de los límites de la revocación (art. 61 a)." },
    { texto: "No procede si la ley fijó otra forma de extinguir el acto", lado: 1, porque: "Otro límite de la revocación (art. 61 b)." },
  ],
  norma: "Ley 19.880, arts. 53 y 61", fuente: "nuevo",
};

const QUIZ: PreguntaQuiz[] = [
  { id: "dev-q1", modulo: 2, texto: "Su decreto no obliga a nadie mientras Contraloría no lo confirme. ¿O me va a decir que sí?", opciones: ["Obliga desde su entrada en vigencia: se presume legal", "Sólo obliga cuando un juez lo confirma", "Obliga cuando el interesado lo acepta"], correcta: 0, porque: "Los actos administrativos gozan de presunción de legalidad, de imperio y exigibilidad desde su entrada en vigencia.", norma: "Ley 19.880, art. 3 inc. final", fuente: "nuevo" },
  { id: "dev-q2", modulo: 3, texto: "La resolución quedó totalmente tramitada hace un mes. Notificarla ahora es perfectamente oportuno, ¿no?", opciones: ["No: debía notificarse dentro de 5 días", "Sí: no hay plazo para notificar", "Sí: el plazo es de 6 meses"], correcta: 0, porque: "Las notificaciones deben hacerse dentro de los 5 días siguientes a aquel en que el acto quedó totalmente tramitado.", norma: "Ley 19.880, art. 45", fuente: "nuevo" },
  { id: "dev-q3", modulo: 5, texto: "Su cliente tuvo 15 días para reponer y no lo hizo. Caso cerrado.", opciones: ["El plazo de reposición es de 5 días", "El plazo de reposición es de 30 días", "La reposición no tiene plazo"], correcta: 0, porque: "El recurso de reposición se interpone dentro de 5 días ante el mismo órgano que dictó el acto.", norma: "Ley 19.880, art. 59", fuente: "nuevo" },
  { id: "dev-q4", modulo: 2, texto: "Nada impide que este decreto rija hacia atrás, desde enero. Así lo dice el propio decreto.", opciones: ["Sólo si favorece al interesado y no lesiona derechos de terceros", "Siempre que lo diga el decreto", "Nunca, sin excepción"], correcta: 0, porque: "Los actos no tienen efecto retroactivo, salvo cuando producen consecuencias favorables y no lesionan derechos de terceros.", norma: "Ley 19.880, art. 52", fuente: "nuevo" },
];

const ORAL: Oral = {
  id: "dev-oral-invalidacion", modulo: 6, profesor: "Profesora Ibáñez",
  pregunta: "Explíquele a la comisión qué es la invalidación y cuáles son sus requisitos.",
  claves: [
    "Es el retiro de un acto contrario a derecho",
    "La hace la propia Administración, de oficio o a petición de parte",
    "Exige audiencia previa del interesado",
    "Dentro de 2 años desde la notificación o publicación",
  ],
  trampas: [
    "Procede por razones de mérito o conveniencia",
    "Tiene un plazo de 6 meses",
    "Requiere una sentencia judicial previa",
  ],
  modelo: "La invalidación es el retiro de un acto administrativo contrario a derecho que hace la propia autoridad que lo dictó, de oficio o a petición de parte, previa audiencia del interesado, siempre que lo haga dentro de los dos años contados desde la notificación o publicación del acto (art. 53 de la Ley 19.880).",
  repregunta: "¿Y si ya pasaron los dos años? ¿Queda el acto ilegal sin remedio?",
  prioridad: "S", fuente: "nuevo",
};

const HALLAZGO_MUESTRA: Hallazgo = {
  id: "dev-hallazgo", modulo: 2, titulo: "Sin fundamento no hay acto",
  texto: "Cuando la Administración te dice que no, tiene que decirte por qué. Un acto sin motivación es ilegal y se puede invalidar.",
  norma: "Ley 19.880, arts. 11 y 41", simple: "«Porque sí» no es un fundamento.",
};

// El duelo: 6 declaraciones de un mismo módulo (3 ciertas y 3 falsas, alternadas),
// las falsas de hallazgos distintos, y todos los hallazgos de ese módulo como pruebas.
const testimonio = () => {
  const b = BANCOS.find((x) => x.modulo === 9) ?? BANCOS.find((x) => x.afirmaciones.filter((a) => !a.verdad).length >= 3 && x.afirmaciones.filter((a) => a.verdad).length >= 3);
  if (!b) return { afirmaciones: [] as Afirmacion[], hallazgos: [HALLAZGO_MUESTRA] };
  const distintas = (l: Afirmacion[], fuera: string[] = []) => l.filter((a, k) => !fuera.includes(a.hallazgo) && l.findIndex((x) => x.hallazgo === a.hallazgo) === k).slice(0, 3);
  const falsas = distintas(b.afirmaciones.filter((a) => !a.verdad));
  const ciertas = distintas(b.afirmaciones.filter((a) => a.verdad), falsas.map((a) => a.hallazgo));
  const afirmaciones = ciertas.flatMap((c, k) => [c, falsas[k]]).filter(Boolean);
  return { afirmaciones, hallazgos: b.hallazgos };
};
// ── Datos: el banco si existe; si no, los ejemplos ─────────────────────────
const del = <T>(f: (b: (typeof BANCOS)[number]) => T[]) => BANCOS.flatMap(f);
const datos = {
  expedientes: del((b) => b.expedientes).length >= 3 ? del((b) => b.expedientes).slice(0, 6) : EXPEDIENTES,
  cadena: del((b) => b.cadenas)[0] ?? CADENA,
  columnas: del((b) => b.columnas)[0] ?? COLUMNAS,
  quiz: del((b) => b.quiz).filter((q) => q.opciones.length >= 3).length >= 3 ? del((b) => b.quiz).filter((q) => q.opciones.length >= 3).slice(0, 4) : QUIZ,
  oral: del((b) => b.orales)[0] ?? ORAL,
  rival: { nombre: CDE.nombre, cargo: CDE.cargo, a: CDE.a },
  duelo: testimonio(),
};

// ── Montaje ────────────────────────────────────────────────────────────────
const partida = () => nuevaPartida({ nombre: "Valentina", sexo: "mujer", apariencia: { piel: "#c98d63", pelo: "#2b2026", peinado: "largo", polera: "#3b3f4f", pantalon: "#2b2026" } });
ui.montar();
aplicarAjustes();
sonido.precargar();
if (!estado) partida();

const res = document.getElementById("banco-res")!;
const conHallazgo = document.getElementById("banco-hallazgo") as HTMLInputElement;
const mostrar = (nombre: string, r: unknown) => { res.textContent = `${nombre} → ${JSON.stringify(r)}\nSaber: ${estado?.saber ?? 0} · Logros: ${(estado?.logros ?? []).join(", ") || "—"}`; };

const lanzar: Record<string, () => Promise<unknown>> = {
  mesa: () => mesa({
    titulo: "La Mesa · Jornada de prueba",
    expedientes: datos.expedientes,
    alAcertar: async (ex) => {
      if (!conHallazgo.checked) return;
      const h = HALLAZGOS.find((x) => x.id === ex.hallazgo) ?? HALLAZGO_MUESTRA;
      await ui.hallazgo(h, 12, 1);
    },
  }),
  // Turno de urgencia: la Mesa sin fin, con tres corazones (expedientes al azar de todo el banco).
  urgencia: () => {
    const todos = del((b) => b.expedientes).length ? del((b) => b.expedientes) : EXPEDIENTES;
    let ultimo = "";
    return mesa({
      titulo: "Turno de urgencia",
      expedientes: [],
      infinito: {
        vidas: 3,
        generar: () => {
          let ex = todos[Math.floor(Math.random() * todos.length)];
          if (ex.id === ultimo && todos.length > 1) ex = todos[(todos.indexOf(ex) + 1) % todos.length];
          ultimo = ex.id;
          return ex;
        },
      },
    });
  },
  cadena: () => cadena(datos.cadena),
  columnas: () => columnas(datos.columnas),
  duelo: () => {
    // Para ver las dos caras del Expediente: la mitad de las pruebas ya investigadas.
    if (estado) for (const h of datos.duelo.hallazgos.slice(0, Math.ceil(datos.duelo.hallazgos.length / 2))) if (!estado.hallazgos.includes(h.id)) estado.hallazgos.push(h.id);
    return duelo({
      rival: datos.rival, juez: { nombre: JUEZA.nombre, a: JUEZA.a },
      afirmaciones: datos.duelo.afirmaciones, hallazgos: datos.duelo.hallazgos,
      titulo: "Duelo con el CDE", mania: "Siempre traigo una defensa más, colega.",
    });
  },
  comision: () => comision(datos.oral),
};

// El botón del Turno de urgencia (la página no lo trae): junto a «La Mesa».
{
  const m = document.querySelector<HTMLButtonElement>("[data-j=\"mesa\"]");
  const u = document.createElement("button");
  u.className = "boton";
  u.dataset.j = "urgencia";
  u.textContent = "Turno de urgencia";
  m?.after(u);
}

document.querySelectorAll<HTMLButtonElement>("[data-j]").forEach((b) => b.addEventListener("click", async () => {
  const j = b.dataset.j!;
  if (j === "reiniciar") { partida(); mostrar("partida nueva", { saber: 0 }); return; }
  if (ui.ocupado()) return;
  mostrar(j, "jugando…");
  mostrar(j, await lanzar[j]());
}));

const claves = ["modoHistoria", "menosMovimiento", "letraGrande", "contraste"] as const;
document.querySelectorAll<HTMLInputElement>("[data-a]").forEach((c) => {
  const k = c.dataset.a as (typeof claves)[number];
  c.checked = ajustes[k];
  c.addEventListener("change", () => { ajustes[k] = c.checked; aplicarAjustes(); });
});

Object.assign(window, { __minijuegos: { mesa, cadena, columnas, duelo, comision }, __datos: datos, __ajustes: ajustes, __aplicarAjustes: aplicarAjustes });
document.title = "listo";
