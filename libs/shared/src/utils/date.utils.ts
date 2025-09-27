/**
 * Calcula la edad en años completos basada en la fecha de nacimiento
 * @param birthdate Fecha de nacimiento
 * @returns Edad en años completos
 */
export function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  
  // Si aún no ha pasado el cumpleaños este año, resta 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Verifica si una persona es menor de edad
 */
export function isMinor(birthdate: Date): boolean {
  return calculateAge(birthdate) < 18;
}

/**
 * Obtiene el próximo cumpleaños
 */
export function getNextBirthday(birthdate: Date): Date {
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthday = new Date(currentYear, birthdate.getMonth(), birthdate.getDate());
  
  if (birthday < today) {
    birthday.setFullYear(currentYear + 1);
  }
  
  return birthday;
}