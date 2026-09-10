/** Anclas de la landing. El mismo orden en cabecera, menú móvil y pie. */
export const navegacion = [
  { texto: 'Agenda tu cita', ancla: '#asistente' },
  { texto: 'Especialidades', ancla: '#especialidades' },
  { texto: 'Aranceles', ancla: '#aranceles' },
  { texto: 'Preguntas', ancla: '#preguntas' },
  { texto: 'Contacto', ancla: '#contacto' },
] as const;

/** Trámites del paciente. Sin destino real: la demostración no tiene portal. */
export const tramites = [
  { texto: 'Resultados online', ancla: '#contacto' },
  { texto: 'Aranceles', ancla: '#aranceles' },
  { texto: 'Coberturas', ancla: '#aranceles' },
  { texto: 'Preparación de estudios', ancla: '#preguntas' },
  { texto: 'Preguntas frecuentes', ancla: '#preguntas' },
] as const;
