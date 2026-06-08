import { TipoCita } from './tipo-cita.entity';

/**
 * Entidad de dominio Profesion (catálogo «maestro»). Inmutable.
 * TypeScript puro: sin Angular, sin PrimeNG, sin tipos HTTP.
 *
 * Incluye una lista anidada de `TipoCita` (`profesionalList`). El mapeo desde el
 * contrato del backend vive en `infrastructure/maestros`.
 */
export interface Profesion {
  readonly id: string;
  readonly idProfesion: string;
  readonly profesion: string;
  readonly especialidad: string;
  readonly activo: boolean;
  readonly profesionalList: readonly TipoCita[];
}
