import type { Urgencia } from './tipos';

/**
 * Agenda simulada. El horario sugerido sale de cruzar el nivel de urgencia con
 * esta tabla, no de un calendario real: sin backend no hay disponibilidad que
 * consultar.
 *
 * Las fechas se calculan en tiempo de compilación a partir del día de hoy. Una
 * fecha fija envejece mal en una demostración que se muestra durante meses: a
 * la semana siguiente la clínica estaría ofreciendo turnos del pasado.
 */

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** Próxima fecha con ese día de la semana, sin contar hoy. */
function proximo(diaSemana: number, desde = new Date()): Date {
  const fecha = new Date(desde);
  const salto = (diaSemana - fecha.getDay() + 7) % 7 || 7;
  fecha.setDate(fecha.getDate() + salto);
  return fecha;
}

function etiqueta(fecha: Date, hora: string): string {
  const dia = DIAS[fecha.getDay()]!;
  const nombre = dia.charAt(0).toUpperCase() + dia.slice(1);
  const numero = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${nombre} ${numero}/${mes}, ${hora}`;
}

export const horariosPorUrgencia: Record<Urgencia, string> = {
  hoy: 'Hoy, 18:40',
  // Jueves de esta semana o de la próxima, según cuándo se construya el sitio.
  semana: etiqueta(proximo(4), '10:20'),
  flexible: etiqueta(proximo(2), '09:00'),
};

/** Citas libres que anuncia el hero. Valor de escenografía. */
export const citasLibresHoy = 14;
