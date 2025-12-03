import React, { useState } from 'react';
import { Phone, Mail, User, Plus, Pencil, Trash2 } from 'lucide-react';
import { isAdmin } from '../../utils/roles';
import { useAuth } from '../../contexts/AuthContext';

export function ContactsView({ contacts, onAddContact, onEditContact, onDeleteContact }) {
  const { user } = useAuth();
  const userIsAdmin = isAdmin(user);

  const handleWhatsAppClick = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contactos</h2>
          <p className="text-gray-600 mt-1">Directorio de contactos del equipo</p>
        </div>
        {userIsAdmin && (
          <button
            onClick={onAddContact}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Contacto
          </button>
        )}
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hay contactos</h3>
          <p className="text-gray-600">
            {userIsAdmin
              ? 'Comienza agregando tu primer contacto'
              : 'No hay contactos disponibles en este momento'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.position}</p>
                  </div>
                </div>
                {userIsAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEditContact(contact)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Editar contacto"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteContact(contact.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar contacto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleWhatsAppClick(contact.phone)}
                  className="w-full flex items-center gap-3 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 p-2 rounded transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 group-hover:bg-green-100 rounded-full transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{contact.phone}</span>
                </button>

                <a
                  href={`mailto:${contact.email}`}
                  className="w-full flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-full transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="truncate">{contact.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
