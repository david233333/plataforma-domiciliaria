import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Popover } from 'primeng/popover';
import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

/** Datos del usuario en sesión. Quemados por ahora — vendrán del AuthFacade. */
interface UsuarioSesion {
  readonly nombre: string;
  readonly rol: string;
  readonly correo: string;
  readonly ultimoIngreso: Date;
}

/**
 * Menú de usuario del header (extremo derecho). Muestra el usuario en sesión y,
 * al desplegarse, su rol, último inicio de sesión y la acción de cerrar sesión.
 * Construido con tokens del design system + componentes PrimeNG (Popover/Avatar).
 */
@Component({
  selector: 'app-usuario-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, Popover, Avatar, ButtonModule],
  template: `
    <button
      type="button"
      class="usuario-trigger"
      [attr.aria-expanded]="abierto()"
      aria-haspopup="dialog"
      aria-label="Abrir menú de usuario"
      (click)="op.toggle($event)"
    >
      <p-avatar
        [label]="iniciales()"
        shape="circle"
        styleClass="usuario-trigger__avatar"
      />
      <span class="usuario-trigger__info">
        <span class="text-label-md usuario-trigger__nombre">{{ usuario().nombre }}</span>
        <span class="text-caption usuario-trigger__rol">{{ usuario().rol }}</span>
      </span>
      <i class="pi pi-chevron-down usuario-trigger__chevron" aria-hidden="true"></i>
    </button>

    <p-popover
      #op
      styleClass="usuario-popover"
      (onShow)="abierto.set(true)"
      (onHide)="abierto.set(false)"
    >
      <div class="usuario-panel" role="dialog" aria-label="Información de usuario">
        <header class="usuario-panel__head">
          <p-avatar
            [label]="iniciales()"
            shape="circle"
            size="large"
            styleClass="usuario-panel__avatar"
          />
          <div class="usuario-panel__id">
            <span class="text-label-lg usuario-panel__nombre">{{ usuario().nombre }}</span>
            <span class="text-body-sm usuario-panel__correo">{{ usuario().correo }}</span>
            <span class="usuario-panel__rol-chip text-overline">{{ usuario().rol }}</span>
          </div>
        </header>

        <div class="usuario-panel__meta">
          <i class="pi pi-clock" aria-hidden="true"></i>
          <div>
            <span class="text-caption usuario-panel__meta-label">Último inicio de sesión</span>
            <span class="text-body-sm usuario-panel__meta-value">
              {{ usuario().ultimoIngreso | date: "d 'de' MMMM, y · h:mm a" }}
            </span>
          </div>
        </div>

        <p-button
          label="Cerrar sesión"
          icon="pi pi-sign-out"
          severity="danger"
          [text]="true"
          styleClass="usuario-panel__logout"
          (onClick)="cerrarSesion()"
        />
      </div>
    </p-popover>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    /* ---- Disparador en el header ---- */
    .usuario-trigger {
      display: inline-flex;
      align-items: center;
      gap: var(--app-space-2);
      padding: var(--app-space-1) var(--app-space-2);
      border: 1px solid transparent;
      border-radius: var(--app-radius-full, 9999px);
      background: transparent;
      cursor: pointer;
      transition:
        background var(--app-duration-fast) var(--app-ease-out),
        border-color var(--app-duration-fast) var(--app-ease-out);
    }
    .usuario-trigger:hover {
      background: var(--app-surface-50);
      border-color: var(--app-surface-200);
    }
    .usuario-trigger:focus-visible {
      outline: 2px solid var(--app-primary-600);
      outline-offset: 2px;
    }

    .usuario-trigger__info {
      display: none;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.15;
      text-align: left;
    }
    @media (min-width: 640px) {
      .usuario-trigger__info {
        display: flex;
      }
    }
    .usuario-trigger__nombre {
      color: var(--app-text-primary);
    }
    .usuario-trigger__rol {
      color: var(--app-text-muted);
    }
    .usuario-trigger__chevron {
      font-size: 0.7rem;
      color: var(--app-text-muted);
    }

    /* ---- Panel desplegado ---- */
    .usuario-panel {
      display: flex;
      flex-direction: column;
      gap: var(--app-space-4);
      width: 18rem;
      max-width: 90vw;
    }
    .usuario-panel__head {
      display: flex;
      gap: var(--app-space-3);
      align-items: center;
    }
    .usuario-panel__id {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
    }
    .usuario-panel__nombre {
      color: var(--app-text-primary);
    }
    .usuario-panel__correo {
      color: var(--app-text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .usuario-panel__rol-chip {
      align-self: flex-start;
      margin-top: 0.25rem;
      padding: 0.1rem var(--app-space-2);
      border-radius: var(--app-radius-full, 9999px);
      background: var(--app-primary-50);
      color: var(--app-primary-700);
    }

    .usuario-panel__meta {
      display: flex;
      gap: var(--app-space-3);
      align-items: flex-start;
      padding: var(--app-space-3);
      border-radius: var(--app-radius-md);
      background: var(--app-surface-50);
    }
    .usuario-panel__meta i {
      color: var(--app-primary-600);
      margin-top: 0.1rem;
    }
    .usuario-panel__meta div {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }
    .usuario-panel__meta-label {
      color: var(--app-text-muted);
    }
    .usuario-panel__meta-value {
      color: var(--app-text-primary);
    }

    :host ::ng-deep .usuario-panel__logout {
      width: 100%;
      justify-content: center;
    }
  `,
})
export class UsuarioMenuComponent {
  /** Estado del popover (para aria-expanded del disparador). */
  protected readonly abierto = signal(false);

  /** Usuario en sesión — datos quemados temporalmente. */
  protected readonly usuario = signal<UsuarioSesion>({
    nombre: 'Luz Elvira Vasquez Monsalve',
    rol: 'Coordinadora de Domicilio',
    correo: 'luz.vasquez@sura.com.co',
    ultimoIngreso: new Date('2026-06-02T08:14:00'),
  });

  /** Iniciales para el avatar (máx. 2). */
  protected readonly iniciales = computed(() =>
    this.usuario()
      .nombre.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join(''),
  );

  protected cerrarSesion(): void {
    // TODO: delegar al AuthFacade cuando exista. Por ahora solo placeholder.
    console.info('Cerrar sesión solicitado');
  }
}
