
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  currency: string;
  timeFormat: 'decimal' | 'hms'; // 'decimal' for 2 decimals, 'hms' for hh:mm:ss
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  formatTime: (hours: number) => string;
  formatCurrency: (amount: number) => string;
}

const defaultSettings: Settings = {
  currency: 'EUR',
  timeFormat: 'decimal'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Cargar configuración del localStorage al inicializar
  useEffect(() => {
    const savedSettings = localStorage.getItem('projectSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('projectSettings', JSON.stringify(updatedSettings));
  };

  const formatTime = (hours: number): string => {
    if (settings.timeFormat === 'decimal') {
      return `${hours.toFixed(2)}h`;
    } else {
      const totalMinutes = Math.round(hours * 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      const s = 0; // Para mantener consistencia con el formato solicitado
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, formatTime, formatCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
