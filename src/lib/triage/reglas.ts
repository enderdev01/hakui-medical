import type { AreaClinica, PerfilPaciente, Urgencia } from '@data/tipos';

/**
 * Reglas de orientación, declarativas y separadas del algoritmo.
 *
 * Ampliar el vocabulario es agregar términos a una lista; no hay que tocar la
 * lógica ni volver a razonar la puntuación.
 *
 * Los términos se escriben ya normalizados: minúsculas y sin tildes.
 */

export interface ReglaArea {
  area: AreaClinica;
  /** Lo que se le muestra al paciente como justificación. */
  etiqueta: string;
  /**
   * Desempata cuando dos áreas empatan en coincidencias. Más alto gana.
   * El orden es clínico, no alfabético ni de aparición: ante la duda conviene
   * derivar al seguimiento oncológico antes que a una consulta general.
   */
  prioridad: number;
  terminos: string[];
}

export const reglasDeArea: ReglaArea[] = [
  {
    area: 'oncologia',
    etiqueta: 'Seguimiento oncológico',
    prioridad: 5,
    terminos: [
      'oncolog',
      'oncologo',
      'tumor',
      'quimio',
      'quimioterapia',
      'cancer',
      'biopsia',
      'nodulo',
      'metastasis',
      'radioterapia',
      'mama',
      'lunar',
    ],
  },
  {
    area: 'orl',
    etiqueta: 'Síntomas de oído, nariz o garganta',
    prioridad: 4,
    terminos: [
      'oido',
      'oidos',
      'oreja',
      'garganta',
      'nariz',
      'sinusitis',
      'vertigo',
      'mareo',
      'mareos',
      'ronquido',
      'ronquidos',
      'amigdala',
      'amigdalas',
      'anginas',
      'audicion',
      'escucho',
      'sordera',
      'zumbido',
      'afonia',
      'voz',
      'mocos',
    ],
  },
  {
    area: 'gastro',
    etiqueta: 'Síntomas digestivos',
    prioridad: 3,
    terminos: [
      'estomago',
      'acidez',
      'reflujo',
      'digestion',
      'nausea',
      'nauseas',
      'vomito',
      'vomitos',
      'colon',
      'abdominal',
      'abdomen',
      'intestino',
      'diarrea',
      'gastritis',
      'hinchazon',
      'ardor',
      'panza',
      'barriga',
    ],
  },
  {
    area: 'laboratorio',
    etiqueta: 'Pedido de estudios',
    prioridad: 2,
    terminos: [
      'analisis',
      'laboratorio',
      'sangre',
      'orina',
      'colesterol',
      'glucosa',
      'tiroides',
      'estudio',
      'estudios',
      'orden',
      'extraccion',
      'hemograma',
    ],
  },
  {
    area: 'general',
    etiqueta: 'Consulta general',
    prioridad: 1,
    terminos: [
      'chequeo',
      'control',
      'certificado',
      'apto',
      'rutina',
      'cansancio',
      'fiebre',
      'presion',
      'general',
      'revision',
      'dolor de cabeza',
      'gripe',
    ],
  },
];

export interface ReglaPerfil {
  perfil: PerfilPaciente;
  etiqueta: string;
  terminos: string[];
}

export const reglasDePerfil: ReglaPerfil[] = [
  {
    perfil: 'nino',
    etiqueta: 'La consulta es para un menor',
    terminos: [
      'nino',
      'nina',
      'ninos',
      'hijo',
      'hija',
      'bebe',
      'nene',
      'nena',
      'pediatra',
      'pediatria',
      'mi peque',
    ],
  },
  {
    perfil: 'mayor',
    etiqueta: 'La consulta es para un adulto mayor',
    terminos: ['mi mama', 'mi papa', 'abuelo', 'abuela', 'jubilado', 'anciano', 'mi suegra'],
  },
];

export interface ReglaUrgencia {
  urgencia: Urgencia;
  etiqueta: string;
  terminos: string[];
}

export const reglasDeUrgencia: ReglaUrgencia[] = [
  {
    urgencia: 'hoy',
    etiqueta: 'Lo marcaste como urgente',
    terminos: ['urgente', 'hoy', 'ahora', 'mucho dolor', 'no aguanto', 'no doy mas', 'ya mismo'],
  },
  {
    urgencia: 'semana',
    etiqueta: 'Puede esperar unos días',
    terminos: ['esta semana', 'dias', 'la semana', 'proxima semana'],
  },
];

/** Lo que se muestra cuando el texto no trae ninguna señal reconocible. */
export const SIN_SENALES = 'Sin señales claras: te sugerimos empezar por medicina general';
