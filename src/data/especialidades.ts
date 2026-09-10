import type { Especialidad } from './tipos';

/**
 * Las seis áreas que atiende la clínica.
 *
 * Los precios son de referencia y están inventados para la demostración.
 * El orden es el que se muestra en la landing y en el menú móvil.
 */
export const especialidades = [
  {
    id: 'general',
    nombre: 'Medicina general',
    nombreCorto: 'Medicina general',
    descripcion: 'Chequeos, certificados médicos y todo lo que todavía no tiene nombre.',
    icono: 'estetoscopio',
    desde: 24500,
    consultorio: 'Consultorio 2 · planta baja',
  },
  {
    id: 'orl',
    nombre: 'Otorrinolaringología',
    nombreCorto: 'Otorrino',
    descripcion: 'Oídos, nariz y garganta: dolor de oído, sinusitis, vértigo y audiometrías.',
    icono: 'oido',
    desde: 31800,
    consultorio: 'Consultorio 4 · primer piso',
  },
  {
    id: 'pediatria',
    nombre: 'Pediatría',
    nombreCorto: 'Pediatría',
    descripcion: 'Controles de crecimiento, cartilla de vacunación y consultas del día.',
    icono: 'bebe',
    desde: 27200,
    consultorio: 'Consultorio 1 · planta baja',
  },
  {
    id: 'oncologia',
    nombre: 'Oncología',
    nombreCorto: 'Oncología',
    descripcion: 'Primera consulta, seguimiento y coordinación con el centro de referencia.',
    icono: 'lazo',
    desde: 46900,
    consultorio: 'Consultorio 7 · primer piso',
  },
  {
    id: 'gastro',
    nombre: 'Gastroenterología',
    nombreCorto: 'Gastroenterología',
    descripcion: 'Acidez, dolor abdominal, reflujo, colon irritable y estudios digestivos.',
    icono: 'estomago',
    desde: 34600,
    consultorio: 'Consultorio 5 · primer piso',
  },
  {
    id: 'laboratorio',
    nombre: 'Laboratorio y estudios',
    nombreCorto: 'Laboratorio',
    descripcion: 'Extracción sin cita previa de 7 a 10 y resultados online en 48 horas.',
    icono: 'matraz',
    desde: 18300,
    consultorio: 'Laboratorio · planta baja',
  },
] satisfies Especialidad[];
