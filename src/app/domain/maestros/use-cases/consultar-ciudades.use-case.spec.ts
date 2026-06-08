import { firstValueFrom, of } from 'rxjs';
import { ConsultarCiudadesUseCase } from './consultar-ciudades.use-case';
import { MaestroRepository } from '../ports/maestro.repository';
import { Ciudad } from '../entities/ciudad.entity';

// POJO test: el caso de uso se prueba sin Angular, con un mock del puerto.
describe('ConsultarCiudadesUseCase', () => {
  const ciudad: Ciudad = {
    id: '1',
    idCiudad: '05001',
    nombre: 'Medellín',
    codigoDANE: '05001',
    codigoIPS: 'IPS-01',
    cdSucursal: 'S-01',
  };

  it('delega la consulta en el repositorio y devuelve sus ciudades', async () => {
    const repo: MaestroRepository = {
      consultarCiudades: vi.fn().mockReturnValue(of([ciudad])),
    };
    const useCase = new ConsultarCiudadesUseCase(repo);

    const resultado = await firstValueFrom(useCase.execute());

    expect(resultado).toEqual([ciudad]);
    expect(repo.consultarCiudades).toHaveBeenCalledOnce();
  });

  it('propaga una lista vacía sin error', async () => {
    const repo: MaestroRepository = {
      consultarCiudades: vi.fn().mockReturnValue(of([])),
    };
    const useCase = new ConsultarCiudadesUseCase(repo);

    const resultado = await firstValueFrom(useCase.execute());

    expect(resultado).toEqual([]);
  });
});
