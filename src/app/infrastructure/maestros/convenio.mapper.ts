import { Convenio } from '../../domain/maestros/entities/convenio.entity';
import { ConvenioDto } from './convenio.dto';

/**
 * DTO → Entidad de dominio. Además del mapeo campo a campo, traduce las fechas
 * ISO (`string`) del contrato del backend a `Date`. Centralizar esto aquí es lo
 * que mantiene al dominio aislado del formato de transporte: si mañana cambia un
 * nombre de campo o el formato de fecha, solo se ajusta este mapper.
 */
export function toConvenio(dto: ConvenioDto): Convenio {
  return {
    planContrato: dto.planContrato,
    codigoRamo: dto.codigoRamo,
    tipoRamo: dto.tipoRamo,
    descripcionPlanContrato: dto.descripcionPlanContrato,
    tipoPlanPac: dto.tipoPlanPac,
    numeroPlan: dto.numeroPlan,
    codigoProducto: dto.codigoProducto,
    anexoUrgencias: dto.anexoUrgencias,
    anexoConsultaExterna: dto.anexoConsultaExterna,
    anexoAtencionDomiciliaria: dto.anexoAtencionDomiciliaria,
    fechaInicioVigenciaAsegurado: new Date(dto.fechaInicioVigenciaAsegurado),
    fechaFinVigenciaAsegurado: new Date(dto.fechaFinVigenciaAsegurado),
    numeroContrato: dto.numeroContrato,
    tieneCoberturaDomiciliaria: dto.tieneCoberturaDomiciliaria,
    fechaLimiteCobertura: new Date(dto.fechaLimiteCobertura),
  };
}
