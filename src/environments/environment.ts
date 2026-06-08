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
    apiBaseUrl: 'https://apidomiciliario.labsura.com',
    // Base de maestros. Cada repositorio agrega su path (p. ej. /maestros/ciudad).
    novedades: 'http://192.168.40.96:9099/api_novedades',
  },
};
