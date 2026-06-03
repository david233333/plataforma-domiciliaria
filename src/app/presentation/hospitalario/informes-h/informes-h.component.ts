import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Página de Informes del ámbito hospitalario.
 *
 * Convención de estilos del proyecto:
 *   - Layout y utilidades → Tailwind en la plantilla (mapeado a los tokens --app-*).
 *   - Texto → clases tipográficas nombradas (.text-*).
 */
@Component({
  selector: 'app-informes-h',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './informes-h.component.html',
  styleUrl: './informes-h.component.scss',
})
export class InformesHComponent {}
