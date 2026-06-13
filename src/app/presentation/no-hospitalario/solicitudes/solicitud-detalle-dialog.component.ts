import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';

// PrimeNG 21
import { Dialog } from 'primeng/dialog';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

// Sistema de diseño (shared/ui)
import { FeatureIconComponent } from '../../../shared/ui/molecules/feature-icon/feature-icon.component';
import { FormFieldComponent } from '../../../shared/ui/molecules/form-field/form-field.component';
import { FormActionsComponent } from '../../../shared/ui/molecules/form-actions/form-actions.component';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button.component';
import { StatusBadgeComponent } from '../../../shared/ui/atoms/status-badge/status-badge.component';

import { MOTIVOS_CANCELACION, SolicitudDetalle } from './solicitudes.labels';

/** Par etiqueta/valor de una lista de definición. `full` ocupa toda la fila. */
interface Par {
  readonly label: string;
  readonly value: string;
  /** Ocupa toda la fila de la rejilla (valores anchos). */
  readonly full?: boolean;
  /** Texto largo (notas clínicas): se pinta como párrafo legible, no en negrilla. */
  readonly longText?: boolean;
  /** Icono PrimeIcons opcional (sin prefijo pi-) junto al valor, decorativo. */
  readonly icon?: string;
}

/** Carga útil que emite el formulario de cancelación. */
export interface CancelacionForm {
  readonly motivo: string;
  readonly observacion: string;
}

/** Límite de caracteres de la observación de cancelación. */
const MAX_OBSERVACION = 4000;

/**
 * Modal de una solicitud, con dos pestañas (PrimeNG 21 Tabs):
 *   - «Detalle solicitud»: las cuatro secciones de datos (solo lectura).
 *   - «Cancelar visita»: CONSCIENTE DEL ESTADO →
 *       · si la solicitud ya está cancelada, muestra la razón (solo lectura);
 *       · si sigue activa, muestra el formulario para cancelarla.
 *
 * Es presentacional: recibe el `detalle` por `input`, gestiona su visibilidad con
 * un `model` de dos vías y, al confirmar la cancelación, emite la carga del
 * formulario por `output`. La página (smart) decide qué hacer con esa cancelación.
 *
 * La acción destructiva vive DENTRO de la pestaña (botón «Confirmar cancelación»),
 * no en el pie —el pie solo cierra—.
 */
@Component({
  selector: 'app-solicitud-detalle-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    ReactiveFormsModule,
    Dialog,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Select,
    Textarea,
    FeatureIconComponent,
    FormFieldComponent,
    FormActionsComponent,
    ButtonComponent,
    StatusBadgeComponent,
  ],
  template: `
    <p-dialog
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [dismissableMask]="true"
      [closable]="true"
      appendTo="body"
      styleClass="solicitud-detalle-dialog"
      [style]="{ width: '48rem' }"
      [breakpoints]="{ '960px': '92vw' }"
      [contentStyle]="{ 'max-height': '72vh', 'overflow-y': 'auto' }"
    >
      <!-- Cabecera limpia (sin banda de color): marca + título + id. -->
      <ng-template #header>
        <span class="flex items-center gap-3">
          <app-feature-icon icon="clipboard" tone="primary" size="md" />
          <span class="flex flex-col">
            <span class="text-heading-sm text-text-primary">Solicitud</span>
            @if (detalle(); as d) {
              <span class="text-caption font-mono">{{ d.idSolicitud }}</span>
            }
          </span>
        </span>
      </ng-template>

      <!-- Plantilla reutilizable de sección: cabecera (marca + título) + rejilla
           de pares etiqueta/valor. Se instancia una vez por bloque del detalle. -->
      <ng-template #seccion let-titulo="titulo" let-icono="icono" let-items="items">
        <section class="dlg-section">
          <header class="dlg-head">
            <app-feature-icon [icon]="icono" tone="primary" size="md" />
            <h3 class="text-label-lg text-text-primary m-0">{{ titulo }}</h3>
          </header>
          <dl class="dlg-grid">
            @for (par of items; track par.label) {
              <div class="dlg-item" [class.dlg-item--full]="par.full">
                <dt class="dlg-label">{{ par.label }}</dt>
                <dd class="dlg-value" [class.dlg-value--long]="par.longText">
                  @if (par.icon) {
                    <i class="pi pi-{{ par.icon }} dlg-value__icon" aria-hidden="true"></i>
                  }{{ par.value }}
                </dd>
              </div>
            }
          </dl>
        </section>
      </ng-template>

      @if (detalle(); as d) {
        <p-tabs [value]="activeTab()" (valueChange)="onTabChange($event)">
          <p-tablist>
            <p-tab value="detalle">
              <span class="inline-flex items-center gap-2">
                <i class="pi pi-eye" aria-hidden="true"></i> Detalle solicitud
              </span>
            </p-tab>
            <p-tab value="cancelar">
              <span class="inline-flex items-center gap-2">
                <i class="pi pi-ban" aria-hidden="true"></i> Cancelar visita
              </span>
            </p-tab>
          </p-tablist>

          <p-tabpanels>
            <!-- ============ Pestaña: detalle (solo lectura) ============ -->
            <p-tabpanel value="detalle">
              <div class="flex flex-col gap-5">
                <ng-container
                  [ngTemplateOutlet]="seccion"
                  [ngTemplateOutletContext]="{ titulo: 'Datos básicos', icono: 'id-card', items: datosBasicos() }"
                />
                <ng-container
                  [ngTemplateOutlet]="seccion"
                  [ngTemplateOutletContext]="{ titulo: 'Información del usuario', icono: 'user', items: infoUsuario() }"
                />
                <ng-container
                  [ngTemplateOutlet]="seccion"
                  [ngTemplateOutletContext]="{ titulo: 'Datos de atención', icono: 'map-marker', items: datosAtencion() }"
                />
                <ng-container
                  [ngTemplateOutlet]="seccion"
                  [ngTemplateOutletContext]="{ titulo: 'Datos del servicio', icono: 'info-circle', items: datosServicio() }"
                />
              </div>
            </p-tabpanel>

            <!-- ============ Pestaña: cancelar visita (según estado) ============ -->
            <p-tabpanel value="cancelar">
              @if (d.cancelacion; as c) {
                <!-- Ya cancelada → razón en solo lectura -->
                <section class="dlg-section">
                  <header class="dlg-head">
                    <app-feature-icon icon="ban" tone="danger" size="md" />
                    <h3 class="text-label-lg text-text-primary m-0">Razón de cancelación</h3>
                  </header>
                  <dl class="dlg-grid">
                    <div class="dlg-item">
                      <dt class="dlg-label">Estado de la visita</dt>
                      <dd class="dlg-value">
                        <app-status-badge variant="error" icon="times-circle">Cancelada</app-status-badge>
                      </dd>
                    </div>
                    <div class="dlg-item">
                      <dt class="dlg-label">Motivo de cancelación</dt>
                      <dd class="dlg-value">{{ c.motivo }}</dd>
                    </div>
                    <div class="dlg-item dlg-item--full">
                      <dt class="dlg-label">Observación</dt>
                      <dd class="dlg-value dlg-value--long">{{ c.observacion }}</dd>
                    </div>
                    <div class="dlg-item">
                      <dt class="dlg-label">Usuario que gestiona</dt>
                      <dd class="dlg-value">
                        <i class="pi pi-user dlg-value__icon" aria-hidden="true"></i>{{ c.usuario }}
                      </dd>
                    </div>
                    <div class="dlg-item">
                      <dt class="dlg-label">Fecha de cancelación</dt>
                      <dd class="dlg-value">
                        <i class="pi pi-calendar dlg-value__icon" aria-hidden="true"></i>{{ fechaHora(c.fecha) }}
                      </dd>
                    </div>
                  </dl>
                </section>
              } @else {
                <!-- Activa → formulario de cancelación -->
                <form class="dlg-section flex flex-col gap-2" [formGroup]="form" (ngSubmit)="enviarCancelacion()">
                  <header class="dlg-head">
                    <app-feature-icon icon="ban" tone="danger" size="md" />
                    <h3 class="text-label-lg text-text-primary m-0">Razón de cancelación</h3>
                  </header>

                  <app-form-field
                    label="Motivo de cancelación"
                    controlId="motivoCancelacion"
                    [required]="true"
                    [error]="motivoInvalido() ? 'Selecciona un motivo de cancelación.' : null"
                  >
                    <p-select
                      inputId="motivoCancelacion"
                      formControlName="motivo"
                      [options]="motivos"
                      optionLabel="label"
                      optionValue="value"
                      [filter]="true"
                      filterBy="label"
                      [invalid]="motivoInvalido()"
                      (onBlur)="marcarMotivoTocado()"
                      styleClass="w-full"
                      appendTo="body"
                    />
                  </app-form-field>

                  <app-form-field
                    label="Observación"
                    controlId="observacionCancelacion"
                    [hint]="contador()"
                  >
                    <textarea
                      pTextarea
                      id="observacionCancelacion"
                      formControlName="observacion"
                      rows="4"
                      [maxlength]="maxObservacion"
                      class="w-full"
                    ></textarea>
                  </app-form-field>

                  <app-form-actions>
                    <app-button
                      label="Confirmar cancelación"
                      icon="check"
                      severity="danger"
                      type="submit"
                    />
                  </app-form-actions>
                </form>
              }
            </p-tabpanel>
          </p-tabpanels>
        </p-tabs>
      }

      <!-- Pie: solo cerrar (la acción destructiva vive dentro de su pestaña). -->
      <ng-template #footer>
        <div class="flex justify-end">
          <app-button label="Cerrar" severity="secondary" (clicked)="visible.set(false)" />
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: `
    /* Cada sección va en un panel tenue para separarse dentro del modal: relleno
       surface-50 + borde hairline, SIN sombra. No es una "card" elevada anidada
       (eso lo prohíbe el sistema), solo una agrupación visual de la sección. */
    .dlg-section {
      background: var(--app-surface-50);
      border: 1px solid var(--app-surface-200);
      border-radius: var(--app-radius-md);
      padding: var(--app-space-5) var(--app-space-6);
    }

    /* Cabecera de cada sección: marca + título + línea divisoria. */
    .dlg-head {
      display: flex;
      align-items: center;
      gap: var(--app-space-3);
      padding-bottom: var(--app-space-3);
      margin-bottom: var(--app-space-4);
      border-bottom: 1px solid var(--app-surface-200);
    }

    /* Rejilla de pares etiqueta/valor: una columna en móvil, dos en escritorio. */
    .dlg-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--app-space-4) var(--app-space-8);
      margin: 0;
    }
    @media (min-width: 640px) {
      .dlg-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .dlg-item {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
    }
    .dlg-item--full {
      grid-column: 1 / -1;
    }

    .dlg-label {
      font-size: var(--app-size-xs);
      color: var(--app-text-muted);
    }
    .dlg-value {
      margin: 0;
      font-size: var(--app-size-sm);
      font-weight: var(--app-weight-semibold);
      color: var(--app-text-primary);
      word-break: break-word;
    }
    /* Valores de texto largo (p. ej. gestión de admisión / observación): legibles
       como párrafo —peso normal, interlineado de lectura y medida acotada—. */
    .dlg-value--long {
      font-weight: var(--app-weight-regular);
      line-height: var(--app-leading-normal);
      max-width: 70ch;
      text-wrap: pretty;
    }
    /* Iconito tenue junto al valor: ayuda a reconocer el dato sin competir. */
    .dlg-value__icon {
      color: var(--app-text-muted);
      font-size: var(--app-size-sm);
      margin-right: var(--app-space-2);
      vertical-align: -0.05em;
    }

    /* PrimeNG pinta los paneles de tabs FUERA de la encapsulación
       (appendTo="body"); se ajustan con ::ng-deep, acotado por la clase única
       del dialog para no afectar otros modales. */
    ::ng-deep .solicitud-detalle-dialog .p-tabpanels {
      background: transparent;
      padding: var(--app-space-6) 0 0;
    }
  `,
})
export class SolicitudDetalleDialogComponent {
  private readonly fb = inject(FormBuilder);

  /** Detalle a mostrar; `null` mientras no hay nada seleccionado. */
  readonly detalle = input<SolicitudDetalle | null>(null);

  /** Visibilidad del modal (dos vías con la página). */
  readonly visible = model(false);

  /** Se emite al confirmar la cancelación. La página decide el flujo real. */
  readonly cancelar = output<CancelacionForm>();

  /** Pestaña activa. */
  protected readonly activeTab = signal<string>('detalle');

  /** Catálogo de motivos y tope de caracteres expuestos a la plantilla. */
  protected readonly motivos = MOTIVOS_CANCELACION;
  protected readonly maxObservacion = MAX_OBSERVACION;

  /** Formulario de cancelación. */
  protected readonly form = this.fb.group({
    motivo: this.fb.control<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    observacion: this.fb.control<string>('', { nonNullable: true }),
  });

  /** True tras un intento de envío: fuerza mostrar el error del motivo. */
  protected readonly intentado = signal(false);

  /** Tick reactivo del estado del formulario (recálculo de errores bajo OnPush). */
  private readonly formEstado = toSignal(
    merge(this.form.events, ...Object.values(this.form.controls).map((c) => c.events)),
  );

  /** Valor de la observación, como signal, para el contador de caracteres. */
  private readonly obsValue = toSignal(this.form.controls.observacion.valueChanges, {
    initialValue: '',
  });
  protected readonly contador = computed(() => `${this.obsValue().length} / ${MAX_OBSERVACION}`);

  /** ¿Mostrar el error del motivo? Inválido y ya interactuado (blur o envío). */
  protected readonly motivoInvalido = computed(() => {
    this.formEstado();
    const c = this.form.controls.motivo;
    return c.invalid && (c.touched || this.intentado());
  });

  constructor() {
    // Al cerrar, vuelve a la pestaña de detalle y limpia el formulario, de modo
    // que la próxima solicitud que se abra empiece desde cero.
    effect(() => {
      if (!this.visible()) {
        this.activeTab.set('detalle');
        this.intentado.set(false);
        this.form.reset({ motivo: '', observacion: '' });
      }
    });
  }

  /** Cambia de pestaña (p-tabs emite string | number | undefined). */
  protected onTabChange(value: string | number | undefined): void {
    this.activeTab.set(value == null ? 'detalle' : String(value));
  }

  /** Marca el motivo como tocado al cerrar su panel (mensaje sin retardo). */
  protected marcarMotivoTocado(): void {
    this.form.controls.motivo.markAsTouched();
  }

  /** Valida y, si está completo, emite la cancelación a la página. */
  protected enviarCancelacion(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.intentado.set(true);
      return;
    }
    const { motivo, observacion } = this.form.getRawValue();
    this.cancelar.emit({ motivo, observacion });
  }

  /** Pares de la sección «Datos básicos». */
  protected readonly datosBasicos = computed<Par[]>(() => {
    const d = this.detalle();
    if (!d) {
      return [];
    }
    return [
      { label: 'Tipo de documento', value: d.tipoDocumento },
      { label: 'Número de documento', value: d.numeroDocumento, icon: 'hashtag' },
      { label: 'Plan de salud', value: d.planSalud },
      { label: 'Anexo domiciliario', value: d.tieneAnexoDomiciliario ? 'Sí' : 'No' },
      { label: 'Inicio del asegurado', value: this.fecha(d.fechaInicioAsegurado), icon: 'calendar' },
      { label: 'Fin del asegurado', value: this.fecha(d.fechaFinAsegurado), icon: 'calendar' },
      { label: 'Descripción del plan', value: d.descripcionPlan, full: true },
    ];
  });

  /** Pares de la sección «Información del usuario». */
  protected readonly infoUsuario = computed<Par[]>(() => {
    const d = this.detalle();
    if (!d) {
      return [];
    }
    return [
      { label: 'Nombres', value: d.nombres },
      { label: 'Apellidos', value: d.apellidos },
      { label: 'Fecha de nacimiento', value: this.fecha(d.fechaNacimiento), icon: 'calendar' },
      { label: 'Edad', value: `${d.edad} ${d.edad === 1 ? 'año' : 'años'}` },
      { label: 'Sexo', value: d.sexo },
      { label: 'Celular', value: d.celular, icon: 'mobile' },
      { label: 'Teléfono', value: d.telefono, icon: 'phone' },
      { label: 'Correo electrónico', value: d.email, icon: 'envelope' },
    ];
  });

  /** Pares de la sección «Datos de atención». */
  protected readonly datosAtencion = computed<Par[]>(() => {
    const d = this.detalle();
    if (!d) {
      return [];
    }
    return [
      { label: 'Ciudad', value: d.ciudad },
      { label: 'Municipio', value: d.municipio },
      { label: 'Dirección', value: d.direccion, icon: 'home' },
      { label: 'Barrio', value: d.barrio },
      { label: 'Información complementaria', value: d.informacionComplementaria, full: true },
    ];
  });

  /** Pares de la sección «Datos del servicio». */
  protected readonly datosServicio = computed<Par[]>(() => {
    const d = this.detalle();
    if (!d) {
      return [];
    }
    return [
      { label: 'Tipo de servicio', value: d.tipoServicio },
      { label: 'Tipo de prestación', value: d.tipoPrestacion },
      { label: 'Tipo de conducta', value: d.tipoConducta },
      { label: 'Programa', value: d.programa },
      { label: 'Zona', value: d.zona },
      { label: 'Fecha de visita', value: this.fechaHora(d.fechaVisita), icon: 'calendar' },
      { label: 'Prioridad', value: d.prioridad },
      { label: 'SLA (min)', value: String(d.sla), icon: 'clock' },
      { label: 'Tipo de convenio', value: d.tipoConvenio },
      { label: 'Copago', value: this.moneda(d.copago), icon: 'dollar' },
      {
        label: 'Gestión de admisión',
        value: d.gestionAdmision,
        full: true,
        longText: true,
      },
    ];
  });

  /** Formatea una fecha a dd/MM/yyyy (es-CO), coherente con el resto de la app. */
  private fecha(d: Date): string {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  }

  /** Fecha con hora (dd/MM/yyyy, hh:mm a) para campos con marca temporal. */
  protected fechaHora(d: Date): string {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  }

  /** Formatea un valor como moneda colombiana (COP, sin decimales). */
  private moneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  }
}
