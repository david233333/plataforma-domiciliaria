import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SkeletonComponent } from '../../atoms/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../molecules/empty-state/empty-state.component';

/**
 * Organismo: tarjeta de resultados con máquina de estados.
 *
 * Provee el **armazón** de una zona de resultados y resuelve los tres estados
 * típicos para que la página no los repita:
 *  - **Cargando** (`loading`) → skeleton genérico (filas × columnas).
 *  - **Vacío** (`empty`)       → `app-empty-state`.
 *  - **Con datos**             → proyecta el contenido (`<ng-content>`).
 *
 * Es **tonto**: no conoce las columnas ni los datos. La página le pasa los flags
 * `loading`/`empty` (que calcula desde sus signals) y proyecta SU propia tabla
 * (`p-table` con sus columnas, celdas y acciones). Así cada pantalla varía la
 * tabla sin reimplementar los estados.
 *
 * ```html
 * <app-data-table-card
 *   [loading]="buscando()"
 *   [empty]="!hayResultados()"
 *   emptyTitle="No se encontraron novedades"
 *   [skeletonColumns]="7">
 *   <p-table [value]="novedades()"> … </p-table>
 * </app-data-table-card>
 * ```
 */
@Component({
  selector: 'app-data-table-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonComponent, EmptyStateComponent],
  template: `
    <section class="card !p-0 overflow-hidden">
      <!-- Caption opcional (acciones de la tabla, p. ej. «Crear»). Siempre
           visible: vive FUERA del switch de carga/vacío para que la acción no
           dependa de que haya datos. Si nada se proyecta, no renderiza nada. -->
      <ng-content select="[card-caption]" />

      @if (loading()) {
        <div class="data-table-card__skeleton">
          <div class="data-table-card__row data-table-card__row--head">
            @for (col of columnas(); track $index) {
              <app-skeleton variant="text" />
            }
          </div>
          @for (fila of filas(); track $index) {
            <div class="data-table-card__row">
              @for (col of columnas(); track $index) {
                <app-skeleton variant="text" />
              }
            </div>
          }
        </div>
      } @else if (empty()) {
        <app-empty-state
          [icon]="emptyIcon()"
          [title]="emptyTitle()"
          [body]="emptyBody()"
        />
      } @else {
        <ng-content />
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .data-table-card__row {
      display: flex;
      align-items: center;
      gap: var(--app-space-6);
      padding: var(--app-space-4) var(--app-space-6);
      border-bottom: 1px solid var(--app-surface-100);
    }
    .data-table-card__row--head {
      border-bottom-color: var(--app-surface-200);
    }
    .data-table-card__row app-skeleton {
      flex: 1;
    }
  `,
})
export class DataTableCardComponent {
  /** Muestra el skeleton de carga. */
  readonly loading = input(false);

  /** Muestra el estado vacío (cuando no carga y no hay datos). */
  readonly empty = input(false);

  /** Icono del estado vacío (sin prefijo `pi-`). */
  readonly emptyIcon = input('inbox');

  /** Título del estado vacío. */
  readonly emptyTitle = input('No se encontraron resultados');

  /** Texto de apoyo del estado vacío. Opcional. */
  readonly emptyBody = input<string | null>(null);

  /** Nº de filas del skeleton. */
  readonly skeletonRows = input(5);

  /** Nº de columnas del skeleton. */
  readonly skeletonColumns = input(6);

  /** Arreglos auxiliares para iterar el skeleton en la plantilla. */
  protected readonly filas = computed(() => Array.from({ length: this.skeletonRows() }));
  protected readonly columnas = computed(() =>
    Array.from({ length: this.skeletonColumns() }),
  );
}
