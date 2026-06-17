import { DatosPacienteManual } from './datos-paciente-manual.entity';

/**
 * Entidades de dominio del guardado de una solicitud.
 *
 * `NuevaSolicitud` es el comando que viaja al backend al confirmar; reúne lo
 * elegido por el usuario (identificación, plan, servicio) con lo inferido por la
 * cascada (programa, piso, zona, conducta, SLA, copago).
 *
 * `datosPaciente` SOLO viaja cuando el paciente no tiene cobertura y se
 * capturaron a mano ([[datos-paciente-manual.entity]]); en el camino con
 * cobertura el backend ya conoce al paciente y este campo se omite.
 *
 * `ResultadoSolicitud` es la respuesta: el identificador asignado y los datos
 * que la pantalla muestra al final (resumen/confirmación).
 */
export interface NuevaSolicitud {
  readonly tipoIdentificacion: string;
  readonly numeroIdentificacion: string;
  readonly planSalud: string;
  readonly tipoServicio: string;
  readonly programa: string;
  readonly piso: string;
  readonly zona: string;
  readonly conducta: string;
  readonly sla: string;
  readonly copago: number;
  readonly datosPaciente?: DatosPacienteManual;
}

export interface ResultadoSolicitud {
  readonly idSolicitud: string;
  readonly fechaMaximaAtencion: string; // ISO 8601
  readonly mensaje: string;
}
