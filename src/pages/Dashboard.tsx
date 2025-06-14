
import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/project/ProjectForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectList, setProjectList] = useState(projects);

  const handleCreateProject = (projectData: any) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      ...projectData,
      spent: 0,
    };
    setProjectList([...projectList, newProject]);
    toast({
      title: "Éxito",
      description: "Proyecto creado correctamente",
    });
  };

  // Calculate stats
  const totalProjects = projectList.length;
  const completedProjects = projectList.filter(p => p.status === "Finished").length;
  const inProgressProjects = projectList.filter(p => p.status === "Doing").length;
  const pendingProjects = projectList.filter(p => p.status === "To-do").length;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard de Proyectos</h1>
        <Button onClick={() => setIsProjectFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Proyectos</p>
              <p className="text-2xl font-bold text-foreground">{totalProjects}</p>
            </div>
            <PlusCircle className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completados</p>
              <p className="text-2xl font-bold text-green-600">{completedProjects}</p>
            </div>
            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">En Progreso</p>
              <p className="text-2xl font-bold text-blue-600">{inProgressProjects}</p>
            </div>
            <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingProjects}</p>
            </div>
            <div className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projectList.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
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
