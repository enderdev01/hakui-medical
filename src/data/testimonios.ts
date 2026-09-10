import type { Testimonio } from './tipos';

/**
 * Testimonios SIMULADOS.
 *
 * No deben presentarse como reales sin autorización del paciente. Antes de
 * publicar la demostración para un cliente hay que reemplazarlos o retirarlos.
 */
export const testimonios = [
  {
    cita: 'Escribí que me dolía el oído y me mandó directo al otorrino, con horario para el mismo día.',
    paciente: '[Nombre del paciente]',
    especialidad: 'Otorrinolaringología',
  },
  {
    cita: 'Llevé a mi hija sin saber a qué especialidad ir. Se resolvió en un minuto y nos atendieron a las dos horas.',
    paciente: '[Nombre del paciente]',
    especialidad: 'Pediatría',
  },
  {
    cita: 'Los controles y el laboratorio en el mismo lugar me ahorran medio día cada mes. Es lo que más valoro.',
    paciente: '[Nombre del paciente]',
    especialidad: 'Oncología · control',
  },
] satisfies Testimonio[];
