/**
 * Error de dominio: el paciente consultado NO tiene cobertura.
 *
 * No es un fallo técnico, es un CAMINO DE NEGOCIO: el backend de «información
 * paciente» responde 500 cuando la identificación no tiene cobertura asociada.
 * El adaptador HTTP traduce ese 500 a este error (las entidades de dominio no
 * conocen códigos HTTP) y la presentación lo interpreta para habilitar el
 * ingreso MANUAL de los datos del paciente.
 */
export class PacienteSinCoberturaError extends Error {
  constructor() {
    super('El paciente no tiene cobertura. Ingresa los datos manualmente.');
    this.name = 'PacienteSinCoberturaError';
  }
}
