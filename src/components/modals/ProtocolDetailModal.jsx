import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, Square, CheckSquare } from 'lucide-react';

export function ProtocolDetailModal({ isOpen, onClose, protocol }) {
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    // Reset checklist cuando se abre un nuevo protocolo
    if (isOpen && protocol) {
      setCheckedItems([]);
    }
  }, [isOpen, protocol]);

  if (!isOpen || !protocol) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleCheckItem = (index) => {
    setCheckedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const getChecklistItems = () => {
    if (protocol.type !== 'checklist') return [];
    return protocol.instructions
      .split('\n')
      .filter(line => line.trim() !== '');
  };

  const isChecklist = protocol.type === 'checklist';
  const checklistItems = isChecklist ? getChecklistItems() : [];
  const progress = isChecklist && checklistItems.length > 0
    ? Math.round((checkedItems.length / checklistItems.length) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {protocol.name}
              </h2>
              {protocol.updated_at && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>Última actualización: {formatDate(protocol.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isChecklist ? (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progreso</span>
                  <span className="text-sm font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {checkedItems.length} de {checklistItems.length} pasos completados
                </p>
              </div>

              {/* Checklist Items */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Pasos a seguir
                </h3>
                <div className="space-y-2">
                  {checklistItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => toggleCheckItem(index)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                        checkedItems.includes(index)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="pt-0.5">
                        {checkedItems.includes(index) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <span
                        className={`flex-1 text-sm ${
                          checkedItems.includes(index)
                            ? 'text-blue-700 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Instrucciones
                </h3>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {protocol.instructions}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
