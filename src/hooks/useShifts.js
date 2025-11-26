import { useState, useEffect } from 'react';
import {
  fetchShiftsByMonth,
  addShift,
  updateShift,
  deleteShift,
  deleteShiftByPersonDateType
} from '../services/shiftsService';

/**
 * Hook personalizado para manejar los turnos (shifts)
 * Sistema independiente del calendario de actividades
 */
export const useShifts = (currentDate) => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // Cargar turnos del mes actual
  useEffect(() => {
    loadShifts();
  }, [year, month]);

  const loadShifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchShiftsByMonth(year, month);
      setShifts(data);
    } catch (err) {
      console.error('Error loading shifts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLERS ====================

  /**
   * Agregar un nuevo turno
   */
  const handleAddShift = async (shiftData) => {
    try {
      const newShift = await addShift(shiftData);
      setShifts([...shifts, newShift]);
      return newShift;
    } catch (err) {
      console.error('Error adding shift:', err);
      setError(err.message);
      throw err;
    }
  };

  /**
   * Actualizar un turno existente
   */
  const handleUpdateShift = async (id, shiftData) => {
    try {
      const updatedShift = await updateShift(id, shiftData);
      setShifts(shifts.map(s => s.id === id ? updatedShift : s));
      return updatedShift;
    } catch (err) {
      console.error('Error updating shift:', err);
      setError(err.message);
      throw err;
    }
  };

  /**
   * Eliminar un turno
   */
  const handleDeleteShift = async (id) => {
    try {
      await deleteShift(id);
      setShifts(shifts.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting shift:', err);
      setError(err.message);
      throw err;
    }
  };

  /**
   * Toggle de turno: si existe lo elimina, si no existe lo crea
   */
  const handleToggleShift = async (personId, date, shiftType) => {
    try {
      // Buscar si ya existe el turno
      const existingShift = shifts.find(
        s => s.person_id === personId && s.date === date && s.shift_type === shiftType
      );

      if (existingShift) {
        // Si existe, eliminarlo
        await handleDeleteShift(existingShift.id);
      } else {
        // Si no existe, crearlo
        await handleAddShift({
          personId,
          date,
          shiftType,
          notes: null
        });
      }
    } catch (err) {
      console.error('Error toggling shift:', err);
      throw err;
    }
  };

  /**
   * Obtener turnos de un día específico
   */
  const getShiftsByDate = (dateStr) => {
    return shifts.filter(s => s.date === dateStr);
  };

  /**
   * Obtener turnos de una persona específica
   */
  const getShiftsByPerson = (personId) => {
    return shifts.filter(s => s.person_id === personId);
  };

  /**
   * Verificar si una persona tiene un turno específico
   */
  const hasShift = (personId, date, shiftType) => {
    return shifts.some(
      s => s.person_id === personId && s.date === date && s.shift_type === shiftType
    );
  };

  /**
   * Obtener estadísticas de turnos por persona
   */
  const getShiftStatsByPerson = () => {
    const stats = {};

    shifts.forEach(shift => {
      if (!stats[shift.person_id]) {
        stats[shift.person_id] = {
          morning: 0,
          afternoon: 0,
          night: 0,
          total: 0
        };
      }

      stats[shift.person_id][shift.shift_type]++;
      stats[shift.person_id].total++;
    });

    return stats;
  };

  return {
    // State
    shifts,
    loading,
    error,

    // Handlers
    handleAddShift,
    handleUpdateShift,
    handleDeleteShift,
    handleToggleShift,

    // Utilities
    getShiftsByDate,
    getShiftsByPerson,
    hasShift,
    getShiftStatsByPerson,
    reloadShifts: loadShifts
  };
};
