/**
 * Entidad de dominio ClasificacionPermanentes (catálogo «maestro»). Inmutable.
 * TypeScript puro: sin Angular, sin PrimeNG, sin tipos HTTP.
 *
 * Se modela como `interface` (no `class`): es un dato sin comportamiento. El
 * mapeo desde el contrato del backend vive en `infrastructure/maestros`.
 */
export interface ClasificacionPermanentes {
  readonly codigo: string;
  readonly nombre: string;
}
