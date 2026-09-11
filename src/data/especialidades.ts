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
    desde: 70,
    consultorio: 'Consultorio 2 · planta baja',
    profesional: 'Dr. Aníbal Rojas · CMP 52104',
  },
  {
    id: 'orl',
    nombre: 'Otorrinolaringología',
    nombreCorto: 'Otorrino',
    descripcion: 'Oídos, nariz y garganta: dolor de oído, sinusitis, vértigo y audiometrías.',
    icono: 'oido',
    desde: 120,
    consultorio: 'Consultorio 4 · primer piso',
    profesional: 'Dra. Paula Quintanilla · CMP 47338',
  },
  {
    id: 'pediatria',
    nombre: 'Pediatría',
    nombreCorto: 'Pediatría',
    descripcion: 'Controles de crecimiento, cartilla de vacunación y consultas del día.',
    icono: 'bebe',
    desde: 90,
    consultorio: 'Consultorio 1 · planta baja',
    profesional: 'Dra. Rocío Delgado · CMP 51920',
  },
  {
    id: 'oncologia',
    nombre: 'Oncología',
    nombreCorto: 'Oncología',
    descripcion: 'Primera consulta, seguimiento y coordinación con el centro de referencia.',
    icono: 'lazo',
    desde: 220,
    consultorio: 'Consultorio 7 · primer piso',
    profesional: 'Dr. Martín Okamura · CMP 39875',
  },
  {
    id: 'gastro',
    nombre: 'Gastroenterología',
    nombreCorto: 'Gastro',
    descripcion: 'Acidez, dolor abdominal, reflujo, colon irritable y estudios digestivos.',
    icono: 'estomago',
    desde: 130,
    consultorio: 'Consultorio 5 · primer piso',
    profesional: 'Dr. Sebastián Prieto · CMP 46012',
  },
  {
    id: 'laboratorio',
    nombre: 'Laboratorio y estudios',
    nombreCorto: 'Laboratorio',
    descripcion: 'Extracción sin cita previa de 7 a 10 y resultados online en 48 horas.',
    icono: 'matraz',
    desde: 85,
    consultorio: 'Laboratorio · planta baja',
    profesional: 'Lic. Andrea Chávez · CTMP 12043',
  },
] satisfies Especialidad[];
