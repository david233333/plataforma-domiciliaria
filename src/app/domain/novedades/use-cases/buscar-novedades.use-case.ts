import { Observable } from 'rxjs';
import { Novedad } from '../entities/novedad.entity';
import { FiltroNovedades } from '../entities/filtro-novedades';
import { NovedadRepository } from '../ports/novedad.repository';

/**
 * Caso de uso: buscar novedades según un filtro.
 *
 * Clase TypeScript pura. Recibe el puerto por CONSTRUCTOR (en domain no usamos
 * `inject()` para no acoplar a Angular). Se expone a la DI por factory en
 * `application/di`.
 */
export class BuscarNovedadesUseCase {
  constructor(private readonly repositorio: NovedadRepository) {}

  execute(filtro: FiltroNovedades): Observable<Novedad[]> {
    return this.repositorio.buscar(filtro);
  }
}
