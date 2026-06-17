import { Observable, shareReplay } from 'rxjs';
import { Ciudad } from '../entities/ciudad.entity';
import { TipoIdentificacion } from '../entities/tipo-identificacion.entity';
import { Programa } from '../entities/programa.entity';
import { TipoNovedad } from '../entities/tipo-novedad.entity';
import { ClasificacionPermanentes } from '../entities/clasificacion-permanentes.entity';
import { Profesion } from '../entities/profesion.entity';
import { PlanSalud } from '../entities/plan-salud.entity';
import { TiposPlanParticular } from '../entities/tipos-plan-particular.entity';
import { Convenio } from '../entities/convenio.entity';
import { MaestroRepository } from '../ports/maestro.repository';

/**
 * Facade ÚNICO de casos de uso de «maestros» (catálogos compartidos).
 *
 * En vez de un caso de uso por catálogo, este facade concentra TODAS las
 * consultas de maestros. Al agregar un maestro nuevo solo se añade un método
 * aquí (y otro en `MaestroRepository`); el cableado de DI no cambia.
 *
 * Clase TypeScript pura. Recibe el puerto por CONSTRUCTOR (en domain no usamos
 * `inject()` para no acoplar a Angular). Se expone a la DI por factory en
 * `application/di`.
 *
 * CACHÉ: los maestros casi nunca cambian, así que cada catálogo se pide al
 * backend UNA sola vez por vida del facade y las siguientes llamadas reutilizan
 * el mismo flujo (`shareReplay(1)`). Solo aplica a maestros SIN parámetros; los
 * que dependan de un argumento no deben cachearse así (la llave cambiaría).
 */
export class MaestrosUseCase {
  private ciudades$?: Observable<Ciudad[]>;
  private tiposIdentificacion$?: Observable<TipoIdentificacion[]>;
  private programas$?: Observable<Programa[]>;
  private tiposNovedad$?: Observable<TipoNovedad[]>;
  private clasificacionesPermanentes$?: Observable<ClasificacionPermanentes[]>;
  private profesiones$?: Observable<Profesion[]>;
  private planesSalud$?: Observable<PlanSalud[]>;
  private tiposPlanParticular$?: Observable<TiposPlanParticular[]>;
  private convenios$?: Observable<Convenio[]>;

  constructor(private readonly repositorio: MaestroRepository) {}

  consultarCiudades(): Observable<Ciudad[]> {
    this.ciudades$ ??= this.repositorio
      .consultarCiudades()
      .pipe(shareReplay(1));
    return this.ciudades$;
  }

  consultarTiposIdentificacion(): Observable<TipoIdentificacion[]> {
    this.tiposIdentificacion$ ??= this.repositorio
      .consultarTiposIdentificacion()
      .pipe(shareReplay(1));
    return this.tiposIdentificacion$;
  }

  consultarProgramas(): Observable<Programa[]> {
    this.programas$ ??= this.repositorio
      .consultarProgramas()
      .pipe(shareReplay(1));
    return this.programas$;
  }

  consultarTiposNovedad(): Observable<TipoNovedad[]> {
    this.tiposNovedad$ ??= this.repositorio
      .consultarTiposNovedad()
      .pipe(shareReplay(1));
    return this.tiposNovedad$;
  }

  consultarClasificacionesPermanentes(): Observable<ClasificacionPermanentes[]> {
    this.clasificacionesPermanentes$ ??= this.repositorio
      .consultarClasificacionesPermanentes()
      .pipe(shareReplay(1));
    return this.clasificacionesPermanentes$;
  }

  consultarProfesiones(): Observable<Profesion[]> {
    this.profesiones$ ??= this.repositorio
      .consultarProfesiones()
      .pipe(shareReplay(1));
    return this.profesiones$;
  }

  consultarPlanesSalud(): Observable<PlanSalud[]> {
    this.planesSalud$ ??= this.repositorio
      .consultarPlanesSalud()
      .pipe(shareReplay(1));
    return this.planesSalud$;
  }

  consultarTiposPlanParticular(): Observable<TiposPlanParticular[]> {
    this.tiposPlanParticular$ ??= this.repositorio
      .consultarTiposPlanParticular()
      .pipe(shareReplay(1));
    return this.tiposPlanParticular$;
  }

  consultarConvenios(): Observable<Convenio[]> {
    this.convenios$ ??= this.repositorio
      .consultarConvenios()
      .pipe(shareReplay(1));
    return this.convenios$;
  }
}
