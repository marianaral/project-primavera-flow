
import { useState, useMemo, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/project/ProjectForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, TrendingUp, DollarSign, Calendar, Target, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { transformDatabaseProject } from "@/types/database";
import type { DatabaseProject } from "@/types/database";

const Dashboard = () => {
  const { toast } = useToast();
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectList, setProjectList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los proyectos",
          variant: "destructive",
        });
        return;
      }

      const transformedProjects = data?.map(project => 
        transformDatabaseProject(project as DatabaseProject)
      ) || [];

      setProjectList(transformedProjects);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar los proyectos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: projectData.name,
          description: projectData.description,
          status: projectData.status,
          start_date: projectData.startDate || null,
          end_date: projectData.endDate || null,
          budget: projectData.budget || null,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        toast({
          title: "Error",
          description: "No se pudo crear el proyecto",
          variant: "destructive",
        });
        return;
      }

      const newProject = transformDatabaseProject(data as DatabaseProject);
      setProjectList([newProject, ...projectList]);
      toast({
        title: "Éxito",
        description: "Proyecto creado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el proyecto",
        variant: "destructive",
      });
    }
  };

  // Calcular métricas generales
  const metrics = useMemo(() => {
    const totalProjects = projectList.length;
    const completedProjects = projectList.filter(p => p.status === "Finished").length;
    const inProgressProjects = projectList.filter(p => p.status === "Doing").length;
    const pendingProjects = projectList.filter(p => p.status === "To-do").length;
    
    const totalBudget = projectList.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projectList.reduce((sum, p) => sum + p.spent, 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    const avgProgress = projectList.length > 0 ? 
      projectList.reduce((sum, p) => sum + p.progress, 0) / projectList.length : 0;
    
    // Proyectos con presupuesto excedido
    const overBudgetProjects = projectList.filter(p => p.spent > p.budget).length;
    
    // Proyectos próximos a vencer (próximos 30 días)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const projectsDueSoon = projectList.filter(p => {
      if (!p.endDate) return false;
      const endDate = new Date(p.endDate);
      return endDate >= now && endDate <= thirtyDaysFromNow && p.status !== "Finished";
    }).length;
    
    // Eficiencia promedio (progreso vs tiempo transcurrido)
    const activeProjects = projectList.filter(p => p.status === "Doing");
    const avgEfficiency = activeProjects.length > 0 ? 
      activeProjects.reduce((sum, p) => {
        if (!p.startDate || !p.endDate) return sum + 1;
        const startDate = new Date(p.startDate);
        const endDate = new Date(p.endDate);
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedTime = now.getTime() - startDate.getTime();
        const expectedProgress = totalDuration > 0 ? (elapsedTime / totalDuration) * 100 : 0;
        return sum + (p.progress / Math.max(expectedProgress, 1));
      }, 0) / activeProjects.length : 1;

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      pendingProjects,
      totalBudget,
      totalSpent,
      budgetUtilization,
      avgProgress,
      overBudgetProjects,
      projectsDueSoon,
      avgEfficiency: avgEfficiency * 100,
      completionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
    };
  }, [projectList]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard de Proyectos</h1>
          <p className="text-muted-foreground">Resumen general y métricas de rendimiento</p>
        </div>
        <Button onClick={() => setIsProjectFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Métricas Principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.inProgressProjects}</div>
            <p className="text-xs text-muted-foreground">
              de {metrics.totalProjects} proyectos totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Finalización</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.completedProjects} proyectos completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilización Presupuesto</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.budgetUtilization.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              ${metrics.totalSpent.toLocaleString()} / ${metrics.totalBudget.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.avgProgress.toFixed(1)}%</div>
            <Progress value={metrics.avgProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Métricas Secundarias */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Eficiencia General
            </CardTitle>
            <CardDescription>Rendimiento vs planificación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {metrics.avgEfficiency.toFixed(0)}%
            </div>
            <Progress value={Math.min(metrics.avgEfficiency, 100)} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {metrics.avgEfficiency > 100 ? "Por encima de lo esperado" : 
               metrics.avgEfficiency > 80 ? "Rendimiento óptimo" : "Requiere atención"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas
            </CardTitle>
            <CardDescription>Proyectos que requieren atención</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Próximos a vencer:</span>
              <span className="font-semibold text-yellow-600">{metrics.projectsDueSoon}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sobre presupuesto:</span>
              <span className="font-semibold text-red-600">{metrics.overBudgetProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pendientes:</span>
              <span className="font-semibold text-gray-600">{metrics.pendingProjects}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Distribución de Estados
            </CardTitle>
            <CardDescription>Estado actual de proyectos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Finalizados</span>
                <span className="font-semibold text-green-600">{metrics.completedProjects}</span>
              </div>
              <Progress value={metrics.totalProjects > 0 ? (metrics.completedProjects / metrics.totalProjects) * 100 : 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">En Progreso</span>
                <span className="font-semibold text-blue-600">{metrics.inProgressProjects}</span>
              </div>
              <Progress value={metrics.totalProjects > 0 ? (metrics.inProgressProjects / metrics.totalProjects) * 100 : 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pendientes</span>
                <span className="font-semibold text-yellow-600">{metrics.pendingProjects}</span>
              </div>
              <Progress value={metrics.totalProjects > 0 ? (metrics.pendingProjects / metrics.totalProjects) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Proyectos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Proyectos Recientes</h2>
        {projectList.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No hay proyectos disponibles</p>
              <Button onClick={() => setIsProjectFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear primer proyecto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projectList.slice(0, 8).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Project Form Dialog */}
      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        onSubmit={handleCreateProject}
        title="Nuevo Proyecto"
      />
    </div>
  );
};

export default Dashboard;
