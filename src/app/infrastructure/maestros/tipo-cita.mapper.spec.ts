import { toTipoCita } from './tipo-cita.mapper';
import { TipoCitaDto } from './tipo-cita.dto';

describe('tipo-cita.mapper (DTO → Entity)', () => {
  const dto: TipoCitaDto = { idCita: 'C1', tipoCita: 'Primera vez' };

  it('toTipoCita copia todos los campos del DTO a la entidad', () => {
    expect(toTipoCita(dto)).toEqual(dto);
  });
});
