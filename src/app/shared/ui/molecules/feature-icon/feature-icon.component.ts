import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { IconComponent } from '../../atoms/icon/icon.component';

/** Tono de color del recuadro (fondo claro + icono contrastado). */
export type FeatureIconTone =
  | 'primary'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

/** Tamaño del recuadro. */
export type FeatureIconSize = 'md' | 'lg';

/**
 * Molécula: icono destacado dentro de un recuadro de color.
 *
 * El cuadrado redondeado con fondo tenue y un icono centrado que acompaña a un
 * título (cabeceras de sección/página, resumen de una tarjeta). Compone el
 * átomo `app-icon` y le pone el contenedor con color por `tone`.
 *
 * Es decorativo por defecto: el icono hereda `aria-hidden` del átomo (suele
 * duplicar el texto contiguo). Pásale `label` solo si transmite significado
 * propio.
 *
 * ```html
 * <app-feature-icon icon="file-edit" tone="primary" size="lg" />
 * ```
 */
@Component({
  selector: 'app-feature-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: { '[class]': 'hostClass()' },
  template: `<app-icon [name]="icon()" [label]="label()" />`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-radius: var(--app-radius-md);
    }
    :host(.feature-icon--md) {
      width: 2.5rem;
      height: 2.5rem;
      font-size: var(--app-size-base);
    }
    :host(.feature-icon--lg) {
      width: 3rem;
      height: 3rem;
      font-size: 1.5rem;
    }
    :host(.feature-icon--primary) {
      background: var(--app-primary-50);
      color: var(--app-primary-600);
    }
    :host(.feature-icon--neutral) {
      background: var(--app-surface-100);
      color: var(--app-text-secondary);
    }
    :host(.feature-icon--success) {
      background: var(--app-success-light);
      color: var(--app-success-dark);
    }
    :host(.feature-icon--warning) {
      background: var(--app-warning-light);
      color: var(--app-warning-dark);
    }
    :host(.feature-icon--danger) {
      background: var(--app-error-light);
      color: var(--app-error-dark);
    }
    :host(.feature-icon--info) {
      background: var(--app-info-light);
      color: var(--app-info-dark);
    }
  `,
})
export class FeatureIconComponent {
  /** Icono PrimeIcons (con o sin prefijo `pi-`). */
  readonly icon = input.required<string>();

  /** Color del recuadro. */
  readonly tone = input<FeatureIconTone>('primary');

  /** Tamaño del recuadro. */
  readonly size = input<FeatureIconSize>('md');

  /** Etiqueta accesible si el icono tiene significado propio (no decorativo). */
  readonly label = input<string | null>(null);

  /** Clases del host: `feature-icon` + tono + tamaño. */
  protected readonly hostClass = computed(
    () => `feature-icon feature-icon--${this.tone()} feature-icon--${this.size()}`,
  );
}
