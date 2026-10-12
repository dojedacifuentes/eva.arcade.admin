# POTESTAS · un juego de EVA ARCADE

El poder del Estado tiene límites. Encuéntralos.

Juego 2D de **Derecho Administrativo y Público chileno**. Eres la abogada o el abogado nuevo de la
Municipalidad de Potestas: doce jornadas, doce módulos (bases y organización, acto administrativo,
vicios e invalidación, procedimiento, plazos y silencio, potestad sancionadora, Contraloría y recursos,
contencioso, responsabilidad del Estado, nulidad de derecho público, Tribunal Constitucional y
expropiación). Cada jornada: un encargo, una Apuesta EVA, la Mesa de expedientes, trabajo en terreno y
un jefe (duelo de argumentos o comisión oral).

Reúne y ordena seis repos de apuntes (`ACTO-ADMIN`, `procedimiento-admin`, `guia-rpe`, `iuspublic`,
`derecho-sancionador-admin`, `proceadmin-rpg`), contrastados con el texto vigente de la BCN.

## Ejecutar

```bash
npm install
npx vite --port 5176      # http://127.0.0.1:5176
npm run build             # tipos + compilación de producción
```

Stack: Phaser 3.90, TypeScript, Vite, GSAP, Howler. Sin backend: el progreso se guarda en el navegador.

## Documentación

- `docs/POTESTAS.md`: diseño (módulos, sistemas de juego, gráfica).
- `docs/BANCO_INSTRUCCIONES.md`: cómo se escribe y verifica el banco de contenido.
- `docs/REVISION_JURIDICA.md`: lo que falta revisar con un profesor o un abogado.
- `docs/MAPAS.md`: cómo editar la ciudad en Tiled.

Este juego enseña Derecho chileno con simplificaciones. No es asesoría legal.

Arte: personajes, edificios y muebles pintados en código; baldosas de Kenney (CC0, licencias en
`assets-fuente/kenney/`). Tipografías Atkinson Hyperlegible, Pixelify Sans y Silkscreen (OFL).
