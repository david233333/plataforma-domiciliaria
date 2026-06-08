import { Profesion } from '../../domain/maestros/entities/profesion.entity';
import { ProfesionDto } from './profesion.dto';
import { toTipoCita } from './tipo-cita.mapper';

/**
 * DTO → Entidad de dominio. La lista anidada `profesionalList` se mapea elemento
 * a elemento con `toTipoCita`. Se protege contra `null/undefined` (las listas
 * anidadas a veces llegan ausentes) devolviendo `[]` en ese caso.
 */
export function toProfesion(dto: ProfesionDto): Profesion {
  return {
    id: dto.id,
    idProfesion: dto.idProfesion,
    profesion: dto.profesion,
    especialidad: dto.especialidad,
    activo: dto.activo,
    profesionalList: (dto.profesionalList ?? []).map(toTipoCita),
  };
}
