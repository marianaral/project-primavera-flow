
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Briefcase, LayoutDashboard, Settings, Bot, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "../ThemeToggle";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/projects", label: "Proyectos", icon: Briefcase },
    { to: "/settings", label: "Ajustes", icon: Settings },
  ];

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-background border-border hover:bg-muted hover:text-foreground dark:bg-background dark:border-border dark:hover:bg-muted dark:hover:text-foreground"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:w-80 bg-background border-border dark:bg-background dark:border-border">
            <SheetHeader className="text-left">
              <SheetTitle className="flex items-center gap-2 text-foreground dark:text-foreground">
                <Bot className="h-6 w-6 text-primary dark:text-primary flex-shrink-0" />
                <span className="truncate">ProjectFlow</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6 h-full">
              <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground ${
                        isActive 
                          ? "bg-primary/20 text-primary font-semibold dark:bg-primary/20 dark:text-primary" 
                          : "text-muted-foreground dark:text-muted-foreground"
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary dark:text-primary flex-shrink-0" />
          <h1 className="text-lg font-bold text-foreground dark:text-foreground truncate">ProjectFlow</h1>
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default MobileNav;
