
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { settings, updateSettings, formatTime, formatCurrency } = useSettings();
  const { toast } = useToast();

  const currencies = [
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'Dólar estadounidense ($)' },
    { value: 'GBP', label: 'Libra esterlina (£)' },
    { value: 'JPY', label: 'Yen japonés (¥)' },
    { value: 'CAD', label: 'Dólar canadiense (CAD)' },
    { value: 'AUD', label: 'Dólar australiano (AUD)' },
    { value: 'CHF', label: 'Franco suizo (CHF)' },
    { value: 'MXN', label: 'Peso mexicano (MXN)' },
  ];

  const handleCurrencyChange = (newCurrency: string) => {
    updateSettings({ currency: newCurrency });
    toast({
      title: "Divisa actualizada",
      description: `La divisa se ha cambiado a ${currencies.find(c => c.value === newCurrency)?.label}`,
    });
  };

  const handleTimeFormatChange = (newFormat: 'decimal' | 'hms') => {
    updateSettings({ timeFormat: newFormat });
    toast({
      title: "Formato de tiempo actualizado",
      description: `El formato se ha cambiado a ${newFormat === 'decimal' ? 'decimal' : 'hh:mm:ss'}`,
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>
      </div>

      <div className="grid gap-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil
            </CardTitle>
            <CardDescription>
              Configura tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" />
              </div>
            </div>
            <Button>Guardar cambios</Button>
          </CardContent>
        </Card>

        {/* Configuración Regional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configuración Regional
            </CardTitle>
            <CardDescription>
              Configura la divisa y formatos de visualización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Divisa</Label>
              <Select value={settings.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar divisa" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Ejemplo: {formatCurrency(1234.56)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Tiempo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Formato de Tiempo
            </CardTitle>
            <CardDescription>
              Configura cómo se muestran las horas trabajadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Formato de visualización</Label>
              <Select value={settings.timeFormat} onValueChange={handleTimeFormatChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decimal">Decimal (ej: 2.50h)</SelectItem>
                  <SelectItem value="hms">Horas:Minutos:Segundos (ej: 02:30:00)</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Ejemplo: {formatTime(2.5)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Configura cómo quieres recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Notificaciones por email</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="project-updates">Actualizaciones de proyectos</Label>
              <Switch id="project-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-reminders">Recordatorios de tareas</Label>
              <Switch id="task-reminders" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacidad y Seguridad
            </CardTitle>
            <CardDescription>
              Controla tu privacidad y seguridad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-public">Perfil público</Label>
              <Switch id="profile-public" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Permitir análisis</Label>
              <Switch id="analytics" defaultChecked />
            </div>
            <Button variant="outline">Cambiar contraseña</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
