
import { useState, useEffect } from "react";
import { Project } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, Clock, Target, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";

interface ProjectOverviewProps {
  project: Project;
}

interface ProjectMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalExpenses: number;
  totalEstimatedHours: number;
  totalActualHours: number;
  progressPercentage: number;
  budgetPercentage: number;
}

const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  const { toast } = useToast();
  const { formatCurrency } = useSettings();
  const [metrics, setMetrics] = useState<ProjectMetrics>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    totalExpenses: 0,
    totalEstimatedHours: 0,
    totalActualHours: 0,
    progressPercentage: 0,
    budgetPercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectMetrics();
  }, [project.id]);

  const fetchProjectMetrics = async () => {
    try {
      // Obtener tareas del proyecto
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', project.id);

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        toast({
          title: "Error",
          description: "No se pudieron cargar las tareas del proyecto",
          variant: "destructive",
        });
        return;
      }

      // Obtener gastos del proyecto
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('project_id', project.id);

      if (expensesError) {
        console.error('Error fetching expenses:', expensesError);
        toast({
          title: "Error",
          description: "No se pudieron cargar los gastos del proyecto",
          variant: "destructive",
        });
        return;
      }

      // Actualizar el progreso del proyecto en la base de datos
      const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
      const totalTasks = tasks?.length || 0;
      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Calcular métricas
      const totalExpenses = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      const totalEstimatedHours = tasks?.reduce((sum, task) => sum + (Number(task.estimated_hours) || 0), 0) || 0;
      const totalActualHours = tasks?.reduce((sum, task) => sum + (Number(task.actual_hours) || 0), 0) || 0;
      const budgetPercentage = project.budget > 0 ? Math.round((totalExpenses / project.budget) * 100) : 0;

      setMetrics({
        totalTasks,
        completedTasks,
        inProgressTasks: tasks?.filter(task => task.status === 'in-progress').length || 0,
        pendingTasks: tasks?.filter(task => task.status === 'pending').length || 0,
        totalExpenses,
        totalEstimatedHours,
        totalActualHours,
        progressPercentage,
        budgetPercentage,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar las métricas del proyecto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    "To-do": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Doing": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Finished": "bg-green-500/20 text-green-400 border-green-500/30",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">Cargando métricas del proyecto...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Total Tareas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTasks}</div>
            <p className="text-xs text-muted-foreground">Tareas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{metrics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalTasks > 0 ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              En Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{metrics.inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">Tareas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{metrics.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Por iniciar</p>
          </CardContent>
        </Card>
      </div>

      {/* Progreso y Estado */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progreso del Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Estado actual:</span>
              <Badge variant="outline" className={statusColors[project.status]}>
                {project.status}
              </Badge>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span>Progreso por tareas:</span>
                <span className="font-semibold">{metrics.progressPercentage}%</span>
              </div>
              <Progress value={metrics.progressPercentage} className="w-full" />
              <p className="text-sm text-muted-foreground mt-1">
                {metrics.completedTasks} de {metrics.totalTasks} tareas completadas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Presupuesto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Presupuesto total:</span>
              <span className="font-semibold">{formatCurrency(project.budget)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Gastado:</span>
              <span className="font-semibold">{formatCurrency(metrics.totalExpenses)}</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span>Utilización:</span>
                <span className="font-semibold">{metrics.budgetPercentage}%</span>
              </div>
              <Progress value={metrics.budgetPercentage} className="w-full" />
            </div>
            <div className="flex items-center justify-between">
              <span>Restante:</span>
              <span className="font-semibold text-green-400">
                {formatCurrency(project.budget - metrics.totalExpenses)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cronograma y Tiempo */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Cronograma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Fecha de inicio:</span>
              <span className="font-semibold">
                {project.startDate ? new Date(project.startDate).toLocaleDateString('es-ES') : 'No definida'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fecha de fin:</span>
              <span className="font-semibold">
                {project.endDate ? new Date(project.endDate).toLocaleDateString('es-ES') : 'No definida'}
              </span>
            </div>
            {project.startDate && project.endDate && (
              <div className="flex items-center justify-between">
                <span>Duración total:</span>
                <span className="font-semibold">
                  {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 3600 * 24))} días
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tiempo de Trabajo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Horas estimadas:</span>
              <span className="font-semibold">{metrics.totalEstimatedHours.toFixed(1)}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Horas trabajadas:</span>
              <span className="font-semibold">{metrics.totalActualHours.toFixed(1)}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Eficiencia:</span>
              <span className={`font-semibold ${
                metrics.totalEstimatedHours > 0 && metrics.totalActualHours <= metrics.totalEstimatedHours 
                  ? 'text-green-400' 
                  : 'text-orange-400'
              }`}>
                {metrics.totalEstimatedHours > 0 
                  ? `${Math.round((metrics.totalEstimatedHours / Math.max(metrics.totalActualHours, 1)) * 100)}%`
                  : 'N/A'
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información Adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Descripción del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{project.description || 'Sin descripción disponible'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
