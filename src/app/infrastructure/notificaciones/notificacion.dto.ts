/**
 * DTO de transporte HTTP de una notificación (fecha como string ISO).
 */
export interface NotificacionDto {
  readonly id: string;
  readonly titulo: string;
  readonly mensaje: string;
  readonly leida: boolean;
  readonly fecha: string;
}
