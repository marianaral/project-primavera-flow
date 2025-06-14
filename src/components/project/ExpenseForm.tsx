
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

interface ExpenseFormData {
  description: string;
  amount: number;
  category: "personal" | "equipment" | "software" | "services" | "other";
  date: string;
  status: "pending" | "approved" | "rejected";
}

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: ExpenseFormData) => void;
  initialData?: Partial<ExpenseFormData>;
  title: string;
}

const ExpenseForm = ({ isOpen, onClose, onSubmit, initialData, title }: ExpenseFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: "",
    amount: 0,
    category: "other",
    date: new Date().toISOString().split('T')[0],
    status: "pending",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          description: initialData.description || "",
          amount: initialData.amount || 0,
          category: initialData.category || "other",
          date: initialData.date || new Date().toISOString().split('T')[0],
          status: initialData.status || "pending",
        });
      } else {
        setFormData({
          description: "",
          amount: 0,
          category: "other",
          date: new Date().toISOString().split('T')[0],
          status: "pending",
        });
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || formData.amount <= 0) {
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
      description: `Gasto ${initialData ? 'actualizado' : 'registrado'} correctamente`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Modifica los datos del gasto' : 'Completa la información para registrar un nuevo gasto'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del gasto"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Monto *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="equipment">Equipamiento</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="services">Servicios</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="approved">Aprobado</SelectItem>
                  <SelectItem value="rejected">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Actualizar' : 'Registrar'} Gasto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm;
