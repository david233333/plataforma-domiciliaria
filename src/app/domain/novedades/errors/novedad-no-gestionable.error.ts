import { DomainError } from '../../shared/domain-error';

/**
 * Se lanza al intentar gestionar una novedad cuyo estado no lo permite
 * (regla de negocio: solo las PENDIENTE_GESTION son gestionables).
 */
export class NovedadNoGestionableError extends DomainError {
  constructor(public readonly idNovedad: string) {
    super(`La novedad ${idNovedad} no puede gestionarse en su estado actual.`);
  }
}
