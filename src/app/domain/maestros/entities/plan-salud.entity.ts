/**
 * Entidad de dominio PlanSalud (catálogo «maestro»). Inmutable.
 * TypeScript puro: sin Angular, sin PrimeNG, sin tipos HTTP.
 *
 * Se modela como `interface` (no `class`): es un dato sin comportamiento, y así
 * es consistente con el resto de entidades del proyecto (`Ciudad`, etc.). El
 * mapeo desde el contrato del backend vive en `infrastructure/maestros`.
 */
export interface PlanSalud {
  readonly id: string;
  readonly nombre: string;
  readonly nombreAseguradora: string;
  readonly idPlan: string;
}
