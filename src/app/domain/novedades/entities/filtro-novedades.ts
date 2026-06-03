/**
 * Modelo de dominio con los criterios de búsqueda de novedades.
 *
 * El `FormGroup` (Reactive Forms) vive en el componente de presentación; al
 * buscar, el componente mapea el valor crudo del formulario a este modelo. Así
 * el dominio no conoce `@angular/forms`.
 */
export interface FiltroNovedades {
  readonly ciudad?: string;
  readonly tipoDocumento?: string;
  readonly numeroDocumento?: string;
  readonly remision?: string;
  readonly programa?: string;
  readonly clasificacion?: string;
  readonly piso?: readonly string[];
  readonly estado?: string;
  readonly tiposNovedad?: string;
  readonly especialidadCita?: string;
  readonly fechaInicioNovedad?: Date | null;
  readonly fechaFinNovedad?: Date | null;
}
