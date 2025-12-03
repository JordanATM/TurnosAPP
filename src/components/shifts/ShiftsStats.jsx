import React, { useMemo } from 'react';
import { Users, Sun, Sunset, Moon, Calendar, TrendingUp } from 'lucide-react';

export function ShiftsStats({ currentDate, shifts, people }) {
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  // Calcular estadísticas
  const stats = useMemo(() => {
    // Filtrar solo personal y turnos NOC
    const nocPeople = people.filter(p => p.team === 'noc');
    const nocShifts = shifts.filter(s => s.team === 'noc');

    const statsByPerson = {};
    let totalMorning = 0;
    let totalAfternoon = 0;
    let totalNight = 0;

    // Inicializar para cada persona NOC
    nocPeople.forEach(person => {
      statsByPerson[person.id] = {
        name: person.name,
        morning: 0,
        afternoon: 0,
        night: 0,
        total: 0,
        days: []
      };
    });

    // Contar turnos NOC
    nocShifts.forEach(shift => {
      if (statsByPerson[shift.person_id]) {
        statsByPerson[shift.person_id][shift.shift_type]++;
        statsByPerson[shift.person_id].total++;

        // Extraer día del mes
        const day = parseInt(shift.date.split('-')[2]);
        if (!statsByPerson[shift.person_id].days.includes(day)) {
          statsByPerson[shift.person_id].days.push(day);
        }

        // Contar totales
        if (shift.shift_type === 'morning') totalMorning++;
        if (shift.shift_type === 'afternoon') totalAfternoon++;
        if (shift.shift_type === 'night') totalNight++;
      }
    });

    // Ordenar días
    Object.values(statsByPerson).forEach(person => {
      person.days.sort((a, b) => a - b);
    });

    return {
      byPerson: statsByPerson,
      totalMorning,
      totalAfternoon,
      totalNight,
      total: totalMorning + totalAfternoon + totalNight
    };
  }, [shifts, people]);

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              Estadísticas NOC - {monthName}
            </h2>
            <p className="text-sm text-gray-600">
              Total de turnos asignados (NOC): {stats.total}
            </p>
          </div>
        </div>

        {/* Totales por tipo de turno */}
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
            <h3 className="font-semibold text-gray-900">Distribución por Ingeniero NOC</h3>
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
              {Object.entries(stats.byPerson).map(([personId, data]) => (
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
                      data.morning > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-50 text-gray-400'
                    }`}>
                      {data.morning}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold ${
                      data.afternoon > 0
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-50 text-gray-400'
                    }`}>
                      {data.afternoon}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold ${
                      data.night > 0
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-50 text-gray-400'
                    }`}>
                      {data.night}
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

        {people.filter(p => p.team === 'noc').length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay ingenieros NOC registrados</p>
            <p className="text-sm text-gray-400 mt-1">
              Agrega ingenieros NOC desde el botón "Gestionar Personal"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
