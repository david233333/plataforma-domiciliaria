import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Átomo: mensaje de error de un campo de formulario.
 *
 * Pieza mínima (Atomic Design). Solo presenta el texto de error con
 * `role="alert"` para que los lectores de pantalla lo anuncien. Si `message`
 * es `null`/vacío no renderiza nada (deja el slot de mensaje reservado por la
 * molécula contenedora, evitando layout shift).
 *
 * Reutiliza la clase `.field__error` de `src/styles/patterns/_patterns.scss`.
 */
@Component({
  selector: 'app-field-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message()) {
      <p class="field__error" role="alert">{{ message() }}</p>
    }
  `,
})
export class FieldErrorComponent {
  /** Texto del error; `null` no renderiza nada. */
  readonly message = input<string | null>(null);
}
