import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/** Alineación horizontal de los botones. */
export type FormActionsAlign = 'end' | 'start' | 'between';

/**
 * Molécula: barra de acciones de un formulario.
 *
 * Agrupa y alinea los botones de acción (Guardar, Cancelar, Buscar…) que van al
 * pie de un formulario o tarjeta. No conoce los botones: los recibe por
 * `<ng-content>` (normalmente átomos `app-button`), solo se encarga del layout:
 * dirección en fila, envoltura responsiva, separación y un divisor superior
 * opcional.
 *
 * ```html
 * <app-form-actions divider>
 *   <app-button label="Limpiar" variant="outlined" severity="secondary"
 *               (clicked)="limpiar()" />
 *   <app-button label="Guardar" icon="check" type="submit" />
 * </app-form-actions>
 * ```
 */
@Component({
  selector: 'app-form-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-wrap items-center gap-3"
      [class.justify-end]="align() === 'end'"
      [class.justify-start]="align() === 'start'"
      [class.justify-between]="align() === 'between'"
      [class.pt-5]="divider()"
      [style.border-top]="divider() ? '1px solid var(--app-surface-200)' : null"
    >
      <ng-content />
    </div>
  `,
  // El host debe ser bloque: si no, queda `inline` por defecto y los márgenes
  // verticales que le pasa la página (p. ej. `mt-8`) NO aplican, dejando el
  // divisor pegado a los campos (notorio cuando hay mensajes de error arriba).
  styles: `
    :host {
      display: block;
    }
  `,
})
export class FormActionsComponent {
  /** Alineación de los botones (por defecto a la derecha). */
  readonly align = input<FormActionsAlign>('end');

  /**
   * Dibuja una línea divisoria y espacio superior para separar del contenido.
   * `booleanAttribute` permite usarlo como atributo suelto: `<app-form-actions divider>`.
   */
  readonly divider = input(false, { transform: booleanAttribute });
}
