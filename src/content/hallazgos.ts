// Hallazgos jurídicos: lo que el jugador descubre jugando. Salen del banco de
// cada módulo (src/content/banco/). Se coleccionan en el expediente; los que
// aún no se descubren aparecen como «???».
import { BANCOS } from "./banco";
import type { Hallazgo } from "./tipos";

export type { Hallazgo };

export const HALLAZGOS: Hallazgo[] = BANCOS.flatMap((b) => b.hallazgos);

/** «EVA, en simple»: una frase corta por hallazgo. */
export const EN_SIMPLE: Record<string, string> = Object.fromEntries(HALLAZGOS.map((h) => [h.id, h.simple]));

export const hallazgo = (id: string) => {
  const h = HALLAZGOS.find((x) => x.id === id);
  if (!h) throw new Error(`No existe el hallazgo «${id}»`);
  return h;
};
