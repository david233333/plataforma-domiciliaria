/**
 * Entidad de dominio: resultado de INFERIR el servicio.
 *
 * En el sistema legacy, elegir un tipo de servicio disparaba una cadena de
 * consultas (prestación → programa → piso → zona → conducta → SLA → copago).
 * Aquí ese encadenamiento se modela como UNA operación de dominio que devuelve
 * el paquete inferido completo. El backend (o el mock) resuelve la cascada; la
 * presentación solo consume el resultado.
 */
export interface InferenciaServicio {
  readonly programa: string;
  readonly piso: string;
  readonly zona: string;
  readonly conducta: string;
  readonly sla: string; // p. ej. "48 h"
  readonly copago: number;
}
