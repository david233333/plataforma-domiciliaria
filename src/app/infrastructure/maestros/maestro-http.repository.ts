import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MaestroRepository } from '../../domain/maestros/ports/maestro.repository';
import { Ciudad } from '../../domain/maestros/entities/ciudad.entity';
import { CiudadDto } from './ciudad.dto';
import { toCiudad } from './ciudad.mapper';
import { apiUrl } from '../http/api-url';

/**
 * Adaptador HTTP que implementa el puerto `MaestroRepository`.
 *
 * A diferencia de los adaptadores que aún devuelven mock, este SÍ consume el
 * backend real (`GET /maestros/ciudad`). La URL se arma con `apiUrl('maestros',
 * …)` desde `environment.apis.maestros`. Convierte cada `CiudadDto` a la entidad
 * de dominio con el mapper, de modo que la presentación solo ve `Ciudad`.
 *
 * El manejo de errores HTTP es transversal: lo cubre `errorInterceptor`
 * (toast + re-emisión). Aquí no se traga el error; se deja propagar para que el
 * consumidor decida (p. ej. mostrar lista vacía).
 */
@Injectable()
export class MaestroHttpRepository extends MaestroRepository {
  private readonly http = inject(HttpClient);

  override consultarCiudades(): Observable<Ciudad[]> {
    return this.http.get<CiudadDto[]>(apiUrl('novedades', '/maestros/ciudad'))
      .pipe(map((dtos) => dtos.map(toCiudad)));
  }
}
