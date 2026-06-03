import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NotificacionRepository } from '../../domain/notificaciones/ports/notificacion.repository';
import { Notificacion } from '../../domain/notificaciones/entities/notificacion.entity';
import { NotificacionDto } from './notificacion.dto';
import { toNotificacion } from './notificacion.mapper';

/**
 * Adaptador HTTP del puerto `NotificacionRepository`. Datos mock por ahora.
 */
@Injectable()
export class NotificacionHttpRepository extends NotificacionRepository {
  private readonly mock: readonly NotificacionDto[] = [
    {
      id: 'NOT-001',
      titulo: 'Nueva novedad asignada',
      mensaje: 'Tienes una novedad pendiente de gestión en el Piso 2.',
      leida: false,
      fecha: '2026-05-28T08:30:00',
    },
    {
      id: 'NOT-002',
      titulo: 'Remisión actualizada',
      mensaje: 'La remisión R-00123 cambió de estado.',
      leida: false,
      fecha: '2026-05-27T17:10:00',
    },
    {
      id: 'NOT-003',
      titulo: 'Informe disponible',
      mensaje: 'El informe semanal ya puede descargarse.',
      leida: true,
      fecha: '2026-05-26T12:00:00',
    },
  ];

  override consultar(): Observable<Notificacion[]> {
    // TODO: reemplazar por this.http.get<NotificacionDto[]>(apiUrl('notificaciones'))
    //       .pipe(map(dtos => dtos.map(toNotificacion)), catchError(...)).
    return of(this.mock.map(toNotificacion));
  }
}
