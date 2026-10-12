// Guarda como PNG el arte pintado en código. Requiere el servidor de desarrollo
// (npx vite --port 5174). Uso: node tools/exportar-arte.mjs
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const URL = "http://127.0.0.1:" + (process.env.PUERTO_VITE ?? "5176") + "/exportar.html";
const DESTINO = "public/assets/arte";
const perfil = mkdtempSync(join(tmpdir(), "arte-"));
const proc = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--remote-debugging-port=9336", `--user-data-dir=${perfil}`, "--mute-audio", "about:blank"], { stdio: "ignore" });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 40 && !ws; i++) {
  try { const p = (await (await fetch("http://127.0.0.1:9336/json")).json()).find((t) => t.type === "page"); if (p) ws = new WebSocket(p.webSocketDebuggerUrl); } catch {}
  await dormir(250);
}
if (ws.readyState !== 1) await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pend = new Map();
ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } });
const cmd = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await cmd("Page.enable");
await cmd("Page.navigate", { url: URL });
let arte;
for (let i = 0; i < 40 && !arte; i++) {
  await dormir(250);
  const r = await cmd("Runtime.evaluate", { expression: "window.__arte", returnByValue: true });
  arte = r.result?.result?.value;
}
for (const [ruta, dato] of Object.entries(arte)) {
  const f = join(DESTINO, ruta);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, Buffer.from(dato.split(",")[1], "base64"));
  console.log("→", f);
}
ws.close();
spawn("taskkill", ["/PID", String(proc.pid), "/T", "/F"], { stdio: "ignore" });
