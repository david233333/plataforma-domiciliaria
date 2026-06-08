import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MaestroRepository } from '../../domain/maestros/ports/maestro.repository';
import { Ciudad } from '../../domain/maestros/entities/ciudad.entity';
import { TipoIdentificacion } from '../../domain/maestros/entities/tipo-identificacion.entity';
import { Programa } from '../../domain/maestros/entities/programa.entity';
import { TipoNovedad } from '../../domain/maestros/entities/tipo-novedad.entity';
import { ClasificacionPermanentes } from '../../domain/maestros/entities/clasificacion-permanentes.entity';
import { Profesion } from '../../domain/maestros/entities/profesion.entity';
import { CiudadDto } from './ciudad.dto';
import { TipoIdentificacionDto } from './tipo-identificacion.dto';
import { ProgramaDto } from './programa.dto';
import { TipoNovedadDto } from './tipo-novedad.dto';
import { ClasificacionPermanentesDto } from './clasificacion-permanentes.dto';
import { ProfesionDto } from './profesion.dto';
import { toCiudad } from './ciudad.mapper';
import { toTipoIdentificacion } from './tipo-identificacion.mapper';
import { toPrograma } from './programa.mapper';
import { toTipoNovedad } from './tipo-novedad.mapper';
import { toClasificacionPermanentes } from './clasificacion-permanentes.mapper';
import { toProfesion } from './profesion.mapper';
import { apiUrl } from '../http/api-url';

/**
 * Adaptador HTTP que implementa el puerto `MaestroRepository`.
 *
 * Consume el backend real bajo `/maestros/*`. La URL se arma con `apiUrl(...)`.
 * Cada respuesta DTO se convierte a la entidad de dominio con su mapper, de modo
 * que la presentación solo ve entidades.
 *
 * El manejo de errores HTTP es transversal: lo cubre `errorInterceptor`
 * (toast + re-emisión). Aquí no se traga el error; se deja propagar para que el
 * consumidor decida (p. ej. mostrar lista vacía).
 */
@Injectable()
export class MaestroHttpRepository extends MaestroRepository {
  private readonly http = inject(HttpClient);

  override consultarCiudades(): Observable<Ciudad[]> {
    return this.http
      .get<CiudadDto[]>(apiUrl('novedades', '/maestros/ciudad'))
      .pipe(map((dtos) => dtos.map(toCiudad)));
  }

  override consultarTiposIdentificacion(): Observable<TipoIdentificacion[]> {
    return this.http
      .get<TipoIdentificacionDto[]>(
        apiUrl('novedades', '/maestros/tiposIdentificacion'),
      )
      .pipe(map((dtos) => dtos.map(toTipoIdentificacion)));
  }

  override consultarProgramas(): Observable<Programa[]> {
    return this.http
      .get<ProgramaDto[]>(apiUrl('novedades', '/maestros/programas'))
      .pipe(map((dtos) => dtos.map(toPrograma)));
  }

  override consultarTiposNovedad(): Observable<TipoNovedad[]> {
    return this.http
      .get<TipoNovedadDto[]>(apiUrl('novedades', '/maestros/tiposNovedad'))
      .pipe(map((dtos) => dtos.map(toTipoNovedad)));
  }

  override consultarClasificacionesPermanentes(): Observable<
    ClasificacionPermanentes[]
  > {
    return this.http
      .get<ClasificacionPermanentesDto[]>(
        apiUrl('novedades', '/maestros/clasificacionesPermanentes'),
      )
      .pipe(map((dtos) => dtos.map(toClasificacionPermanentes)));
  }

  override consultarProfesiones(): Observable<Profesion[]> {
    return this.http
      .get<ProfesionDto[]>(apiUrl('novedades', '/maestros/profesiones'))
      .pipe(map((dtos) => dtos.map(toProfesion)));
  }
}
