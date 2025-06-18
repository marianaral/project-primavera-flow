
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
  actual_hours: number | null;
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

export interface DatabaseTimeEntry {
  id: string;
  task_id: string;
  start_time: string;
  end_time: string | null;
  hours_worked: number | null;
  description: string | null;
  date: string;
  created_at: string | null;
}

// Helper function to calculate project progress based on completed tasks
export const calculateProjectProgress = (tasks: DatabaseTask[]): number => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  return Math.round((completedTasks / tasks.length) * 100);
};

// Helper function to calculate total spent budget from expenses
export const calculateSpentBudget = (expenses: DatabaseExpense[]): number => {
  return expenses.reduce((total, expense) => total + Number(expense.amount), 0);
};

// Helper function to calculate budget percentage used
export const calculateBudgetPercentage = (spent: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((spent / total) * 100);
};

// Helper function to calculate total actual hours worked on a project
export const calculateTotalHoursWorked = (tasks: DatabaseTask[]): number => {
  return tasks.reduce((total, task) => total + (Number(task.actual_hours) || 0), 0);
};

// Helper function to transform database project to component project with real metrics
export const transformDatabaseProject = (
  dbProject: DatabaseProject, 
  tasks: DatabaseTask[] = [], 
  expenses: DatabaseExpense[] = []
) => {
  const progress = calculateProjectProgress(tasks);
  const spent = calculateSpentBudget(expenses);
  
  return {
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description || "",
    status: dbProject.status,
    progress: progress,
    startDate: dbProject.start_date || "",
    endDate: dbProject.end_date || "",
    budget: Number(dbProject.budget) || 0,
    spent: spent,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'completed').length,
    totalHoursWorked: calculateTotalHoursWorked(tasks),
  };
};
