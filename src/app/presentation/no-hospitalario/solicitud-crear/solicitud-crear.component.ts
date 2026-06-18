import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeaderComponent } from '../../../shared/ui/molecules/page-header/page-header.component';
import { FormActionsComponent } from '../../../shared/ui/molecules/form-actions/form-actions.component';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button.component';

import { SolicitudCrearStore } from './solicitud-crear.store';
import { SeccionCoberturaComponent } from './sections/seccion-cobertura/seccion-cobertura.component';
import { SeccionPacienteComponent } from './sections/seccion-paciente/seccion-paciente.component';
import { SeccionServicioComponent } from './sections/seccion-servicio/seccion-servicio.component';
// TODO: Resumen pendiente para el final.
// import { ResumenSolicitudComponent } from './sections/resumen-solicitud/resumen-solicitud.component';

/**
 * Página «crear solicitud» (SMART). Su única responsabilidad es ORQUESTAR:
 *  - PROVEE el `SolicitudCrearStore` a nivel de componente → su ciclo de vida es
 *    el de la pantalla (entra limpio, sin resets manuales).
 *  - Compone las secciones y las muestra de forma PROGRESIVA según los
 *    `computed` del store (`coberturaResuelta`, etc.).
 *  - Las secciones leen/escriben el store por su cuenta: aquí NO hay
 *    `@Input`/`@Output` entre ellas. La página casi no tiene lógica.
 */
@Component({
  selector: 'app-solicitud-crear',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SolicitudCrearStore],
  imports: [
    PageHeaderComponent,
    FormActionsComponent,
    ButtonComponent,
    SeccionCoberturaComponent,
    SeccionPacienteComponent,
    SeccionServicioComponent,
    // ResumenSolicitudComponent,
  ],
  templateUrl: './solicitud-crear.component.html',
})
export class SolicitudCrearComponent {
  protected readonly store = inject(SolicitudCrearStore);

  constructor() {
    // Carga de catálogos del flujo al entrar a la pantalla.
    this.store.cargarCatalogos();
  }
}
