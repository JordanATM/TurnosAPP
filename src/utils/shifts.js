import { SHIFTS } from '../constants';

export const getShiftFromTime = (timeString) => {
  if (!timeString) return null;
  const hour = parseInt(timeString.split(':')[0], 10);

  if (hour >= SHIFTS.NIGHT.start && hour <= SHIFTS.NIGHT.end) return SHIFTS.NIGHT;
  if (hour >= SHIFTS.MORNING.start && hour <= SHIFTS.MORNING.end) return SHIFTS.MORNING;
  if (hour >= SHIFTS.AFTERNOON.start && hour <= SHIFTS.AFTERNOON.end) return SHIFTS.AFTERNOON;

  return SHIFTS.AFTERNOON; // Fallback seguro
};

/**
 * Obtiene los IDs de los ingenieros que tienen un turno específico en una fecha dada
 * @param {Array} shifts - Array de turnos
 * @param {string} dateStr - Fecha en formato YYYY-MM-DD
 * @param {string} shiftType - Tipo de turno: 'morning', 'afternoon', 'night'
 * @returns {Array} - Array de IDs de personas
 */
export const getEngineersOnShift = (shifts, dateStr, shiftType) => {
  if (!shifts || !dateStr || !shiftType) return [];

  return shifts
    .filter(shift => shift.date === dateStr && shift.shift_type === shiftType)
    .map(shift => shift.person_id);
};
