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
  }
};
