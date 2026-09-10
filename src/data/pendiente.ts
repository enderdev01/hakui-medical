/**
 * Marca un dato real que todavía no tenemos.
 *
 * Envuelve el texto entre corchetes, que es como se ve en pantalla, pero el
 * valor pasa por esta función para que auditarlos sea exacto:
 *
 *   grep -rn 'pendiente(' src/data
 *
 * Buscar corchetes a secas devuelve falsos positivos de comentarios y prosa;
 * buscar la llamada devuelve exactamente los que faltan.
 */
export function pendiente(descripcion: string): string {
  return `[${descripcion}]`;
}

/** Todos los datos pendientes declarados, para listarlos de un vistazo. */
export const pendientes = {
  telefono: pendiente('+54 11 0000-0000'),
  correo: pendiente('correo@hakuimedical.com'),
  direccion: pendiente('Dirección de la sede'),
  ciudad: pendiente('Ciudad, provincia'),
  emergencias: pendiente('NÚMERO DE EMERGENCIAS'),
  direccionMedica: pendiente('Nombre y matrícula'),
  habilitacion: pendiente('N° de habilitación'),
  anio: pendiente('AÑO'),
  arancelesActualizados: pendiente('MES/AÑO'),
  nombrePaciente: pendiente('Nombre del paciente'),
  fecha: pendiente('00/00'),
} as const;
