import { useState, useEffect } from "react";
import { Project } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, CheckCircle, Clock, AlertTriangle, FileText, Edit, Trash2 } from "lucide-react";
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
import RequirementForm from "./RequirementForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Requirement {
  id: string;
  title: string;
  description: string;
  type: "functional" | "technical" | "legal" | "business";
  status: "pending" | "in-review" | "approved" | "rejected";
  priority: "low" | "medium" | "high" | "critical";
  dueDate: string;
  project_id?: string;
}

interface ProjectRequirementsProps {
  project: Project;
}

const ProjectRequirements = ({ project }: ProjectRequirementsProps) => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requirementToDelete, setRequirementToDelete] = useState<Requirement | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequirements();
  }, [project.id]);

  const fetchRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('requirements')
        .select('*')
        .eq('project_id', project.id);

      if (error) {
        console.error('Error fetching requirements:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los requisitos",
          variant: "destructive",
        });
        return;
      }

      const formattedRequirements = data?.map(req => ({
        id: req.id,
        title: req.title,
        description: req.description || "",
        type: req.type as "functional" | "technical" | "legal" | "business",
        status: req.status as "pending" | "in-review" | "approved" | "rejected",
        priority: req.priority as "low" | "medium" | "high" | "critical",
        dueDate: req.deadline || "",
        project_id: req.project_id,
      })) || [];

      setRequirements(formattedRequirements);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar los requisitos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequirement = async (requirementData: any) => {
    try {
      const { data, error } = await supabase
        .from('requirements')
        .insert([{
          title: requirementData.title,
          description: requirementData.description,
          type: requirementData.type,
          status: requirementData.status,
          priority: requirementData.priority,
          deadline: requirementData.dueDate || null,
          project_id: project.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating requirement:', error);
        toast({
          title: "Error",
          description: "No se pudo crear el requisito",
          variant: "destructive",
        });
        return;
      }

      const newRequirement: Requirement = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        type: data.type,
        status: data.status,
        priority: data.priority,
        dueDate: data.deadline || "",
        project_id: data.project_id,
      };

      setRequirements([...requirements, newRequirement]);
      toast({
        title: "Requisito creado",
        description: "El requisito ha sido creado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el requisito",
        variant: "destructive",
      });
    }
  };

  const handleEditRequirement = (requirement: Requirement) => {
    setEditingRequirement(requirement);
    setIsFormOpen(true);
  };

  const handleUpdateRequirement = async (requirementData: any) => {
    if (!editingRequirement) return;
    
    try {
      const { data, error } = await supabase
        .from('requirements')
        .update({
          title: requirementData.title,
          description: requirementData.description,
          type: requirementData.type,
          status: requirementData.status,
          priority: requirementData.priority,
          deadline: requirementData.dueDate || null,
        })
        .eq('id', editingRequirement.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating requirement:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el requisito",
          variant: "destructive",
        });
        return;
      }

      const updatedRequirement: Requirement = {
        ...editingRequirement,
        title: data.title,
        description: data.description || "",
        type: data.type,
        status: data.status,
        priority: data.priority,
        dueDate: data.deadline || "",
      };

      setRequirements(requirements.map(req => req.id === editingRequirement.id ? updatedRequirement : req));
      setEditingRequirement(null);
      toast({
        title: "Requisito actualizado",
        description: "El requisito ha sido actualizado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el requisito",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRequirement = (requirement: Requirement) => {
    setRequirementToDelete(requirement);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRequirement = async () => {
    if (!requirementToDelete) return;

    try {
      const { error } = await supabase
        .from('requirements')
        .delete()
        .eq('id', requirementToDelete.id);

      if (error) {
        console.error('Error deleting requirement:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el requisito",
          variant: "destructive",
        });
        return;
      }

      setRequirements(requirements.filter(req => req.id !== requirementToDelete.id));
      toast({
        title: "Requisito eliminado",
        description: "El requisito ha sido eliminado correctamente",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el requisito",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setRequirementToDelete(null);
  };

  const getStatusIcon = (status: Requirement['status']) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "in-review":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusBadge = (status: Requirement['status']) => {
    const colors = {
      "approved": "bg-green-500/20 text-green-400 border-green-500/30",
      "in-review": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "pending": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "rejected": "bg-red-500/20 text-red-400 border-red-500/30"
    };

    const labels = {
      "approved": "Aprobado",
      "in-review": "En Revisión",
      "pending": "Pendiente",
      "rejected": "Rechazado"
    };

    return (
      <Badge variant="outline" className={colors[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getTypeBadge = (type: Requirement['type']) => {
    const colors = {
      "functional": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "technical": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "legal": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "business": "bg-pink-500/20 text-pink-400 border-pink-500/30"
    };

    const labels = {
      "functional": "Funcional",
      "technical": "Técnico",
      "legal": "Legal",
      "business": "Negocio"
    };

    return (
      <Badge variant="outline" className={colors[type]}>
        {labels[type]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Requirement['priority']) => {
    const colors = {
      "critical": "bg-red-600/20 text-red-400 border-red-600/30",
      "high": "bg-red-500/20 text-red-400 border-red-500/30",
      "medium": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "low": "bg-gray-500/20 text-gray-400 border-gray-500/30"
    };

    const labels = {
      "critical": "Crítica",
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

  const approvedReqs = requirements.filter(req => req.status === "approved").length;
  const completionPercentage = requirements.length > 0 ? (approvedReqs / requirements.length) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-muted-foreground">Cargando requisitos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Requisitos del Proyecto</h3>
          <p className="text-muted-foreground">
            {approvedReqs} de {requirements.length} requisitos aprobados ({completionPercentage.toFixed(0)}%)
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Requisito
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {["functional", "technical", "legal", "business"].map((type) => {
          const typeReqs = requirements.filter(req => req.type === type);
          const approvedTypeReqs = typeReqs.filter(req => req.status === "approved").length;
          
          return (
            <Card key={type}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {type === "functional" && "Funcionales"}
                  {type === "technical" && "Técnicos"}
                  {type === "legal" && "Legales"}
                  {type === "business" && "Negocio"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedTypeReqs}/{typeReqs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {typeReqs.length > 0 ? ((approvedTypeReqs / typeReqs.length) * 100).toFixed(0) : 0}% completado
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Requisitos</CardTitle>
          <CardDescription>
            Gestiona todos los requisitos del proyecto {project.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead>Requisito</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Fecha límite</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirements.map((requirement) => (
                <TableRow key={requirement.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(requirement.status)}
                      {getStatusBadge(requirement.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{requirement.title}</div>
                      <div className="text-sm text-muted-foreground">{requirement.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(requirement.type)}</TableCell>
                  <TableCell>{getPriorityBadge(requirement.priority)}</TableCell>
                  <TableCell>
                    {requirement.dueDate ? new Date(requirement.dueDate).toLocaleDateString('es-ES') : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRequirement(requirement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRequirement(requirement)}
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

      <RequirementForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRequirement(null);
        }}
        onSubmit={editingRequirement ? handleUpdateRequirement : handleCreateRequirement}
        initialData={editingRequirement || undefined}
        title={editingRequirement ? "Editar Requisito" : "Nuevo Requisito"}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el requisito "{requirementToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRequirement}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectRequirements;
