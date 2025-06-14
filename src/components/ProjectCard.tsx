
import { Project, ProjectStatus } from "@/data/projects";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

const statusColors: Record<ProjectStatus, string> = {
  "To-do": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Doing": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Finished": "bg-green-500/20 text-green-400 border-green-500/30",
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link to={`/project/${project.id}`}>
      <Card className="h-full flex flex-col hover:border-primary/80 transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <Badge variant="outline" className={statusColors[project.status]}>
              {project.status}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-sm text-muted-foreground">Progreso</div>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={project.progress} className="w-full" />
            <span className="font-semibold text-foreground">{project.progress}%</span>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Vence: {new Date(project.endDate).toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
