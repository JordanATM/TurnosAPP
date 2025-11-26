import React from 'react';
import { Plus, RefreshCcw, Briefcase, CheckCircle2, Circle } from 'lucide-react';
import { getShiftFromTime } from '../../utils';

export function CalendarDay({
  day,
  currentDate,
  activities,
  deletedInstances,
  completedInstances,
  people,
  onDayClick,
  onEditActivity,
  onToggleCompletion
}) {
  const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  dateObj.setHours(0, 0, 0, 0);
  const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const dayOfWeek = dateObj.getDay();
  const isToday = new Date().setHours(0, 0, 0, 0) === dateObj.getTime();

  // Filtrado de actividades
  const dayActivities = activities
    .filter(a => {
      const [y, m, d] = a.date.split('-').map(Number);
      const startDate = new Date(y, m - 1, d);
      startDate.setHours(0, 0, 0, 0);

      if (dateObj < startDate) return false;

      // Verificar si hay una fecha de finalización (para "desde esta fecha")
      if (a.endDate) {
        const [ey, em, ed] = a.endDate.split('-').map(Number);
        const endDate = new Date(ey, em - 1, ed);
        endDate.setHours(0, 0, 0, 0);

        // No mostrar si la fecha actual es igual o posterior a la fecha de finalización
        if (dateObj >= endDate) return false;
      }

      // Verificar si esta instancia específica fue eliminada
      const instanceKey = `${a.id}_${dateStr}`;
      if (deletedInstances && deletedInstances.includes(instanceKey)) return false;

      if (a.frequency === 'daily') return true;
      if (a.frequency === 'weekdays') return dayOfWeek !== 0 && dayOfWeek !== 6;
      return a.date === dateStr;
    })
    .map(a => ({ ...a, _displayDay: day }))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div
      onClick={() => onDayClick(day)}
      className={`bg-white min-h-[120px] p-2 transition-colors hover:bg-gray-50 cursor-pointer relative group ${isToday ? 'bg-blue-50/30' : ''}`}
    >
      <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
        {day}
      </span>

      <div className="mt-2 space-y-1">
        {dayActivities.map(activity => {
          const shift = getShiftFromTime(activity.time);
          const isCompleted = completedInstances.includes(`${activity.id}_${dateStr}`);

          const cardStyle = isCompleted
            ? 'bg-green-50 border-green-200 text-green-800 shadow-sm'
            : `${shift.color} shadow-sm`;

          return (
            <div
              key={`${activity.id}-${day}`}
              onClick={(e) => onEditActivity(e, activity, dateStr)}
              className={`text-xs p-1.5 rounded border mb-1 cursor-pointer hover:shadow-md transition-all group/card ${cardStyle}`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 font-bold mb-0.5">
                    <shift.icon className="w-3 h-3" />
                    <span>{activity.time}</span>
                    {activity.frequency === 'daily' && <RefreshCcw className="w-3 h-3 ml-auto opacity-60" />}
                    {activity.frequency === 'weekdays' && <Briefcase className="w-3 h-3 ml-auto opacity-60" />}
                  </div>
                  <div className={`truncate font-medium ${isCompleted ? 'line-through opacity-75' : ''}`}>
                    {activity.title}
                  </div>
                  {activity.assignees.length > 0 && (
                    <div className="text-[10px] mt-0.5 opacity-90 truncate">
                      {activity.assignees.length === 1
                        ? people.find(p => p.id === activity.assignees[0])?.name
                        : `${activity.assignees.length} resp.`}
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => onToggleCompletion(e, activity.id, dateStr)}
                  className={`shrink-0 rounded-full p-0.5 transition-colors ${isCompleted ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:text-green-600 hover:bg-white/50'}`}
                  title={isCompleted ? "Marcar como pendiente" : "Marcar como lista"}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 fill-green-100" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-gray-100 p-1 rounded-md hover:bg-gray-200">
          <Plus className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </div>
  );
}
