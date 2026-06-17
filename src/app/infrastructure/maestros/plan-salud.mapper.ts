import { PlanSalud } from '../../domain/maestros/entities/plan-salud.entity';
import { PlanSaludDto } from './plan-salud.dto';

/**
 * DTO → Entidad de dominio. Hoy es un mapeo campo a campo, pero centralizar la
 * traducción aquí es lo que permite que el dominio quede aislado del contrato
 * del backend: si mañana el JSON cambia un nombre de campo, solo se ajusta esto.
 */
export function toPlanSalud(dto: PlanSaludDto): PlanSalud {
  return {
    id: dto.id,
    nombre: dto.nombre,
    nombreAseguradora: dto.nombreAseguradora,
    idPlan: dto.idPlan,
  };
}
