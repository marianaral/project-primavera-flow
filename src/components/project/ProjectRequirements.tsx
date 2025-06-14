
import { useState } from "react";
import { Project } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Requirement {
  id: string;
  title: string;
  description: string;
  type: "functional" | "technical" | "legal" | "business";
  status: "pending" | "in-review" | "approved" | "rejected";
  priority: "low" | "medium" | "high" | "critical";
  dueDate: string;
}

interface ProjectRequirementsProps {
  project: Project;
}

const ProjectRequirements = ({ project }: ProjectRequirementsProps) => {
  const [requirements] = useState<Requirement[]>([
    {
      id: "req-1",
      title: "Autenticación de usuarios",
      description: "El sistema debe permitir login seguro con email y contraseña",
      type: "functional",
      status: "approved",
      priority: "critical",
      dueDate: "2025-06-18"
    },
    {
      id: "req-2",
      title: "Compatibilidad GDPR",
      description: "Cumplimiento con regulaciones de protección de datos",
      type: "legal",
      status: "in-review",
      priority: "high",
      dueDate: "2025-06-25"
    },
    {
      id: "req-3",
      title: "Escalabilidad horizontal",
      description: "La arquitectura debe soportar escalado horizontal",
      type: "technical",
      status: "pending",
      priority: "medium",
      dueDate: "2025-07-01"
    },
    {
      id: "req-4",
      title: "Dashboard analítico",
      description: "Interfaz para visualizar métricas de negocio",
      type: "business",
      status: "approved",
      priority: "high",
      dueDate: "2025-07-15"
    }
  ]);

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
  const completionPercentage = (approvedReqs / requirements.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Requisitos del Proyecto</h3>
          <p className="text-muted-foreground">
            {approvedReqs} de {requirements.length} requisitos aprobados ({completionPercentage.toFixed(0)}%)
          </p>
        </div>
        <Button>
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
                    {new Date(requirement.dueDate).toLocaleDateString('es-ES')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectRequirements;
