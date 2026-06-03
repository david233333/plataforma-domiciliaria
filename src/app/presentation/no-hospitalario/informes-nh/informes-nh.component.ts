import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

// PrimeNG 21 — standalone
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';

import { routeFadeAnimation } from '../../../core/animations/animations';

/** Informe disponible en el catálogo (mock — esta pantalla es solo de diseño). */
interface OpcionInforme {
  readonly codigo: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly icon: string;
  /** Nombre base del archivo descargado (sin extensión). */
  readonly archivo: string;
}

/** Opción genérica de un selector (label visible / value interno). */
interface Opcion {
  readonly label: string;
  readonly value: string;
}

/** Tope de días permitido entre fecha de inicio y fin. */
const RANGO_MAXIMO_DIAS = 10;
const MS_POR_DIA = 1000 * 60 * 60 * 24;

/** Parámetros de la descarga simulada (solo diseño). */
const DESCARGA_DURACION_MS = 4500;
const DESCARGA_TICK_MS = 120;

/**
 * Valida el rango de fechas del formulario:
 *   - `fechaInvalida` → la fecha de fin es anterior a la de inicio.
 *   - `rangoInvalido` → el rango supera el máximo permitido.
 * Función pura a nivel de módulo (no depende de la instancia).
 */
function validarRangoFechas(group: AbstractControl): ValidationErrors | null {
  const desde = group.get('fechaDesde')?.value as Date | null;
  const hasta = group.get('fechaHasta')?.value as Date | null;
  if (!desde || !hasta) {
    return null;
  }
  if (hasta < desde) {
    return { fechaInvalida: true };
  }
  const dias = (hasta.getTime() - desde.getTime()) / MS_POR_DIA;
  return dias > RANGO_MAXIMO_DIAS ? { rangoInvalido: true } : null;
}

/**
 * Pantalla de Informes (no hospitalario). SOLO DISEÑO: los catálogos son datos
 * de ejemplo y la descarga genera un CSV local (sin backend). Recrea la UX del
 * front original con el design system del proyecto.
 *
 * Convención de estilos:
 *   - Layout/espaciado → Tailwind (mapeado a tokens --app-*).
 *   - Patrones → .card, .field. Controles complejos → PrimeNG.
 */
@Component({
  selector: 'app-informes-nh',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Select,
    MultiSelect,
    DatePicker,
    ButtonModule,
    ProgressBar,
  ],
  templateUrl: './informes-nh.component.html',
  styleUrl: './informes-nh.component.scss',
})
export class InformesNhComponent {
  private readonly fb = inject(FormBuilder);

  /** Clase de entrada para revelar la tarjeta de filtros. */
  protected readonly fadeIn = routeFadeAnimation;

  /** Expuesto a la plantilla para los mensajes de validación. */
  protected readonly rangoMaximoDias = RANGO_MAXIMO_DIAS;

  /** Catálogo de informes (datos de ejemplo). */
  protected readonly informes: OpcionInforme[] = [
    {
      codigo: 'censo',
      nombre: 'Censo no hospitalario',
      descripcion:
        'Pacientes activos por servicio y ciudad dentro del periodo seleccionado.',
      icon: 'pi-users',
      archivo: 'informe-censo-nh',
    },
    {
      codigo: 'respaldo',
      nombre: 'Respaldo de programación',
      descripcion:
        'Soporte de la programación de atenciones domiciliarias del periodo.',
      icon: 'pi-calendar',
      archivo: 'informe-respaldo-programacion-nh',
    },
  ];

  /** Tipos de servicio (datos de ejemplo). */
  protected readonly servicios: Opcion[] = [
    { label: 'Enfermería', value: 'enfermeria' },
    { label: 'Fisioterapia', value: 'fisioterapia' },
    { label: 'Medicina general', value: 'medicina-general' },
    { label: 'Terapia respiratoria', value: 'terapia-respiratoria' },
    { label: 'Nutrición', value: 'nutricion' },
  ];

  /** Ciudades (datos de ejemplo). */
  protected readonly ciudades: Opcion[] = [
    { label: 'Medellín', value: 'medellin' },
    { label: 'Bogotá', value: 'bogota' },
    { label: 'Cali', value: 'cali' },
    { label: 'Barranquilla', value: 'barranquilla' },
    { label: 'Bucaramanga', value: 'bucaramanga' },
  ];

  /** Control del selector de informe (reactivo). */
  protected readonly informeControl = new FormControl<OpcionInforme | null>(null);

  /** Informe elegido; null mientras no se ha seleccionado. */
  protected readonly informeSeleccionado = signal<OpcionInforme | null>(null);

  /** Estado de la descarga (true mientras avanza la barra de progreso). */
  protected readonly descargando = signal(false);

  /** Progreso de la descarga (0–100). */
  protected readonly progreso = signal(0);

  /** Progreso redondeado para mostrar el porcentaje. */
  protected readonly progresoTexto = computed(() => Math.round(this.progreso()));

  /** Id del temporizador de la descarga simulada. */
  private temporizador: ReturnType<typeof setInterval> | null = null;

  /** Formulario de filtros con validación cruzada de fechas. */
  protected readonly filtros = this.fb.group(
    {
      servicios: this.fb.control<string[]>([], {
        nonNullable: true,
        validators: Validators.required,
      }),
      ciudades: this.fb.control<string[]>([], {
        nonNullable: true,
        validators: Validators.required,
      }),
      fechaDesde: this.fb.control<Date | null>(null, Validators.required),
      fechaHasta: this.fb.control<Date | null>(null, Validators.required),
    },
    { validators: validarRangoFechas },
  );

  constructor() {
    // Evita fugas si el usuario navega con una descarga en curso.
    inject(DestroyRef).onDestroy(() => this.detenerTemporizador());
  }

  /** Cambia el informe activo: cancela cualquier descarga y reinicia filtros. */
  protected onInformeChange(informe: OpcionInforme): void {
    this.cancelarDescarga();
    this.informeSeleccionado.set(informe);
    this.limpiarFiltros();
  }

  /** Limpia la selección de informe (botón clear del select). */
  protected onInformeClear(): void {
    this.cancelarDescarga();
    this.informeSeleccionado.set(null);
    this.limpiarFiltros();
  }

  /** Vacía los campos manteniendo el informe seleccionado. */
  protected limpiarFiltros(): void {
    this.filtros.reset({ servicios: [], ciudades: [] });
  }

  /** Inicia la descarga: arranca la barra de progreso. */
  protected descargar(): void {
    const informe = this.informeSeleccionado();
    if (!informe || this.filtros.invalid || this.descargando()) {
      return;
    }

    this.descargando.set(true);
    this.progreso.set(0);

    const incremento = (100 * DESCARGA_TICK_MS) / DESCARGA_DURACION_MS;
    // Progreso simulado (solo diseño): al llegar a 100 se genera el archivo.
    this.temporizador = setInterval(() => {
      const siguiente = Math.min(100, this.progreso() + incremento);
      this.progreso.set(siguiente);
      if (siguiente >= 100) {
        this.finalizarDescarga(informe);
      }
    }, DESCARGA_TICK_MS);
  }

  /** Cancela una descarga en curso y restablece el estado. */
  protected cancelarDescarga(): void {
    this.detenerTemporizador();
    this.descargando.set(false);
    this.progreso.set(0);
  }

  /** Completa la descarga: genera el archivo y limpia el estado. */
  private finalizarDescarga(informe: OpcionInforme): void {
    this.detenerTemporizador();
    this.generarDescarga(informe);
    this.descargando.set(false);
    this.progreso.set(0);
    this.limpiarFiltros();
  }

  /** Detiene el temporizador de progreso si está activo. */
  private detenerTemporizador(): void {
    if (this.temporizador !== null) {
      clearInterval(this.temporizador);
      this.temporizador = null;
    }
  }

  /** Construye un CSV de ejemplo a partir de los filtros y lo descarga. */
  private generarDescarga(informe: OpcionInforme): void {
    const { servicios, ciudades, fechaDesde, fechaHasta } =
      this.filtros.getRawValue();

    const encabezado = ['Servicio', 'Ciudad', 'Fecha desde', 'Fecha hasta'];
    const fila = [
      this.etiquetas(this.servicios, servicios),
      this.etiquetas(this.ciudades, ciudades),
      this.formatearFecha(fechaDesde),
      this.formatearFecha(fechaHasta),
    ];
    const csv = [encabezado, fila].map((cols) => cols.join(';')).join('\n');

    this.descargarCsv(csv, `${informe.archivo}.csv`);
  }

  /**
   * Descarga un texto como archivo siguiendo buenas prácticas:
   *   - BOM para que Excel interprete UTF-8 (acentos/ñ).
   *   - Object URL liberado con revokeObjectURL para no fugar memoria.
   *   - Ancla temporal con rel="noopener", insertada y removida del DOM.
   */
  private descargarCsv(contenido: string, nombreArchivo: string): void {
    const blob = new Blob(['﻿', contenido], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.rel = 'noopener';
    enlace.style.display = 'none';
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  }

  /** Traduce los `value` seleccionados a sus labels legibles. */
  private etiquetas(opciones: readonly Opcion[], valores: string[]): string {
    return valores
      .map((v) => opciones.find((o) => o.value === v)?.label ?? v)
      .join(' | ');
  }

  /** Formatea una fecha al locale es-CO; cadena vacía si no hay fecha. */
  private formatearFecha(fecha: Date | null): string {
    return fecha ? new Intl.DateTimeFormat('es-CO').format(fecha) : '';
  }
}
