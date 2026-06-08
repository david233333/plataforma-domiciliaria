/**
 * Entidad de dominio TipoIdentificacion (catálogo «maestro»). Inmutable.
 * TypeScript puro: sin Angular, sin PrimeNG, sin tipos HTTP.
 *
 * Se modela como `interface` (no `class`): es un dato sin comportamiento, igual
 * que `Ciudad` y el resto de entidades del proyecto. El mapeo desde el contrato
 * del backend vive en `infrastructure/maestros`.
 */
export interface TipoIdentificacion {
  readonly id: string;
  readonly idTipo: string;
  readonly nombre: string;
  readonly codigoPos: string;
  readonly codigoSura: string;
}
