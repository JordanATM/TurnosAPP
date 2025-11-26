import { supabase } from '../config/supabase';

// ==================== PEOPLE ====================

export const fetchPeople = async () => {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching people:', error);
    throw error;
  }

  return data;
};

export const addPerson = async (name) => {
  const { data, error } = await supabase
    .from('people')
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    console.error('Error adding person:', error);
    throw error;
  }

  return data;
};

export const deletePerson = async (id) => {
  const { error } = await supabase
    .from('people')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting person:', error);
    throw error;
  }

  return true;
};

// ==================== ACTIVITIES ====================

export const fetchActivities = async () => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }

  // Convertir end_date a endDate para mantener compatibilidad con el código existente
  return data.map(activity => ({
    ...activity,
    endDate: activity.end_date,
    end_date: undefined
  }));
};

export const addActivity = async (activityData) => {
  // Convertir endDate a end_date para la base de datos
  const dbData = {
    title: activityData.title,
    time: activityData.time,
    frequency: activityData.frequency,
    date: activityData.date,
    end_date: activityData.endDate || null,
    description: activityData.description || null,
    assignees: activityData.assignees || []
  };

  const { data, error } = await supabase
    .from('activities')
    .insert([dbData])
    .select()
    .single();

  if (error) {
    console.error('Error adding activity:', error);
    throw error;
  }

  return {
    ...data,
    endDate: data.end_date,
    end_date: undefined
  };
};

export const updateActivity = async (id, activityData) => {
  const dbData = {
    title: activityData.title,
    time: activityData.time,
    frequency: activityData.frequency,
    date: activityData.date,
    end_date: activityData.endDate || null,
    description: activityData.description || null,
    assignees: activityData.assignees || []
  };

  const { data, error } = await supabase
    .from('activities')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating activity:', error);
    throw error;
  }

  return {
    ...data,
    endDate: data.end_date,
    end_date: undefined
  };
};

export const deleteActivity = async (id) => {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }

  return true;
};

// ==================== COMPLETED INSTANCES ====================

export const fetchCompletedInstances = async () => {
  const { data, error } = await supabase
    .from('completed_instances')
    .select('*');

  if (error) {
    console.error('Error fetching completed instances:', error);
    throw error;
  }

  // Convertir a formato anterior: ["activityId_date", ...]
  return data.map(item => `${item.activity_id}_${item.date}`);
};

export const addCompletedInstance = async (activityId, date) => {
  const { data, error } = await supabase
    .from('completed_instances')
    .insert([{ activity_id: activityId, date }])
    .select()
    .single();

  if (error) {
    console.error('Error adding completed instance:', error);
    throw error;
  }

  return data;
};

export const deleteCompletedInstance = async (activityId, date) => {
  const { error } = await supabase
    .from('completed_instances')
    .delete()
    .eq('activity_id', activityId)
    .eq('date', date);

  if (error) {
    console.error('Error deleting completed instance:', error);
    throw error;
  }

  return true;
};

// ==================== DELETED INSTANCES ====================

export const fetchDeletedInstances = async () => {
  const { data, error } = await supabase
    .from('deleted_instances')
    .select('*');

  if (error) {
    console.error('Error fetching deleted instances:', error);
    throw error;
  }

  // Convertir a formato anterior: ["activityId_date", ...]
  return data.map(item => `${item.activity_id}_${item.date}`);
};

export const addDeletedInstance = async (activityId, date) => {
  const { data, error } = await supabase
    .from('deleted_instances')
    .insert([{ activity_id: activityId, date }])
    .select()
    .single();

  if (error) {
    console.error('Error adding deleted instance:', error);
    throw error;
  }

  return data;
};
