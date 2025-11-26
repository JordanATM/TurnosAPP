export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const dayOfWeek = new Date(year, month, 1).getDay();
  const firstDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return { days, firstDay };
};

export const formatDateString = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Verifica si una actividad es visible en una fecha específica
 * Considera: fecha de inicio, fecha de fin, instancias eliminadas, y frecuencia
 */
export const isActivityVisibleOnDate = (activity, dateStr, deletedInstances = []) => {
  // Parsear la fecha de la actividad
  const [ay, am, ad] = activity.date.split('-').map(Number);
  const startDate = new Date(ay, am - 1, ad);
  startDate.setHours(0, 0, 0, 0);

  // Parsear la fecha a verificar
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  dateObj.setHours(0, 0, 0, 0);

  // Obtener el día de la semana (0 = domingo, 6 = sábado)
  const dayOfWeek = dateObj.getDay();

  // Verificar si la fecha es anterior a la fecha de inicio
  if (dateObj < startDate) return false;

  // Verificar si hay una fecha de finalización (para "desde esta fecha")
  if (activity.endDate) {
    const [ey, em, ed] = activity.endDate.split('-').map(Number);
    const endDate = new Date(ey, em - 1, ed);
    endDate.setHours(0, 0, 0, 0);

    // No mostrar si la fecha actual es igual o posterior a la fecha de finalización
    if (dateObj >= endDate) return false;
  }

  // Verificar si esta instancia específica fue eliminada
  const instanceKey = `${activity.id}_${dateStr}`;
  if (deletedInstances && deletedInstances.includes(instanceKey)) return false;

  // Verificar según la frecuencia
  if (activity.frequency === 'daily') return true;
  if (activity.frequency === 'weekdays') return dayOfWeek !== 0 && dayOfWeek !== 6;

  // Verificar días específicos de la semana
  if (activity.frequency === 'monday') return dayOfWeek === 1;
  if (activity.frequency === 'tuesday') return dayOfWeek === 2;
  if (activity.frequency === 'wednesday') return dayOfWeek === 3;
  if (activity.frequency === 'thursday') return dayOfWeek === 4;
  if (activity.frequency === 'friday') return dayOfWeek === 5;
  if (activity.frequency === 'saturday') return dayOfWeek === 6;
  if (activity.frequency === 'sunday') return dayOfWeek === 0;

  return activity.date === dateStr;
};
