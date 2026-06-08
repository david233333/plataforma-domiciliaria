import { toTipoIdentificacion } from './tipo-identificacion.mapper';
import { TipoIdentificacionDto } from './tipo-identificacion.dto';

describe('tipo-identificacion.mapper (DTO → Entity)', () => {
  const dto: TipoIdentificacionDto = {
    id: '1',
    idTipo: 'CC',
    nombre: 'Cédula de ciudadanía',
    codigoPos: 'POS-01',
    codigoSura: 'SURA-01',
  };

  it('toTipoIdentificacion copia todos los campos del DTO a la entidad', () => {
    const tipo = toTipoIdentificacion(dto);
    expect(tipo).toEqual(dto);
  });
});
