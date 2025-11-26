import { useState, useEffect } from 'react';
import {
  fetchPeople,
  fetchActivities,
  fetchCompletedInstances,
  fetchDeletedInstances,
  addPerson,
  deletePerson,
  addActivity,
  updateActivity,
  deleteActivity,
  addCompletedInstance,
  deleteCompletedInstance,
  addDeletedInstance
} from '../services/supabaseService';

export const useSupabaseData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [people, setPeople] = useState([]);
  const [activities, setActivities] = useState([]);
  const [completedInstances, setCompletedInstances] = useState([]);
  const [deletedInstances, setDeletedInstances] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [peopleData, activitiesData, completedData, deletedData] = await Promise.all([
        fetchPeople(),
        fetchActivities(),
        fetchCompletedInstances(),
        fetchDeletedInstances()
      ]);

      setPeople(peopleData);
      setActivities(activitiesData);
      setCompletedInstances(completedData);
      setDeletedInstances(deletedData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== PEOPLE HANDLERS ====================

  const handleAddPerson = async (name) => {
    try {
      const newPerson = await addPerson(name);
      setPeople([...people, newPerson]);
      return newPerson;
    } catch (err) {
      console.error('Error adding person:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleDeletePerson = async (id) => {
    try {
      await deletePerson(id);
      setPeople(people.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting person:', err);
      setError(err.message);
      throw err;
    }
  };

  // ==================== ACTIVITIES HANDLERS ====================

  const handleAddActivity = async (activityData) => {
    try {
      const newActivity = await addActivity(activityData);
      setActivities([...activities, newActivity]);
      return newActivity;
    } catch (err) {
      console.error('Error adding activity:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleUpdateActivity = async (id, activityData) => {
    try {
      const updatedActivity = await updateActivity(id, activityData);
      setActivities(activities.map(a => a.id === id ? updatedActivity : a));
      return updatedActivity;
    } catch (err) {
      console.error('Error updating activity:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivity(id);
      setActivities(activities.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError(err.message);
      throw err;
    }
  };

  // ==================== COMPLETED INSTANCES HANDLERS ====================

  const handleToggleCompletion = async (activityId, dateStr) => {
    try {
      const instanceKey = `${activityId}_${dateStr}`;

      if (completedInstances.includes(instanceKey)) {
        // Desmarcar como completado
        await deleteCompletedInstance(activityId, dateStr);
        setCompletedInstances(completedInstances.filter(k => k !== instanceKey));
      } else {
        // Marcar como completado
        await addCompletedInstance(activityId, dateStr);
        setCompletedInstances([...completedInstances, instanceKey]);
      }
    } catch (err) {
      console.error('Error toggling completion:', err);
      setError(err.message);
      throw err;
    }
  };

  // ==================== DELETED INSTANCES HANDLERS ====================

  const handleAddDeletedInstance = async (activityId, dateStr) => {
    try {
      await addDeletedInstance(activityId, dateStr);
      const instanceKey = `${activityId}_${dateStr}`;
      setDeletedInstances([...deletedInstances, instanceKey]);
    } catch (err) {
      console.error('Error adding deleted instance:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    // State
    people,
    activities,
    completedInstances,
    deletedInstances,
    loading,
    error,

    // People handlers
    handleAddPerson,
    handleDeletePerson,

    // Activities handlers
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity,

    // Completed instances handlers
    handleToggleCompletion,

    // Deleted instances handlers
    handleAddDeletedInstance,

    // Utility
    reloadData: loadAllData
  };
};
