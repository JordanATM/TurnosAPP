-- ============================================================
-- MIGRACIÓN: Tabla de ejecuciones de checklists
-- Ejecutar en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS checklist_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  
  -- Datos del operador y ticket
  operator_name TEXT NOT NULL,
  ticket_number TEXT NOT NULL,
  
  -- Pasos completados: array de índices de pasos marcados
  completed_steps INTEGER[] DEFAULT '{}',
  
  -- Comentarios por paso (clave: índice del paso, valor: comentario)
  step_comments JSONB DEFAULT '{}'::jsonb,
  
  -- Estado general
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  
  -- Total de pasos al momento de la ejecución (snapshot)
  total_steps INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE checklist_executions ENABLE ROW LEVEL SECURITY;

-- Políticas: usuarios autenticados pueden leer y escribir
CREATE POLICY "Authenticated users can read checklist_executions"
  ON checklist_executions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert checklist_executions"
  ON checklist_executions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update checklist_executions"
  ON checklist_executions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_checklist_executions_protocol_id
  ON checklist_executions(protocol_id);

CREATE INDEX IF NOT EXISTS idx_checklist_executions_started_at
  ON checklist_executions(started_at DESC);
