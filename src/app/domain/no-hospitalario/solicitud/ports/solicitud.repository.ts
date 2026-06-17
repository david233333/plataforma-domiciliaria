import { Observable } from 'rxjs';
import { PacienteCobertura } from '../entities/paciente-cobertura.entity';
import { PlanSalud } from '../entities/plan-salud.entity';
import { TipoServicio } from '../entities/tipo-servicio.entity';
import { InferenciaServicio } from '../entities/inferencia-servicio.entity';
import { NuevaSolicitud, ResultadoSolicitud } from '../entities/solicitud.entity';

/**
 * Puerto (contrato) del repositorio de «solicitud no hospitalaria».
 *
 * Es una `abstract class` (no una interface) a propósito: sirve a la vez como
 * contrato del dominio y como token de inyección de Angular DI. El cableado
 * puerto → adaptador se hace en `application/di` (`provideSolicitud`).
 *
 * TypeScript puro: solo depende de `rxjs` (permitido en domain) y de entidades.
 */
export abstract class SolicitudRepository {
  /** Consulta el paciente y su cobertura a partir de la identificación. */
  abstract consultarCobertura(tipoIdentificacion: string,numeroIdentificacion: string,): Observable<PacienteCobertura>;

  /** Catálogo completo de planes de salud. */
  abstract consultarPlanesSalud(): Observable<PlanSalud[]>;

  /** Catálogo de tipos de servicio de atención. */
  abstract consultarTiposServicio(): Observable<TipoServicio[]>;

  /**
   * Infiere el paquete del servicio (programa, piso, zona, conducta, SLA,
   * copago) a partir del plan y el tipo de servicio. Resuelve, del lado del
   * backend, la cascada que antes vivía en el componente.
   */
  abstract inferirServicio(
    idPlan: string,
    codigoServicio: string,
  ): Observable<InferenciaServicio>;

  /** Persiste la solicitud y devuelve el resultado (id, fecha máxima, mensaje). */
  abstract guardar(solicitud: NuevaSolicitud): Observable<ResultadoSolicitud>;
}
