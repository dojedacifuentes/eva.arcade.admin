# POTESTAS — estado y traspaso

Juego 2D de Derecho Administrativo y Público chileno (EVA ARCADE). Repo público
`dojedacifuentes/eva.arcade.admin`, rama `main`. Sin Vercel todavía. Diseño en `docs/POTESTAS.md`.

## Cómo se trabaja

- Desarrollo: `npm run dev` (http://127.0.0.1:5176).
- Prueba completa: `npm run probar -- 1 5 6 9 12` (y `--movil`). Compila a `../.potestas-verif`, la sirve
  en el puerto 5179 y juega cada jornada sola con `tools/pruebas/recorrido.js` (Chrome sin interfaz,
  `tools/captura.mjs`). Capturas en `docs/capturas/jN/`. Una jornada vale si llega a `fin-jN` sin errores.
- Minijuegos sueltos: `minijuegos.html` (sólo en desarrollo; `src/dev/minijuegos.ts`).
- Arte pintado en código: `node tools/exportar-arte.mjs` (con el servidor de desarrollo arriba) exporta
  edificios y muebles a PNG. Mapas: `tools/generar-ciudad.mjs --forzar` y `tools/generar-interiores.mjs --forzar`
  (aún no se han editado a mano en Tiled: regenerar es seguro mientras eso siga así).
- Sonido: `node tools/sintetizar-sonidos.mjs <nombres>` (chiptune propio; ffmpeg).
- Autorización del propietario (14-10-2026): seguir sin detenerse; commit y push tras verificar.

## Trampas conocidas

- **No probar contra el servidor de desarrollo**: cualquier archivo editado recarga la página y corta el
  recorrido. Por eso `probar.mjs` usa una compilación.
- **El mundo nace quieto** (`Mundo.quieto = true` detrás del título): cada jornada llama `m.bloquear(false)`.
- **Puntos del mapa**: los vecinos de ambiente usan `amb-1..3`; los guiones, `vecino-1..4`, `hoyo`, `franja`,
  `paradero`. Si comparten punto, el jugador le habla al equivocado.
- **`offsetParent` es null** en elementos `position: fixed` (el Expediente del contrainterrogatorio):
  en las pruebas usar `hidden`.
- **La ruta del proyecto tiene espacios** («PROYECTO EVA01»): con `npx` por consola usar rutas relativas.
- Datos jurídicos pendientes de revisión: `docs/REVISION_JURIDICA.md` (el propietario es abogado y revisa).

## Pendiente

- Publicar en Vercel (proyecto nuevo en la cuenta del propietario; preset Vite, raíz `./`).
- Enlazar desde EVA ARCADE (`eva.proyecto01`, regla del «sí» del propietario).
