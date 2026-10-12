// Página de desarrollo: pinta el arte hecho en código y lo deja listo para
// guardarlo como PNG (tools/exportar-arte.mjs). Los PNG son los que usa Tiled
// y los que se retocan en Pixelorama o Krita.
import { LUGARES } from "../game/maps/ciudad";
import { edificio } from "../game/art/world";
import { tilesetCasa, MUEBLES } from "../game/art/interior";

const salida: Record<string, string> = {};
const guardar = (ruta: string, c: HTMLCanvasElement) => { salida[ruta] = c.toDataURL("image/png"); document.body.append(c); };
for (const l of LUGARES) {
  guardar(`edificios/${l.id}.png`, edificio(l.edificio, false));
  // De noche, las ventanas encendidas.
  guardar(`edificios/${l.id}-noche.png`, edificio(l.edificio, true));
}
guardar("../tilesets/casa.png", tilesetCasa());
const solidez: Record<string, { solido: number; pasable: boolean }> = {};
for (const [id, f] of Object.entries(MUEBLES)) {
  const m = f();
  guardar(`muebles/${id}.png`, m.c);
  solidez[id] = { solido: m.solido, pasable: !!m.pasable };
}
// La solidez de cada mueble (cuántos píxeles de su base no se pueden pisar) va
// junto a las imágenes para que el generador de mapas la ponga en Tiled.
salida["muebles/solidez.json"] = "data:application/json;base64," + btoa(JSON.stringify(solidez, null, 1));
(window as unknown as { __arte: Record<string, string> }).__arte = salida;
document.title = "listo";
