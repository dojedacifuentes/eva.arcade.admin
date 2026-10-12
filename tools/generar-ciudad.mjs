// Genera la PRIMERA versión del mapa de Ciudad Potestas en formato Tiled
// (public/assets/mapas/ciudad.tmj). Desde ahí se puede editar en Tiled; este
// script exige --forzar si el archivo ya existe para no pisar lo editado.
//
// Capas (las mismas que lee el juego):
//   suelo, caminos          → piso (pasto, veredas, plaza, asfalto)
//   obj                     → la base de cada objeto: sólido, se ordena por altura
//   obj-alto                → la parte de arriba (copas, faroles): tapa al jugador si pasa detrás
//   edificios (objetos)     → imágenes de edificios; su rectángulo es sólido
//   colision (objetos)      → rectángulos sólidos extra
//   puntos (objetos)        → inicio, puertas, pileta, personajes, lugares de la historia
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const SALIDA = "public/assets/mapas/ciudad.tmj";
if (existsSync(SALIDA) && !process.argv.includes("--forzar")) {
  console.error(`${SALIDA} ya existe (y quizá se editó en Tiled). Usa --forzar para sobrescribirlo.`);
  process.exit(1);
}

const W = 64, H = 58, T = 16;
const PUEBLO = 1, CIUDAD = 133, EDIF = 619; // firstgid de cada tileset

// Lugares (tiles; tx,ty = esquina superior izquierda). Las puertas miran al sur.
const LUGARES = [
  // Fila cívica (norte): oficinas municipales y la Municipalidad al centro.
  { id: "partes", nombre: "Oficina de Partes", tx: 3, ty: 6, w: 8, h: 7, puerta: 3 },
  { id: "juridica", nombre: "Dirección Jurídica", tx: 12, ty: 6, w: 9, h: 7, puerta: 4 },
  { id: "municipalidad", nombre: "Municipalidad de Potestas", tx: 25, ty: 3, w: 14, h: 10, puerta: 6 },
  { id: "atencion", nombre: "Servicio de Atención Ciudadana", tx: 43, ty: 6, w: 9, h: 7, puerta: 4 },
  { id: "fiscalizacion", nombre: "Dirección de Fiscalización", tx: 53, ty: 6, w: 8, h: 7, puerta: 3 },
  // Fila judicial (al sur de la avenida).
  { id: "contraloria", nombre: "Contraloría Regional", tx: 3, ty: 35, w: 11, h: 9, puerta: 5 },
  { id: "corte", nombre: "Corte de Apelaciones", tx: 17, ty: 35, w: 11, h: 9, puerta: 5 },
  { id: "juzgado", nombre: "Juzgado Civil", tx: 31, ty: 36, w: 9, h: 8, puerta: 4 },
  { id: "tc", nombre: "Tribunal Constitucional", tx: 42, ty: 35, w: 10, h: 9, puerta: 4 },
  { id: "cafe", nombre: "Café Potestad", tx: 55, ty: 37, w: 7, h: 7, puerta: 3, cerrado: true, aviso: "Cerrado por inventario. El cartel lleva ahí tres años." },
  // El barrio (la franja de la avenida nueva).
  { id: "casa-rosa", nombre: "Casa de doña Rosa", tx: 20, ty: 48, w: 7, h: 7, puerta: 3 },
  { id: "casa-2", nombre: "Casa de los Pérez", tx: 29, ty: 49, w: 6, h: 6, puerta: 2, cerrado: true, aviso: "Nadie abre. Se oye una tele." },
  { id: "casa-3", nombre: "Casa amarilla", tx: 37, ty: 49, w: 6, h: 6, puerta: 3, cerrado: true, aviso: "Un cartel: «Esta casa NO se vende»." },
];

let semilla = 2026;
const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647);

const capa = () => Array.from({ length: H }, () => Array(W).fill(0));
const suelo = capa(), caminos = capa(), obj = capa(), alto = capa();
const tipo = Array.from({ length: H }, () => Array(W).fill("pasto"));
const ocupado = capa();

const rect = (x0, y0, w, h, t) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (tipo[y]?.[x]) tipo[y][x] = t; };
const marcar = (x0, y0, w, h) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (ocupado[y]?.[x] !== undefined) ocupado[y][x] = 1; };

// ── Trazado ────────────────────────────────────────────────────────────────
rect(2, 13, 60, 2, "vereda");            // calle cívica (frente a las oficinas)
rect(14, 16, 36, 11, "plaza");           // Plaza de la Constitución
rect(30, 15, 4, 1, "vereda");            // entrada norte de la plaza
rect(2, 28, 60, 1, "vereda");            // vereda norte de la avenida
rect(2, 29, 60, 3, "asfalto");           // Avenida del Estado
rect(2, 32, 60, 1, "vereda");            // vereda sur
rect(2, 44, 60, 2, "vereda");            // calle de los tribunales
rect(2, 55, 60, 1, "vereda");            // pasaje del barrio
for (const x of [14, 15, 28, 29, 52, 53]) rect(x, 33, 1, 11, "vereda"); // pasajes entre tribunales
for (const x of [14, 15, 48, 49]) rect(x, 15, 1, 13, "vereda");         // costados de la plaza
for (const x of [17, 18, 44, 45]) rect(x, 46, 1, 9, "vereda");          // pasajes del barrio
rect(30, 27, 4, 1, "vereda");            // salida sur de la plaza
for (const l of LUGARES) {
  marcar(l.tx, l.ty, l.w, l.h);
  const fila = l.ty + l.h; // camino desde la puerta hasta la calle
  for (let y = fila; y < 60 && tipo[y]?.[l.tx + l.puerta] === "pasto"; y++) tipo[y][l.tx + l.puerta] = "vereda";
}

// ── Suelo y caminos ────────────────────────────────────────────────────────
const nueveCortes = {
  vereda: [8, 9, 10, 35, 36, 37, 62, 63, 64],
  plaza: [81, 82, 83, 108, 109, 110, 135, 136, 137],
};
const PASO_CEBRA = new Set([16, 17, 30, 31, 32, 33, 46, 47]); // columnas con paso de cebra en la avenida
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const r = azar();
  suelo[y][x] = PUEBLO + (r < 0.05 ? 2 : r < 0.22 ? 1 : 0);
  const t = tipo[y][x];
  if (t === "pasto") continue;
  if (t === "asfalto") {
    caminos[y][x] = CIUDAD + (PASO_CEBRA.has(x) ? 405 : y === 30 ? (x % 3 === 0 ? 406 : 433) : 406);
    continue;
  }
  const igual = (dx, dy) => { const o = tipo[y + dy]?.[x + dx]; return o === t || (t === "vereda" && o === "asfalto"); };
  const n = igual(0, -1), s = igual(0, 1), w = igual(-1, 0), e = igual(1, 0);
  const i = (!n ? 0 : !s ? 6 : 3) + (!w ? 0 : !e ? 2 : 1);
  caminos[y][x] = CIUDAD + nueveCortes[t][i];
}
// flores en los jardines de la plaza y del barrio
for (let y = 15; y < 28; y++) for (let x = 10; x < 54; x++) if (tipo[y][x] === "pasto" && azar() < 0.32) suelo[y][x] = PUEBLO + 2;
for (let y = 46; y < 55; y++) for (let x = 18; x < 46; x++) if (tipo[y][x] === "pasto" && azar() < 0.25) suelo[y][x] = PUEBLO + 2;

// ── Objetos ────────────────────────────────────────────────────────────────
const libre = (x, y) => x > 0 && y > 0 && x < W - 1 && y < H - 1 && tipo[y][x] === "pasto" && !ocupado[y][x] && !obj[y][x] && !alto[y][x];
const poner = (x, y, base, arriba) => {
  if (!libre(x, y) || (arriba !== undefined && y > 0 && (obj[y - 1][x] || alto[y - 1][x]))) return false;
  obj[y][x] = base; if (arriba !== undefined) alto[y - 1][x] = arriba; ocupado[y][x] = 1; return true;
};
const arbol = (x, y) => (azar() < 0.75 ? poner(x, y, PUEBLO + 16, PUEBLO + 4) : poner(x, y, PUEBLO + 28));

// Bosque que encierra la ciudad.
const hilera = (x, y) => { if (tipo[y]?.[x] === "pasto" && !ocupado[y][x] && !obj[y][x] && !alto[y][x] && (y === 0 || !obj[y - 1][x])) { obj[y][x] = PUEBLO + (azar() < 0.85 ? 16 : 15); if (y > 0) alto[y - 1][x] = obj[y][x] === PUEBLO + 16 ? PUEBLO + 4 : PUEBLO + 3; ocupado[y][x] = 1; } };
for (let x = 0; x < W; x++) { hilera(x, 1); if (x % 2) hilera(x, 3); hilera(x, H - 1); }
for (let y = 1; y < H; y++) { hilera(0, y); hilera(W - 1, y); if (y % 2) { hilera(1, y); hilera(W - 2, y); } }

// Árboles de calle (ciudad) junto a la avenida y en los jardines
for (let x = 4; x < 60; x += 4) { if (PASO_CEBRA.has(x) || PASO_CEBRA.has(x + 1)) continue; poner(x, 27, CIUDAD + 259, CIUDAD + 232); poner(x + 2, 34, CIUDAD + 260, CIUDAD + 233); }
for (const [x, y] of [[11, 18], [12, 23], [52, 18], [51, 24], [8, 20], [56, 21], [5, 25], [59, 26], [22, 46], [41, 47], [12, 50], [52, 50], [8, 53], [56, 53], [25, 2], [40, 2]]) arbol(x, y);
for (let i = 0; i < 26; i++) { const x = 2 + Math.floor(azar() * (W - 4)), y = 3 + Math.floor(azar() * (H - 6)); arbol(x, y); }
// setos frente a las oficinas
for (const [x0, x1] of [[22, 24], [40, 42]]) for (let x = x0; x <= x1; x++) poner(x, 12, PUEBLO + 5);
// faroles de calle en las veredas y ornamentales en la plaza
const farolCalle = (x, y) => { if (tipo[y]?.[x] !== "pasto") return; poner(x, y, CIUDAD + 191, CIUDAD + 164); };
for (const x of [6, 18, 24, 40, 46, 58]) farolCalle(x, 15);
for (const x of [8, 22, 36, 50, 58]) farolCalle(x, 33);
for (const x of [10, 24, 38, 50]) farolCalle(x, 46);
// mobiliario urbano
poner(57, 15, CIUDAD + 305); // buzón
poner(12, 46, CIUDAD + 278); // grifo

// Dentro de la plaza: bancos, basureros, faroles ornamentales y jardineras.
const enPlaza = (x, y, gid) => { obj[y][x] = gid; ocupado[y][x] = 1; };
for (const [x, y] of [[18, 18], [26, 18], [37, 18], [45, 18], [18, 25], [26, 25], [37, 25], [45, 25]]) enPlaza(x, y, CIUDAD + 250);
for (const [x, y] of [[17, 18], [46, 25]]) enPlaza(x, y, CIUDAD + 280);
for (const [x, y] of [[16, 17], [47, 17], [16, 26], [47, 26], [22, 21], [41, 21]]) { enPlaza(x, y, CIUDAD + 196); alto[y - 1][x] = CIUDAD + 169; }
for (const [x, y] of [[20, 23], [43, 23]]) enPlaza(x, y, CIUDAD + 328);

// ── Objetos de Tiled ───────────────────────────────────────────────────────
const tam = (f) => { const b = readFileSync(f); return { iw: b.readUInt32BE(16), ih: b.readUInt32BE(20) }; };
const imgs = LUGARES.map((l) => ({ ...l, ...tam(`public/assets/arte/edificios/${l.id}.png`) }));
let oid = 1;
const prop = (o) => Object.entries(o).map(([name, value]) => ({ name, type: typeof value === "boolean" ? "bool" : typeof value === "number" ? "float" : "string", value }));
const edificios = imgs.map((l, i) => ({
  id: oid++, gid: EDIF + i, name: l.id, type: "edificio", x: l.tx * T, y: (l.ty + l.h) * T + 4, width: l.iw, height: l.ih, rotation: 0, visible: true,
  properties: prop({ nombre: l.nombre }),
}));
const P = (name, type, tx, ty, props) => ({ name, type, x: tx * T, y: ty * T, ...(props ? { properties: prop(props) } : {}) });
const puntos = [
  P("inicio", "inicio", 32, 14.4),
  P("fuente", "fuente", 32, 22.2),
  P("plaza", "punto", 32, 25.5),
  P("vecino-1", "punto", 21.5, 19.5), P("vecino-2", "punto", 42.5, 19.5), P("vecino-3", "punto", 24.5, 26.2), P("vecino-4", "punto", 39.5, 26.2),
  P("hoyo", "punto", 34.5, 45.2),
  P("franja", "punto", 23.5, 56.2),
  P("paradero", "punto", 12.5, 28.5),
  ...LUGARES.map((l) => P(`puerta-${l.id}`, "puerta", l.tx + l.puerta + 0.5, l.ty + l.h + 0.38,
    { lugar: l.id, nombre: l.nombre, abierto: !l.cerrado, ...(l.aviso ? { aviso: l.aviso } : {}) })),
].map((p) => ({ id: oid++, width: 0, height: 0, rotation: 0, visible: true, point: true, ...p }));
const colision = [{ id: oid++, name: "fuente", type: "", x: 29.5 * T, y: 20.6 * T, width: 5 * T, height: 2 * T, rotation: 0, visible: true }];

const capaTiles = (id, name, data) => ({ id, name, type: "tilelayer", width: W, height: H, x: 0, y: 0, opacity: 1, visible: true, data: data.flat() });
const capaObj = (id, name, objects) => ({ id, name, type: "objectgroup", draworder: "topdown", x: 0, y: 0, opacity: 1, visible: true, objects });
const mapa = {
  type: "map", version: "1.10", tiledversion: "1.12.2", orientation: "orthogonal", renderorder: "right-down",
  width: W, height: H, tilewidth: T, tileheight: T, infinite: false, nextlayerid: 8, nextobjectid: oid,
  properties: prop({ nombre: "Ciudad Potestas" }),
  tilesets: [
    { firstgid: PUEBLO, name: "pueblo", image: "../tilesets/pueblo.png", imagewidth: 192, imageheight: 176, tilewidth: T, tileheight: T, columns: 12, tilecount: 132, margin: 0, spacing: 0 },
    { firstgid: CIUDAD, name: "ciudad", image: "../tilesets/ciudad.png", imagewidth: 432, imageheight: 288, tilewidth: T, tileheight: T, columns: 27, tilecount: 486, margin: 0, spacing: 0 },
    { firstgid: EDIF, name: "edificios", columns: 0, margin: 0, spacing: 0, tilecount: imgs.length,
      tilewidth: Math.max(...imgs.map((i) => i.iw)), tileheight: Math.max(...imgs.map((i) => i.ih)), grid: { orientation: "orthogonal", width: 1, height: 1 },
      tiles: imgs.map((l, i) => ({ id: i, image: `../arte/edificios/${l.id}.png`, imagewidth: l.iw, imageheight: l.ih })) },
  ],
  layers: [
    capaTiles(1, "suelo", suelo), capaTiles(2, "caminos", caminos), capaTiles(3, "obj", obj), capaTiles(4, "obj-alto", alto),
    capaObj(5, "edificios", edificios), capaObj(6, "colision", colision), capaObj(7, "puntos", puntos),
  ],
};
mkdirSync("public/assets/mapas", { recursive: true });
writeFileSync(SALIDA, JSON.stringify(mapa, null, 1));
console.log("→", SALIDA);
