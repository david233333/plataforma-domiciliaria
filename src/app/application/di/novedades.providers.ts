import { inject, Provider } from '@angular/core';
import { NovedadRepository } from '../../domain/novedades/ports/novedad.repository';
import { NovedadHttpRepository } from '../../infrastructure/novedades/novedad-http.repository';
import { BuscarNovedadesUseCase } from '../../domain/novedades/use-cases/buscar-novedades.use-case';
import { GestionarNovedadUseCase } from '../../domain/novedades/use-cases/gestionar-novedad.use-case';

/**
 * Cableado de DI del slice `novedades`. Registra:
 *  - puerto → adaptador (NovedadRepository → NovedadHttpRepository)
 *  - los casos de uso (TS puro) expuestos a la DI por FACTORY, para no acoplar
 *    el dominio a Angular.
 *
 * Se registra en los `providers` de la ruta lazy de novedades (aislamiento),
 * de modo que la presentación pueda `inject(BuscarNovedadesUseCase)` directo,
 * SIN facade.
 */
export function provideNovedades(): Provider[] {
  return [
    { provide: NovedadRepository, useClass: NovedadHttpRepository },
    {
      provide: BuscarNovedadesUseCase,
      useFactory: () => new BuscarNovedadesUseCase(inject(NovedadRepository)),
    },
    {
      provide: GestionarNovedadUseCase,
      useFactory: () => new GestionarNovedadUseCase(inject(NovedadRepository)),
    },
  ];
}
