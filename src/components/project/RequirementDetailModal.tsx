
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, User, Calendar, FileText } from "lucide-react";

interface Requirement {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
  notes: string;
  project_id?: string;
}

interface RequirementDetailModalProps {
  requirement: Requirement | null;
  isOpen: boolean;
  onClose: () => void;
}

const RequirementDetailModal = ({ requirement, isOpen, onClose }: RequirementDetailModalProps) => {
  if (!requirement) return null;

  const getStatusIcon = (status: Requirement['status']) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-400" />;
      case "pending":
        return <XCircle className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: Requirement['status']) => {
    const colors = {
      "completed": "bg-green-500/20 text-green-400 border-green-500/30",
      "in-progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "pending": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    };

    const labels = {
      "completed": "Completado",
      "in-progress": "En Progreso",
      "pending": "Pendiente"
    };

    return (
      <Badge variant="outline" className={colors[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Requirement['priority']) => {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background dark:bg-background text-foreground dark:text-foreground border-border dark:border-border">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {getStatusIcon(requirement.status)}
            {requirement.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            Detalles completos del requisito
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {getStatusBadge(requirement.status)}
            {getPriorityBadge(requirement.priority)}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Responsable
              </div>
              <p className="text-sm">{requirement.assignee || "Sin asignar"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Fecha límite
              </div>
              <p className="text-sm">
                {requirement.dueDate 
                  ? new Date(requirement.dueDate).toLocaleDateString('es-ES')
                  : "Sin fecha límite"
                }
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              Descripción
            </div>
            <div className="p-3 bg-muted/50 dark:bg-muted/50 rounded-md">
              <p className="text-sm whitespace-pre-wrap">
                {requirement.description || "Sin descripción"}
              </p>
            </div>
          </div>

          {requirement.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Notas adicionales
              </div>
              <div className="p-3 bg-muted/30 dark:bg-muted/30 rounded-md">
                <p className="text-sm whitespace-pre-wrap">
                  {requirement.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementDetailModal;
