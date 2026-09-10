/**
 * Formateo de valores para la vista.
 *
 * Se ejecuta en tiempo de compilación: los componentes `.astro` corren en el
 * servidor, así que `Intl` nunca viaja al navegador.
 */

const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** `24500` → `$24.500` */
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
