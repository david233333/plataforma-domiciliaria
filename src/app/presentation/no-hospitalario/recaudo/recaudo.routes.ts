import { Routes } from '@angular/router';

/**
 * Rutas de la feature «recaudo no hospitalario». Slice independiente de
 * Solicitudes. El cableado de DI propio (puertos→adaptadores, casos de uso) se
 * registrará aquí, a nivel de ruta lazy, conforme la feature crezca.
 */
export const RECAUDO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./recaudo.component').then((m) => m.RecaudoComponent),
    title: 'Recaudo no hospitalario · Salud en Casa',
    data: {
      breadcrumb: [{ label: 'No hospitalario' }, { label: 'Recaudo' }],
    },
  },
];
