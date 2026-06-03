import { inject, Provider } from '@angular/core';
import { NotificacionRepository } from '../../domain/notificaciones/ports/notificacion.repository';
import { NotificacionHttpRepository } from '../../infrastructure/notificaciones/notificacion-http.repository';
import { ConsultarNotificacionesUseCase } from '../../domain/notificaciones/use-cases/consultar-notificaciones.use-case';

/**
 * Cableado de DI del slice `notificaciones`. Igual patrón que `provideNovedades`.
 *
 * Se registra a nivel de aplicación (app.config) porque el `NotificacionesFacade`
 * es un singleton `providedIn: 'root'` y necesita resolver el caso de uso desde
 * el inyector raíz.
 */
export function provideNotificaciones(): Provider[] {
  return [
    { provide: NotificacionRepository, useClass: NotificacionHttpRepository },
    {
      provide: ConsultarNotificacionesUseCase,
      useFactory: () =>
        new ConsultarNotificacionesUseCase(inject(NotificacionRepository)),
    },
  ];
}
