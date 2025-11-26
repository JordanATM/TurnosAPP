/**
 * Utilidades para manejo de roles de usuario
 */

// Email del administrador del sistema
const ADMIN_EMAIL = 'jotorrejon@gmail.com';

/**
 * Verifica si un usuario es administrador
 * @param {Object} user - Objeto de usuario de Supabase
 * @returns {boolean} - true si es admin, false si no
 */
export const isAdmin = (user) => {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
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
