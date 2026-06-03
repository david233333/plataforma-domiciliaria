import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificacionesFacade } from '../../application/notificaciones/notificaciones.facade';

/**
 * Badge de notificaciones (pensado para el header). Lee `noLeidas()` del FACADE
 * compartido. Demuestra, junto al panel, por qué el estado vive fuera de un
 * componente: ambos leen el mismo singleton.
 */
@Component({
  selector: 'app-notificaciones-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a
      routerLink="/notificaciones"
      class="notif-badge"
      [attr.aria-label]="
        'Notificaciones, ' + facade.noLeidas() + ' sin leer'
      "
    >
      <i class="pi pi-bell" aria-hidden="true"></i>
      @if (facade.noLeidas() > 0) {
        <span class="notif-badge__count" aria-hidden="true">{{ facade.noLeidas() }}</span>
      }
    </a>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
    .notif-badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--app-radius-full, 9999px);
      color: var(--app-text-secondary, #475569);
    }
    .notif-badge:hover {
      background: var(--app-surface-50, #f8fafc);
    }
    .notif-badge__count {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      min-width: 1.1rem;
      height: 1.1rem;
      padding: 0 0.25rem;
      border-radius: var(--app-radius-full, 9999px);
      background: var(--app-primary-600, #2563eb);
      color: #fff;
      font-size: 0.7rem;
      line-height: 1.1rem;
      text-align: center;
    }
  `,
})
export class NotificacionesBadgeComponent implements OnInit {
  protected readonly facade = inject(NotificacionesFacade);

  ngOnInit(): void {
    this.facade.cargar();
  }
}
