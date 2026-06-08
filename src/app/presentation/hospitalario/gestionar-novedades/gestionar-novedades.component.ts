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
import { ConfirmationService } from 'primeng/api';

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

// Dominio (solo TIPOS y casos de uso — la presentación no conoce HTTP ni reglas)
import { Novedad } from '../../../domain/novedades/entities/novedad.entity';
import { EstadoNovedad } from '../../../domain/novedades/entities/estado-novedad';
import { FiltroNovedades } from '../../../domain/novedades/entities/filtro-novedades';
import { BuscarNovedadesUseCase } from '../../../domain/novedades/use-cases/buscar-novedades.use-case';
import { GestionarNovedadUseCase } from '../../../domain/novedades/use-cases/gestionar-novedad.use-case';
import { Ciudad } from '../../../domain/maestros/entities/ciudad.entity';
import { TipoIdentificacion } from '../../../domain/maestros/entities/tipo-identificacion.entity';
import { Programa } from '../../../domain/maestros/entities/programa.entity';
import { ClasificacionPermanentes } from '../../../domain/maestros/entities/clasificacion-permanentes.entity';
import { TipoNovedad } from '../../../domain/maestros/entities/tipo-novedad.entity';
import { MaestrosUseCase } from '../../../domain/maestros/use-cases/maestros.use-case';

// Catálogos/labels de UI co-localizados (convención i18n)
import {
  ESPECIALIDADES,
  ESTADOS,
  Opcion,
  PISOS,
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
  private readonly maestros = inject(MaestrosUseCase);
  // Feedback app-wide: la confirmación usa el ConfirmationService (singleton
  // root) y el aviso usa el ToasterService del sistema de diseño. Sus hosts
  // (<p-confirmdialog> y <p-toast>) viven en el app-root.
  private readonly confirmaciones = inject(ConfirmationService);
  private readonly toaster = inject(ToasterService);

  // --- Estado UI ---
  protected readonly filtrosAbiertos = signal(true);
  protected readonly buscando = signal(false);
  protected readonly novedades = signal<Novedad[]>([]);
  protected readonly hayResultados = computed(() => this.novedades().length > 0);

  // --- Catálogos de UI ---
  // Estos catálogos vienen del backend (maestros): empiezan vacíos y se llenan
  // al cargar la pantalla.
  protected readonly ciudades = signal<Ciudad[]>([]);
  protected readonly tiposIdentificacion = signal<TipoIdentificacion[]>([]);
  protected readonly programas = signal<Programa[]>([]);
  protected readonly clasificaciones = signal<ClasificacionPermanentes[]>([]);
  protected readonly tiposNovedad = signal<TipoNovedad[]>([]);
  // Estos siguen siendo estáticos (aún no hay maestro en el backend).
  protected readonly pisos: Opcion[] = PISOS;
  protected readonly estados: Opcion[] = ESTADOS;
  protected readonly especialidades: Opcion[] = ESPECIALIDADES;

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
    // Carga inicial: poblar la tabla y los catálogos (maestros) al entrar.
    this.ejecutarBusqueda();
    this.cargarCiudades();
    this.cargarTiposIdentificacion();
    this.cargarProgramas();
    this.cargarClasificaciones();
    this.cargarTiposNovedad();
  }

  /** Consulta el maestro de ciudades y lo vuelca en el signal del filtro. */
  private cargarCiudades(): void {
    this.maestros.consultarCiudades().subscribe({
      next: (ciudades) => this.ciudades.set(ciudades),
      // Un fallo no debe romper la pantalla: el errorInterceptor ya avisa con un
      // toast; aquí el filtro simplemente queda sin opciones.
      error: () => this.ciudades.set([]),
    });
  }

  /** Consulta el maestro de tipos de identificación y lo vuelca en su signal. */
  private cargarTiposIdentificacion(): void {
    this.maestros.consultarTiposIdentificacion().subscribe({
      next: (tipos) => this.tiposIdentificacion.set(tipos),
      error: () => this.tiposIdentificacion.set([]),
    });
  }

  /** Consulta el maestro de programas y lo vuelca en su signal. */
  private cargarProgramas(): void {
    this.maestros.consultarProgramas().subscribe({
      next: (programas) => this.programas.set(programas),
      error: () => this.programas.set([]),
    });
  }

  /** Consulta el maestro de clasificaciones (permanentes) y lo vuelca en su signal. */
  private cargarClasificaciones(): void {
    this.maestros.consultarClasificacionesPermanentes().subscribe({
      next: (clasificaciones) => this.clasificaciones.set(clasificaciones),
      error: () => this.clasificaciones.set([]),
    });
  }

  /** Consulta el maestro de tipos de novedad y lo vuelca en su signal. */
  private cargarTiposNovedad(): void {
    this.maestros.consultarTiposNovedad().subscribe({
      next: (tipos) => this.tiposNovedad.set(tipos),
      error: () => this.tiposNovedad.set([]),
    });
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

  protected crearNovedad(): void {
    // Abriría el flujo de creación de una novedad.
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
        this.toaster.showSuccess(
          `La novedad de «${novedad.nombrePaciente}» se sincronizó correctamente.`,
          'Sincronización completada',
        );
      },
      error: () =>
        this.toaster.showError(
          'Ocurrió un problema al sincronizar la novedad. Inténtalo de nuevo.',
          'No se pudo sincronizar',
        ),
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
