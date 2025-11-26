import React from 'react';
import { daysOfWeek } from '../../constants';
import { CalendarDay } from './CalendarDay';

export function CalendarGrid({
  currentDate,
  firstDay,
  days,
  activities,
  deletedInstances,
  completedInstances,
  people,
  onDayClick,
  onEditActivity,
  onToggleCompletion
}) {
  return (
    <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 overflow-hidden">
      {/* Cabecera de días */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {daysOfWeek.map(day => (
          <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Celdas de días */}
      <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px">
        {/* Espacios vacíos inicio mes */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-white min-h-[120px]" />
        ))}

        {/* Días del mes */}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          return (
            <CalendarDay
              key={day}
              day={day}
              currentDate={currentDate}
              activities={activities}
              deletedInstances={deletedInstances}
              completedInstances={completedInstances}
              people={people}
              onDayClick={onDayClick}
              onEditActivity={onEditActivity}
              onToggleCompletion={onToggleCompletion}
            />
          );
        })}
      </div>
    </div>
  );
}
