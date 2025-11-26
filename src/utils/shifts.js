import { SHIFTS } from '../constants';

export const getShiftFromTime = (timeString) => {
  if (!timeString) return null;
  const hour = parseInt(timeString.split(':')[0], 10);

  if (hour >= SHIFTS.NIGHT.start && hour <= SHIFTS.NIGHT.end) return SHIFTS.NIGHT;
  if (hour >= SHIFTS.MORNING.start && hour <= SHIFTS.MORNING.end) return SHIFTS.MORNING;
  if (hour >= SHIFTS.AFTERNOON.start && hour <= SHIFTS.AFTERNOON.end) return SHIFTS.AFTERNOON;

  return SHIFTS.AFTERNOON; // Fallback seguro
};
