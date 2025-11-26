import React from 'react';
import { Calendar, Users, Plus } from 'lucide-react';

export function CalendarHeader({ onNewActivity, onManagePeople }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Planificador de Turnos</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onManagePeople}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Personal</span>
          </button>
          <button
            onClick={onNewActivity}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Actividad
          </button>
        </div>
      </div>
    </header>
  );
}
