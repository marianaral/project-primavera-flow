
-- Eliminar la restricción existente si existe
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Crear una nueva restricción que permita los valores de estado correctos
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('To-do', 'Doing', 'Finished'));
