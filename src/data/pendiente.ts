/**
 * Marca un dato real que todavía no tenemos.
 *
 * Ahora mismo no hay ninguno: el contenido de la demostración está completo.
 * La función se conserva porque al adaptar el sitio a un cliente nuevo vuelve a
 * hacer falta, y porque la auditoría del README busca precisamente sus usos:
 *
 *   grep -rn 'pendiente(' src/data
 *
 * Buscar corchetes a secas devuelve falsos positivos de comentarios y prosa;
 * buscar la llamada devuelve exactamente los que faltan.
 */
export function pendiente(descripcion: string): string {
  return `[${descripcion}]`;
}
