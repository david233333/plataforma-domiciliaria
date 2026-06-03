import { Routes } from '@angular/router';
import { provideNovedades } from '../../application/di/novedades.providers';

/**
 * Rutas de la feature novedades. El cableado de DI (`provideNovedades`) se
 * registra aquí, a nivel de ruta lazy, para aislar el slice: puerto→adaptador y
 * casos de uso solo existen mientras la feature está cargada.
 */
export const NOVEDADES_ROUTES: Routes = [
  {
    path: '',
    providers: [provideNovedades()],
    loadComponent: () =>
      import('./gestionar-novedades.component').then(
        (m) => m.GestionarNovedadesComponent,
      ),
    title: 'Gestionar novedades',
  }
];
