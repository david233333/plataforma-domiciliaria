import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

/** Intención semántica del botón (define su color). */
export type ButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'contrast';

/** Estilo visual: relleno, contorno o solo texto. */
export type ButtonVariant = 'solid' | 'outlined' | 'text';

/** Tamaño del botón. */
export type ButtonSize = 'small' | 'normal' | 'large';

/** Tipo HTML del botón. */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Traduce la severity del sistema de diseño a la de PrimeNG 21 (que renombró
 * `warning` → `warn`). El `as const` fija los valores como literales para que el
 * tipo resultante encaje con el `severity` de `p-button`.
 */
const SEVERITY_MAP = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  info: 'info',
  warning: 'warn',
  danger: 'danger',
  contrast: 'contrast',
} as const satisfies Record<ButtonSeverity, string>;

/**
 * Átomo: botón.
 *
 * Envuelve el botón de PrimeNG con una **API estable y propia del sistema de
 * diseño**, de modo que las moléculas/organismos no dependan directamente de
 * PrimeNG (si algún día se cambia la librería, solo se toca este átomo).
 *
 * Decisiones de mapeo:
 *  - `severity="warning"` → `warn` (PrimeNG 21 renombró este valor); así el
 *    sistema de diseño usa `warning` de forma consistente con el status-badge.
 *  - `variant` colapsa los flags `outlined`/`text` de PrimeNG en una sola
 *    propiedad legible.
 *  - `size="normal"` → sin tamaño (el intermedio de PrimeNG).
 *
 * El icono se da SIN prefijo `pi-` (`icon="download"`). Para botones de solo
 * icono, omite `label` y pasa `ariaLabel` (obligatorio para accesibilidad).
 *
 * ```html
 * <app-button label="Descargar" icon="download" (clicked)="descargar()" />
 * <app-button icon="eye" [rounded]="true" variant="text"
 *             ariaLabel="Ver detalle" (clicked)="ver(row)" />
 * ```
 */
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, Tooltip],
  template: `
    <p-button
      [label]="label()"
      [icon]="iconClass()"
      [iconPos]="iconPos()"
      [severity]="severityProp()"
      [outlined]="variant() === 'outlined'"
      [text]="variant() === 'text'"
      [rounded]="rounded()"
      [size]="sizeProp()"
      [loading]="loading()"
      [disabled]="disabled()"
      [type]="type()"
      [ariaLabel]="ariaLabel()"
      [styleClass]="fullWidth() ? 'w-full' : ''"
      [pTooltip]="tooltip()"
      [tooltipPosition]="tooltipPosition()"
      (onClick)="clicked.emit($event)"
    />
  `,
})
export class ButtonComponent {
  /** Texto visible. Omítelo para un botón de solo icono (usa `ariaLabel`). */
  readonly label = input<string | undefined>(undefined);

  /** Icono PrimeIcons sin prefijo `pi-` (ej. `download`, `check`). */
  readonly icon = input<string | null>(null);

  /** Posición del icono respecto al texto. */
  readonly iconPos = input<'left' | 'right'>('left');

  /** Intención/color del botón. */
  readonly severity = input<ButtonSeverity>('primary');

  /** Estilo visual: relleno (por defecto), contorno o solo texto. */
  readonly variant = input<ButtonVariant>('solid');

  /** Botón redondo (típico en acciones de solo icono dentro de tablas). */
  readonly rounded = input(false);

  /** Tamaño del botón. */
  readonly size = input<ButtonSize>('normal');

  /** Muestra spinner y bloquea la interacción mientras dura una acción. */
  readonly loading = input(false);

  /** Deshabilita el botón. */
  readonly disabled = input(false);

  /** Tipo HTML; usa `submit` para enviar un formulario. */
  readonly type = input<ButtonType>('button');

  /** Etiqueta accesible; obligatoria en botones de solo icono. */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Ocupa todo el ancho disponible del contenedor. */
  readonly fullWidth = input(false);

  /** Texto del tooltip (útil sobre todo en botones de solo icono). Opcional. */
  readonly tooltip = input<string | undefined>(undefined);

  /** Posición del tooltip respecto al botón. */
  readonly tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('top');

  /** Se emite al hacer clic (cuando no está deshabilitado ni cargando). */
  readonly clicked = output<MouseEvent>();

  /** Clase del icono para PrimeNG, o `undefined` si no hay icono. */
  protected readonly iconClass = computed(() => {
    const raw = this.icon();
    if (!raw) {
      return undefined;
    }
    return raw.startsWith('pi-') ? `pi ${raw}` : `pi pi-${raw}`;
  });

  /** Severity ya traducida a la nomenclatura de PrimeNG 21. */
  protected readonly severityProp = computed(() => SEVERITY_MAP[this.severity()]);

  /** `normal` se traduce a «sin tamaño» (el intermedio de PrimeNG). */
  protected readonly sizeProp = computed(() => {
    const s = this.size();
    return s === 'normal' ? undefined : s;
  });
}
