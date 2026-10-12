// Ciudad Potestas: los lugares y el dibujo de cada edificio. Dónde está cada
// uno lo decide el mapa de Tiled (public/assets/mapas/ciudad.tmj, generado por
// tools/generar-ciudad.mjs); aquí vive su aspecto, que tools/exportar-arte.mjs
// convierte en PNG.
import type { DefEdificio } from "../art/world";

export type Lugar = { id: string; nombre: string; edificio: DefEdificio; abierto: boolean; aviso?: string };

export const LUGARES: Lugar[] = [
  { id: "municipalidad", nombre: "Municipalidad de Potestas", abierto: true,
    edificio: { clave: "ed-municipalidad", ancho: 14, alto: 10, estilo: "civico", techo: "#c9c2b6", muro: "#efe8da", puerta: 6, icono: "escudo", rotulo: "MUNICIPALIDAD" } },
  { id: "partes", nombre: "Oficina de Partes", abierto: true,
    edificio: { clave: "ed-partes", ancho: 8, alto: 7, estilo: "oficina", techo: "#4f7a9a", muro: "#e7dcc4", puerta: 3, icono: "sello", rotulo: "OFICINA DE PARTES" } },
  { id: "juridica", nombre: "Dirección Jurídica", abierto: true,
    edificio: { clave: "ed-juridica", ancho: 9, alto: 7, estilo: "oficina", techo: "#6b4f9a", muro: "#ece4d2", puerta: 4, icono: "balanza", rotulo: "DIRECCION JURIDICA" } },
  { id: "atencion", nombre: "Servicio de Atención Ciudadana", abierto: true,
    edificio: { clave: "ed-atencion", ancho: 9, alto: 7, estilo: "oficina", techo: "#3f8a6a", muro: "#e4e8d6", puerta: 4, icono: "manos", rotulo: "ATENCION CIUDADANA" } },
  { id: "fiscalizacion", nombre: "Dirección de Fiscalización", abierto: true,
    edificio: { clave: "ed-fiscalizacion", ancho: 8, alto: 7, estilo: "oficina", techo: "#9a4a4a", muro: "#e9dcd0", puerta: 3, icono: "lupa", rotulo: "FISCALIZACION" } },
  { id: "contraloria", nombre: "Contraloría Regional", abierto: true,
    edificio: { clave: "ed-contraloria", ancho: 11, alto: 9, estilo: "civico", techo: "#8c8a7c", muro: "#e6e1d6", puerta: 5, icono: "lupa", rotulo: "CONTRALORIA" } },
  { id: "corte", nombre: "Corte de Apelaciones", abierto: true,
    edificio: { clave: "ed-corte", ancho: 11, alto: 9, estilo: "tribunal", techo: "#7a7466", muro: "#d8d3ca", puerta: 5, icono: "balanza", rotulo: "CORTE DE APELACIONES" } },
  { id: "juzgado", nombre: "Juzgado Civil", abierto: true,
    edificio: { clave: "ed-juzgado", ancho: 9, alto: 8, estilo: "tribunal", techo: "#9a958c", muro: "#ddd8cf", puerta: 4, icono: "balanza", rotulo: "JUZGADO CIVIL" } },
  { id: "tc", nombre: "Tribunal Constitucional", abierto: true,
    edificio: { clave: "ed-tc", ancho: 10, alto: 9, estilo: "civico", techo: "#5a6fa8", muro: "#e8e6ef", puerta: 4, icono: "columna", rotulo: "TRIBUNAL CONSTITUCIONAL" } },
  { id: "cafe", nombre: "Café Potestad", abierto: false, aviso: "Cerrado por inventario. El cartel lleva ahí tres años.",
    edificio: { clave: "ed-cafe", ancho: 7, alto: 7, estilo: "tienda", techo: "#c0563f", muro: "#f2dfc0", puerta: 3, toldo: "#d9534f", icono: "taza" } },
  { id: "casa-rosa", nombre: "Casa de doña Rosa", abierto: true,
    edificio: { clave: "ed-casa-rosa", ancho: 7, alto: 7, estilo: "casa", techo: "#a8553c", muro: "#f3dcd0", puerta: 3, icono: "casa" } },
  { id: "casa-2", nombre: "Casa de los Pérez", abierto: false, aviso: "Nadie abre. Se oye una tele.",
    edificio: { clave: "ed-casa-2", ancho: 6, alto: 6, estilo: "casa", techo: "#4f7a9a", muro: "#f3e6c8", puerta: 2, icono: "casa" } },
  { id: "casa-3", nombre: "Casa amarilla", abierto: false, aviso: "Un cartel: «Esta casa NO se vende».",
    edificio: { clave: "ed-casa-3", ancho: 6, alto: 6, estilo: "casa", techo: "#8a6a3c", muro: "#f6e7a8", puerta: 3, icono: "casa" } },
];
