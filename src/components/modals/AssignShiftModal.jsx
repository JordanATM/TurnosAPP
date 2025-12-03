import React, { useState, useEffect } from 'react';
import { X, Sun, Sunset, Moon, Check, UserCircle, Lock, Wrench, Laptop } from 'lucide-react';
import { SHIFTS } from '../../constants/shifts';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../utils/roles';

export function AssignShiftModal({
  isOpen,
  onClose,
  date,
  people,
  shifts,
  onToggleShift,
  team = 'noc'
}) {
  const { user } = useAuth();
  const userIsAdmin = isAdmin(user);

  if (!isOpen) return null;

  // Filtrar turnos y personas por equipo
  const filteredShifts = shifts.filter(s => s.team === team);
  const filteredPeople = people.filter(p => p.team === team);

  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Verificar si una persona tiene un turno específico
  const hasShift = (personId, shiftType) => {
    return filteredShifts.some(s =>
      s.person_id === personId &&
      s.date === date &&
      s.shift_type === shiftType
    );
  };

  // Manejar click en un turno
  const handleToggle = async (personId, shiftType) => {
    // Solo permitir modificar turnos si es admin
    if (!userIsAdmin) return;

    try {
      await onToggleShift(personId, date, shiftType, team);
    } catch (err) {
      console.error('Error toggling shift:', err);
    }
  };

  // Tipos de turno según el equipo
  const shiftTypes = team === 'support'
    ? [
        {
          id: 'support',
          label: 'Turno Soporte',
          icon: Wrench,
          color: 'blue',
          time: ''
        },
        {
          id: 'tam',
          label: 'Turno TAM',
          icon: Laptop,
          color: 'green',
          time: ''
        }
      ]
    : [
        {
          id: 'night',
          label: 'Noche',
          icon: Moon,
          color: 'indigo',
          time: '00:00 - 07:00'
        },
        {
          id: 'morning',
          label: 'Mañana',
          icon: Sun,
          color: 'yellow',
          time: '08:00 - 15:00'
        },
        {
          id: 'afternoon',
          label: 'Tarde',
          icon: Sunset,
          color: 'orange',
          time: '16:00 - 23:00'
        }
      ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {userIsAdmin ? 'Asignar Turnos' : 'Ver Turnos'}
              </h2>
              {!userIsAdmin && (
                <Lock className="w-5 h-5 text-blue-100" />
              )}
            </div>
            <p className="text-sm text-blue-100 capitalize mt-1">
              {formattedDate}
            </p>
            {!userIsAdmin && (
              <p className="text-xs text-blue-200 mt-1">
                Solo lectura - Contacta al administrador para modificar
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredPeople.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                No hay {team === 'noc' ? 'personal NOC' : 'ingenieros de soporte'} registrados
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Agrega personal desde "Gestionar Personal"
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tabla de asignación */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        {team === 'noc' ? 'Personal NOC' : 'Ingeniero'}
                      </th>
                      {shiftTypes.map(shift => (
                        <th key={shift.id} className="text-center py-3 px-4">
                          <div className="flex flex-col items-center gap-1">
                            <shift.icon className={`w-5 h-5 text-${shift.color}-600`} />
                            <span className="text-xs font-semibold text-gray-700">
                              {shift.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {shift.time}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPeople.map(person => (
                      <tr key={person.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-700">
                                {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {person.name}
                            </span>
                          </div>
                        </td>

                        {shiftTypes.map(shift => {
                          const isAssigned = hasShift(person.id, shift.id);

                          return (
                            <td key={shift.id} className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleToggle(person.id, shift.id)}
                                disabled={!userIsAdmin}
                                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                                  !userIsAdmin
                                    ? 'cursor-not-allowed opacity-60'
                                    : ''
                                } ${
                                  isAssigned
                                    ? `bg-${shift.color}-100 border-${shift.color}-400 ${userIsAdmin ? `hover:bg-${shift.color}-200` : ''}`
                                    : `bg-white border-gray-200 ${userIsAdmin ? 'hover:border-gray-300 hover:bg-gray-50' : ''}`
                                }`}
                              >
                                {isAssigned && (
                                  <Check className={`w-6 h-6 mx-auto text-${shift.color}-700`} />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Resumen del día
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {shiftTypes.map(shift => {
                    const count = filteredShifts.filter(s =>
                      s.date === date && s.shift_type === shift.id
                    ).length;

                    return (
                      <div key={shift.id} className="flex items-center gap-2">
                        <shift.icon className={`w-4 h-4 text-${shift.color}-600`} />
                        <span className="text-sm text-gray-700">
                          <span className="font-semibold">{count}</span> {shift.label.toLowerCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ayuda */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">
                  {userIsAdmin ? (
                    <>
                      💡 <strong>Tip:</strong> Click en los cuadros para asignar o quitar turnos.
                      Los cambios se guardan automáticamente.
                    </>
                  ) : (
                    <>
                      🔒 <strong>Modo solo lectura:</strong> No tienes permisos para modificar turnos.
                      Solo el administrador puede realizar cambios.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
