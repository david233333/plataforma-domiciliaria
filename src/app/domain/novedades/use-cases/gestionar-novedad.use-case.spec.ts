import { firstValueFrom, of } from 'rxjs';
import { GestionarNovedadUseCase } from './gestionar-novedad.use-case';
import { NovedadRepository } from '../ports/novedad.repository';
import { Novedad } from '../entities/novedad.entity';
import { EstadoNovedad } from '../entities/estado-novedad';
import { NovedadNoGestionableError } from '../errors/novedad-no-gestionable.error';

function crearNovedad(estado: EstadoNovedad): Novedad {
  return {
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
    estado,
  };
}

describe('GestionarNovedadUseCase', () => {
  it('gestiona una novedad PENDIENTE_GESTION delegando en el repositorio', async () => {
    const repo: NovedadRepository = {
      buscar: vi.fn(),
      gestionar: vi.fn().mockReturnValue(of(void 0)),
    };
    const useCase = new GestionarNovedadUseCase(repo);

    await firstValueFrom(useCase.execute(crearNovedad('PENDIENTE_GESTION')));

    expect(repo.gestionar).toHaveBeenCalledWith('NOV-1');
  });

  it('rechaza una novedad no gestionable con NovedadNoGestionableError y no toca el repositorio', async () => {
    const repo: NovedadRepository = {
      buscar: vi.fn(),
      gestionar: vi.fn(),
    };
    const useCase = new GestionarNovedadUseCase(repo);

    await expect(
      firstValueFrom(useCase.execute(crearNovedad('GESTIONADA'))),
    ).rejects.toBeInstanceOf(NovedadNoGestionableError);
    expect(repo.gestionar).not.toHaveBeenCalled();
  });
});
