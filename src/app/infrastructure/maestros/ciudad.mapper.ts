import { Ciudad } from '../../domain/maestros/entities/ciudad.entity';
import { CiudadDto } from './ciudad.dto';

/**
 * DTO → Entidad de dominio. Hoy es un mapeo campo a campo, pero centralizar la
 * traducción aquí es lo que permite que el dominio quede aislado del contrato
 * del backend: si mañana el JSON cambia un nombre de campo, solo se ajusta esto.
 */
export function toCiudad(dto: CiudadDto): Ciudad {
  return {
    id: dto.id,
    idCiudad: dto.idCiudad,
    nombre: dto.nombre,
    codigoDANE: dto.codigoDANE,
    codigoIPS: dto.codigoIPS,
    cdSucursal: dto.cdSucursal,
  };
}
