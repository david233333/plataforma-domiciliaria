import { Observable, throwError } from 'rxjs';
import { Novedad, novedadEsGestionable } from '../entities/novedad.entity';
import { NovedadRepository } from '../ports/novedad.repository';
import { NovedadNoGestionableError } from '../errors/novedad-no-gestionable.error';

/**
 * Caso de uso: gestionar una novedad.
 *
 * La regla de negocio (solo se gestionan las gestionables) vive aquí: si la
 * novedad no es gestionable, emite `NovedadNoGestionableError` sin tocar el
 * repositorio. Clase TS pura, puerto por constructor.
 */
export class GestionarNovedadUseCase {
  constructor(private readonly repositorio: NovedadRepository) {}

  execute(novedad: Novedad): Observable<void> {
    if (!novedadEsGestionable(novedad)) {
      return throwError(() => new NovedadNoGestionableError(novedad.id));
    }
    return this.repositorio.gestionar(novedad.id);
  }
}
