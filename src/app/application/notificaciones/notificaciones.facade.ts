import { computed, inject, Injectable, signal } from '@angular/core';
import { ConsultarNotificacionesUseCase } from '../../domain/notificaciones/use-cases/consultar-notificaciones.use-case';
import { Notificacion } from '../../domain/notificaciones/entities/notificacion.entity';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ÚNICO FACADE DEL PROYECTO (ejemplo a evaluar — sección 5-bis del plan).
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ¿Por qué aquí SÍ un facade y en `novedades` NO?
 *   El estado de notificaciones es COMPARTIDO entre varios componentes: el badge
 *   del header consume `noLeidas()` y el panel consume `items()`. Si el estado
 *   viviera dentro de un componente, el otro no lo vería. Por eso vive fuera, en
 *   un singleton `providedIn: 'root'`, y sobrevive a la navegación.
 *
 *   `novedades` deliberadamente NO usa facade: su estado es local a la pantalla,
 *   así que el componente inyecta los casos de uso directo. Ambos enfoques
 *   quedan lado a lado para que el equipo decida si generaliza el facade.
 *
 * Es el ÚNICO facade del proyecto: nada más debe crear uno por feature.
 */
@Injectable({ providedIn: 'root' })
export class NotificacionesFacade {
  private readonly consultar = inject(ConsultarNotificacionesUseCase);

  private readonly _items = signal<Notificacion[]>([]);
  /** Lista completa (solo lectura). La consume el panel. */
  readonly items = this._items.asReadonly();
  /** Derivado: número de no leídas. Lo consume el badge. */
  readonly noLeidas = computed(() => this._items().filter((n) => !n.leida).length);

  cargar(): void {
    this.consultar.execute().subscribe((items) => this._items.set(items));
  }
}
