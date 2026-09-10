import { pendientes } from './pendiente';
import type { Urgencia } from './tipos';

/**
 * Agenda simulada. El horario sugerido sale de cruzar el nivel de urgencia con
 * esta tabla, no de un calendario real: sin backend no hay disponibilidad que
 * consultar.
 *
 * Los días van entre corchetes porque una fecha inventada envejece mal en una
 * demostración que se muestra durante meses.
 */
export const horariosPorUrgencia: Record<Urgencia, string> = {
  hoy: 'Hoy, 18:40',
  semana: `Jueves ${pendientes.fecha}, 10:20`,
  flexible: `Martes ${pendientes.fecha}, 09:00`,
};

/** Citas libres que anuncia el hero. Valor de escenografía. */
export const citasLibresHoy = 14;
