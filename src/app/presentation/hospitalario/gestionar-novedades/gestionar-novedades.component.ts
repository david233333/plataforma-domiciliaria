import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

// PrimeNG 21 — standalone
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';

// Sistema de diseño (shared/ui)
import { PageHeaderComponent } from '../../../shared/ui/molecules/page-header/page-header.component';
import { FormFieldComponent } from '../../../shared/ui/molecules/form-field/form-field.component';
import { FormActionsComponent } from '../../../shared/ui/molecules/form-actions/form-actions.component';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button.component';
import { StatusBadgeComponent } from '../../../shared/ui/atoms/status-badge/status-badge.component';
import { FilterCardComponent } from '../../../shared/ui/organisms/filter-card/filter-card.component';
import { DataTableCardComponent } from '../../../shared/ui/organisms/data-table-card/data-table-card.component';

// Dominio (solo TIPOS y casos de uso — la presentación no conoce HTTP ni reglas)
import { Novedad } from '../../../domain/novedades/entities/novedad.entity';
import { EstadoNovedad } from '../../../domain/novedades/entities/estado-novedad';
import { FiltroNovedades } from '../../../domain/novedades/entities/filtro-novedades';
import { BuscarNovedadesUseCase } from '../../../domain/novedades/use-cases/buscar-novedades.use-case';
import { GestionarNovedadUseCase } from '../../../domain/novedades/use-cases/gestionar-novedad.use-case';

// Catálogos/labels de UI co-localizados (convención i18n)
import {
  CIUDADES,
  CLASIFICACIONES,
  ESPECIALIDADES,
  ESTADOS,
  Opcion,
  PISOS,
  PROGRAMAS,
  TIPOS_IDENTIFICACION,
  TIPOS_NOVEDAD,
} from './novedades.labels';

/** Variante visual del badge de estado. Cosmética de presentación, no dominio. */
type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-gestionar-novedades',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    Select,
    MultiSelect,
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
  ],
  templateUrl: './gestionar-novedades.component.html',
  styleUrl: './gestionar-novedades.component.scss',
})
export class GestionarNovedadesComponent {
  private readonly fb = inject(FormBuilder);
  // Casos de uso inyectados DIRECTAMENTE (sin facade): el estado es local a esta
  // pantalla, así que vive en signals del componente.
  private readonly buscarNovedades = inject(BuscarNovedadesUseCase);
  private readonly gestionarNovedadUseCase = inject(GestionarNovedadUseCase);
  // Feedback app-wide: singletons root (ver app.config). El host de ambos vive
  // en el app-root, así que aquí solo se disparan confirmación y toast.
  private readonly confirmaciones = inject(ConfirmationService);
  private readonly mensajes = inject(MessageService);

  // --- Estado UI ---
  protected readonly filtrosAbiertos = signal(true);
  protected readonly buscando = signal(false);
  protected readonly novedades = signal<Novedad[]>([]);
  protected readonly hayResultados = computed(() => this.novedades().length > 0);

  // --- Catálogos de UI ---
  protected readonly ciudades: Opcion[] =CIUDADES;
  protected readonly tiposIdentificacion: Opcion[] =TIPOS_IDENTIFICACION;
  protected readonly programas: Opcion[] =PROGRAMAS;
  protected readonly clasificaciones: Opcion[] =CLASIFICACIONES;
  protected readonly pisos: Opcion[] =PISOS;
  protected readonly estados: Opcion[] =ESTADOS;
  protected readonly tiposNovedad: Opcion[] =TIPOS_NOVEDAD;
  protected readonly especialidades: Opcion[] =ESPECIALIDADES;

  protected readonly form = this.fb.group({
    ciudad: [''],
    tipoDocumento: [''],
    numeroDocumento: [''],
    remision: [''],
    programa: [''],
    clasificacion: [''],
    piso: [[] as string[]],
    estado: [''],
    tiposNovedad: [''],
    especialidadCita: [''],
    fechaInicioNovedad: [null as Date | null],
    fechaFinNovedad: [null as Date | null],
  });

  constructor() {
    // Carga inicial: poblar la tabla al entrar (mismo comportamiento que antes,
    // cuando los datos venían precargados en el signal).
    this.ejecutarBusqueda();
  }

  // --- Helpers de presentación (cosmética del estado) ---
  private readonly estadoMeta: Record<
    EstadoNovedad,
    { label: string; variant: BadgeVariant; icon: string }
  > = {
    PENDIENTE_GESTION: { label: 'Pendiente', variant: 'warning', icon: 'clock' },
    GESTIONADA: { label: 'Gestionada', variant: 'success', icon: 'check' },
    EN_PROCESO: { label: 'En proceso', variant: 'info', icon: 'spinner' },
    RECHAZADA: { label: 'Rechazada', variant: 'error', icon: 'times' },
  };

  protected estadoVariant(estado: EstadoNovedad): BadgeVariant {
    return this.estadoMeta[estado].variant;
  }
  protected estadoLabel(estado: EstadoNovedad): string {
    return this.estadoMeta[estado].label;
  }
  protected estadoIcon(estado: EstadoNovedad): string {
    return this.estadoMeta[estado].icon;
  }

  // --- Acciones ---
  protected buscar(): void {
    this.ejecutarBusqueda();
  }

  protected limpiar(): void {
    this.form.reset({ piso: [] });
  }

  protected guardarFiltros(): void {
    // Persistiría los filtros del usuario.
  }

  protected descargarInforme(): void {
    // Dispararía la generación del reporte.
  }

  protected gestionarNovedad(novedad: Novedad): void {
    // El caso de uso valida la regla de negocio (solo gestionables) y, de ser
    // válido, delega en el repositorio. Tras gestionar, refrescamos la lista.
    this.gestionarNovedadUseCase.execute(novedad).subscribe({
      next: () => this.ejecutarBusqueda(),
      error: () => {
        // Una novedad no gestionable no debe romper la pantalla. En una
        // iteración futura aquí se mostraría un toast con el mensaje de dominio.
      },
    });
  }

  /**
   * Paso previo a sincronizar: pide confirmación explícita porque la acción
   * cambia el estado de la novedad. Solo si el usuario acepta se ejecuta la
   * sincronización. El diálogo y el toast usan los hosts globales del app-root.
   */
  protected confirmarSincronizacion(novedad: Novedad): void {
    this.confirmaciones.confirm({
      header: 'Sincronizar novedad',
      message: `¿Deseas sincronizar la novedad de «${novedad.nombrePaciente}»? Esta acción actualizará su estado.`,
      icon: 'pi pi-sync',
      acceptButtonProps: { label: 'Sí, sincronizar', icon: 'pi pi-check' },
      rejectButtonProps: {
        label: 'Cancelar',
        icon: 'pi pi-times',
        severity: 'secondary',
        outlined: true,
      },
      accept: () => this.sincronizarNovedad(novedad),
    });
  }

  /** Ejecuta la sincronización y avisa el resultado con un toast. */
  private sincronizarNovedad(novedad: Novedad): void {
    this.gestionarNovedadUseCase.execute(novedad).subscribe({
      next: () => {
        this.ejecutarBusqueda();
        this.mensajes.add({
          severity: 'success',
          summary: 'Sincronización completada',
          detail: `La novedad de «${novedad.nombrePaciente}» se sincronizó correctamente.`,
          life: 5000,
        });
      },
      error: () =>
        this.mensajes.add({
          severity: 'error',
          summary: 'No se pudo sincronizar',
          detail: 'Ocurrió un problema al sincronizar la novedad. Inténtalo de nuevo.',
          life: 5000,
        }),
    });
  }

  /** Lanza la búsqueda contra el caso de uso y refleja el resultado en signals. */
  private ejecutarBusqueda(): void {
    this.buscando.set(true);
    this.buscarNovedades.execute(this.aFiltro()).subscribe({
      next: (resultado) => this.novedades.set(resultado),
      error: () => this.buscando.set(false),
      complete: () => this.buscando.set(false),
    });
  }

  /** Mapea el valor crudo del FormGroup al modelo de dominio `FiltroNovedades`. */
  private aFiltro(): FiltroNovedades {
    const v = this.form.getRawValue();
    return {
      ciudad: v.ciudad ?? undefined,
      tipoDocumento: v.tipoDocumento ?? undefined,
      numeroDocumento: v.numeroDocumento ?? undefined,
      remision: v.remision ?? undefined,
      programa: v.programa ?? undefined,
      clasificacion: v.clasificacion ?? undefined,
      piso: v.piso ?? [],
      estado: v.estado ?? undefined,
      tiposNovedad: v.tiposNovedad ?? undefined,
      especialidadCita: v.especialidadCita ?? undefined,
      fechaInicioNovedad: v.fechaInicioNovedad,
      fechaFinNovedad: v.fechaFinNovedad,
    };
  }
}
