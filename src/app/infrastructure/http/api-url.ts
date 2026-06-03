import { environment } from '../../../environments/environment';

/** Nombres válidos de API, derivados del mapa `environment.apis`. */
export type ApiName = keyof typeof environment.apis;

/**
 * Centraliza la concatenación base + path para los adaptadores HTTP.
 * Evita barras duplicadas independientemente de cómo venga cada parte.
 *
 * @example apiUrl('novedades', '/buscar') // https://api.dev/novedades/buscar
 */
export function apiUrl(api: ApiName, path = ''): string {
  const base = environment.apis[api].replace(/\/+$/, '');
  if (!path) {
    return base;
  }
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
