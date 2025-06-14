import { useState } from "react";
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
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Análisis de requisitos",
      description: "Definir los requisitos funcionales y no funcionales del proyecto. Esto incluye reuniones con stakeholders, documentación detallada y validación de necesidades del negocio.",
      status: "completed",
      assignee: "María García",
      dueDate: "2025-06-20",
      priority: "high",
      relatedRequirements: ["REQ-001: Autenticación de usuarios", "REQ-002: Dashboard principal"],
      estimatedHours: 40,
      completedHours: 38,
      tags: ["análisis", "documentación", "stakeholders"]
    },
    {
      id: "task-2",
      title: "Diseño de arquitectura",
      description: "Crear el diseño técnico y la arquitectura del sistema",
      status: "in-progress",
      assignee: "Carlos López",
      dueDate: "2025-06-25",
      priority: "high",
      relatedRequirements: ["REQ-003: Base de datos", "REQ-004: API REST"],
      estimatedHours: 60,
      completedHours: 25,
      tags: ["arquitectura", "diseño", "backend"]
    },
    {
      id: "task-3",
      title: "Desarrollo frontend",
      description: "Implementar la interfaz de usuario",
      status: "pending",
      assignee: "Ana Martín",
      dueDate: "2025-07-10",
      priority: "medium",
      relatedRequirements: ["REQ-005: Interfaz responsive", "REQ-006: Componentes UI"],
      estimatedHours: 80,
      completedHours: 0,
      tags: ["frontend", "ui", "react"]
    },
    {
      id: "task-4",
      title: "Testing e integración",
      description: "Realizar pruebas unitarias y de integración",
      status: "pending",
      assignee: "Luis Rodríguez",
      dueDate: "2025-07-20",
      priority: "medium",
      relatedRequirements: ["REQ-007: Pruebas automatizadas"],
      estimatedHours: 30,
      completedHours: 0,
      tags: ["testing", "qa", "automatización"]
    }
  ]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCreateTask = (taskData: any) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskData,
      relatedRequirements: [],
      completedHours: 0,
      tags: taskData.tags ? taskData.tags.split(',').map((tag: string) => tag.trim()) : [],
    };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleUpdateTask = (taskData: any) => {
    if (!editingTask) return;
    
    const updatedTask: Task = {
      ...editingTask,
      ...taskData,
      tags: taskData.tags ? taskData.tags.split(',').map((tag: string) => tag.trim()) : [],
    };
    
    setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      toast({
        title: "Tarea eliminada",
        description: "La tarea ha sido eliminada correctamente",
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
  const progressPercentage = (completedTasks / tasks.length) * 100;

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
                      {new Date(task.dueDate).toLocaleDateString('es-ES')}
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
                    {new Date(selectedTask.dueDate).toLocaleDateString('es-ES')}
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
                  Progreso ({((selectedTask.completedHours / selectedTask.estimatedHours) * 100).toFixed(0)}%)
                </label>
                <div className="mt-2 w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${(selectedTask.completedHours / selectedTask.estimatedHours) * 100}%` }}
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
