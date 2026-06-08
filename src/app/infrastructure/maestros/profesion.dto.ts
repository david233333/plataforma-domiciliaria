import { TipoCitaDto } from './tipo-cita.dto';

/**
 * DTO de transporte HTTP de una profesión. Refleja el contrato del backend
 * (`GET /maestros/profesiones`). Vive en infrastructure: el dominio NUNCA ve
 * este tipo, solo la entidad `Profesion`.
 */
export interface ProfesionDto {
  readonly id: string;
  readonly idProfesion: string;
  readonly profesion: string;
  readonly especialidad: string;
  readonly activo: boolean;
  readonly profesionalList: TipoCitaDto[];
}
