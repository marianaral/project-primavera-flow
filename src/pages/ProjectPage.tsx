
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching project:', error);
          toast({
            title: "Error",
            description: "No se pudo cargar el proyecto",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          const transformedProject = transformDatabaseProject(data as DatabaseProject);
          setProject(transformedProject);
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

    fetchProject();
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
    <div className="animate-fade-in space-y-6 w-full overflow-hidden">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Volver a Proyectos
      </Link>
      
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground text-sm sm:text-base">{project.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-6 h-auto min-w-[600px] sm:min-w-0">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
              Información
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
              Tareas
            </TabsTrigger>
            <TabsTrigger value="requirements" className="text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
              Requisitos
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
              Gastos
            </TabsTrigger>
            <TabsTrigger value="finances" className="text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
              Finanzas
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
              Métricas
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="mt-6">
          <ProjectOverview project={project} />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <ProjectTasks project={project} />
        </TabsContent>
        
        <TabsContent value="requirements" className="mt-6">
          <ProjectRequirements project={project} />
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-6">
          <ProjectExpenses project={project} />
        </TabsContent>
        
        <TabsContent value="finances" className="mt-6">
          <ProjectFinances project={project} />
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6">
          <ProjectMetrics project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPage;
