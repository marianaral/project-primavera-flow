
import { Project } from "@/data/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, Clock, Target } from "lucide-react";

interface ProjectOverviewProps {
  project: Project;
}

const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  const statusColors = {
    "To-do": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Doing": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Finished": "bg-green-500/20 text-green-400 border-green-500/30",
  };

  const budgetUsage = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Estado del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Estado actual:</span>
            <Badge variant="outline" className={statusColors[project.status]}>
              {project.status}
            </Badge>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span>Progreso:</span>
              <span className="font-semibold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cronograma
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Fecha de inicio:</span>
            <span className="font-semibold">
              {new Date(project.startDate).toLocaleDateString('es-ES')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Fecha de fin:</span>
            <span className="font-semibold">
              {new Date(project.endDate).toLocaleDateString('es-ES')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Duración total:</span>
            <span className="font-semibold">
              {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 3600 * 24))} días
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Presupuesto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Presupuesto total:</span>
            <span className="font-semibold">${project.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Gastado:</span>
            <span className="font-semibold">${project.spent.toLocaleString()}</span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span>Utilización:</span>
              <span className="font-semibold">{budgetUsage.toFixed(1)}%</span>
            </div>
            <Progress value={budgetUsage} className="w-full" />
          </div>
          <div className="flex items-center justify-between">
            <span>Restante:</span>
            <span className="font-semibold text-green-400">
              ${(project.budget - project.spent).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Información Adicional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold mb-2">Descripción completa:</h4>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
