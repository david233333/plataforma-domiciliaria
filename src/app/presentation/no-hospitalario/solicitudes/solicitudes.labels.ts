/**
 * Etiquetas, catálogos y tipos de UI de la pantalla de Solicitudes.
 *
 * Convención i18n del proyecto (ver core/i18n/README.md): los strings, catálogos
 * y tipos de presentación de la pantalla se co-localizan aquí, no dispersos en el
 * template/componente. Hoy son datos estáticos de ejemplo (esta pantalla es de
 * diseño): cuando exista el slice de dominio `solicitudes`, la entidad y la
 * consulta se moverán a `domain/solicitudes` + su adaptador.
 */

/** Opción genérica para selects de PrimeNG. Tipo de UI (no de dominio). */
export interface Opcion {
  readonly label: string;
  readonly value: string;
}

/** Estado del ciclo de vida de una solicitud (cosmética de presentación). */
export type EstadoSolicitud =
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'FINALIZADA'
  | 'CANCELADA';

/** Prioridad de atención de la solicitud. */
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';

/** Fila de la tabla de solicitudes. Tipo de presentación (aún sin dominio). */
export interface Solicitud {
  readonly tipoServicio: string;
  readonly idSolicitud: string;
  readonly fechaFinalizacion: Date | null;
  readonly paciente: string;
  readonly planSalud: string;
  readonly prioridad: Prioridad;
  readonly estado: EstadoSolicitud;
  readonly visita: string;
  readonly usuario: string;
}

/**
 * Datos de ejemplo. La búsqueda (mock) los devuelve para que la tabla, los
 * badges y las acciones se vean funcionando. Al integrar el backend, esto lo
 * reemplaza el caso de uso de dominio.
 */
export const SOLICITUDES_DEMO: Solicitud[] = [
  {
    tipoServicio: 'Enfermería',
    idSolicitud: 'SOL-100245',
    fechaFinalizacion: new Date(2026, 5, 12, 16, 30),
    paciente: 'María Restrepo Gómez',
    planSalud: 'Plan Complementario',
    prioridad: 'ALTA',
    estado: 'PENDIENTE',
    visita: 'Domiciliaria',
    usuario: 'jlopez',
  },
  {
    tipoServicio: 'Fisioterapia',
    idSolicitud: 'SOL-100246',
    fechaFinalizacion: new Date(2026, 5, 13, 9, 0),
    paciente: 'Carlos Andrés Mejía',
    planSalud: 'Medicina Prepagada',
    prioridad: 'MEDIA',
    estado: 'EN_PROCESO',
    visita: 'Telemedicina',
    usuario: 'aramirez',
  },
  {
    tipoServicio: 'Medicina general',
    idSolicitud: 'SOL-100247',
    fechaFinalizacion: new Date(2026, 5, 11, 14, 15),
    paciente: 'Luisa Fernanda Ríos',
    planSalud: 'EPS',
    prioridad: 'BAJA',
    estado: 'FINALIZADA',
    visita: 'Domiciliaria',
    usuario: 'mtorres',
  },
  {
    tipoServicio: 'Terapia respiratoria',
    idSolicitud: 'SOL-100248',
    fechaFinalizacion: null,
    paciente: 'Jorge Eliécer Pérez',
    planSalud: 'Plan Complementario',
    prioridad: 'ALTA',
    estado: 'CANCELADA',
    visita: 'Domiciliaria',
    usuario: 'jlopez',
  },
];

/**
 * Detalle ampliado de una solicitud (lo que muestra el modal). Tipo de
 * presentación: cuando exista el slice de dominio `solicitudes`, la entidad y la
 * consulta se moverán a `domain/solicitudes` + su adaptador.
 */
export interface SolicitudDetalle {
  readonly idSolicitud: string;
  // Datos básicos
  readonly tipoDocumento: string;
  readonly numeroDocumento: string;
  readonly planSalud: string;
  readonly tieneAnexoDomiciliario: boolean;
  readonly fechaInicioAsegurado: Date;
  readonly fechaFinAsegurado: Date;
  readonly descripcionPlan: string;
  // Información del usuario
  readonly nombres: string;
  readonly apellidos: string;
  readonly fechaNacimiento: Date;
  readonly edad: number;
  readonly sexo: string;
  readonly celular: string;
  readonly telefono: string;
  readonly email: string;
  // Datos de atención
  readonly ciudad: string;
  readonly municipio: string;
  readonly direccion: string;
  readonly barrio: string;
  readonly informacionComplementaria: string;
  // Datos del servicio
  readonly tipoServicio: string;
  readonly tipoPrestacion: string;
  readonly tipoConducta: string;
  readonly programa: string;
  readonly zona: string;
  readonly fechaVisita: Date;
  readonly prioridad: string;
  readonly sla: number;
  readonly tipoConvenio: string;
  readonly copago: number;
  readonly gestionAdmision: string;
  // Estado y cancelación
  readonly estado: EstadoSolicitud;
  readonly cancelacion: CancelacionInfo | null;
}

/** Información de la cancelación de una visita (presente solo si ya se canceló). */
export interface CancelacionInfo {
  readonly motivo: string;
  readonly observacion: string;
  readonly usuario: string;
  readonly fecha: Date;
}

/** Catálogo (UI) de motivos de cancelación de una visita. */
export const MOTIVOS_CANCELACION: Opcion[] = [
  { label: 'Paciente no desea recibir la atención', value: 'no-desea' },
  { label: 'Paciente se dirige a urgencias', value: 'urgencias' },
  { label: 'Datos de contacto errados', value: 'datos-errados' },
  { label: 'Paciente fuera de cobertura', value: 'fuera-cobertura' },
  { label: 'Solicitud duplicada', value: 'duplicada' },
  { label: 'Otro motivo', value: 'otro' },
];

/**
 * Detalle de ejemplo (data quemada) para el modal. Se siembra con algunos campos
 * de la fila clicada (id, plan de salud y nombre del paciente) para que se sienta
 * conectado; el resto es fijo. Al integrar el backend, esto lo reemplaza el caso
 * de uso de dominio.
 */
export function crearDetalleDemo(solicitud: Solicitud): SolicitudDetalle {
  const [primerNombre, ...resto] = solicitud.paciente.split(' ');
  return {
    idSolicitud: solicitud.idSolicitud,
    tipoDocumento: 'Registro civil',
    numeroDocumento: '1013387705',
    planSalud: solicitud.planSalud,
    tieneAnexoDomiciliario: true,
    fechaInicioAsegurado: new Date(2025, 8, 4),
    fechaFinAsegurado: new Date(2026, 6, 18),
    descripcionPlan: 'PLAN SALUD PARA TODOS FAMILIAR - 3 | PREFERENCIAL',
    nombres: primerNombre ?? solicitud.paciente,
    apellidos: resto.join(' '),
    fechaNacimiento: new Date(2025, 7, 6),
    edad: 0,
    sexo: 'Masculino',
    celular: '3012885548',
    telefono: '3005486334',
    email: 'saramelisa336@gmail.com',
    // Datos de atención
    ciudad: 'Medellín',
    municipio: 'Santa Elena',
    direccion: 'CL 53A # 35 ESTE - 547',
    barrio: 'Santa Elena',
    informacionComplementaria: 'Casa Fink / Santa Elena - por la montaña mágica',
    // Datos del servicio
    tipoServicio: 'Emergencias médicas a domicilio',
    tipoPrestacion: 'Atención médica domiciliaria',
    tipoConducta: 'Prioritaria',
    programa: 'Emergencias médicas a domicilio',
    zona: 'Emergencias Médicas Centro',
    fechaVisita: new Date(2026, 5, 11, 0, 41, 43),
    prioridad: '3',
    sla: 360,
    tipoConvenio: 'Cápita',
    copago: 19400,
    gestionAdmision:
      'MC: «Tiene fiebre y vómito». Se comunica la madre del paciente, quien ' +
      'consulta por cuadro clínico de 3 horas de evolución caracterizado por ' +
      'emesis #3, fiebre 38 °C, escalofrío y refiere disnea. Niega palidez, ' +
      'cianosis, retracciones y otros síntomas. AP: niega. Alergias: niega. ' +
      'P3: su atención será prestada en máximo 360 minutos.',
    // Estado y cancelación: la razón solo existe si la solicitud está cancelada.
    estado: solicitud.estado,
    cancelacion:
      solicitud.estado === 'CANCELADA'
        ? {
            motivo: 'Paciente no desea recibir la atención',
            observacion: 'Refiere que el paciente se dirige a urgencias.',
            usuario: 'sarapapt',
            fecha: new Date(2026, 5, 11, 0, 42),
          }
        : null,
  };
}
