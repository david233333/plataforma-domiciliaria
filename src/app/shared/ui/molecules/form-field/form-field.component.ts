import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';

import { FieldErrorComponent } from '../../atoms/field-error/field-error.component';
import { FieldHintComponent } from '../../atoms/field-hint/field-hint.component';

/**
 * Molécula: campo de formulario (Atomic Design).
 *
 * Envuelve el control proyectado (`<ng-content>`) con el **FloatLabel** de
 * PrimeNG en `variant="on"`: el label hace de placeholder cuando el campo está
 * vacío y sube al borde al enfocar/llenar. Así NO hay una línea de label arriba
 * del control —los formularios quedan homogéneos (requieran validación o no) y
 * más compactos—. Debajo queda el slot de mensaje (error/hint).
 *
 * Es **tonta**: no conoce dominio ni Reactive Forms. El estado de validación lo
 * decide la página (smart) y se lo pasa por `error`. La reserva de altura del
 * mensaje (`.field__message-slot`) evita layout shift al aparecer un error.
 *
 * IMPORTANTE: el control proyectado NO debe llevar `placeholder` —el label lo
 * sustituye; además un `[placeholder]` fuerza al label a flotar siempre.
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
  imports: [FloatLabel, FieldErrorComponent, FieldHintComponent],
  template: `
    <div class="field">
      <p-floatlabel variant="on">
        <ng-content />
        <label [for]="controlId()">
          {{ label() }}@if (required()) {<span
              class="field__required"
              aria-hidden="true"
            >*</span>}
        </label>
      </p-floatlabel>

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
