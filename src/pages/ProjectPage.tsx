
import { useParams, Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectPage = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Proyecto no encontrado</h2>
        <Link to="/">
          <Button variant="link" className="mt-4">
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Volver a Proyectos
      </Link>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{project.name}</h1>
      <p className="text-muted-foreground">{project.description}</p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Detalles del Proyecto</h2>
        <p className="mt-4">Aquí irán los detalles completos del proyecto, gestión de tareas, finanzas, etc.</p>
        {/* Aquí se agregarán más componentes en el futuro */}
      </div>
    </div>
  );
};

export default ProjectPage;
