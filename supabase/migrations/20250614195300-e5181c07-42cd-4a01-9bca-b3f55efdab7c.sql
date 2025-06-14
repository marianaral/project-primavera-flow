
-- Actualizar restricciones para la tabla tasks
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;

ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check 
CHECK (priority IN ('low', 'medium', 'high'));

ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
CHECK (status IN ('pending', 'in-progress', 'completed'));

-- Actualizar restricciones para la tabla requirements
ALTER TABLE requirements DROP CONSTRAINT IF EXISTS requirements_priority_check;
ALTER TABLE requirements DROP CONSTRAINT IF EXISTS requirements_status_check;
ALTER TABLE requirements DROP CONSTRAINT IF EXISTS requirements_type_check;

ALTER TABLE requirements ADD CONSTRAINT requirements_priority_check 
CHECK (priority IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE requirements ADD CONSTRAINT requirements_status_check 
CHECK (status IN ('pending', 'in-review', 'approved', 'rejected'));

ALTER TABLE requirements ADD CONSTRAINT requirements_type_check 
CHECK (type IN ('functional', 'technical', 'legal', 'business'));

-- Actualizar restricciones para la tabla expenses
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_category_check;

ALTER TABLE expenses ADD CONSTRAINT expenses_category_check 
CHECK (category IN ('personal', 'equipment', 'software', 'services', 'other'));
