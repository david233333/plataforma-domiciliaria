// Entorno por DEFECTO (desarrollo). En build de producción se reemplaza por
// environment.production.ts vía `fileReplacements` en angular.json.
//
// `apis` es el mapa de bases REST por servicio. Cada adaptador de
// `infrastructure/` arma su URL desde `environment.apis.<api>` (helper en
// infrastructure/http/api-url.ts).
export const environment = {
  production: false,
  apis: {
    core: 'https://api.dev/core',
    novedades: 'https://api.dev/novedades',
    notificaciones: 'https://api.dev/notificaciones',
  },
};
