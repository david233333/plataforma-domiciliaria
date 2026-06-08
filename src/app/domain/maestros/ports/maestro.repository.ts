import { Observable } from 'rxjs';
import { Ciudad } from '../entities/ciudad.entity';

/**
 * Puerto (contrato) del repositorio de «maestros»: los catálogos compartidos
 * que alimentan filtros y formularios (ciudad, y a futuro programa, piso, etc.).
 *
 * Es una `abstract class` (no una interface) a propósito: sirve a la vez como
 * contrato del dominio y como token de inyección de Angular DI. El cableado
 * puerto → adaptador se hace en `application/di`.
 *
 * TypeScript puro: solo depende de `rxjs` (permitido en domain) y de entidades.
 */
export abstract class MaestroRepository {
  abstract consultarCiudades(): Observable<Ciudad[]>;
}
