import { map, Observable } from 'rxjs';
import { PacienteCobertura } from '../entities/paciente-cobertura.entity';
import { PlanSalud } from '../entities/plan-salud.entity';
import { TipoServicio } from '../entities/tipo-servicio.entity';
import { InferenciaServicio } from '../entities/inferencia-servicio.entity';
import { NuevaSolicitud, ResultadoSolicitud } from '../entities/solicitud.entity';
import { SolicitudRepository } from '../ports/solicitud.repository';

/**
 * Caso de uso de «crear solicitud no hospitalaria».
 *
 * Clase TypeScript pura. Recibe el puerto por CONSTRUCTOR (en domain no usamos
 * `inject()` para no acoplar a Angular). Se expone a la DI por factory en
 * `application/di` (`provideSolicitud`).
 *
 * Concentra las operaciones del flujo. La mayoría delega en el repositorio,
 * pero `consultarPlanesDisponibles` SÍ aporta lógica de negocio: cruza el
 * catálogo de planes con los que el paciente tiene habilitados.
 */
export class SolicitudUseCase {
  constructor(private readonly repositorio: SolicitudRepository) {}

  consultarCobertura(tipoIdentificacion: string,numeroIdentificacion: string,): Observable<PacienteCobertura> {
    return this.repositorio.consultarCobertura(tipoIdentificacion,numeroIdentificacion);
  }

  /**
   * Planes que ESTE paciente puede usar: el catálogo filtrado por los tipos de
   * cobertura que el paciente tiene activos (banderas `tienePOS`, `tienePoliza`,
   * `tienePac`, `tieneArl` de la respuesta de «información paciente»). Regla de
   * negocio del dominio, no de la UI.
   *
   * NOTA: el cruce se hace por NOMBRE de plan del catálogo. Ajustar este mapeo si
   * el catálogo real usa otros nombres/códigos.
   */
  consultarPlanesDisponibles(paciente: PacienteCobertura,): Observable<PlanSalud[]> {
    return this.repositorio
      .consultarPlanesSalud()
      .pipe(
        map((planes) =>
          planes.filter((plan) => this.pacienteTieneCobertura(paciente, plan)),
        ),
      );
  }

  /** Mapeo banderas de cobertura del paciente → plan del catálogo (por nombre). */
  private pacienteTieneCobertura(
    paciente: PacienteCobertura,
    plan: PlanSalud,
  ): boolean {
    const coberturaPorNombre: Record<string, boolean> = {
      POS: paciente.tienePOS,
      Póliza: paciente.tienePoliza,
      Particular: paciente.tienePac,
      ARL: paciente.tieneArl,
    };
    return coberturaPorNombre[plan.nombre] ?? false;
  }

  /**
   * Planes ofrecidos cuando el paciente NO tiene cobertura: solo «Particular».
   * Regla de negocio (no de la UI): sin cobertura asegurada, el único plan
   * elegible es el particular. Se filtra el catálogo por nombre, igual que
   * `consultarPlanesDisponibles`.
   */
  consultarPlanesSinCobertura(): Observable<PlanSalud[]> {
    return this.repositorio
      .consultarPlanesSalud()
      .pipe(map((planes) => planes.filter((plan) => plan.nombre === 'Particular')));
  }

  consultarTiposServicio(): Observable<TipoServicio[]> {
    return this.repositorio.consultarTiposServicio();
  }

  inferirServicio(
    idPlan: string,
    codigoServicio: string,
  ): Observable<InferenciaServicio> {
    return this.repositorio.inferirServicio(idPlan, codigoServicio);
  }

  guardar(solicitud: NuevaSolicitud): Observable<ResultadoSolicitud> {
    return this.repositorio.guardar(solicitud);
  }
}
