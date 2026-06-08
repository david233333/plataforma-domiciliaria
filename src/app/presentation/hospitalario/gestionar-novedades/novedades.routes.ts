import { Routes } from '@angular/router';
import { provideNovedades } from '../../../application/di/novedades.providers';
import { provideMaestros } from '../../../application/di/maestros.providers';

/**
 * Rutas de la feature novedades. El cableado de DI (`provideNovedades`,
 * `provideMaestros`) se registra aquí, a nivel de ruta lazy, para aislar el
 * slice: puerto→adaptador y casos de uso solo existen mientras la feature está
 * cargada. `maestros` alimenta los catálogos de los filtros (hoy, ciudad).
 */
export const NOVEDADES_ROUTES: Routes = [
  {
    path: '',
    providers: [provideNovedades(), provideMaestros()],
    loadComponent: () =>
      import('./gestionar-novedades.component').then(
        (m) => m.GestionarNovedadesComponent,
      ),
    title: 'Gestionar novedades',
    data: {
      breadcrumb: [{ label: 'Hospitalario' }, { label: 'Gestionar novedades' }],
    },
  }
];
