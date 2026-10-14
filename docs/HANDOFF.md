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

## En pausa (14-10-2026, a pedido del propietario)

Pidió: rivales distintos en cada contrainterrogatorio (incluido el Contralor), modalidades de juego nuevas,
más fluidez y un diseño de tarjetas menos genérico. Quedó hecho sólo el andamiaje:
- `src/ui/tokens.css`: identidad «la papelería del Estado» (papel oficio, cartón, tintas, tricolor, paño verde,
  fuente de máquina de escribir Courier Prime, ya cargada en `index.html`).
- `src/content/tipos.ts`: tipos `Plazo` (calendario de días hábiles), `Armado` (armar el decreto) y `cintas`
  (toma de razón contrarreloj), opcionales en `BancoModulo`. Sin componentes ni contenido todavía.
Plan al retomar: rivales nuevos (Concejal Morales j3, Don Braulio j6, Contralor Ossandón en duelo j7,
Abogado Kevin Soto j9, Abogado Larraín j10; Riquelme queda en j5 y j8) con lentes/bigote/calvo en
`characters.ts`; las tres modalidades reemplazan a los «urgentes» en j2 (armado), j5 (calendario) y j7 (cinta);
rediseño de tarjetas (carátula de expediente, fichas de índice, acta de cierre con timbres, sala de audiencia)
y cola de avisos para que no se encimen. Faltan por probar las jornadas 3, 4, 7, 8, 10, 11 y el móvil.
