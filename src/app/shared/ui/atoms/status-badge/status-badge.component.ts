import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Variantes semánticas del badge (cada una con su par de color WCAG AA). */
export type StatusVariant = 'success' | 'warning' | 'error' | 'info';

/**
 * Átomo: badge de estado.
 *
 * La etiqueta-píldora coloreada que comunica un estado: «Activo», «Pendiente»,
 * «Rechazado». Encapsula la traducción `variante → clase CSS`, y con ello el
 * par de color (fondo claro + texto oscuro) cuyo contraste ya está verificado
 * en `.status-badge--*` (`src/styles/patterns/_patterns.scss`).
 *
 * El texto entra por proyección; el icono es opcional y decorativo (el propio
 * texto ya nombra el estado). Es una hoja: no compone otros átomos.
 *
 * ```html
 * <app-status-badge variant="success" icon="check">Activo</app-status-badge>
 * ```
 */
@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"status-badge status-badge--" + variant()',
  },
  template: `
    @if (icon()) {
      <i class="pi pi-{{ icon() }}" aria-hidden="true"></i>
    }
    <ng-content />
  `,
})
export class StatusBadgeComponent {
  /** Estado semántico que define el color de la píldora. */
  readonly variant = input.required<StatusVariant>();

  /** Icono PrimeIcons opcional (sin prefijo `pi-`), ej. `check`, `clock`. */
  readonly icon = input<string | null>(null);
}
