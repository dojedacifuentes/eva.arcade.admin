import Phaser from "phaser";
import { Mundo, mundoListo } from "./game/scenes/Mundo";
import { ui } from "./ui/ui";
import { sonido } from "./ui/sonido";
import { esTactil, montarControlesTactiles } from "./ui/controles";
import { titulo, creacion, jornadas, creditos, fin } from "./ui/pantallas";
import { cargar, nuevaPartida, borrar, e, reemplazar, guardar } from "./game/estado";
import { aplicarAjustes } from "./juego/ajustes";
import { migrarProgreso, pintarNivel, pintarNuevo, logro } from "./juego/progreso";
import { partidaDesde } from "./content/jornadas";
import { MODULOS } from "./content/modulos";
import { finJornada, foto } from "./ui/fin-jornada";
import { desafio, hayDesafio } from "./ui/desafio";
import { jugarJornada } from "./jornadas/motor";
import { guion } from "./jornadas/guiones";
import { decorar } from "./jornadas/ambiente";
import { BANCOS } from "./content/banco";
import { mesa } from "./ui/mesa";
import { pintarMedidores } from "./jornadas/consecuencias";

ui.montar();
aplicarAjustes();
sonido.precargar();
if (esTactil) {
  document.body.classList.add("tactil");
  montarControlesTactiles(document.getElementById("ui")!);
}
const botonSonido = document.getElementById("hud-sonido")!;
const pintarSonido = () => { botonSonido.textContent = sonido.silenciado ? "♪̸" : "♪"; botonSonido.classList.toggle("apagado", sonido.silenciado); };
botonSonido.addEventListener("click", () => { sonido.alternarSilencio(); pintarSonido(); });
pintarSonido();
document.getElementById("hud-ajustes")!.addEventListener("click", () => void ui.ajustes());
document.getElementById("hud-nivel")!.addEventListener("click", () => ui.expediente());

const juego = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "juego",
  backgroundColor: "#141a2a",
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
  scene: [Mundo],
});
(window as unknown as { juego: Phaser.Game }).juego = juego;
// Para las pruebas automáticas (tools/pruebas): el banco, para saber qué responder.
(window as unknown as { __potestas: unknown }).__potestas = { BANCOS };

/**
 * Turno de urgencia: expedientes al azar de los doce módulos, sin historia,
 * con tres vidas y récord. Para repasar cinco minutos antes de una prueba.
 * Si no hay partida, se juega con una de visita (el Saber igual se guarda).
 */
async function turnoUrgencia() {
  if (!cargar()) nuevaPartida({ nombre: "Visita", sexo: "mujer", apariencia: { piel: "#c98d63", pelo: "#2b2026", peinado: "largo", polera: "#3b3f4f", pantalon: "#2b2026" } });
  const todos = BANCOS.flatMap((b) => b.expedientes);
  let ultimo = "";
  const generar = () => { let ex = todos[Math.floor(Math.random() * todos.length)]; for (let k = 0; k < 5 && ex.id === ultimo; k++) ex = todos[Math.floor(Math.random() * todos.length)]; ultimo = ex.id; return ex; };
  sonido.musica("musica-urgencia");
  await mesa({ titulo: "⚡ Turno de urgencia", expedientes: [generar()], infinito: { vidas: 3, generar } });
  sonido.musica(null);
}

/** Elige desde dónde se juega: continuar, una partida nueva o una jornada suelta. */
async function elegirPartida() {
  const previa = cargar();
  for (;;) {
    const opcion = await titulo(!!previa && previa.paso !== "j1-inicio");
    if (opcion === "ajustes") { await ui.ajustes(); continue; }
    if (opcion === "creditos") { await creditos(); continue; }
    if (opcion === "urgencia") { await turnoUrgencia(); continue; }
    if (opcion === "jornadas") {
      const n = await jornadas();
      if (n === null) continue;
      // Sin partida previa, primero el decreto de nombramiento (quién eres).
      const yo = previa ?? nuevaPartida(await creacion());
      borrar();
      reemplazar(partidaDesde(n, yo));
      return;
    }
    if (opcion === "continuar" && previa) return;
    borrar();
    nuevaPartida(await creacion());
    return;
  }
}

async function partida() {
  const mundo = await mundoListo;
  mundo.decorar = decorar;
  mundo.vitrina();
  await elegirPartida();
  migrarProgreso();
  pintarNivel();
  pintarNuevo();
  pintarMedidores();
  // La ciudad se armó detrás del título: se rehace con la partida (y el jugador entra a la plaza).
  await new Promise<void>((r) => { mundo.events.once("mapa-listo", () => r()); mundo.scene.restart({ mapa: "ciudad" }); });
  mundo.comenzar(e().apariencia, mundo.punto("inicio"), "abajo");
  ui.hud({ fecha: e().fecha });
  if (!e().flags.includes("ayuda-vista")) { e().flags.push("ayuda-vista"); guardar(); const quitar = ui.ayuda(esTactil); mundo.alMoverse = quitar; }

  // Las jornadas, una tras otra, desde la que toca.
  for (let n = e().jornada; n <= MODULOS.length; n++) {
    const antes = foto();
    // Si la jornada ya estaba terminada (se retoma justo al final), se pasa a la siguiente.
    if (e().paso === `fin-j${n}` && e().completadas.includes(n)) { e().jornada = Math.min(n + 1, MODULOS.length); continue; }
    const estrellas = await jugarJornada(mundo, guion(n));
    mundo.bloquear(true);
    const r = await finJornada(n, MODULOS[n - 1].titulo, antes, estrellas, hayDesafio(), n === MODULOS.length);
    if (r === "desafio") await desafio(`Repaso · ${MODULOS[n - 1].titulo}`, 5, n);
    mundo.bloquear(false);
    if (n < MODULOS.length) { e().jornada = n + 1; e().paso = `j${n + 1}-inicio`; guardar(); }
  }
  logro("fin");
  mundo.bloquear(true);
  const r = await fin();
  if (r === "desafio") await desafio("Desafío final", 10);
  location.reload();
}
void partida();
