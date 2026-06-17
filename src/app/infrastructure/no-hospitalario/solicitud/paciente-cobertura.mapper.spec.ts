import { toPacienteCobertura } from './paciente-cobertura.mapper';
import { PacienteCoberturaDto } from './paciente-cobertura.dto';

describe('paciente-cobertura.mapper (DTO → Entity)', () => {
  const dto: PacienteCoberturaDto = {
    idRemisionPK: 'R-001',
    tipoIdentificacion: {
      id: '1',
      idTipo: 'CC',
      nombre: 'Cédula de ciudadanía',
      codigoPos: 'POS-01',
      codigoSura: 'SURA-01',
    },
    numeroIdentificacion: '1121939862',
    nombre: 'María Camila',
    apellido: 'González Pérez',
    fechaNacimiento: '1990-04-12T00:00:00.000Z',
    edad: '36',
    unidadEdad: 'años',
    sexo: 'F',
    estadoCivil: 'Soltera',
    ocupacion: 'Ingeniera',
    email: 'maria.gonzalez@example.com',
    tipoAsegurador: 'EPS',
    estadoSuspension: 'ACTIVO',
    coberturaDomiciliaria: true,
    fechaLimiteCobertura: '2027-06-30T00:00:00.000Z',
    tipoAfiliacion: {
      id: '1',
      nombre: 'POS',
      nombreAseguradora: 'EPS Sura',
      idPlan: 'PL-01',
    },
    convenios: [
      {
        planContrato: 'PC-01',
        codigoRamo: 'R-100',
        tipoRamo: 'Salud',
        descripcionPlanContrato: 'Plan empresarial',
        tipoPlanPac: 'PAC-A',
        numeroPlan: '12345',
        codigoProducto: 'PROD-9',
        anexoUrgencias: true,
        anexoConsultaExterna: false,
        anexoAtencionDomiciliaria: true,
        fechaInicioVigenciaAsegurado: '2026-01-01T00:00:00.000Z',
        fechaFinVigenciaAsegurado: '2026-12-31T00:00:00.000Z',
        numeroContrato: 'CT-7788',
        tieneCoberturaDomiciliaria: true,
        fechaLimiteCobertura: '2027-06-30T00:00:00.000Z',
      },
    ],
    nivelIngreso: '3',
    ipsBasicaAsignada: 'IPS Norte',
    lugarAtencion: 'Domicilio',
    codigoARL: 'ARL-1',
    peso: '60',
    medidaDepeso: 'kg',
    tipoPlanParticular: {
      id: '1',
      idTipoPlanParticular: 'TPP-01',
      descripcion: 'Particular empresa',
      nit: '900123456-7',
    },
    nombrePersonaAutoriza: 'Juan Pérez',
    codigoSiniestro: 'S-01',
    priorizacion: 'Alta',
    esEditable: true,
    fechaInicioSintomas: '2026-06-01',
    fechaConsultaMedica: '2026-06-02',
    fechaTomaMuestra: '2026-06-03',
    tipoCasoCovid: 'N/A',
    encounterId: 'ENC-1',
    resultadoAyudasDiagnosticas: 'Pendiente',
    integracion: 'OK',
    observacion: 'Sin novedad',
    embarazada: 'No',
    oxigenoDependiente: 'No',
    pacienteSinFechaNacimiento: 'No',
    medicoCreadorTipo: 'CC',
    medicoCreadorNumero: '999',
    codigoSexo: 'F',
    descSexo: 'Femenino',
    codigoPlan: 'PL-01',
    descPlan: 'POS',
    descMunicipio: 'Medellín',
    codigoDaneMunicipio: '05001',
    descDepartamento: 'Antioquia',
    codigoDaneDpto: '05',
    PAC: false,
    subNivel: 2,
    vacunacion: 'Completa',
    celular: '3001234567',
    telefono: '6041234567',
    tienePoliza: false,
    tienePac: false,
    tienePOS: true,
    tieneArl: false,
  };

  it('mapea los objetos anidados reusando los mappers de maestro', () => {
    const paciente = toPacienteCobertura(dto);

    expect(paciente.tipoIdentificacion).toEqual(dto.tipoIdentificacion);
    expect(paciente.tipoAfiliacion).toEqual(dto.tipoAfiliacion);
    expect(paciente.tipoPlanParticular).toEqual(dto.tipoPlanParticular);
    expect(paciente.convenios).toHaveLength(1);
    expect(paciente.convenios[0].planContrato).toBe('PC-01');
  });

  it('convierte las fechas de cabecera a Date', () => {
    const paciente = toPacienteCobertura(dto);

    expect(paciente.fechaNacimiento).toBeInstanceOf(Date);
    expect(paciente.fechaLimiteCobertura).toBeInstanceOf(Date);
    expect(paciente.fechaNacimiento!.toISOString()).toBe(
      '1990-04-12T00:00:00.000Z',
    );
    // El convenio anidado también convierte sus fechas a Date.
    expect(paciente.convenios[0].fechaInicioVigenciaAsegurado).toBeInstanceOf(
      Date,
    );
  });

  it('copia los campos planos relevantes', () => {
    const paciente = toPacienteCobertura(dto);

    expect(paciente).toMatchObject({
      numeroIdentificacion: '1121939862',
      nombre: 'María Camila',
      apellido: 'González Pérez',
      coberturaDomiciliaria: true,
      tienePOS: true,
      subNivel: 2,
    });
  });

  it('es defensivo cuando el backend responde null en muchos campos', () => {
    // DTO casi vacío: todos los nullables en null.
    const dtoNulo = {
      idRemisionPK: null,
      tipoIdentificacion: null,
      numeroIdentificacion: '1121939862',
      nombre: null,
      apellido: null,
      fechaNacimiento: null,
      edad: null,
      unidadEdad: null,
      sexo: null,
      estadoCivil: null,
      ocupacion: null,
      email: null,
      tipoAsegurador: null,
      estadoSuspension: null,
      coberturaDomiciliaria: null,
      fechaLimiteCobertura: null,
      tipoAfiliacion: null,
      convenios: null,
      nivelIngreso: null,
      ipsBasicaAsignada: null,
      lugarAtencion: null,
      codigoARL: null,
      peso: null,
      medidaDepeso: null,
      tipoPlanParticular: null,
      nombrePersonaAutoriza: null,
      codigoSiniestro: null,
      priorizacion: null,
      esEditable: null,
      fechaInicioSintomas: null,
      fechaConsultaMedica: null,
      fechaTomaMuestra: null,
      tipoCasoCovid: null,
      encounterId: null,
      resultadoAyudasDiagnosticas: null,
      integracion: null,
      observacion: null,
      embarazada: null,
      oxigenoDependiente: null,
      pacienteSinFechaNacimiento: null,
      medicoCreadorTipo: null,
      medicoCreadorNumero: null,
      codigoSexo: null,
      descSexo: null,
      codigoPlan: null,
      descPlan: null,
      descMunicipio: null,
      codigoDaneMunicipio: null,
      descDepartamento: null,
      codigoDaneDpto: null,
      PAC: null,
      subNivel: null,
      vacunacion: null,
      celular: null,
      telefono: null,
      tienePoliza: null,
      tienePac: null,
      tienePOS: null,
      tieneArl: null,
    } satisfies PacienteCoberturaDto;

    const paciente = toPacienteCobertura(dtoNulo);

    // Objetos anidados, fechas y subNivel quedan en null (no revientan).
    expect(paciente.tipoIdentificacion).toBeNull();
    expect(paciente.tipoAfiliacion).toBeNull();
    expect(paciente.tipoPlanParticular).toBeNull();
    expect(paciente.fechaNacimiento).toBeNull();
    expect(paciente.fechaLimiteCobertura).toBeNull();
    expect(paciente.subNivel).toBeNull();
    // Normalizados por el mapper.
    expect(paciente.convenios).toEqual([]);
    expect(paciente.nombre).toBe('');
    expect(paciente.tienePOS).toBe(false);
    expect(paciente.coberturaDomiciliaria).toBe(false);
    // Lo que sí vino se conserva.
    expect(paciente.numeroIdentificacion).toBe('1121939862');
  });
});
