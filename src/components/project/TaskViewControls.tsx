
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Columns3, Columns2 } from "lucide-react";

export type TaskViewType = "list" | "status-columns" | "priority-columns";

interface TaskViewControlsProps {
  viewType: TaskViewType;
  onViewTypeChange: (viewType: TaskViewType) => void;
}

const TaskViewControls = ({ viewType, onViewTypeChange }: TaskViewControlsProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Vista:</span>
      <ToggleGroup 
        type="single" 
        value={viewType} 
        onValueChange={(value) => value && onViewTypeChange(value as TaskViewType)}
        className="border border-border dark:border-border rounded-md"
      >
        <ToggleGroupItem 
          value="list" 
          aria-label="Vista de lista"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground dark:data-[state=on]:bg-primary dark:data-[state=on]:text-primary-foreground hover:bg-muted dark:hover:bg-muted"
        >
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="status-columns" 
          aria-label="Columnas por estado"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground dark:data-[state=on]:bg-primary dark:data-[state=on]:text-primary-foreground hover:bg-muted dark:hover:bg-muted"
        >
          <Columns3 className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="priority-columns" 
          aria-label="Columnas por prioridad"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground dark:data-[state=on]:bg-primary dark:data-[state=on]:text-primary-foreground hover:bg-muted dark:hover:bg-muted"
        >
          <Columns2 className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default TaskViewControls;
