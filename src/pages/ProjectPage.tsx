
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectOverview from "@/components/project/ProjectOverview";
import ProjectTasks from "@/components/project/ProjectTasks";
import ProjectRequirements from "@/components/project/ProjectRequirements";
import ProjectFinances from "@/components/project/ProjectFinances";
import ProjectMetrics from "@/components/project/ProjectMetrics";
import ProjectExpenses from "@/components/project/ProjectExpenses";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { transformDatabaseProject } from "@/types/database";
import type { DatabaseProject } from "@/types/database";

const ProjectPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;

      try {
        // Fetch project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          toast({
            title: "Error",
            description: "No se pudo cargar el proyecto",
            variant: "destructive",
          });
          return;
        }

        // Fetch tasks data
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', id);

        if (tasksError) {
          console.error('Error fetching tasks:', tasksError);
        }

        // Fetch expenses data
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .eq('project_id', id);

        if (expensesError) {
          console.error('Error fetching expenses:', expensesError);
        }

        if (projectData) {
          const transformedProject = transformDatabaseProject(projectData as DatabaseProject);
          setProject(transformedProject);
          setTasks(tasksData || []);
          setExpenses(expensesData || []);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar el proyecto",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando proyecto...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Proyecto no encontrado</h2>
        <Link to="/projects">
          <Button variant="link" className="mt-4">
            Volver a Proyectos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-full overflow-x-hidden">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Volver a Proyectos
      </Link>
      
      <div className="space-y-2">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight break-words">{project.name}</h1>
        <p className="text-muted-foreground text-sm sm:text-base break-words">{project.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        {/* Responsive tabs layout */}
        <div className="w-full">
          {/* Mobile: 2x3 grid */}
          <div className="block sm:hidden mb-4">
            <div className="grid grid-cols-2 gap-2">
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="overview" className="text-xs px-2 py-2 whitespace-nowrap">
                  Información
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="tasks" className="text-xs px-2 py-2 whitespace-nowrap">
                  Tareas
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="requirements" className="text-xs px-2 py-2 whitespace-nowrap">
                  Requisitos
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="expenses" className="text-xs px-2 py-2 whitespace-nowrap">
                  Gastos
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="finances" className="text-xs px-2 py-2 whitespace-nowrap">
                  Finanzas
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="metrics" className="text-xs px-2 py-2 whitespace-nowrap">
                  Métricas
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tablet: 3x2 grid */}
          <div className="hidden sm:block md:hidden mb-4">
            <div className="grid grid-cols-3 gap-2">
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="overview" className="text-xs px-2 py-2 whitespace-nowrap">
                  Información
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="tasks" className="text-xs px-2 py-2 whitespace-nowrap">
                  Tareas
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="requirements" className="text-xs px-2 py-2 whitespace-nowrap">
                  Requisitos
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="expenses" className="text-xs px-2 py-2 whitespace-nowrap">
                  Gastos
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="finances" className="text-xs px-2 py-2 whitespace-nowrap">
                  Finanzas
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="metrics" className="text-xs px-2 py-2 whitespace-nowrap">
                  Métricas
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Desktop: horizontal layout */}
          <div className="hidden md:block">
            <TabsList className="grid w-full grid-cols-6 h-auto mb-4">
              <TabsTrigger value="overview" className="text-sm px-3 py-2 whitespace-nowrap">
                Información
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-sm px-3 py-2 whitespace-nowrap">
                Tareas
              </TabsTrigger>
              <TabsTrigger value="requirements" className="text-sm px-3 py-2 whitespace-nowrap">
                Requisitos
              </TabsTrigger>
              <TabsTrigger value="expenses" className="text-sm px-3 py-2 whitespace-nowrap">
                Gastos
              </TabsTrigger>
              <TabsTrigger value="finances" className="text-sm px-3 py-2 whitespace-nowrap">
                Finanzas
              </TabsTrigger>
              <TabsTrigger value="metrics" className="text-sm px-3 py-2 whitespace-nowrap">
                Métricas
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <div className="w-full max-w-full overflow-x-hidden">
          <TabsContent value="overview" className="mt-3 sm:mt-4 md:mt-6">
            <ProjectOverview project={project} />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-3 sm:mt-4 md:mt-6">
            <ProjectTasks project={project} />
          </TabsContent>
          
          <TabsContent value="requirements" className="mt-3 sm:mt-4 md:mt-6">
            <ProjectRequirements project={project} />
          </TabsContent>
          
          <TabsContent value="expenses" className="mt-3 sm:mt-4 md:mt-6">
            <ProjectExpenses project={project} />
          </TabsContent>
          
          <TabsContent value="finances" className="mt-3 sm:mt-4 md:mt-6">
            <ProjectFinances project={project} />
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-3 sm:mt-4 md:mt-6">
            <ProjectMetrics project={project} tasks={tasks} expenses={expenses} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectPage;
