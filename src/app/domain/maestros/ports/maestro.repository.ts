import { Observable } from 'rxjs';
import { Ciudad } from '../entities/ciudad.entity';
import { TipoIdentificacion } from '../entities/tipo-identificacion.entity';
import { Programa } from '../entities/programa.entity';
import { TipoNovedad } from '../entities/tipo-novedad.entity';
import { ClasificacionPermanentes } from '../entities/clasificacion-permanentes.entity';
import { Profesion } from '../entities/profesion.entity';
import { PlanSalud } from '../entities/plan-salud.entity';
import { TiposPlanParticular } from '../entities/tipos-plan-particular.entity';
import { Convenio } from '../entities/convenio.entity';

/**
 * Puerto (contrato) del repositorio de «maestros»: los catálogos compartidos
 * que alimentan filtros y formularios (ciudad, tipo de identificación, programa,
 * tipo de novedad, clasificación de permanentes, etc.).
 *
 * Es una `abstract class` (no una interface) a propósito: sirve a la vez como
 * contrato del dominio y como token de inyección de Angular DI. El cableado
 * puerto → adaptador se hace en `application/di`.
 *
 * Crece añadiendo un método por maestro nuevo. TypeScript puro: solo depende de
 * `rxjs` (permitido en domain) y de entidades.
 */
export abstract class MaestroRepository {
  abstract consultarCiudades(): Observable<Ciudad[]>;
  abstract consultarTiposIdentificacion(): Observable<TipoIdentificacion[]>;
  abstract consultarProgramas(): Observable<Programa[]>;
  abstract consultarTiposNovedad(): Observable<TipoNovedad[]>;
  abstract consultarClasificacionesPermanentes(): Observable<
    ClasificacionPermanentes[]
  >;
  abstract consultarProfesiones(): Observable<Profesion[]>;
  abstract consultarPlanesSalud(): Observable<PlanSalud[]>;
  abstract consultarTiposPlanParticular(): Observable<TiposPlanParticular[]>;
  abstract consultarConvenios(): Observable<Convenio[]>;
}
