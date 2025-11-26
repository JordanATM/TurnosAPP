import React, { useState } from 'react';
import { CalendarHeader } from './components/calendar/CalendarHeader';
import { CalendarNavigation } from './components/calendar/CalendarNavigation';
import { CalendarGrid } from './components/calendar/CalendarGrid';
import { ActivityModal } from './components/modals/ActivityModal';
import { PeopleModal } from './components/modals/PeopleModal';
import { getDaysInMonth } from './utils';
import { useSupabaseData } from './hooks/useSupabaseData';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingInstanceDate, setEditingInstanceDate] = useState(null);

  // Hook de Supabase para manejar todos los datos
  const {
    people,
    activities,
    completedInstances,
    deletedInstances,
    loading,
    error,
    handleAddPerson,
    handleDeletePerson,
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleToggleCompletion,
    handleAddDeletedInstance
  } = useSupabaseData();

  const { days, firstDay } = getDaysInMonth(currentDate);

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

  const addPerson = async (name) => {
    if (name.trim()) {
      try {
        await handleAddPerson(name);
      } catch (err) {
        console.error('Error adding person:', err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-red-800 font-bold text-lg mb-2">Error de Conexión</h3>
            <p className="text-red-600 mb-4">{error}</p>
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
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          onDayClick={handleDayClick}
          onEditActivity={handleEditActivity}
          onToggleCompletion={toggleCompletion}
        />
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
          people={people}
        />
      )}

      {isPeopleModalOpen && (
        <PeopleModal
          isOpen={isPeopleModalOpen}
          onClose={() => setIsPeopleModalOpen(false)}
          people={people}
          onAdd={addPerson}
          onRemove={removePerson}
        />
      )}
    </div>
  );
}
