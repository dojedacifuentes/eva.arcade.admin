# Cómo escribir el banco de contenido de POTESTAS

Un archivo por módulo en `src/content/banco/mNN-<id>.ts` (por ejemplo `m01-bases.ts`), que exporta
`export const BANCO_M01: BancoModulo = { modulo: 1, hallazgos: [...], afirmaciones: [...], fichas: [...], quiz: [...], orales: [...], columnas: [...], cadenas: [...], expedientes: [...] };`
con los tipos de `src/content/tipos.ts` (`import type { BancoModulo } from "../tipos";`). Los módulos
(número, id, título, lugar, normas) están en `src/content/modulos.ts`.

## Cantidades por módulo

- `hallazgos`: 5 a 7. Son lo que el jugador descubre jugando; cada uno con `titulo` corto, `texto` de 1 a 3
  frases, `norma` exacta y `simple` (una frase con humor, en voz de EVA).
- `afirmaciones`: exactamente 2 por hallazgo (una verdadera, una falsa), con `hallazgo` = id del hallazgo
  y `porque` con la norma.
- `fichas`: 12 a 25 (deduplicadas: si dos repos dicen lo mismo, una sola).
- `quiz`: 8 a 15, de 3 o 4 opciones, `correcta` es el índice (0 en adelante), `porque` explica.
- `orales`: 1 a 3. `claves` son 5 a 8 ideas cortas (3 a 8 palabras) que forman la respuesta modelo;
  `trampas` son 3 a 5 ideas plausibles pero equivocadas o fuera de lugar. `modelo` es la respuesta
  completa en 3 a 5 frases.
- `columnas`: 1 a 2 (8 a 12 ítems cada una), sólo si el tema compara dos cosas.
- `cadenas`: 0 a 2 (5 a 8 pasos), sólo si hay una secuencia real (etapas, ruta del silencio, expropiación).
- `expedientes`: 4 a 6. Cada uno es un documento con un problema (o sin él) que llega a la Mesa:
  `relato` (quién lo trae, 1–2 frases), `documento` (tipo + 4 a 7 campos `k`/`v`, como «Órgano», «Firma»,
  «Fecha», «Motivo», «Dispone», «Notificado el»), `pregunta`, y 3 o 4 `sellos` (uno solo `correcto: true`),
  cada uno con `porque`. Al menos uno de los expedientes del módulo debe ser un documento SIN vicio
  (el sello correcto es «VÁLIDO» o equivalente), para que el jugador no asuma que todo está malo.

## Ids

En minúsculas, sin tildes, con guiones: `m03-vicio-competencia`. Prefijo del módulo en todos los ids.

## Voz

Español de Chile neutro, tratando de tú. Directo, sin jerga innecesaria; la norma siempre al final o en
`norma`. La voz de EVA (para `simple` y `porque`): primero informa, después remata; un remate como máximo;
ironía burocrática o jurídica; ego alto, hostilidad cero. Nada de bromas sobre privacidad o datos. Ejemplo
de `simple`: «La Administración también tiene fecha de vencimiento: dos años para arrepentirse».

## Verificación jurídica (obligatoria)

Cada norma citada se comprueba contra el texto oficial de la BCN que está en XML en
`C:\Users\Asus\AppData\Local\Temp\bcn\`: `l19880.xml` (Ley 19.880), `cpr.xml` (Constitución),
`locbgae.xml` (Ley 18.575), `locmun.xml` (Ley 18.695), `l18834.xml` (Estatuto Administrativo),
`l20285.xml` (Transparencia), `l19886.xml` (Compras Públicas), `l10336.xml` (Contraloría), `cc.xml` (Código
Civil). El texto de un artículo se encuentra con grep (por ejemplo `grep -o "Artículo 53[^<]*" l19880.xml`
o leyendo el XML alrededor de la cadena). El DL 2.186 (expropiaciones) no está bajado: intenta
`https://www.bcn.cl/leychile/Consulta/obtxml?opt=7&idNorma=6848` (si responde 429, espera 30 s y
reintenta; máximo 4 intentos) y guárdalo como `dl2186.xml`; si no se puede, cita el DL por número de
artículo según los apuntes y marca `fuente: "proceadmin"`.

Errores conocidos de los apuntes que NO se copian:
1. Silencio administrativo: vencido el plazo, el interesado denuncia; la autoridad tiene 5 días; luego se
   pide certificado (art. 64). Silencio negativo: asuntos que afecten el patrimonio fiscal, actuación de
   oficio, impugnaciones o revisiones de actos, y derecho de petición (art. 65). No existen «6 meses».
2. Irretroactividad: art. 52 (no 57). Firmeza y ejecutoriedad: arts. 51 y 57 (revisa el texto).
3. Subsanación: art. 31, 5 días para que el interesado subsane.
4. Recurso extraordinario de revisión: art. 60 (revisa plazo y ante quién en el XML).
5. Notificación: art. 45 (revisa el plazo real en el XML).
6. Jurisprudencia: sólo con rol y año si los apuntes los traen; si no, por nombre y marcada como doctrina
   en `porque`/`dorso`. Nunca inventar roles.

Todo lo que no se pueda verificar en los XML se anota al final del archivo en un comentario
`// PENDIENTE DE REVISIÓN: ...` para `docs/REVISION_JURIDICA.md`.

## Formato del archivo

- LF, UTF-8, comillas dobles, punto y coma, 2 espacios; comentarios en español.
- Al terminar, desde la raíz del proyecto: `npx tsc --noEmit` debe pasar sin errores (el archivo debe
  compilar contra `tipos.ts`). Si falla por otro archivo ajeno, informarlo; si falla por el propio, arreglarlo.
- No tocar ningún otro archivo del proyecto.
