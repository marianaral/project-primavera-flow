
import { useState, useMemo, useEffect } from "react";
import { ProjectStatus } from "@/data/projects";
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
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  spent?: number;
}

const Projects = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los proyectos",
          variant: "destructive",
        });
        return;
      }

      const formattedProjects = data?.map(project => ({
        ...project,
        spent: 0, // TODO: Calculate from expenses table
        startDate: project.start_date,
        endDate: project.end_date,
      })) || [];

      setProjectList(formattedProjects);
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

      const newProject = {
        ...data,
        spent: 0,
        startDate: data.start_date,
        endDate: data.end_date,
      };

      setProjectList([...projectList, newProject]);
      toast({
        title: "Proyecto creado",
        description: "El proyecto ha sido creado correctamente",
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

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const handleUpdateProject = async (projectData: any) => {
    if (!editingProject) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: projectData.name,
          description: projectData.description,
          status: projectData.status,
          start_date: projectData.startDate || null,
          end_date: projectData.endDate || null,
          budget: projectData.budget || null,
        })
        .eq('id', editingProject.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el proyecto",
          variant: "destructive",
        });
        return;
      }

      const updatedProject = {
        ...data,
        spent: editingProject.spent,
        startDate: data.start_date,
        endDate: data.end_date,
      };

      setProjectList(projectList.map(proj => proj.id === editingProject.id ? updatedProject : proj));
      setEditingProject(null);
      toast({
        title: "Proyecto actualizado",
        description: "El proyecto ha sido actualizado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el proyecto",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.id);

      if (error) {
        console.error('Error deleting project:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el proyecto",
          variant: "destructive",
        });
        return;
      }

      setProjectList(projectList.filter(proj => proj.id !== projectToDelete.id));
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto ha sido eliminado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el proyecto",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  // Filtrar y buscar proyectos
  const filteredProjects = useMemo(() => {
    return projectList.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, projectList]);

  const kpis = useMemo(() => {
    const totalProjects = projectList.length;
    const activeProjects = projectList.filter(p => p.status === "Doing").length;
    const finishedProjects = projectList.filter(p => p.status === "Finished").length;
    const totalBudget = projectList.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projectList.reduce((sum, p) => sum + (p.spent || 0), 0);
    
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

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando proyectos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Proyectos</h1>
          <p className="text-muted-foreground">Gestiona todos tus proyectos desde aquí</p>
        </div>
        <Button onClick={() => setIsProjectFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total de Proyectos</div>
          <div className="text-2xl font-bold text-foreground">{kpis.totalProjects}</div>
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
          <div className="text-2xl font-bold text-foreground">
            {kpis.budgetUtilization.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">
            ${kpis.totalSpent.toLocaleString()} / ${kpis.totalBudget.toLocaleString()}
          </div>
        </div>
      </div>

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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
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

      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        initialData={editingProject ? {
          name: editingProject.name,
          description: editingProject.description,
          status: editingProject.status,
          startDate: editingProject.start_date || "",
          endDate: editingProject.end_date || "",
          budget: editingProject.budget || 0,
        } : undefined}
        title={editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
      />

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
