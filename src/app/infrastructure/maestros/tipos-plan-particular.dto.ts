/**
 * DTO de transporte HTTP de un tipo de plan particular. Refleja el contrato del
 * backend (`GET /maestros/tiposPlanParticular`). Vive en infrastructure: el
 * dominio NUNCA ve este tipo, solo la entidad `TiposPlanParticular`.
 *
 * En este maestro los nombres de campo coinciden con los de la entidad, pero el
 * DTO se mantiene como capa separada para que un cambio futuro del contrato del
 * backend se absorba en el mapper, sin tocar dominio ni presentación.
 */
export interface TiposPlanParticularDto {
  readonly id: string;
  readonly idTipoPlanParticular: string;
  readonly descripcion: string;
  readonly nit: string;
}
