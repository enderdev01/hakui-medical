import { pendientes } from './pendiente';
import type { Clinica } from './tipos';

/**
 * Datos de la clínica.
 *
 * Lo que todavía no tenemos se declara en `pendientes`, no como texto suelto:
 * así auditarlos es `grep -rn 'pendiente(' src/data` y no hay falsos positivos.
 */
export const clinica = {
  nombre: 'Hakui Medical',
  marca: { fuerte: 'Hakui', suave: 'Medical' },
  descripcion:
    'Clínica ambulatoria de barrio: seis especialidades, laboratorio propio y citas que se consiguen el mismo día.',

  telefono: pendientes.telefono,
  whatsapp: '5411000000000',
  correo: pendientes.correo,
  direccion: pendientes.direccion,
  ciudad: pendientes.ciudad,

  horarios: [
    { dias: 'Lunes a viernes', franja: '8 a 20' },
    { dias: 'Sábados', franja: '8 a 13' },
    { dias: 'Laboratorio', franja: '7 a 10' },
  ],

  emergencias: pendientes.emergencias,
  direccionMedica: pendientes.direccionMedica,
  habilitacion: pendientes.habilitacion,
  anio: pendientes.anio,
  arancelesActualizados: pendientes.arancelesActualizados,
} satisfies Clinica;
