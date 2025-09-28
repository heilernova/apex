export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos 
    .replace(/[^a-z0-9]+/g, '-') // Remplazar caracteres no alfanuméricos por guiones
    .replace(/^-+|-+$/g, '') // Eliminar guiones al inicio y al final
    .replace(/-+/g, '-'); // Cambiar múltiples guiones por uno solo
}