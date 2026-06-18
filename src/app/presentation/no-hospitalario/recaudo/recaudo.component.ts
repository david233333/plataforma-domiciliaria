import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Página de Recaudo (no hospitalario). Esqueleto inicial («coco») de la feature:
 * solo cabecera y un estado vacío de marcador. La lógica (slice de estado, DI,
 * tabla/listado) se irá cableando sobre esta base, igual que el resto de páginas.
 *
 * Independiente de Solicitudes: vive en su propia carpeta dentro de
 * `no-hospitalario` y tendrá su propio cableado de DI a nivel de ruta lazy.
 */
@Component({
  selector: 'app-recaudo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col gap-4 px-4 py-6 animate-fade-in">
      <header class="flex flex-col gap-1">
        <span class="text-overline text-primary-600">No hospitalario</span>
        <h1 class="text-display-sm text-text-primary m-0">Recaudo</h1>
        <p class="text-body-md text-text-secondary max-w-2xl m-0">
          Gestión de recaudos del ámbito no hospitalario.
        </p>
      </header>

      <div
        class="flex flex-col items-center justify-center gap-3 w-full
               rounded-xl border border-dashed border-border-subtle
               bg-surface-subtle px-6 py-16 text-center"
      >
        <i class="pi pi-wallet text-4xl text-text-tertiary" aria-hidden="true"></i>
        <p class="text-body-md text-text-secondary m-0">
          Aún no hay nada por aquí. Esta pantalla está en construcción.
        </p>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class RecaudoComponent {}
