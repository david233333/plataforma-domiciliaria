import { TipoCita } from '../../domain/maestros/entities/tipo-cita.entity';
import { TipoCitaDto } from './tipo-cita.dto';

/** DTO → Entidad de dominio (value object anidado en `Profesion`). */
export function toTipoCita(dto: TipoCitaDto): TipoCita {
  return {
    idCita: dto.idCita,
    tipoCita: dto.tipoCita,
  };
}
