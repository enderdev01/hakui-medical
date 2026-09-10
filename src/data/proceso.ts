import type { PasoDelProceso, Valor } from './tipos';

/** Los tres pasos van numerados porque son una secuencia real, no una lista. */
export const proceso = [
  {
    titulo: 'Cuentas qué sientes',
    descripcion:
      'En tus palabras o respondiendo tres preguntas. Sin historia clínica en este punto.',
    ilustracion: 'formulario',
  },
  {
    titulo: 'Te mostramos la cita',
    descripcion: 'Especialidad, profesional, consultorio, horario y valor antes de confirmar.',
    ilustracion: 'calendario',
  },
  {
    titulo: 'Vienes y te atienden',
    descripcion:
      'Llegas con la cita agendada y la orden lista. Si hay que derivarte, sale de la consulta.',
    ilustracion: 'consulta',
  },
] satisfies PasoDelProceso[];

/** Cinta de valores. Se duplica en la vista para el bucle; acá va una sola vez. */
export const valores = [
  { texto: 'Citas el mismo día' },
  { texto: 'Coberturas básicas' },
  { texto: 'Laboratorio en la sede' },
  { texto: 'Historia clínica digital' },
  { texto: 'Atención pediátrica' },
] satisfies Valor[];
