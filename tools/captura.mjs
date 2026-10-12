// Captura del juego con Chrome sin interfaz (protocolo DevTools, sin dependencias).
// Uso: node tools/captura.mjs <url> <salida.png> [ancho] [alto] [esperaMs] [guion.js]
import { spawn } from "node:child_process";
import { writeFileSync, readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url = "http://127.0.0.1:5174/", out = "captura.png", w = "1280", h = "800", espera = "2500", guion] = process.argv.slice(2);
const PUERTO = process.env.PUERTO ?? "9333";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const perfil = mkdtempSync(join(tmpdir(), "rpg-"));
const movil = Number(w) < 768;
const proc = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PUERTO}`, `--user-data-dir=${perfil}`, "--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--autoplay-policy=no-user-gesture-required", "--mute-audio", "about:blank"], { stdio: "ignore" });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 40; i++) {
  try {
    const lista = await (await fetch(`http://127.0.0.1:${PUERTO}/json`)).json();
    const pag = lista.find((t) => t.type === "page");
    if (pag) { ws = new WebSocket(pag.webSocketDebuggerUrl); break; }
  } catch {}
  await dormir(250);
}
if (ws.readyState !== 1) await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pend = new Map(); const errores = [];
ws.addEventListener("message", (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === "Runtime.exceptionThrown") errores.push(d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text);
  if (d.method === "Runtime.consoleAPICalled" && d.params.type === "error") errores.push(d.params.args.map((a) => a.value ?? a.description).join(" "));
});
const cmd = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await cmd("Runtime.enable");
// El guion puede pedir capturas intermedias: await window.capturar("nombre")
await cmd("Runtime.addBinding", { name: "__capturar" });
// PREPARAR=archivo.js: código que corre antes que la página (p. ej., una partida guardada).
if (process.env.PREPARAR) await cmd("Page.addScriptToEvaluateOnNewDocument", { source: readFileSync(process.env.PREPARAR, "utf8") });
await cmd("Page.addScriptToEvaluateOnNewDocument", { source: "window.capturar = (n) => new Promise((r) => { window.__sigue = r; __capturar(n); });" });
ws.addEventListener("message", async (m) => {
  const d = JSON.parse(m.data);
  if (d.method !== "Runtime.bindingCalled" || d.params.name !== "__capturar") return;
  const shot = await cmd("Page.captureScreenshot", { format: "png" });
  const ruta = out.replace(/.png$/, "") + "-" + d.params.payload + ".png";
  writeFileSync(ruta, Buffer.from(shot.result.data, "base64"));
  console.log("captura →", ruta);
  await cmd("Runtime.evaluate", { expression: "window.__sigue && window.__sigue()" });
});
await cmd("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: movil ? 2 : 1, mobile: movil });
if (movil) await cmd("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await cmd("Page.enable");
await cmd("Page.navigate", { url });
await dormir(+espera);
if (guion) {
  const r = await cmd("Runtime.evaluate", { expression: readFileSync(guion, "utf8"), awaitPromise: true, returnByValue: true });
  if (r.result?.result?.value !== undefined) console.log("guion:", JSON.stringify(r.result.result.value));
  if (r.result?.exceptionDetails) errores.push(r.result.exceptionDetails.exception?.description);
}
const shot = await cmd("Page.captureScreenshot", { format: "png" });
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
console.log(errores.length ? "ERRORES:\n" + errores.join("\n") : "sin errores", "→", out);
ws.close();
spawn("taskkill", ["/PID", String(proc.pid), "/T", "/F"], { stdio: "ignore" });
