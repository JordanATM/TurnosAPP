import React, { useState } from 'react';
import { X, UserPlus, Trash2 } from 'lucide-react';

export function PeopleModal({ isOpen, onClose, people, onAdd, onRemove }) {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newName);
    setNewName('');
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
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre del empleado..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700">
              <UserPlus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {people.map(person => (
              <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                <span className="font-medium text-gray-700">{person.name}</span>
                <button
                  onClick={() => onRemove(person.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {people.length === 0 && <p className="text-center text-gray-400 text-sm">Sin registros.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
