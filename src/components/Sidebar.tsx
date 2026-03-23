"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  Bed, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronRight,
  TestTube2,
  ListTodo
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: "ADMIN" | "GERENTE" | "RESERVADOR" | null;
  isCreator?: boolean;
}

const menuItems = [
  { id: "Dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["ADMIN", "GERENTE", "RESERVADOR"] },
  { id: "Reservaciones", icon: Calendar, label: "Reservaciones", roles: ["ADMIN", "GERENTE", "RESERVADOR"] },
  { id: "Habitaciones", icon: Bed, label: "Habitaciones", roles: ["ADMIN", "GERENTE", "RESERVADOR"] },
  { id: "Huéspedes", icon: Users, label: "Huéspedes", roles: ["ADMIN", "GERENTE"] },
  { id: "Finanzas", icon: CreditCard, label: "Finanzas", roles: ["ADMIN"] },
  { id: "Logs", icon: ListTodo, label: "Logs", roles: ["ADMIN"] },
];

export function Sidebar({ activeTab, setActiveTab, role, isCreator }: SidebarProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const filteredItems = menuItems.filter(item => !role || item.roles.includes(role));

  if (isCreator) {
    filteredItems.push({ id: "Sandbox", icon: TestTube2, label: "Sandbox", roles: ["ADMIN"] });
  }

  if (!mounted) return <aside className="w-64 border-r border-border" />;

  return (
    <aside className="w-64 border-r border-border flex flex-col p-6 space-y-8 bg-background relative z-20">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-2 px-4"
      >
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-background font-bold">A</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-outfit tracking-tight text-foreground leading-tight">Aura ERP</h1>
          {role && (
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{role}</span>
          )}
        </div>
      </motion.div>

      <nav className="flex-1 space-y-1">
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden",
              activeTab === item.id 
                ? "bg-primary text-background font-semibold" 
                : "text-muted hover:text-foreground hover:bg-accent"
            )}
          >
            <div className="flex items-center space-x-3 relative z-10">
              <item.icon size={20} className={activeTab === item.id ? "text-background" : "group-hover:text-primary transition-colors"} />
              <span className="text-sm">{item.label}</span>
            </div>
            {activeTab === item.id && (
              <motion.div layoutId="active" className="absolute inset-0 bg-primary z-0" />
            )}
            <ChevronRight size={14} className={cn("opacity-0 transition-all", activeTab === item.id ? "opacity-100" : "group-hover:opacity-100")} />
          </motion.div>
        ))}
        
        {(role === "ADMIN" || role === "GERENTE") && (
          <>
            <div className="pt-8 pb-2 px-4 text-[10px] font-bold text-muted uppercase tracking-widest">Avanzado</div>
            <SidebarItem icon={Settings} label="Configuración" />
          </>
        )}
      </nav>

      <div className="pt-8 border-t border-border">
        <SidebarItem icon={LogOut} label="Cerrar Sesión" />
      </div>
    </aside>
  );
}

function SidebarItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer text-muted hover:text-foreground hover:bg-accent transition-all">
      <Icon size={20} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
