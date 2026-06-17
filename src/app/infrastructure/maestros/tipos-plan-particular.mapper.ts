import { TiposPlanParticular } from '../../domain/maestros/entities/tipos-plan-particular.entity';
import { TiposPlanParticularDto } from './tipos-plan-particular.dto';

/**
 * DTO → Entidad de dominio. Hoy es un mapeo campo a campo, pero centralizar la
 * traducción aquí es lo que permite que el dominio quede aislado del contrato
 * del backend: si mañana el JSON cambia un nombre de campo, solo se ajusta esto.
 */
export function toTiposPlanParticular(
  dto: TiposPlanParticularDto,
): TiposPlanParticular {
  return {
    id: dto.id,
    idTipoPlanParticular: dto.idTipoPlanParticular,
    descripcion: dto.descripcion,
    nit: dto.nit,
  };
}
