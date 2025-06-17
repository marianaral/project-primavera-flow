
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, Edit, Trash2, Eye } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignee: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  estimatedHours: number;
  actualHours: number;
  tags: string;
}

export type TaskViewType = "status-columns" | "priority-columns";

interface TaskColumnViewProps {
  tasks: Task[];
  viewType: TaskViewType;
  onTaskClick: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const TaskColumnView = ({ tasks, viewType, onTaskClick, onEditTask, onDeleteTask }: TaskColumnViewProps) => {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
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

  const renderStatusColumns = () => {
    const statuses: Array<{ key: Task['status']; label: string; color: string }> = [
      { key: "pending", label: "Pendiente", color: "border-yellow-200" },
      { key: "in-progress", label: "En Progreso", color: "border-blue-200" },
      { key: "completed", label: "Completada", color: "border-green-200" }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {statuses.map((status) => {
          const statusTasks = tasks.filter(task => task.status === status.key);
          return (
            <div key={status.key} className={`border-t-4 ${status.color} rounded-lg bg-muted/20 p-3 sm:p-4`}>
              <div className="flex items-center gap-2 mb-4">
                {getStatusIcon(status.key)}
                <h3 className="font-semibold text-foreground">{status.label}</h3>
                <Badge variant="secondary">{statusTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {statusTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow bg-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle 
                          className="text-sm font-medium text-card-foreground cursor-pointer" 
                          onClick={() => onTaskClick(task)}
                        >
                          {task.title}
                        </CardTitle>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskClick(task);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(task);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(task);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-card-foreground">{task.assignee}</span>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES') : 'Sin fecha'}
                        </span>
                        <span>{task.estimatedHours}h / {task.actualHours}h</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPriorityColumns = () => {
    const priorities: Array<{ key: Task['priority']; label: string; color: string }> = [
      { key: "high", label: "Alta Prioridad", color: "border-red-200" },
      { key: "medium", label: "Media Prioridad", color: "border-orange-200" },
      { key: "low", label: "Baja Prioridad", color: "border-gray-200" }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {priorities.map((priority) => {
          const priorityTasks = tasks.filter(task => task.priority === priority.key);
          return (
            <div key={priority.key} className={`border-t-4 ${priority.color} rounded-lg bg-muted/20 p-3 sm:p-4`}>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-foreground">{priority.label}</h3>
                <Badge variant="secondary">{priorityTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {priorityTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow bg-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle 
                          className="text-sm font-medium text-card-foreground cursor-pointer" 
                          onClick={() => onTaskClick(task)}
                        >
                          {task.title}
                        </CardTitle>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskClick(task);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(task);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(task);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-card-foreground">{task.assignee}</span>
                        {getStatusBadge(task.status)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES') : 'Sin fecha'}
                        </span>
                        <span>{task.estimatedHours}h / {task.actualHours}h</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return viewType === "status-columns" ? renderStatusColumns() : renderPriorityColumns();
};

export default TaskColumnView;
