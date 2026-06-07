import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Forma del placeholder de carga. */
export type SkeletonVariant = 'block' | 'text' | 'circle';

/**
 * Átomo: skeleton (placeholder de carga).
 *
 * El bloque gris con barrido «shimmer» que ocupa el sitio del contenido
 * mientras llegan los datos, evitando saltos de layout. Reutiliza el patrón
 * `.skeleton` / `.skeleton--text` / `.skeleton--circle` de
 * `src/styles/patterns/_patterns.scss` (la animación respeta
 * `prefers-reduced-motion`).
 *
 * El tamaño se controla con `width`/`height` (cualquier unidad CSS). Es
 * puramente decorativo: se marca `aria-hidden` para que no lo lean los lectores
 * de pantalla.
 *
 * ```html
 * <app-skeleton variant="circle" width="3rem" height="3rem" />
 * <app-skeleton variant="text" width="70%" />
 * ```
 */
@Component({
  selector: 'app-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'skeleton',
    '[class.skeleton--text]': 'variant() === "text"',
    '[class.skeleton--circle]': 'variant() === "circle"',
    '[style.display]': '"block"',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    'aria-hidden': 'true',
  },
  template: '',
})
export class SkeletonComponent {
  /** Forma del placeholder: bloque (por defecto), línea de texto o círculo. */
  readonly variant = input<SkeletonVariant>('block');

  /** Ancho (cualquier unidad CSS, ej. `70%`, `3rem`). */
  readonly width = input<string | null>(null);

  /** Alto (cualquier unidad CSS). Para `text`/`circle` el patrón ya da uno base. */
  readonly height = input<string | null>(null);
}
