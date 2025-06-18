
import { useState, useEffect } from "react";
import { Project } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Calendar, Clock, Target, TrendingUp, Users, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectMetricsProps {
  project: Project;
}

const ProjectMetrics = ({ project }: ProjectMetricsProps) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [project.id]);

  const fetchProjectData = async () => {
    try {
      const [tasksResponse, expensesResponse, requirementsResponse] = await Promise.all([
        supabase.from('tasks').select('*').eq('project_id', project.id),
        supabase.from('expenses').select('*').eq('project_id', project.id),
        supabase.from('requirements').select('*').eq('project_id', project.id)
      ]);

      if (tasksResponse.error) console.error('Error fetching tasks:', tasksResponse.error);
      if (expensesResponse.error) console.error('Error fetching expenses:', expensesResponse.error);
      if (requirementsResponse.error) console.error('Error fetching requirements:', requirementsResponse.error);

      setTasks(tasksResponse.data || []);
      setExpenses(expensesResponse.data || []);
      setRequirements(requirementsResponse.data || []);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos basados en datos reales
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + (Number(task.estimated_hours) || 0), 0);
  const totalActualHours = tasks.reduce((sum, task) => sum + (Number(task.actual_hours) || 0), 0);
  const averageTaskTime = tasks.length > 0 ? (totalEstimatedHours / tasks.length) : 0;
  
  const approvedRequirements = requirements.filter(req => req.status === 'approved').length;
  const efficiency = requirements.length > 0 ? (approvedRequirements / requirements.length) * 100 : 0;
  
  // Progreso real basado en tareas completadas
  const realProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  // Datos para gráficos basados en datos reales
  const progressData = [
    { month: "Inicio", planned: 0, actual: 0 },
    { month: "25%", planned: 25, actual: Math.min(realProgress, 25) },
    { month: "50%", planned: 50, actual: Math.min(realProgress, 50) },
    { month: "75%", planned: 75, actual: Math.min(realProgress, 75) },
    { month: "100%", planned: 100, actual: realProgress },
  ];

  const budgetData = [
    { category: "Presupuestado", amount: project.budget },
    { category: "Gastado", amount: totalExpenses },
    { category: "Disponible", amount: project.budget - totalExpenses },
  ];

  const taskDistribution = [
    { name: "Completadas", value: completedTasks, color: "#10b981" },
    { name: "En Progreso", value: inProgressTasks, color: "#3b82f6" },
    { name: "Pendientes", value: pendingTasks, color: "#f59e0b" },
  ].filter(item => item.value > 0); // Solo mostrar categorías con datos

  const hoursComparison = [
    { category: "Estimadas", hours: totalEstimatedHours },
    { category: "Trabajadas", hours: totalActualHours },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-muted-foreground">Cargando métricas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Métricas y Análisis</h3>
        <p className="text-muted-foreground">
          Indicadores de rendimiento y análisis del proyecto (datos reales)
        </p>
      </div>

      {/* KPIs principales actualizados con datos reales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Progreso Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realProgress}%</div>
            <p className="text-xs text-muted-foreground">Basado en tareas completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horas Trabajadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActualHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              de {totalEstimatedHours.toFixed(1)}h estimadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tareas Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">Registradas en el proyecto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Eficiencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEstimatedHours > 0 && totalActualHours > 0
                ? Math.round((totalEstimatedHours / totalActualHours) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Estimado vs Real</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos actualizados */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progreso del Proyecto</CardTitle>
            <CardDescription>Avance basado en tareas completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="planned" stroke="#6366f1" strokeDasharray="5 5" name="Meta" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" name="Real" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución del Presupuesto</CardTitle>
            <CardDescription>Estado actual del presupuesto</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {taskDistribution.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Estado de las Tareas</CardTitle>
              <CardDescription>Distribución actual de tareas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Comparación de Horas</CardTitle>
            <CardDescription>Horas estimadas vs trabajadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hoursComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `${Number(value).toFixed(1)}h`} />
                <Bar dataKey="hours" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Métricas detalladas actualizadas */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Detalladas</CardTitle>
          <CardDescription>Indicadores calculados con datos reales del proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Progreso real:</span>
                <span className="font-semibold">{realProgress}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total gastos:</span>
                <span className="font-semibold">${totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Presupuesto utilizado:</span>
                <span className="font-semibold">
                  {project.budget > 0 ? Math.round((totalExpenses / project.budget) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Presupuesto restante:</span>
                <span className="font-semibold">${(project.budget - totalExpenses).toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tareas completadas:</span>
                <span className="font-semibold text-green-400">{completedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tareas en progreso:</span>
                <span className="font-semibold text-blue-400">{inProgressTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tareas pendientes:</span>
                <span className="font-semibold text-orange-400">{pendingTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Horas trabajadas:</span>
                <span className="font-semibold">{totalActualHours.toFixed(1)}h</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectMetrics;
