
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Columns3, Columns2 } from "lucide-react";

export type TaskViewType = "list" | "status-columns" | "priority-columns";

interface TaskViewControlsProps {
  viewType: TaskViewType;
  onViewTypeChange: (viewType: TaskViewType) => void;
}

const TaskViewControls = ({ viewType, onViewTypeChange }: TaskViewControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Vista:</span>
      <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && onViewTypeChange(value as TaskViewType)}>
        <ToggleGroupItem value="list" aria-label="Vista de lista">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="status-columns" aria-label="Columnas por estado">
          <Columns3 className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="priority-columns" aria-label="Columnas por prioridad">
          <Columns2 className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default TaskViewControls;
