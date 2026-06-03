/**
 * Utilidades sin negocio, reutilizables por cualquier capa externa.
 * `shared` NO depende de ninguna capa interna y NO contiene reglas de negocio.
 */

/** Normaliza un valor a array (útil al mapear filtros multi-select opcionales). */
export function aArreglo<T>(valor: T | readonly T[] | null | undefined): T[] {
  if (valor === null || valor === undefined) {
    return [];
  }
  return Array.isArray(valor) ? [...valor] : [valor as T];
}

/** ¿La cadena tiene contenido real (no vacía ni solo espacios)? */
export function tieneTexto(valor: string | null | undefined): valor is string {
  return typeof valor === 'string' && valor.trim().length > 0;
}
