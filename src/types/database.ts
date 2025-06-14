
export interface DatabaseProject {
  id: string;
  name: string;
  description: string | null;
  status: 'To-do' | 'Doing' | 'Finished';
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  created_at: string | null;
}

export interface DatabaseTask {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  responsible: string | null;
  deadline: string | null;
  estimated_hours: number | null;
  project_id: string | null;
  created_at: string | null;
}

export interface DatabaseExpense {
  id: string;
  amount: number;
  category: 'personal' | 'equipment' | 'software' | 'services' | 'other';
  description: string | null;
  date: string;
  project_id: string | null;
  created_at: string | null;
}

export interface DatabaseRequirement {
  id: string;
  title: string;
  description: string | null;
  type: 'functional' | 'technical' | 'legal' | 'business';
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: string | null;
  project_id: string | null;
  created_at: string | null;
}

// Helper function to transform database project to component project
export const transformDatabaseProject = (dbProject: DatabaseProject) => ({
  id: dbProject.id,
  name: dbProject.name,
  description: dbProject.description || "",
  status: dbProject.status,
  progress: 0, // Will be calculated from tasks
  startDate: dbProject.start_date || "",
  endDate: dbProject.end_date || "",
  budget: Number(dbProject.budget) || 0,
  spent: 0, // Will be calculated from expenses
});
