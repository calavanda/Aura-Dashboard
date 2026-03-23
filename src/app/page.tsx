"use client";

import React, { useState, useEffect } from "react";
import { AuraProvider, useAura } from "@/context/AuraContext";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RoomGrid } from "@/components/RoomGrid";
import { ReservationList } from "@/components/ReservationList";
import { SetupWizard } from "@/components/Onboarding/SetupWizard";
import { WelcomeTour } from "@/components/Onboarding/WelcomeTour";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SignIn, 
  UserButton,
  useUser 
} from "@clerk/nextjs";
import { 
  Bell, 
  Search, 
  TrendingUp, 
  Bed, 
  Users,
  CreditCard, 
  CheckCircle2, 
  Clock,
  Sparkles,
  TestTube2,
  ListTodo
} from "lucide-react";
import { PaymentSandbox } from "../components/PaymentSandbox";
import { FinanceModule } from "../components/FinanceModule";
import { AuditLogsModule } from "../components/AuditLogsModule";
// Componentes de la Fase 2 actualizados


function StatCard({ title, value, change, icon: Icon, color }: { title: string, value: string, change: string, icon: any, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass p-6 rounded-3xl flex flex-col space-y-2 group transition-all"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-20 transition-transform group-hover:scale-110`}>
          <Icon size={20} className={color.replace('bg-', 'text-')} />
        </div>
        <span className="text-primary text-[10px] font-bold flex items-center bg-primary/10 px-2 py-0.5 rounded-full">
          <TrendingUp size={10} className="mr-1" /> {change}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-muted text-[10px] font-bold uppercase tracking-widest">{title}</h3>
        <p className="text-3xl font-bold mt-1 tracking-tight text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

function DashboardHome() {
  const { rooms, reservations, hotelConfig } = useAura();
  
  const occupiedCount = rooms.filter(r => r.status === "Ocupada").length;
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0;

  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ocupación" value={`${occupancyRate}%`} change="+0%" icon={Bed} color="bg-primary" />
        <StatCard title="Ingresos Hoy" value="$0" change="+0%" icon={CreditCard} color="bg-blue-500" />
        <StatCard title="Check-ins" value={`${reservations.length}`} change="+0" icon={CheckCircle2} color="bg-emerald-500" />
        <StatCard title="Pendientes" value="00" change="-0" icon={Clock} color="bg-amber-500" />
      </section>

      {/* Quick Access/Main Table Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold font-outfit text-foreground">Estado de Habitaciones</h3>
            <span className="text-xs text-muted font-bold uppercase tracking-widest">{rooms.length} TOTALES</span>
          </div>
          {rooms.length > 0 ? <RoomGrid /> : (
            <div className="glass p-20 rounded-[40px] text-center">
              <Sparkles className="mx-auto text-primary/20 mb-4" size={48} />
              <p className="text-muted font-medium">Configura tus habitaciones en el wizard para comenzar.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold font-outfit text-foreground px-2">Aura Intelligence</h3>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[40px] bg-linear-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <h4 className="text-foreground font-bold font-outfit text-2xl mb-3">Análisis en Espera</h4>
              <p className="text-sm text-muted leading-relaxed">
                Aura comenzará a procesar tendencias una vez que ingreses tus primeras reservaciones.
              </p>
              <button className="w-full mt-8 bg-primary text-background font-bold text-xs py-4 rounded-2xl hover:brightness-110 transition-all uppercase tracking-widest shadow-xl shadow-primary/20">
                Ver Proyecciones
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AuraDashboardContent() {
  const { isSetupComplete, hotelConfig, clearRooms, role } = useAura();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showTour, setShowTour] = useState(false);
  const { user } = useUser();

  const AUTHORIZED_EMAILS = [
    "itslacia@gmail.com",
    "22610282@utgz.edu.mx",
    "ninguang.01@gmail.com"
  ];

  const isCreator = user?.emailAddresses.some(e => AUTHORIZED_EMAILS.includes(e.emailAddress)) || false;

  useEffect(() => {
    // If setup is complete and we haven't shown the tour yet
    if (isSetupComplete) {
      const tourShown = localStorage.getItem("aura_tour_shown");
      if (!tourShown) {
        setShowTour(true);
      }
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
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-500">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={role} 
        isCreator={isCreator}
      />

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {showTour && <WelcomeTour onComplete={handleTourComplete} />}
        </AnimatePresence>

        {/* Dashboard Header */}
        <header className="px-8 lg:px-12 py-8 flex justify-between items-center border-b border-border sticky top-0 bg-background/80 backdrop-blur-xl z-10 transition-colors">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold font-outfit text-foreground">{activeTab}</h2>
            <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] mt-1">
              {hotelConfig?.name || "Propiedad Aura"} • {user?.username || user?.firstName || "Administrador"}
            </p>
          </motion.div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center border-r border-border pr-6 space-x-3">
              <ThemeToggle />
              <button className="p-2 text-muted hover:text-primary transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border-2 border-background"></span>
              </button>
            </div>
            <UserButton />
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "Dashboard" && (
              <motion.div
                key="dash"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <DashboardHome />
              </motion.div>
            )}
            {activeTab === "Reservaciones" && (
              <motion.div key="res" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ReservationList />
              </motion.div>
            )}
            {activeTab === "Habitaciones" && (
              <motion.div key="rooms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold font-outfit text-foreground">Mapa de Habitaciones</h3>
                    {role === "ADMIN" && (
                      <button 
                        onClick={() => {
                          if(confirm("¿Estás seguro de que deseas eliminar TODAS las habitaciones? Esta acción no se puede deshacer.")) {
                            clearRooms();
                          }
                        }}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                      >
                        Limpiar Todo
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
            {activeTab === "Logs" && (
              <motion.div key="logs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <AuditLogsModule />
              </motion.div>
            )}
            {activeTab === "Huéspedes" && (
              <motion.div key="placeholder" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center mb-6">
                  {role === "RESERVADOR" ? <Search className="text-red-500" size={32} /> : <Users className="text-muted" size={32} />}
                </div>
                <h3 className="text-xl font-bold font-outfit text-foreground">
                  {role === "RESERVADOR" ? "Acceso Restringido" : "Módulo en Desarrollo"}
                </h3>
                <p className="text-sm text-muted max-w-xs mt-2">
                  {role === "RESERVADOR" 
                    ? "Tu nivel de acceso no permite visualizar este apartado. Contacta al administrador." 
                    : "Estamos integrando la potencia completa de Aura para este apartado."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function AuthGate() {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) return null;

  if (user) {
    return <AuraDashboardContent />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-[40px] shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <Sparkles className="text-background" size={32} />
          </div>
          <h1 className="text-3xl font-bold font-outfit text-foreground">Bienvenido a Aura</h1>
          <p className="text-sm text-muted mt-2">Inicia sesión para gestionar tu hospitalidad.</p>
        </div>
        <SignIn routing="hash" />
      </motion.div>
    </div>
  );
}

export default function AuraPMS() {
  return (
    <AuraProvider>
      <AuthGate />
    </AuraProvider>
  );
}
