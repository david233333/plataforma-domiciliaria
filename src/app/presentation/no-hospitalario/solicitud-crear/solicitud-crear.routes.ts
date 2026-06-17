import { Routes } from '@angular/router';
import { provideSolicitud } from '../../../application/di/solicitud.providers';
import { provideMaestros } from '../../../application/di/maestros.providers';

/**
 * Rutas de la feature «crear solicitud no hospitalaria». El cableado de DI
 * (`provideSolicitud`, `provideMaestros`) se registra aquí, a nivel de ruta
 * lazy, para aislar el slice: puerto→adaptador y caso de uso solo existen
 * mientras la feature está cargada. `maestros` alimenta el catálogo de tipos de
 * identificación de la sección de cobertura.
 */
export const SOLICITUD_CREAR_ROUTES: Routes = [
  {
    path: '',
    providers: [provideSolicitud(), provideMaestros()],
    loadComponent: () =>
      import('./solicitud-crear.component').then(
        (m) => m.SolicitudCrearComponent,
      ),
    title: 'Nueva solicitud no hospitalaria · Salud en Casa',
    data: {
      breadcrumb: [
        { label: 'No hospitalario' },
        { label: 'Solicitudes' },
        { label: 'Nueva' },
      ],
    },
  },
];
