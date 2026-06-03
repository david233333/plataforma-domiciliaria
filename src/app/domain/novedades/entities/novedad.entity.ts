import { EstadoNovedad, estadoEsGestionable } from './estado-novedad';

/**
 * Entidad de dominio Novedad. Inmutable (todos los campos `readonly`).
 * TypeScript puro: sin Angular, sin PrimeNG.
 */
export interface Novedad {
  readonly id: string;
  readonly tipoNovedad: string;
  readonly especialidad: string;
  readonly nombrePaciente: string;
  readonly numeroIdentificacion: string;
  readonly piso: string;
  readonly usuarioReporta: string;
  readonly usuarioGestion: string | null;
  readonly fechaSolicitud: Date;
  readonly fechaGestion: Date | null;
  readonly estado: EstadoNovedad;
}

/**
 * Regla de negocio a nivel de entidad: ¿esta novedad puede gestionarse?
 * Delega en el value object del estado.
 */
export function novedadEsGestionable(novedad: Novedad): boolean {
  return estadoEsGestionable(novedad.estado);
}
