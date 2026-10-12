# POTESTAS · un juego de EVA ARCADE

**Derecho Administrativo y Público chileno, jugando.** El poder del Estado tiene límites: el juego
consiste en encontrarlos. Une seis repos de apuntes (`ACTO-ADMIN`, `procedimiento-admin`,
`guia-rpe`, `iuspublic`, `derecho-sancionador-admin`, `proceadmin-rpg`) en un solo banco ordenado
por módulos y los convierte en un juego 2D con la base técnica del Familia RPG (`eva-arcade-familia-rpg`:
Phaser 3.90 + TypeScript + Vite, interfaz en HTML con GSAP, sonido con Howler) pero con otra
jugabilidad, más gráfica y más sistemas de juego.

## Premisa

Eres el abogado o la abogada nuevo/a de la **Dirección Jurídica de la Municipalidad de Potestas**, una
ciudad donde la Alcaldesa, los directores y los vecinos ponen a prueba cada día hasta dónde llega
el poder público. Cada módulo es una **jornada**: un problema entra por la puerta, se resuelve en la
ciudad (Municipalidad, Oficina de Partes, Contraloría, Tribunales, Tribunal Constitucional, el barrio
que se expropia…) y el Derecho se descubre jugando. EVA acompaña, comenta y apuesta.

## Doce módulos (jornadas)

| # | Jornada | Lugar | Derecho |
|---|---|---|---|
| 1 | El primer día | Municipalidad, plaza | Juridicidad (arts. 6–7 CPR), LBGAE, organización, actividad formal/material, servicio público |
| 2 | La fábrica de actos | Oficina de Partes | Acto administrativo: concepto, clasificaciones, elementos (órgano, investidura, competencia; motivo, objeto, fin; forma) |
| 3 | La autopsia | Dirección Jurídica | Eficacia, vicios, extinción, invalidación vs. revocación (arts. 51–53, 61) |
| 4 | La fila | Servicio de Atención | Ley 19.880: principios, sujetos, etapas |
| 5 | El reloj | Oficina de Partes | Plazos, notificación, silencio positivo y negativo (arts. 25, 45–47, 64–66) |
| 6 | La multa | Dirección de Fiscalización | Policía y potestad sancionadora: tipicidad, culpabilidad, non bis in idem, proporcionalidad, decaimiento |
| 7 | Contraloría | Contraloría Regional | Recursos administrativos (reposición, jerárquico, revisión), toma de razón, dictámenes |
| 8 | Tribunales | Corte de Apelaciones | Contencioso: protección, reclamación de ilegalidad municipal, acción de nulidad, plazos |
| 9 | El hoyo en la vereda | Juzgado Civil | Responsabilidad patrimonial del Estado: falta de servicio, daño, causalidad, defensas del CDE |
| 10 | Nulo de pleno derecho | Dirección Jurídica | Nulidad de derecho público vs. invalidación |
| 11 | El Tribunal Constitucional | TC | Supremacía constitucional, inaplicabilidad, atribuciones |
| 12 | La franja | Barrio expropiado | Expropiación: art. 19 N° 24 CPR, DL 2.186, etapas, indemnización, Galletué |

Cada jornada dura 10–15 minutos, se puede elegir desde el título y trae su Derecho temprano: el
primer hallazgo llega antes del segundo minuto.

## Sistemas de juego

**Mundo** (igual que el Familia RPG, mejorado): ciudad 2D vista desde arriba, WASD/flechas o joystick
táctil, correr, «Ir ›» (viaje rápido), objetivo siempre visible, puertas, personajes, EVA.

**Minijuegos nuevos** (todos en HTML sobre el lienzo, teclado y táctil):

- **La Mesa** (`src/ui/mesa.ts`): llegan expedientes a tu escritorio. Lees el documento (un decreto,
  una resolución, una notificación), detectas el problema y **timbras**: VÁLIDO · NULO · SUBSANAR ·
  INVALIDAR · REVOCAR… con su fundamento. Racha, reloj suave (sin reloj en modo historia), EVA explica.
  Sirve para los módulos 2, 3, 5, 6 y 7.
- **La Cadena** (`src/ui/cadena.ts`): ordenar los pasos de un procedimiento (iniciación → instrucción
  → finalización; las 7 etapas de la expropiación; la ruta del silencio positivo). Módulos 4, 5, 12.
- **Columnas** (`src/ui/columnas.ts`): clasificar afirmaciones en dos cajas (invalidación vs. NDP,
  sanción vs. medida correctiva, revocación vs. invalidación). Rápido, con racha. Módulos 3, 6, 10.
- **El Duelo** (`src/ui/duelo.ts`): un rival (el abogado del CDE, el Contralor, la Ministra) lanza un
  argumento; respondes con la carta correcta de tres. Barras de convicción. Jefes de módulo. 7–11.
- **La Comisión** (`src/ui/comision.ts`): examen oral. Una pregunta, una lista de ideas mezcladas:
  eliges las que forman la respuesta modelo (claves) y evitas las trampas. Puntúa por claves, como
  el `scoreKeys` de iuspublic. Todos los módulos; final del juego.

**Capa de aprendizaje** (ya existía; se adapta): hallazgos → medallitas → expediente; Saber y niveles
(Procurador/a → Abogado/a → Fiscal → Contralor/a → Ministro/a del TC); logros; Apuesta EVA;
«¿Lo pillaste?»; desafío de repaso con **repaso espaciado**: lo que fallas vuelve antes.

**Fichas**: las 190 flashcards son coleccionables en el expediente, por módulo, y alimentan el desafío.

## Banco de contenido

Todo vive en `src/content/banco/` (un archivo por módulo) con los tipos de `src/content/tipos.ts`:
`Ficha`, `PreguntaQuiz`, `Afirmacion` (V/F), `Oral`, `Columnas`, `Cadena`, `Expediente` (caso de la Mesa),
`Hallazgo`. Cada ítem lleva `modulo`, `norma` y `fuente` (repo de origen) para trazabilidad.

Correcciones ya detectadas al fusionar (no copiar los errores de origen):
1. Silencio administrativo: la ruta es vencimiento del plazo → denuncia del interesado → 5 días de
   la autoridad → certificado (arts. 64–65). Silencio negativo: patrimonio fiscal, actuación de
   oficio, impugnaciones/revisiones, derecho de petición (art. 65). Nada de «6 meses».
2. Irretroactividad: art. 52 (no 57). Firmeza/ejecutoriedad: arts. 51 y 57.
3. Subsanación: art. 31, 5 días para que el interesado subsane.
4. Recurso extraordinario de revisión: art. 60, ante el superior jerárquico «si lo hubiere o, en su
   defecto, la autoridad que lo hubiere dictado»; 1 año.
5. Notificación: 5 días desde que el acto quedó totalmente tramitado (art. 45).
6. Jurisprudencia: sólo con rol y año verificados; si no, se cita por nombre y se marca «doctrina».

Textos oficiales (BCN, XML) en `C:\Users\Asus\AppData\Local\Temp\bcn\`: Ley 19.880, CPR, LOC 18.575,
LOC 18.695, Código Civil, Estatuto 18.834, Ley 20.285, Ley 19.886. Pendientes: 10.336, DL 2.186 completo.

## Gráfica

Base: el motor del Familia RPG (tiles de 16 px, zoom entero, personajes de 16×24 pintados en código,
edificios pintados en código). Mejoras de POTESTAS:
- Ciudad grande con eje cívico (plaza, Municipalidad con columnas y bandera, Contraloría, Tribunales,
  TC), avenida, río, barrio que se expropia. Tilesets Kenney CC0: Tiny Town, RPG Urban, Roguelike
  Modern City, Roguelike RPG, Tiny Dungeon (`assets-fuente/kenney/`, licencias ahí).
- Post-proceso WebGL (Phaser FX): viñeta, luz de hora del día (mañana/tarde/noche con ventanas
  encendidas), lluvia, sombras de nubes, pájaros, partículas.
- Personajes con traje (abogado/a), respiración en reposo, sombra; NPC con roles (Alcaldesa,
  Contralor, Jueza, funcionarios, vecinos).
- Interfaz: hojas «papel oficial» con timbre, sellos animados, HUD con jornada y Saber.

## Verificación y publicación

`npm run build` (tsc + vite), `node tools/verificar.mjs [módulos] [--movil]` (Chrome sin interfaz,
recorridos automáticos por jornada, alcance de todo lo usable). Nada se publica sin pasar eso.
Repositorio y Vercel: por crear (el propietario crea el repo `eva.arcade.potestas` o autoriza).
