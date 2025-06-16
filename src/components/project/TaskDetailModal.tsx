
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Flag } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  tags: string;
}

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailModal = ({ task, isOpen, onClose }: TaskDetailModalProps) => {
  if (!task) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">{task.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Detalles completos de la tarea
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Descripción</h4>
              <p className="text-sm text-muted-foreground">
                {task.description || "Sin descripción"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  <strong>Responsable:</strong> {task.assignee}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  <strong>Horas estimadas:</strong> {task.estimatedHours}h
                </span>
              </div>

              {task.dueDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    <strong>Fecha límite:</strong> {new Date(task.dueDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  <strong>Prioridad:</strong> {getPriorityBadge(task.priority)}
                </span>
              </div>
            </div>

            {task.tags && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">Etiquetas</h4>
                <div className="flex flex-wrap gap-2">
                  {task.tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
