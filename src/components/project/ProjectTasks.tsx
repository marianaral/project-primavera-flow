import { useState, useEffect } from "react";
import { Project } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, CheckCircle, Clock, AlertCircle, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import TaskForm from "./TaskForm";
import TaskViewControls, { TaskViewType } from "./TaskViewControls";
import TaskColumnView from "./TaskColumnView";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignee: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  relatedRequirements: string[];
  estimatedHours: number;
  completedHours: number;
  tags: string[];
  project_id?: string;
}

interface ProjectTasksProps {
  project: Project;
}

const ProjectTasks = ({ project }: ProjectTasksProps) => {
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [viewType, setViewType] = useState<TaskViewType>("list");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [project.id]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_tags (
            tags (
              name
            )
          )
        `)
        .eq('project_id', project.id);

      if (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las tareas",
          variant: "destructive",
        });
        return;
      }

      const formattedTasks = data?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || "",
        status: task.status as "pending" | "in-progress" | "completed",
        assignee: task.responsible || "",
        dueDate: task.deadline || "",
        priority: task.priority as "low" | "medium" | "high",
        relatedRequirements: [],
        estimatedHours: Number(task.estimated_hours) || 0,
        completedHours: 0,
        tags: task.task_tags?.map((tt: any) => tt.tags.name) || [],
        project_id: task.project_id,
      })) || [];

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar las tareas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          responsible: taskData.assignee,
          deadline: taskData.dueDate || null,
          priority: taskData.priority,
          estimated_hours: taskData.estimatedHours || null,
          project_id: project.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        toast({
          title: "Error",
          description: "No se pudo crear la tarea",
          variant: "destructive",
        });
        return;
      }

      // Handle tags if provided
      if (taskData.tags && taskData.tags.trim()) {
        const tagNames = taskData.tags.split(',').map((tag: string) => tag.trim());
        
        for (const tagName of tagNames) {
          // Insert or get tag
          const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .upsert({ name: tagName })
            .select()
            .single();

          if (!tagError && tagData) {
            // Link tag to task
            await supabase
              .from('task_tags')
              .insert({ task_id: data.id, tag_id: tagData.id });
          }
        }
      }

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        status: data.status as any,
        assignee: data.responsible || "",
        dueDate: data.deadline || "",
        priority: data.priority as any,
        relatedRequirements: [],
        estimatedHours: Number(data.estimated_hours) || 0,
        completedHours: 0,
        tags: taskData.tags ? taskData.tags.split(',').map((tag: string) => tag.trim()) : [],
        project_id: data.project_id,
      };

      setTasks([...tasks, newTask]);
      toast({
        title: "Tarea creada",
        description: "La tarea ha sido creada correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al crear la tarea",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          responsible: taskData.assignee,
          deadline: taskData.dueDate || null,
          priority: taskData.priority,
          estimated_hours: taskData.estimatedHours || null,
        })
        .eq('id', editingTask.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la tarea",
          variant: "destructive",
        });
        return;
      }

      // Update tags
      await supabase.from('task_tags').delete().eq('task_id', editingTask.id);
      
      if (taskData.tags && taskData.tags.trim()) {
        const tagNames = taskData.tags.split(',').map((tag: string) => tag.trim());
        
        for (const tagName of tagNames) {
          const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .upsert({ name: tagName })
            .select()
            .single();

          if (!tagError && tagData) {
            await supabase
              .from('task_tags')
              .insert({ task_id: editingTask.id, tag_id: tagData.id });
          }
        }
      }

      const updatedTask: Task = {
        ...editingTask,
        title: data.title,
        description: data.description || "",
        status: data.status as any,
        assignee: data.responsible || "",
        dueDate: data.deadline || "",
        priority: data.priority as any,
        estimatedHours: Number(data.estimated_hours) || 0,
        tags: taskData.tags ? taskData.tags.split(',').map((tag: string) => tag.trim()) : [],
      };

      setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
      setEditingTask(null);
      toast({
        title: "Tarea actualizada",
        description: "La tarea ha sido actualizada correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar la tarea",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskToDelete.id);

      if (error) {
        console.error('Error deleting task:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la tarea",
          variant: "destructive",
        });
        return;
      }

      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      toast({
        title: "Tarea eliminada",
        description: "La tarea ha sido eliminada correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la tarea",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: Task['status']) => {
    const colors = {
      "completed": "bg-green-500/20 text-green-400 border-green-500/30",
      "in-progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "pending": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    };

    const labels = {
      "completed": "Completada",
      "in-progress": "En Progreso",
      "pending": "Pendiente"
    };

    return (
      <Badge variant="outline" className={colors[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const colors = {
      "high": "bg-red-500/20 text-red-400 border-red-500/30",
      "medium": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "low": "bg-gray-500/20 text-gray-400 border-gray-500/30"
    };

    const labels = {
      "high": "Alta",
      "medium": "Media",
      "low": "Baja"
    };

    return (
      <Badge variant="outline" className={colors[priority]}>
        {labels[priority]}
      </Badge>
    );
  };

  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-muted-foreground">Cargando tareas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Tareas</h3>
          <p className="text-muted-foreground">
            {completedTasks} de {tasks.length} tareas completadas ({progressPercentage.toFixed(0)}%)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TaskViewControls viewType={viewType} onViewTypeChange={setViewType} />
          <Button onClick={() => setIsFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      {viewType === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Tareas</CardTitle>
            <CardDescription>
              Gestiona todas las tareas del proyecto {project.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha límite</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        {getStatusBadge(task.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="cursor-pointer" onClick={() => handleTaskClick(task)}>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES') : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <TaskColumnView
          tasks={tasks}
          viewType={viewType}
          onTaskClick={handleTaskClick}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* Task Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTask && getStatusIcon(selectedTask.status)}
              {selectedTask?.title}
            </DialogTitle>
            <DialogDescription>
              Detalles completos de la tarea
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedTask.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prioridad</label>
                  <div className="mt-1">
                    {getPriorityBadge(selectedTask.priority)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                <p className="mt-1 text-sm">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Responsable</label>
                  <p className="mt-1 text-sm font-medium">{selectedTask.assignee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha límite</label>
                  <p className="mt-1 text-sm font-medium">
                    {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString('es-ES') : "-"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Requisitos relacionados</label>
                <div className="mt-2 space-y-1">
                  {selectedTask.relatedRequirements.map((req, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-1">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Horas estimadas</label>
                  <p className="mt-1 text-sm font-medium">{selectedTask.estimatedHours}h</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Horas completadas</label>
                  <p className="mt-1 text-sm font-medium">{selectedTask.completedHours}h</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Progreso ({selectedTask.estimatedHours > 0 ? ((selectedTask.completedHours / selectedTask.estimatedHours) * 100).toFixed(0) : 0}%)
                </label>
                <div className="mt-2 w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${selectedTask.estimatedHours > 0 ? (selectedTask.completedHours / selectedTask.estimatedHours) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Etiquetas</label>
                <div className="mt-2">
                  {selectedTask.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Form Dialog */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask ? {
          ...editingTask,
          tags: editingTask.tags.join(', ')
        } : undefined}
        title={editingTask ? "Editar Tarea" : "Nueva Tarea"}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la tarea "{taskToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectTasks;
