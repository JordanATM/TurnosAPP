import React, { useMemo } from 'react';
import { Users, Sun, Sunset, Moon, Calendar } from 'lucide-react';
import { getShiftFromTime } from '../../utils/shifts';
import { isActivityVisibleOnDate } from '../../utils/helpers';
import { SHIFTS } from '../../constants/shifts';

export function ShiftsSummary({
  currentDate,
  activities,
  deletedInstances,
  people
}) {
  // Calcular los días del mes actual
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Agrupar turnos por ingeniero y tipo de turno
  const shiftsByPerson = useMemo(() => {
    const result = {};

    // Inicializar estructura para cada persona
    people.forEach(person => {
      result[person.id] = {
        name: person.name,
        morning: [],
        afternoon: [],
        night: [],
        total: 0
      };
    });

    // Recorrer cada día del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Recorrer todas las actividades
      activities.forEach(activity => {
        // Verificar si la actividad es visible en esta fecha
        if (isActivityVisibleOnDate(activity, dateStr, deletedInstances)) {
          const shift = getShiftFromTime(activity.time);

          // Agregar la actividad a cada persona asignada
          activity.assignees?.forEach(personId => {
            if (result[personId]) {
              const shiftData = {
                day,
                date: dateStr,
                title: activity.title,
                time: activity.time
              };

              if (shift === 'morning') {
                result[personId].morning.push(shiftData);
              } else if (shift === 'afternoon') {
                result[personId].afternoon.push(shiftData);
              } else if (shift === 'night') {
                result[personId].night.push(shiftData);
              }

              result[personId].total++;
            }
          });
        }
      });
    }

    return result;
  }, [activities, deletedInstances, currentDate, daysInMonth, people]);

  // Calcular estadísticas generales
  const stats = useMemo(() => {
    let totalMorning = 0;
    let totalAfternoon = 0;
    let totalNight = 0;

    Object.values(shiftsByPerson).forEach(person => {
      totalMorning += person.morning.length;
      totalAfternoon += person.afternoon.length;
      totalNight += person.night.length;
    });

    return {
      totalMorning,
      totalAfternoon,
      totalNight,
      total: totalMorning + totalAfternoon + totalNight
    };
  }, [shiftsByPerson]);

  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header con estadísticas generales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              Resumen de Turnos - {monthName}
            </h2>
            <p className="text-sm text-gray-600">
              Total de turnos asignados: {stats.total}
            </p>
          </div>
        </div>

        {/* Estadísticas por tipo de turno */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-900">Mañana</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.totalMorning}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Sunset className="w-5 h-5 text-orange-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-900">Tarde</p>
                <p className="text-2xl font-bold text-orange-700">{stats.totalAfternoon}</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Moon className="w-5 h-5 text-indigo-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-900">Noche</p>
                <p className="text-2xl font-bold text-indigo-700">{stats.totalNight}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de turnos por ingeniero */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Turnos por Ingeniero</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Ingeniero
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-600" />
                    <span>Mañana</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-2">
                    <Sunset className="w-4 h-4 text-orange-600" />
                    <span>Tarde</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span>Noche</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(shiftsByPerson).map(([personId, data]) => (
                <tr key={personId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-700">
                          {data.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{data.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold ${
                      data.morning.length > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-50 text-gray-400'
                    }`}>
                      {data.morning.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold ${
                      data.afternoon.length > 0
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-50 text-gray-400'
                    }`}>
                      {data.afternoon.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold ${
                      data.night.length > 0
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-50 text-gray-400'
                    }`}>
                      {data.night.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-700 rounded-lg font-bold">
                      {data.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {people.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay ingenieros registrados</p>
            <p className="text-sm text-gray-400 mt-1">
              Agrega ingenieros desde el botón "Gestionar Personal"
            </p>
          </div>
        )}
      </div>

      {/* Detalle expandible por persona (opcional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(shiftsByPerson).map(([personId, data]) => {
          if (data.total === 0) return null;

          return (
            <div
              key={personId}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-700">
                    {data.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900">{data.name}</h4>
              </div>

              <div className="space-y-2">
                {data.morning.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Sun className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-600">Días mañana:</span>
                    <span className="font-medium text-yellow-700">
                      {data.morning.map(s => s.day).join(', ')}
                    </span>
                  </div>
                )}

                {data.afternoon.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Sunset className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-600">Días tarde:</span>
                    <span className="font-medium text-orange-700">
                      {data.afternoon.map(s => s.day).join(', ')}
                    </span>
                  </div>
                )}

                {data.night.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-600">Días noche:</span>
                    <span className="font-medium text-indigo-700">
                      {data.night.map(s => s.day).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
