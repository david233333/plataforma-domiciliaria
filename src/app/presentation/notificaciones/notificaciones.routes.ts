import { Routes } from '@angular/router';

/**
 * Ruta del panel de notificaciones. El cableado de DI (`provideNotificaciones`)
 * NO va aquí sino en `app.config.ts`, porque el `NotificacionesFacade` es un
 * singleton root consumido también por el badge del header.
 */
export const NOTIFICACIONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./notificaciones-panel.component').then(
        (m) => m.NotificacionesPanelComponent,
      ),
    title: 'Notificaciones',
  },
];
