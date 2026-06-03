import { ESTADOS_NOVEDAD, estadoEsGestionable } from './estado-novedad';
import { Novedad, novedadEsGestionable } from './novedad.entity';

describe('estado-novedad (reglas de dominio)', () => {
  it('solo PENDIENTE_GESTION es gestionable', () => {
    expect(estadoEsGestionable('PENDIENTE_GESTION')).toBe(true);
    expect(estadoEsGestionable('GESTIONADA')).toBe(false);
    expect(estadoEsGestionable('EN_PROCESO')).toBe(false);
    expect(estadoEsGestionable('RECHAZADA')).toBe(false);
  });

  it('define exactamente los 4 estados conocidos', () => {
    expect([...ESTADOS_NOVEDAD]).toEqual([
      'PENDIENTE_GESTION',
      'GESTIONADA',
      'EN_PROCESO',
      'RECHAZADA',
    ]);
  });

  it('novedadEsGestionable delega en el estado de la entidad', () => {
    const base: Omit<Novedad, 'estado'> = {
      id: 'NOV-1',
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Test',
      numeroIdentificacion: '1',
      piso: 'Piso 1',
      usuarioReporta: 'u',
      usuarioGestion: null,
      fechaSolicitud: new Date(),
      fechaGestion: null,
    };
    expect(novedadEsGestionable({ ...base, estado: 'PENDIENTE_GESTION' })).toBe(true);
    expect(novedadEsGestionable({ ...base, estado: 'GESTIONADA' })).toBe(false);
  });
});
