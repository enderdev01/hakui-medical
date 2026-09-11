// Tipos del contenido de la clínica.
//
// Todo lo que la landing muestra pasa por acá. Si un componente necesita un dato
// que no está en estos tipos, el dato falta en `src/data/`, no en el componente.

/** Identificador de área clínica. El motor de orientación devuelve uno de estos. */
export type AreaClinica = 'general' | 'orl' | 'pediatria' | 'oncologia' | 'gastro' | 'laboratorio';

/** Nombre del icono en el sprite. Acotado para que un typo no pase el build. */
export type Icono =
  | 'estetoscopio'
  | 'oido'
  | 'bebe'
  | 'lazo'
  | 'estomago'
  | 'matraz'
  | 'calendario'
  | 'chispa'
  | 'instagram'
  | 'alerta'
  | 'telefono'
  | 'whatsapp'
  | 'flecha'
  | 'menu'
  | 'cerrar'
  | 'pregunta'
  | 'documento';

export interface Horario {
  dias: string;
  franja: string;
}

export interface Clinica {
  nombre: string;
  marca: { fuerte: string; suave: string };
  descripcion: string;
  /** Dato pendiente: teléfono real de la clínica. */
  telefono: string;
  /** Solo dígitos, para el enlace de WhatsApp. */
  whatsapp: string;
  correo: string;
  direccion: string;
  ciudad: string;
  horarios: Horario[];
  /** Número al que derivar una urgencia. La clínica no tiene guardia. */
  emergencias: string;
  direccionMedica: string;
  habilitacion: string;
  anio: string;
  /** Mes y año de la última actualización de aranceles. */
  arancelesActualizados: string;
}

export interface Especialidad {
  id: AreaClinica;
  nombre: string;
  /** Nombre corto para chips y menú móvil. */
  nombreCorto: string;
  descripcion: string;
  icono: Icono;
  /** Precio mínimo en la moneda local, sin formatear. */
  desde: number;
  consultorio: string;
  /** Profesional a cargo, con su colegiatura. */
  profesional: string;
}

export interface Arancel {
  id: string;
  practica: string;
  detalle: string;
  precio: number;
  columna: 1 | 2;
}

export interface Pregunta {
  pregunta: string;
  respuesta: string;
  /** La primera pregunta abre por defecto: una lista toda cerrada se lee como muerta. */
  abiertaPorDefecto?: boolean;
}

export interface Testimonio {
  cita: string;
  paciente: string;
  especialidad: string;
}

export interface PasoDelProceso {
  titulo: string;
  descripcion: string;
  ilustracion: 'formulario' | 'calendario' | 'consulta';
}

export interface Valor {
  texto: string;
}

/** Nivel de urgencia declarado por el paciente o inferido de lo que escribió. */
export type Urgencia = 'hoy' | 'semana' | 'flexible';

/** Perfil del paciente. Cambia la especialidad sugerida en pediatría y control integral. */
export type PerfilPaciente = 'adulto' | 'nino' | 'mayor';

export interface Consulta {
  especialidad: string;
  detalle: string;
  /** Duración en minutos. Se formatea en la vista, no acá. */
  duracion: number;
  precio: number;
  consultorio: string;
}
