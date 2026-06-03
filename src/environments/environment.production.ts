// Entorno de PRODUCCIÓN. Reemplaza a environment.ts en el build `production`.
export const environment = {
  production: true,
  apis: {
    core: 'https://api.salud-en-casa.com/core',
    novedades: 'https://api.salud-en-casa.com/novedades',
    notificaciones: 'https://api.salud-en-casa.com/notificaciones',
  },
};
