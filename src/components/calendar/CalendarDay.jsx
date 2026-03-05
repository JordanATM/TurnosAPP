import React from 'react';
import { Plus, RefreshCcw, Briefcase, CheckCircle2, Circle, Calendar, ChevronRight } from 'lucide-react';
import { getShiftFromTime, getEngineersOnShift } from '../../utils';
import { FREQUENCY } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { canManageActivities } from '../../utils/roles';

export function CalendarDay({
  day,
  currentDate,
  activities,
  deletedInstances,
  completedInstances,
  people,
  shifts = [],
  onDayClick,
  onEditActivity,
  onToggleCompletion,
  onViewAllTasks
}) {
  const { user } = useAuth();
  const userCanManage = canManageActivities(user);
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

      if (a.endDate) {
        const [ey, em, ed] = a.endDate.split('-').map(Number);
        const endDate = new Date(ey, em - 1, ed);
        endDate.setHours(0, 0, 0, 0);
        if (dateObj >= endDate) return false;
      }

      const instanceKey = `${a.id}_${dateStr}`;
      if (deletedInstances && deletedInstances.includes(instanceKey)) return false;

      if (a.frequency === 'daily') return true;
      if (a.frequency === 'weekdays') return dayOfWeek !== 0 && dayOfWeek !== 6;

      if (a.frequency === 'monday') return dayOfWeek === 1;
      if (a.frequency === 'tuesday') return dayOfWeek === 2;
      if (a.frequency === 'wednesday') return dayOfWeek === 3;
      if (a.frequency === 'thursday') return dayOfWeek === 4;
      if (a.frequency === 'friday') return dayOfWeek === 5;
      if (a.frequency === 'saturday') return dayOfWeek === 6;
      if (a.frequency === 'sunday') return dayOfWeek === 0;

      return a.date === dateStr;
    })
    .map(a => ({ ...a, _displayDay: day }))
    .sort((a, b) => a.time.localeCompare(b.time));

  // Solo mostrar 1 actividad en la vista del calendario
  const visibleActivity = dayActivities[0] || null;
  const hiddenCount = dayActivities.length - 1;

  const completedCount = dayActivities.filter(a =>
    completedInstances.includes(`${a.id}_${dateStr}`)
  ).length;

  return (
    <div
      onClick={() => onDayClick(day)}
      className={`bg-white min-h-[120px] p-2 transition-colors hover:bg-gray-50 cursor-pointer relative group ${isToday ? 'bg-blue-50/30' : ''}`}
    >
      {/* Número del día */}
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
          {day}
        </span>

        {/* Indicador de progreso si hay tareas */}
        {dayActivities.length > 0 && (
          <span className="text-[10px] text-gray-400 font-medium">
            {completedCount}/{dayActivities.length}
          </span>
        )}
      </div>

      <div className="space-y-1">
        {/* Mostrar solo la primera actividad */}
        {visibleActivity && (() => {
          const activity = visibleActivity;
          const shift = getShiftFromTime(activity.time);
          const isCompleted = completedInstances.includes(`${activity.id}_${dateStr}`);

          const displayAssignees = activity.auto_assign && shift
            ? getEngineersOnShift(shifts, dateStr, shift.id)
            : activity.assignees;

          const cardStyle = isCompleted
            ? 'bg-green-50 border-green-200 text-green-800 shadow-sm'
            : `${shift.color} shadow-sm`;

          return (
            <div
              key={`${activity.id}-${day}`}
              onClick={(e) => userCanManage ? onEditActivity(e, activity, dateStr) : e.stopPropagation()}
              className={`text-xs p-1.5 rounded border mb-1 transition-all group/card ${cardStyle} ${userCanManage ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 font-bold mb-0.5">
                    <shift.icon className="w-3 h-3" />
                    {activity.frequency === 'daily' && <RefreshCcw className="w-3 h-3 ml-auto opacity-60" />}
                    {activity.frequency === 'weekdays' && <Briefcase className="w-3 h-3 ml-auto opacity-60" />}
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(activity.frequency) && (
                      <Calendar className="w-3 h-3 ml-auto opacity-60" />
                    )}
                  </div>
                  <div className={`truncate font-medium ${isCompleted ? 'line-through opacity-75' : ''}`}>
                    {activity.title}
                  </div>
                  {displayAssignees && displayAssignees.length > 0 && (
                    <div
                      className="text-[10px] mt-0.5 opacity-90 truncate"
                      title={displayAssignees.map(id => people.find(p => p.id === id)?.name).filter(Boolean).join(', ')}
                    >
                      {displayAssignees.length === 1
                        ? people.find(p => p.id === displayAssignees[0])?.name
                        : displayAssignees.length === 2
                          ? displayAssignees.map(id => people.find(p => p.id === id)?.name).filter(Boolean).join(' y ')
                          : `${displayAssignees.map(id => people.find(p => p.id === id)?.name).filter(Boolean).join(', ')}`}
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
        })()}

        {/* Botón "Ver todas" si hay más de 1 tarea */}
        {hiddenCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewAllTasks(day);
            }}
            className="w-full text-left flex items-center justify-between text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
          >
            <span>+{hiddenCount} tarea{hiddenCount > 1 ? 's' : ''} más</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Botón + al hacer hover – solo para admins */}
      {userCanManage && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gray-100 p-1 rounded-md hover:bg-gray-200">
            <Plus className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      )}
    </div>
  );
}
