
import { useParams, Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectOverview from "@/components/project/ProjectOverview";
import ProjectTasks from "@/components/project/ProjectTasks";
import ProjectRequirements from "@/components/project/ProjectRequirements";
import ProjectFinances from "@/components/project/ProjectFinances";
import ProjectMetrics from "@/components/project/ProjectMetrics";

const ProjectPage = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

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
    <div className="animate-fade-in">
      <Link to="/projects" className="inline-flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Volver a Proyectos
      </Link>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Información</TabsTrigger>
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
          <TabsTrigger value="requirements">Requisitos</TabsTrigger>
          <TabsTrigger value="finances">Finanzas</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <ProjectOverview project={project} />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <ProjectTasks project={project} />
        </TabsContent>
        
        <TabsContent value="requirements" className="mt-6">
          <ProjectRequirements project={project} />
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
