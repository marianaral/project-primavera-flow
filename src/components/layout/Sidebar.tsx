
import { NavLink } from "react-router-dom";
import { Briefcase, LayoutDashboard, Settings, Bot } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

const Sidebar = () => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/projects", label: "Proyectos", icon: Briefcase },
    { to: "/settings", label: "Ajustes", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 min-w-64 bg-card border-r border-border p-4 sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 min-w-0">
          <Bot className="h-8 w-8 text-primary flex-shrink-0" />
          <h1 className="text-xl font-bold text-foreground truncate">ProjectFlow</h1>
        </div>
        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
                isActive ? "bg-primary/20 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
