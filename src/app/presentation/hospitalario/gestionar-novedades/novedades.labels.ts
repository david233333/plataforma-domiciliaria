/**
 * Etiquetas y catálogos de UI de la pantalla de novedades.
 *
 * Convención i18n (ver core/i18n/README.md): los strings y catálogos de la
 * pantalla se co-localizan aquí, no dispersos en el template/componente. Hoy son
 * catálogos estáticos de UI; si en el futuro vinieran del backend, pasarían a un
 * puerto `catalogo.repository.ts` + adaptador.
 */

/** Opción genérica para selects de PrimeNG. Tipo de UI (no de dominio). */
export interface Opcion {
  readonly label: string;
  readonly value: string;
}

// NOTA: los catálogos de ciudad, tipo de identificación, programa, clasificación
// (permanentes) y tipo de novedad ya NO son estáticos: vienen del backend vía el
// slice `maestros` (domain/maestros + infrastructure/maestros). Ver
// gestionar-novedades. Los de abajo siguen estáticos por ahora.

export const PISOS: Opcion[] = [
  { label: 'Piso 1', value: 'p1' },
  { label: 'Piso 2', value: 'p2' },
  { label: 'Piso 3', value: 'p3' },
];

export const ESTADOS: Opcion[] = [
  { label: 'Pendiente gestión', value: 'PENDIENTE_GESTION' },
  { label: 'Gestionada', value: 'GESTIONADA' },
  { label: 'En proceso', value: 'EN_PROCESO' },
  { label: 'Rechazada', value: 'RECHAZADA' },
];

export const ESPECIALIDADES: Opcion[] = [
  { label: 'Medicina general', value: 'medgen' },
  { label: 'Enfermería', value: 'enf' },
  { label: 'Fisioterapia', value: 'fisio' },
];
