/**
 * Entidad de dominio: tipo de servicio de atención (lo que el usuario elige y
 * dispara la cascada de inferencia). Inmutable. TypeScript puro.
 */
export interface TipoServicio {
  readonly codigo: string;
  readonly nombre: string;
}
