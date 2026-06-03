import { Observable } from 'rxjs';
import { Novedad } from '../entities/novedad.entity';
import { FiltroNovedades } from '../entities/filtro-novedades';

/**
 * Puerto (contrato) del repositorio de novedades.
 *
 * Es una `abstract class` (no una interface) a propósito: sirve a la vez como
 * contrato del dominio y como token de inyección de Angular DI. El cableado
 * puerto → adaptador se hace en `application/di`.
 *
 * TypeScript puro: solo depende de `rxjs` (permitido en domain) y de entidades.
 */
export abstract class NovedadRepository {
  abstract buscar(filtro: FiltroNovedades): Observable<Novedad[]>;
  abstract gestionar(id: string): Observable<void>;
}
