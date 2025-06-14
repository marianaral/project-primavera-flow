import { useState } from "react";
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

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: "personal" | "equipment" | "software" | "services" | "other";
  date: string;
  approved: boolean;
}

interface ProjectFinancesProps {
  project: Project;
}

const ProjectFinances = ({ project }: ProjectFinancesProps) => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "exp-1",
      description: "Licencias de software de desarrollo",
      amount: 2500,
      category: "software",
      date: "2025-06-01",
      approved: true
    },
    {
      id: "exp-2",
      description: "Servidor en la nube - 3 meses",
      amount: 1800,
      category: "services",
      date: "2025-06-05",
      approved: true
    },
    {
      id: "exp-3",
      description: "Consultoría externa UX/UI",
      amount: 8500,
      category: "services",
      date: "2025-06-10",
      approved: true
    },
    {
      id: "exp-4",
      description: "Equipos de desarrollo",
      amount: 15000,
      category: "equipment",
      date: "2025-06-15",
      approved: false
    }
  ]);

  const handleCreateExpense = (expenseData: any) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      ...expenseData,
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleUpdateExpense = (expenseData: any) => {
    if (!editingExpense) return;
    
    const updatedExpense: Expense = {
      ...editingExpense,
      ...expenseData,
    };
    
    setExpenses(expenses.map(exp => exp.id === editingExpense.id ? updatedExpense : exp));
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteExpense = () => {
    if (expenseToDelete) {
      setExpenses(expenses.filter(exp => exp.id !== expenseToDelete.id));
      toast({
        title: "Gasto eliminado",
        description: "El gasto ha sido eliminado correctamente",
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

  const approvedExpenses = expenses.filter(exp => exp.approved);
  const totalApprovedExpenses = approvedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetUsage = (totalApprovedExpenses / project.budget) * 100;
  const remainingBudget = project.budget - totalApprovedExpenses;

  const expensesByCategory = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = 0;
    if (exp.approved) acc[exp.category] += exp.amount;
    return acc;
  }, {} as Record<string, number>);

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
            <div className="text-2xl font-bold">${project.budget.toLocaleString()}</div>
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
            <div className="text-2xl font-bold text-red-400">${totalApprovedExpenses.toLocaleString()}</div>
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
            <div className="text-2xl font-bold text-green-400">${remainingBudget.toLocaleString()}</div>
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
            <CardDescription>Distribución del presupuesto por tipo de gasto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(expensesByCategory).map(([category, amount]) => {
                const percentage = (amount / totalApprovedExpenses) * 100;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(category as Expense['category'])}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
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
                      ${expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        expense.approved 
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }>
                        {expense.approved ? "Aprobado" : "Pendiente"}
                      </Badge>
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
