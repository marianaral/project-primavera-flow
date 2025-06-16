
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
          <div className="text-muted-foreground dark:text-muted-foreground">Cargando proyecto...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground dark:text-foreground">Proyecto no encontrado</h2>
        <Link to="/projects">
          <Button variant="link" className="mt-4">
            Volver a Proyectos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4 lg:space-y-6">
      <Link 
        to="/projects" 
        className="inline-flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Proyectos
      </Link>
      
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
          {project.name}
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground text-sm lg:text-base">
          {project.description}
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-6 min-w-fit bg-muted dark:bg-muted">
            <TabsTrigger 
              value="overview" 
              className="text-xs lg:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground"
            >
              Información
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="text-xs lg:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground"
            >
              Tareas
            </TabsTrigger>
            <TabsTrigger 
              value="requirements" 
              className="text-xs lg:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground"
            >
              Requisitos
            </TabsTrigger>
            <TabsTrigger 
              value="expenses" 
              className="text-xs lg:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground"
            >
              Gastos
            </TabsTrigger>
            <TabsTrigger 
              value="finances" 
              className="text-xs lg:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground"
            >
              Finanzas
            </TabsTrigger>
            <TabsTrigger 
              value="metrics" 
              className="text-xs lg:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground"
            >
              Métricas
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="mt-4 lg:mt-6">
          <ProjectOverview project={project} />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-4 lg:mt-6">
          <ProjectTasks project={project} />
        </TabsContent>
        
        <TabsContent value="requirements" className="mt-4 lg:mt-6">
          <ProjectRequirements project={project} />
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-4 lg:mt-6">
          <ProjectExpenses project={project} />
        </TabsContent>
        
        <TabsContent value="finances" className="mt-4 lg:mt-6">
          <ProjectFinances project={project} />
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4 lg:mt-6">
          <ProjectMetrics project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPage;
