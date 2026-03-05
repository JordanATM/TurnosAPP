import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  Users,
  CheckCircle2,
  Edit3,
  AlertCircle,
  Zap,
  Building2,
  Sun,
  Sunset,
  Moon,
  Info
} from 'lucide-react';
import { FREQUENCY, SHIFTS } from '../../constants';
import { getEngineersOnShift } from '../../utils';
import { fetchShiftsByDate } from '../../services/shiftsService';

// Configuración de turnos con hora representativa
const SHIFT_OPTIONS = [
  { ...SHIFTS.NIGHT, Icon: Moon, defaultTime: '00:00', activeClass: 'bg-indigo-600 border-indigo-600 text-white', ringClass: 'ring-indigo-400' },
  { ...SHIFTS.MORNING, Icon: Sun, defaultTime: '08:00', activeClass: 'bg-yellow-500 border-yellow-500 text-white', ringClass: 'ring-yellow-400' },
  { ...SHIFTS.AFTERNOON, Icon: Sunset, defaultTime: '16:00', activeClass: 'bg-orange-500 border-orange-500 text-white', ringClass: 'ring-orange-400' },
];

export function ActivityModal({
  isOpen, onClose, onSave, onDelete,
  initialData, instanceDate, selectedDate, people, shifts = []
}) {
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    frequency: 'once',
    description: '',
    assignees: [],
  });

  // Turnos seleccionados (al menos 1). Al editar, solo 1 posible.
  const [selectedShifts, setSelectedShifts] = useState(['morning']);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [dateShifts, setDateShifts] = useState([]);
  const [loadingShifts, setLoadingShifts] = useState(false);

  const isCreating = !initialData;
  const isEditingRecurringInstance = initialData && instanceDate && initialData.frequency !== 'once';

  const dateStr = initialData
    ? initialData.date
    : `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  // ── Cargar turnos de la fecha ──
  const loadShiftsForDate = async () => {
    try {
      setLoadingShifts(true);
      const data = await fetchShiftsByDate(dateStr);
      setDateShifts(data);
    } catch {
      setDateShifts([]);
    } finally {
      setLoadingShifts(false);
    }
  };

  useEffect(() => {
    if (isOpen && dateStr) loadShiftsForDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dateStr]);

  // ── Inicializar formulario ──
  useEffect(() => {
    if (initialData) {
      const freq = initialData.frequency || (initialData.isPeriodic ? 'daily' : 'once');
      setFormData({ ...initialData, frequency: freq, client_name: initialData.client_name || '' });

      // Detectar turno desde la hora guardada
      const hour = parseInt((initialData.time || '08:00').split(':')[0], 10);
      let detectedShift = 'morning';
      if (hour >= 0 && hour <= 7) detectedShift = 'night';
      else if (hour >= 16 && hour <= 23) detectedShift = 'afternoon';
      setSelectedShifts([detectedShift]);
    } else {
      setFormData({ title: '', client_name: '', description: '', frequency: 'once', assignees: [] });
      setSelectedShifts(['morning']);
    }
    setShowEditOptions(false);
    setShowDeleteOptions(false);
  }, [initialData, isOpen]);

  // ── Ingenieros en turno ──
  // Si hay exactamente 1 turno seleccionado, mostrar picker de responsables
  const singleShiftConfig = selectedShifts.length === 1
    ? SHIFT_OPTIONS.find(s => s.id === selectedShifts[0])
    : null;

  const engineersOnSingleShift = singleShiftConfig
    ? getEngineersOnShift(dateShifts, dateStr, singleShiftConfig.id)
    : [];

  // ── Toggle de turno ──
  const toggleShift = (shiftId) => {
    if (!isCreating) {
      // Al editar: solo 1 turno posible
      setSelectedShifts([shiftId]);
      return;
    }
    setSelectedShifts(prev => {
      if (prev.includes(shiftId)) {
        if (prev.length === 1) return prev; // Al menos 1 siempre seleccionado
        return prev.filter(id => id !== shiftId);
      }
      return [...prev, shiftId];
    });
  };

  // ── Asignados manual ──
  const toggleAssignee = (personId) => {
    setFormData(prev => {
      const exists = prev.assignees.includes(personId);
      return exists
        ? { ...prev, assignees: prev.assignees.filter(id => id !== personId) }
        : { ...prev, assignees: [...prev.assignees, personId] };
    });
  };

  // ── Submit ──
  const handleSubmit = (e, saveOption = 'all') => {
    e.preventDefault();

    if (isEditingRecurringInstance && !showEditOptions) {
      setShowEditOptions(true);
      return;
    }

    const isRecurring = formData.frequency !== 'once';
    const hasManualAssignees = formData.assignees.length > 0;
    const shouldAutoAssign = isRecurring && !hasManualAssignees;
    const manualOrAutoAssignees = hasManualAssignees ? formData.assignees : engineersOnSingleShift;

    // Construir payload por turno
    const shiftPayloads = selectedShifts.map((shiftId, index) => {
      const shiftCfg = SHIFT_OPTIONS.find(s => s.id === shiftId);
      const isFirst = index === 0;

      let assignees, auto_assign;
      if (isFirst && selectedShifts.length === 1) {
        // Turno único: respetar selección manual
        assignees = shouldAutoAssign ? [] : manualOrAutoAssignees;
        auto_assign = shouldAutoAssign;
      } else if (isFirst) {
        // Primer turno de multi: usar selección del usuario (sin manual picker en multi)
        assignees = isRecurring ? [] : getEngineersOnShift(dateShifts, dateStr, shiftId);
        auto_assign = isRecurring;
      } else {
        // Turnos extra: siempre auto
        assignees = isRecurring ? [] : getEngineersOnShift(dateShifts, dateStr, shiftId);
        auto_assign = isRecurring;
      }

      return {
        shiftId,
        time: shiftCfg?.defaultTime ?? '08:00',
        assignees,
        auto_assign,
      };
    });

    onSave({
      ...formData,
      date: dateStr,
      _displayDay: undefined,
      shiftPayloads,
    }, saveOption);

    setShowEditOptions(false);
    setShowDeleteOptions(false);
  };

  const handleDeleteClick = () => {
    if (isEditingRecurringInstance && !showDeleteOptions) {
      setShowDeleteOptions(true);
      setShowEditOptions(false);
      return;
    }
    onDelete(initialData.id, 'all');
    setShowDeleteOptions(false);
  };

  const handleDeleteOption = (opt) => {
    onDelete(initialData.id, opt);
    setShowDeleteOptions(false);
  };

  const totalToCreate = selectedShifts.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? 'Editar Actividad' : 'Nueva Actividad'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              placeholder="Ej. Mantenimiento de Servidores"
            />
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-gray-400" />
                Cliente <span className="text-gray-400 font-normal">(opcional)</span>
              </span>
            </label>
            <input
              type="text"
              value={formData.client_name}
              onChange={e => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              placeholder="Ej. Empresa ABC"
            />
          </div>

          {/* ── Selector de turnos ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isCreating ? 'Turnos' : 'Turno'}
              {isCreating && (
                <span className="ml-2 text-xs font-normal text-gray-500">
                  — Selecciona uno o varios
                </span>
              )}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SHIFT_OPTIONS.map(shift => {
                const isSelected = selectedShifts.includes(shift.id);
                const ShiftIcon = shift.Icon;
                const engOnShift = getEngineersOnShift(dateShifts, dateStr, shift.id);
                const engNames = engOnShift
                  .map(id => people.find(p => p.id === id)?.name)
                  .filter(Boolean);

                return (
                  <button
                    key={shift.id}
                    type="button"
                    onClick={() => toggleShift(shift.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${isSelected
                        ? `${shift.activeClass} ring-2 ${shift.ringClass} shadow-sm`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <ShiftIcon className="w-4 h-4" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white bg-white/30' : 'border-gray-300'
                        }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{shift.label}</span>
                    <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                      {shift.defaultTime}hs
                    </span>
                    {loadingShifts ? null : engNames.length > 0 ? (
                      <span className={`text-[10px] truncate w-full text-center ${isSelected ? 'text-white/90' : 'text-green-600'}`}>
                        👤 {engNames.length === 1 ? engNames[0] : `${engNames.length} ing.`}
                      </span>
                    ) : (
                      <span className={`text-[10px] ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                        Sin asignar
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Info de creación múltiple */}
            {isCreating && totalToCreate > 1 && (
              <div className="mt-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-700 font-medium">
                  Se crearán <span className="font-bold">{totalToCreate} actividades</span>, una por cada turno seleccionado
                </p>
              </div>
            )}
          </div>

          {/* ── Responsables (solo si 1 turno seleccionado) ── */}
          {singleShiftConfig ? (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4" />
                Responsables
              </label>

              {loadingShifts ? (
                <div className="mb-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                  <p className="text-xs text-gray-600">Cargando personal en turno...</p>
                </div>
              ) : formData.assignees.length === 0 && engineersOnSingleShift.length > 0 ? (
                <div className="mb-2 bg-green-50 border border-green-200 rounded-lg p-2.5 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-green-700">
                    <p className="font-semibold">Asignación automática</p>
                    <p className="mt-0.5">
                      {engineersOnSingleShift
                        .map(id => people.find(p => p.id === id)?.name)
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="border border-gray-200 rounded-lg p-3 max-h-36 overflow-y-auto bg-gray-50">
                {people.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-2">No hay personal registrado.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {people.map(person => {
                      const isSelected = formData.assignees.includes(person.id);
                      const isOnShift = engineersOnSingleShift.includes(person.id);
                      return (
                        <div
                          key={person.id}
                          onClick={() => toggleAssignee(person.id)}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-all ${isSelected
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : isOnShift && formData.assignees.length === 0
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-white border-gray-200 hover:border-blue-300'
                            }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : isOnShift && formData.assignees.length === 0
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-400'
                            }`}>
                            {(isSelected || (isOnShift && formData.assignees.length === 0)) && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm truncate">{person.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                {formData.assignees.length > 0
                  ? 'Selección manual activa'
                  : engineersOnSingleShift.length > 0
                    ? 'Sin selección manual – se usará asignación automática'
                    : 'No hay ingenieros en este turno – selecciona manualmente'}
              </p>
            </div>
          ) : (
            /* Múltiples turnos: mostrar info de auto-asignación */
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-semibold">Asignación automática por turno</p>
                <p className="mt-0.5">Cada actividad se asignará a los ingenieros que estén en ese turno</p>
              </div>
            </div>
          )}

          {/* ── Frecuencia ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia</label>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {[FREQUENCY.ONCE, FREQUENCY.DAILY, FREQUENCY.WEEKDAYS].map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, frequency: option.id })}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-sm transition-all ${formData.frequency === option.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <option.icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium text-center">{option.label}</span>
                  </button>
                ))}
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1.5">Días específicos:</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[FREQUENCY.MONDAY, FREQUENCY.TUESDAY, FREQUENCY.WEDNESDAY, FREQUENCY.THURSDAY,
                  FREQUENCY.FRIDAY, FREQUENCY.SATURDAY, FREQUENCY.SUNDAY].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, frequency: option.id })}
                      className={`flex items-center justify-center px-2 py-1.5 rounded border text-xs transition-all ${formData.frequency === option.id
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 font-semibold'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {option.label.replace('Todos los ', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {formData.frequency !== 'once' && (
              <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded text-center">
                Esta actividad se repetirá automáticamente a partir del día seleccionado.
              </p>
            )}
          </div>

          {/* Panel Opciones Edición */}
          {showEditOptions && isEditingRecurringInstance && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <Edit3 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-blue-900">¿Cómo deseas guardar los cambios?</p>
                  <p className="text-xs text-blue-700 mt-1">Esta es una actividad recurrente del {instanceDate}</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { opt: 'thisOnly', label: 'Solo esta instancia', desc: `Modificar únicamente el evento del ${instanceDate}` },
                  { opt: 'fromThisDate', label: 'Desde esta fecha en adelante', desc: `Modificar este evento y todos los futuros desde el ${instanceDate}` },
                  { opt: 'all', label: 'Toda la serie', desc: 'Modificar todos los eventos recurrentes (pasados y futuros)' },
                ].map(({ opt, label, desc }) => (
                  <button key={opt} type="button" onClick={(e) => handleSubmit(e, opt)}
                    className="w-full px-4 py-3 text-left bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-all">
                    <span className="font-semibold text-blue-900 block">{label}</span>
                    <p className="text-xs text-blue-600 mt-1">{desc}</p>
                  </button>
                ))}
                <button type="button" onClick={() => setShowEditOptions(false)}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Panel Opciones Eliminación */}
          {showDeleteOptions && isEditingRecurringInstance && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-900">¿Qué deseas eliminar?</p>
                  <p className="text-xs text-red-700 mt-1">Esta acción no se puede deshacer</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { opt: 'thisOnly', label: 'Solo esta instancia', desc: `Eliminar únicamente el evento del ${instanceDate}` },
                  { opt: 'fromThisDate', label: 'Desde esta fecha en adelante', desc: `Eliminar este evento y todos los futuros desde el ${instanceDate}` },
                  { opt: 'all', label: 'Toda la serie completa', desc: 'Eliminar todos los eventos recurrentes (pasados y futuros)' },
                ].map(({ opt, label, desc }) => (
                  <button key={opt} type="button" onClick={() => handleDeleteOption(opt)}
                    className="w-full px-4 py-3 text-left bg-white border-2 border-red-200 hover:border-red-400 hover:bg-red-50 rounded-lg transition-all">
                    <span className="font-semibold text-red-900 block">{label}</span>
                    <p className="text-xs text-red-600 mt-1">{desc}</p>
                  </button>
                ))}
                <button type="button" onClick={() => setShowDeleteOptions(false)}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          {!showEditOptions && !showDeleteOptions && (
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              {initialData && (
                <button type="button" onClick={handleDeleteClick}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md text-sm font-medium transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              )}
              <div className="flex-1" />
              <button type="button" onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors">
                Cancelar
              </button>
              <button type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isCreating && totalToCreate > 1
                  ? `Crear ${totalToCreate} actividades`
                  : 'Guardar'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
