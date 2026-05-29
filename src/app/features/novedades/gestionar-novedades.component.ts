import {
  ChangeDetectionStrategy,
  Component,
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

type EstadoNovedad =
  | 'PENDIENTE_GESTION'
  | 'GESTIONADA'
  | 'RECHAZADA'
  | 'EN_PROCESO';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

interface Novedad {
  readonly tipoNovedad: string;
  readonly especialidad: string;
  readonly nombrePaciente: string;
  readonly numeroIdentificacion: string;
  readonly piso: string;
  readonly usuarioReporta: string;
  readonly usuarioGestion: string | null;
  readonly fechaSolicitud: Date;
  readonly fechaGestion: Date | null;
  readonly estado: EstadoNovedad;
}

interface Opcion {
  readonly label: string;
  readonly value: string;
}

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

  // --- Estado UI ---
  protected readonly filtrosAbiertos = signal(true);
  protected readonly buscando = signal(false);

  /** Filas placeholder que alimentan la tabla mientras `buscando()` es true. */
  protected readonly skeletonRows = Array.from({ length: 5 });

  // --- Catálogos (mock; en producción vendrían del ViewModel/casos de uso) ---
  protected readonly ciudades: Opcion[] = [
    { label: 'Medellín', value: 'med' },
    { label: 'Bogotá', value: 'bog' },
    { label: 'Cali', value: 'cal' },
  ];
  protected readonly tiposIdentificacion: Opcion[] = [
    { label: 'Cédula de ciudadanía', value: 'cc' },
    { label: 'Tarjeta de identidad', value: 'ti' },
    { label: 'Pasaporte', value: 'pa' },
  ];
  protected readonly programas: Opcion[] = [
    { label: 'Hospitalización domiciliaria', value: 'hosp' },
    { label: 'Cuidado paliativo', value: 'pal' },
    { label: 'Rehabilitación', value: 'rehab' },
  ];
  protected readonly clasificaciones: Opcion[] = [
    { label: 'Permanente', value: 'perm' },
    { label: 'Temporal', value: 'temp' },
  ];
  protected readonly pisos: Opcion[] = [
    { label: 'Piso 1', value: 'p1' },
    { label: 'Piso 2', value: 'p2' },
    { label: 'Piso 3', value: 'p3' },
  ];
  protected readonly estados: Opcion[] = [
    { label: 'Pendiente gestión', value: 'PENDIENTE_GESTION' },
    { label: 'Gestionada', value: 'GESTIONADA' },
    { label: 'En proceso', value: 'EN_PROCESO' },
    { label: 'Rechazada', value: 'RECHAZADA' },
  ];
  protected readonly tiposNovedad: Opcion[] = [
    { label: 'Activación', value: 'ACTIVACION' },
    { label: 'Cambio de cita', value: 'CAMBIO_CITA' },
    { label: 'Cancelación', value: 'CANCELACION' },
  ];
  protected readonly especialidades: Opcion[] = [
    { label: 'Medicina general', value: 'medgen' },
    { label: 'Enfermería', value: 'enf' },
    { label: 'Fisioterapia', value: 'fisio' },
  ];

  // --- Datos de la tabla (mock) ---
  protected readonly novedades = signal<Novedad[]>([
    {
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'María Gónzalez Pérez',
      numeroIdentificacion: '1020304050',
      piso: 'Piso 2',
      usuarioReporta: 'jrios',
      usuarioGestion: null,
      fechaSolicitud: new Date('2026-05-20T09:15:00'),
      fechaGestion: null,
      estado: 'PENDIENTE_GESTION',
    },
    {
      tipoNovedad: 'Cancelación',
      especialidad: '',
      nombrePaciente: 'Carlos Restrepo Load',
      numeroIdentificacion: '7080900112',
      piso: 'Piso 1',
      usuarioReporta: 'amejia',
      usuarioGestion: 'lvargas',
      fechaSolicitud: new Date('2026-05-18T14:40:00'),
      fechaGestion: new Date('2026-05-19T08:05:00'),
      estado: 'GESTIONADA',
    },
    {
      tipoNovedad: 'Activación',
      especialidad: '',
      nombrePaciente: 'Ana Lucía Torres',
      numeroIdentificacion: '3344556677',
      piso: 'Piso 3',
      usuarioReporta: 'sistema',
      usuarioGestion: 'Automático',
      fechaSolicitud: new Date('2026-05-22T11:00:00'),
      fechaGestion: new Date('2026-05-22T11:00:00'),
      estado: 'EN_PROCESO',
    },
    {
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: new Date('2026-05-15T16:20:00'),
      fechaGestion: new Date('2026-05-16T09:30:00'),
      estado: 'RECHAZADA',
    },
        {
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: new Date('2026-05-15T16:20:00'),
      fechaGestion: new Date('2026-05-16T09:30:00'),
      estado: 'RECHAZADA',
    },
        {
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: new Date('2026-05-15T16:20:00'),
      fechaGestion: new Date('2026-05-16T09:30:00'),
      estado: 'RECHAZADA',
    },
        {
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: new Date('2026-05-15T16:20:00'),
      fechaGestion: new Date('2026-05-16T09:30:00'),
      estado: 'RECHAZADA',
    },
        {
      tipoNovedad: 'Cambio de cita',
      especialidad: 'Medicina general',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: new Date('2026-05-15T16:20:00'),
      fechaGestion: new Date('2026-05-16T09:30:00'),
      estado: 'RECHAZADA',
    },
        {
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: new Date('2026-05-15T16:20:00'),
      fechaGestion: new Date('2026-05-16T09:30:00'),
      estado: 'RECHAZADA',
    },
        {
      tipoNovedad: 'Cambio de cita',
      especialidad: '',
      nombrePaciente: 'Jorge Henao Mesa',
      numeroIdentificacion: '9988776655',
      piso: 'Piso 2',
      usuarioReporta: 'pcardona',
      usuarioGestion: 'pcardona',
      fechaSolicitud: new Date('2026-05-15T16:20:00'),
      fechaGestion: new Date('2026-05-16T09:30:00'),
      estado: 'RECHAZADA',
    },
  ]);

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

  // --- Helpers de presentación ---
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

  // --- Acciones (stubs de diseño) ---
  protected toggleFiltros(): void {
    this.filtrosAbiertos.update((v) => !v);
  }

  protected buscar(): void {
    this.buscando.set(true);
    setTimeout(() => this.buscando.set(false), 1200);
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

  protected gestionarNovedad(_novedad: Novedad): void {
    // Navegaría al detalle / abriría el panel de gestión.
  }
}
