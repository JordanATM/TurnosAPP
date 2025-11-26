-- Migration: Add auto_assign column to activities table
-- Date: 2025-11-26
-- Description: Adds auto_assign boolean field to enable dynamic assignee calculation for recurring activities

-- Step 1: Add auto_assign column with default FALSE (safe to re-run)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activities' AND column_name = 'auto_assign'
  ) THEN
    ALTER TABLE activities ADD COLUMN auto_assign BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Step 2: Update frequency constraint to include new weekday values
ALTER TABLE activities
DROP CONSTRAINT IF EXISTS activities_frequency_check;

ALTER TABLE activities
ADD CONSTRAINT activities_frequency_check
CHECK (frequency IN ('once', 'daily', 'weekdays', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'));

-- Step 3: Add comment explaining the column
COMMENT ON COLUMN activities.auto_assign IS 'When true, assignees are calculated dynamically based on shifts for each occurrence date';
