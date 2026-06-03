/**
 * Estado de una novedad. Value object del dominio: el conjunto cerrado de
 * estados posibles y las reglas asociadas viven aquí, no en la presentación.
 *
 * La COSMÉTICA (label/variant/icon para el badge) NO pertenece al dominio: vive
 * en `presentation/novedades` porque es decisión visual, no regla de negocio.
 */
export const ESTADOS_NOVEDAD = [
  'PENDIENTE_GESTION',
  'GESTIONADA',
  'EN_PROCESO',
  'RECHAZADA',
] as const;

export type EstadoNovedad = (typeof ESTADOS_NOVEDAD)[number];

/**
 * Regla de negocio: una novedad solo puede gestionarse manualmente cuando está
 * pendiente de gestión. El resto de estados ya son terminales o automáticos.
 */
export function estadoEsGestionable(estado: EstadoNovedad): boolean {
  return estado === 'PENDIENTE_GESTION';
}
