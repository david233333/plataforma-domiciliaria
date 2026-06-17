import { toTiposPlanParticular } from './tipos-plan-particular.mapper';
import { TiposPlanParticularDto } from './tipos-plan-particular.dto';

describe('tipos-plan-particular.mapper (DTO → Entity)', () => {
  const dto: TiposPlanParticularDto = {
    id: '1',
    idTipoPlanParticular: 'TPP-01',
    descripcion: 'Particular empresa',
    nit: '900123456-7',
  };

  it('toTiposPlanParticular copia todos los campos del DTO a la entidad', () => {
    const tipo = toTiposPlanParticular(dto);
    expect(tipo).toEqual(dto);
  });
});
