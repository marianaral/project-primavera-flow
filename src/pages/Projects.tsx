import { useState, useMemo } from "react";
import { projects, ProjectStatus } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/project/ProjectForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Filter, Edit, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Projects = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [projectList, setProjectList] = useState(projects);

  const handleCreateProject = (projectData: any) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      ...projectData,
      spent: 0,
    };
    setProjectList([...projectList, newProject]);
    console.log("Creating project:", projectData);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const handleUpdateProject = (projectData: any) => {
    if (!editingProject) return;
    
    const updatedProject = {
      ...editingProject,
      ...projectData,
    };
    
    setProjectList(projectList.map(proj => proj.id === editingProject.id ? updatedProject : proj));
    setEditingProject(null);
  };

  const handleDeleteProject = (project: any) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      setProjectList(projectList.filter(proj => proj.id !== projectToDelete.id));
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto ha sido eliminado correctamente",
      });
    }
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  // Filtrar y buscar proyectos
  const filteredProjects = useMemo(() => {
    return projectList.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, projectList]);

  // Calcular KPIs
  const kpis = useMemo(() => {
    const totalProjects = projectList.length;
    const activeProjects = projectList.filter(p => p.status === "Doing").length;
    const finishedProjects = projectList.filter(p => p.status === "Finished").length;
    const totalBudget = projectList.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projectList.reduce((sum, p) => sum + p.spent, 0);
    
    return {
      totalProjects,
      activeProjects,
      finishedProjects,
      totalBudget,
      totalSpent,
      budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
    };
  }, [projectList]);

  const statusOptions: { value: ProjectStatus | "all"; label: string; count: number }[] = [
    { value: "all", label: "Todos", count: projectList.length },
    { value: "To-do", label: "Por Hacer", count: projectList.filter(p => p.status === "To-do").length },
    { value: "Doing", label: "En Progreso", count: projectList.filter(p => p.status === "Doing").length },
    { value: "Finished", label: "Finalizados", count: projectList.filter(p => p.status === "Finished").length },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground">Gestiona todos tus proyectos desde aquí</p>
        </div>
        <Button onClick={() => setIsProjectFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total de Proyectos</div>
          <div className="text-2xl font-bold">{kpis.totalProjects}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Proyectos Activos</div>
          <div className="text-2xl font-bold text-blue-400">{kpis.activeProjects}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Proyectos Finalizados</div>
          <div className="text-2xl font-bold text-green-400">{kpis.finishedProjects}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Utilización Presupuesto</div>
          <div className="text-2xl font-bold">
            {kpis.budgetUtilization.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">
            ${kpis.totalSpent.toLocaleString()} / ${kpis.totalBudget.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proyectos por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProjectStatus | "all")}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{option.label}</span>
                  <Badge variant="secondary" className="ml-2">
                    {option.count}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resultados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filteredProjects.length === projectList.length 
              ? `Todos los proyectos (${projectList.length})`
              : `${filteredProjects.length} de ${projectList.length} proyectos`
            }
          </h2>
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSearchTerm("")}
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" 
                ? "No se encontraron proyectos con los criterios seleccionados."
                : "No hay proyectos disponibles."
              }
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="relative group">
                <ProjectCard project={project} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md p-1 flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditProject(project);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteProject(project);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Form Dialog */}
      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        initialData={editingProject || undefined}
        title={editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto "{projectToDelete?.name}" y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
