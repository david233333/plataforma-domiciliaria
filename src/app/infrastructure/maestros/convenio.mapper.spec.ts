import { toConvenio } from './convenio.mapper';
import { ConvenioDto } from './convenio.dto';

describe('convenio.mapper (DTO → Entity)', () => {
  const dto: ConvenioDto = {
    planContrato: 'PC-01',
    codigoRamo: 'R-100',
    tipoRamo: 'Salud',
    descripcionPlanContrato: 'Plan empresarial',
    tipoPlanPac: 'PAC-A',
    numeroPlan: '12345',
    codigoProducto: 'PROD-9',
    anexoUrgencias: true,
    anexoConsultaExterna: false,
    anexoAtencionDomiciliaria: true,
    fechaInicioVigenciaAsegurado: '2026-01-01T00:00:00.000Z',
    fechaFinVigenciaAsegurado: '2026-12-31T00:00:00.000Z',
    numeroContrato: 'CT-7788',
    tieneCoberturaDomiciliaria: true,
    fechaLimiteCobertura: '2027-06-30T00:00:00.000Z',
  };

  it('toConvenio copia los campos planos del DTO a la entidad', () => {
    const convenio = toConvenio(dto);
    expect(convenio).toMatchObject({
      planContrato: 'PC-01',
      codigoRamo: 'R-100',
      tipoRamo: 'Salud',
      descripcionPlanContrato: 'Plan empresarial',
      tipoPlanPac: 'PAC-A',
      numeroPlan: '12345',
      codigoProducto: 'PROD-9',
      anexoUrgencias: true,
      anexoConsultaExterna: false,
      anexoAtencionDomiciliaria: true,
      numeroContrato: 'CT-7788',
      tieneCoberturaDomiciliaria: true,
    });
  });

  it('toConvenio convierte las fechas ISO (string) a Date', () => {
    const convenio = toConvenio(dto);

    expect(convenio.fechaInicioVigenciaAsegurado).toBeInstanceOf(Date);
    expect(convenio.fechaFinVigenciaAsegurado).toBeInstanceOf(Date);
    expect(convenio.fechaLimiteCobertura).toBeInstanceOf(Date);
    expect(convenio.fechaInicioVigenciaAsegurado.toISOString()).toBe(
      '2026-01-01T00:00:00.000Z',
    );
    expect(convenio.fechaLimiteCobertura.toISOString()).toBe(
      '2027-06-30T00:00:00.000Z',
    );
  });
});
