/**
 * Entidad de dominio Convenio (catálogo «maestro»). Inmutable.
 * TypeScript puro: sin Angular, sin PrimeNG, sin tipos HTTP.
 *
 * Se modela como `interface` (no `class`): es un dato sin comportamiento, y así
 * es consistente con el resto de entidades del proyecto (`Ciudad`, etc.).
 *
 * Las fechas se exponen como `Date` (no `string`): el backend las envía como
 * texto ISO y el mapper (`infrastructure/maestros/convenio.mapper.ts`) hace la
 * conversión, de modo que el dominio trabaja siempre con `Date`.
 */
export interface Convenio {
  readonly planContrato: string;
  readonly codigoRamo: string;
  readonly tipoRamo: string;
  readonly descripcionPlanContrato: string;
  readonly tipoPlanPac: string;
  readonly numeroPlan: string;
  readonly codigoProducto: string;
  readonly anexoUrgencias: boolean;
  readonly anexoConsultaExterna: boolean;
  readonly anexoAtencionDomiciliaria: boolean;
  readonly fechaInicioVigenciaAsegurado: Date;
  readonly fechaFinVigenciaAsegurado: Date;
  readonly numeroContrato: string;
  readonly tieneCoberturaDomiciliaria: boolean;
  readonly fechaLimiteCobertura: Date;
}
