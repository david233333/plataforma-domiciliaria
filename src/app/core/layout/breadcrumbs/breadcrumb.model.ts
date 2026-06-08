import { ActivatedRouteSnapshot } from '@angular/router';

/**
 * Un eslabón del breadcrumb. `link` es opcional: si falta, el eslabón es solo
 * un rótulo (p. ej. el nombre de una sección que no tiene página propia) o la
 * página actual. La página actual nunca enlaza, aunque traiga `link`.
 */
export interface Crumb {
  readonly label: string;
  readonly link?: string;
}

/**
 * Lo que cada ruta declara en `data.breadcrumb`. Puede ser:
 *   - un arreglo estático de eslabones, o
 *   - una función que los calcula desde la ruta (para etiquetas que dependen de
 *     un parámetro, p. ej. el ámbito en `/informes/:ambito`).
 *
 * El `BreadcrumbsComponent` recorre el árbol de rutas activas y concatena los
 * eslabones de cada nivel que la declare.
 */
export type BreadcrumbData =
  | readonly Crumb[]
  | ((route: ActivatedRouteSnapshot) => readonly Crumb[]);
