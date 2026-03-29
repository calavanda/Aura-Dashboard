"use client";

import React, { useState, useEffect } from "react";
import { AuraProvider, useAura } from "@/context/AuraContext";
import { Sidebar } from "@/components/Sidebar";
import { RoomGrid } from "@/components/RoomGrid";
import { ReservationList } from "@/components/ReservationList";
import { SetupWizard } from "@/components/Onboarding/SetupWizard";
import { WelcomeTour } from "@/components/Onboarding/WelcomeTour";
import { AddRoomModal } from "@/components/Onboarding/AddRoomModal";
import { ParticleBackground } from "@/components/ParticleBackground";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserButton,
  useUser 
} from "@clerk/nextjs";
import { useI18n } from "@/context/I18nContext";
import { clsx } from "clsx";
import { 
  TrendingUp, 
  Bed, 
  CreditCard, 
  CheckCircle2, 
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { NotificationCenter } from "@/components/NotificationCenter";
import { TrialBanner } from "@/components/TrialBanner";
import { PaymentSandbox } from "../components/PaymentSandbox";
import { FinanceModule } from "../components/FinanceModule";
import { AuditLogsModule } from "../components/AuditLogsModule";
import { GuestModule } from "../components/GuestModule";
import { SettingsModule } from "@/components/SettingsModule";
import { PropertyModule } from "@/components/PropertyModule";
import { PlansModule } from "@/components/PlansModule";
import { AdvancedModule } from "@/components/AdvancedModule";
import { RestaurantModule } from "@/components/RestaurantModule";

function StatCard({ title, value, change, icon: Icon, trend }: { title: string, value: string, change: string, icon: React.ElementType, trend: "up" | "down" | "neutral" }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, translateY: -5 }}
      className="glass p-8 rounded-[2.5rem] flex flex-col space-y-4 group transition-all duration-500 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
        <Icon size={80} className="text-[#FF385C]" />
      </div>
      
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 transition-transform group-hover:bg-primary/10 group-hover:border-primary/20`}>
          <Icon size={24} className="text-white group-hover:text-primary transition-colors" />
        </div>
        <div className={clsx(
          "flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase",
          trend === "up" ? "bg-emerald-500/10 text-emerald-400" : 
          trend === "down" ? "bg-red-500/10 text-red-400" : "bg-white/5 text-zinc-400"
        )}>
          {trend === "up" && <TrendingUp size={12} className="mr-1.5" />}
          {change}
        </div>
      </div>
      
      <div className="pt-2 relative z-10">
        <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] font-institutional">{title}</h3>
        <p className="text-4xl font-black mt-2 tracking-tighter text-white drop-shadow-sm">{value}</p>
      </div>
    </motion.div>
  );
}

function DashboardHome({ setIsAddRoomModalOpen }: { setIsAddRoomModalOpen: (open: boolean) => void }) {
  const { rooms, reservations } = useAura();
  const { t } = useI18n();
  
  const occupiedCount = rooms.filter(r => r.status === "Ocupada").length;
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0;

  return (
    <div className="space-y-20 pb-20">
      {/* Welcome Header */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center space-x-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] font-institutional">{t("dash.op.center")}</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white mb-4 leading-[0.9]">
            Aura <span className="text-gradient-red">{t("dash.aura.inst")}</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium tracking-tight max-w-lg">
            {t("dash.hero.desc")}
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <StatCard title={t("dash.occupancy.title")} value={`${occupancyRate}%`} change="0%" trend="neutral" icon={Bed} />
        <StatCard title={t("dash.revpar.title")} value="$0" change="0%" trend="neutral" icon={CreditCard} />
        <StatCard title={t("dash.checkin.title")} value={`${reservations.length}`} change={t("dash.stable")} trend="neutral" icon={CheckCircle2} />
        <StatCard title={t("dash.tasks.title")} value="0" change="0" trend="neutral" icon={Clock} />
      </section>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 relative z-10">
        <div className="xl:col-span-2 space-y-10">
          <div className="flex justify-between items-end px-2">
            <div>
              <h3 className="text-3xl font-black tracking-tighter text-white">{t("dash.hub.title")}</h3>
              <p className="text-zinc-500 text-xs mt-1 font-institutional tracking-[0.2em] font-black">{t("dash.hub.subtitle")}</p>
            </div>
            <button className="text-[9px] font-black text-white flex items-center hover:opacity-80 transition-opacity uppercase tracking-[0.3em] font-institutional bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              {t("dash.hub.expand")} <ChevronRight size={14} className="ml-2 text-[#3B82F6]" />
            </button>
          </div>
          
          <div className="glass p-2 rounded-[2.5rem] border-white/5 bg-white/1">
            {rooms.length > 0 ? <RoomGrid /> : (
              <div className="p-32 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-white/10 group">
                  <Sparkles className="text-primary group-hover:scale-110 transition-transform" size={40} />
                </div>
                <h4 className="text-white font-black text-2xl mb-3 tracking-tighter font-institutional uppercase">{t("empty.title")}</h4>
                <p className="text-zinc-500 text-sm max-w-md mx-auto font-medium">{t("empty.desc")}</p>
                <button 
                  onClick={() => setIsAddRoomModalOpen(true)}
                  className="mt-12 bg-white text-black font-black text-[10px] px-10 py-5 rounded-4xl uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-2xl font-institutional"
                >
                  {t("empty.button")}
                </button>
              </div>
            )}
          </div>
        </div>

        {rooms.length > 0 && (
          <div className="space-y-12">
            <div className="px-2">
              <h3 className="text-3xl font-black tracking-tighter text-white">{t("dash.intel.title")}</h3>
              <p className="text-zinc-500 text-xs mt-1 font-institutional tracking-[0.2em] font-black">{t("dash.intel.subtitle")}</p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-12 rounded-[3.5rem] bg-linear-to-br from-white/2 to-transparent border-white/5 relative overflow-hidden group shadow-[0_32px_80px_-20px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#FF385C]/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-10 group-hover:border-[#3B82F6]/30 transition-all group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                  <TrendingUp size={32} className="text-[#3B82F6]" />
                </div>
                <h4 className="text-white font-black tracking-tighter text-4xl mb-6 leading-[0.9] font-institutional uppercase">{t("dash.intel.predictive")}<br/>{t("dash.intel.revenue")}</h4>
                <p className="text-sm text-zinc-500 leading-relaxed font-semibold">
                  {t("dash.intel.desc")}
                </p>
                <div className="mt-12 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "24%" }}
                    transition={{ duration: 3, ease: "circOut" }}
                    className="h-full bg-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.8)]" 
                  />
                </div>
                <p className="text-[9px] text-[#3B82F6] font-black uppercase tracking-[0.4em] mt-6 font-institutional">{t("dash.intel.convergence")}</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function AuraDashboardContent() {
  const { isSetupComplete, hotelConfig, clearRooms, role } = useAura();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showTour, setShowTour] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const { user } = useUser();
  const { t } = useI18n();

  const AUTHORIZED_EMAILS = [
    "itslacia@gmail.com",
    "22610282@utgz.edu.mx",
    "ninguang.01@gmail.com"
  ];

  const isCreator = user?.emailAddresses.some(e => AUTHORIZED_EMAILS.includes(e.emailAddress)) || false;

  useEffect(() => {
    if (!isSetupComplete) return;
    
    const tourShown = localStorage.getItem("aura_tour_shown");
    if (!tourShown) {
      // Small Delay to prevent cascading render error in some environments 
      // and ensure stable initialization
      const timer = setTimeout(() => setShowTour(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isSetupComplete]);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem("aura_tour_shown", "true");
  };

  if (!isSetupComplete) {
    return <SetupWizard />;
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FF385C] selection:text-white overflow-hidden relative" suppressHydrationWarning>
      <ParticleBackground />
      
      <AddRoomModal 
        isOpen={isAddRoomModalOpen} 
        onClose={() => setIsAddRoomModalOpen(false)} 
      />
      
      {/* Dynamic Aura Glows */}
      <div className="glow-corner -top-[10vw] -left-[10vw] opacity-60 pointer-events-none" />
      <div className="glow-corner -bottom-[20vw] -right-[10vw] opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)' }} />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={role} 
        isCreator={isCreator}
      />

      <main className="flex-1 overflow-hidden relative z-10 flex p-6 lg:p-10">
        <div className="flex-1 glass overflow-y-auto rounded-[3rem] border-white/5 bg-white/1 aura-blue-glow relative">
          <AnimatePresence>
            {showTour && <WelcomeTour onComplete={handleTourComplete} />}
          </AnimatePresence>

          <TrialBanner />

          {/* Header */}
          <header className="px-12 py-12 flex justify-between items-center sticky top-0 bg-[#050505]/60 backdrop-blur-3xl z-40">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-4 mb-1">
                <h2 className="text-4xl font-black tracking-tighter text-white font-institutional leading-none">
                  {activeTab === "Dashboard" && t("nav.dashboard")}
                  {activeTab === "Reservaciones" && t("nav.reservations")}
                  {activeTab === "Habitaciones" && t("nav.inventory")}
                  {activeTab === "Huéspedes" && t("nav.guests")}
                  {activeTab === "Finanzas" && t("nav.finances")}
                  {activeTab === "Logs" && t("nav.logs")}
                  {activeTab === "Sandbox" && t("nav.sandbox")}
                  {activeTab === "Restaurante & Bar" && t("rest.title")}
                  {activeTab === "Configuración" && t("nav.settings")}
                  {activeTab === "Planes" && t("nav.plans")}
                  {activeTab === "Avanzado" && t("nav.advanced")}
                </h2>
                <ChevronRight className="text-zinc-800" size={20} />
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] font-institutional">{t("header.institutional")}</span>
              </div>
              <p className="text-[9px] text-[#FF385C] font-black uppercase tracking-[0.4em] font-institutional mt-2">
                {t("header.systemId")}: {hotelConfig?.name?.toUpperCase() || "CORE-ALPHA-01"}
              </p>
            </motion.div>

            <div className="flex items-center space-x-12">
              <div className="flex items-center space-x-6">
                <NotificationCenter />
                <div className="w-px h-8 bg-white/10 mx-2" />
                <UserButton appearance={{ 
                  elements: { 
                    userButtonAvatarBox: "w-11 h-11 border border-white/10 rounded-[1rem] shadow-2xl",
                    userButtonTrigger: "hover:scale-105 transition-transform"
                  } 
                }} />
              </div>
            </div>
          </header>

          <div className="p-12 lg:p-16 max-w-[1700px] mx-auto min-h-[calc(100vh-160px)]">
            <AnimatePresence mode="wait">
              {activeTab === "Dashboard" && (
                <motion.div key="dash" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} suppressHydrationWarning>
                  <DashboardHome setIsAddRoomModalOpen={setIsAddRoomModalOpen} />
                </motion.div>
              )}
              {activeTab === "Reservaciones" && (
                <motion.div key="res" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                  <ReservationList />
                </motion.div>
              )}
              {activeTab === "Mis Propiedades" && (
                <motion.div key="prop" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <PropertyModule />
                </motion.div>
              )}
              {activeTab === "Habitaciones" && (
                <motion.div key="rooms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="space-y-16">
                    <div className="flex justify-between items-end px-2">
                      <div>
                        <h3 className="text-5xl font-black tracking-tighter text-white">{t("inventory.title")}</h3>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] font-institutional mt-3">{t("inventory.subtitle")}</p>
                      </div>
                      {role === "ADMIN" && (
                        <button 
                          onClick={() => confirm("Confirm inventory purging?") && clearRooms()}
                          className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 hover:text-[#FF385C] transition-colors font-institutional"
                        >
                          {t("inventory.reset")}
                        </button>
                      )}
                    </div>
                    <RoomGrid />
                  </div>
                </motion.div>
              )}
              {activeTab === "Sandbox" && isCreator && (
                <motion.div key="sandbox" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <PaymentSandbox />
                </motion.div>
              )}
              {activeTab === "Finanzas" && (
                <motion.div key="finance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <FinanceModule />
                </motion.div>
              )}
              {activeTab === "Restaurante & Bar" && (
                <motion.div key="rest" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <RestaurantModule />
                </motion.div>
              )}
              {activeTab === "Logs" && (
                <motion.div key="logs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <AuditLogsModule />
                </motion.div>
              )}
              {activeTab === "Huéspedes" && (
                <motion.div key="guests" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <GuestModule />
                </motion.div>
              )}
              {activeTab === "Configuración" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <SettingsModule />
                </motion.div>
              )}
              {activeTab === "Planes" && (
                <motion.div key="plans" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <PlansModule />
                </motion.div>
              )}
              {activeTab === "Avanzado" && (
                <motion.div key="advanced" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <AdvancedModule />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuraPMS() {
  return (
    <AuraProvider>
      <AuraDashboardContent />
    </AuraProvider>
  );
}
