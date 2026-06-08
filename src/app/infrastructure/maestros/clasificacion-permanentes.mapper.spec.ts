import { toClasificacionPermanentes } from './clasificacion-permanentes.mapper';
import { ClasificacionPermanentesDto } from './clasificacion-permanentes.dto';

describe('clasificacion-permanentes.mapper (DTO → Entity)', () => {
  const dto: ClasificacionPermanentesDto = {
    codigo: 'PERM-01',
    nombre: 'Permanente domiciliario',
  };

  it('toClasificacionPermanentes copia todos los campos del DTO a la entidad', () => {
    const clasificacion = toClasificacionPermanentes(dto);
    expect(clasificacion).toEqual(dto);
  });
});
