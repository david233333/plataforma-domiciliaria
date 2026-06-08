import { TipoNovedad } from '../../domain/maestros/entities/tipo-novedad.entity';
import { TipoNovedadDto } from './tipo-novedad.dto';

/**
 * DTO → Entidad de dominio. Centralizar la traducción aquí aísla el dominio del
 * contrato del backend.
 */
export function toTipoNovedad(dto: TipoNovedadDto): TipoNovedad {
  return {
    idTipo: dto.idTipo,
    nombre: dto.nombre,
  };
}
