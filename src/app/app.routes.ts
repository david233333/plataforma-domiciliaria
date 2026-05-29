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
    loadComponent: () =>
      import(
        './features/novedades/gestionar-novedades.component'
      ).then((m) => m.GestionarNovedadesComponent),
    title: 'Gestionar novedades',
  },
  {
    path: 'arquitectura-estilos',
    loadComponent: () =>
      import(
        './features/documentacion/arquitectura-estilos.component'
      ).then((m) => m.ArquitecturaEstilosComponent),
    title: 'Arquitectura de estilos',
  },
  ...(!environment.production
    ? [
        {
          path: 'design-system',
          loadComponent: () =>
            import('./features/design-system/design-system.component').then(
              (m) => m.DesignSystemComponent,
            ),
          title: 'Design System',
        },
      ]
    : []),
];
