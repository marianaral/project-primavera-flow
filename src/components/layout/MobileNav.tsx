
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            ProjectFlow
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
                    isActive ? "bg-primary/20 text-primary font-semibold" : "text-muted-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tema</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
