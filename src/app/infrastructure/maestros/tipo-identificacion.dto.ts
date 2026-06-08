/**
 * DTO de transporte HTTP de un tipo de identificación. Refleja el contrato del
 * backend (`GET /maestros/tipoIdentificacion`). Vive en infrastructure: el
 * dominio NUNCA ve este tipo, solo la entidad `TipoIdentificacion`.
 *
 * Aquí los nombres de campo coinciden con los de la entidad, pero el DTO se
 * mantiene como capa separada para que un cambio futuro del contrato del backend
 * se absorba en el mapper, sin tocar dominio ni presentación.
 */
export interface TipoIdentificacionDto {
  readonly id: string;
  readonly idTipo: string;
  readonly nombre: string;
  readonly codigoPos: string;
  readonly codigoSura: string;
}
