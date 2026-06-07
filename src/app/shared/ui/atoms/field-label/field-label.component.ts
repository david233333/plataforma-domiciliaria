import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Átomo: etiqueta de un campo de formulario.
 *
 * Pieza mínima e indivisible (Atomic Design). Presenta el texto del campo y,
 * si es obligatorio, el asterisco. Proyecta su texto con un único `<ng-content>`.
 *
 * Se adapta al tipo de control que etiqueta mediante atributos (sin duplicar el
 * slot de proyección, que debe ser único):
 *  - Con `for` → asocia el `<label>` a un control concreto (input, select…).
 *  - Sin `for`, con `groupId` → expone un `id` para usar el label como destino
 *    de `aria-labelledby` de un grupo (radiogroup, toggle).
 *
 * Reutiliza `.field__label` / `.field__required` de
 * `src/styles/patterns/_patterns.scss`. No compone otros átomos: es una hoja.
 */
@Component({
  selector: 'app-field-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="field__label" [attr.for]="for()" [attr.id]="groupId()">
      <ng-content />
      @if (required()) {
        <span class="field__required" aria-hidden="true">*</span>
      }
    </label>
  `,
})
export class FieldLabelComponent {
  /** Id del control asociado (atributo `for`). Omítelo para etiquetar un grupo. */
  readonly for = input<string | null>(null);

  /** Id del `<span>` cuando no hay `for` (para `aria-labelledby` de un grupo). */
  readonly groupId = input<string | null>(null);

  /** Marca el campo como obligatorio (muestra el asterisco). */
  readonly required = input(false);
}
