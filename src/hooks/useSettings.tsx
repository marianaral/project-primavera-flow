
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
  parseTimeToHours: (timeString: string) => number;
  formatHoursToHMS: (hours: number) => string;
  parseHMSToHours: (hmsString: string) => number;
}

const defaultSettings: Settings = {
  currency: 'EUR',
  timeFormat: 'hms' // Changed default to hh:mm:ss format
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

  const formatHoursToHMS = (hours: number): string => {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const s = 0; // Para mantener consistencia con el formato solicitado
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const parseHMSToHours = (hmsString: string): number => {
    if (!hmsString || hmsString.trim() === '') return 0;
    
    const parts = hmsString.split(':');
    if (parts.length !== 3) return 0;
    
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;
    
    return hours + (minutes / 60) + (seconds / 3600);
  };

  const formatTime = (hours: number): string => {
    if (settings.timeFormat === 'decimal') {
      return `${hours.toFixed(2)}h`;
    } else {
      return formatHoursToHMS(hours);
    }
  };

  const parseTimeToHours = (timeString: string): number => {
    if (!timeString) return 0;
    
    // If it's in hh:mm:ss format
    if (timeString.includes(':')) {
      return parseHMSToHours(timeString);
    }
    
    // If it's in decimal format (e.g., "2.5h" or "2.5")
    const numericValue = parseFloat(timeString.replace(/[^\d.]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      formatTime, 
      formatCurrency, 
      parseTimeToHours, 
      formatHoursToHMS, 
      parseHMSToHours 
    }}>
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
