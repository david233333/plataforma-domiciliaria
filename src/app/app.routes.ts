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

  // Informes — UN solo componente para ambos ámbitos; el ámbito viaja en la URL
  // (`/informes/:ambito`) para poder enlazarlo directo desde el menú lateral.
  {
    path: 'informes',
    redirectTo: 'informes/hospitalario',
    pathMatch: 'full',
  },
  {
    path: 'informes/:ambito',
    loadComponent: () =>
      import('./presentation/informes/informes.component').then(
        (m) => m.InformesComponent,
      ),
    title: 'Informes · Salud en Casa',
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
