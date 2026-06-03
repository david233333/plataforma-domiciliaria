import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Drawer } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { routeFadeAnimation } from './core/animations/animations';
import { UsuarioMenuComponent } from './presentation/usuario/usuario-menu.component';
import { environment } from '../environments/environment';

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

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    Drawer,
    ButtonModule,
    UsuarioMenuComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
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
        { label: 'Informes', icon: 'pi pi-chart-bar', route: '/hospitalario/informes' },
      ],
    },
    {
      key: 'no-hospitalario',
      label: 'No hospitalario',
      items: [
        { label: 'Informes', icon: 'pi pi-chart-bar', route: '/no-hospitalario/informes' },
        { label: 'Solicitudes', icon: 'pi pi-inbox', route: '/no-hospitalario/solicitudes' },
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
