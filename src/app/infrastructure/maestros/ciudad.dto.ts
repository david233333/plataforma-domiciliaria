/**
 * DTO de transporte HTTP de una ciudad. Refleja el contrato del backend
 * (`GET /maestros/ciudad`). Vive en infrastructure: el dominio NUNCA ve este
 * tipo, solo la entidad `Ciudad`.
 *
 * En este maestro los nombres de campo coinciden con los de la entidad, pero el
 * DTO se mantiene como capa separada para que un cambio futuro del contrato del
 * backend se absorba en el mapper, sin tocar dominio ni presentación.
 */
export interface CiudadDto {
  readonly id: string;
  readonly idCiudad: string;
  readonly nombre: string;
  readonly codigoDANE: string;
  readonly codigoIPS: string;
  readonly cdSucursal: string;
}
