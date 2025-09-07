/**
 * Capitaliza la primera letra de cada palabra en una cadena de texto.
 * @param str La cadena de texto.
 * @returns La cadena con la primera letra de cada palabra en mayúscula.
 * @example
 * capitalize('hola mundo'); // 'Hola Mundo'
 */
export const capitalize = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}