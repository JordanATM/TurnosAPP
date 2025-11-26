-- ===========================================
-- ESQUEMA PARA GESTIÓN DE TURNOS
-- Sistema independiente del calendario de actividades
-- ===========================================

-- Tabla: shifts (Turnos)
-- Almacena los turnos asignados a cada ingeniero por día
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL,
  date DATE NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('morning', 'afternoon', 'night')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(person_id, date, shift_type)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_shifts_person_date ON shifts(person_id, date);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);
CREATE INDEX IF NOT EXISTS idx_shifts_type ON shifts(shift_type);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON shifts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Políticas para shifts (solo usuarios autenticados)
CREATE POLICY "Authenticated users can read shifts" ON shifts
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert shifts" ON shifts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update shifts" ON shifts
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete shifts" ON shifts
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Vista para obtener turnos con información del personal
CREATE OR REPLACE VIEW shifts_with_person AS
SELECT
  s.id,
  s.person_id,
  s.date,
  s.shift_type,
  s.notes,
  s.created_at,
  s.updated_at,
  p.name as person_name
FROM shifts s
LEFT JOIN people p ON s.person_id = p.id;

-- Comentarios para documentación
COMMENT ON TABLE shifts IS 'Almacena los turnos asignados manualmente a cada ingeniero';
COMMENT ON COLUMN shifts.person_id IS 'Referencia al ingeniero asignado';
COMMENT ON COLUMN shifts.date IS 'Fecha del turno (solo día, sin hora)';
COMMENT ON COLUMN shifts.shift_type IS 'Tipo de turno: morning, afternoon, night';
COMMENT ON COLUMN shifts.notes IS 'Notas opcionales sobre el turno';
