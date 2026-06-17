/**
 * Entidad de dominio: plan de salud (POS, Póliza, ARL, Particular…). Inmutable.
 * TypeScript puro. Se modela como `interface`: dato sin comportamiento.
 */
export interface PlanSalud {
  readonly id: string;
  readonly nombre: string;
}
