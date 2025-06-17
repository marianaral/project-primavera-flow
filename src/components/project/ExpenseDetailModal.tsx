
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, DollarSign, Calendar, FileText, Tag } from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: "personal" | "equipment" | "software" | "services" | "other";
  date: string;
  status: "pending" | "approved" | "rejected";
  project_id?: string;
}

interface ExpenseDetailModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
}

const ExpenseDetailModal = ({ expense, isOpen, onClose }: ExpenseDetailModalProps) => {
  if (!expense) return null;

  const getStatusIcon = (status: Expense['status']) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-400" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: Expense['status']) => {
    const colors = {
      "approved": "bg-green-500/20 text-green-400 border-green-500/30",
      "rejected": "bg-red-500/20 text-red-400 border-red-500/30",
      "pending": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    };

    const labels = {
      "approved": "Aprobado",
      "rejected": "Rechazado",
      "pending": "Pendiente"
    };

    return (
      <Badge variant="outline" className={colors[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getCategoryBadge = (category: Expense['category']) => {
    const colors = {
      "personal": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "equipment": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "software": "bg-green-500/20 text-green-400 border-green-500/30",
      "services": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "other": "bg-gray-500/20 text-gray-400 border-gray-500/30"
    };

    const labels = {
      "personal": "Personal",
      "equipment": "Equipamiento",
      "software": "Software",
      "services": "Servicios",
      "other": "Otros"
    };

    return (
      <Badge variant="outline" className={colors[category]}>
        {labels[category]}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background dark:bg-background text-foreground dark:text-foreground border-border dark:border-border">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {getStatusIcon(expense.status)}
            Detalle del Gasto
          </DialogTitle>
          <DialogDescription className="text-base">
            Información completa del gasto registrado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {getStatusBadge(expense.status)}
            {getCategoryBadge(expense.category)}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Monto
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${expense.amount.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Fecha
              </div>
              <p className="text-sm">
                {new Date(expense.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Tag className="h-4 w-4" />
              Categoría
            </div>
            <div className="flex items-center gap-2">
              {getCategoryBadge(expense.category)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              Descripción
            </div>
            <div className="p-4 bg-muted/50 dark:bg-muted/50 rounded-md">
              <p className="text-sm whitespace-pre-wrap">
                {expense.description || "Sin descripción"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDetailModal;
