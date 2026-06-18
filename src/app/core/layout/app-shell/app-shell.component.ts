import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Drawer } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

import { routeFadeAnimation } from '../../animations/animations';
import { environment } from '../../../../environments/environment';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

interface NavItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

interface NavSection {
  /** Clave estable para el estado de expansión y el track del @for. */
  readonly key: string;
  readonly label: string;
  readonly items: readonly NavItem[];
}

/**
 * Una entrada del menú, en orden de aparición. Puede ser:
 *   - `link`    → acceso directo de primer nivel (p. ej. Inicio, Informes), o
 *   - `section` → grupo colapsable con sus ítems (p. ej. Hospitalario).
 * Unificarlas en una sola lista permite intercalar enlaces sueltos ENTRE
 * secciones sin romper el orden.
 */
type NavEntry =
  | ({ readonly kind: 'link'; readonly emphasis?: boolean } & NavItem)
  | ({ readonly kind: 'section' } & NavSection);

/**
 * TEMPLATE (Atomic Design) · el «app shell».
 *
 * Es el esqueleto fijo de la aplicación: header superior, menú lateral (drawer)
 * y el `<router-outlet>` donde Angular inserta cada PÁGINA. No sabe qué pantalla
 * se muestra dentro; solo define DÓNDE va cada cosa.
 *
 * Vive en `core/layout` porque es un singleton app-wide (uno solo, como auth o
 * i18n), no una pieza tonta y repetible de `shared`.
 *
 * Las **acciones del header** (p. ej. el menú de usuario) se proyectan vía
 * `<ng-content>`: así el shell no importa de `presentation` (lo prohíbe la
 * frontera de Clean Architecture) y `app-root` es quien las inyecta.
 */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    Drawer,
    ButtonModule,
    BreadcrumbsComponent,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  /** Clase de entrada aplicada vía [animate.enter] al contenido enrutado. */
  protected readonly routeFade = routeFadeAnimation;

  /** Visibilidad del menú lateral. Abierto por defecto. */
  protected readonly drawerVisible = signal(true);

  /**
   * Entradas del drawer EN ORDEN. Inicio e Informes son accesos directos
   * (`link`); el resto, secciones colapsables. Informes abre un único
   * componente donde el usuario elige el ámbito (hospitalario / no hospitalario)
   * con el toggle; por eso es un enlace simple a `/informes`, no una sección.
   * El catálogo Design System solo se ofrece fuera de producción.
   */
  protected readonly navEntries: readonly NavEntry[] = [
    { kind: 'link', label: 'Inicio', icon: 'pi pi-home', route: '/inicio' },
    {
      kind: 'section',
      key: 'hospitalario',
      label: 'Hospitalario',
      items: [
        { label: 'Gestionar novedades', icon: 'pi pi-file-edit', route: '/novedades' },
      ],
    },
    {
      kind: 'section',
      key: 'no-hospitalario',
      label: 'No hospitalario',
      items: [
        { label: 'Solicitudes', icon: 'pi pi-inbox', route: '/no-hospitalario/solicitudes' },
        { label: 'Recaudo', icon: 'pi pi-wallet', route: '/no-hospitalario/recaudo' },
      ],
    },
    // Negrilla (emphasis) para que pese visualmente como los rótulos de sección.
    { kind: 'link', label: 'Informes', icon: 'pi pi-chart-bar', route: '/informes', emphasis: true },
    {
      kind: 'section',
      key: 'documentacion',
      label: 'Documentación',
      items: [
        ...(environment.production
          ? []
          : [{ label: 'Design System', icon: 'pi pi-palette', route: '/design-system' }]),
        { label: 'Arquitectura de estilos', icon: 'pi pi-book', route: '/arquitectura-estilos' },
        { label: 'Atomic Design', icon: 'pi pi-sitemap', route: '/atomic-design' },
        { label: 'Novedades de Angular', icon: 'pi pi-bolt', route: '/novedades-angular' },
        { label: 'SignalStore (estado)', icon: 'pi pi-database', route: '/signal-store' },
      ],
    },
  ];

  /** Secciones expandidas. Por defecto todas abiertas. */
  protected readonly expandedSections = signal<Record<string, boolean>>(
    Object.fromEntries(
      this.navEntries
        .filter((e): e is Extract<NavEntry, { kind: 'section' }> => e.kind === 'section')
        .map((s) => [s.key, true]),
    ),
  );

  /** Único punto de apertura/cierre: el botón hamburguesa (y la X vía visibleChange). */
  protected toggleDrawer(): void {
    this.drawerVisible.update((v) => !v);
  }

  /** Colapsa/expande una sección del menú. */
  protected toggleSection(key: string): void {
    this.expandedSections.update((state) => ({
      ...state,
      [key]: !state[key],
    }));
  }
}
