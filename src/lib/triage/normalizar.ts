/**
 * Deja el texto en una forma comparable: sin tildes, en minúsculas y sin
 * puntuación.
 *
 * Sin esto, «oído» y «oido» serían términos distintos, y nadie escribe con
 * tildes cuando está apurado o con dolor.
 */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
