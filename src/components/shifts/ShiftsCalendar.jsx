import React, { useState } from 'react';
import { Sun, Sunset, Moon, Plus, Calendar as CalendarIcon, Lock, Users, Headset, Wrench, Laptop, Clock } from 'lucide-react';
import { SHIFTS } from '../../constants/shifts';
import { getDaysInMonth } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../utils/roles';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const TEAMS = [
  { id: 'noc', name: 'NOC', icon: Headset },
  { id: 'support', name: 'Ingenieros de Soporte', icon: Users }
];

export function ShiftsCalendar({
  currentDate,
  people,
  shifts,
  onToggleShift,
  onOpenAssignModal
}) {
  const { user } = useAuth();
  const userIsAdmin = isAdmin(user);
  const { days, firstDay } = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() &&
                         currentDate.getFullYear() === today.getFullYear();

  // Estado para el equipo seleccionado
  const [selectedTeam, setSelectedTeam] = useState('noc');

  // Filtrar turnos y personas por equipo seleccionado
  const filteredShifts = shifts.filter(s => s.team === selectedTeam);
  const filteredPeople = people.filter(p => p.team === selectedTeam);

  // Función para obtener los turnos de un día específico
  const getShiftsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredShifts.filter(s => s.date === dateStr);
  };

  // Función para verificar si una persona tiene un turno específico en un día
  const hasShift = (day, shiftType) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredShifts.some(s => s.date === dateStr && s.shift_type === shiftType);
  };

  // Función para obtener las personas con un turno específico en un día
  const getShiftsByType = (day, shiftType) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredShifts.filter(s => s.date === dateStr && s.shift_type === shiftType);
  };

  // Función para obtener el nombre de una persona por ID
  const getPersonName = (personId) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Desconocido';
  };

  const handleDayClick = (day) => {
    // Solo permitir asignar turnos si es admin
    if (!userIsAdmin) return;

    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onOpenAssignModal(dateStr, selectedTeam);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header del calendario */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Calendario de Turnos
              </h2>
              <p className="text-sm text-blue-100">
                {userIsAdmin ? 'Click en un día para asignar turnos' : 'Vista de solo lectura'}
              </p>
            </div>
          </div>

          {/* Selector de equipo */}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            {TEAMS.map((team) => {
              const IconComponent = team.icon;
              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedTeam === team.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{team.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leyenda de turnos */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-6 flex-wrap">
            {selectedTeam === 'noc' ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-400 rounded flex items-center justify-center">
                    <Sun className="w-3 h-3 text-yellow-700" />
                  </div>
                  <span className="text-sm text-gray-700">Mañana</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-100 border-2 border-orange-400 rounded flex items-center justify-center">
                    <Sunset className="w-3 h-3 text-orange-700" />
                  </div>
                  <span className="text-sm text-gray-700">Tarde</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-indigo-100 border-2 border-indigo-400 rounded flex items-center justify-center">
                    <Moon className="w-3 h-3 text-indigo-700" />
                  </div>
                  <span className="text-sm text-gray-700">Noche</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center">
                    <Wrench className="w-3 h-3 text-blue-700" />
                  </div>
                  <span className="text-sm text-gray-700">Turno Soporte</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 border-2 border-green-400 rounded flex items-center justify-center">
                    <Laptop className="w-3 h-3 text-green-700" />
                  </div>
                  <span className="text-sm text-gray-700">Turno TAM</span>
                </div>
              </>
            )}
          </div>

          {/* Tarjeta informativa para turnos de soporte */}
          {selectedTeam === 'support' && (
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="text-xs font-medium text-purple-800">
                Cambio de Turnos: Viernes 18:00
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Grid del calendario */}
      <div className="p-4">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-2">
          {/* Espacios vacíos para el primer día */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px]" />
          ))}

          {/* Días del mes */}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === today.getDate();
            const dayShifts = getShiftsForDay(day);

            // Turnos según el equipo seleccionado
            const shiftsData = selectedTeam === 'support'
              ? [
                  { type: 'support', shifts: getShiftsByType(day, 'support'), icon: Wrench, bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800', iconColor: 'text-blue-600' },
                  { type: 'tam', shifts: getShiftsByType(day, 'tam'), icon: Laptop, bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800', iconColor: 'text-green-600' }
                ]
              : [
                  { type: 'night', shifts: getShiftsByType(day, 'night'), icon: Moon, bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', textColor: 'text-indigo-800', iconColor: 'text-indigo-600' },
                  { type: 'morning', shifts: getShiftsByType(day, 'morning'), icon: Sun, bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800', iconColor: 'text-yellow-600' },
                  { type: 'afternoon', shifts: getShiftsByType(day, 'afternoon'), icon: Sunset, bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-800', iconColor: 'text-orange-600' }
                ];

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`min-h-[120px] border rounded-lg p-2 transition-all ${
                  userIsAdmin
                    ? 'cursor-pointer hover:shadow-md hover:border-blue-400'
                    : 'cursor-default'
                } ${
                  isToday
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : `bg-white border-gray-200 ${userIsAdmin ? 'hover:bg-gray-50' : ''}`
                }`}
              >
                {/* Número del día */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
                  }`}>
                    {day}
                  </span>
                  {dayShifts.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                      {dayShifts.length}
                    </span>
                  )}
                </div>

                {/* Indicadores de turnos con nombres */}
                <div className="space-y-1">
                  {shiftsData.map(({ type, shifts, icon: Icon, bgColor, borderColor, textColor, iconColor }) => (
                    shifts.map((shift, idx) => (
                      <div key={`${type}-${idx}`} className={`flex items-center gap-1.5 ${bgColor} border ${borderColor} rounded px-1.5 py-1`}>
                        <Icon className={`w-3 h-3 ${iconColor} flex-shrink-0`} />
                        <span className={`text-xs ${textColor} font-medium truncate`}>
                          {getPersonName(shift.person_id)}
                        </span>
                      </div>
                    ))
                  ))}

                  {dayShifts.length === 0 && (
                    <div className="flex items-center justify-center h-12 text-gray-300">
                      <Plus className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer con info */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Total de turnos del mes ({TEAMS.find(t => t.id === selectedTeam)?.name}): <span className="font-semibold text-gray-700">{filteredShifts.length}</span>
        </p>
      </div>
    </div>
  );
}
