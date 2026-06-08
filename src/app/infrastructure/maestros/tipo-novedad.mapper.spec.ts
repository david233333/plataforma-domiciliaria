import { toTipoNovedad } from './tipo-novedad.mapper';
import { TipoNovedadDto } from './tipo-novedad.dto';

describe('tipo-novedad.mapper (DTO → Entity)', () => {
  const dto: TipoNovedadDto = {
    idTipo: 'CAMBIO',
    nombre: 'Cambio de profesional',
  };

  it('toTipoNovedad copia todos los campos del DTO a la entidad', () => {
    const tipo = toTipoNovedad(dto);
    expect(tipo).toEqual(dto);
  });
});
