/**
 * Entidad de dominio Programa (catálogo «maestro»). Inmutable.
 * TypeScript puro: sin Angular, sin PrimeNG, sin tipos HTTP.
 *
 * Se modela como `interface` (no `class`): es un dato sin comportamiento, igual
 * que el resto de entidades del proyecto. El mapeo desde el contrato del backend
 * vive en `infrastructure/maestros`.
 */
export interface Programa {
  readonly id: string;
  readonly idPrograma: string;
  readonly nombre: string;
  readonly especialidad: string;
  readonly profesional: string;
  readonly citaAutomatica: boolean;
  readonly tipoServicio: string;
  readonly codigoTipoServicio: string;
}
