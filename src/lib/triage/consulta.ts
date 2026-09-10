import { especialidades, horariosPorUrgencia } from '@data/index';
import type { AreaClinica, PerfilPaciente, Urgencia } from '@data/tipos';

export interface ConsultaSugerida {
  especialidad: string;
  detalle: string;
  duracion: number;
  precio: number;
  consultorio: string;
  horario: string;
}

/** Lo que cambia respecto de la ficha base de la especialidad. */
const detalles: Record<AreaClinica, { detalle: string; duracion: number }> = {
  general: {
    detalle: 'Una consulta general para ordenar el cuadro y pedir lo que haga falta.',
    duracion: 30,
  },
  orl: {
    detalle: 'Consulta con otoscopía en el momento y audiometría si hace falta.',
    duracion: 35,
  },
  pediatria: {
    detalle: 'Control de crecimiento y revisión de la cartilla de vacunación.',
    duracion: 30,
  },
  oncologia: {
    detalle: 'Primera consulta con revisión de estudios previos y plan de seguimiento.',
    duracion: 50,
  },
  gastro: {
    detalle: 'Revisión del cuadro digestivo y plan de estudios si corresponde.',
    duracion: 35,
  },
  laboratorio: {
    detalle: 'Extracción sin cita previa de 7 a 10 y resultados cargados online en 48 horas.',
    duracion: 20,
  },
};

/**
 * Un menor va a pediatría aunque su síntoma caiga en otra área, salvo que se
 * trate de un seguimiento oncológico o un pedido de estudios, que no dependen
 * de la edad.
 */
function areaEfectiva(area: AreaClinica, perfil: PerfilPaciente): AreaClinica {
  if (perfil !== 'nino') return area;
  if (area === 'oncologia' || area === 'laboratorio') return area;
  return 'pediatria';
}

export function consultaPara(
  area: AreaClinica,
  perfil: PerfilPaciente,
  urgencia: Urgencia,
): ConsultaSugerida {
  const efectiva = areaEfectiva(area, perfil);
  const especialidad = especialidades.find((item) => item.id === efectiva) ?? especialidades[0]!;
  const extra = detalles[efectiva];

  const esControlIntegral = efectiva === 'general' && perfil === 'mayor';

  return {
    especialidad: esControlIntegral
      ? `${especialidad.nombre} · control integral`
      : especialidad.nombre,
    detalle: esControlIntegral
      ? 'Chequeo ampliado con revisión de medicación, presión y estudios de rutina.'
      : extra.detalle,
    duracion: esControlIntegral ? 45 : extra.duracion,
    precio: esControlIntegral ? 29800 : especialidad.desde,
    consultorio: especialidad.consultorio,
    horario: horariosPorUrgencia[urgencia],
  };
}
