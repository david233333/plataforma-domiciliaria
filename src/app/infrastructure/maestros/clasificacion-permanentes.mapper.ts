import { ClasificacionPermanentes } from '../../domain/maestros/entities/clasificacion-permanentes.entity';
import { ClasificacionPermanentesDto } from './clasificacion-permanentes.dto';

/**
 * DTO → Entidad de dominio. Centralizar la traducción aquí aísla el dominio del
 * contrato del backend.
 */
export function toClasificacionPermanentes(
  dto: ClasificacionPermanentesDto,
): ClasificacionPermanentes {
  return {
    codigo: dto.codigo,
    nombre: dto.nombre,
  };
}
