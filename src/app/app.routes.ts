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
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./presentation/inicio/inicio.component').then(
        (m) => m.InicioComponent,
      ),
    title: 'Inicio · Salud en Casa',
  },
  {
    path: 'novedades',
    loadChildren: () =>
      import('./presentation/hospitalario/gestionar-novedades/novedades.routes').then(
        (m) => m.NOVEDADES_ROUTES,
      ),
  },

  // Informes — un componente dedicado por ámbito.
  {
    path: 'hospitalario/informes',
    loadComponent: () =>
      import('./presentation/hospitalario/informes-h/informes-h.component').then(
        (m) => m.InformesHComponent,
      ),
    title: 'Informes hospitalario · Salud en Casa',
  },
  {
    path: 'no-hospitalario/informes',
    loadComponent: () =>
      import('./presentation/no-hospitalario/informes-nh/informes-nh.component').then(
        (m) => m.InformesNhComponent,
      ),
    title: 'Informes no hospitalario · Salud en Casa',
  },
  {
    path: 'no-hospitalario/solicitudes',
    loadComponent: () =>
      import('./presentation/no-hospitalario/solicitudes/solicitudes.component').then(
        (m) => m.SolicitudesComponent,
      ),
    title: 'Solicitudes no hospitalario · Salud en Casa',
  },

  {
    path: 'arquitectura-estilos',
    loadComponent: () =>
      import(
        './presentation/documentacion/arquitectura-estilos/arquitectura-estilos.component'
      ).then((m) => m.ArquitecturaEstilosComponent),
    title: 'Arquitectura de estilos',
  },
  ...(!environment.production
    ? [
        {
          path: 'design-system',
          loadComponent: () =>
            import('./presentation/documentacion/design-system/design-system.component').then(
              (m) => m.DesignSystemComponent,
            ),
          title: 'Design System',
        },
      ]
    : []),
];
