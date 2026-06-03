import { firstValueFrom, of } from 'rxjs';
import { BuscarNovedadesUseCase } from './buscar-novedades.use-case';
import { NovedadRepository } from '../ports/novedad.repository';
import { Novedad } from '../entities/novedad.entity';
import { FiltroNovedades } from '../entities/filtro-novedades';

// POJO test: el caso de uso se prueba sin Angular, con un mock del puerto.
describe('BuscarNovedadesUseCase', () => {
  const novedad: Novedad = {
    id: 'NOV-1',
    tipoNovedad: 'Cambio de cita',
    especialidad: '',
    nombrePaciente: 'María',
    numeroIdentificacion: '123',
    piso: 'Piso 2',
    usuarioReporta: 'jrios',
    usuarioGestion: null,
    fechaSolicitud: new Date('2026-05-20T09:15:00Z'),
    fechaGestion: null,
    estado: 'PENDIENTE_GESTION',
  };

  it('delega la búsqueda en el repositorio y devuelve sus novedades', async () => {
    const filtro: FiltroNovedades = { ciudad: 'med' };
    const repo: NovedadRepository = {
      buscar: vi.fn().mockReturnValue(of([novedad])),
      gestionar: vi.fn(),
    };
    const useCase = new BuscarNovedadesUseCase(repo);

    const resultado = await firstValueFrom(useCase.execute(filtro));

    expect(resultado).toEqual([novedad]);
    expect(repo.buscar).toHaveBeenCalledWith(filtro);
  });

  it('propaga una lista vacía sin error', async () => {
    const repo: NovedadRepository = {
      buscar: vi.fn().mockReturnValue(of([])),
      gestionar: vi.fn(),
    };
    const useCase = new BuscarNovedadesUseCase(repo);

    const resultado = await firstValueFrom(useCase.execute({}));

    expect(resultado).toEqual([]);
  });
});
