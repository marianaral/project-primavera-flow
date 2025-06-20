import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  Target,
  Calendar,
  Users
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

interface ProjectMetricsProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    budget: number;
    spent: number;
    totalTasks: number;
    completedTasks: number;
    totalHoursWorked: number;
  };
  tasks: any[];
  expenses: any[];
}

const ProjectMetrics = ({ project, tasks, expenses }: ProjectMetricsProps) => {
  const { formatTime, formatCurrency } = useSettings();
  
  const totalTasks = project.totalTasks;
  const completedTasks = project.completedTasks;
  const inProgressTasks = totalTasks - completedTasks;
  const progress = project.progress;
  const totalBudget = project.budget;
  const totalSpent = project.spent;
  const budgetUsedPercentage = Math.round((totalSpent / totalBudget) * 100);
  const totalHoursWorked = project.totalHoursWorked;
  const averageHoursPerTask = totalTasks > 0 ? totalHoursWorked / totalTasks : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To-do":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Doing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Finished":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con estado del proyecto */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <Badge variant="outline" className={`${getStatusColor(project.status)} font-medium`}>
          {project.status === "To-do" && "Por hacer"}
          {project.status === "Doing" && "En progreso"}
          {project.status === "Finished" && "Finalizado"}
        </Badge>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Progreso General */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <Progress value={progress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} de {totalTasks} tareas
            </p>
          </CardContent>
        </Card>

        {/* Tareas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                {completedTasks} completadas
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                {inProgressTasks} en progreso
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Presupuesto */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <Progress value={budgetUsedPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(totalSpent)} gastado ({budgetUsedPercentage}%)
            </p>
          </CardContent>
        </Card>

        {/* Tiempo Trabajado */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(totalHoursWorked)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Promedio: {formatTime(averageHoursPerTask)} por tarea
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas detalladas */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Distribución de tareas por estado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribución de Tareas</CardTitle>
            <CardDescription>Estado actual de las tareas del proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Pendientes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{tasks.filter(task => task.status === 'pending').length}</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: totalTasks > 0 ? `${(tasks.filter(task => task.status === 'pending').length / totalTasks) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">En progreso</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{tasks.filter(task => task.status === 'in-progress').length}</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: totalTasks > 0 ? `${(tasks.filter(task => task.status === 'in-progress').length / totalTasks) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Completadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{tasks.filter(task => task.status === 'completed').length}</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: totalTasks > 0 ? `${(tasks.filter(task => task.status === 'completed').length / totalTasks) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del proyecto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información del Proyecto</CardTitle>
            <CardDescription>Detalles y fechas importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Fecha de inicio</span>
              </div>
              <span className="text-sm font-medium">
                {project.startDate ? new Date(project.startDate).toLocaleDateString('es-ES') : 'No definida'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Fecha de fin</span>
              </div>
              <span className="text-sm font-medium">
                {project.endDate ? new Date(project.endDate).toLocaleDateString('es-ES') : 'No definida'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Eficiencia</span>
              </div>
              <span className="text-sm font-medium">
                {totalTasks > 0 ? `${((completedTasks / totalTasks) * 100).toFixed(0)}%` : '0%'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Presupuesto restante</span>
              </div>
              <span className="text-sm font-medium">
                {formatCurrency(Math.max(0, totalBudget - totalSpent))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectMetrics;
