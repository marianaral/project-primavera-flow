
import { useState, useEffect } from "react";
import { Project } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, DollarSign, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
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

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: "personal" | "equipment" | "software" | "services" | "other";
  date: string;
  approved: boolean;
  project_id?: string;
}

interface ProjectExpensesProps {
  project: Project;
}

const ProjectExpenses = ({ project }: ProjectExpensesProps) => {
  const { toast } = useToast();
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
        approved: false, // TODO: Add approved field to schema
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
        category: data.category,
        date: data.date,
        approved: expenseData.approved,
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
        category: data.category,
        date: data.date,
        approved: expenseData.approved,
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

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses.filter(exp => exp.approved).reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => !exp.approved).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-muted-foreground">Cargando gastos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gastos del Proyecto</h3>
          <p className="text-muted-foreground">
            Total gastado: ${totalExpenses.toLocaleString()} • {pendingExpenses} gastos pendientes
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Gasto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} gastos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Gastos Aprobados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${approvedExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter(exp => exp.approved).length} aprobados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses}</div>
            <p className="text-xs text-muted-foreground">
              Gastos por aprobar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Por gasto
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Gastos</CardTitle>
          <CardDescription>
            Gestiona todos los gastos del proyecto {project.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {expense.approved ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-orange-400" />
                      )}
                      <Badge variant={expense.approved ? "default" : "secondary"}>
                        {expense.approved ? "Aprobado" : "Pendiente"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{expense.description}</div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(expense.category)}</TableCell>
                  <TableCell className="font-medium">
                    ${expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString('es-ES')}
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

      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
        initialData={editingExpense || undefined}
        title={editingExpense ? "Editar Gasto" : "Nuevo Gasto"}
      />

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

export default ProjectExpenses;
