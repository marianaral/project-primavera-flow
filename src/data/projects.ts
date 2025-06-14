
export type ProjectStatus = "To-do" | "Doing" | "Finished";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
}

export const projects: Project[] = [
  {
    id: "proj-001",
    name: "Lanzamiento de Nuevo Producto",
    description: "Coordinar el lanzamiento de la nueva línea de productos de verano.",
    status: "Doing",
    progress: 65,
    startDate: "2025-05-01",
    endDate: "2025-08-15",
    budget: 50000,
    spent: 32000,
  },
  {
    id: "proj-002",
    name: "Migración a la Nube",
    description: "Mover toda la infraestructura on-premise a AWS.",
    status: "Doing",
    progress: 40,
    startDate: "2025-04-10",
    endDate: "2025-10-30",
    budget: 120000,
    spent: 45000,
  },
  {
    id: "proj-003",
    name: "Rediseño del Sitio Web",
    description: "Actualizar el diseño y la UX del sitio web corporativo.",
    status: "Finished",
    progress: 100,
    startDate: "2025-01-15",
    endDate: "2025-04-20",
    budget: 35000,
    spent: 34500,
  },
  {
    id: "proj-004",
    name: "Campaña de Marketing Q3",
    description: "Planificar y ejecutar la campaña de marketing para el tercer trimestre.",
    status: "To-do",
    progress: 10,
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    budget: 25000,
    spent: 2500,
  },
    {
    id: "proj-005",
    name: "Implementación de CRM",
    description: "Seleccionar e implementar un nuevo sistema de CRM para el equipo de ventas.",
    status: "Doing",
    progress: 80,
    startDate: "2025-03-01",
    endDate: "2025-07-20",
    budget: 75000,
    spent: 65000,
  },
    {
    id: "proj-006",
    name: "Auditoría de Seguridad Anual",
    description: "Realizar la auditoría de seguridad de sistemas y aplicaciones.",
    status: "To-do",
    progress: 0,
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    budget: 15000,
    spent: 0,
  },
];
