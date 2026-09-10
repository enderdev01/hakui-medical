import type { AreaClinica, PerfilPaciente, Urgencia } from '@data/tipos';

/**
 * Las tres preguntas cerradas, para quien prefiere no escribir.
 *
 * Llegan al mismo resultado que el modo de texto libre: las dos vías terminan
 * en `consultaPara`.
 */

export interface Opcion<T extends string> {
  id: T;
  etiqueta: string;
  detalle: string;
}

export const opcionesPerfil: Opcion<PerfilPaciente>[] = [
  { id: 'adulto', etiqueta: 'Adulto', detalle: 'De 18 a 64 años' },
  { id: 'nino', etiqueta: 'Niño o niña', detalle: 'De 0 a 17 años' },
  { id: 'mayor', etiqueta: 'Adulto mayor', detalle: '65 años o más' },
];

export const opcionesArea: Opcion<AreaClinica>[] = [
  {
    id: 'general',
    etiqueta: 'Chequeo o algo general',
    detalle: 'Control anual, certificado médico',
  },
  { id: 'orl', etiqueta: 'Oídos, nariz o garganta', detalle: 'Dolor de oído, sinusitis, vértigo' },
  { id: 'gastro', etiqueta: 'Estómago y digestión', detalle: 'Acidez, dolor abdominal, reflujo' },
  { id: 'oncologia', etiqueta: 'Control oncológico', detalle: 'Primera consulta o seguimiento' },
  { id: 'laboratorio', etiqueta: 'Análisis o estudios', detalle: 'Laboratorio y estudios básicos' },
];

export const opcionesUrgencia: Opcion<Urgencia>[] = [
  { id: 'hoy', etiqueta: 'Lo antes posible', detalle: 'Hoy o mañana' },
  { id: 'semana', etiqueta: 'Esta semana', detalle: 'Tengo algo de margen' },
  { id: 'flexible', etiqueta: 'Sin apuro', detalle: 'Prefiero elegir el horario' },
];

/** Ejemplos que rellenan el área de texto de un toque. */
export const ejemplos = [
  'Hace tres días me duele el oído derecho y escucho menos',
  'Tengo acidez y ardor de estómago después de comer',
  'Necesito un chequeo anual y el certificado médico',
  'Mi hija tiene fiebre desde ayer',
];
