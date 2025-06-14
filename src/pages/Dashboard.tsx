
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

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Proyectos</h1>
        <Button onClick={() => setIsProjectFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
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
