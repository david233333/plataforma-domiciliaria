import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificacionesBadgeComponent } from './notificaciones-badge.component';
import { NotificacionesFacade } from '../../application/notificaciones/notificaciones.facade';

/**
 * Panel de notificaciones. Lee `items()` del MISMO facade que el badge.
 *
 * Incluye el badge en pantalla a propósito: al cargar el panel, el contador del
 * badge refleja el mismo estado compartido (singleton root). Si el estado
 * viviera dentro de un componente, el otro no lo vería.
 */
@Component({
  selector: 'app-notificaciones-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, NotificacionesBadgeComponent],
  template: `
    <div class="container-fluid section animate-fade-in">
      <header class="flex items-center justify-between gap-4 mb-8">
        <div>
          <p class="text-overline">Operaciones</p>
          <h1 class="text-heading-xl">Notificaciones</h1>
        </div>
        <app-notificaciones-badge />
      </header>

      <section class="card">
        <p class="text-label-md mb-4">
          {{ facade.noLeidas() }} sin leer de {{ facade.items().length }}
        </p>
        <ul class="flex flex-col gap-3" aria-label="Lista de notificaciones">
          @for (n of facade.items(); track n.id) {
            <li
              class="flex items-start gap-3"
              style="padding: var(--app-space-3); border: 1px solid var(--app-surface-200); border-radius: var(--app-radius-md)"
            >
              <i
                class="pi"
                [class.pi-circle-fill]="!n.leida"
                [class.pi-circle]="n.leida"
                style="margin-top: 0.25rem; color: var(--app-primary-600)"
                aria-hidden="true"
              ></i>
              <div class="flex flex-col">
                <span class="text-label-md">{{ n.titulo }}</span>
                <span class="text-caption">{{ n.mensaje }}</span>
                <span class="text-caption">{{ n.fecha | date: 'dd/MM/yyyy hh:mm a' }}</span>
              </div>
            </li>
          } @empty {
            <li class="empty-state">
              <i class="pi pi-inbox empty-state__icon"></i>
              <p class="empty-state__title">No hay notificaciones</p>
            </li>
          }
        </ul>
      </section>
    </div>
  `,
})
export class NotificacionesPanelComponent implements OnInit {
  protected readonly facade = inject(NotificacionesFacade);

  ngOnInit(): void {
    this.facade.cargar();
  }
}
