/**
 * Entidad de dominio TipoCita. Inmutable. TypeScript puro.
 *
 * No es un maestro por sí sola: es un value object ANIDADO dentro de `Profesion`
 * (campo `profesionalList`). El mapeo desde el contrato del backend vive en
 * `infrastructure/maestros`.
 */
export interface TipoCita {
  readonly idCita: string;
  readonly tipoCita: string;
}
