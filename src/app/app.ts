import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Drawer } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { routeFadeAnimation } from './core/animations/animations';
import { NotificacionesBadgeComponent } from './presentation/notificaciones/notificaciones-badge.component';
import { UsuarioMenuComponent } from './presentation/usuario/usuario-menu.component';

interface NavItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
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
    NotificacionesBadgeComponent,
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

  /** Opciones de navegación del drawer. */
  protected readonly navItems: NavItem[] = [
    { label: 'Gestionar novedades', icon: 'pi pi-file-edit', route: '/novedades' },
    { label: 'Notificaciones', icon: 'pi pi-bell', route: '/notificaciones' },
    { label: 'Design System', icon: 'pi pi-palette', route: '/design-system' },
    { label: 'Arquitectura de estilos', icon: 'pi pi-book', route: '/arquitectura-estilos' },
  ];

  /** Único punto de apertura/cierre: el botón hamburguesa (y la X vía visibleChange). */
  protected toggleDrawer(): void {
    this.drawerVisible.update((v) => !v);
  }
}
