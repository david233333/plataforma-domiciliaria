/**
 * DTO de transporte HTTP de un tipo de novedad. Refleja el contrato del backend
 * (`GET /maestros/tipoNovedad`). Vive en infrastructure: el dominio NUNCA ve
 * este tipo, solo la entidad `TipoNovedad`.
 */
export interface TipoNovedadDto {
  readonly idTipo: string;
  readonly nombre: string;
}
