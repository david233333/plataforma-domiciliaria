import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { IconComponent } from '../../../../../shared/ui/atoms/icon/icon.component';
import { SolicitudCrearStore } from '../../solicitud-crear.store';

/**
 * Panel de RESUMEN (aside fijo). Solo LECTURA: refleja en vivo lo que el store
 * va acumulando (paciente, plan, servicio y los datos inferidos) y, al guardar,
 * muestra el resultado. No tiene lógica: es la cara visible de los `computed`
 * del store. Ese es justo el valor de centralizar el estado.
 */
@Component({
  selector: 'app-resumen-solicitud',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, IconComponent],
  templateUrl: './resumen-solicitud.component.html',
  styleUrl: './resumen-solicitud.component.scss',
})
export class ResumenSolicitudComponent {
  protected readonly store = inject(SolicitudCrearStore);
}
