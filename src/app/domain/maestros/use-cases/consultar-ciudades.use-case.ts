import { Observable } from 'rxjs';
import { Ciudad } from '../entities/ciudad.entity';
import { MaestroRepository } from '../ports/maestro.repository';

/**
 * Caso de uso: consultar el catálogo de ciudades.
 *
 * Clase TypeScript pura. Recibe el puerto por CONSTRUCTOR (en domain no usamos
 * `inject()` para no acoplar a Angular). Se expone a la DI por factory en
 * `application/di`.
 */
export class ConsultarCiudadesUseCase {
  constructor(private readonly repositorio: MaestroRepository) {}

  execute(): Observable<Ciudad[]> {
    return this.repositorio.consultarCiudades();
  }
}
