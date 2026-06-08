import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Drawer } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

import { routeFadeAnimation } from '../../animations/animations';
import { environment } from '../../../../environments/environment';

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
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  /** Clase de entrada aplicada vía [animate.enter] al contenido enrutado. */
  protected readonly routeFade = routeFadeAnimation;

  /** Visibilidad del menú lateral. Abierto por defecto. */
  protected readonly drawerVisible = signal(true);

  /** Acceso directo de primer nivel, fuera de las secciones colapsables. */
  protected readonly inicioItem: NavItem = {
    label: 'Inicio',
    icon: 'pi pi-home',
    route: '/inicio',
  };

  /**
   * Secciones de navegación del drawer (estilo colapsable). El catálogo Design
   * System solo se ofrece fuera de producción, igual que su ruta.
   */
  protected readonly navSections: readonly NavSection[] = [
    {
      key: 'hospitalario',
      label: 'Hospitalario',
      items: [
        { label: 'Gestionar novedades', icon: 'pi pi-file-edit', route: '/novedades' },
      ],
    },
    {
      key: 'no-hospitalario',
      label: 'No hospitalario',
      items: [
        { label: 'Solicitudes', icon: 'pi pi-inbox', route: '/no-hospitalario/solicitudes' },
      ],
    },
    {
      key: 'informes',
      label: 'Informes',
      items: [
        { label: 'Hospitalarios', icon: 'pi pi-chart-bar', route: '/informes/hospitalario' },
        { label: 'No hospitalarios', icon: 'pi pi-chart-bar', route: '/informes/no-hospitalario' },
      ],
    },
    {
      key: 'documentacion',
      label: 'Documentación',
      items: [
        ...(environment.production
          ? []
          : [{ label: 'Design System', icon: 'pi pi-palette', route: '/design-system' }]),
        { label: 'Arquitectura de estilos', icon: 'pi pi-book', route: '/arquitectura-estilos' },
      ],
    },
  ];

  /** Secciones expandidas. Por defecto todas abiertas. */
  protected readonly expandedSections = signal<Record<string, boolean>>(
    Object.fromEntries(this.navSections.map((s) => [s.key, true])),
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
