import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Átomo: texto de ayuda de un campo de formulario.
 *
 * El textito tenue (a veces con icono de info) que orienta al usuario debajo de
 * un control: «El rango máximo es de 10 días», «Usa al menos 8 caracteres».
 *
 * Reutiliza la clase `.field__hint` de `src/styles/patterns/_patterns.scss`.
 * El icono es opcional y, por ser decorativo, va con `aria-hidden`.
 */
@Component({
  selector: 'app-field-hint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="field__hint flex items-center gap-2">
      @if (icon()) {
        <i class="pi pi-{{ icon() }}" aria-hidden="true"></i>
      }
      <ng-content />
    </p>
  `,
})
export class FieldHintComponent {
  /** Icono PrimeIcons opcional (sin prefijo `pi-`), ej. `info-circle`. */
  readonly icon = input<string | null>(null);
}
