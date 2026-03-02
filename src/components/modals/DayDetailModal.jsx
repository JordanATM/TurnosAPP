import React from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  RefreshCcw,
  Briefcase,
  Calendar,
  Plus,
  Clock,
  Users,
  ChevronRight
} from 'lucide-react';
import { getShiftFromTime, getEngineersOnShift } from '../../utils';
import { months } from '../../constants/calendar';

export function DayDetailModal({
  isOpen,
  onClose,
  day,
  currentDate,
  activities = [],
  deletedInstances = [],
  completedInstances = [],
  people = [],
  shifts = [],
  onToggleCompletion,
  onEditActivity,
  onNewActivity
}) {
  if (!isOpen || !day) return null;

  const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  dateObj.setHours(0, 0, 0, 0);
  const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dayOfWeek = dateObj.getDay();
  const isToday = new Date().setHours(0, 0, 0, 0) === dateObj.getTime();

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

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
    .sort((a, b) => a.time.localeCompare(b.time));

  const completedCount = dayActivities.filter(a =>
    completedInstances.includes(`${a.id}_${dateStr}`)
  ).length;
  const totalCount = dayActivities.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className={`px-6 py-5 border-b border-gray-100 ${isToday ? 'bg-blue-600' : 'bg-gray-900'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-100' : 'text-gray-400'}`}>
                {dayNames[dayOfWeek]}
              </p>
              <h2 className="text-white text-3xl font-bold leading-none">
                {day} <span className="text-xl font-normal opacity-80">{months[currentDate.getMonth()]}</span>
              </h2>
              {isToday && (
                <span className="inline-block mt-2 text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">
                  Hoy
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          {totalCount > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-white/80 mb-1.5">
                <span>{completedCount} de {totalCount} completadas</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white rounded-full h-1.5 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {dayActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No hay tareas para este día</p>
              <p className="text-gray-400 text-sm mt-1">Haz clic en "Nueva Tarea" para agregar una</p>
            </div>
          ) : (
            dayActivities.map(activity => {
              const shift = getShiftFromTime(activity.time);
              const isCompleted = completedInstances.includes(`${activity.id}_${dateStr}`);

              const displayAssignees = activity.auto_assign && shift
                ? getEngineersOnShift(shifts, dateStr, shift.id)
                : activity.assignees;

              const assigneeNames = displayAssignees && displayAssignees.length > 0
                ? displayAssignees
                    .map(id => people.find(p => p.id === id)?.name)
                    .filter(Boolean)
                    .join(', ')
                : null;

              return (
                <div
                  key={`${activity.id}-detail`}
                  className={`rounded-xl border transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    {/* Toggle button */}
                    <button
                      onClick={(e) => onToggleCompletion(e, activity.id, dateStr)}
                      className={`shrink-0 transition-colors rounded-full ${
                        isCompleted
                          ? 'text-green-500 hover:text-green-600'
                          : 'text-gray-300 hover:text-green-500'
                      }`}
                      title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 fill-green-100" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    {/* Content - clickable for edit */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={(e) => onEditActivity(e, activity, dateStr)}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs font-semibold text-gray-500">{activity.time}</span>
                        {activity.frequency === 'daily' && (
                          <span className="flex items-center gap-0.5 text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                            <RefreshCcw className="w-2.5 h-2.5" /> Diaria
                          </span>
                        )}
                        {activity.frequency === 'weekdays' && (
                          <span className="flex items-center gap-0.5 text-[10px] text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded-full">
                            <Briefcase className="w-2.5 h-2.5" /> L-V
                          </span>
                        )}
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(activity.frequency) && (
                          <span className="flex items-center gap-0.5 text-[10px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">
                            <Calendar className="w-2.5 h-2.5" /> Semanal
                          </span>
                        )}
                      </div>

                      <p className={`text-sm font-medium text-gray-900 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                        {activity.title}
                      </p>

                      {assigneeNames && (
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="text-xs text-gray-500 truncate">{assigneeNames}</span>
                        </div>
                      )}
                    </div>

                    {/* Edit arrow */}
                    <button
                      onClick={(e) => onEditActivity(e, activity, dateStr)}
                      className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors p-1"
                      title="Editar tarea"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/80">
          <button
            onClick={() => { onNewActivity(day); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nueva Tarea para este día
          </button>
        </div>
      </div>
    </div>
  );
}
