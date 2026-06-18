import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { provideMaestros } from './application/di/maestros.providers';

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
    // Última miga depende del ámbito (parámetro de ruta).
    data: {
      breadcrumb: (route: ActivatedRouteSnapshot) => [
        { label: 'Informes' },
        {
          label:
            route.paramMap.get('ambito') === 'no-hospitalario'
              ? 'No hospitalarios'
              : 'Hospitalarios',
        },
      ],
    },
  },
  {
    // Crear solicitud (wizard de secciones progresivas con @ngrx/signals). La
    // ruta más específica va ANTES que la lista. El DI del slice se cablea
    // dentro de sus propias rutas lazy (`SOLICITUD_CREAR_ROUTES`).
    path: 'no-hospitalario/solicitudes/crear',
    loadChildren: () =>
      import(
        './presentation/no-hospitalario/solicitud-crear/solicitud-crear.routes'
      ).then((m) => m.SOLICITUD_CREAR_ROUTES),
  },
  {
    path: 'no-hospitalario/solicitudes',
    // El catálogo de tipos de identificación (filtro) viene del slice `maestros`;
    // se cablea a nivel de ruta lazy para aislar el slice mientras está cargada.
    providers: [provideMaestros()],
    loadComponent: () =>
      import('./presentation/no-hospitalario/solicitudes/solicitudes.component').then(
        (m) => m.SolicitudesComponent,
      ),
    title: 'Solicitudes no hospitalario · Salud en Casa',
    data: { breadcrumb: [{ label: 'No hospitalario' }, { label: 'Solicitudes' }] },
  },
  {
    // Recaudo no hospitalario. Slice independiente de Solicitudes; su DI propio
    // se cablea dentro de sus rutas lazy (`RECAUDO_ROUTES`).
    path: 'no-hospitalario/recaudo',
    loadChildren: () =>
      import('./presentation/no-hospitalario/recaudo/recaudo.routes').then(
        (m) => m.RECAUDO_ROUTES,
      ),
  },

  {
    path: 'arquitectura-estilos',
    loadComponent: () =>
      import(
        './presentation/documentacion/arquitectura-estilos/arquitectura-estilos.component'
      ).then((m) => m.ArquitecturaEstilosComponent),
    title: 'Arquitectura de estilos',
    data: {
      breadcrumb: [{ label: 'Documentación' }, { label: 'Arquitectura de estilos' }],
    },
  },
  {
    path: 'atomic-design',
    loadComponent: () =>
      import(
        './presentation/documentacion/atomic-design/atomic-design.component'
      ).then((m) => m.AtomicDesignComponent),
    title: 'Atomic Design',
    data: {
      breadcrumb: [{ label: 'Documentación' }, { label: 'Atomic Design' }],
    },
  },
  {
    path: 'novedades-angular',
    loadComponent: () =>
      import(
        './presentation/documentacion/novedades-angular/novedades-angular.component'
      ).then((m) => m.NovedadesAngularComponent),
    title: 'Novedades de Angular 18 → 21',
    data: {
      breadcrumb: [{ label: 'Documentación' }, { label: 'Novedades de Angular 18 → 21' }],
    },
  },
  {
    path: 'signal-store',
    loadComponent: () =>
      import(
        './presentation/documentacion/signal-store/signal-store.component'
      ).then((m) => m.SignalStoreComponent),
    title: 'Estado con SignalStore (@ngrx/signals)',
    data: {
      breadcrumb: [{ label: 'Documentación' }, { label: 'SignalStore (@ngrx/signals)' }],
    },
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
          data: { breadcrumb: [{ label: 'Documentación' }, { label: 'Design System' }] },
        },
      ]
    : []),
];
