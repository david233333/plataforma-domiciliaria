/**
 * Error base del dominio. TypeScript puro: NO depende de Angular.
 *
 * Todas las excepciones de negocio extienden de esta clase para que las capas
 * externas (infrastructure/application) puedan distinguir un error de dominio
 * de un error técnico (p. ej. un `HttpErrorResponse`).
 */
export abstract class DomainError extends Error {
  protected constructor(message: string) {
    super(message);
    // `new.target.name` deja el nombre real de la subclase (no "Error"),
    // útil al inspeccionar el error en logs o en `instanceof`.
    this.name = new.target.name;
  }
}
