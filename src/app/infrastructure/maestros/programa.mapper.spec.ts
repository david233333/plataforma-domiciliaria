import { toPrograma } from './programa.mapper';
import { ProgramaDto } from './programa.dto';

describe('programa.mapper (DTO → Entity)', () => {
  const dto: ProgramaDto = {
    id: '1',
    idPrograma: 'HD',
    nombre: 'Hospitalización domiciliaria',
    especialidad: 'Medicina interna',
    profesional: 'Médico',
    citaAutomatica: true,
    tipoServicio: 'Domiciliario',
    codigoTipoServicio: 'DOM-01',
  };

  it('toPrograma copia todos los campos del DTO a la entidad', () => {
    const programa = toPrograma(dto);
    expect(programa).toEqual(dto);
  });
});
