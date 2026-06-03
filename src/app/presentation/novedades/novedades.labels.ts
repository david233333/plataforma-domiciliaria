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

export const CIUDADES: Opcion[] = [
  { label: 'Medellín', value: 'med' },
  { label: 'Bogotá', value: 'bog' },
  { label: 'Cali', value: 'cal' },
];

export const TIPOS_IDENTIFICACION: Opcion[] = [
  { label: 'Cédula de ciudadanía', value: 'cc' },
  { label: 'Tarjeta de identidad', value: 'ti' },
  { label: 'Pasaporte', value: 'pa' },
];

export const PROGRAMAS: Opcion[] = [
  { label: 'Hospitalización domiciliaria', value: 'hosp' },
  { label: 'Cuidado paliativo', value: 'pal' },
  { label: 'Rehabilitación', value: 'rehab' },
];

export const CLASIFICACIONES: Opcion[] = [
  { label: 'Permanente', value: 'perm' },
  { label: 'Temporal', value: 'temp' },
];

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

export const TIPOS_NOVEDAD: Opcion[] = [
  { label: 'Activación', value: 'ACTIVACION' },
  { label: 'Cambio de cita', value: 'CAMBIO_CITA' },
  { label: 'Cancelación', value: 'CANCELACION' },
];

export const ESPECIALIDADES: Opcion[] = [
  { label: 'Medicina general', value: 'medgen' },
  { label: 'Enfermería', value: 'enf' },
  { label: 'Fisioterapia', value: 'fisio' },
];
