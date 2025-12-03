import React, { useState } from 'react';
import { X, UserPlus, Trash2, Headset, Users, Pencil } from 'lucide-react';

export function PeopleModal({ isOpen, onClose, people, onAdd, onRemove, onUpdate }) {
  const [newName, setNewName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('noc');
  const [editingPerson, setEditingPerson] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPerson) {
      onUpdate(editingPerson.id, newName, selectedTeam);
      setEditingPerson(null);
    } else {
      onAdd(newName, selectedTeam);
    }
    setNewName('');
    setSelectedTeam('noc');
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setNewName(person.name);
    setSelectedTeam(person.team);
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
    setNewName('');
    setSelectedTeam('noc');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Gestionar Personal</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {editingPerson && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                <p className="text-sm text-blue-800 font-medium">
                  Editando: {editingPerson.name}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del empleado
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipo
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTeam('noc')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedTeam === 'noc'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Headset className="w-5 h-5" />
                  <span className="font-medium">NOC</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTeam('support')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedTeam === 'support'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Soporte</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              {editingPerson && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className={`${editingPerson ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium`}
              >
                {editingPerson ? (
                  <>
                    <Pencil className="w-5 h-5" />
                    Actualizar Personal
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Agregar Personal
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Personal Registrado</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {people.map(person => (
                <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      person.team === 'noc' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {person.team === 'noc' ? (
                        <Headset className="w-4 h-4 text-blue-700" />
                      ) : (
                        <Users className="w-4 h-4 text-green-700" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{person.name}</p>
                      <p className="text-xs text-gray-500">
                        {person.team === 'noc' ? 'NOC' : 'Ingenieros de Soporte'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(person)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemove(person.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {people.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Sin personal registrado.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
