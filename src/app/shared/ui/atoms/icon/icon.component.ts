import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Átomo: icono (PrimeIcons).
 *
 * Envuelve un `<i class="pi pi-…">` para centralizar **una sola vez** dos
 * decisiones que es fácil olvidar campo a campo:
 *
 *  - **Accesibilidad:** si el icono es decorativo (sin `label`) se marca con
 *    `aria-hidden="true"` para que los lectores de pantalla lo ignoren. Si
 *    transmite significado (`label` presente) se expone como `role="img"` con
 *    su `aria-label`.
 *  - **Animación de carga:** `spin` añade `pi-spin` (útil para spinners).
 *
 * El nombre se da SIN el prefijo `pi-` (`name="check"`), aunque también se
 * tolera con prefijo (`name="pi-check"`). No compone otros átomos: es una hoja.
 *
 * ```html
 * <app-icon name="download" />                 <!-- decorativo -->
 * <app-icon name="spinner" spin label="Cargando" />
 * ```
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[style.fontSize]': 'size()',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label()',
  },
  template: '',
})
export class IconComponent {
  /** Nombre del icono PrimeIcons, sin prefijo `pi-` (ej. `check`, `download`). */
  readonly name = input.required<string>();

  /** Texto accesible. Si se omite, el icono se considera decorativo. */
  readonly label = input<string | null>(null);

  /** Anima el icono girando (`pi-spin`); ideal para indicadores de carga. */
  readonly spin = input(false);

  /** Tamaño explícito (cualquier unidad CSS, ej. `1.5rem`). Por defecto hereda. */
  readonly size = input<string | null>(null);

  /** Clases del `<i>`: `pi` + el icono normalizado + (opcional) `pi-spin`. */
  protected readonly hostClass = computed(() => {
    const raw = this.name();
    const icono = raw.startsWith('pi-') ? raw : `pi-${raw}`;
    return `pi ${icono}${this.spin() ? ' pi-spin' : ''}`;
  });
}
