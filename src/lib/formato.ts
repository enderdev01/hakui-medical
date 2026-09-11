/**
 * Formateo de valores para la vista.
 *
 * Se ejecuta en tiempo de compilación: los componentes `.astro` corren en el
 * servidor, así que `Intl` nunca viaja al navegador.
 */

const moneda = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** `70` → `S/ 70` */
export function precio(valor: number): string {
  return moneda.format(valor);
}

/** `30` → `30 minutos`, `1` → `1 minuto` */
export function duracion(minutos: number): string {
  return `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
}

/**
 * Enlace de WhatsApp con mensaje prellenado.
 *
 * Sin backend, esta es la vía de contacto real: un formulario prometería un
 * envío que nadie recibe.
 */
export function enlaceWhatsapp(numero: string, mensaje: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Mensajes de WhatsApp del sitio, en un solo lugar.
 *
 * Se escriben acá y no en cada componente porque son copia de cara al paciente:
 * si mañana cambia el tono, cambia en un archivo.
 */
export const mensajesWhatsapp = {
  general: 'Hola, quiero consultar por una cita en la clínica.',
  cobertura: 'Hola, quiero consultar si mi cobertura cubre una consulta.',
  otroHorario: (especialidad: string) =>
    `Hola, el asistente me sugirió una consulta de ${especialidad} y quiero pedir otro horario.`,
  confirmar: (especialidad: string, horario: string) =>
    `Hola, reservé una consulta de ${especialidad} para el ${horario} y quiero confirmarla.`,
};
