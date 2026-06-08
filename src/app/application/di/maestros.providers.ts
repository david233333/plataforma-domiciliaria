import { inject, Provider } from '@angular/core';
import { MaestroRepository } from '../../domain/maestros/ports/maestro.repository';
import { MaestroHttpRepository } from '../../infrastructure/maestros/maestro-http.repository';
import { ConsultarCiudadesUseCase } from '../../domain/maestros/use-cases/consultar-ciudades.use-case';

/**
 * Cableado de DI del slice `maestros` (catálogos compartidos). Registra:
 *  - puerto → adaptador (MaestroRepository → MaestroHttpRepository)
 *  - los casos de uso (TS puro) expuestos a la DI por FACTORY, para no acoplar
 *    el dominio a Angular.
 *
 * Se registra en los `providers` de la(s) ruta(s) que consumen catálogos. Si más
 * pantallas lo necesitan, puede subirse a `app.config` como provider root.
 */
export function provideMaestros(): Provider[] {
  return [
    { provide: MaestroRepository, useClass: MaestroHttpRepository },
    {
      provide: ConsultarCiudadesUseCase,
      useFactory: () => new ConsultarCiudadesUseCase(inject(MaestroRepository)),
    },
  ];
}
