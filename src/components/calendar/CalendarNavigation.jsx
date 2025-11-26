import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { months } from '../../constants';

export function CalendarNavigation({ currentDate, onPreviousMonth, onNextMonth, onToday }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800 capitalize">
        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h2>
      <div className="flex gap-2">
        <button onClick={onPreviousMonth} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={onToday} className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50">
          Hoy
        </button>
        <button onClick={onNextMonth} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
