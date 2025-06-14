
import { useState } from "react";
import { Project } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignee: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

interface ProjectTasksProps {
  project: Project;
}

const ProjectTasks = ({ project }: ProjectTasksProps) => {
  const [tasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Análisis de requisitos",
      description: "Definir los requisitos funcionales y no funcionales del proyecto",
      status: "completed",
      assignee: "María García",
      dueDate: "2025-06-20",
      priority: "high"
    },
    {
      id: "task-2",
      title: "Diseño de arquitectura",
      description: "Crear el diseño técnico y la arquitectura del sistema",
      status: "in-progress",
      assignee: "Carlos López",
      dueDate: "2025-06-25",
      priority: "high"
    },
    {
      id: "task-3",
      title: "Desarrollo frontend",
      description: "Implementar la interfaz de usuario",
      status: "pending",
      assignee: "Ana Martín",
      dueDate: "2025-07-10",
      priority: "medium"
    },
    {
      id: "task-4",
      title: "Testing e integración",
      description: "Realizar pruebas unitarias y de integración",
      status: "pending",
      assignee: "Luis Rodríguez",
      dueDate: "2025-07-20",
      priority: "medium"
    }
  ]);

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
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

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
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>
                    {new Date(task.dueDate).toLocaleDateString('es-ES')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTasks;
