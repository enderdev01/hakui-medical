import type { Clinica } from './tipos';

/**
 * Datos de la clínica.
 *
 * TODO ESTE CONTENIDO ES FICTICIO. La clínica no existe: nombre, dirección,
 * teléfonos, colegiatura y registro están inventados para que la demostración
 * se vea completa. Al adaptarla a un cliente real se reemplaza este archivo
 * entero y no hace falta tocar ningún componente.
 *
 * La única excepción deliberada es el número de emergencias: 106 es el SAMU
 * del Perú y es real a propósito. Un aviso de urgencias con un número inventado
 * es peor que no tener aviso.
 */
export const clinica = {
  nombre: 'Hakui Medical',
  marca: { fuerte: 'Hakui', suave: 'Medical' },
  descripcion:
    'Clínica ambulatoria de barrio: seis especialidades, laboratorio propio y citas que se consiguen el mismo día.',

  telefono: '(01) 480-2215',
  whatsapp: '51987412650',
  correo: 'contacto@hakuimedical.pe',
  direccion: 'Av. Los Precursores 285, San Isidro',
  ciudad: 'Lima, Perú',

  horarios: [
    { dias: 'Lunes a viernes', franja: '8 a 20' },
    { dias: 'Sábados', franja: '8 a 13' },
    { dias: 'Laboratorio', franja: '7 a 10' },
  ],

  // Real a propósito: SAMU, emergencias médicas en Perú.
  emergencias: '106',
  direccionMedica: 'Dra. Elena Matsuda · CMP 48213',
  habilitacion: 'RENIPRESS 00021847',
  anio: '2026',
  arancelesActualizados: 'marzo de 2026',
} satisfies Clinica;
