import { toPlanSalud } from './plan-salud.mapper';
import { PlanSaludDto } from './plan-salud.dto';

describe('plan-salud.mapper (DTO → Entity)', () => {
  const dto: PlanSaludDto = {
    id: '1',
    nombre: 'POS',
    nombreAseguradora: 'EPS Sura',
    idPlan: 'PL-01',
  };

  it('toPlanSalud copia todos los campos del DTO a la entidad', () => {
    const planSalud = toPlanSalud(dto);
    expect(planSalud).toEqual(dto);
  });
});
