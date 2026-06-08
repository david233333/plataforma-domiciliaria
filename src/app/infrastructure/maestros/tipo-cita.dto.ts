/**
 * DTO de transporte HTTP de un tipo de cita. Refleja el contrato del backend
 * (anidado en `ProfesionDto.profesionalList`). Vive en infrastructure: el
 * dominio NUNCA ve este tipo, solo la entidad `TipoCita`.
 */
export interface TipoCitaDto {
  readonly idCita: string;
  readonly tipoCita: string;
}
