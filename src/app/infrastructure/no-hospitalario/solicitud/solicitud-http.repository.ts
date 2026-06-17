import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PacienteSinCoberturaError } from '../../../domain/no-hospitalario/solicitud/errors/paciente-sin-cobertura.error';
import { SolicitudRepository } from '../../../domain/no-hospitalario/solicitud/ports/solicitud.repository';
import { PacienteCobertura } from '../../../domain/no-hospitalario/solicitud/entities/paciente-cobertura.entity';
import { PlanSalud } from '../../../domain/no-hospitalario/solicitud/entities/plan-salud.entity';
import { TipoServicio } from '../../../domain/no-hospitalario/solicitud/entities/tipo-servicio.entity';
import { InferenciaServicio } from '../../../domain/no-hospitalario/solicitud/entities/inferencia-servicio.entity';
import {
  NuevaSolicitud,
  ResultadoSolicitud,
} from '../../../domain/no-hospitalario/solicitud/entities/solicitud.entity';
import { PacienteCoberturaDto } from './paciente-cobertura.dto';
import { toPacienteCobertura } from './paciente-cobertura.mapper';
import { apiUrl } from '../../http/api-url';

/**
 * Adaptador HTTP que implementa el puerto `SolicitudRepository`.
 *
 * Por ahora devuelve datos mock vía `of(...).pipe(delay)`. Cuando exista
 * backend, reemplazar cada método por llamadas a `HttpClient` usando
 * `apiUrl('solicitudes', ...)`, mapeando DTO→dominio y traduciendo errores HTTP
 * a errores de dominio con `catchError`. La presentación NO debe notar el
 * cambio (el contrato es el puerto, no este archivo).
 *
 * El `delay` SOLO simula latencia de red: sin él, `of(...)` emite y completa en
 * el mismo tick y no se alcanzan a ver los estados de carga del store. Con
 * backend real, esa latencia la aporta el HttpClient y este `delay` se quita.
 */
@Injectable()
export class SolicitudHttpRepository extends SolicitudRepository {
  private readonly http = inject(HttpClient);

  /**
   * Controlador «información paciente»: consulta la cobertura del paciente por
   * tipo y número de identificación. Ej: `GET api_ingreso/paciente/CC/1121939862`.
   * Mapea el DTO del backend a la entidad de dominio.
   *
   * El backend responde **500 cuando el paciente NO tiene cobertura**. Aquí ese
   * 500 se traduce a `PacienteSinCoberturaError` (un camino de negocio, no un
   * fallo): la presentación lo usa para habilitar el ingreso manual de datos. El
   * resto de errores HTTP se re-propagan tal cual (los maneja `errorInterceptor`).
   */
  override consultarCobertura(tipoIdentificacion: string,numeroIdentificacion: string): Observable<PacienteCobertura> {
    return this.http.get<PacienteCoberturaDto>(apiUrl('ingreso',`/paciente/${tipoIdentificacion}/${numeroIdentificacion}`))
      .pipe(
        map(toPacienteCobertura),
        catchError((error: HttpErrorResponse) =>
          error.status === 500
            ? throwError(() => new PacienteSinCoberturaError())
            : throwError(() => error),
        ),
      );
  }

  override consultarPlanesSalud(): Observable<PlanSalud[]> {
    const planes: PlanSalud[] = [
      { id: '1', nombre: 'POS' },
      { id: '3', nombre: 'Particular' },
      { id: '5', nombre: 'Póliza' },
      { id: '7', nombre: 'ARL' },
    ];
    return of(planes).pipe(delay(300));
  }

  override consultarTiposServicio(): Observable<TipoServicio[]> {
    const tipos: TipoServicio[] = [
      { codigo: '1', nombre: 'Visita domiciliaria' },
      { codigo: '2', nombre: 'Terapia respiratoria' },
      { codigo: '3', nombre: 'Toma de muestras' },
    ];
    return of(tipos).pipe(delay(300));
  }

  override inferirServicio(
    idPlan: string,
    codigoServicio: string,
  ): Observable<InferenciaServicio> {
    // TODO: resolver la cascada real en el backend; aquí variamos el mock según
    // el servicio para que el resumen muestre datos distintos.
    const porServicio: Record<string, InferenciaServicio> = {
      '1': {
        programa: 'Hospitalización domiciliaria',
        piso: 'Piso 2',
        zona: 'Zona Norte',
        conducta: 'Programar visita',
        sla: '48 h',
        copago: idPlan === '3' ? 35000 : 0,
      },
      '2': {
        programa: 'Rehabilitación',
        piso: 'Piso 1',
        zona: 'Zona Centro',
        conducta: 'Agendar terapia',
        sla: '72 h',
        copago: idPlan === '3' ? 28000 : 0,
      },
      '3': {
        programa: 'Laboratorio',
        piso: 'Piso 3',
        zona: 'Zona Sur',
        conducta: 'Programar toma',
        sla: '24 h',
        copago: idPlan === '3' ? 18000 : 0,
      },
    };
    const inferencia = porServicio[codigoServicio] ?? porServicio['1'];
    return of(inferencia).pipe(delay(600));
  }

  override guardar(solicitud: NuevaSolicitud): Observable<ResultadoSolicitud> {
    // TODO: this.http.post<ResultadoSolicitudDto>(apiUrl('solicitudes'), toDto(solicitud))
    const resultado: ResultadoSolicitud = {
      idSolicitud: `SOL-${Math.floor(Math.random() * 90000 + 10000)}`,
      fechaMaximaAtencion: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      mensaje: `Solicitud registrada para el servicio ${solicitud.tipoServicio}.`,
    };
    return of(resultado).pipe(delay(800));
  }
}
