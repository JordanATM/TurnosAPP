import React, { useState, useEffect } from 'react';
import { CalendarHeader } from './components/calendar/CalendarHeader';
import { CalendarNavigation } from './components/calendar/CalendarNavigation';
import { CalendarGrid } from './components/calendar/CalendarGrid';
import { ActivityModal } from './components/modals/ActivityModal';
import { PeopleModal } from './components/modals/PeopleModal';
import { ShiftsCalendar } from './components/shifts/ShiftsCalendar';
import { ShiftsStats } from './components/shifts/ShiftsStats';
import { AssignShiftModal } from './components/modals/AssignShiftModal';
import { ContactsView } from './components/contacts/ContactsView';
import { ContactModal } from './components/modals/ContactModal';
import { getDaysInMonth } from './utils';
import { useSupabaseData } from './hooks/useSupabaseData';
import { useShifts } from './hooks/useShifts';
import { fetchContacts, addContact, updateContact, deleteContact } from './services/supabaseService';

export default function App() {
  const [currentView, setCurrentView] = useState('calendar'); // 'calendar', 'shifts' o 'contacts'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [isAssignShiftModalOpen, setIsAssignShiftModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedShiftDate, setSelectedShiftDate] = useState(null);
  const [selectedShiftTeam, setSelectedShiftTeam] = useState('noc');
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingInstanceDate, setEditingInstanceDate] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  // Hook de Supabase para manejar todos los datos de actividades
  const {
    people,
    activities,
    completedInstances,
    deletedInstances,
    loading,
    error,
    handleAddPerson,
    handleUpdatePerson,
    handleDeletePerson,
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleToggleCompletion,
    handleAddDeletedInstance
  } = useSupabaseData();

  // Hook para manejar los turnos (sistema independiente)
  const {
    shifts,
    loading: shiftsLoading,
    error: shiftsError,
    handleToggleShift
  } = useShifts(currentDate);

  const { days, firstDay } = getDaysInMonth(currentDate);

  // Cargar contactos
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setContactsLoading(true);
      const data = await fetchContacts();
      setContacts(data);
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (editingContact) {
        await updateContact(editingContact.id, contactData);
      } else {
        await addContact(contactData);
      }
      await loadContacts();
      setIsContactModalOpen(false);
      setEditingContact(null);
    } catch (err) {
      console.error('Error saving contact:', err);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      try {
        await deleteContact(id);
        await loadContacts();
      } catch (err) {
        console.error('Error deleting contact:', err);
      }
    }
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setEditingActivity(null);
    setEditingInstanceDate(null);
    setIsActivityModalOpen(true);
  };

  const handleEditActivity = (e, activity, instanceDate) => {
    e.stopPropagation();
    setSelectedDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), activity._displayDay || 1).getDate());
    setEditingActivity(activity);
    setEditingInstanceDate(instanceDate);
    setIsActivityModalOpen(true);
  };

  const toggleCompletion = async (e, activityId, dateStr) => {
    e.stopPropagation();
    try {
      await handleToggleCompletion(activityId, dateStr);
    } catch (err) {
      console.error('Error toggling completion:', err);
    }
  };

  const saveActivity = async (activityData, saveOption) => {
    try {
      if (editingActivity && editingInstanceDate) {
        // Editando una instancia específica de una actividad recurrente
        if (saveOption === 'thisOnly') {
          // Crear una nueva actividad para esta fecha específica
          const newActivity = {
            ...activityData,
            frequency: 'once',
            date: editingInstanceDate
          };
          await handleAddActivity(newActivity);

          // Marcar la instancia original como eliminada
          await handleAddDeletedInstance(editingActivity.id, editingInstanceDate);
        } else if (saveOption === 'fromThisDate') {
          // Modificar desde esta fecha en adelante
          // 1. Agregar endDate a la actividad original (terminarla antes de esta fecha)
          const originalWithEnd = {
            ...editingActivity,
            endDate: editingInstanceDate
          };
          await handleUpdateActivity(editingActivity.id, originalWithEnd);

          // 2. Crear una nueva actividad recurrente desde esta fecha con los nuevos datos
          const newRecurringActivity = {
            ...activityData,
            date: editingInstanceDate
          };
          await handleAddActivity(newRecurringActivity);
        } else {
          // Guardar para toda la serie
          await handleUpdateActivity(editingActivity.id, activityData);
        }
      } else if (editingActivity) {
        // Editando una actividad que no es recurrente o editando la serie completa
        await handleUpdateActivity(editingActivity.id, activityData);
      } else {
        // Creando nueva actividad
        const dateStr = selectedDay
          ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
          : new Date().toISOString().split('T')[0];

        await handleAddActivity({ ...activityData, date: dateStr });
      }

      setIsActivityModalOpen(false);
      setEditingInstanceDate(null);
    } catch (err) {
      console.error('Error saving activity:', err);
    }
  };

  const deleteActivity = async (id, deleteOption) => {
    try {
      if (editingActivity && editingInstanceDate) {
        if (deleteOption === 'thisOnly') {
          // Eliminar solo esta instancia
          await handleAddDeletedInstance(id, editingInstanceDate);
        } else if (deleteOption === 'fromThisDate') {
          // Agregar fecha de finalización a la actividad
          const updatedActivity = {
            ...editingActivity,
            endDate: editingInstanceDate
          };
          await handleUpdateActivity(id, updatedActivity);
        } else {
          // Eliminar toda la serie
          await handleDeleteActivity(id);
        }
      } else {
        // Eliminar toda la serie (cuando no hay fecha de instancia)
        await handleDeleteActivity(id);
      }

      setIsActivityModalOpen(false);
      setEditingInstanceDate(null);
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  const addPerson = async (name, team = 'noc') => {
    if (name.trim()) {
      try {
        await handleAddPerson(name, team);
      } catch (err) {
        console.error('Error adding person:', err);
      }
    }
  };

  const updatePerson = async (id, name, team) => {
    if (name.trim()) {
      try {
        await handleUpdatePerson(id, name, team);
      } catch (err) {
        console.error('Error updating person:', err);
      }
    }
  };

  const removePerson = async (id) => {
    try {
      await handleDeletePerson(id);
    } catch (err) {
      console.error('Error removing person:', err);
    }
  };

  const handleNewActivity = () => {
    setSelectedDay(new Date().getDate());
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenAssignModal = (dateStr, team = 'noc') => {
    setSelectedShiftDate(dateStr);
    setSelectedShiftTeam(team);
    setIsAssignShiftModalOpen(true);
  };

  if (loading || shiftsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error || shiftsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-red-800 font-bold text-lg mb-2">Error de Conexión</h3>
            <p className="text-red-600 mb-4">{error || shiftsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <CalendarHeader
        onNewActivity={handleNewActivity}
        onManagePeople={() => setIsPeopleModalOpen(true)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'contacts' ? (
          <ContactsView
            contacts={contacts}
            onAddContact={handleAddContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
          />
        ) : currentView === 'calendar' ? (
          <>
            <CalendarNavigation
              currentDate={currentDate}
              onPreviousMonth={() => changeMonth(-1)}
              onNextMonth={() => changeMonth(1)}
              onToday={() => setCurrentDate(new Date())}
            />

            <CalendarGrid
              currentDate={currentDate}
              firstDay={firstDay}
              days={days}
              activities={activities}
              deletedInstances={deletedInstances}
              completedInstances={completedInstances}
              people={people}
              shifts={shifts}
              onDayClick={handleDayClick}
              onEditActivity={handleEditActivity}
              onToggleCompletion={toggleCompletion}
            />
          </>
        ) : (
          <>
            <CalendarNavigation
              currentDate={currentDate}
              onPreviousMonth={() => changeMonth(-1)}
              onNextMonth={() => changeMonth(1)}
              onToday={() => setCurrentDate(new Date())}
            />

            <div className="space-y-6">
              <ShiftsCalendar
                currentDate={currentDate}
                people={people}
                shifts={shifts}
                onToggleShift={handleToggleShift}
                onOpenAssignModal={handleOpenAssignModal}
              />

              <ShiftsStats
                currentDate={currentDate}
                shifts={shifts}
                people={people}
              />
            </div>
          </>
        )}
      </main>

      {isActivityModalOpen && (
        <ActivityModal
          isOpen={isActivityModalOpen}
          onClose={() => {
            setIsActivityModalOpen(false);
            setEditingInstanceDate(null);
          }}
          onSave={saveActivity}
          onDelete={deleteActivity}
          initialData={editingActivity}
          instanceDate={editingInstanceDate}
          selectedDate={selectedDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) : new Date()}
          people={people.filter(p => p.team === 'noc')}
          shifts={shifts}
        />
      )}

      {isPeopleModalOpen && (
        <PeopleModal
          isOpen={isPeopleModalOpen}
          onClose={() => setIsPeopleModalOpen(false)}
          people={people}
          onAdd={addPerson}
          onUpdate={updatePerson}
          onRemove={removePerson}
        />
      )}

      {isAssignShiftModalOpen && (
        <AssignShiftModal
          isOpen={isAssignShiftModalOpen}
          onClose={() => setIsAssignShiftModalOpen(false)}
          date={selectedShiftDate}
          people={people}
          shifts={shifts}
          onToggleShift={handleToggleShift}
          team={selectedShiftTeam}
        />
      )}

      {isContactModalOpen && (
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => {
            setIsContactModalOpen(false);
            setEditingContact(null);
          }}
          onSave={handleSaveContact}
          initialData={editingContact}
        />
      )}
    </div>
  );
}
