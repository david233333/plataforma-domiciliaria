import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FieldLabelComponent } from '../../atoms/field-label/field-label.component';
import { FieldErrorComponent } from '../../atoms/field-error/field-error.component';
import { FieldHintComponent } from '../../atoms/field-hint/field-hint.component';

/**
 * Molécula: campo de formulario (Atomic Design).
 *
 * Compone los átomos `app-field-label` + `app-field-error` y proyecta el control
 * real (PrimeNG o nativo) vía `<ng-content>`. Colapsa el bloque repetido de
 * `label + control + slot de mensaje` que antes se escribía a mano en cada
 * pantalla.
 *
 * Es **tonta**: no conoce dominio ni Reactive Forms. El estado de validación lo
 * decide la página (smart) y se lo pasa por `error`. La reserva de altura del
 * mensaje (`.field__message-slot`) evita layout shift al aparecer un error.
 *
 * Uso:
 * ```html
 * <app-form-field label="Sede" controlId="sedes" [required]="true"
 *   [error]="mostrarErrorSedes() ? 'Selecciona una sede.' : null">
 *   <p-multiselect inputId="sedes" formControlName="sedes" ... />
 * </app-form-field>
 * ```
 */
@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FieldLabelComponent, FieldErrorComponent, FieldHintComponent],
  template: `
    <div class="field">
      <app-field-label [for]="controlId()" [required]="required()">
        {{ label() }}
      </app-field-label>

      <ng-content />

      <div class="field__message-slot">
        @if (error()) {
          <app-field-error [message]="error()" />
        } @else if (hint(); as textoAyuda) {
          <app-field-hint icon="info-circle">{{ textoAyuda }}</app-field-hint>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class FormFieldComponent {
  /** Texto del label visible. */
  readonly label = input.required<string>();

  /** Id del control proyectado (enlaza label↔control por `for`/`inputId`). */
  readonly controlId = input.required<string>();

  /** Marca el campo como obligatorio (asterisco en el label). */
  readonly required = input(false);

  /** Mensaje de error a mostrar; `null` cuando el campo es válido. */
  readonly error = input<string | null>(null);

  /** Texto de ayuda; se muestra solo si no hay error. */
  readonly hint = input<string | null>(null);
}
