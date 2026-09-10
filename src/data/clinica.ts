import type { Clinica } from './tipos';

/**
 * Datos de la clínica.
 *
 * CONVENCIÓN: todo lo que va [entre corchetes] es un dato real pendiente.
 * Antes de mostrar la demostración a un cliente, búscalos:
 *
 *   rg '\[[A-ZÁÉÍÓÚÑ][^\]]+\]' src/data
 */
export const clinica = {
  nombre: 'Hakui Medical',
  marca: { fuerte: 'Hakui', suave: 'Medical' },
  descripcion:
    'Clínica ambulatoria de barrio: seis especialidades, laboratorio propio y citas que se consiguen el mismo día.',

  telefono: '[+54 11 0000-0000]',
  whatsapp: '5411000000000',
  correo: '[correo@hakuimedical.com]',
  direccion: '[Dirección de la sede]',
  ciudad: '[Ciudad, provincia]',

  horarios: [
    { dias: 'Lunes a viernes', franja: '8 a 20' },
    { dias: 'Sábados', franja: '8 a 13' },
    { dias: 'Laboratorio', franja: '7 a 10' },
  ],

  emergencias: '[NÚMERO DE EMERGENCIAS]',
  direccionMedica: '[Nombre y matrícula]',
  habilitacion: '[N° de habilitación]',
  anio: '[AÑO]',
  arancelesActualizados: '[MES/AÑO]',
} satisfies Clinica;
