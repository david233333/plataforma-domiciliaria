import { toCiudad } from './ciudad.mapper';
import { CiudadDto } from './ciudad.dto';

describe('ciudad.mapper (DTO → Entity)', () => {
  const dto: CiudadDto = {
    id: '1',
    idCiudad: '05001',
    nombre: 'Medellín',
    codigoDANE: '05001',
    codigoIPS: 'IPS-01',
    cdSucursal: 'S-01',
  };

  it('toCiudad copia todos los campos del DTO a la entidad', () => {
    const ciudad = toCiudad(dto);
    expect(ciudad).toEqual(dto);
  });
});
