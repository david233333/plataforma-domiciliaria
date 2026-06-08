import { toProfesion } from './profesion.mapper';
import { ProfesionDto } from './profesion.dto';

describe('profesion.mapper (DTO → Entity)', () => {
  const dto: ProfesionDto = {
    id: '1',
    idProfesion: 'MED',
    profesion: 'Médico',
    especialidad: 'Medicina interna',
    activo: true,
    profesionalList: [
      { idCita: 'C1', tipoCita: 'Primera vez' },
      { idCita: 'C2', tipoCita: 'Control' },
    ],
  };

  it('toProfesion copia los campos y mapea la lista anidada de tipos de cita', () => {
    expect(toProfesion(dto)).toEqual(dto);
  });

  it('toProfesion tolera profesionalList ausente devolviendo []', () => {
    const sinLista = { ...dto, profesionalList: undefined } as unknown as ProfesionDto;
    expect(toProfesion(sinLista).profesionalList).toEqual([]);
  });
});
