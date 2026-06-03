/**
 * Entidad de dominio Notificacion. Inmutable. TypeScript puro.
 */
export interface Notificacion {
  readonly id: string;
  readonly titulo: string;
  readonly mensaje: string;
  readonly leida: boolean;
  readonly fecha: Date;
}
