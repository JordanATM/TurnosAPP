-- Script para verificar que la columna auto_assign existe
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'activities'
ORDER BY ordinal_position;
