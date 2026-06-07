import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent } from '../../atoms/icon/icon.component';

/**
 * Molécula: estado vacío.
 *
 * El bloque centrado que se muestra cuando una lista o tabla no tiene
 * resultados: un icono grande, un título y un texto de apoyo. Opcionalmente
 * proyecta una acción (p. ej. un botón «Limpiar filtros») por `<ng-content>`.
 *
 * Compone el átomo `app-icon` y reutiliza el patrón `.empty-state` de
 * `src/styles/patterns/_patterns.scss`.
 *
 * ```html
 * <app-empty-state
 *   icon="inbox"
 *   title="No se encontraron novedades"
 *   body="Ajusta los filtros e intenta una nueva búsqueda." />
 * ```
 */
@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="empty-state">
      <app-icon [name]="icon()" />
      <p class="empty-state__title">{{ title() }}</p>
      @if (body(); as textoCuerpo) {
        <p class="empty-state__body">{{ textoCuerpo }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    /* Reproduce .empty-state__icon (grande y tenue) sobre el átomo app-icon. */
    app-icon {
      font-size: var(--app-size-4xl);
      color: var(--app-surface-400);
      line-height: 1;
    }
  `,
})
export class EmptyStateComponent {
  /** Icono PrimeIcons (sin prefijo `pi-`). Por defecto una bandeja vacía. */
  readonly icon = input<string>('inbox');

  /** Título principal del estado vacío. */
  readonly title = input.required<string>();

  /** Texto de apoyo opcional bajo el título. */
  readonly body = input<string | null>(null);
}
