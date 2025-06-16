
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, Pencil, Trash2 } from "lucide-react";

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
        return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: Task['status']) => {
    const colors = {
      "completed": "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30",
      "in-progress": "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30",
      "pending": "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30"
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
      "high": "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30",
      "medium": "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/30",
      "low": "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30"
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
      { key: "pending", label: "Pendiente", color: "border-yellow-300 dark:border-yellow-500" },
      { key: "in-progress", label: "En Progreso", color: "border-blue-300 dark:border-blue-500" },
      { key: "completed", label: "Completada", color: "border-green-300 dark:border-green-500" }
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {statuses.map((status) => {
          const statusTasks = tasks.filter(task => task.status === status.key);
          return (
            <div key={status.key} className={`border-t-4 ${status.color} rounded-lg bg-muted/30 dark:bg-muted/20 p-3 lg:p-4 space-y-4`}>
              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                {getStatusIcon(status.key)}
                <h3 className="font-semibold text-foreground text-sm lg:text-base">{status.label}</h3>
                <Badge variant="secondary" className="text-xs bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground">
                  {statusTasks.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {statusTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-all duration-200 bg-card dark:bg-card border-border dark:border-border hover:border-primary/20 dark:hover:border-primary/30">
                    <CardHeader className="pb-2 p-3 lg:p-4">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle 
                          className="text-sm lg:text-base font-medium text-card-foreground dark:text-card-foreground line-clamp-2 flex-1" 
                          onClick={() => onTaskClick(task)}
                        >
                          {task.title}
                        </CardTitle>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-muted dark:hover:bg-muted text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(task);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-destructive/10 dark:hover:bg-destructive/20 text-muted-foreground dark:text-muted-foreground hover:text-destructive dark:hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(task);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 p-3 lg:p-4 space-y-2">
                      <p className="text-xs lg:text-sm text-muted-foreground dark:text-muted-foreground line-clamp-2 mb-3">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between text-xs lg:text-sm gap-2">
                        <span className="text-foreground dark:text-foreground font-medium truncate flex-1">
                          {task.assignee}
                        </span>
                        <div className="flex-shrink-0">
                          {getPriorityBadge(task.priority)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-muted-foreground pt-1">
                        {new Date(task.dueDate).toLocaleDateString('es-ES')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {statusTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground dark:text-muted-foreground">
                    <p className="text-sm">No hay tareas en esta categoría</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPriorityColumns = () => {
    const priorities: Array<{ key: Task['priority']; label: string; color: string }> = [
      { key: "high", label: "Alta Prioridad", color: "border-red-300 dark:border-red-500" },
      { key: "medium", label: "Media Prioridad", color: "border-orange-300 dark:border-orange-500" },
      { key: "low", label: "Baja Prioridad", color: "border-gray-300 dark:border-gray-500" }
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {priorities.map((priority) => {
          const priorityTasks = tasks.filter(task => task.priority === priority.key);
          return (
            <div key={priority.key} className={`border-t-4 ${priority.color} rounded-lg bg-muted/30 dark:bg-muted/20 p-3 lg:p-4 space-y-4`}>
              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <h3 className="font-semibold text-foreground dark:text-foreground text-sm lg:text-base">{priority.label}</h3>
                <Badge variant="secondary" className="text-xs bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground">
                  {priorityTasks.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {priorityTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-all duration-200 bg-card dark:bg-card border-border dark:border-border hover:border-primary/20 dark:hover:border-primary/30">
                    <CardHeader className="pb-2 p-3 lg:p-4">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle 
                          className="text-sm lg:text-base font-medium text-card-foreground dark:text-card-foreground line-clamp-2 flex-1" 
                          onClick={() => onTaskClick(task)}
                        >
                          {task.title}
                        </CardTitle>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-muted dark:hover:bg-muted text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(task);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-destructive/10 dark:hover:bg-destructive/20 text-muted-foreground dark:text-muted-foreground hover:text-destructive dark:hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(task);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 p-3 lg:p-4 space-y-2">
                      <p className="text-xs lg:text-sm text-muted-foreground dark:text-muted-foreground line-clamp-2 mb-3">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between text-xs lg:text-sm gap-2">
                        <span className="text-foreground dark:text-foreground font-medium truncate flex-1">
                          {task.assignee}
                        </span>
                        <div className="flex-shrink-0">
                          {getStatusBadge(task.status)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-muted-foreground pt-1">
                        {new Date(task.dueDate).toLocaleDateString('es-ES')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {priorityTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground dark:text-muted-foreground">
                    <p className="text-sm">No hay tareas en esta categoría</p>
                  </div>
                )}
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
