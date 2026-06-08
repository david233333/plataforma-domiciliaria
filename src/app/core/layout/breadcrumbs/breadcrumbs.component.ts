import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

import { BreadcrumbData, Crumb } from './breadcrumb.model';

/**
 * Breadcrumb app-wide, derivado de las RUTAS. Vive en `core/layout` (es chrome
 * del shell, no una pieza de `presentation`): recorre el árbol de rutas activas
 * y concatena lo que cada nivel declare en `data.breadcrumb`. Así ninguna página
 * tiene que pintar su propio breadcrumb — basta con declarar la migaja en su ruta.
 *
 * - El primer eslabón siempre es la casa (→ `/inicio`).
 * - La página actual (último eslabón) nunca enlaza.
 * - En `/inicio` no hay migas, así que el componente no renderiza nada.
 */
@Component({
  selector: 'app-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumb],
  template: `
    @if (items().length) {
      <div class="breadcrumbs-band">
        <p-breadcrumb [model]="items()" [home]="home" homeAriaLabel="Ir a inicio" />
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    // Banda fina bajo el header. El breadcrumb de PrimeNG se integra sin su
    // fondo/borde propios para que la banda sea la que define el contenedor.
    .breadcrumbs-band {
      padding: var(--app-space-3) var(--app-space-5);
      border-bottom: 1px solid var(--app-surface-200);
      background: var(--app-surface-0);
    }

    :host ::ng-deep .p-breadcrumb {
      padding: 0;
      border: 0;
      background: transparent;
    }
  `,
})
export class BreadcrumbsComponent {
  private readonly router = inject(Router);

  /** Eslabón raíz: la casa, siempre enlaza a Inicio. */
  protected readonly home: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/inicio',
  };

  /**
   * Dispara el recálculo en cada navegación. Usamos `urlAfterRedirects` para
   * que `/informes` (que redirige a `/informes/hospitalario`) recalcule con la
   * ruta final ya resuelta.
   */
  private readonly urlActual = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Modelo para `p-breadcrumb`, recalculado en cada navegación. */
  protected readonly items = computed<MenuItem[]>(() => {
    this.urlActual(); // dependencia reactiva (su valor no se usa directamente)
    return this.aMenuItems(this.recolectarMigas());
  });

  /** Recorre el árbol de rutas activas concatenando cada `data.breadcrumb`. */
  private recolectarMigas(): Crumb[] {
    let route = this.router.routerState.snapshot.root.firstChild;
    const migas: Crumb[] = [];
    while (route) {
      const def = route.data['breadcrumb'] as BreadcrumbData | undefined;
      if (def) {
        migas.push(...(typeof def === 'function' ? def(route) : def));
      }
      route = route.firstChild;
    }
    return migas;
  }

  /** Convierte las migas a `MenuItem[]`; el último (actual) no enlaza. */
  private aMenuItems(migas: Crumb[]): MenuItem[] {
    const ultimo = migas.length - 1;
    return migas.map((miga, i) => ({
      label: miga.label,
      // Solo enlazan los eslabones intermedios que declaren `link`.
      routerLink: i !== ultimo && miga.link ? miga.link : undefined,
    }));
  }
}
