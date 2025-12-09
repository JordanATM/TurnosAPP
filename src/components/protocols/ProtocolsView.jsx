import React, { useState } from 'react';
import { FileText, Plus, Eye, Pencil, Trash2, ListChecks } from 'lucide-react';
import { isAdmin } from '../../utils/roles';
import { useAuth } from '../../contexts/AuthContext';

export function ProtocolsView({
  protocols,
  onAdd,
  onEdit,
  onDelete,
  onView
}) {
  const { user } = useAuth();
  const userIsAdmin = isAdmin(user);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Protocolos</h2>
              <p className="text-sm text-gray-600">
                Consulta procedimientos y protocolos de la empresa
              </p>
            </div>
          </div>

          {userIsAdmin && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Protocolo</span>
            </button>
          )}
        </div>
      </div>

      {/* Lista de Protocolos */}
      {protocols.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay protocolos registrados
          </h3>
          <p className="text-gray-500">
            {userIsAdmin
              ? 'Crea tu primer protocolo usando el botón "Nuevo Protocolo"'
              : 'Aún no hay protocolos disponibles'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocols.map((protocol) => (
            <div
              key={protocol.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    {protocol.type === 'checklist' ? (
                      <ListChecks className="w-5 h-5 text-blue-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {protocol.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {protocol.type === 'checklist' ? 'Checklist' : 'Texto'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onView(protocol)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Ver Protocolo</span>
                </button>

                {userIsAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(protocol)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(protocol.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
