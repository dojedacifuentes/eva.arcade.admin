# Cómo editar la ciudad en Tiled

1. Abre Tiled (`../herramientas/Tiled`) y carga el mapa. Se abre Tiled con la ciudad (public/assets/mapas/ciudad.tmj).
2. A la derecha están las **capas**. Elige la capa antes de pintar:
   - `suelo`: pasto (con o sin flores).
   - `caminos`: veredas, plaza, tierra.
   - `obj`: la base de cada cosa sólida (tronco de árbol, pie del farol, banco, basurero). No se puede atravesar.
   - `obj-alto`: la parte de arriba (copa del árbol, cabeza del farol). Va justo encima de su base y tapa al personaje cuando pasa por detrás.
   - `edificios`: los edificios son imágenes; se arrastran con la herramienta de selección. Su rectángulo es sólido.
   - `colision`: rectángulos invisibles que bloquean el paso (por ejemplo, la fuente).
   - `puntos`: dónde empieza el jugador, las puertas, la fuente y los vecinos.
3. Abajo a la derecha están las **piezas** (`pueblo`, `ciudad`, `edificios`). Haz clic en una y pinta con la herramienta de sello (tecla B). Borrar: tecla E.
4. Guarda con **Ctrl+S** y recarga el juego en el navegador.

Las piezas de `pueblo` y `ciudad` son de Kenney (licencia CC0, libre). Los edificios son nuestros: su dibujo
vive en `src/game/maps/ciudad.ts` y se vuelven a exportar a PNG con `node tools/exportar-arte.mjs`.

No vuelvas a correr `tools/generar-ciudad.mjs` sin `--forzar` consciente: creó la primera versión y sobrescribiría lo editado.
