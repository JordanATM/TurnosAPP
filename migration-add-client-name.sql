-- Migración: Agregar columna client_name a la tabla activities
-- Ejecutar en el SQL Editor de Supabase

ALTER TABLE activities
ADD COLUMN IF NOT EXISTS client_name TEXT DEFAULT NULL;

-- Opcional: comentario descriptivo
COMMENT ON COLUMN activities.client_name IS 'Nombre del cliente para el que se realiza la actividad';
