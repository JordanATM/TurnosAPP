import { Calendar, RefreshCcw, Briefcase } from 'lucide-react';

export const FREQUENCY = {
  ONCE: {
    id: 'once',
    label: 'Una sola vez',
    icon: Calendar
  },
  DAILY: {
    id: 'daily',
    label: 'Todos los días',
    icon: RefreshCcw
  },
  WEEKDAYS: {
    id: 'weekdays',
    label: 'Lunes a Viernes',
    icon: Briefcase
  },
  MONDAY: {
    id: 'monday',
    label: 'Todos los Lunes',
    icon: Calendar,
    dayOfWeek: 1
  },
  TUESDAY: {
    id: 'tuesday',
    label: 'Todos los Martes',
    icon: Calendar,
    dayOfWeek: 2
  },
  WEDNESDAY: {
    id: 'wednesday',
    label: 'Todos los Miércoles',
    icon: Calendar,
    dayOfWeek: 3
  },
  THURSDAY: {
    id: 'thursday',
    label: 'Todos los Jueves',
    icon: Calendar,
    dayOfWeek: 4
  },
  FRIDAY: {
    id: 'friday',
    label: 'Todos los Viernes',
    icon: Calendar,
    dayOfWeek: 5
  },
  SATURDAY: {
    id: 'saturday',
    label: 'Todos los Sábados',
    icon: Calendar,
    dayOfWeek: 6
  },
  SUNDAY: {
    id: 'sunday',
    label: 'Todos los Domingos',
    icon: Calendar,
    dayOfWeek: 0
  }
};
