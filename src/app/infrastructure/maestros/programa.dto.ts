/**
 * DTO de transporte HTTP de un programa. Refleja el contrato del backend
 * (`GET /maestros/programa`). Vive en infrastructure: el dominio NUNCA ve este
 * tipo, solo la entidad `Programa`.
 */
export interface ProgramaDto {
  readonly id: string;
  readonly idPrograma: string;
  readonly nombre: string;
  readonly especialidad: string;
  readonly profesional: string;
  readonly citaAutomatica: boolean;
  readonly tipoServicio: string;
  readonly codigoTipoServicio: string;
}
