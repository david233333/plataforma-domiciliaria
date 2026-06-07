import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { IconComponent } from '../../atoms/icon/icon.component';

/** Contador para generar ids únicos del panel (relación botón↔contenido a11y). */
let nextPanelId = 0;

/**
 * Organismo: tarjeta de filtros colapsable.
 *
 * Provee el **armazón** reutilizable de un panel de filtros: tarjeta + cabecera
 * con título e icono + botón que despliega/colapsa el contenido. Es **tonto**:
 * no sabe QUÉ filtros contiene. Cada pantalla proyecta los suyos (más o menos,
 * con los datos que sean) vía `<ng-content>`, junto con sus botones de acción
 * (normalmente un `app-form-actions`).
 *
 * El estado abierto/cerrado se expone como `model()` de dos vías: el organismo
 * lo gestiona solo por defecto, pero la página puede leerlo o persistirlo.
 *
 * ```html
 * <app-filter-card title="Filtros de novedades" [(expanded)]="filtrosAbiertos">
 *   <form [formGroup]="form">
 *     <div class="grid ...">  …app-form-field…  </div>
 *     <app-form-actions divider>  …app-button…  </app-form-actions>
 *   </form>
 * </app-filter-card>
 * ```
 */
@Component({
  selector: 'app-filter-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <section class="card !p-0 overflow-hidden">
      <button
        type="button"
        class="filter-card__toggle flex items-center justify-between w-full text-left"
        [attr.aria-expanded]="expanded()"
        [attr.aria-controls]="panelId"
        (click)="toggle()"
      >
        <span class="flex items-center gap-2">
          <app-icon [name]="icon()" />
          <span class="text-label-lg">{{ title() }}</span>
        </span>
        <app-icon
          name="chevron-down"
          [style.transform]="expanded() ? 'rotate(180deg)' : 'rotate(0deg)'"
        />
      </button>

      @if (expanded()) {
        <div [id]="panelId" class="filter-card__panel animate-fade-in">
          <ng-content />
        </div>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    /* Color tenue del icono de filtro (hereda currentColor del botón). */
    .filter-card__toggle {
      padding: var(--app-space-4) var(--app-space-6);
      background: transparent;
      border: 0;
      cursor: pointer;
      color: var(--app-text-secondary);
      transition: background var(--app-duration-fast) var(--app-ease-out);
    }
    .filter-card__toggle:hover {
      background: var(--app-surface-50);
    }
    /* La chevron es el app-icon hijo directo del botón (el de filtro va anidado). */
    .filter-card__toggle > app-icon {
      color: var(--app-text-muted);
      transition: transform var(--app-duration-normal) var(--app-ease-out);
    }
    .filter-card__panel {
      border-top: 1px solid var(--app-surface-200);
      padding: var(--app-space-6);
    }
  `,
})
export class FilterCardComponent {
  /** Título mostrado en la cabecera. */
  readonly title = input.required<string>();

  /** Icono PrimeIcons de la cabecera (sin prefijo `pi-`). */
  readonly icon = input('filter');

  /** Estado abierto/cerrado (dos vías). Por defecto abierto. */
  readonly expanded = model(true);

  /** Id único del panel para enlazar `aria-controls` ↔ contenido. */
  protected readonly panelId = `filter-card-panel-${nextPanelId++}`;

  /** Alterna el estado de despliegue. */
  protected toggle(): void {
    this.expanded.update((abierto) => !abierto);
  }
}
