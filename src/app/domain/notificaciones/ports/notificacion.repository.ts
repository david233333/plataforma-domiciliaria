import { Observable } from 'rxjs';
import { Notificacion } from '../entities/notificacion.entity';

/**
 * Puerto del repositorio de notificaciones. `abstract class` → contrato + token
 * de inyección. Se cablea al adaptador en `application/di`.
 */
export abstract class NotificacionRepository {
  abstract consultar(): Observable<Notificacion[]>;
}
