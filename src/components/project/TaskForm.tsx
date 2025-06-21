
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";

interface TaskFormData {
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

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  title: string;
}

const TaskForm = ({ isOpen, onClose, onSubmit, initialData, title }: TaskFormProps) => {
  const { toast } = useToast();
  const { formatHoursToHMS, parseHMSToHours } = useSettings();
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "pending",
    assignee: "",
    dueDate: "",
    priority: "medium",
    estimatedHours: 0,
    actualHours: 0,
    tags: "",
  });
  const [estimatedTimeHMS, setEstimatedTimeHMS] = useState("00:00:00");
  const [actualTimeHMS, setActualTimeHMS] = useState("00:00:00");

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "pending",
        assignee: initialData.assignee || "",
        dueDate: initialData.dueDate || "",
        priority: initialData.priority || "medium",
        estimatedHours: initialData.estimatedHours || 0,
        actualHours: initialData.actualHours || 0,
        tags: initialData.tags || "",
      });
      setEstimatedTimeHMS(formatHoursToHMS(initialData.estimatedHours || 0));
      setActualTimeHMS(formatHoursToHMS(initialData.actualHours || 0));
    } else if (!initialData && isOpen) {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        assignee: "",
        dueDate: "",
        priority: "medium",
        estimatedHours: 0,
        actualHours: 0,
        tags: "",
      });
      setEstimatedTimeHMS("00:00:00");
      setActualTimeHMS("00:00:00");
    }
  }, [initialData, isOpen, formatHoursToHMS]);

  const handleEstimatedTimeChange = (value: string) => {
    setEstimatedTimeHMS(value);
    const hours = parseHMSToHours(value);
    setFormData({ ...formData, estimatedHours: hours });
  };

  const handleActualTimeChange = (value: string) => {
    setActualTimeHMS(value);
    const hours = parseHMSToHours(value);
    setFormData({ ...formData, actualHours: hours });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.assignee.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    onClose();
    toast({
      title: "Éxito",
      description: `Tarea ${initialData ? 'actualizada' : 'creada'} correctamente`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {initialData ? 'Modifica los datos de la tarea' : 'Completa la información para crear una nueva tarea'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-foreground">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título de la tarea"
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="assignee" className="text-foreground">Responsable *</Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                placeholder="Nombre del responsable"
                className="bg-input text-foreground border-border"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-foreground">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada de la tarea"
              rows={3}
              className="bg-input text-foreground border-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status" className="text-foreground">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                <SelectTrigger className="bg-input text-foreground border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground border-border">
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority" className="text-foreground">Prioridad</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
                <SelectTrigger className="bg-input text-foreground border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground border-border">
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate" className="text-foreground">Fecha límite</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="bg-input text-foreground border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="estimatedTime" className="text-foreground">Tiempo estimado (hh:mm:ss)</Label>
              <Input
                id="estimatedTime"
                type="text"
                value={estimatedTimeHMS}
                onChange={(e) => handleEstimatedTimeChange(e.target.value)}
                placeholder="00:00:00"
                pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="actualTime" className="text-foreground">Tiempo real (hh:mm:ss)</Label>
              <Input
                id="actualTime"
                type="text"
                value={actualTimeHMS}
                onChange={(e) => handleActualTimeChange(e.target.value)}
                placeholder="00:00:00"
                pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="tags" className="text-foreground">Etiquetas (separadas por comas)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="react, frontend, desarrollo"
                className="bg-input text-foreground border-border"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Actualizar' : 'Crear'} Tarea
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
