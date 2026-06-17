import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

import { FormFieldComponent } from '../../../../../shared/ui/molecules/form-field/form-field.component';
import { IconComponent } from '../../../../../shared/ui/atoms/icon/icon.component';
import { SolicitudCrearStore } from '../../solicitud-crear.store';

/**
 * Sección: datos del servicio. Elegir el tipo de servicio dispara la INFERENCIA
 * (`store.seleccionarServicio()` → cascada de dominio), cuyo resultado se ve en
 * el panel de resumen. El selector queda deshabilitado hasta que haya un plan
 * (`store.servicioHabilitado()`), y muestra un indicador mientras infiere.
 */
@Component({
  selector: 'app-seccion-servicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Select, FormFieldComponent, IconComponent],
  templateUrl: './seccion-servicio.component.html',
  styleUrl: './seccion-servicio.component.scss',
})
export class SeccionServicioComponent {
  protected readonly store = inject(SolicitudCrearStore);
}
