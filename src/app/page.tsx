"use client";

import React, { useState, useEffect } from "react";
import { AuraProvider, useAura } from "@/context/AuraContext";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RoomGrid } from "@/components/RoomGrid";
import { ReservationList } from "@/components/ReservationList";
import { SetupWizard } from "@/components/Onboarding/SetupWizard";
import { WelcomeTour } from "@/components/Onboarding/WelcomeTour";
import { ParticleBackground } from "@/components/ParticleBackground";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SignIn, 
  UserButton,
  useUser 
} from "@clerk/nextjs";
import { clsx } from "clsx";
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
  ListTodo,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { NotificationCenter } from "@/components/NotificationCenter";
import { TrialBanner } from "@/components/TrialBanner";
import { PaymentSandbox } from "../components/PaymentSandbox";
import { FinanceModule } from "../components/FinanceModule";
import { AuditLogsModule } from "../components/AuditLogsModule";
import { GuestModule } from "../components/GuestModule";
import { SettingsModule } from "@/components/SettingsModule";
import { PremiumGuard } from "@/components/PremiumGuard";

function StatCard({ title, value, change, icon: Icon, trend }: { title: string, value: string, change: string, icon: any, trend: "up" | "down" | "neutral" }) {
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
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 transition-transform group-hover:bg-[#FF385C]/10 group-hover:border-[#FF385C]/20`}>
          <Icon size={24} className="text-white group-hover:text-[#FF385C] transition-colors" />
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

function DashboardHome() {
  const { rooms, reservations, hotelConfig } = useAura();
  
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
            <span className="w-2 h-2 rounded-full bg-[#FF385C] shadow-[0_0_10px_#FF385C]" />
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] font-institutional">Operations Center</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white mb-4 leading-[0.9]">
            Aura <span className="text-gradient-red">Institutional</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium tracking-tight max-w-lg">
            Standardizing hospitality excellence across your property portfolio. Complete control, total transparency.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <StatCard title="Portfolio Occupancy" value={`${occupancyRate}%`} change="+4.2%" trend="up" icon={Bed} />
        <StatCard title="Institutional RevPAR" value="$240" change="+12%" trend="up" icon={CreditCard} />
        <StatCard title="Check-in Velocity" value={`${reservations.length}`} change="Stable" trend="neutral" icon={CheckCircle2} />
        <StatCard title="Operational Tasks" value="12" change="+3" trend="down" icon={Clock} />
      </section>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 relative z-10">
        <div className="xl:col-span-2 space-y-10">
          <div className="flex justify-between items-end px-2">
            <div>
              <h3 className="text-3xl font-black tracking-tighter text-white">Property Hub</h3>
              <p className="text-zinc-500 text-xs mt-1 font-institutional tracking-[0.2em] font-black">Live Inventory</p>
            </div>
            <button className="text-[9px] font-black text-white flex items-center hover:opacity-80 transition-opacity uppercase tracking-[0.3em] font-institutional bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              Expand View <ChevronRight size={14} className="ml-2 text-[#3B82F6]" />
            </button>
          </div>
          
          <div className="glass p-2 rounded-[2.5rem] border-white/5 bg-white/1">
            {rooms.length > 0 ? <RoomGrid /> : (
              <div className="p-32 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-white/10">
                  <Sparkles className="text-[#FF385C]" size={40} />
                </div>
                <h4 className="text-white font-black text-2xl mb-3 tracking-tighter font-institutional uppercase">Awaiting Data</h4>
                <p className="text-zinc-500 text-sm max-w-md mx-auto font-medium">Initialize your property network through the enterprise integration wizard to populate this view.</p>
                <button className="mt-12 bg-white text-black font-black text-[10px] px-10 py-5 rounded-4xl uppercase tracking-[0.3em] hover:bg-[#FF385C] hover:text-white transition-all shadow-2xl font-institutional">
                  Begin Integration
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-12">
          <div className="px-2">
            <h3 className="text-3xl font-black tracking-tighter text-white">Intelligence</h3>
            <p className="text-zinc-500 text-xs mt-1 font-institutional tracking-[0.2em] font-black">AI Forensics</p>
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
              <h4 className="text-white font-black tracking-tighter text-4xl mb-6 leading-[0.9] font-institutional uppercase">Predictive<br/>Revenue</h4>
              <p className="text-sm text-zinc-500 leading-relaxed font-semibold">
                Gathering institutional data points. Advanced forecasting requires a minimum of 7 days of operational logs.
              </p>
              <div className="mt-12 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "24%" }}
                  transition={{ duration: 3, ease: "circOut" }}
                  className="h-full bg-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.8)]" 
                />
              </div>
              <p className="text-[9px] text-[#3B82F6] font-black uppercase tracking-[0.4em] mt-6 font-institutional">Convergence: 24%</p>
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
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FF385C] selection:text-white overflow-hidden relative">
      <ParticleBackground />
      
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
                <h2 className="text-4xl font-black tracking-tighter text-white font-institutional leading-none">{activeTab}</h2>
                <ChevronRight className="text-zinc-800" size={20} />
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] font-institutional">Institutional</span>
              </div>
              <p className="text-[9px] text-[#FF385C] font-black uppercase tracking-[0.4em] font-institutional mt-2">
                System ID: {hotelConfig?.name?.toUpperCase() || "CORE-ALPHA-01"}
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
                <motion.div key="dash" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <DashboardHome />
                </motion.div>
              )}
              {activeTab === "Reservaciones" && (
                <motion.div key="res" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                  <ReservationList />
                </motion.div>
              )}
              {activeTab === "Habitaciones" && (
                <motion.div key="rooms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="space-y-16">
                    <div className="flex justify-between items-end px-2">
                      <div>
                        <h3 className="text-5xl font-black tracking-tighter text-white">Unit Network</h3>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] font-institutional mt-3">Active Inventory Management</p>
                      </div>
                      {role === "ADMIN" && (
                        <button 
                          onClick={() => confirm("Confirm inventory purging?") && clearRooms()}
                          className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 hover:text-[#FF385C] transition-colors font-institutional"
                        >
                          Institutional Reset
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
                <motion.div key="guests" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <GuestModule />
                </motion.div>
              )}
              {activeTab === "Configuración" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <SettingsModule />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#050505] text-white font-sans selection:bg-[#FF385C] selection:text-white relative overflow-hidden">
      
      {/* Left Column - Auth Form */}
      <div className="flex flex-col justify-center px-8 lg:px-32 relative z-10 w-full max-w-2xl mx-auto h-full min-h-screen py-10 lg:py-0">
        
        {/* Logo & Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 w-full"
        >
          <div className="w-12 h-12 bg-[#FF385C] rounded-2xl flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(255,56,92,0.2)]">
            <span className="text-white font-black text-2xl font-institutional mt-1">A</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2 font-institutional leading-none">
            WELCOME <span className="text-[#FF385C]">BACK</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] font-institutional">
            ACCESS YOUR PROPERTY COMMAND CENTER
          </p>
        </motion.div>

        {/* Clerk Sign In */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full"
        >
          <SignIn 
            routing="hash" 
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
              },
              elements: {
                card: "bg-transparent shadow-none border-none p-0 w-full max-w-full",
                header: "hidden", // Hide completely to use our custom header
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                footer: "hidden", // Hide to keep it clean
                formFieldLabel__emailAddress: "text-[#FF385C] font-black uppercase tracking-[0.2em] text-[9px] font-institutional mb-2 block",
                formFieldLabel__password: "text-[#FF385C] font-black uppercase tracking-[0.2em] text-[9px] font-institutional mb-2 block",
                formFieldInput: "bg-[#0A0A0A] border border-zinc-900 rounded-2xl text-white px-4 py-4 focus:border-[#FF385C] focus:ring-0 transition-all font-mono text-sm w-full",
                formButtonPrimary: "bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-[0.3em] font-institutional text-[10px] py-5 rounded-2xl mt-4 w-full transition-all border border-zinc-700 hover:border-zinc-500",
                identityPreviewText: "text-zinc-400 font-mono text-sm",
                identityPreviewEditButton: "text-[#FF385C] hover:text-[#FF385C]/80",
                dividerRow: "my-8",
                dividerLine: "bg-zinc-900",
                dividerText: "text-zinc-600 font-institutional text-[8px] font-black uppercase tracking-[0.3em]",
                socialButtonsBlockButton: "bg-[#0A0A0A] border border-zinc-900 text-white hover:bg-zinc-900 transition-all py-4 rounded-xl",
                socialButtonsBlockButtonText: "font-institutional text-[10px] font-black uppercase tracking-[0.2em]",
                formFieldRow: "mb-6",
                formFieldAction: "text-[#FF385C] hover:opacity-80 transition-opacity font-black uppercase tracking-[0.1em] text-[9px] font-institutional",
              }
            }}
          />
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="mt-12 text-center"
        >
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] font-institutional">
            NEW TO AURA? <a href="#" className="text-[#FF385C] hover:underline">CREATE ACCOUNT</a>
          </p>
        </motion.div>
      </div>

      {/* Right Column - Dashboard Mockup Abstraction */}
      <div className="hidden lg:flex items-center justify-center p-12 relative h-full">
        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 bg-[#0A0A0A] border-l border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF385C]/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Mockup Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full max-w-2xl aspect-[16/10] bg-[#0A0A0A] rounded-[2rem] border border-zinc-900 shadow-2xl p-6 flex flex-col z-10 opacity-60"
        >
          {/* Mockup Header */}
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
             <div className="flex items-center space-x-4">
                <div className="w-6 h-6 rounded-lg bg-[#FF385C] opacity-80" />
                <div className="w-32 h-2 rounded-full bg-zinc-800" />
             </div>
             <div className="w-8 h-8 rounded-full bg-zinc-900" />
          </div>

          {/* Mockup Grid */}
          <div className="flex gap-6 mb-6">
             {/* Left Nav Mock */}
             <div className="w-48 flex flex-col gap-4">
                <div className="w-full h-12 bg-zinc-900/50 rounded-xl border border-zinc-900" />
                <div className="w-full h-12 bg-zinc-900/30 rounded-xl border border-zinc-900/50" />
             </div>

             {/* Right Cards Mock */}
             <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="h-24 bg-zinc-900/40 rounded-2xl border border-zinc-900/50 p-4 relative">
                  <div className="w-16 h-2 rounded-full bg-zinc-800 absolute right-4 top-4" />
                </div>
                <div className="h-24 bg-zinc-900/40 rounded-2xl border border-zinc-900/50 p-4 relative">
                  <div className="w-16 h-2 rounded-full bg-zinc-800 absolute right-4 top-4" />
                </div>
                <div className="h-24 bg-zinc-900/40 rounded-2xl border border-zinc-900/50 p-4 relative">
                  <div className="w-16 h-2 rounded-full bg-zinc-800 absolute right-4 top-4" />
                </div>
             </div>
          </div>

          {/* Lower Section Mock */}
          <div className="flex-1 border border-zinc-900/60 rounded-3xl bg-zinc-900/20 relative p-8">
             <div className="w-32 h-3 rounded-full bg-zinc-800 mb-8" />
             <div className="flex justify-center gap-4 absolute bottom-8 left-1/2 -translate-x-1/2">
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} className="w-12 h-2 rounded-full bg-zinc-900" />
                ))}
             </div>
          </div>
        </motion.div>

        {/* Version marker */}
        <div className="absolute bottom-8 right-12 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 font-institutional">
           Authorized Personnel Only • v5.7
        </div>
      </div>
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
