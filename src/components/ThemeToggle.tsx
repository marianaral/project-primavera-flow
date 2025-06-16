
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is already set
    const root = document.getElementById('root');
    const isDarkMode = root?.classList.contains('dark');
    setIsDark(isDarkMode || false);
  }, []);

  const toggleTheme = () => {
    const root = document.getElementById('root');
    if (root) {
      if (isDark) {
        root.classList.remove('dark');
        setIsDark(false);
      } else {
        root.classList.add('dark');
        setIsDark(true);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 hover:bg-muted hover:text-foreground transition-colors"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-foreground transition-colors" />
      ) : (
        <Moon className="h-4 w-4 text-foreground transition-colors" />
      )}
    </Button>
  );
};

export default ThemeToggle;
