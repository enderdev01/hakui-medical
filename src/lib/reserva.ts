/**
 * Reserva simulada.
 *
 * ESTO NO RESERVA NADA. Guarda la cita en el navegador de quien la hace, para
 * que la demostración se pueda completar de punta a punta y sobreviva a una
 * recarga. Desaparece si cambia de dispositivo o de navegador: alcanza para
 * vender, no para operar.
 */

export interface Reserva {
  codigo: string;
  especialidad: string;
  horario: string;
  /** ISO de cuándo se hizo, para poder mostrarla y para depurar. */
  creada: string;
}

/** La versión en la clave evita leer una forma vieja tras un cambio de tipo. */
const CLAVE = 'hakui:reserva:v1';

/**
 * Código de reserva estable a partir de la fecha y la especialidad.
 *
 * Determinista a propósito: uno aleatorio cambiaría en cada renderizado y se
 * vería como lo que es, un número inventado en pantalla.
 */
export function codigoDeReserva(especialidad: string, fecha = new Date()): string {
  const dia = `${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(
    fecha.getDate(),
  ).padStart(2, '0')}`;

  let acumulado = 0;
  for (const caracter of especialidad) {
    acumulado = (acumulado * 31 + caracter.codePointAt(0)!) % 46_656;
  }

  return `HK-${dia.slice(2)}-${acumulado.toString(36).toUpperCase().padStart(3, '0')}`;
}

/**
 * En navegación privada, algunos navegadores lanzan excepción con solo tocar
 * `localStorage`. Por eso todo va dentro de `try/catch` y el flujo se completa
 * igual sin almacenamiento: la reserva simplemente no sobrevive a la recarga.
 */
export function leerReserva(): Reserva | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return null;

    const dato = JSON.parse(crudo) as Partial<Reserva>;
    if (!dato.codigo || !dato.especialidad || !dato.horario || !dato.creada) return null;

    return dato as Reserva;
  } catch {
    return null;
  }
}

export function guardarReserva(reserva: Reserva): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(reserva));
  } catch {
    // Sin almacenamiento la demostración sigue funcionando; solo no persiste.
  }
}

export function borrarReserva(): void {
  try {
    window.localStorage.removeItem(CLAVE);
  } catch {
    // Nada que hacer: si no se pudo escribir, tampoco hay nada que borrar.
  }
}
