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
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

// Dominio (solo TIPOS y casos de uso — la presentación no conoce HTTP ni reglas)
import { Novedad } from '../../domain/novedades/entities/novedad.entity';
import { EstadoNovedad } from '../../domain/novedades/entities/estado-novedad';
import { FiltroNovedades } from '../../domain/novedades/entities/filtro-novedades';
import { BuscarNovedadesUseCase } from '../../domain/novedades/use-cases/buscar-novedades.use-case';
import { GestionarNovedadUseCase } from '../../domain/novedades/use-cases/gestionar-novedad.use-case';

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
    ButtonModule,
    TableModule,
    Tooltip,
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

  // --- Estado UI ---
  protected readonly filtrosAbiertos = signal(true);
  protected readonly buscando = signal(false);
  protected readonly novedades = signal<Novedad[]>([]);
  protected readonly hayResultados = computed(() => this.novedades().length > 0);

  /** Filas placeholder que alimentan la tabla mientras `buscando()` es true. */
  protected readonly skeletonRows = Array.from({ length: 5 });

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
    PENDIENTE_GESTION: { label: 'Pendiente', variant: 'warning', icon: 'pi-clock' },
    GESTIONADA: { label: 'Gestionada', variant: 'success', icon: 'pi-check' },
    EN_PROCESO: { label: 'En proceso', variant: 'info', icon: 'pi-spin pi-spinner' },
    RECHAZADA: { label: 'Rechazada', variant: 'error', icon: 'pi-times' },
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
  protected toggleFiltros(): void {
    this.filtrosAbiertos.update((v) => !v);
  }

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
