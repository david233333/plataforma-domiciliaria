import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

/** Severidades de toast soportadas (las de PrimeNG que usamos). */
type Severidad = 'success' | 'error' | 'warn' | 'info';

/**
 * Servicio de feedback transitorio (toasts) app-wide.
 *
 * Envuelve el `MessageService` de PrimeNG con una API semántica propia del
 * sistema de diseño —igual que los átomos envuelven sus componentes—, de modo
 * que el resto de la app pida `showError(...)` sin acoplarse a PrimeNG ni
 * repetir `severity`/`summary`/`life` en cada sitio. Si algún día se cambia la
 * librería de toasts, solo se toca este servicio.
 *
 * Es un singleton root (`providedIn: 'root'`) y se apoya en el ÚNICO `<p-toast>`
 * montado en el app-root. El `summary` tiene un valor por defecto por severidad,
 * pero cada llamada puede pasar uno más específico.
 *
 * ```ts
 * private readonly toaster = inject(ToasterService);
 * this.toaster.showSuccess('El informe se descargó correctamente.', 'Descarga completada');
 * this.toaster.showError('No tienes permisos para esta acción.');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ToasterService {
  private readonly mensajes = inject(MessageService);

  /** Duración por defecto del toast (ms); coherente con el resto de la app. */
  private static readonly VIDA_MS = 1000;

  showSuccess(detail: string, summary = 'Éxito'): void {
    this.mostrar('success', summary, detail);
  }

  showError(detail: string, summary = 'Error'): void {
    this.mostrar('error', summary, detail);
  }

  showWarning(detail: string, summary = 'Advertencia'): void {
    this.mostrar('warn', summary, detail);
  }

  showInfo(detail: string, summary = 'Información'): void {
    this.mostrar('info', summary, detail);
  }

  private mostrar(severity: Severidad, summary: string, detail: string): void {
    this.mensajes.add({
      severity,
      summary,
      detail,
      life: ToasterService.VIDA_MS,
    });
  }
}
