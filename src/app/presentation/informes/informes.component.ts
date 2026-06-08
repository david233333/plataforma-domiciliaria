import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

// PrimeNG 21 — standalone
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { MultiSelect } from 'primeng/multiselect';
import { DatePicker } from 'primeng/datepicker';
import { ProgressBar } from 'primeng/progressbar';

import { routeFadeAnimation } from '../../core/animations/animations';
import { ToasterService } from '../../core/feedback/toaster.service';
import { FormFieldComponent } from '../../shared/ui/molecules/form-field/form-field.component';
import { PageHeaderComponent } from '../../shared/ui/molecules/page-header/page-header.component';
import { FeatureIconComponent } from '../../shared/ui/molecules/feature-icon/feature-icon.component';
import { FormActionsComponent } from '../../shared/ui/molecules/form-actions/form-actions.component';
import { ButtonComponent } from '../../shared/ui/atoms/button/button.component';

/** Ámbitos de informes que comparten exactamente el mismo flujo y solo difieren en datos. */
export type Ambito = 'hospitalario' | 'no-hospitalario';

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

/**
 * Segunda dimensión de filtrado, la única que varía entre ámbitos: en
 * hospitalario es la SEDE; en no hospitalario, la CIUDAD. El resto del
 * formulario (servicios + rango de fechas) es idéntico.
 */
interface DimensionConfig {
  /** Etiqueta del campo en el formulario. */
  readonly label: string;
  /** Placeholder del multiselect. */
  readonly placeholder: string;
  /** Mensaje de error cuando no se selecciona ninguna opción. */
  readonly error: string;
  /** Encabezado de la columna en el CSV generado. */
  readonly columnaCsv: string;
  /** Catálogo de opciones (datos de ejemplo). Mutable: PrimeNG `[options]`. */
  readonly opciones: Opcion[];
}

/** Configuración completa de un ámbito: lo único que cambia es esto. */
interface AmbitoConfig {
  readonly titulo: string;
  readonly descripcion: string;
  // Arrays mutables: los consume `[options]` de PrimeNG (espera `any[]`).
  readonly informes: OpcionInforme[];
  readonly servicios: Opcion[];
  readonly dimension: DimensionConfig;
}

/** Tope de días permitido entre fecha de inicio y fin. */
const RANGO_MAXIMO_DIAS = 10;
const MS_POR_DIA = 1000 * 60 * 60 * 24;

/** Parámetros de la descarga simulada (solo diseño). */
const DESCARGA_DURACION_MS = 4500;
const DESCARGA_TICK_MS = 120;

/** Opciones del toggle de ámbito (segmented control). Mutable: PrimeNG `[options]`. */
const AMBITOS_OPCIONES: Opcion[] = [
  { label: 'Hospitalario', value: 'hospitalario' },
  { label: 'No hospitalario', value: 'no-hospitalario' },
];

/**
 * Catálogos por ámbito. Toda la diferencia entre «hospitalario» y «no
 * hospitalario» vive aquí como DATOS; el componente es un único orquestador.
 */
const CONFIG: Record<Ambito, AmbitoConfig> = {
  hospitalario: {
    titulo: 'Informes hospitalarios',
    descripcion: 'Genera y descarga los informes del ámbito hospitalario.',
    informes: [
      {
        codigo: 'censo',
        nombre: 'Censo hospitalario',
        descripcion:
          'Pacientes con hospitalización domiciliaria activa por servicio y sede en el periodo.',
        icon: 'pi-users',
        archivo: 'informe-censo-h',
      },
      {
        codigo: 'egresos',
        nombre: 'Egresos a domicilio',
        descripcion:
          'Pacientes egresados del hospital a atención domiciliaria durante el periodo.',
        icon: 'pi-sign-out',
        archivo: 'informe-egresos-h',
      },
      {
        codigo: 'reingresos',
        nombre: 'Reingresos hospitalarios',
        descripcion:
          'Pacientes que reingresaron al hospital tras iniciar la atención domiciliaria.',
        icon: 'pi-replay',
        archivo: 'informe-reingresos-h',
      },
    ],
    servicios: [
      { label: 'Hospitalización domiciliaria', value: 'hospitalizacion-domiciliaria' },
      { label: 'Cuidado paliativo', value: 'cuidado-paliativo' },
      { label: 'Antibioticoterapia', value: 'antibioticoterapia' },
      { label: 'Curaciones avanzadas', value: 'curaciones-avanzadas' },
      { label: 'Rehabilitación', value: 'rehabilitacion' },
    ],
    dimension: {
      label: 'Sede hospitalaria',
      placeholder: 'Selecciona una o varias',
      error: 'Selecciona al menos una sede.',
      columnaCsv: 'Sede',
      opciones: [
        { label: 'Clínica Las Américas', value: 'clinica-las-americas' },
        { label: 'Hospital General de Medellín', value: 'hospital-general-medellin' },
        { label: 'Clínica del Norte', value: 'clinica-del-norte' },
        { label: 'Clínica León XIII', value: 'clinica-leon-xiii' },
        { label: 'Hospital Pablo Tobón Uribe', value: 'hospital-pablo-tobon' },
      ],
    },
  },
  'no-hospitalario': {
    titulo: 'Informes no hospitalarios',
    descripcion: 'Genera y descarga los informes del ámbito no hospitalario.',
    informes: [
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
    ],
    servicios: [
      { label: 'Enfermería', value: 'enfermeria' },
      { label: 'Fisioterapia', value: 'fisioterapia' },
      { label: 'Medicina general', value: 'medicina-general' },
      { label: 'Terapia respiratoria', value: 'terapia-respiratoria' },
      { label: 'Nutrición', value: 'nutricion' },
    ],
    dimension: {
      label: 'Ciudad',
      placeholder: 'Selecciona una o varias',
      error: 'Selecciona al menos una ciudad.',
      columnaCsv: 'Ciudad',
      opciones: [
        { label: 'Medellín', value: 'medellin' },
        { label: 'Bogotá', value: 'bogota' },
        { label: 'Cali', value: 'cali' },
        { label: 'Barranquilla', value: 'barranquilla' },
        { label: 'Bucaramanga', value: 'bucaramanga' },
      ],
    },
  },
};

/** Normaliza el parámetro de ruta a un ámbito válido (cae en hospitalario). */
function aAmbito(valor: string | null): Ambito {
  return valor === 'no-hospitalario' ? 'no-hospitalario' : 'hospitalario';
}

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
 * Pantalla UNIFICADA de Informes. Un único componente sirve los dos ámbitos
 * (hospitalario / no hospitalario): el ámbito se elige con el toggle superior
 * y se refleja en la URL (`/informes/:ambito`), de modo que el menú lateral
 * puede enlazar directamente a cada uno. SOLO DISEÑO: los catálogos son datos
 * de ejemplo y la descarga genera un CSV local (sin backend).
 *
 * Convención de estilos:
 *   - Layout/espaciado → Tailwind (mapeado a tokens --app-*).
 *   - Patrones → .card, .field. Controles complejos → PrimeNG.
 */
@Component({
  selector: 'app-informes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Select,
    SelectButton,
    MultiSelect,
    DatePicker,
    ProgressBar,
    FormFieldComponent,
    PageHeaderComponent,
    FeatureIconComponent,
    FormActionsComponent,
    ButtonComponent,
  ],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.scss',
})
export class InformesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  // Feedback vía el servicio del sistema de diseño (envuelve PrimeNG); el
  // <p-toast> vive en el app-root.
  private readonly toaster = inject(ToasterService);

  /** Clase de entrada para revelar la tarjeta de filtros. */
  protected readonly fadeIn = routeFadeAnimation;

  /** Expuesto a la plantilla para los mensajes de validación. */
  protected readonly rangoMaximoDias = RANGO_MAXIMO_DIAS;

  /** Opciones del toggle de ámbito. */
  protected readonly ambitosOpciones = AMBITOS_OPCIONES;

  /** Ámbito activo, derivado del parámetro de ruta (fuente de verdad: la URL). */
  protected readonly ambito = toSignal(
    this.route.paramMap.pipe(map((p) => aAmbito(p.get('ambito')))),
    { initialValue: aAmbito(this.route.snapshot.paramMap.get('ambito')) },
  );

  /** Configuración (catálogos + textos) del ámbito activo. */
  protected readonly config = computed<AmbitoConfig>(() => CONFIG[this.ambito()]);

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
      dimension: this.fb.control<string[]>([], {
        nonNullable: true,
        validators: Validators.required,
      }),
      fechaDesde: this.fb.control<Date | null>(null, Validators.required),
      fechaHasta: this.fb.control<Date | null>(null, Validators.required),
    },
    { validators: validarRangoFechas },
  );

  /**
   * Tick reactivo del estado del formulario. Bajo OnPush los cambios de
   * validación/touched de Reactive Forms no marcan la vista; este signal
   * (alimentado por `filtros.events`) es la dependencia que hace recomputar
   * los signals de error de abajo. Su valor no se usa, solo su emisión.
   */
  private readonly filtrosEstado = toSignal(this.filtros.events);

  /** True tras un intento de envío: fuerza mostrar todos los errores. */
  protected readonly submitted = signal(false);

  // --- Señales de error por campo (visibles tras blur o intento de envío) ---
  protected readonly mostrarErrorServicios = computed(() =>
    this.campoInvalido('servicios'),
  );
  protected readonly mostrarErrorDimension = computed(() =>
    this.campoInvalido('dimension'),
  );
  protected readonly mostrarErrorFechaDesde = computed(() =>
    this.campoInvalido('fechaDesde'),
  );
  protected readonly mostrarErrorFechaHasta = computed(() =>
    this.campoInvalido('fechaHasta'),
  );

  // --- Señales de error del rango (validación cruzada del grupo) ---
  protected readonly mostrarErrorOrdenFechas = computed(() =>
    this.errorGrupoFechas('fechaInvalida'),
  );
  protected readonly mostrarErrorRangoFechas = computed(() =>
    this.errorGrupoFechas('rangoInvalido'),
  );

  // --- Estado visual «inválido» de los datepickers (faltante u orden/rango) ---
  protected readonly invalidoFechaDesde = computed(
    () =>
      this.mostrarErrorFechaDesde() ||
      this.mostrarErrorOrdenFechas() ||
      this.mostrarErrorRangoFechas(),
  );
  protected readonly invalidoFechaHasta = computed(
    () =>
      this.mostrarErrorFechaHasta() ||
      this.mostrarErrorOrdenFechas() ||
      this.mostrarErrorRangoFechas(),
  );

  /** Encabezado de la tarjeta de filtros (objetivo de foco al revelarse). */
  private readonly resumenHeading =
    viewChild<ElementRef<HTMLElement>>('resumenHeading');

  /** Ámbito de la última reinicialización (evita resetear en el primer render). */
  private ambitoPrevio: Ambito | null = null;

  constructor() {
    // Evita fugas si el usuario navega con una descarga en curso.
    inject(DestroyRef).onDestroy(() => this.detenerTemporizador());

    // Al cambiar de ámbito (toggle o enlace del menú), parte de cero: cancela
    // descargas, deselecciona el informe y limpia el formulario.
    effect(() => {
      const ambito = this.ambito();
      if (this.ambitoPrevio !== null && this.ambitoPrevio !== ambito) {
        this.reiniciarPorCambioDeAmbito();
      }
      this.ambitoPrevio = ambito;
    });

    // Al revelarse la tarjeta de filtros, lleva el foco a su encabezado para
    // que el usuario de teclado/lector no quede «atrás» tras el select.
    effect(() => this.resumenHeading()?.nativeElement.focus());
  }

  /** Cambia de ámbito navegando: la URL es la fuente de verdad. */
  protected onAmbitoChange(ambito: Ambito): void {
    if (ambito !== this.ambito()) {
      this.router.navigate(['/informes', ambito]);
    }
  }

  /** Deja la pantalla en su estado inicial tras un cambio de ámbito. */
  private reiniciarPorCambioDeAmbito(): void {
    this.cancelarDescarga();
    this.informeSeleccionado.set(null);
    this.informeControl.reset();
    this.limpiarFiltros();
  }

  /** ¿Debe mostrarse el error de un campo? Inválido y ya interactuado. */
  private campoInvalido(nombre: string): boolean {
    this.filtrosEstado(); // dependencia para recomputar bajo OnPush
    const control = this.filtros.get(nombre);
    return (
      !!control && control.invalid && (control.touched || this.submitted())
    );
  }

  /** ¿Debe mostrarse un error de grupo (rango) de fechas? */
  private errorGrupoFechas(error: string): boolean {
    this.filtrosEstado(); // dependencia para recomputar bajo OnPush
    const interactuado =
      !!this.filtros.get('fechaDesde')?.touched ||
      !!this.filtros.get('fechaHasta')?.touched ||
      this.submitted();
    return this.filtros.hasError(error) && interactuado;
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
    this.filtros.reset({ servicios: [], dimension: [] });
    this.submitted.set(false);
  }

  /** Inicia la descarga: valida y, si falta algo, lo señala y enfoca. */
  protected descargar(): void {
    const informe = this.informeSeleccionado();
    if (!informe || this.descargando()) {
      return;
    }

    // El botón permanece habilitado: validamos al enviar para poder explicar
    // qué falta (en vez de un submit inerte que no dice nada al usuario).
    if (this.filtros.invalid) {
      this.filtros.markAllAsTouched();
      this.submitted.set(true);
      this.enfocarPrimerError();
      return;
    }

    this.submitted.set(false);
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

  /** Lleva el foco al primer campo inválido del formulario (orden visual). */
  private enfocarPrimerError(): void {
    const orden = ['servicios', 'dimension', 'fechaDesde', 'fechaHasta'];
    const primero =
      orden.find((nombre) => this.filtros.get(nombre)?.invalid) ?? 'fechaDesde';
    document.getElementById(primero)?.focus();
  }

  /** Cancela una descarga en curso y restablece el estado. */
  protected cancelarDescarga(): void {
    this.detenerTemporizador();
    this.descargando.set(false);
    this.progreso.set(0);
  }

  /** Completa la descarga: genera el archivo, avisa y limpia el estado. */
  private finalizarDescarga(informe: OpcionInforme): void {
    this.detenerTemporizador();
    this.generarDescarga(informe);
    this.descargando.set(false);
    this.progreso.set(0);
    this.limpiarFiltros();
    this.notificarDescargaLista(informe);
  }

  /** Confirma con un toast de éxito que el archivo se generó. */
  private notificarDescargaLista(informe: OpcionInforme): void {
    this.toaster.showSuccess(
      `El informe «${informe.nombre}» se descargó correctamente.`,
      'Descarga completada',
    );
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
    const { servicios, dimension, fechaDesde, fechaHasta } =
      this.filtros.getRawValue();
    const config = this.config();

    const encabezado = [
      'Servicio',
      config.dimension.columnaCsv,
      'Fecha desde',
      'Fecha hasta',
    ];
    const fila = [
      this.etiquetas(config.servicios, servicios),
      this.etiquetas(config.dimension.opciones, dimension),
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
