import { inject, Provider } from '@angular/core';
import { SolicitudRepository } from '../../domain/no-hospitalario/solicitud/ports/solicitud.repository';
import { SolicitudHttpRepository } from '../../infrastructure/no-hospitalario/solicitud/solicitud-http.repository';
import { SolicitudUseCase } from '../../domain/no-hospitalario/solicitud/use-cases/solicitud.use-case';

/**
 * Cableado de DI del slice `solicitud` (crear solicitud no hospitalaria).
 * Registra:
 *  - puerto → adaptador (SolicitudRepository → SolicitudHttpRepository)
 *  - el caso de uso (TS puro) expuesto a la DI por FACTORY, para no acoplar el
 *    dominio a Angular.
 *
 * Se registra en los `providers` de la ruta lazy de la feature (aislamiento),
 * de modo que la presentación pueda `inject(SolicitudUseCase)` directo. El
 * SignalStore de la pantalla consume ese caso de uso.
 */
export function provideSolicitud(): Provider[] {
  return [
    { provide: SolicitudRepository, useClass: SolicitudHttpRepository },
    {
      provide: SolicitudUseCase,
      useFactory: () => new SolicitudUseCase(inject(SolicitudRepository)),
    },
  ];
}
