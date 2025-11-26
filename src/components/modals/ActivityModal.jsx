import React, { useState, useEffect } from 'react';
import {
  Clock,
  X,
  Save,
  Trash2,
  Users,
  CheckCircle2,
  Edit3,
  AlertCircle
} from 'lucide-react';
import { FREQUENCY } from '../../constants';
import { getShiftFromTime } from '../../utils';

export function ActivityModal({ isOpen, onClose, onSave, onDelete, initialData, instanceDate, selectedDate, people }) {
  const [formData, setFormData] = useState({
    title: '',
    time: '09:00',
    frequency: 'once',
    description: '',
    assignees: []
  });
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);

  const isEditingRecurringInstance = initialData && instanceDate && initialData.frequency !== 'once';

  useEffect(() => {
    if (initialData) {
      const freq = initialData.frequency || (initialData.isPeriodic ? 'daily' : 'once');
      setFormData({ ...initialData, frequency: freq });
    } else {
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        frequency: 'once',
        assignees: [],
        time: '09:00'
      }));
    }
  }, [initialData]);

  const currentShift = getShiftFromTime(formData.time);

  const handleSubmit = (e, saveOption = 'all') => {
    e.preventDefault();

    if (isEditingRecurringInstance && !showEditOptions) {
      // Mostrar opciones si es una instancia recurrente
      setShowEditOptions(true);
      return;
    }

    const dateStr = initialData
      ? initialData.date
      : `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

    onSave({
      ...formData,
      date: dateStr,
      _displayDay: undefined
    }, saveOption);

    setShowEditOptions(false);
    setShowDeleteOptions(false);
  };

  const handleDeleteClick = () => {
    if (isEditingRecurringInstance && !showDeleteOptions) {
      setShowDeleteOptions(true);
      setShowEditOptions(false); // Cerrar el panel de edición si está abierto
      return;
    }

    // Si no es recurrente o ya se mostró el panel, eliminar directamente
    onDelete(initialData.id, 'all');
    setShowDeleteOptions(false);
  };

  const handleDeleteOption = (deleteOption) => {
    onDelete(initialData.id, deleteOption);
    setShowDeleteOptions(false);
  };

  const toggleAssignee = (personId) => {
    setFormData(prev => {
      const exists = prev.assignees.includes(personId);
      if (exists) return { ...prev, assignees: prev.assignees.filter(id => id !== personId) };
      return { ...prev, assignees: [...prev.assignees, personId] };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? 'Editar Actividad' : 'Nueva Actividad'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-md border ${currentShift?.color}`}>
                <currentShift.icon className="w-4 h-4" />
                <span className="text-sm font-medium">Turno {currentShift?.label}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4" />
              Responsables Asignados
            </label>
            <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
              {people.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-2">No hay personal registrado.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {people.map(person => {
                    const isSelected = formData.assignees.includes(person.id);
                    return (
                      <div
                        key={person.id}
                        onClick={() => toggleAssignee(person.id)}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-all ${isSelected ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm truncate">{person.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(FREQUENCY).map(option => (
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
            {formData.frequency !== 'once' && (
              <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded text-center">
                Esta actividad se repetirá automáticamente a partir del día seleccionado.
              </p>
            )}
          </div>

          {/* Panel de Opciones de Edición */}
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
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'thisOnly')}
                  className="w-full px-4 py-3 text-left bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-all group"
                >
                  <span className="font-semibold text-blue-900 block">Solo esta instancia</span>
                  <p className="text-xs text-blue-600 mt-1">Modificar únicamente el evento del {instanceDate}</p>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'fromThisDate')}
                  className="w-full px-4 py-3 text-left bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-all group"
                >
                  <span className="font-semibold text-blue-900 block">Desde esta fecha en adelante</span>
                  <p className="text-xs text-blue-600 mt-1">Modificar este evento y todos los futuros desde el {instanceDate}</p>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'all')}
                  className="w-full px-4 py-3 text-left bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-all group"
                >
                  <span className="font-semibold text-blue-900 block">Toda la serie</span>
                  <p className="text-xs text-blue-600 mt-1">Modificar todos los eventos recurrentes (pasados y futuros)</p>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditOptions(false)}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Panel de Opciones de Eliminación */}
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
                <button
                  type="button"
                  onClick={() => handleDeleteOption('thisOnly')}
                  className="w-full px-4 py-3 text-left bg-white border-2 border-red-200 hover:border-red-400 hover:bg-red-50 rounded-lg transition-all"
                >
                  <span className="font-semibold text-red-900 block">Solo esta instancia</span>
                  <p className="text-xs text-red-600 mt-1">Eliminar únicamente el evento del {instanceDate}</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteOption('fromThisDate')}
                  className="w-full px-4 py-3 text-left bg-white border-2 border-red-200 hover:border-red-400 hover:bg-red-50 rounded-lg transition-all"
                >
                  <span className="font-semibold text-red-900 block">Desde esta fecha en adelante</span>
                  <p className="text-xs text-red-600 mt-1">Eliminar este evento y todos los futuros desde el {instanceDate}</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteOption('all')}
                  className="w-full px-4 py-3 text-left bg-white border-2 border-red-200 hover:border-red-400 hover:bg-red-50 rounded-lg transition-all"
                >
                  <span className="font-semibold text-red-900 block">Toda la serie completa</span>
                  <p className="text-xs text-red-600 mt-1">Eliminar todos los eventos recurrentes (pasados y futuros)</p>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteOptions(false)}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          {!showEditOptions && !showDeleteOptions && (
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              {initialData && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              )}
              <div className="flex-1"></div>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
