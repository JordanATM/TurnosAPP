-- ===========================================
-- ESQUEMA DE BASE DE DATOS PARA SUPABASE
-- Planificador de Turnos
-- ===========================================

-- Tabla: people (Personal)
-- Almacena la información del personal
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: activities (Actividades)
-- Almacena las actividades y turnos
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  time TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('once', 'daily', 'weekdays', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  assignees UUID[] DEFAULT '{}',
  auto_assign BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: completed_instances (Instancias Completadas)
-- Almacena las instancias específicas que han sido marcadas como completadas
CREATE TABLE IF NOT EXISTS completed_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, date)
);

-- Tabla: deleted_instances (Instancias Eliminadas)
-- Almacena las instancias específicas de actividades recurrentes que fueron eliminadas
CREATE TABLE IF NOT EXISTS deleted_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, date)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_frequency ON activities(frequency);
CREATE INDEX IF NOT EXISTS idx_completed_instances_activity_date ON completed_instances(activity_id, date);
CREATE INDEX IF NOT EXISTS idx_deleted_instances_activity_date ON deleted_instances(activity_id, date);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE deleted_instances ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (puedes modificar esto según tus necesidades de seguridad)
-- IMPORTANTE: Estas políticas permiten acceso completo sin autenticación
-- Si necesitas autenticación, comenta estas y crea políticas basadas en auth.uid()

-- Políticas para people
CREATE POLICY "Enable read access for all users" ON people
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON people
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON people
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON people
  FOR DELETE USING (true);

-- Políticas para activities
CREATE POLICY "Enable read access for all users" ON activities
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON activities
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON activities
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON activities
  FOR DELETE USING (true);

-- Políticas para completed_instances
CREATE POLICY "Enable read access for all users" ON completed_instances
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON completed_instances
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON completed_instances
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON completed_instances
  FOR DELETE USING (true);

-- Políticas para deleted_instances
CREATE POLICY "Enable read access for all users" ON deleted_instances
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON deleted_instances
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON deleted_instances
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON deleted_instances
  FOR DELETE USING (true);

-- Insertar datos de ejemplo (opcional - puedes comentar estas líneas)
INSERT INTO people (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ana García'),
  ('00000000-0000-0000-0000-000000000002', 'Carlos López'),
  ('00000000-0000-0000-0000-000000000003', 'María Rodríguez')
ON CONFLICT (id) DO NOTHING;
