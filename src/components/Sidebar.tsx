"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  Bed, 
  Users, 
  CreditCard, 
  LogOut,
  ChevronRight,
  TestTube2,
  Settings,
  ListTodo,
  Sparkles,
  Building2,
  Zap,
  ShieldAlert,
  Utensils
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useClerk } from "@clerk/nextjs";
import { useI18n } from "@/context/I18nContext";
import { useAura } from "@/context/AuraContext";
import { BusinessMode, Role } from "@/types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: Role | null;
  isCreator?: boolean;
}

const menuItems = [
  { id: "Dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["ADMIN", "GERENTE", "CAJERO", "RESERVADOR"], modes: ["HOSPITALITY", "GASTRONOMY"] },
  { id: "Reservaciones", icon: Calendar, label: "Reservaciones", roles: ["ADMIN", "GERENTE", "RESERVADOR"], modes: ["HOSPITALITY"] },
  { id: "Mis Propiedades", icon: Building2, label: "Mis Propiedades", roles: ["ADMIN", "GERENTE"], modes: ["HOSPITALITY"] },
  { id: "Habitaciones", icon: Bed, label: "Habitaciones", roles: ["ADMIN", "GERENTE", "RESERVADOR"], modes: ["HOSPITALITY"] },
  { id: "Huéspedes", icon: Users, label: "Huéspedes", roles: ["ADMIN", "GERENTE", "CAJERO"], modes: ["HOSPITALITY", "GASTRONOMY"] },
  { id: "Finanzas", icon: CreditCard, label: "Finanzas", roles: ["ADMIN", "GERENTE"], modes: ["HOSPITALITY", "GASTRONOMY"] },
  { id: "Restaurante & Bar", icon: Utensils, label: "Restaurante & Bar", roles: ["ADMIN", "GERENTE", "CAJERO", "MESERO", "COCINERO"], modes: ["HOSPITALITY", "GASTRONOMY"] },
  { id: "Logs", icon: ListTodo, label: "Logs", roles: ["ADMIN"], modes: ["HOSPITALITY", "GASTRONOMY"] },
];

export function Sidebar({ activeTab, setActiveTab, role, isCreator }: SidebarProps) {
  const [mounted, setMounted] = React.useState(false);
  const { signOut } = useClerk();
  const { language, setLanguage, t } = useI18n();
  const { businessMode } = useAura();
  React.useEffect(() => setMounted(true), []);

  const filteredItems = menuItems.filter(item => 
    (!role || item.roles.includes(role)) && 
    (item.modes.includes(businessMode))
  );

  if (isCreator) {
    filteredItems.push({ id: "Sandbox", icon: TestTube2, label: "Sandbox", roles: ["ADMIN"], modes: ["HOSPITALITY", "GASTRONOMY"] });
  }

  if (!mounted) return <aside className="w-60 border-r border-white/5 bg-black" />;

  return (
    <aside className="w-60 border-r border-white/5 flex flex-col p-6 space-y-12 bg-[#0A0A0A] relative z-20">
      {/* Logo Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 px-2"
      >
        <div className="w-10 h-10 bg-[#FF385C] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,56,92,0.3)]">
          <Sparkles className="text-white" size={20} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-black font-institutional tracking-[0.2em] text-white leading-none">AURA</h1>
          <span className="text-[8px] font-black text-[#FF385C] uppercase tracking-[0.3em] mt-1">Enterprise</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <div className="pb-4 px-3 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Institutional</div>
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden",
              activeTab === item.id
                ? "text-white bg-white/5"
                : "text-zinc-500 hover:text-white hover:translate-x-1"
            )}
          >
            <div className="flex items-center space-x-4 relative z-10">
              <item.icon size={18} className={activeTab === item.id ? "text-[#3B82F6]" : "group-hover:text-white transition-colors"} />
              <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", activeTab === item.id ? "text-white" : "text-zinc-500")}>
                {item.id === "Dashboard" && t("nav.dashboard")}
                {item.id === "Reservaciones" && t("nav.reservations")}
                {item.id === "Mis Propiedades" && t("nav.properties")}
                {item.id === "Habitaciones" && t("nav.inventory")}
                {item.id === "Huéspedes" && (businessMode === "GASTRONOMY" ? t("nav.clients") : t("nav.guests"))}
                {item.id === "Finanzas" && t("nav.finances")}
                {item.id === "Restaurante & Bar" && t("rest.title")}
                {item.id === "Logs" && t("nav.logs")}
                {item.id === "Sandbox" && t("nav.sandbox")}
              </span>
            </div>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-indicator" 
                className="absolute left-0 w-1 h-5 bg-[#3B82F6] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
              />
            )}
          </motion.div>
        ))}
        
        {(role === "ADMIN" || role === "GERENTE") && (
          <div className="pt-8 space-y-1">
            <div className="pb-2 px-3 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Management</div>
            <SidebarItem 
              icon={Settings} 
              label={t("nav.settings")} 
              active={activeTab === "Configuración"} 
              onClick={() => setActiveTab("Configuración")} 
            />
            <SidebarItem 
              icon={Zap} 
              label={t("nav.plans")} 
              active={activeTab === "Planes"} 
              onClick={() => setActiveTab("Planes")} 
            />
            <SidebarItem 
              icon={ShieldAlert} 
              label={t("nav.advanced")} 
              active={activeTab === "Avanzado"} 
              onClick={() => setActiveTab("Avanzado")} 
            />
          </div>
        )}
      </nav>

      {/* Footer Area */}
      <div className="pt-8 border-t border-white/5 space-y-4">
        {/* Language Toggle */}
        <div className="flex items-center justify-center p-1 bg-white/5 rounded-2xl border border-white/5">
          <button
            onClick={() => setLanguage('es')}
            className={cn(
              "flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
              language === 'es' ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:text-white"
            )}
          >
            ES
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              "flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
              language === 'en' ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:text-white"
            )}
          >
            EN
          </button>
        </div>

        <SidebarItem icon={LogOut} label={t("nav.logout")} onClick={() => signOut({ redirectUrl: '/sign-in' })} />
        <div className="bg-white/2 p-4 rounded-2xl border border-white/5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center font-black text-[10px] text-zinc-500 border border-white/5">
            {role?.[0] || "U"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-black text-white uppercase tracking-wider truncate">Operator</span>
            <span className="text-[8px] font-bold text-[#FF385C] uppercase tracking-widest">
               {role === "ADMIN" && t("sidebar.role.admin")}
               {role === "GERENTE" && t("sidebar.role.manager")}
               {role === "CAJERO" && "Cajero"}
               {role === "MESERO" && "Mesero"}
               {role === "COCINERO" && "Cocinero"}
               {role === "RESERVADOR" && t("sidebar.role.staff")}
               {!role && t("sidebar.role.user")}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden",
        active 
          ? "text-white bg-white/5" 
          : "text-zinc-500 hover:text-white hover:translate-x-1"
      )}
    >
      <div className="flex items-center space-x-4 relative z-10">
        <Icon size={18} className={active ? "text-[#3B82F6]" : "group-hover:text-white transition-colors"} />
        <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", active ? "text-white" : "text-zinc-500")}>{label}</span>
      </div>
      {active && (
        <motion.div 
          layoutId="active-indicator-sub" 
          className="absolute left-0 w-1 h-5 bg-[#3B82F6] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
        />
      )}
    </div>
  );
}
