/**
 * Utilidades para manejo de roles de usuario
 */

// Lista de emails de los administradores del sistema
const ADMIN_EMAILS = ['jotorrejon@gmail.com', 'anunez@email.com'];

/**
 * Verifica si un usuario es administrador
 * @param {Object} user - Objeto de usuario de Supabase
 * @returns {boolean} - true si es admin, false si no
 */
export const isAdmin = (user) => {
  if (!user || !user.email) return false;

  // Usamos .includes() para verificar si el email está en la lista
  // y convertimos a minúsculas para evitar errores de mayúsculas/minúsculas
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
};

/**
 * Verifica si un usuario puede modificar turnos
 * @param {Object} user - Objeto de usuario de Supabase
 * @returns {boolean}
 */
export const canModifyShifts = (user) => {
  return isAdmin(user);
};

/**
 * Verifica si un usuario puede gestionar personal
 * @param {Object} user - Objeto de usuario de Supabase
 * @returns {boolean}
 */
export const canManagePeople = (user) => {
  return isAdmin(user);
};

/**
 * Verifica si un usuario puede agregar, modificar o eliminar actividades
 * @param {Object} user - Objeto de usuario de Supabase
 * @returns {boolean}
 */
export const canManageActivities = (user) => {
  return isAdmin(user);
};
