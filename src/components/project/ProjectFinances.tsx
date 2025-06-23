import { useState, useEffect } from "react";
import { Project } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import ExpenseForm from "./ExpenseForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: "personal" | "equipment" | "software" | "services" | "other";
  date: string;
  status: "pending" | "approved" | "rejected";
  project_id?: string;
}

interface ProjectFinancesProps {
  project: Project;
}

const ProjectFinances = ({ project }: ProjectFinancesProps) => {
  const { toast } = useToast();
  const { formatCurrency } = useSettings();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, [project.id]);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('project_id', project.id);

      if (error) {
        console.error('Error fetching expenses:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los gastos",
          variant: "destructive",
        });
        return;
      }

      const formattedExpenses = data?.map(expense => ({
        id: expense.id,
        description: expense.description || "",
        amount: Number(expense.amount),
        category: expense.category as "personal" | "equipment" | "software" | "services" | "other",
        date: expense.date,
        status: expense.status as "pending" | "approved" | "rejected",
        project_id: expense.project_id,
      })) || [];

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar los gastos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (expenseData: any) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          description: expenseData.description,
          amount: expenseData.amount,
          category: expenseData.category,
          date: expenseData.date,
          project_id: project.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating expense:', error);
        toast({
          title: "Error",
          description: "No se pudo crear el gasto",
          variant: "destructive",
        });
        return;
      }

      const newExpense: Expense = {
        id: data.id,
        description: data.description || "",
        amount: Number(data.amount),
        category: data.category as "personal" | "equipment" | "software" | "services" | "other",
        date: data.date,
        status: "approved",
        project_id: data.project_id,
      };

      setExpenses([...expenses, newExpense]);
      toast({
        title: "Gasto creado",
        description: "El gasto ha sido creado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el gasto",
        variant: "destructive",
      });
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleUpdateExpense = async (expenseData: any) => {
    if (!editingExpense) return;
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          description: expenseData.description,
          amount: expenseData.amount,
          category: expenseData.category,
          date: expenseData.date,
        })
        .eq('id', editingExpense.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating expense:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el gasto",
          variant: "destructive",
        });
        return;
      }

      const updatedExpense: Expense = {
        ...editingExpense,
        description: data.description || "",
        amount: Number(data.amount),
        category: data.category as "personal" | "equipment" | "software" | "services" | "other",
        date: data.date,
        status: "approved",
      };

      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? updatedExpense : exp));
      setEditingExpense(null);
      toast({
        title: "Gasto actualizado",
        description: "El gasto ha sido actualizado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el gasto",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseToDelete.id);

      if (error) {
        console.error('Error deleting expense:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el gasto",
          variant: "destructive",
        });
        return;
      }

      setExpenses(expenses.filter(exp => exp.id !== expenseToDelete.id));
      toast({
        title: "Gasto eliminado",
        description: "El gasto ha sido eliminado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el gasto",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const getCategoryBadge = (category: Expense['category']) => {
    const colors = {
      "personal": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "equipment": "bg-purple-500/20 text-purple-400 border-purple-500/30",
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

  const getStatusBadge = (status: Expense['status']) => {
    const colors = {
      "pending": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "approved": "bg-green-500/20 text-green-400 border-green-500/30",
      "rejected": "bg-red-500/20 text-red-400 border-red-500/30"
    };

    const labels = {
      "pending": "Pendiente",
      "approved": "Aprobado",
      "rejected": "Rechazado"
    };

    return (
      <Badge variant="outline" className={colors[status]}>
        {labels[status]}
      </Badge>
    );
  };

  // Only count approved expenses for financial calculations
  const approvedExpenses = expenses.filter(exp => exp.status === 'approved');
  const totalApprovedExpenses = approvedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetUsage = (totalApprovedExpenses / project.budget) * 100;
  const remainingBudget = project.budget - totalApprovedExpenses;

  // Only count approved expenses for category breakdown
  const expensesByCategory = approvedExpenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = 0;
    acc[exp.category] += exp.amount;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-muted-foreground">Cargando finanzas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestión Financiera</h3>
          <p className="text-muted-foreground">
            Control de gastos y presupuesto del proyecto
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Gasto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Presupuesto Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(project.budget)}</div>
            <p className="text-xs text-muted-foreground">Asignado al proyecto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-400" />
              Gastado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{formatCurrency(totalApprovedExpenses)}</div>
            <p className="text-xs text-muted-foreground">{budgetUsage.toFixed(1)}% del presupuesto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              Disponible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(remainingBudget)}</div>
            <p className="text-xs text-muted-foreground">{(100 - budgetUsage).toFixed(1)}% restante</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {budgetUsage > 90 ? (
                <span className="text-red-400">Crítico</span>
              ) : budgetUsage > 75 ? (
                <span className="text-yellow-400">Alerta</span>
              ) : (
                <span className="text-green-400">Saludable</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Control presupuestario</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
            <CardDescription>Distribución del presupuesto por tipo de gasto (solo aprobados)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(expensesByCategory).map(([category, amount]) => {
                const percentage = totalApprovedExpenses > 0 ? (amount / totalApprovedExpenses) * 100 : 0;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(category as Expense['category'])}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(amount)}</div>
                      <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(expensesByCategory).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No hay gastos aprobados aún
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Gastos</CardTitle>
            <CardDescription>Últimos movimientos financieros</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{expense.description}</div>
                        {getCategoryBadge(expense.category)}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(expense.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditExpense(expense)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense)}
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
      </div>

      {/* Expense Form Dialog */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
        initialData={editingExpense || undefined}
        title={editingExpense ? "Editar Gasto" : "Registrar Gasto"}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el gasto "{expenseToDelete?.description}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteExpense}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectFinances;
