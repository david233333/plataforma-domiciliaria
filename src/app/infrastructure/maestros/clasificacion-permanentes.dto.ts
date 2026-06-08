/**
 * DTO de transporte HTTP de una clasificación de permanentes. Refleja el
 * contrato del backend (`GET /maestros/clasificacionPermanentes`). Vive en
 * infrastructure: el dominio NUNCA ve este tipo, solo la entidad
 * `ClasificacionPermanentes`.
 */
export interface ClasificacionPermanentesDto {
  readonly codigo: string;
  readonly nombre: string;
}
