
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
  const averageTaskTime = tasks.length > 0 ? (tasks.reduce((sum, task) => sum + (Number(task.estimated_hours) || 0), 0) / tasks.length) : 0;
  
  const approvedRequirements = requirements.filter(req => req.status === 'approved').length;
  const efficiency = requirements.length > 0 ? (approvedRequirements / requirements.length) * 100 : 0;
  
  // Datos simulados para gráficos (se podrían calcular con fechas reales)
  const progressData = [
    { month: "Ene", planned: 20, actual: 15 },
    { month: "Feb", planned: 35, actual: 30 },
    { month: "Mar", planned: 50, actual: 45 },
    { month: "Abr", planned: 65, actual: 60 },
    { month: "May", planned: 80, actual: 75 },
    { month: "Jun", planned: 100, actual: project.progress },
  ];

  const budgetData = [
    { month: "Ene", budget: project.budget * 0.16, spent: totalExpenses * 0.2 },
    { month: "Feb", budget: project.budget * 0.32, spent: totalExpenses * 0.4 },
    { month: "Mar", budget: project.budget * 0.48, spent: totalExpenses * 0.6 },
    { month: "Abr", budget: project.budget * 0.64, spent: totalExpenses * 0.75 },
    { month: "May", budget: project.budget * 0.8, spent: totalExpenses * 0.9 },
    { month: "Jun", budget: project.budget, spent: totalExpenses },
  ];

  const taskDistribution = [
    { name: "Completadas", value: completedTasks, color: "#10b981" },
    { name: "En Progreso", value: inProgressTasks, color: "#3b82f6" },
    { name: "Pendientes", value: pendingTasks, color: "#f59e0b" },
  ];

  const timeMetrics = [
    { category: "Análisis", estimated: 40, actual: 38 },
    { category: "Diseño", estimated: 60, actual: 65 },
    { category: "Desarrollo", estimated: 120, actual: 110 },
    { category: "Testing", estimated: 30, actual: 28 },
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
          Indicadores de rendimiento y análisis del proyecto
        </p>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Eficiencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{efficiency.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Requisitos aprobados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tiempo Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTaskTime.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Por tarea estimada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tareas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">Total registradas</p>
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
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.length > 0 ? ((completedTasks / tasks.length) * 100).toFixed(0) : 0}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progreso vs Planificado</CardTitle>
            <CardDescription>Comparación del avance real con el planificado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="planned" stroke="#6366f1" strokeDasharray="5 5" name="Planificado" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" name="Real" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Presupuesto vs Gastos</CardTitle>
            <CardDescription>Control financiero a lo largo del tiempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="budget" fill="#6366f1" name="Presupuesto" />
                <Bar dataKey="spent" fill="#10b981" name="Gastado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Tareas</CardTitle>
            <CardDescription>Estado actual de todas las tareas</CardDescription>
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

        <Card>
          <CardHeader>
            <CardTitle>Tiempos: Estimado vs Real</CardTitle>
            <CardDescription>Precisión en estimaciones por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}h`} />
                <Bar dataKey="estimated" fill="#f59e0b" name="Estimado" />
                <Bar dataKey="actual" fill="#10b981" name="Real" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de métricas detalladas */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Detalladas</CardTitle>
          <CardDescription>Indicadores clave de rendimiento del proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Días transcurridos:</span>
                <span className="font-semibold">
                  {Math.ceil((new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 3600 * 24))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Días restantes:</span>
                <span className="font-semibold">
                  {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total gastos:</span>
                <span className="font-semibold">${totalExpenses.toLocaleString()}</span>
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
                <span className="text-muted-foreground">Requisitos aprobados:</span>
                <span className="font-semibold text-green-400">{approvedRequirements}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectMetrics;
