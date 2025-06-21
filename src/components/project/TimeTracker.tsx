
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Clock, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";

interface Task {
  id: string;
  title: string;
  actual_hours: number;
}

interface TimeEntry {
  id: string;
  task_id: string;
  start_time: string;
  end_time: string | null;
  hours_worked: number | null;
  description: string | null;
  date: string;
}

interface TimeTrackerProps {
  tasks: Task[];
  onTimeUpdate: () => void;
}

const TimeTracker = ({ tasks, onTimeUpdate }: TimeTrackerProps) => {
  const { toast } = useToast();
  const { formatHoursToHMS, parseHMSToHours } = useSettings();
  const [activeTimers, setActiveTimers] = useState<Record<string, Date>>({});
  const [manualTimeDialog, setManualTimeDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [manualTime, setManualTime] = useState("00:00:00");
  const [timeDescription, setTimeDescription] = useState("");
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, string>>({});

  // Update elapsed times for active timers - fixed to show real-time hh:mm:ss
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newElapsedTimes: Record<string, string> = {};
      
      Object.entries(activeTimers).forEach(([taskId, startTime]) => {
        const elapsedMs = now.getTime() - startTime.getTime();
        const elapsedSeconds = Math.floor(elapsedMs / 1000);
        
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        
        newElapsedTimes[taskId] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      });
      
      setElapsedTimes(newElapsedTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimers]);

  const startTimer = (taskId: string) => {
    setActiveTimers(prev => ({
      ...prev,
      [taskId]: new Date()
    }));
    
    toast({
      title: "Timer iniciado",
      description: "Se ha iniciado el registro de tiempo para esta tarea",
    });
  };

  const stopTimer = async (taskId: string) => {
    const startTime = activeTimers[taskId];
    if (!startTime) return;

    const endTime = new Date();
    const hoursWorked = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    try {
      // Actualizar las horas reales de la tarea
      const currentTask = tasks.find(t => t.id === taskId);
      const newActualHours = (currentTask?.actual_hours || 0) + hoursWorked;

      const { error } = await supabase
        .from('tasks')
        .update({ actual_hours: newActualHours })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task hours:', error);
        toast({
          title: "Error",
          description: "No se pudieron actualizar las horas de la tarea",
          variant: "destructive",
        });
        return;
      }

      // Remover el timer activo
      setActiveTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[taskId];
        return newTimers;
      });

      // Limpiar el tiempo transcurrido
      setElapsedTimes(prev => {
        const newTimes = { ...prev };
        delete newTimes[taskId];
        return newTimes;
      });

      onTimeUpdate();
      
      toast({
        title: "Timer detenido",
        description: `Se registraron ${formatHoursToHMS(hoursWorked)} de trabajo`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar el tiempo",
        variant: "destructive",
      });
    }
  };

  const addManualTime = async () => {
    if (!selectedTaskId || !manualTime) return;

    const hours = parseHMSToHours(manualTime);
    if (isNaN(hours) || hours <= 0) {
      toast({
        title: "Error",
        description: "Ingrese un tiempo válido en formato hh:mm:ss",
        variant: "destructive",
      });
      return;
    }

    try {
      // Actualizar las horas reales de la tarea
      const currentTask = tasks.find(t => t.id === selectedTaskId);
      const newActualHours = (currentTask?.actual_hours || 0) + hours;

      const { error } = await supabase
        .from('tasks')
        .update({ actual_hours: newActualHours })
        .eq('id', selectedTaskId);

      if (error) {
        console.error('Error updating task hours:', error);
        toast({
          title: "Error",
          description: "No se pudieron actualizar las horas de la tarea",
          variant: "destructive",
        });
        return;
      }

      // Limpiar el formulario
      setSelectedTaskId("");
      setManualTime("00:00:00");
      setTimeDescription("");
      setWorkDate(new Date().toISOString().split('T')[0]);
      setManualTimeDialog(false);
      
      onTimeUpdate();
      
      toast({
        title: "Tiempo registrado",
        description: `Se registraron ${manualTime} de trabajo`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar el tiempo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Registro de Tiempo</h3>
        <Dialog open={manualTimeDialog} onOpenChange={setManualTimeDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Tiempo Manual
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Tiempo Manual</DialogTitle>
              <DialogDescription>
                Agrega tiempo trabajado manualmente a una tarea específica
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-select">Tarea</Label>
                <select
                  id="task-select"
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="">Seleccionar tarea...</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="time">Tiempo trabajado (hh:mm:ss)</Label>
                <Input
                  id="time"
                  type="text"
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  placeholder="02:30:00"
                  pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                />
              </div>
              <div>
                <Label htmlFor="date">Fecha de trabajo</Label>
                <Input
                  id="date"
                  type="date"
                  value={workDate}
                  onChange={(e) => setWorkDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  value={timeDescription}
                  onChange={(e) => setTimeDescription(e.target.value)}
                  placeholder="Describe el trabajo realizado..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setManualTimeDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={addManualTime}>
                Registrar Tiempo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{task.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatHoursToHMS(task.actual_hours || 0)}
                  </Badge>
                  {activeTimers[task.id] ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => stopTimer(task.id)}
                    >
                      <Square className="h-4 w-4 mr-1" />
                      Detener
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startTimer(task.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Iniciar
                    </Button>
                  )}
                </div>
              </div>
              {activeTimers[task.id] && (
                <div className="text-sm text-muted-foreground">
                  Tiempo activo: {elapsedTimes[task.id] || "00:00:00"}
                </div>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TimeTracker;
