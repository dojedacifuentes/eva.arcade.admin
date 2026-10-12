// Recorrido automático de una jornada de POTESTAS (se ejecuta dentro de la
// página con tools/captura.mjs). Juega solo: entra por «Jornadas» (o crea la
// partida), avanza diálogos, apuesta, timbra la Mesa con el banco a la vista
// (con un error a propósito), arma la cadena, clasifica columnas, gana el duelo
// o la comisión, y espera la tarjeta de fin de jornada. Se teletransporta a cada
// objetivo (la flecha). Devuelve un resumen y deja capturas de los momentos clave.
// window.__jornada = n (por defecto 1) · window.__errores = true para probar los fallos.
(async () => {
  const N = window.__jornada ?? 1;
  const w = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (s) => document.querySelector(s);
  const visible = (s) => { const e = $(s); return !!e && !e.hidden && e.offsetParent !== null; };
  const tecla = async (code) => { dispatchEvent(new KeyboardEvent("keydown", { code, key: code })); await w(40); dispatchEvent(new KeyboardEvent("keyup", { code, key: code })); };
  const hasta = async (f, t = 15000) => { const t0 = performance.now(); while (performance.now() - t0 < t) { const v = f(); if (v) return v; await w(80); } return null; };
  const fotos = new Set(window.__fotos ?? ["titulo", "decreto", "cartel", "ciudad", "dialogo", "eva", "apuesta", "mesa", "mesa-timbre", "cadena", "columnas", "duelo", "comision", "fin", "expediente"]);
  const foto = async (n) => { if (fotos.has(n)) { fotos.delete(n); await window.capturar(n); } };
  const log = [];
  const B = () => window.__potestas.BANCOS.find((b) => b.modulo === N);

  // ── Título → Jornadas → decreto de nombramiento ──
  await hasta(() => $('button[data-r="jornadas"]'));
  await w(900);
  await foto("titulo");
  $('button[data-r="jornadas"]').click();
  (await hasta(() => $(`.jornada[data-n="${N}"]`))).click();
  if (await hasta(() => $("#c-listo"), 4000)) {
    await w(700);
    $("#c-nombre").value = "Valentina";
    await foto("decreto");
    $("#c-listo").click();
  }

  const mundo = () => window.juego.scene.getScene("mundo");
  let pasos = 0, quieto = 0, errorMesa = !!window.__errores, errorCol = !!window.__errores;
  while (pasos++ < 900) {
    const d = JSON.parse(localStorage.getItem("eva-potestas:partida") || "{}");
    if (d.paso === `fin-j${N}` || visible("#fin-capitulo")) { log.push("FIN DE JORNADA"); break; }
    // ── Minijuegos ──
    if ($(".mj-capa")) {
      quieto = 0;
      const cap = $(".mj-capa");
      // Botones de cierre o continuar (resultados, «Siguiente»).
      const seguir = [...cap.querySelectorAll("button")].find((b) => b.offsetParent && !b.disabled && /Siguiente|Seguir|Continuar|Terminar|Volver|Listo/i.test(b.textContent));
      if (seguir) { await w(500); seguir.click(); await w(500); continue; }
      if (cap.classList.contains("mj-mesa")) {
        const mat = $(".mj-doc-mat")?.textContent?.replace("MAT.: ", "") ?? "";
        const ex = B().expedientes.find((x) => x.titulo === mat);
        const btns = [...cap.querySelectorAll(".mj-sello-btn")].filter((b) => !b.disabled);
        if (ex && btns.length) {
          await w(700); await foto("mesa");
          const ok = ex.sellos.find((s) => s.correcto).texto;
          const b = errorMesa ? btns.find((x) => x.getAttribute("aria-label") !== ok) : btns.find((x) => x.getAttribute("aria-label") === ok);
          if (errorMesa) { errorMesa = false; log.push("mesa: error a propósito"); }
          (b ?? btns[0]).click();
          await w(900); await foto("mesa-timbre");
          continue;
        }
      }
      if (cap.querySelector(".mj-paso")) {
        const c = B().cadenas.find((x) => [...cap.querySelectorAll(".mj-paso-t")].some((t) => t.textContent === x.pasos[0])) ?? B().cadenas[0];
        const puestos = cap.querySelectorAll(".mj-hueco.lleno").length;
        const libre = [...cap.querySelectorAll(".mj-mazo .mj-paso")].find((b) => b.style.visibility !== "hidden" && b.isConnected && b.querySelector(".mj-paso-t").textContent === c.pasos[puestos]);
        if (libre) { await w(350); await foto("cadena"); libre.click(); await w(500); continue; }
      }
      if (cap.querySelector(".mj-tarjeta")) {
        const t = cap.querySelector(".mj-tarjeta");
        if (!t.classList.contains("bien") && !t.classList.contains("mal")) {
          const texto = t.querySelector("p")?.textContent;
          const it = B().columnas.flatMap((c) => c.items).find((x) => x.texto === texto);
          if (it) {
            await w(350); await foto("columnas");
            const lado = errorCol ? 1 - it.lado : it.lado;
            if (errorCol) { errorCol = false; log.push("columnas: error a propósito"); }
            cap.querySelector(lado ? ".mj-caja.der" : ".mj-caja.izq").click();
            await w(700); continue;
          }
        }
      }
      if (cap.querySelector(".mj-opcion")) {
        const ops = [...cap.querySelectorAll(".mj-opcion")];
        if (ops.every((b) => !b.disabled) && !cap.querySelector(".mj-opciones")?.hidden) {
          const boc = cap.querySelector(".mj-bocadillo");
          const q = B().quiz.find((x) => (boc?.getAttribute("aria-label") || "").includes(x.texto));
          if (q) {
            await w(500); await foto("duelo");
            const b = ops.find((x) => x.querySelector(".mj-opcion-t").textContent === q.opciones[q.correcta]);
            (b ?? ops[0]).click(); await w(900); continue;
          }
        }
      }
      if (cap.querySelector(".mj-idea")) {
        const pregunta = B().orales.find((o) => cap.textContent.includes(o.pregunta));
        if (pregunta && !cap.querySelector(".mj-resultado:not([hidden])")) {
          await w(600); await foto("comision");
          for (const t of pregunta.claves) { const c = [...cap.querySelectorAll(".mj-idea")].find((b) => b.textContent === t && !b.closest(".mj-respuesta")); if (c) { c.click(); await w(200); } }
          cap.querySelector(".mj-responder")?.click();
          await w(3000); continue;
        }
      }
      await w(250); continue;
    }
    if (visible("#tiempo")) { await w(700); await foto("cartel"); $("#tiempo").click(); await w(500); continue; }
    if (visible("#hallazgo")) { await w(700); await tecla("KeyE"); await w(500); continue; }
    if ($("#apuesta")) { await w(500); await foto("apuesta"); $("#apuesta .apuesta-op")?.click(); await w(1800); continue; }
    if (visible("#elecciones") && !$("#elecciones").dataset.cerrando) { await w(300); $("#elecciones button")?.click(); await w(400); continue; }
    if (visible("#dialogo")) {
      quieto = 0;
      if ($("#dialogo").classList.contains("es-eva")) { await w(400); await foto("eva"); } else { await w(300); await foto("dialogo"); }
      await tecla("KeyE"); await w(90); await tecla("KeyE"); await w(200);
      continue;
    }
    // Libre: ir a la flecha.
    const m = mundo(), j = m?.jugador;
    const meta = m?.metaPos ? m.metaPos() : null;
    if (j && meta) {
      if (m.mapa === "ciudad") await foto("ciudad");
      // Junto al objetivo, mirándolo, y usar.
      j.x = meta.x; j.y = meta.y + (m.mapa === "ciudad" ? 18 : 16); j.setDepth(j.y); j.mirar("arriba");
      await w(350); await tecla("KeyE"); await w(450);
      quieto = 0; continue;
    }
    if (++quieto > 80) { log.push("ATASCADO en «" + ($("#objetivo-texto")?.textContent ?? "") + "» paso " + d.paso + " mapa " + m?.mapa); break; }
    await w(250);
  }
  await hasta(() => visible("#fin-capitulo"), 20000);
  await w(1400);
  await foto("fin");
  const d = JSON.parse(localStorage.getItem("eva-potestas:partida") || "{}");
  return { log, pasos, paso: d.paso, jornada: d.jornada, hallazgos: d.hallazgos?.length, fichas: d.fichas?.length, saber: d.saber, estrellas: d.estrellas, mesa: d.mesa, flags: (d.flags || []).filter((f) => /^j\d+-r:/.test(f)) };
})()
