import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// PrimeNG 21 — componentes standalone
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Password } from 'primeng/password';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { DatePicker } from 'primeng/datepicker';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { RadioButton } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

interface Swatch {
  readonly token: string; // --app-*
  readonly utility: string; // clase Tailwind / patrón
  readonly hex: string;
}

interface NamedStyle {
  readonly cls: string;
  readonly sample: string;
}

@Component({
  selector: 'app-design-system',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputText,
    IconField,
    InputIcon,
    Password,
    Textarea,
    Select,
    MultiSelect,
    DatePicker,
    Checkbox,
    ToggleSwitch,
    RadioButton,
    ButtonModule,
  ],
  template: `
    <!--
      GUÍA DE LECTURA DEL TEMPLATE (para el equipo):
        • LAYOUT y espaciado  → utilidades Tailwind (grid, gap-*, p-*, flex…).
        • TIPOGRAFÍA de jerarquía → clases propias (.text-heading-*, .text-body-*).
        • PATRONES → clases propias SCSS (.card, .field, .status-badge, .skeleton).
        • CONTROLES de formulario → componentes PrimeNG (p-* / pInputText / pTextarea).
        Ningún color/borde de PrimeNG se toca con Tailwind: eso vive en @layer sp-theme.
    -->
    <div class="container-app section animate-fade-in">
      <!-- ENCABEZADO -->
      <header class="mb-12">
        <p class="text-overline">Fundación</p>
        <h1 class="text-display-md mt-2">Sistema de Diseño</h1>
        <p class="text-body-lg mt-3" style="color: var(--app-text-secondary); max-width: 60ch;">
          Catálogo vivo de tokens, tipografía, superficies y patrones. Fuente única
          de verdad compartida por PrimeNG (vía <code class="font-mono">@layer sp-theme</code>)
          y Tailwind (vía <code class="font-mono">&#64;theme inline</code>).
        </p>
      </header>

      <!-- ===================================================================
           SECCIÓN A — CATÁLOGO VISUAL
      ==================================================================== -->

      <!-- A.1 COLOR -->
      <section class="mb-16">
        <h2 class="text-heading-xl mb-6">Color</h2>

        <h3 class="text-label-lg mb-3">Primary</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          @for (s of primary; track s.token) {
            <div class="card--outlined" style="padding: 0; overflow: hidden;">
              <div [style.background]="s.hex" style="height: 4rem;"></div>
              <div class="p-3">
                <p class="text-label-sm">{{ s.token }}</p>
                <p class="text-caption font-mono">{{ s.utility }}</p>
                <p class="text-caption font-mono">{{ s.hex }}</p>
              </div>
            </div>
          }
        </div>

        <h3 class="text-label-lg mb-3">Neutral</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          @for (s of neutral; track s.token) {
            <div class="card--outlined" style="padding: 0; overflow: hidden;">
              <div [style.background]="s.hex" style="height: 4rem;"></div>
              <div class="p-3">
                <p class="text-label-sm">{{ s.token }}</p>
                <p class="text-caption font-mono">{{ s.utility }}</p>
                <p class="text-caption font-mono">{{ s.hex }}</p>
              </div>
            </div>
          }
        </div>

        <h3 class="text-label-lg mb-3">Semánticos</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          @for (s of semantic; track s.token) {
            <div class="card--outlined" style="padding: 0; overflow: hidden;">
              <div [style.background]="s.hex" style="height: 4rem;"></div>
              <div class="p-3">
                <p class="text-label-sm">{{ s.token }}</p>
                <p class="text-caption font-mono">{{ s.utility }}</p>
                <p class="text-caption font-mono">{{ s.hex }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- A.2 TIPOGRAFÍA -->
      <section class="mb-16">
        <h2 class="text-heading-xl mb-2">Tipografía</h2>
        <p class="text-body-sm mb-6" style="color: var(--app-text-muted);">
          Clase propia (semántica, columna izquierda) vs utilidad Tailwind equivalente.
        </p>
        <div class="card">
          <div class="flex flex-col gap-5">
            @for (t of typeScale; track t.cls) {
              <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                <code class="text-caption font-mono shrink-0" style="width: 12rem;">.{{ t.cls }}</code>
                <span [class]="t.cls">{{ t.sample }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- A.3 ESPACIADO -->
      <section class="mb-16">
        <h2 class="text-heading-xl mb-6">Espaciado <span class="text-caption">(base 4px)</span></h2>
        <div class="card flex flex-col gap-3">
          @for (sp of spacing; track sp.token) {
            <div class="flex items-center gap-4">
              <code class="text-caption font-mono shrink-0" style="width: 9rem;">{{ sp.token }}</code>
              <div [style.width]="sp.value" style="height: 1rem; background: var(--app-primary-400); border-radius: var(--app-radius-sm);"></div>
              <span class="text-caption shrink-0">{{ sp.value }}</span>
            </div>
          }
        </div>
      </section>

      <!-- A.4 ELEVACIÓN -->
      <section class="mb-16">
        <h2 class="text-heading-xl mb-6">Elevación</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          @for (sh of shadows; track sh) {
            <div class="flex flex-col items-center gap-3">
              <div
                style="width: 100%; height: 5rem; background: var(--app-surface-0); border-radius: var(--app-radius-md);"
                [style.box-shadow]="'var(--app-shadow-' + sh + ')'"
              ></div>
              <code class="text-caption font-mono">shadow-{{ sh }}</code>
            </div>
          }
        </div>
      </section>

      <!-- A.5 CARDS -->
      <section class="mb-16">
        <h2 class="text-heading-xl mb-6">Cards</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="card">
            <h3 class="text-heading-sm mb-2">.card</h3>
            <p class="text-body-sm" style="color: var(--app-text-secondary);">
              Fondo blanco, borde surface-200, sombra-xs, radio-md. Variante por defecto.
            </p>
          </div>
          <div class="card--outlined">
            <h3 class="text-heading-sm mb-2">.card--outlined</h3>
            <p class="text-body-sm" style="color: var(--app-text-secondary);">
              Borde surface-300 visible, sin sombra. Para zonas de menor jerarquía.
            </p>
          </div>
        </div>
      </section>

      <!-- A.6 BADGES -->
      <section class="mb-16">
        <h2 class="text-heading-xl mb-6">Status badges</h2>
        <div class="card flex flex-wrap gap-3">
          <span class="status-badge status-badge--success"><i class="pi pi-check"></i> Activo</span>
          <span class="status-badge status-badge--warning"><i class="pi pi-clock"></i> Pendiente</span>
          <span class="status-badge status-badge--error"><i class="pi pi-times"></i> Rechazado</span>
          <span class="status-badge status-badge--info"><i class="pi pi-info-circle"></i> En revisión</span>
        </div>
      </section>

      <!-- A.7 SKELETON + FADE -->
      <section class="mb-16">
        <h2 class="text-heading-xl mb-6">Skeleton &amp; fadeIn</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="card">
            <h3 class="text-heading-sm mb-4">Skeleton</h3>
            <div class="flex items-center gap-4">
              <div class="skeleton skeleton--circle" style="width: 3rem; height: 3rem;"></div>
              <div class="flex-1 flex flex-col gap-2">
                <div class="skeleton skeleton--text" style="width: 70%;"></div>
                <div class="skeleton skeleton--text" style="width: 45%;"></div>
              </div>
            </div>
          </div>
          <div class="card">
            <h3 class="text-heading-sm mb-4">fadeIn</h3>
            <div style="min-height: 4rem;">
              @if (showFade()) {
                <div class="animate-fade-in card--outlined" style="display: inline-block;">
                  <span class="text-body-md">¡Hola! Entré con fade.</span>
                </div>
              }
            </div>
            <p-button label="Replay" severity="secondary" size="small" (onClick)="replayFade()" />
          </div>
        </div>
      </section>

      <!-- ===================================================================
           SECCIÓN B — FORMULARIO DE DEMOSTRACIÓN
      ==================================================================== -->
      <section class="mb-16">
        <h2 class="text-heading-xl mb-2">Formulario de demostración</h2>
        <p class="text-body-sm mb-6" style="color: var(--app-text-muted);">
          ReactiveFormsModule + PrimeNG, envuelto en <code class="font-mono">.card</code>,
          layout con grid de Tailwind.
        </p>

        <form class="card" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nombre completo -->
            <div class="field">
              <label class="field__label" for="nombre">
                Nombre completo<span class="field__required" aria-hidden="true">*</span>
              </label>
              <input
                pInputText
                id="nombre"
                formControlName="nombreCompleto"
                placeholder="Ej. María González"
                [invalid]="isInvalid('nombreCompleto')"
                aria-describedby="nombre-msg"
              />
              <div id="nombre-msg" class="field__message-slot">
                @if (isInvalid('nombreCompleto')) {
                  <span class="field__error">Mínimo 3 caracteres y es obligatorio.</span>
                } @else {
                  <span class="field__hint">Nombre y apellidos del colaborador.</span>
                }
              </div>
            </div>

            <!-- Email con ícono -->
            <div class="field">
              <label class="field__label" for="email">
                Email<span class="field__required" aria-hidden="true">*</span>
              </label>
              <p-iconfield>
                <p-inputicon styleClass="pi pi-envelope" />
                <input
                  pInputText
                  id="email"
                  formControlName="email"
                  placeholder="nombre@empresa.com"
                  [invalid]="isInvalid('email')"
                  aria-describedby="email-msg"
                />
              </p-iconfield>
              <div id="email-msg" class="field__message-slot">
                @if (isInvalid('email')) {
                  <span class="field__error">Ingresa un correo válido.</span>
                }
              </div>
            </div>

            <!-- Contraseña -->
            <div class="field">
              <label class="field__label" for="password">Contraseña</label>
              <p-password
                inputId="password"
                formControlName="password"
                [toggleMask]="true"
                [feedback]="true"
                styleClass="w-full"
                [inputStyle]="{ width: '100%' }"
                placeholder="••••••••"
              />
              <div class="field__message-slot">
                <span class="field__hint">Usa al menos 8 caracteres.</span>
              </div>
            </div>

            <!-- Observaciones -->
            <div class="field">
              <label class="field__label" for="obs">Observaciones</label>
              <textarea
                pTextarea
                id="obs"
                formControlName="observaciones"
                rows="1"
                maxlength="250"
                placeholder="Notas internas (opcional)"
              ></textarea>
              <div class="field__message-slot">
                <span class="field__hint">Máximo 250 caracteres.</span>
              </div>
            </div>

            <!-- Área (Select) -->
            <div class="field">
              <label class="field__label" for="area">
                Área / Departamento<span class="field__required" aria-hidden="true">*</span>
              </label>
              <p-select
                inputId="area"
                formControlName="area"
                [options]="areas"
                optionLabel="label"
                optionValue="value"
                placeholder="Selecciona un área"
                styleClass="w-full"
                [invalid]="isInvalid('area')"
              />
              <div class="field__message-slot">
                @if (isInvalid('area')) {
                  <span class="field__error">Selecciona un área.</span>
                }
              </div>
            </div>

            <!-- Roles (MultiSelect) -->
            <div class="field">
              <label class="field__label" for="roles">Roles asignados</label>
              <p-multiselect
                inputId="roles"
                formControlName="roles"
                [options]="roles"
                optionLabel="label"
                optionValue="value"
                placeholder="Selecciona roles"
                styleClass="w-full"
                display="chip"
              />
              <div class="field__message-slot"></div>
            </div>

            <!-- Fecha de vinculación -->
            <div class="field">
              <label class="field__label" for="fecha">Fecha de vinculación</label>
              <p-datepicker
                inputId="fecha"
                formControlName="fechaVinculacion"
                dateFormat="dd/mm/yy"
                [showIcon]="true"
                styleClass="w-full"
                placeholder="dd/mm/aaaa"
              />
              <div class="field__message-slot"></div>
            </div>

            <!-- Tipo de cuenta (Radio) -->
            <div class="field">
              <span class="field__label" id="tipo-label">Tipo de cuenta</span>
              <div class="flex items-center gap-6 mt-1" role="radiogroup" aria-labelledby="tipo-label">
                <label class="flex items-center gap-2 cursor-pointer">
                  <p-radiobutton formControlName="tipoCuenta" value="personal" inputId="tipo-personal" />
                  <span class="text-body-sm">Personal</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <p-radiobutton formControlName="tipoCuenta" value="empresa" inputId="tipo-empresa" />
                  <span class="text-body-sm">Empresa</span>
                </label>
              </div>
              <div class="field__message-slot"></div>
            </div>

            <!-- Notificaciones (ToggleSwitch) -->
            <div class="field">
              <span class="field__label">Notificaciones del sistema</span>
              <label class="flex items-center gap-3 mt-1 cursor-pointer">
                <p-toggleswitch formControlName="notificaciones" inputId="notif" />
                <span class="text-body-sm" style="color: var(--app-text-secondary);">
                  Activar notificaciones
                </span>
              </label>
              <div class="field__message-slot"></div>
            </div>

            <!-- Términos (Checkbox) — ocupa toda la fila -->
            <div class="field md:col-span-2">
              <label class="flex items-start gap-3 cursor-pointer">
                <p-checkbox formControlName="terminos" [binary]="true" inputId="terminos" [invalid]="isInvalid('terminos')" />
                <span class="text-body-sm">
                  Acepto los términos y condiciones<span class="field__required" aria-hidden="true">*</span>
                </span>
              </label>
              <div class="field__message-slot">
                @if (isInvalid('terminos')) {
                  <span class="field__error">Debes aceptar los términos para continuar.</span>
                }
              </div>
            </div>
          </div>

          <!-- BOTONES -->
          <div class="flex flex-wrap items-center gap-3 mt-4">
            <p-button type="submit" label="Guardar" icon="pi pi-check" [loading]="saving()" />
            <p-button type="button" label="Cancelar" severity="secondary" (onClick)="onCancel()" />
            <p-button type="button" label="Acción no disponible" [disabled]="true" />
          </div>
        </form>
      </section>

      <!-- B.2 ESTADOS VISUALES DE UN CAMPO -->
      <section class="mb-16">
        <h2 class="text-heading-xl mb-6">Un campo en 4 estados</h2>
        <div class="card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- default -->
          <div class="field">
            <label class="field__label" for="st-default">Default</label>
            <input pInputText id="st-default" placeholder="Texto" />
            <div class="field__message-slot">
              <span class="field__hint">Estado en reposo.</span>
            </div>
          </div>
          <!-- focused (autofocus para mostrar el focus ring) -->
          <div class="field">
            <label class="field__label" for="st-focus">Focused</label>
            <input pInputText id="st-focus" placeholder="Haz click aquí" />
            <div class="field__message-slot">
              <span class="field__hint">Focus ring primary-500 al enfocar.</span>
            </div>
          </div>
          <!-- error -->
          <div class="field">
            <label class="field__label" for="st-error">Error</label>
            <input pInputText id="st-error" [invalid]="true" value="Valor inválido" />
            <div class="field__message-slot">
              <span class="field__error">Este campo tiene un error.</span>
            </div>
          </div>
          <!-- disabled -->
          <div class="field">
            <label class="field__label" for="st-disabled">Disabled</label>
            <input pInputText id="st-disabled" [disabled]="true" value="No editable" />
            <div class="field__message-slot">
              <span class="field__hint">No interactivo.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class DesignSystemComponent {
  private readonly fb = inject(FormBuilder);

  // --- Estado UI ---
  protected readonly saving = signal(false);
  protected readonly showFade = signal(true);

  // --- Datos de catálogo ---
  protected readonly primary: Swatch[] = [
    { token: '--app-primary-50', utility: 'bg-primary-50', hex: '#eff6ff' },
    { token: '--app-primary-100', utility: 'bg-primary-100', hex: '#dbeafe' },
    { token: '--app-primary-200', utility: 'bg-primary-200', hex: '#bfdbfe' },
    { token: '--app-primary-300', utility: 'bg-primary-300', hex: '#93c5fd' },
    { token: '--app-primary-400', utility: 'bg-primary-400', hex: '#60a5fa' },
    { token: '--app-primary-500', utility: 'bg-primary-500', hex: '#3b82f6' },
    { token: '--app-primary-600', utility: 'bg-primary-600', hex: '#2563eb' },
    { token: '--app-primary-700', utility: 'bg-primary-700', hex: '#1d4ed8' },
    { token: '--app-primary-800', utility: 'bg-primary-800', hex: '#1e40af' },
    { token: '--app-primary-900', utility: 'bg-primary-900', hex: '#1e3a8a' },
    { token: '--app-primary-950', utility: 'bg-primary-950', hex: '#172554' },
  ];

  protected readonly neutral: Swatch[] = [
    { token: '--app-neutral-50', utility: 'bg-neutral-50', hex: '#f8fafc' },
    { token: '--app-neutral-100', utility: 'bg-neutral-100', hex: '#f1f5f9' },
    { token: '--app-neutral-200', utility: 'bg-neutral-200', hex: '#e2e8f0' },
    { token: '--app-neutral-300', utility: 'bg-neutral-300', hex: '#cbd5e1' },
    { token: '--app-neutral-400', utility: 'bg-neutral-400', hex: '#94a3b8' },
    { token: '--app-neutral-500', utility: 'bg-neutral-500', hex: '#64748b' },
    { token: '--app-neutral-600', utility: 'bg-neutral-600', hex: '#475569' },
    { token: '--app-neutral-700', utility: 'bg-neutral-700', hex: '#334155' },
    { token: '--app-neutral-800', utility: 'bg-neutral-800', hex: '#1e293b' },
    { token: '--app-neutral-900', utility: 'bg-neutral-900', hex: '#0f172a' },
    { token: '--app-neutral-950', utility: 'bg-neutral-950', hex: '#020617' },
  ];

  protected readonly semantic: Swatch[] = [
    { token: '--app-success', utility: 'bg-success', hex: '#16a34a' },
    { token: '--app-warning', utility: 'bg-warning', hex: '#d97706' },
    { token: '--app-error', utility: 'bg-error', hex: '#dc2626' },
    { token: '--app-info', utility: 'bg-info', hex: '#0891b2' },
  ];

  protected readonly typeScale: NamedStyle[] = [
    { cls: 'text-display-lg', sample: 'Display Large' },
    { cls: 'text-display-md', sample: 'Display Medium' },
    { cls: 'text-heading-xl', sample: 'Heading XL' },
    { cls: 'text-heading-lg', sample: 'Heading LG' },
    { cls: 'text-heading-md', sample: 'Heading MD' },
    { cls: 'text-heading-sm', sample: 'Heading SM' },
    { cls: 'text-body-lg', sample: 'Body Large — párrafo de lectura cómoda.' },
    { cls: 'text-body-md', sample: 'Body Medium — texto base del sistema.' },
    { cls: 'text-body-sm', sample: 'Body Small — texto secundario.' },
    { cls: 'text-label-md', sample: 'Label Medium' },
    { cls: 'text-caption', sample: 'Caption — fechas y hints.' },
    { cls: 'text-overline', sample: 'Overline' },
  ];

  protected readonly spacing = [
    { token: '--app-space-1', value: '4px' },
    { token: '--app-space-2', value: '8px' },
    { token: '--app-space-3', value: '12px' },
    { token: '--app-space-4', value: '16px' },
    { token: '--app-space-6', value: '24px' },
    { token: '--app-space-8', value: '32px' },
    { token: '--app-space-12', value: '48px' },
    { token: '--app-space-16', value: '64px' },
  ];

  protected readonly shadows = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

  protected readonly areas = [
    { label: 'Tecnología', value: 'tech' },
    { label: 'Operaciones', value: 'ops' },
    { label: 'Clínico', value: 'clinico' },
    { label: 'Administración', value: 'admin' },
  ];

  protected readonly roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Coordinador', value: 'coord' },
    { label: 'Profesional', value: 'pro' },
    { label: 'Auditor', value: 'audit' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    observaciones: ['', [Validators.maxLength(250)]],
    area: ['', [Validators.required]],
    roles: [[] as string[]],
    fechaVinculacion: [null as Date | null],
    tipoCuenta: ['personal'],
    notificaciones: [true],
    terminos: [false, [Validators.requiredTrue]],
  });

  protected isInvalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    // Simula una llamada async; en producción aquí iría el caso de uso.
    setTimeout(() => this.saving.set(false), 1500);
  }

  protected onCancel(): void {
    this.form.reset({
      tipoCuenta: 'personal',
      notificaciones: true,
      roles: [],
    });
  }

  protected replayFade(): void {
    // Remonta el elemento para re-disparar la animación de entrada.
    this.showFade.set(false);
    requestAnimationFrame(() => this.showFade.set(true));
  }
}
