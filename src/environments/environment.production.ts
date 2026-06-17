// Entorno de PRODUCCIÓN. Reemplaza a environment.ts en el build `production`.
export const environment = {
  production: true,
  apis: {
    core: 'https://api.salud-en-casa.com/core',
    novedades: 'https://api.salud-en-casa.com/novedades',
    // Catálogos «maestros» (ciudad, etc.). Ajustar al dominio real de producción.
    maestros: 'https://api.salud-en-casa.com/novedades/api_novedades/maestros',
    // Controlador «información paciente» (cobertura). Ajustar al dominio real.
    ingreso: 'https://api.salud-en-casa.com/api_ingreso',
  },
};
