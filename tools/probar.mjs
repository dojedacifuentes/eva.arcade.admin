// Prueba automática de jornadas sobre una compilación de producción (sin la
// recarga en caliente del servidor de desarrollo, que rompe los recorridos).
// Uso: node tools/probar.mjs [jornadas…] [--movil] [--sin-compilar]
//   node tools/probar.mjs 1 5 6        → compila, sirve y juega esas jornadas
// Cada jornada deja capturas en docs/capturas/jN[-movil]/ y una línea de resumen.
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const args = process.argv.slice(2);
const movil = args.includes("--movil");
const jornadas = args.filter((a) => /^\d+$/.test(a)).map(Number);
const lista = jornadas.length ? jornadas : [1];
const SALIDA = "../.potestas-verif"; // relativa: la ruta absoluta tiene espacios y npx va por la consola
const PUERTO = 5179;

if (!args.includes("--sin-compilar")) {
  const t = spawnSync("npx", ["tsc", "--noEmit"], { encoding: "utf8", shell: true });
  if (t.status !== 0) { console.log("✗ tipos\n" + t.stdout); process.exit(1); }
  console.log("✓ tipos");
  const b = spawnSync("npx", ["vite", "build", "--outDir", SALIDA, "--emptyOutDir"], { encoding: "utf8", shell: true });
  if (b.status !== 0) { console.log("✗ compilación\n" + b.stdout + b.stderr); process.exit(1); }
  console.log("✓ compilación");
}
const servidor = spawn("npx", ["vite", "preview", "--outDir", SALIDA, "--port", String(PUERTO), "--strictPort", "--host", "127.0.0.1"], { shell: true, stdio: "ignore" });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${PUERTO}/`)).ok) break; } catch {} await dormir(500); }

let fallas = 0;
for (const n of lista) {
  const dir = resolve(`docs/capturas/j${n}${movil ? "-movil" : ""}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const prep = join(tmpdir(), `potestas-prep-${n}.js`);
  writeFileSync(prep, `window.__jornada = ${n};`);
  const [w, h] = movil ? [390, 844] : [1280, 800];
  const t0 = Date.now();
  const r = spawnSync("node", [resolve("tools/captura.mjs"), `http://127.0.0.1:${PUERTO}/`, join(dir, "final.png"), String(w), String(h), "3000", resolve("tools/pruebas/recorrido.js")],
    { encoding: "utf8", cwd: dir, env: { ...process.env, PREPARAR: prep, PUERTO: String(9350 + n) }, timeout: 900000 });
  const salida = r.stdout ?? "";
  const linea = salida.split("\n").find((l) => l.startsWith("guion:")) ?? "";
  const errores = salida.split("\n").filter((l) => l.startsWith("ERRORES"));
  let res = {};
  try { res = JSON.parse(linea.slice(6)); } catch {}
  const ok = res.paso === `fin-j${n}` && !errores.length && !(res.log ?? []).some((l) => /ATASCADO/.test(l));
  if (!ok) fallas++;
  console.log(`${ok ? "✓" : "✗"} jornada ${n}${movil ? " (móvil)" : ""} · ${Math.round((Date.now() - t0) / 1000)} s · paso ${res.paso} · ★ ${JSON.stringify(res.estrellas ?? {})} · hallazgos ${res.hallazgos} · fichas ${res.fichas}`);
  if (!ok) console.log("   " + (res.log ?? []).slice(-12).join("\n   ") + (errores.length ? "\n   " + errores.join("\n   ").slice(0, 1500) : "") + (linea ? "" : "\n   (sin resultado) " + salida.slice(-800)));
  else console.log("   " + (res.log ?? []).filter((l) => /^\d+s /.test(l)).join(" · "));
}
spawn("taskkill", ["/PID", String(servidor.pid), "/T", "/F"], { stdio: "ignore" });
process.exit(fallas ? 1 : 0);
