import { Notificacion } from '../../domain/notificaciones/entities/notificacion.entity';
import { NotificacionDto } from './notificacion.dto';

/** DTO → Entidad de dominio. */
export function toNotificacion(dto: NotificacionDto): Notificacion {
  return {
    id: dto.id,
    titulo: dto.titulo,
    mensaje: dto.mensaje,
    leida: dto.leida,
    fecha: new Date(dto.fecha),
  };
}

/** Entidad de dominio → DTO. */
export function toNotificacionDto(notificacion: Notificacion): NotificacionDto {
  return {
    id: notificacion.id,
    titulo: notificacion.titulo,
    mensaje: notificacion.mensaje,
    leida: notificacion.leida,
    fecha: notificacion.fecha.toISOString(),
  };
}
