// Sintetiza los efectos y la música provisional del juego (chiptune cálido) y
// los deja en public/assets/audio como MP3. Sin dependencias: ondas calculadas
// a mano, WAV temporal y ffmpeg para comprimir.
// Uso: node tools/sintetizar-sonidos.mjs
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SR = 22050;
// node tools/sintetizar-sonidos.mjs latido tijera …  → solo esos (los demás no se tocan).
const SOLO = process.argv.slice(2);
const DESTINO = "public/assets/audio";
mkdirSync(DESTINO, { recursive: true });

const nota = (n) => 440 * Math.pow(2, (n - 69) / 12); // MIDI → Hz
const ondas = {
  cuadrada: (f, t, ancho = 0.5) => ((t * f) % 1 < ancho ? 1 : -1),
  triangulo: (f, t) => 1 - 4 * Math.abs(((t * f + 0.25) % 1) - 0.5),
  seno: (f, t) => Math.sin(2 * Math.PI * f * t),
  ruido: () => Math.random() * 2 - 1,
};

function buffer(seg) { return new Float32Array(Math.ceil(seg * SR)); }
/** Suma un tono con envolvente ADSR simple. */
function tono(b, { ini = 0, dur, f, f2, onda = "cuadrada", vol = 0.3, a = 0.005, r = 0.05, ancho = 0.5, vibrato = 0 }) {
  const i0 = Math.floor(ini * SR), n = Math.floor(dur * SR);
  let fase = 0;
  for (let i = 0; i < n && i0 + i < b.length; i++) {
    const t = i / SR;
    const fr = (f2 ? f + (f2 - f) * (i / n) : f) * (1 + vibrato * Math.sin(2 * Math.PI * 5.5 * t));
    fase += fr / SR;
    const env = Math.min(1, t / a) * Math.min(1, (dur - t) / r);
    const s = onda === "ruido" ? ondas.ruido() : onda === "seno" ? Math.sin(2 * Math.PI * fase) : onda === "triangulo" ? 1 - 4 * Math.abs(((fase + 0.25) % 1) - 0.5) : (fase % 1 < ancho ? 1 : -1);
    b[i0 + i] += s * vol * Math.max(0, env);
  }
  return b;
}

function guardar(nombre, b, bitrate = "64k") {
  if (SOLO.length && !SOLO.includes(nombre)) return;
  let max = 0; for (const v of b) max = Math.max(max, Math.abs(v));
  const k = max > 0.95 ? 0.95 / max : 1;
  const wav = Buffer.alloc(44 + b.length * 2);
  wav.write("RIFF", 0); wav.writeUInt32LE(36 + b.length * 2, 4); wav.write("WAVE", 8);
  wav.write("fmt ", 12); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write("data", 36); wav.writeUInt32LE(b.length * 2, 40);
  b.forEach((v, i) => wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * k)) * 32767), 44 + i * 2));
  const tmp = join(tmpdir(), `${nombre}.wav`);
  writeFileSync(tmp, wav);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tmp, "-codec:a", "libmp3lame", "-b:a", bitrate, join(DESTINO, `${nombre}.mp3`)]);
  rmSync(tmp);
  console.log("→", nombre);
}

// ── Efectos ────────────────────────────────────────────────────────────────
guardar("voz", tono(buffer(0.045), { dur: 0.045, f: 560, vol: 0.18, ancho: 0.25, r: 0.03 }));
guardar("voz-eva", tono(tono(buffer(0.06), { dur: 0.06, f: 1180, onda: "seno", vol: 0.16 }), { dur: 0.06, f: 1770, onda: "seno", vol: 0.06 }));
guardar("mover", tono(buffer(0.03), { dur: 0.03, f: 1300, vol: 0.12, ancho: 0.25 }));
guardar("elegir", tono(tono(buffer(0.16), { dur: 0.07, f: nota(76), vol: 0.2, ancho: 0.25 }), { ini: 0.07, dur: 0.09, f: nota(83), vol: 0.2, ancho: 0.25 }));
guardar("cobrar", tono(tono(buffer(0.35), { dur: 0.07, f: nota(83), vol: 0.22, ancho: 0.5 }), { ini: 0.07, dur: 0.28, f: nota(88), vol: 0.22, r: 0.2 }));
{ const b = buffer(0.42); tono(b, { dur: 0.04, f: 0, onda: "ruido", vol: 0.25 }); tono(b, { ini: 0.05, dur: 0.12, f: nota(79), vol: 0.18 }); tono(b, { ini: 0.17, dur: 0.25, f: nota(72), vol: 0.18, r: 0.2 }); guardar("pagar", b); }
{ const b = buffer(0.75); for (const ini of [0, 0.38]) { tono(b, { ini, dur: 0.12, f: 190, vol: 0.18, ancho: 0.3 }); tono(b, { ini: ini + 0.14, dur: 0.12, f: 190, vol: 0.18, ancho: 0.3 }); } tono(b, { ini: 0.02, dur: 0.1, f: nota(88), onda: "seno", vol: 0.12 }); tono(b, { ini: 0.12, dur: 0.14, f: nota(84), onda: "seno", vol: 0.12 }); guardar("telefono", b); }
{ const b = buffer(0.6); [72, 76, 79].forEach((n, i) => tono(b, { ini: i * 0.07, dur: 0.45 - i * 0.07, f: nota(n), onda: "triangulo", vol: 0.2, r: 0.3 })); guardar("objetivo", b); }
{ const b = buffer(1.0); [88, 84, 91, 95].forEach((n, i) => tono(b, { ini: i * 0.09, dur: 0.7, f: nota(n), onda: "seno", vol: 0.12, r: 0.5, vibrato: 0.006 })); tono(b, { dur: 0.9, f: nota(55), onda: "seno", vol: 0.1, r: 0.6 }); guardar("eva", b); }
{ const b = buffer(1.3); [60, 64, 67, 72].forEach((n, i) => tono(b, { ini: i * 0.08, dur: 0.18, f: nota(n), onda: "cuadrada", vol: 0.16, ancho: 0.25 })); tono(b, { ini: 0.34, dur: 0.9, f: nota(76), onda: "triangulo", vol: 0.22, r: 0.6 }); tono(b, { ini: 0.34, dur: 0.9, f: nota(84), onda: "seno", vol: 0.1, r: 0.6 }); for (let i = 0; i < 8; i++) tono(b, { ini: 0.4 + i * 0.07, dur: 0.05, f: nota(96 + (i % 3) * 3), onda: "seno", vol: 0.06 }); guardar("hallazgo", b); }
{ const b = buffer(1.4); for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = (Math.random() * 2 - 1) * 0.18 * Math.sin(Math.PI * Math.min(1, t / 1.4)); } let y = 0; for (let i = 0; i < b.length; i++) { y += 0.08 * (b[i] - y); b[i] = y * 3; } guardar("tiempo", b); }
{ const b = buffer(0.25); for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = (Math.random() * 2 - 1) * 0.2 * Math.exp(-t * 18) * (0.6 + 0.4 * Math.sin(t * 300)); } guardar("papel", b); }
{ const b = buffer(0.35); tono(b, { dur: 0.08, f: 0, onda: "ruido", vol: 0.12 }); tono(b, { ini: 0.02, dur: 0.3, f: 120, f2: 70, onda: "seno", vol: 0.3, r: 0.2 }); guardar("puerta", b); }
{ const b = buffer(0.5); [79, 83, 86].forEach((n, i) => tono(b, { ini: i * 0.06, dur: 0.3, f: nota(n), onda: "triangulo", vol: 0.18, r: 0.2 })); guardar("corazon", b); }

// ── Música: «Barrio Las Acacias» (16 compases, 96 bpm, en bucle) ───────────
{
  const bpm = 96, negra = 60 / bpm, compas = negra * 4, compases = 16;
  const b = buffer(compas * compases);
  // C – Am – F – G, dos veces con un final distinto
  const acordes = [[48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50], [48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50]];
  for (let c = 0; c < compases; c++) {
    const ac = acordes[Math.floor(c / 2)], t0 = c * compas;
    // bajo: tónica en 1 y 3, quinta en 2 y 4
    [0, 1, 2, 3].forEach((q) => tono(b, { ini: t0 + q * negra, dur: negra * 0.9, f: nota(ac[q % 2 === 0 ? 0 : 2] - 12), onda: "triangulo", vol: 0.22, r: 0.08 }));
    // arpegio suave en corcheas
    for (let k = 0; k < 8; k++) tono(b, { ini: t0 + k * negra / 2, dur: negra / 2 * 0.8, f: nota(ac[[0, 1, 2, 1][k % 4]] + 12), onda: "cuadrada", ancho: 0.125, vol: 0.05, r: 0.05 });
  }
  // melodía (MIDI, duración en negras); 0 = silencio
  const mel = [
    [76, 1], [79, 1], [81, 1.5], [79, 0.5], [76, 2], [72, 1], [74, 1],
    [76, 1], [72, 1], [69, 2], [0, 1], [72, 0.5], [74, 0.5], [76, 2],
    [77, 1], [76, 1], [74, 1.5], [72, 0.5], [69, 2], [72, 1], [74, 1],
    [79, 1.5], [77, 0.5], [76, 1], [74, 1], [74, 2], [0, 2],
    [76, 1], [79, 1], [81, 1.5], [79, 0.5], [76, 2], [72, 1], [74, 1],
    [76, 1], [72, 1], [69, 2], [0, 1], [72, 0.5], [74, 0.5], [76, 2],
    [77, 1], [81, 1], [79, 1.5], [77, 0.5], [76, 1], [74, 1], [72, 1], [74, 1],
    [72, 6], [0, 2],
  ];
  let t = 0;
  for (const [n, d] of mel) { if (n) tono(b, { ini: t, dur: d * negra * 0.92, f: nota(n), onda: "triangulo", vol: 0.2, a: 0.01, r: 0.12, vibrato: 0.004 }); t += d * negra; }
  // escobilla suave
  for (let k = 0; k < compases * 8; k++) tono(b, { ini: k * negra / 2, dur: 0.03, f: 0, onda: "ruido", vol: k % 2 ? 0.025 : 0.04 });
  guardar("musica-barrio", b, "80k");
}

// ── Capítulo 5 ─────────────────────────────────────────────────────────────
{ const b = buffer(0.32); tono(b, { dur: 0.05, f: 0, onda: "ruido", vol: 0.35 }); tono(b, { ini: 0.01, dur: 0.28, f: 180, f2: 60, onda: "cuadrada", ancho: 0.3, vol: 0.22, r: 0.2 }); guardar("golpe", b); }
{ const b = buffer(0.6); for (let k = 0; k < 9; k++) tono(b, { ini: k * 0.035 + Math.random() * 0.02, dur: 0.03, f: 0, onda: "ruido", vol: 0.28 - k * 0.02 }); tono(b, { ini: 0.02, dur: 0.5, f: 90, f2: 55, onda: "seno", vol: 0.25, r: 0.35 }); guardar("grieta", b); }
{ const b = buffer(1.4); [[93, 0.22], [100, 0.08], [105, 0.05]].forEach(([n, v]) => tono(b, { dur: 1.35, f: nota(n), onda: "seno", vol: v, a: 0.002, r: 1.2 })); guardar("campana", b); }
{ const b = buffer(0.45); [74, 79].forEach((n, i) => tono(b, { ini: i * 0.08, dur: 0.3, f: nota(n), onda: "seno", vol: 0.16, r: 0.2 })); guardar("escuchar", b); }
// Música: «Las grietas» (el tema del barrio en menor, más lento, con lluvia)
{
  const bpm = 72, negra = 60 / bpm, compas = negra * 4, compases = 16;
  const b = buffer(compas * compases);
  const acordes = [[45, 48, 52], [41, 45, 48], [48, 52, 55], [43, 47, 50], [45, 48, 52], [41, 45, 48], [38, 41, 45], [40, 44, 47]];
  for (let c = 0; c < compases; c++) {
    const ac = acordes[Math.floor(c / 2)], t0 = c * compas;
    [0, 2].forEach((q) => tono(b, { ini: t0 + q * negra, dur: negra * 1.9, f: nota(ac[0] - 12), onda: "triangulo", vol: 0.2, r: 0.3 }));
    for (let k = 0; k < 8; k++) tono(b, { ini: t0 + k * negra / 2, dur: negra / 2 * 0.9, f: nota(ac[[0, 1, 2, 1][k % 4]] + 12), onda: "seno", vol: 0.06, r: 0.1 });
  }
  const mel = [
    [76, 1], [77, 1], [76, 2], [72, 2], [74, 2],
    [72, 1], [69, 1], [72, 2], [0, 2], [71, 2],
    [69, 1], [72, 1], [76, 1.5], [74, 0.5], [72, 2], [69, 2],
    [74, 2], [72, 1], [71, 1], [69, 4],
    [76, 1], [77, 1], [79, 2], [77, 1], [76, 1], [74, 2],
    [72, 1], [74, 1], [76, 2], [0, 2], [72, 2],
    [69, 1], [72, 1], [74, 1.5], [72, 0.5], [71, 2], [68, 2],
    [69, 6], [0, 2],
  ];
  let t = 0;
  for (const [n, d] of mel) { if (n) tono(b, { ini: t, dur: d * negra * 0.95, f: nota(n), onda: "triangulo", vol: 0.18, a: 0.02, r: 0.25, vibrato: 0.005 }); t += d * negra; }
  // lluvia suave de fondo (ruido filtrado)
  let y = 0; for (let i = 0; i < b.length; i++) { y += 0.05 * ((Math.random() * 2 - 1) - y); b[i] += y * 0.35; }
  guardar("musica-grietas", b, "80k");
}

// Música: «El tribunal» (re menor, 66 bpm: órgano suave y un reloj que no se detiene)
{
  const bpm = 66, negra = 60 / bpm, compas = negra * 4, compases = 12;
  const b = buffer(compas * compases);
  const acordes = [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 49, 52], [50, 53, 57], [43, 46, 50]];
  for (let c = 0; c < compases; c++) {
    const ac = acordes[Math.floor(c / 2) % acordes.length], t0 = c * compas;
    for (const n of ac) { tono(b, { ini: t0, dur: compas * 0.98, f: nota(n), onda: "triangulo", vol: 0.07, a: 0.4, r: 0.6 }); tono(b, { ini: t0, dur: compas * 0.98, f: nota(n + 12), onda: "seno", vol: 0.04, a: 0.4, r: 0.6 }); }
    tono(b, { ini: t0, dur: compas * 0.95, f: nota(ac[0] - 12), onda: "seno", vol: 0.16, a: 0.2, r: 0.5 });
    for (let k = 0; k < 4; k++) tono(b, { ini: t0 + k * negra, dur: 0.025, f: 0, onda: "ruido", vol: k % 2 ? 0.03 : 0.05 });
  }
  const mel = [[74, 2], [72, 1], [70, 1], [69, 4], [70, 2], [72, 2], [74, 4], [77, 2], [76, 1], [74, 1], [73, 4], [74, 3], [0, 1], [69, 4], [70, 2], [69, 2], [67, 4], [65, 2], [64, 2], [62, 8]];
  let t = 0;
  for (const [n, d] of mel) { if (n) tono(b, { ini: t, dur: d * negra * 0.95, f: nota(n), onda: "seno", vol: 0.14, a: 0.05, r: 0.4, vibrato: 0.004 }); t += d * negra; }
  guardar("musica-tribunal", b, "80k");
}

// ── Prólogo: nacer ─────────────────────────────────────────────────────────
// El latido de adentro (dos golpes graves y suaves).
{ const b = buffer(0.7); tono(b, { dur: 0.12, f: 70, f2: 45, onda: "seno", vol: 0.5, a: 0.01, r: 0.09 }); tono(b, { ini: 0.2, dur: 0.14, f: 62, f2: 40, onda: "seno", vol: 0.38, a: 0.01, r: 0.1 }); guardar("latido", b); }
// La tijera del cordón: dos chasquidos y un brillo.
{ const b = buffer(0.5); [0, 0.13].forEach((t) => { tono(b, { ini: t, dur: 0.025, f: 0, onda: "ruido", vol: 0.4 }); tono(b, { ini: t, dur: 0.06, f: 2400, f2: 1800, onda: "cuadrada", ancho: 0.2, vol: 0.08 }); }); tono(b, { ini: 0.2, dur: 0.28, f: nota(96), onda: "seno", vol: 0.1, r: 0.25 }); guardar("tijera", b); }
// Un «buaa» de guagua: sube, tiembla y cae.
{ const b = buffer(0.62); tono(b, { dur: 0.6, f: 470, f2: 380, onda: "cuadrada", ancho: 0.35, vol: 0.14, a: 0.04, r: 0.2, vibrato: 0.05 }); tono(b, { dur: 0.6, f: 940, f2: 760, onda: "seno", vol: 0.05, a: 0.04, r: 0.2, vibrato: 0.05 }); guardar("llanto", b); }
// Pujar: un empujón que sube.
{ const b = buffer(0.32); tono(b, { dur: 0.3, f: 160, f2: 330, onda: "triangulo", vol: 0.3, a: 0.02, r: 0.12 }); guardar("pujar", b); }
// Música: «Cajita de música» (canción de cuna propia, 3/4, 84 bpm). Suena al nacer y al final.
{
  const bpm = 84, negra = 60 / bpm, compas = negra * 3, compases = 16;
  const b = buffer(compas * compases + 1);
  const bajos = [48, 43, 45, 41, 48, 43, 41, 43, 48, 43, 45, 40, 41, 43, 48, 48];
  bajos.forEach((n, c) => {
    const t0 = c * compas;
    tono(b, { ini: t0, dur: negra * 2.8, f: nota(n), onda: "seno", vol: 0.12, a: 0.02, r: 0.8 });
    [1, 2].forEach((q) => tono(b, { ini: t0 + q * negra, dur: negra * 0.9, f: nota(n + 12 + (q === 1 ? 4 : 7)), onda: "seno", vol: 0.04, r: 0.3 }));
  });
  const mel = [
    [76, 1], [79, 1], [76, 1], [74, 2], [72, 1], [74, 1], [76, 1], [72, 1], [69, 3],
    [72, 1], [74, 1], [76, 1], [79, 2], [81, 1], [79, 1], [76, 1], [74, 1], [72, 3],
    [76, 1], [79, 1], [84, 1], [83, 2], [81, 1], [79, 1], [81, 1], [76, 1], [77, 3],
    [76, 1], [74, 1], [72, 1], [74, 2], [71, 1], [72, 6],
  ];
  let t = 0;
  // Cajita: notas que golpean y se apagan, con un eco una octava arriba.
  for (const [n, d] of mel) {
    tono(b, { ini: t, dur: Math.min(d * negra, 1.4), f: nota(n + 12), onda: "seno", vol: 0.16, a: 0.002, r: Math.min(d * negra, 1.4) * 0.9 });
    tono(b, { ini: t, dur: 0.5, f: nota(n + 24), onda: "seno", vol: 0.03, a: 0.002, r: 0.45 });
    t += d * negra;
  }
  guardar("musica-cuna", b, "80k");
}
