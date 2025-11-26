import { Sun, Sunset, Moon } from 'lucide-react';

export const SHIFTS = {
  MORNING: {
    id: 'morning',
    label: 'Mañana',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Sun,
    start: 8,
    end: 15
  },
  AFTERNOON: {
    id: 'afternoon',
    label: 'Tarde',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Sunset,
    start: 16,
    end: 23
  },
  NIGHT: {
    id: 'night',
    label: 'Noche',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Moon,
    start: 0,
    end: 7
  }
};
