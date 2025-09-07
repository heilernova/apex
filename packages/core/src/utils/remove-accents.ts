/**
 * Elimina los acentos de una cadena de texto.
 * @param text La cadena de texto.
 * @returns La cadena sin acentos.
 * @example
 * removeAccents('canción'); // 'cancion'
 */
export function removeAccents(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}