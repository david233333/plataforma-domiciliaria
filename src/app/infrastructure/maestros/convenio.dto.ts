/**
 * DTO de transporte HTTP de un convenio. Refleja el contrato del backend
 * (`GET /maestros/convenios`). Vive en infrastructure: el dominio NUNCA ve este
 * tipo, solo la entidad `Convenio`.
 *
 * Las fechas viajan como `string` ISO 8601 (así las serializa el backend); el
 * mapper las convierte a `Date` antes de entregar la entidad de dominio.
 */
export interface ConvenioDto {
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
  readonly fechaInicioVigenciaAsegurado: string;
  readonly fechaFinVigenciaAsegurado: string;
  readonly numeroContrato: string;
  readonly tieneCoberturaDomiciliaria: boolean;
  readonly fechaLimiteCobertura: string;
}
