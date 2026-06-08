import { Programa } from '../../domain/maestros/entities/programa.entity';
import { ProgramaDto } from './programa.dto';

/**
 * DTO → Entidad de dominio. Centralizar la traducción aquí aísla el dominio del
 * contrato del backend: si mañana el JSON cambia un nombre de campo, solo se
 * ajusta esto.
 */
export function toPrograma(dto: ProgramaDto): Programa {
  return {
    id: dto.id,
    idPrograma: dto.idPrograma,
    nombre: dto.nombre,
    especialidad: dto.especialidad,
    profesional: dto.profesional,
    citaAutomatica: dto.citaAutomatica,
    tipoServicio: dto.tipoServicio,
    codigoTipoServicio: dto.codigoTipoServicio,
  };
}
