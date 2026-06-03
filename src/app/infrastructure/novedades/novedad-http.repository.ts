import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NovedadRepository } from '../../domain/novedades/ports/novedad.repository';
import { Novedad } from '../../domain/novedades/entities/novedad.entity';
import { FiltroNovedades } from '../../domain/novedades/entities/filtro-novedades';
import { NovedadDto } from './novedad.dto';
import { toNovedad } from './novedad.mapper';

/**
 * Adaptador HTTP que implementa el puerto `NovedadRepository`.
 *
 * Por ahora devuelve datos mock vía `of(...)` (los que antes vivían en el
 * componente). Cuando exista backend, reemplazar por llamadas a `HttpClient`
 * usando `apiUrl('novedades', ...)` y `catchError` para traducir errores HTTP
 * a errores de dominio. La presentación NO debe notar el cambio.
 */
@Injectable()
export class NovedadHttpRepository extends NovedadRepository {
  // NOTE: cuando se cablee HttpClient, inyectarlo aquí:
  // private readonly http = inject(HttpClient);

  // Datos de ejemplo (en formato DTO, como vendrían del backend).
  private readonly mock: readonly NovedadDto[] = [
    {
      id: 'NOV-001',
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'María Gónzalez Pérez',
      numeroIdentificacion: '1020304050',
      piso: 'Piso 2',
      usuarioReporta: 'jrios',
      usuarioGestion: null,
      fechaSolicitud: '2026-05-20T09:15:00',
      fechaGestion: null,
      estado: 'PENDIENTE_GESTION',
    },
    {
      id: 'NOV-002',
      tipoNovedad: 'Cancelación',
      especialidad: '',
      nombrePaciente: 'Carlos Restrepo Load',
      numeroIdentificacion: '7080900112',
      piso: 'Piso 1',
      usuarioReporta: 'amejia',
      usuarioGestion: 'lvargas',
      fechaSolicitud: '2026-05-18T14:40:00',
      fechaGestion: '2026-05-19T08:05:00',
      estado: 'GESTIONADA',
    },
    {
      id: 'NOV-003',
      tipoNovedad: 'Activación',
      especialidad: '',
      nombrePaciente: 'Ana Lucía Torres',
      numeroIdentificacion: '3344556677',
      piso: 'Piso 3',
      usuarioReporta: 'sistema',
      usuarioGestion: 'Automático',
      fechaSolicitud: '2026-05-22T11:00:00',
      fechaGestion: '2026-05-22T11:00:00',
      estado: 'EN_PROCESO',
    },
    {
      id: 'NOV-004',
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: '2026-05-15T16:20:00',
      fechaGestion: '2026-05-16T09:30:00',
      estado: 'RECHAZADA',
    },
    {
      id: 'NOV-005',
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: '2026-05-15T16:20:00',
      fechaGestion: '2026-05-16T09:30:00',
      estado: 'RECHAZADA',
    },
    {
      id: 'NOV-006',
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: '2026-05-15T16:20:00',
      fechaGestion: '2026-05-16T09:30:00',
      estado: 'RECHAZADA',
    },
    {
      id: 'NOV-007',
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: '2026-05-15T16:20:00',
      fechaGestion: '2026-05-16T09:30:00',
      estado: 'RECHAZADA',
    },
    {
      id: 'NOV-008',
      tipoNovedad: 'Cambio de cita',
      especialidad: 'Medicina general',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: '2026-05-15T16:20:00',
      fechaGestion: '2026-05-16T09:30:00',
      estado: 'RECHAZADA',
    },
    {
      id: 'NOV-009',
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: '2026-05-15T16:20:00',
      fechaGestion: '2026-05-16T09:30:00',
      estado: 'RECHAZADA',
    },
  ];

  override buscar(_filtro: FiltroNovedades): Observable<Novedad[]> {
    // TODO: reemplazar por this.http.get<NovedadDto[]>(apiUrl('novedades', '/buscar'), { params })
    //       y .pipe(map(dtos => dtos.map(toNovedad)), catchError(traducirErrorDominio)).
    return of(this.mock.map(toNovedad));
  }

  override gestionar(_id: string): Observable<void> {
    // TODO: reemplazar por this.http.post<void>(apiUrl('novedades', `/${_id}/gestionar`), {})
    //       con catchError → error de dominio.
    return of(void 0);
  }
}
