-- ===========================================
-- ACTUALIZACIÓN DE POLÍTICAS RLS
-- Para requerir autenticación
-- ===========================================

-- IMPORTANTE: Ejecuta este script DESPUÉS de configurar la autenticación
-- y crear usuarios en Supabase

-- Paso 1: Eliminar las políticas públicas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON people;
DROP POLICY IF EXISTS "Enable insert access for all users" ON people;
DROP POLICY IF EXISTS "Enable update access for all users" ON people;
DROP POLICY IF EXISTS "Enable delete access for all users" ON people;

DROP POLICY IF EXISTS "Enable read access for all users" ON activities;
DROP POLICY IF EXISTS "Enable insert access for all users" ON activities;
DROP POLICY IF EXISTS "Enable update access for all users" ON activities;
DROP POLICY IF EXISTS "Enable delete access for all users" ON activities;

DROP POLICY IF EXISTS "Enable read access for all users" ON completed_instances;
DROP POLICY IF EXISTS "Enable insert access for all users" ON completed_instances;
DROP POLICY IF EXISTS "Enable update access for all users" ON completed_instances;
DROP POLICY IF EXISTS "Enable delete access for all users" ON completed_instances;

DROP POLICY IF EXISTS "Enable read access for all users" ON deleted_instances;
DROP POLICY IF EXISTS "Enable insert access for all users" ON deleted_instances;
DROP POLICY IF EXISTS "Enable update access for all users" ON deleted_instances;
DROP POLICY IF EXISTS "Enable delete access for all users" ON deleted_instances;

-- Paso 2: Crear nuevas políticas que requieren autenticación

-- Políticas para people (solo usuarios autenticados)
CREATE POLICY "Authenticated users can read people" ON people
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert people" ON people
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update people" ON people
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete people" ON people
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para activities (solo usuarios autenticados)
CREATE POLICY "Authenticated users can read activities" ON activities
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert activities" ON activities
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update activities" ON activities
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete activities" ON activities
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para completed_instances (solo usuarios autenticados)
CREATE POLICY "Authenticated users can read completed_instances" ON completed_instances
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert completed_instances" ON completed_instances
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update completed_instances" ON completed_instances
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete completed_instances" ON completed_instances
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para deleted_instances (solo usuarios autenticados)
CREATE POLICY "Authenticated users can read deleted_instances" ON deleted_instances
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert deleted_instances" ON deleted_instances
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update deleted_instances" ON deleted_instances
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete deleted_instances" ON deleted_instances
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Verificación: Consulta para ver todas las políticas activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('people', 'activities', 'completed_instances', 'deleted_instances')
ORDER BY tablename, policyname;
