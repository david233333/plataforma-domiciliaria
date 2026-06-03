import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Página de Solicitudes del ámbito NO hospitalario.
 *
 * Convención de estilos del proyecto:
 *   - Layout y utilidades → Tailwind en la plantilla (mapeado a los tokens --app-*).
 *   - Texto → clases tipográficas nombradas (.text-*).
 */
@Component({
  selector: 'app-solicitudes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.scss',
})
export class SolicitudesComponent {}
