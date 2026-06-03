import { Observable } from 'rxjs';
import { Notificacion } from '../entities/notificacion.entity';
import { NotificacionRepository } from '../ports/notificacion.repository';

/**
 * Caso de uso: consultar las notificaciones del usuario actual.
 * Clase TS pura, puerto por constructor.
 */
export class ConsultarNotificacionesUseCase {
  constructor(private readonly repositorio: NotificacionRepository) {}

  execute(): Observable<Notificacion[]> {
    return this.repositorio.consultar();
  }
}
