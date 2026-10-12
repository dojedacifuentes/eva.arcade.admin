// Verificación completa antes de guardar o publicar: tipos y, por cada capítulo,
// un recorrido automático (Chrome sin interfaz) que debe llegar al final del
// capítulo sin errores ni atascos. Requiere el servidor (npx vite --port 5174).
// Uso: node tools/verificar.mjs [capítulos…] [--movil] [--url=https://…]
//   node tools/verificar.mjs            → todos (0 = el prólogo), en escritorio
//   node tools/verificar.mjs 5 --movil  → solo el 5, en tamaño celular
//   node tools/verificar.mjs 2 3 4 5 6 --auc [--dos-hombres] [--sin-acuerdo] → el camino del AUC
//   node tools/verificar.mjs 2 3 4 5 6 --sin-papeles → convivientes de hecho
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const movil = args.includes("--movil");
// El camino del AUC: el capítulo 2 elige AUC; del 3 en adelante, la partida se convierte (tools/pruebas/con-auc.js).
const hecho = args.includes("--sin-papeles");
const auc = args.includes("--auc"), dosHombres = args.includes("--dos-hombres"), sinAcuerdo = args.includes("--sin-acuerdo");
const url = args.find((a) => a.startsWith("--url="))?.slice(6) ?? "http://127.0.0.1:5174/";
const caps = args.filter((a) => /^\d$/.test(a)).map(Number);
const CAPS = caps.length ? caps : [0, 1, 2, 3, 4, 5, 6];
const FINAL = { 0: "inicio", 1: "cap2", 2: "fin-cap2", 3: "fin-cap3", 4: "fin-cap4", 5: "fin-cap5", 6: "fin-cap6" };
// Todos los pasos de la historia, en orden: una prueba vale si llegó al final de su capítulo (o más allá).
const ORDEN = ["prologo", "p-registro", "inicio", "otono", "sofa", "cap2", "c2-almuerzo", "c2-propuesta", "c2-registro", "c2-boda", "c2-tribunal", "fin-cap2", "c3-casa", "c3-banco", "c3-armar", "c3-semana", "c3-final", "fin-cap3", "c4-noticia", "c4-registro", "c4-postnatal", "c4-semana", "c4-abuelas", "c4-final", "fin-cap4", "c5-grietas", "c5-reparto", "c5-mediacion", "c5-fecha", "c5-finde", "fin-cap5", "c6-audiencia", "c6-bienes", "c6-sentencia", "c6-epilogo", "fin-cap6"];
const dir = mkdtempSync(join(tmpdir(), "verificar-"));
let fallas = 0;

const tsc = spawnSync("npx", ["tsc", "--noEmit"], { encoding: "utf8", shell: true });
if (tsc.status !== 0) { console.log("✗ tipos\n" + tsc.stdout); process.exit(1); }
console.log("✓ tipos");

for (const n of CAPS) {
  const guion = join(dir, `g${n}.js`);
  // La prueba juega hasta su propio final; además, apenas la partida llega al
  // final del capítulo, se da por buena (los capítulos ahora siguen solos).
  const prueba = readFileSync(`tools/pruebas/recorrido-cap${n}.js`, "utf8").trim().replace(/;$/, "");
  const vigia = `new Promise((r) => { const O = ${JSON.stringify(ORDEN)}; const id = setInterval(() => {
    let p = {}; try { p = JSON.parse(localStorage.getItem("eva-potestas:partida") || "{}"); } catch {}
    if (O.indexOf(p.paso) >= O.indexOf(${JSON.stringify(FINAL[n])})) { clearInterval(id); setTimeout(() => r({ paso: p.paso, hallazgosGuardados: p.hallazgos, log: ["(llegó al final del capítulo)"] }), window.__extra ?? 4000); }
  }, 500); })`;
  // Alcance: cada 3 s, si el jugador anda libre, se busca caminando (con las colisiones reales) desde donde
  // la puerta; cualquier cosa usable a la que no se pueda llegar queda anotada como falla.
  const alcance = `setInterval(() => { const b = document.querySelector("#apuesta:not([data-cerrando]) .apuesta-op"); if (b) b.click(); }, 400);
window.__inalcanzables = new Set();
setInterval(() => {
  const m = window.juego?.scene?.getScene("mundo");
  if (!m || !m.jugador || m.quieto || !document.querySelector("#dialogo").hidden) return;
  // Se parte desde la puerta (como entra una persona), no desde donde la prueba haya teletransportado al jugador.
  let o = m.jugador; try { o = m.punto(m.mapa === "barrio" ? "inicio" : "entrada"); } catch {}
  const P = 4, sx = Math.round(o.x / P), sy = Math.round(o.y / P), clave = (x, y) => x * 10000 + y;
  const vistos = new Set([clave(sx, sy)]), cola = [[sx, sy]], libres = [[sx, sy]];
  while (cola.length && vistos.size < 45000) {
    const [x, y] = cola.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = clave(nx, ny);
      if (vistos.has(k) || !m.libre(nx * P, ny * P)) continue;
      vistos.add(k); cola.push([nx, ny]); libres.push([nx, ny]);
    }
  }
  for (const [id, it] of m.interactivos) {
    const p = it.pos();
    const ok = libres.some(([x, y]) => [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([vx, vy]) => Math.hypot(x * P + vx * 10 - p.x, y * P - 4 + vy * 10 - (p.y - 4)) < it.radio));
    if (!ok) window.__inalcanzables.add(m.mapa + ":" + id);
  }
}, 3000);
`;
  writeFileSync(guion, `window.__limite = 480000;\n${auc ? "window.__formaliza = 1;\n" : hecho ? "window.__formaliza = 2;\n" + (n === 2 ? "window.__plan = [1, 1, 0, 0, 2, 2, 1, 3, 0, 0, 1];\n" : "") : ""}${n >= 5 ? "window.__extra = 60000;\n" : ""}${alcance}Promise.race([${prueba}, ${vigia}]).then((r) => ({ ...r, inalcanzables: [...window.__inalcanzables] }))`);
  const env = { ...process.env };
  if (n > 1) env.PREPARAR = `tools/pruebas/partida-cap${n}.js`;
  if (n > 2 && (auc || hecho || sinAcuerdo)) {
    const prep = join(dir, `prep${n}.js`);
    const antes = (dosHombres ? "window.__dosHombres = true;\n" : "") + (sinAcuerdo ? "window.__acuerdo = false;\n" : "");
    writeFileSync(prep, antes + readFileSync(env.PREPARAR, "utf8") + "\n" + (auc ? readFileSync("tools/pruebas/con-auc.js", "utf8") : hecho ? "window.__sinPapeles = true;\n" + readFileSync("tools/pruebas/con-auc.js", "utf8") : ""));
    env.PREPARAR = prep;
  }
  const [w, h] = movil ? [390, 844] : [1280, 800];
  const t0 = Date.now();
  const r = spawnSync("node", ["tools/captura.mjs", url, join(dir, `cap${n}.png`), String(w), String(h), "3000", guion], { encoding: "utf8", env, timeout: 560000 });
  const salida = r.stdout ?? "";
  const linea = salida.split("\n").find((l) => l.startsWith("guion:")) ?? "";
  let res = {};
  try { res = JSON.parse(linea.slice(6)); } catch { /* sin resultado */ }
  const errores = salida.includes("ERRORES:");
  const log = (res.log ?? []).join("\n");
  const llego = ORDEN.indexOf(res.paso) >= ORDEN.indexOf(FINAL[n]);
  const inalc = res.inalcanzables ?? [];
  const ok = llego && !errores && !/ATASCADO|TIEMPO AGOTADO/.test(log) && !inalc.length;
  if (!ok) fallas++;
  console.log(`${ok ? "✓" : "✗"} capítulo ${n} (${Math.round((Date.now() - t0) / 1000)} s) → paso ${res.paso ?? "?"}, hallazgos ${(res.hallazgosGuardados ?? []).length}`);
  if (inalc.length) console.log("  no se puede llegar caminando a: " + inalc.join(", "));
  if (!ok) console.log(salida.split("\n").filter((l) => !l.startsWith("captura")).slice(-6).join("\n") + "\n" + log.split("\n").slice(-12).join("\n"));
}
console.log(fallas ? `✗ ${fallas} con problemas (capturas en ${dir})` : `✓ todo bien (capturas en ${dir})`);
process.exit(fallas ? 1 : 0);
