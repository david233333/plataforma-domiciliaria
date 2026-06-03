import { Routes } from '@angular/router';
import { environment } from '../environments/environment';

// =============================================================================
// RUTAS
// =============================================================================
// La ruta /design-system (catálogo del sistema de diseño + formulario demo) solo
// se registra fuera de producción. Lazy-loaded con loadComponent: el código del
// catálogo queda en un chunk aparte y no se carga en el arranque de la app.
// =============================================================================
export const routes: Routes = [
  {
    path: 'novedades',
    loadChildren: () =>
      import('./presentation/novedades/novedades.routes').then(
        (m) => m.NOVEDADES_ROUTES,
      ),
  },
  {
    path: 'notificaciones',
    loadChildren: () =>
      import('./presentation/notificaciones/notificaciones.routes').then(
        (m) => m.NOTIFICACIONES_ROUTES,
      ),
  },
  {
    path: 'arquitectura-estilos',
    loadComponent: () =>
      import(
        './presentation/documentacion/arquitectura-estilos.component'
      ).then((m) => m.ArquitecturaEstilosComponent),
    title: 'Arquitectura de estilos',
  },
  ...(!environment.production
    ? [
        {
          path: 'design-system',
          loadComponent: () =>
            import('./presentation/design-system/design-system.component').then(
              (m) => m.DesignSystemComponent,
            ),
          title: 'Design System',
        },
      ]
    : []),
];
