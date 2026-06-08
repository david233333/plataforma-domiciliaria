/**
 * Entidad de dominio Ciudad (catálogo «maestro»). Inmutable.
 * TypeScript puro: sin Angular, sin PrimeNG, sin tipos HTTP.
 *
 * Se modela como `interface` (no `class`): es un dato sin comportamiento, y así
 * es consistente con el resto de entidades del proyecto (`Novedad`, etc.). El
 * mapeo desde el contrato del backend vive en `infrastructure/maestros`.
 */
export interface Ciudad {
  readonly id: string;
  readonly idCiudad: string;
  readonly nombre: string;
  readonly codigoDANE: string;
  readonly codigoIPS: string;
  readonly cdSucursal: string;
}
