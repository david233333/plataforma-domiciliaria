import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  FeatureIconComponent,
  FeatureIconTone,
} from '../feature-icon/feature-icon.component';

/**
 * Molécula: encabezado de página.
 *
 * La cabecera estándar de una pantalla: un `overline` opcional (categoría),
 * el título (`<h1>`), una descripción opcional y, a la izquierda, un icono
 * destacado opcional. A la derecha proyecta acciones (botones) vía
 * `<ng-content>`.
 *
 * Compone la molécula `app-feature-icon` (que a su vez compone el átomo
 * `app-icon`). Mantiene la jerarquía: el título siempre es `<h1>`, único por
 * página.
 *
 * ```html
 * <app-page-header
 *   overline="Operaciones"
 *   title="Gestionar novedades"
 *   icon="file-edit">
 *   <app-button label="Descargar" icon="download" variant="outlined" />
 * </app-page-header>
 * ```
 */
@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FeatureIconComponent],
  template: `
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex items-center gap-4">
        @if (icon(); as nombreIcono) {
          <app-feature-icon [icon]="nombreIcono" [tone]="iconTone()" size="lg" />
        }
        <div class="flex flex-col gap-1">
          @if (overline(); as textoOverline) {
            <p class="text-overline m-0">{{ textoOverline }}</p>
          }
          <h1 class="text-heading-xl text-text-primary text-balance m-0">
            {{ title() }}
          </h1>
          @if (description(); as textoDescripcion) {
            <p class="text-body-lg text-text-secondary text-pretty max-w-2xl m-0">
              {{ textoDescripcion }}
            </p>
          }
        </div>
      </div>

      <ng-content />
    </header>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class PageHeaderComponent {
  /** Texto pequeño sobre el título (categoría/sección). Opcional. */
  readonly overline = input<string | null>(null);

  /** Título de la página (se renderiza como `<h1>`). */
  readonly title = input.required<string>();

  /** Descripción breve bajo el título. Opcional. */
  readonly description = input<string | null>(null);

  /** Icono destacado a la izquierda (PrimeIcons). Opcional. */
  readonly icon = input<string | null>(null);

  /** Color del icono destacado. */
  readonly iconTone = input<FeatureIconTone>('primary');
}
