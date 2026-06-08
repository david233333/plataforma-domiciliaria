import { TipoIdentificacion } from '../../domain/maestros/entities/tipo-identificacion.entity';
import { TipoIdentificacionDto } from './tipo-identificacion.dto';

/**
 * DTO → Entidad de dominio. Hoy es un mapeo campo a campo, pero centralizar la
 * traducción aquí es lo que permite que el dominio quede aislado del contrato del
 * backend: si mañana el JSON cambia un nombre de campo, solo se ajusta esto.
 */
export function toTipoIdentificacion(
  dto: TipoIdentificacionDto,
): TipoIdentificacion {
  return {
    id: dto.id,
    idTipo: dto.idTipo,
    nombre: dto.nombre,
    codigoPos: dto.codigoPos,
    codigoSura: dto.codigoSura,
  };
}
