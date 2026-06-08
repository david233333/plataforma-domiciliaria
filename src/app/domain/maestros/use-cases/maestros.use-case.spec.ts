import { firstValueFrom, of } from 'rxjs';
import { MaestrosUseCase } from './maestros.use-case';
import { MaestroRepository } from '../ports/maestro.repository';
import { Ciudad } from '../entities/ciudad.entity';
import { TipoIdentificacion } from '../entities/tipo-identificacion.entity';
import { Programa } from '../entities/programa.entity';
import { TipoNovedad } from '../entities/tipo-novedad.entity';
import { ClasificacionPermanentes } from '../entities/clasificacion-permanentes.entity';
import { Profesion } from '../entities/profesion.entity';

// POJO test: el facade se prueba sin Angular, con un mock del puerto.
describe('MaestrosUseCase', () => {
  const ciudad: Ciudad = {
    id: '1',
    idCiudad: '05001',
    nombre: 'Medellín',
    codigoDANE: '05001',
    codigoIPS: 'IPS-01',
    cdSucursal: 'S-01',
  };

  const tipo: TipoIdentificacion = {
    id: '1',
    idTipo: 'CC',
    nombre: 'Cédula de ciudadanía',
    codigoPos: 'POS-01',
    codigoSura: 'SURA-01',
  };

  const programa: Programa = {
    id: '1',
    idPrograma: 'HD',
    nombre: 'Hospitalización domiciliaria',
    especialidad: 'Medicina interna',
    profesional: 'Médico',
    citaAutomatica: true,
    tipoServicio: 'Domiciliario',
    codigoTipoServicio: 'DOM-01',
  };

  const tipoNovedad: TipoNovedad = { idTipo: 'CAMBIO', nombre: 'Cambio' };

  const clasificacion: ClasificacionPermanentes = {
    codigo: 'PERM-01',
    nombre: 'Permanente',
  };

  const profesion: Profesion = {
    id: '1',
    idProfesion: 'MED',
    profesion: 'Médico',
    especialidad: 'Medicina interna',
    activo: true,
    profesionalList: [{ idCita: 'C1', tipoCita: 'Primera vez' }],
  };

  // Mock completo del puerto; cada test sobreescribe lo que necesita.
  const crearRepo = (): MaestroRepository => ({
    consultarCiudades: vi.fn().mockReturnValue(of([ciudad])),
    consultarTiposIdentificacion: vi.fn().mockReturnValue(of([tipo])),
    consultarProgramas: vi.fn().mockReturnValue(of([programa])),
    consultarTiposNovedad: vi.fn().mockReturnValue(of([tipoNovedad])),
    consultarClasificacionesPermanentes: vi
      .fn()
      .mockReturnValue(of([clasificacion])),
    consultarProfesiones: vi.fn().mockReturnValue(of([profesion])),
  });

  it('consultarCiudades delega en el repositorio y devuelve sus ciudades', async () => {
    const repo = crearRepo();
    const useCase = new MaestrosUseCase(repo);

    const resultado = await firstValueFrom(useCase.consultarCiudades());

    expect(resultado).toEqual([ciudad]);
    expect(repo.consultarCiudades).toHaveBeenCalledOnce();
  });

  it('consultarCiudades cachea: una segunda llamada no vuelve a pegarle al repo', async () => {
    const repo = crearRepo();
    const useCase = new MaestrosUseCase(repo);

    await firstValueFrom(useCase.consultarCiudades());
    await firstValueFrom(useCase.consultarCiudades());

    expect(repo.consultarCiudades).toHaveBeenCalledOnce();
  });

  it('consultarTiposIdentificacion delega en el repositorio', async () => {
    const repo = crearRepo();
    const useCase = new MaestrosUseCase(repo);

    const resultado = await firstValueFrom(
      useCase.consultarTiposIdentificacion(),
    );

    expect(resultado).toEqual([tipo]);
    expect(repo.consultarTiposIdentificacion).toHaveBeenCalledOnce();
  });

  it('consultarProgramas delega en el repositorio', async () => {
    const repo = crearRepo();
    const useCase = new MaestrosUseCase(repo);

    const resultado = await firstValueFrom(useCase.consultarProgramas());

    expect(resultado).toEqual([programa]);
    expect(repo.consultarProgramas).toHaveBeenCalledOnce();
  });

  it('consultarTiposNovedad delega en el repositorio', async () => {
    const repo = crearRepo();
    const useCase = new MaestrosUseCase(repo);

    const resultado = await firstValueFrom(useCase.consultarTiposNovedad());

    expect(resultado).toEqual([tipoNovedad]);
    expect(repo.consultarTiposNovedad).toHaveBeenCalledOnce();
  });

  it('consultarClasificacionesPermanentes delega en el repositorio', async () => {
    const repo = crearRepo();
    const useCase = new MaestrosUseCase(repo);

    const resultado = await firstValueFrom(
      useCase.consultarClasificacionesPermanentes(),
    );

    expect(resultado).toEqual([clasificacion]);
    expect(repo.consultarClasificacionesPermanentes).toHaveBeenCalledOnce();
  });

  it('consultarProfesiones delega en el repositorio', async () => {
    const repo = crearRepo();
    const useCase = new MaestrosUseCase(repo);

    const resultado = await firstValueFrom(useCase.consultarProfesiones());

    expect(resultado).toEqual([profesion]);
    expect(repo.consultarProfesiones).toHaveBeenCalledOnce();
  });
});
