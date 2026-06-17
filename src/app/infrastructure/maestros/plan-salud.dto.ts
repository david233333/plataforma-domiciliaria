/**
 * DTO de transporte HTTP de un plan de salud. Refleja el contrato del backend
 * (`GET /maestros/planesSalud`). Vive en infrastructure: el dominio NUNCA ve
 * este tipo, solo la entidad `PlanSalud`.
 *
 * En este maestro los nombres de campo coinciden con los de la entidad, pero el
 * DTO se mantiene como capa separada para que un cambio futuro del contrato del
 * backend se absorba en el mapper, sin tocar dominio ni presentación.
 */
export interface PlanSaludDto {
  readonly id: string;
  readonly nombre: string;
  readonly nombreAseguradora: string;
  readonly idPlan: string;
}
