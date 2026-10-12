// El banco completo: junta los archivos de cada módulo (mNN-*.ts) en orden.
// Vite los encuentra solos, así que agregar un módulo es agregar su archivo.
import type { BancoModulo } from "../tipos";

const archivos = import.meta.glob<Record<string, BancoModulo>>("./m*.ts", { eager: true });

export const BANCOS: BancoModulo[] = Object.values(archivos)
  .flatMap((m) => Object.values(m))
  .filter((b): b is BancoModulo => !!b && typeof b === "object" && "modulo" in b)
  .sort((a, b) => a.modulo - b.modulo);

export const banco = (n: number): BancoModulo =>
  BANCOS.find((b) => b.modulo === n) ?? { modulo: n, hallazgos: [], afirmaciones: [], fichas: [], quiz: [], orales: [], columnas: [], cadenas: [], expedientes: [] };
