import { toNovedad, toNovedadDto } from './novedad.mapper';
import { NovedadDto } from './novedad.dto';

describe('novedad.mapper (DTO ↔ Entity)', () => {
  // Fechas en ISO UTC explícito para que el ida y vuelta sea estable sin importar
  // la zona horaria de la máquina que corre los tests.
  const dto: NovedadDto = {
    id: 'NOV-1',
    tipoNovedad: 'Cambio de cita',
    especialidad: 'Medicina general',
    nombrePaciente: 'María Gónzalez',
    numeroIdentificacion: '1020304050',
    piso: 'Piso 2',
    usuarioReporta: 'jrios',
    usuarioGestion: 'lvargas',
    fechaSolicitud: '2026-05-20T09:15:00.000Z',
    fechaGestion: '2026-05-21T10:00:00.000Z',
    estado: 'GESTIONADA',
  };

  it('toNovedad parsea fechas ISO a Date y conserva el resto de campos', () => {
    const novedad = toNovedad(dto);
    expect(novedad.fechaSolicitud).toBeInstanceOf(Date);
    expect(novedad.fechaSolicitud.toISOString()).toBe('2026-05-20T09:15:00.000Z');
    expect(novedad.fechaGestion?.toISOString()).toBe('2026-05-21T10:00:00.000Z');
    expect(novedad.estado).toBe('GESTIONADA');
    expect(novedad.nombrePaciente).toBe('María Gónzalez');
  });

  it('mapea fechaGestion null sin crear Date', () => {
    const novedad = toNovedad({ ...dto, fechaGestion: null });
    expect(novedad.fechaGestion).toBeNull();
  });

  it('cae a PENDIENTE_GESTION ante un estado desconocido', () => {
    const novedad = toNovedad({ ...dto, estado: 'VALOR_RARO' });
    expect(novedad.estado).toBe('PENDIENTE_GESTION');
  });

  it('round-trip DTO → Entity → DTO preserva los datos', () => {
    expect(toNovedadDto(toNovedad(dto))).toEqual(dto);
  });
});
