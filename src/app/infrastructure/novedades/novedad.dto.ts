/**
 * DTO de transporte HTTP de una novedad. Refleja el contrato del backend
 * (fechas como string ISO, estado como string). Vive en infrastructure: el
 * dominio NUNCA ve este tipo, solo la entidad `Novedad`.
 */
export interface NovedadDto {
  readonly id: string;
  readonly tipoNovedad: string;
  readonly especialidad: string;
  readonly nombrePaciente: string;
  readonly numeroIdentificacion: string;
  readonly piso: string;
  readonly usuarioReporta: string;
  readonly usuarioGestion: string | null;
  readonly fechaSolicitud: string;
  readonly fechaGestion: string | null;
  readonly estado: string;
}
