
import { Project } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Calendar, Clock, Target, TrendingUp, Users, CheckCircle } from "lucide-react";

interface ProjectMetricsProps {
  project: Project;
}

const ProjectMetrics = ({ project }: ProjectMetricsProps) => {
  // Datos simulados para los gráficos
  const progressData = [
    { month: "Ene", planned: 20, actual: 15 },
    { month: "Feb", planned: 35, actual: 30 },
    { month: "Mar", planned: 50, actual: 45 },
    { month: "Abr", planned: 65, actual: 60 },
    { month: "May", planned: 80, actual: 75 },
    { month: "Jun", planned: 100, actual: project.progress },
  ];

  const budgetData = [
    { month: "Ene", budget: 8000, spent: 6500 },
    { month: "Feb", budget: 16000, spent: 14200 },
    { month: "Mar", budget: 24000, spent: 21800 },
    { month: "Abr", budget: 32000, spent: 28900 },
    { month: "May", budget: 40000, spent: 35600 },
    { month: "Jun", budget: project.budget, spent: project.spent },
  ];

  const taskDistribution = [
    { name: "Completadas", value: 8, color: "#10b981" },
    { name: "En Progreso", value: 3, color: "#3b82f6" },
    { name: "Pendientes", value: 5, color: "#f59e0b" },
  ];

  const timeMetrics = [
    { category: "Análisis", estimated: 40, actual: 38 },
    { category: "Diseño", estimated: 60, actual: 65 },
    { category: "Desarrollo", estimated: 120, actual: 110 },
    { category: "Testing", estimated: 30, actual: 28 },
  ];

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
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Progreso vs planificado</p>
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
            <div className="text-2xl font-bold">5.2d</div>
            <p className="text-xs text-muted-foreground">Por tarea completada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Productividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.7</div>
            <p className="text-xs text-muted-foreground">Tareas por semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Calidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Tareas sin retrabajos</p>
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
                <span className="text-muted-foreground">Velocidad promedio:</span>
                <span className="font-semibold">1.2% diario</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimación finalización:</span>
                <span className="font-semibold">15 jul 2025</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROI proyectado:</span>
                <span className="font-semibold text-green-400">+28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Riesgo presupuestario:</span>
                <span className="font-semibold text-green-400">Bajo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Satisfacción cliente:</span>
                <span className="font-semibold">9.2/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Calificación general:</span>
                <span className="font-semibold text-green-400">Excelente</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectMetrics;
