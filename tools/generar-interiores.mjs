// Genera la PRIMERA versión de los interiores en formato Tiled. Como con el
// barrio, después se editan en Tiled y este script no se vuelve a correr sobre
// un mapa existente (exige --forzar).
//
// Cada interior: muros arriba (dos filas de pared vista de frente) y a los
// lados, piso, una puerta abajo con felpudo, muebles como imágenes (capa
// "muebles") y puntos (entrada, salida, personas, lugares de la historia).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const forzar = process.argv.includes("--forzar");
const T = 16;
const CASA = 1;            // firstgid del tileset de muros y pisos (24 tiles)
const MUEBLES0 = 25;       // firstgid de la colección de muebles
const SOLIDEZ = JSON.parse(readFileSync("public/assets/arte/muebles/solidez.json", "utf8"));
const NOMBRES = Object.keys(SOLIDEZ);
const tam = (id) => { const b = readFileSync(`public/assets/arte/muebles/${id}.png`); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; };
const TEMAS = { crema: [8, 9, 10, 11], verde: [12, 13, 14, 15], institucional: [16, 17, 18, 19] };
const PISOS = { madera: [1, 2], oscura: [3, 4], gris: [6, 6], baldosa: [5, 5], alfombra: [7, 7] };

function interior({ nombre, W, H, tema, piso, puerta, muebles, puntos }) {
  const salida = `public/assets/mapas/${nombre}.tmj`;
  if (existsSync(salida) && !forzar) { console.log(`(ya existe ${salida}; no se toca)`); return; }
  const suelo = Array.from({ length: H }, () => Array(W).fill(0));
  const muros = Array.from({ length: H }, () => Array(W).fill(0));
  const [tapa, alto, , zocalo] = TEMAS[tema];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    suelo[y][x] = CASA + PISOS[piso][(x + y * 3) % 2];
    if (y === 0) muros[y][x] = CASA + tapa;
    else if (y === 1) muros[y][x] = CASA + alto;
    else if (y === 2) muros[y][x] = CASA + zocalo;
    if (x === 0 || x === W - 1) muros[y][x] = CASA + 20;
    if (y === H - 1) muros[y][x] = x === puerta ? 0 : CASA + 21;
  }
  suelo[H - 2][puerta] = CASA + 22; // felpudo
  suelo[H - 1][puerta] = CASA + PISOS[piso][0];
  let id = 1;
  const props = (o) => Object.entries(o).map(([name, value]) => ({ name, type: typeof value === "boolean" ? "bool" : typeof value === "number" ? "float" : "string", value }));
  const objetos = muebles.map(([m, tx, tyAbajo, nombreObj]) => {
    const { w, h } = tam(m);
    return { id: id++, gid: MUEBLES0 + NOMBRES.indexOf(m), name: nombreObj ?? m, type: "mueble", x: Math.round(tx * T), y: Math.round(tyAbajo * T), width: w, height: h, rotation: 0, visible: true };
  });
  const pts = [
    { name: "entrada", type: "entrada", x: (puerta + 0.5) * T, y: (H - 2.2) * T },
    { name: "salida", type: "salida", x: (puerta + 0.5) * T, y: (H - 1.4) * T },
    ...Object.entries(puntos).map(([name, [tx, ty]]) => ({ name, type: "punto", x: tx * T, y: ty * T })),
  ].map((p) => ({ id: id++, width: 0, height: 0, rotation: 0, visible: true, point: true, ...p }));
  const capaT = (lid, name, data) => ({ id: lid, name, type: "tilelayer", width: W, height: H, x: 0, y: 0, opacity: 1, visible: true, data: data.flat() });
  const capaO = (lid, name, objects) => ({ id: lid, name, type: "objectgroup", draworder: "topdown", x: 0, y: 0, opacity: 1, visible: true, objects });
  const mapa = {
    type: "map", version: "1.10", tiledversion: "1.12.2", orientation: "orthogonal", renderorder: "right-down",
    width: W, height: H, tilewidth: T, tileheight: T, infinite: false, nextlayerid: 5, nextobjectid: id,
    properties: props({ nombre, interior: true }),
    tilesets: [
      { firstgid: CASA, name: "casa", image: "../tilesets/casa.png", imagewidth: 128, imageheight: 48, tilewidth: T, tileheight: T, columns: 8, tilecount: 24, margin: 0, spacing: 0 },
      { firstgid: MUEBLES0, name: "muebles", columns: 0, margin: 0, spacing: 0, tilecount: NOMBRES.length,
        tilewidth: Math.max(...NOMBRES.map((n) => tam(n).w)), tileheight: Math.max(...NOMBRES.map((n) => tam(n).h)), grid: { orientation: "orthogonal", width: 1, height: 1 },
        tiles: NOMBRES.map((n, i) => ({ id: i, image: `../arte/muebles/${n}.png`, imagewidth: tam(n).w, imageheight: tam(n).h,
          properties: props({ solido: SOLIDEZ[n].solido, pasable: SOLIDEZ[n].pasable }) })) },
    ],
    layers: [capaT(1, "suelo", suelo), capaT(2, "muros", muros), capaO(3, "muebles", objetos), capaO(4, "puntos", pts)],
  };
  mkdirSync("public/assets/mapas", { recursive: true });
  writeFileSync(salida, JSON.stringify(mapa, null, 1));
  console.log("→", salida);
}

// [mueble, x en tiles (izquierda), y en tiles (base), nombre opcional]
// La Alcaldía: el despacho de la Alcaldesa, con su escudo, su bandera y su sala de espera.
interior({
  nombre: "municipalidad", W: 18, H: 12, tema: "institucional", piso: "alfombra", puerta: 9,
  muebles: [
    ["letrero-alcaldia", 1.2, 2.2], ["escudo-municipal", 8.3, 2.6], ["ventana", 3.6, 2.6], ["ventana", 12.6, 2.6], ["reloj", 15.4, 2.3],
    ["bandera", 15.6, 5.4], ["estante-codigos", 1.1, 5.3], ["planta-grande", 4.2, 5.3],
    ["escritorio-oficial", 7, 6.2], ["silla-oficina", 8.3, 4.5],
    ["banca-espera", 1.2, 10.6], ["banca-espera", 14, 10.6], ["planta", 6.2, 10.6],
  ],
  puntos: { alcaldesa: [8.7, 4.9], director: [12.2, 7.6], jugador: [9.5, 8.6], eva: [9.5, 7], vecino: [3.4, 9.6], concejal: [14.6, 7.8] },
});
// Oficina de Partes: la ventanilla donde entra todo (y donde se fecha todo).
interior({
  nombre: "partes", W: 14, H: 11, tema: "institucional", piso: "gris", puerta: 7,
  muebles: [
    ["letrero-partes", 4, 2.2], ["pizarra-plazos", 10.2, 2.7],
    ["archivador", 1.1, 5.1], ["archivador", 2.2, 5.1], ["pila-expedientes", 11.8, 4.9], ["archivador", 12.6, 5.1],
    ["mostrador", 3, 6.3], ["turnos", 10.6, 7.6],
    ["banca-espera", 1.2, 9.6], ["banca-espera", 10, 9.6],
  ],
  puntos: { marisol: [7, 4.5], jugador: [7, 7.6], mesa: [5.2, 7.2], vecino: [3, 8.6], vecino2: [11.4, 8.6], eva: [9, 8] },
});
// Dirección Jurídica: tu oficina. Escritorios, códigos, café y la pila de expedientes que nunca baja.
interior({
  nombre: "juridica", W: 14, H: 11, tema: "crema", piso: "madera", puerta: 7,
  muebles: [
    ["letrero-juridica", 1.2, 2.2], ["pizarra-plazos", 8.6, 2.7], ["ventana", 11.4, 2.6],
    ["estante-codigos", 1.1, 5.3], ["estante-codigos", 3.2, 5.3], ["archivador", 12.4, 5.1], ["maquina-cafe", 10.8, 5.1],
    ["escritorio-abogado", 5.2, 6.4], ["silla-oficina", 6.6, 4.7], ["pila-expedientes", 8.4, 6.2],
    ["escritorio-abogado", 1.4, 9.6], ["silla-oficina", 2.8, 8], ["planta-grande", 12.2, 9.6],
  ],
  puntos: { director: [7, 4.9], jugador: [7.1, 7.7], escritorio: [6.6, 7.3], colega: [3.2, 8.4], eva: [9.4, 8.2], cafe: [11.4, 5.6] },
});
// Atención Ciudadana: la fila. Dos ventanillas, el dispensador de números y bancas.
interior({
  nombre: "atencion", W: 16, H: 11, tema: "verde", piso: "baldosa", puerta: 8,
  muebles: [
    ["letrero-atencion", 4.2, 2.2], ["reloj", 12.2, 2.3], ["ventana", 1.4, 2.6],
    ["mostrador", 1.4, 5.8], ["mostrador", 9.6, 5.8], ["turnos", 14.4, 7.4],
    ["banca-espera", 1.2, 10], ["banca-espera", 11.2, 10], ["planta-grande", 7.4, 5.3],
  ],
  puntos: { funcionaria: [3.4, 4.1], funcionario2: [11.6, 4.1], jugador: [8, 7.8], "fila-1": [3.4, 6.9], "fila-2": [3.4, 7.9], "fila-3": [3.4, 8.9], "fila-4": [5.2, 9.1], vecino: [12.4, 7.2], eva: [8, 6.4] },
});
// Fiscalización: las actas, las multas y el plano de patentes.
interior({
  nombre: "fiscalizacion", W: 14, H: 11, tema: "crema", piso: "gris", puerta: 7,
  muebles: [
    ["letrero-fiscalizacion", 4.2, 2.2], ["plano", 10.4, 2.7],
    ["archivador", 1.1, 5.1], ["archivador", 2.2, 5.1], ["pila-expedientes", 3.4, 4.9],
    ["escritorio-oficial", 5, 6.2], ["silla-oficina", 6.4, 4.5], ["silla-oficina", 9.2, 7.6],
    ["banca-espera", 10, 9.6], ["planta", 1.0, 9.6],
  ],
  puntos: { inspectora: [6.9, 4.9], jugador: [7.4, 7.9], multado: [9.8, 8.2], eva: [4.2, 8.2] },
});
// Contraloría Regional: dictámenes por metro lineal.
interior({
  nombre: "contraloria", W: 16, H: 12, tema: "institucional", piso: "oscura", puerta: 8,
  muebles: [
    ["letrero-contraloria", 1.2, 2.2], ["escudo-pared", 7.1, 2.6], ["reloj", 11.6, 2.3],
    ["estante-codigos", 1.1, 5.3], ["estante-codigos", 3.2, 5.3], ["archivador", 12.4, 5.1], ["archivador", 13.5, 5.1], ["bandera", 10.8, 5.4],
    ["escritorio-oficial", 5.6, 6.2], ["pila-expedientes", 9.2, 6], ["silla-oficina", 7, 4.5],
    ["banca-espera", 1.2, 11], ["banca-espera", 12, 11],
  ],
  puntos: { contralor: [8.4, 4.9], jugador: [8.4, 8.6], eva: [5.2, 8.6], fiscal: [12, 8] },
});
// Corte de Apelaciones: estrado alto, dos mesas y el público.
interior({
  nombre: "corte", W: 16, H: 12, tema: "institucional", piso: "oscura", puerta: 8,
  muebles: [
    ["letrero-corte", 1.2, 2.2], ["escudo-pared", 7.1, 2.6], ["bandera", 13.4, 5.2], ["reloj", 11.4, 2.3],
    ["estrado", 5, 5.6],
    ["mesa-parte-a", 2.2, 8.2], ["mesa-parte-b", 10.8, 8.2],
    ["banca-espera", 1.4, 11.2], ["banca-espera", 12, 11.2],
  ],
  puntos: { ministra: [8, 3.9], relator: [12, 5.5], jugador: [3.7, 9.3], rival: [12.3, 9.3], testigo: [8, 7.4], publico: [3, 10.8], eva: [8, 9.6] },
});
// Juzgado Civil: la causa por el hoyo en la vereda.
interior({
  nombre: "juzgado", W: 16, H: 12, tema: "crema", piso: "oscura", puerta: 8,
  muebles: [
    ["letrero-juzgado", 1.2, 2.2], ["escudo-pared", 7.1, 2.6], ["bandera", 13.4, 5.2], ["reloj", 11.4, 2.3],
    ["estrado", 5, 5.6],
    ["mesa-parte-a", 2.2, 8.2], ["mesa-parte-b", 10.8, 8.2],
    ["banca-espera", 1.4, 11.2], ["banca-espera", 12, 11.2],
  ],
  puntos: { jueza: [8, 3.9], actuaria: [12, 5.5], jugador: [3.7, 9.3], rival: [12.3, 9.3], vecino: [3, 10.8], eva: [8, 9.6] },
});
// Tribunal Constitucional: la Constitución manda; aquí se le pregunta.
interior({
  nombre: "tc", W: 18, H: 12, tema: "institucional", piso: "alfombra", puerta: 9,
  muebles: [
    ["letrero-tc", 4.4, 2.2], ["escudo-pared", 8.1, 2.6], ["bandera", 1.2, 5.4], ["bandera", 15.6, 5.4],
    ["estrado", 3, 5.6], ["estrado", 9, 5.6],
    ["mesa-parte-a", 2.6, 8.4], ["mesa-parte-b", 12.6, 8.4],
    ["banca-espera", 1.4, 11.2], ["banca-espera", 14, 11.2],
  ],
  puntos: { ministro: [9, 3.9], ministra2: [6, 3.9], ministro3: [12, 3.9], jugador: [4.1, 9.5], rival: [14.1, 9.5], eva: [9, 9.4] },
});
// La casa de doña Rosa: la que queda justo en la franja de la avenida nueva.
interior({
  nombre: "casa-rosa", W: 14, H: 11, tema: "crema", piso: "madera", puerta: 7,
  muebles: [
    ["retrato-familiar", 6, 2.4], ["ventana", 2, 2.6], ["ventana", 10.5, 2.6],
    ["librero", 1, 5.2], ["planta-grande", 12.2, 5.3], ["sillon", 10.4, 6.4],
    ["alfombra", 3.4, 8.8], ["mesa-comedor", 4.2, 7.6], ["tele", 1.2, 9.6],
  ],
  puntos: { rosa: [11.2, 7.6], jugador: [7.6, 8.5], eva: [5, 9.4], perito: [3, 8.4] },
});
