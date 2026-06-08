import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { merge } from 'rxjs';

// PrimeNG 21 — standalone
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

// Feedback app-wide (envuelve PrimeNG)
import { ToasterService } from '../../../core/feedback/toaster.service';

// Sistema de diseño (shared/ui)
import { PageHeaderComponent } from '../../../shared/ui/molecules/page-header/page-header.component';
import { FormFieldComponent } from '../../../shared/ui/molecules/form-field/form-field.component';
import { FormActionsComponent } from '../../../shared/ui/molecules/form-actions/form-actions.component';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button.component';
import { StatusBadgeComponent } from '../../../shared/ui/atoms/status-badge/status-badge.component';
import { FilterCardComponent } from '../../../shared/ui/organisms/filter-card/filter-card.component';
import { DataTableCardComponent } from '../../../shared/ui/organisms/data-table-card/data-table-card.component';
import { EmptyStateComponent } from '../../../shared/ui/molecules/empty-state/empty-state.component';

// Dominio (solo TIPOS y casos de uso): reutilizamos el catálogo maestro de
// tipos de identificación, igual que gestionar-novedades.
import { TipoIdentificacion } from '../../../domain/maestros/entities/tipo-identificacion.entity';
import { MaestrosUseCase } from '../../../domain/maestros/use-cases/maestros.use-case';

// Catálogos/labels/tipos de UI co-localizados (convención i18n)
import {
  EstadoSolicitud,
  Prioridad,
  Solicitud,
  SOLICITUDES_DEMO,
} from './solicitudes.labels';

/** Variante visual del badge. Cosmética de presentación, no dominio. */
type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

/**
 * Pantalla de SOLICITUDES (ámbito no hospitalario) — pantalla SMART.
 *
 * Homogénea con «Gestionar novedades»: reutiliza el mismo armazón del sistema de
 * diseño (page-header + filter-card + data-table-card) y las mismas piezas
 * (form-field, form-actions, button, status-badge). La diferencia es solo de
 * DATOS: estos filtros y esta tabla. No hay botón «Descargar informe».
 *
 * Convención de estilos:
 *   - Layout/espaciado → Tailwind (mapeado a tokens --app-*).
 *   - Patrones → .card, .field. Controles complejos → PrimeNG.
 *
 * NOTA: es pantalla de diseño. La búsqueda devuelve datos de ejemplo
 * (`SOLICITUDES_DEMO`); el catálogo de tipos de identificación sí es real (viene
 * del slice `maestros`).
 */
@Component({
  selector: 'app-solicitudes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    Select,
    DatePicker,
    InputText,
    TableModule,
    PageHeaderComponent,
    FormFieldComponent,
    FormActionsComponent,
    ButtonComponent,
    StatusBadgeComponent,
    FilterCardComponent,
    DataTableCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.scss',
})
export class SolicitudesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly maestros = inject(MaestrosUseCase);
  private readonly toaster = inject(ToasterService);

  // --- Estado UI ---
  protected readonly filtrosAbiertos = signal(true);
  protected readonly buscando = signal(false);
  protected readonly solicitudes = signal<Solicitud[]>([]);

  // --- Catálogos de UI (maestros del backend) ---
  protected readonly tiposIdentificacion = signal<TipoIdentificacion[]>([]);

  // --- Formulario de filtros (los tres son obligatorios, como en el diseño) ---
  protected readonly form = this.fb.group({
    tipoIdentificacion: this.fb.control<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    numeroIdentificacion: this.fb.control<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    // Rango de fechas (selectionMode="range" → arreglo de 1–2 fechas).
    fechaSolicitud: this.fb.control<Date[] | null>(null, Validators.required),
  });

  /**
   * Tick reactivo del estado del formulario (mismo patrón que Informes). Bajo
   * OnPush, los cambios de validación/touched no marcan la vista; fusionar los
   * eventos del grupo Y de cada control hijo garantiza el recálculo en cada
   * interacción (el grupo solo emite `touched` la primera vez).
   */
  private readonly filtrosEstado = toSignal(
    merge(
      this.form.events,
      ...Object.values(this.form.controls).map((control) => control.events),
    ),
  );

  /** True tras un intento de búsqueda: fuerza mostrar todos los errores. */
  protected readonly submitted = signal(false);

  // --- Señales de error por campo (visibles tras blur o intento de envío) ---
  protected readonly mostrarErrorTipoId = computed(() =>
    this.campoInvalido('tipoIdentificacion'),
  );
  protected readonly mostrarErrorNumeroId = computed(() =>
    this.campoInvalido('numeroIdentificacion'),
  );
  protected readonly mostrarErrorFecha = computed(() =>
    this.campoInvalido('fechaSolicitud'),
  );

  constructor() {
    // La tabla arranca vacía (el usuario debe buscar). Solo precargamos el
    // catálogo de tipos de identificación de los filtros.
    this.cargarTiposIdentificacion();
  }

  /** Consulta el maestro de tipos de identificación y lo vuelca en su signal. */
  private cargarTiposIdentificacion(): void {
    this.maestros.consultarTiposIdentificacion().subscribe({
      next: (tipos) => this.tiposIdentificacion.set(tipos),
      // Un fallo no rompe la pantalla: el errorInterceptor ya avisa con un
      // toast; el filtro simplemente queda sin opciones.
      error: () => this.tiposIdentificacion.set([]),
    });
  }

  // --- Helpers de presentación (cosmética del estado y la prioridad) ---
  private readonly estadoMeta: Record<
    EstadoSolicitud,
    { label: string; variant: BadgeVariant; icon: string }
  > = {
    PENDIENTE: { label: 'Pendiente', variant: 'warning', icon: 'clock' },
    EN_PROCESO: { label: 'En proceso', variant: 'info', icon: 'spinner' },
    FINALIZADA: { label: 'Finalizada', variant: 'success', icon: 'check' },
    CANCELADA: { label: 'Cancelada', variant: 'error', icon: 'times' },
  };

  private readonly prioridadMeta: Record<
    Prioridad,
    { label: string; variant: BadgeVariant; icon: string }
  > = {
    ALTA: { label: 'Alta', variant: 'error', icon: 'arrow-up' },
    MEDIA: { label: 'Media', variant: 'warning', icon: 'minus' },
    BAJA: { label: 'Baja', variant: 'info', icon: 'arrow-down' },
  };

  protected estadoVariant(estado: EstadoSolicitud): BadgeVariant {
    return this.estadoMeta[estado].variant;
  }
  protected estadoLabel(estado: EstadoSolicitud): string {
    return this.estadoMeta[estado].label;
  }
  protected estadoIcon(estado: EstadoSolicitud): string {
    return this.estadoMeta[estado].icon;
  }

  protected prioridadVariant(prioridad: Prioridad): BadgeVariant {
    return this.prioridadMeta[prioridad].variant;
  }
  protected prioridadLabel(prioridad: Prioridad): string {
    return this.prioridadMeta[prioridad].label;
  }
  protected prioridadIcon(prioridad: Prioridad): string {
    return this.prioridadMeta[prioridad].icon;
  }

  // --- Acciones ---
  protected buscar(): void {
    // Validamos al enviar para poder explicar qué falta (en vez de un submit
    // inerte). Si algo falta, lo señalamos y enfocamos el primer error.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitted.set(true);
      this.enfocarPrimerError();
      return;
    }
    this.submitted.set(false);
    this.ejecutarBusqueda();
  }

  protected limpiar(): void {
    this.form.reset({
      tipoIdentificacion: '',
      numeroIdentificacion: '',
      fechaSolicitud: null,
    });
    this.submitted.set(false);
    this.solicitudes.set([]);
  }

  protected crearSolicitud(): void {
    // Abriría el flujo de creación de una solicitud.
  }

  protected verSolicitud(solicitud: Solicitud): void {
    // Abriría el detalle de la solicitud.
    this.toaster.showInfo(
      `Detalle de la solicitud «${solicitud.idSolicitud}».`,
      'Próximamente',
    );
  }

  /**
   * Marca un control como `touched` de inmediato al perder el foco. Los
   * controles con overlay (Select/DatePicker) posponen su marcado interno hasta
   * cerrar el panel; su output `(onBlur)` se emite al instante, así el mensaje de
   * requerido aparece sin delay.
   */
  protected marcarTocado(nombre: string): void {
    this.form.get(nombre)?.markAsTouched();
  }

  /** ¿Debe mostrarse el error de un campo? Inválido y ya interactuado. */
  private campoInvalido(nombre: string): boolean {
    this.filtrosEstado(); // dependencia para recomputar bajo OnPush
    const control = this.form.get(nombre);
    return (
      !!control && control.invalid && (control.touched || this.submitted())
    );
  }

  /** Lleva el foco al primer campo inválido del formulario (orden visual). */
  private enfocarPrimerError(): void {
    const orden = [
      'tipoIdentificacion',
      'numeroIdentificacion',
      'fechaSolicitud',
    ];
    const primero =
      orden.find((nombre) => this.form.get(nombre)?.invalid) ??
      'tipoIdentificacion';
    document.getElementById(primero)?.focus();
  }

  /** Ejecuta la búsqueda (mock) y refleja el resultado en el signal. */
  private ejecutarBusqueda(): void {
    this.buscando.set(true);
    // Simulación de latencia para que se vea el estado de carga del armazón.
    setTimeout(() => {
      this.solicitudes.set(SOLICITUDES_DEMO);
      this.buscando.set(false);
    }, 400);
  }
}
