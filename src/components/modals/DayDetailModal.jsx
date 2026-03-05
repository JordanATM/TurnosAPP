import React, { useState } from 'react';
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
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Building2,
  Filter,
  Lock
} from 'lucide-react';
import { getShiftFromTime, getEngineersOnShift } from '../../utils';
import { SHIFTS } from '../../constants';
import { months } from '../../constants/calendar';
import { useAuth } from '../../contexts/AuthContext';
import { canManageActivities } from '../../utils/roles';

const SHIFT_FILTERS = [
  { id: 'all', label: 'Todos', icon: null, color: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200' },
  { id: SHIFTS.NIGHT.id, label: SHIFTS.NIGHT.label, icon: Moon, color: 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100' },
  { id: SHIFTS.MORNING.id, label: SHIFTS.MORNING.label, icon: Sun, color: 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100' },
  { id: SHIFTS.AFTERNOON.id, label: SHIFTS.AFTERNOON.label, icon: Sunset, color: 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100' },
];

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
  const { user } = useAuth();
  const userCanManage = canManageActivities(user);
  const [activeShiftFilter, setActiveShiftFilter] = useState('all');
  const [activeClientFilter, setActiveClientFilter] = useState('all');

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

  // Lista de clientes únicos para los filtros
  const uniqueClients = ['all', ...Array.from(
    new Set(dayActivities.map(a => a.client_name).filter(Boolean))
  )];

  // Aplicar filtros
  const filteredActivities = dayActivities.filter(activity => {
    const shift = getShiftFromTime(activity.time);
    const matchesShift = activeShiftFilter === 'all' || shift?.id === activeShiftFilter;
    const matchesClient = activeClientFilter === 'all' || activity.client_name === activeClientFilter;
    return matchesShift && matchesClient;
  });

  const completedCount = dayActivities.filter(a =>
    completedInstances.includes(`${a.id}_${dateStr}`)
  ).length;
  const totalCount = dayActivities.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const hasClients = uniqueClients.length > 1;

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
              {!userCanManage && (
                <span className="inline-flex items-center gap-1 mt-2 ml-1 text-xs font-medium bg-white/10 text-white/80 px-2 py-0.5 rounded-full">
                  <Lock className="w-2.5 h-2.5" /> Solo lectura
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

        {/* Filters */}
        {dayActivities.length > 0 && (
          <div className="px-4 pt-3 pb-2 border-b border-gray-100 bg-gray-50/70 space-y-2">
            {/* Shift filter */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Filter className="w-3 h-3 text-gray-400" />
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Turno</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SHIFT_FILTERS.map(filter => {
                  const isActive = activeShiftFilter === filter.id;
                  const IconComp = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveShiftFilter(filter.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${isActive
                        ? filter.id === 'all'
                          ? 'bg-gray-800 text-white border-gray-800'
                          : filter.id === SHIFTS.NIGHT.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : filter.id === SHIFTS.MORNING.id
                              ? 'bg-yellow-500 text-white border-yellow-500'
                              : 'bg-orange-500 text-white border-orange-500'
                        : filter.color
                        }`}
                    >
                      {IconComp && <IconComp className="w-3 h-3" />}
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client filter – only shown if there are activities with clients */}
            {hasClients && (
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Cliente</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueClients.map(client => {
                    const isActive = activeClientFilter === client;
                    return (
                      <button
                        key={client}
                        onClick={() => setActiveClientFilter(client)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${isActive
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                          }`}
                      >
                        {client === 'all' ? 'Todos' : client}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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
          ) : filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Filter className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Sin resultados</p>
              <p className="text-gray-400 text-sm mt-1">No hay tareas con los filtros seleccionados</p>
            </div>
          ) : (
            filteredActivities.map(activity => {
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
                  className={`rounded-xl border transition-all duration-200 ${isCompleted
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    {/* Toggle button */}
                    <button
                      onClick={(e) => onToggleCompletion(e, activity.id, dateStr)}
                      className={`shrink-0 transition-colors rounded-full ${isCompleted
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

                    {/* Content - clickable for edit (admin only) */}
                    <div
                      className={`flex-1 min-w-0 ${userCanManage ? 'cursor-pointer' : 'cursor-default'}`}
                      onClick={(e) => userCanManage && onEditActivity(e, activity, dateStr)}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs font-semibold text-gray-500">{activity.time}</span>
                        {shift && (
                          <span className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full border ${shift.color}`}>
                            <shift.icon className="w-2.5 h-2.5" />
                            {shift.label}
                          </span>
                        )}
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

                      {activity.client_name && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="text-xs text-blue-600 font-medium truncate">{activity.client_name}</span>
                        </div>
                      )}

                      {assigneeNames && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Users className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="text-xs text-gray-500 truncate">{assigneeNames}</span>
                        </div>
                      )}
                    </div>

                    {/* Edit arrow - admin only */}
                    {userCanManage && (
                      <button
                        onClick={(e) => onEditActivity(e, activity, dateStr)}
                        className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors p-1"
                        title="Editar tarea"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer - Nueva Tarea solo para admins */}
        {userCanManage && (
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/80">
            <button
              onClick={() => { onNewActivity(day); onClose(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nueva Tarea para este día
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
