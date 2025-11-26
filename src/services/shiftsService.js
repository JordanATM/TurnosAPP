import { supabase } from '../config/supabase';

/**
 * Servicio para manejar los turnos (shifts)
 * Sistema independiente del calendario de actividades
 */

// ==================== FETCH OPERATIONS ====================

/**
 * Obtener todos los turnos de un mes específico
 */
export const fetchShiftsByMonth = async (year, month) => {
  try {
    // Calcular primer y último día del mes
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const firstDayStr = firstDay.toISOString().split('T')[0];
    const lastDayStr = lastDay.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .gte('date', firstDayStr)
      .lte('date', lastDayStr)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching shifts by month:', error);
    throw error;
  }
};

/**
 * Obtener todos los turnos (sin filtro de fecha)
 */
export const fetchAllShifts = async () => {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all shifts:', error);
    throw error;
  }
};

/**
 * Obtener turnos de una fecha específica
 */
export const fetchShiftsByDate = async (dateStr) => {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('date', dateStr);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching shifts by date:', error);
    throw error;
  }
};

// ==================== CREATE OPERATIONS ====================

/**
 * Crear un nuevo turno
 */
export const addShift = async (shiftData) => {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .insert([{
        person_id: shiftData.personId,
        date: shiftData.date,
        shift_type: shiftData.shiftType,
        notes: shiftData.notes || null
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding shift:', error);
    throw error;
  }
};

/**
 * Crear múltiples turnos a la vez (útil para copiar semanas, etc.)
 */
export const addMultipleShifts = async (shiftsArray) => {
  try {
    const shiftsToInsert = shiftsArray.map(shift => ({
      person_id: shift.personId,
      date: shift.date,
      shift_type: shift.shiftType,
      notes: shift.notes || null
    }));

    const { data, error } = await supabase
      .from('shifts')
      .insert(shiftsToInsert)
      .select();

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error adding multiple shifts:', error);
    throw error;
  }
};

// ==================== UPDATE OPERATIONS ====================

/**
 * Actualizar un turno existente
 */
export const updateShift = async (id, shiftData) => {
  try {
    const updateData = {};
    if (shiftData.personId) updateData.person_id = shiftData.personId;
    if (shiftData.date) updateData.date = shiftData.date;
    if (shiftData.shiftType) updateData.shift_type = shiftData.shiftType;
    if (shiftData.notes !== undefined) updateData.notes = shiftData.notes;

    const { data, error } = await supabase
      .from('shifts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating shift:', error);
    throw error;
  }
};

// ==================== DELETE OPERATIONS ====================

/**
 * Eliminar un turno específico
 */
export const deleteShift = async (id) => {
  try {
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting shift:', error);
    throw error;
  }
};

/**
 * Eliminar todos los turnos de una fecha específica
 */
export const deleteShiftsByDate = async (dateStr) => {
  try {
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('date', dateStr);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting shifts by date:', error);
    throw error;
  }
};

/**
 * Eliminar un turno específico por persona, fecha y tipo
 */
export const deleteShiftByPersonDateType = async (personId, date, shiftType) => {
  try {
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('person_id', personId)
      .eq('date', date)
      .eq('shift_type', shiftType);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting shift:', error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Verificar si una persona tiene un turno asignado en una fecha y tipo específico
 */
export const checkShiftExists = async (personId, date, shiftType) => {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('id')
      .eq('person_id', personId)
      .eq('date', date)
      .eq('shift_type', shiftType)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking shift existence:', error);
    return false;
  }
};
