import { inject, Provider } from '@angular/core';
import { MaestroRepository } from '../../domain/maestros/ports/maestro.repository';
import { MaestroHttpRepository } from '../../infrastructure/maestros/maestro-http.repository';
import { MaestrosUseCase } from '../../domain/maestros/use-cases/maestros.use-case';

/**
 * Cableado de DI del slice `maestros` (catálogos compartidos). Registra:
 *  - puerto → adaptador (MaestroRepository → MaestroHttpRepository)
 *  - el facade ÚNICO de casos de uso (TS puro) expuesto por FACTORY, para no
 *    acoplar el dominio a Angular.
 *
 * NO crece al añadir maestros: los nuevos catálogos se agregan como métodos en
 * `MaestrosUseCase` y `MaestroRepository`, no como providers nuevos.
 *
 * Se registra en los `providers` de la(s) ruta(s) que consumen catálogos. Si más
 * pantallas lo necesitan, puede subirse a `app.config` como provider root.
 */
export function provideMaestros(): Provider[] {
  return [
    { provide: MaestroRepository, useClass: MaestroHttpRepository },
    {
      provide: MaestrosUseCase,
      useFactory: () => new MaestrosUseCase(inject(MaestroRepository)),
    },
  ];
}
