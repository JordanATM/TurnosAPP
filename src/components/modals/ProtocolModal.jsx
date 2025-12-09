import React, { useState, useEffect } from 'react';
import { X, FileText, Save, ListChecks, AlignLeft } from 'lucide-react';

export function ProtocolModal({ isOpen, onClose, onSave, protocol }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (protocol) {
      setName(protocol.name);
      setType(protocol.type || 'text');
      setInstructions(protocol.instructions);
    } else {
      setName('');
      setType('text');
      setInstructions('');
    }
  }, [protocol, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && instructions.trim()) {
      onSave({
        id: protocol?.id,
        name: name.trim(),
        type: type,
        instructions: instructions.trim()
      });
      setName('');
      setType('text');
      setInstructions('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {protocol ? 'Editar Protocolo' : 'Nuevo Protocolo'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Protocolo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Protocolo de Escalamiento de Incidentes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Protocolo <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('text')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  type === 'text'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <AlignLeft className="w-5 h-5" />
                <span className="font-medium">Texto</span>
              </button>
              <button
                type="button"
                onClick={() => setType('checklist')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  type === 'checklist'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <ListChecks className="w-5 h-5" />
                <span className="font-medium">Checklist</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {type === 'text'
                ? 'Protocolo de texto simple para lectura'
                : 'Lista de pasos que se pueden marcar como completados'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'text' ? 'Instrucciones' : 'Pasos del Checklist'} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={
                type === 'text'
                  ? 'Escribe las instrucciones del protocolo...'
                  : 'Escribe cada paso en una línea nueva:\n\n1. Verificar acceso al sistema\n2. Revisar logs de error\n3. Contactar al equipo técnico'
              }
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-y"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {type === 'text'
                ? 'Puedes usar saltos de línea para organizar mejor las instrucciones'
                : 'Escribe cada paso en una línea nueva. Los ingenieros podrán marcar cada paso como completado.'}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              <Save className="w-5 h-5" />
              {protocol ? 'Actualizar' : 'Crear Protocolo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
