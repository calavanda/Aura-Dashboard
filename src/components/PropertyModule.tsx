"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useI18n } from "@/context/I18nContext";
import { AddAssetWizard } from "./AddAssetWizard";
import {
  Trophy, 
  Flame, 
  Gem, 
  Wrench, 
  ShieldCheck, 
  CalendarCheck, 
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  FileDown,
  CalendarDays,
  Users
} from "lucide-react";

export function PropertyModule() {
  const { t } = useI18n();
  const [activeSubTab, setActiveSubTab] = useState("PORTFOLIO");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  const subTabs = [
    { id: "PORTFOLIO", label: t("prop.tab.portfolio") },
    { id: "CALENDAR", label: t("prop.tab.calendar") },
    { id: "BOOKINGS", label: t("prop.tab.bookings") },
    { id: "LISTINGS", label: t("prop.tab.listings") }
  ];

  return (
    <div className="space-y-12">
      {/* Property Header & SubNav */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2">
        <div>
          <h3 className="text-4xl font-black tracking-tighter text-white font-institutional">{t("prop.title")}</h3>
          <p className="text-zinc-500 text-[10px] uppercase font-institutional tracking-[0.3em] font-black mt-2">
            {t("prop.subtitle")}
          </p>
        </div>
        
        {/* Pill Selector (Red reference) */}
        <div className="flex bg-[#0A0A0A]/80 backdrop-blur-md p-1.5 rounded-full border border-white/5 shadow-2xl">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={clsx(
                "px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 font-institutional relative",
                activeSubTab === tab.id 
                  ? "text-white bg-[#FF385C] shadow-[0_0_20px_rgba(255,56,92,0.4)]" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === "PORTFOLIO" && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Top KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
               <KpiCard value="0" label={t("prop.stat.units")} desc={t("prop.stat.units.desc")} />
               <KpiCard value="$0" label={t("prop.stat.revenue")} desc={t("prop.stat.revenue.desc")} valueColor="text-[#10b981]" />
               <KpiCard value="0%" label={t("prop.stat.occ")} desc={t("prop.stat.occ.desc")} />
               <KpiCard value="$0" label={t("prop.stat.adr")} desc={t("prop.stat.adr.desc")} />
            </div>

            {/* Middle Section: Snapshots & Graph */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Performance Snapshots */}
              <div className="space-y-4 flex flex-col h-full">
                <h4 className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] font-institutional mb-6 px-2">
                  {t("prop.snap.title")}
                </h4>
                <div className="glass rounded-4xl p-6 space-y-4 border-white/5 bg-white/1 flex-1 flex flex-col justify-between" style={{ minHeight: '400px' }}>
                  <SnapshotRow icon={Trophy} title={t("prop.snap.best")} value="N/A" sub="$0" subDesc="REVENUE LEADER" valueColor="text-[#10b981]" />
                  <div className="w-full h-px bg-white/5" />
                  <SnapshotRow icon={Flame} title={t("prop.snap.most")} value="N/A" sub="0%" subDesc="PEAK OCCUPANCY" valueColor="text-[#3B82F6]" />
                  <div className="w-full h-px bg-white/5" />
                  <SnapshotRow icon={Gem} title={t("prop.snap.highest")} value="N/A" sub="$0" subDesc="MARKET PREMIUM" valueColor="text-[#FF385C]" />
                </div>
              </div>

              {/* Revenue Velocity Graph Area */}
              <div className="xl:col-span-2 space-y-4 flex flex-col">
                <h4 className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] font-institutional mb-6 px-2">
                  {t("prop.trends.title")}
                </h4>
                <div className="glass rounded-4xl p-8 border-white/5 bg-white/1 relative overflow-hidden flex-1" style={{ minHeight: '400px' }}>
                  {/* Graph Headers */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start mb-12 gap-6">
                     <div>
                       <h5 className="text-xl font-black tracking-tighter text-white font-institutional uppercase">{t("prop.trends.subtitle")}</h5>
                       <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] font-institutional mt-2 max-w-[200px] md:max-w-none">
                         {t("prop.trends.desc")}
                       </p>
                     </div>
                     <div className="flex flex-wrap items-center gap-6">
                       <Legend dotColor="bg-[#3B82F6]" label="MONTHLY REVENUE" />
                       <Legend dotColor="bg-[#FF385C]" label="AVERAGE DAILY RATE" />
                       <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center">
                          <TrendingUp size={12} className="text-emerald-400 mr-2" />
                          <span className="text-[9px] font-black tracking-widest text-emerald-400">+18.4% Growth vs Prev Year</span>
                       </div>
                     </div>
                  </div>

                  {/* Absolute Zero Base Graph Representation */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
                  <svg className="w-full h-[60%] md:h-48 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] mt-8" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,95 L100,95" fill="none" stroke="#3B82F6" strokeWidth="1" />
                    <path d="M0,97 L100,97" fill="none" stroke="#FF385C" strokeWidth="0.5" strokeDasharray="2,2" />
                  </svg>
                  
                  {/* Timeline X-Axis */}
                  <div className="hidden md:flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600 mt-4 px-2">
                    <span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span><span>JAN</span><span>FEB</span><span>MAR</span>
                  </div>

                  <p className="text-[8px] text-zinc-600 mt-8 max-w-lg leading-relaxed px-2">
                    ⓘ {t("prop.trends.disclaimer")}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
               <BottomKpiCard icon={CalendarCheck} label={t("prop.bottom.bookings")} value="0" trend="+14%" trendColor="text-emerald-400" />
               <BottomKpiCard icon={TrendingUp} label={t("prop.bottom.forecast")} value="$0" trend="+5%" trendColor="text-emerald-400" />
               <BottomKpiCard icon={ShieldCheck} label={t("prop.bottom.integrity")} value="99.8%" trend="Stable" trendColor="text-zinc-400" />
               <BottomKpiCard icon={Wrench} label={t("prop.bottom.maint")} value="0" trend="Alerts: 0" trendColor="text-[#3B82F6]" />
            </div>

          </motion.div>
        )}
        {activeSubTab === "CALENDAR" && (
          <motion.div key="calendar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <CalendarSubView t={t} />
          </motion.div>
        )}
        {activeSubTab === "BOOKINGS" && (
          <motion.div key="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <BookingsSubView t={t} />
          </motion.div>
        )}
        {activeSubTab === "LISTINGS" && (
          <motion.div key="listings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <ListingsSubView onOpenWizard={() => setIsWizardOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8-Step Property Creation Wizard */}
      <AddAssetWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </div>
  );
}

function KpiCard({ value, label, desc, valueColor = "text-white" }: { value: string, label: string, desc: string, valueColor?: string }) {
  return (
    <div className="glass p-8 rounded-4xl border-white/5 flex flex-col justify-between group">
      <div>
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] font-institutional mb-2">{label}</p>
        <p className={clsx("text-4xl font-black tracking-tighter", valueColor)}>{value}</p>
      </div>
      <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-6 group-hover:text-zinc-400 transition-colors">{desc}</p>
    </div>
  );
}

function SnapshotRow({ icon: Icon, title, value, sub, subDesc, valueColor }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
        </div>
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">{title}</p>
          <p className="text-sm font-black text-white">{value}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={clsx("text-xl font-black", valueColor)}>{sub}</p>
        <p className="text-[7px] font-black uppercase tracking-widest text-zinc-600 mt-1">{subDesc}</p>
      </div>
    </div>
  );
}

function Legend({ dotColor, label }: { dotColor: string, label: string }) {
  return (
    <div className="flex items-center space-x-2">
      <div className={clsx("w-2 h-2 rounded-full", dotColor)} />
      <span className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-500">{label}</span>
    </div>
  );
}

function BottomKpiCard({ icon: Icon, label, value, trend, trendColor }: any) {
  return (
    <div className="glass p-6 rounded-4xl border-white/5 relative group bg-[#080808]">
      <div className="flex justify-between items-start mb-6">
        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon size={14} className={clsx(trendColor)} />
        </div>
        <span className={clsx("text-[9px] font-black tracking-widest px-2 py-1 rounded-full bg-white/5 border border-white/10", trendColor)}>
          {trend}
        </span>
      </div>
      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] font-institutional mb-1">{label}</p>
      <p className="text-3xl font-black tracking-tighter text-white">{value}</p>
    </div>
  );
}

// -------------------------------------------------------------
// Calendar Sub-View
// -------------------------------------------------------------
function CalendarSubView({ t }: { t: any }) {
  const [viewMode, setViewMode] = useState<"MONTH" | "YEAR">("MONTH");
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  
  // Dummy generate 31 days
  const dummyDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          <h4 className="text-xl font-black text-white tracking-tighter">{t("prop.cal.outlook")} <span className="text-zinc-600 font-normal">/{viewMode === "MONTH" ? t("prop.cal.monthly") : t("prop.cal.annual")}</span></h4>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
              <ChevronLeft size={16} className="text-white" />
            </button>
            <span className="text-xs font-black text-white px-2">March 2026</span>
            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
              <ChevronRight size={16} className="text-white" />
            </button>
            <button className="ml-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-black tracking-widest uppercase text-white hover:bg-white/10 transition">
              {t("prop.cal.today")}
            </button>
          </div>
        </div>
        
        {/* Toggle Month/Year */}
        <div className="flex bg-[#0A0A0A]/80 backdrop-blur-md p-1 rounded-full border border-white/5 shadow-inner">
          <button 
            onClick={() => setViewMode("MONTH")}
            className={clsx("px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all", viewMode === "MONTH" ? "bg-[#FF385C] text-white shadow-lg" : "text-zinc-500 hover:text-white")}
          >
            <CalendarDays size={10} className="inline mr-1" /> {t("prop.cal.month")}
          </button>
          <button 
            onClick={() => setViewMode("YEAR")}
            className={clsx("px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all", viewMode === "YEAR" ? "bg-[#FF385C] text-white shadow-lg" : "text-zinc-500 hover:text-white")}
          >
            <CalendarCheck size={10} className="inline mr-1" /> {t("prop.cal.year")}
          </button>
        </div>
      </div>

      {viewMode === "MONTH" ? (
        <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/5 bg-white/2">
            {daysOfWeek.map(d => (
              <div key={d} className="py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 border-r border-white/5 last:border-r-0">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-[120px]">
            {/* Blank start offsets for Sunday start (e.g. 5 blanks) */}
            {Array.from({length: 0}).map((_, i) => <div key={`empty-${i}`} className="border-r border-b border-white/5 bg-[#0A0A0A]" />)}
            
            {dummyDays.map(day => (
              <div key={day} className={clsx("border-r border-b border-white/5 p-3 relative group transition-colors", day === 23 ? "bg-[#111]" : "hover:bg-white/2")}>
                <span className={clsx("text-xs font-black", day === 23 ? "text-white" : "text-zinc-600 group-hover:text-zinc-400")}>{day}</span>
                {day === 23 && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FF385C] flex items-center justify-center text-[8px] font-black text-white shadow-[0_0_10px_rgba(255,56,92,0.4)]">23</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* Annual Grid Placeholders */}
           {["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"].map((month, idx) => (
             <div key={month} className="glass p-6 rounded-4xl border-white/5">
                <h5 className={clsx("text-[10px] font-black uppercase tracking-widest mb-4", idx === 2 ? "text-[#FF385C]" : "text-white")}>{month} <span className="text-zinc-600">2026</span></h5>
                <div className="grid grid-cols-7 gap-y-2 text-center text-[7px] font-bold text-zinc-600">
                  {daysOfWeek.map(d => <span key={d} className="text-zinc-700">{d[0]}</span>)}
                  {Array.from({length: 31}, (_, i) => (
                    <span key={i} className={clsx("py-1", month === "MARCH" && i === 22 ? "bg-[#FF385C] text-white rounded-full" : "text-zinc-500")}>{i + 1}</span>
                  ))}
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Bookings Sub-View (Booking Desk)
// -------------------------------------------------------------
function BookingsSubView({ t }: { t: any }) {
  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-[2rem] border-white/5 bg-[#080808]">
             <div className="flex items-center space-x-2 mb-4">
                <CalendarCheck size={14} className="text-[#3B82F6]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{t("prop.book.active")}</span>
             </div>
             <p className="text-3xl font-black text-white tracking-tighter">0</p>
          </div>
          <div className="glass p-6 rounded-[2rem] border-white/5 bg-[#080808]">
             <div className="flex items-center space-x-2 mb-4">
                <Users size={14} className="text-[#10b981]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{t("prop.book.arriving")}</span>
             </div>
             <p className="text-3xl font-black text-white tracking-tighter">0</p>
          </div>
          <div className="glass p-6 rounded-[2rem] border-white/5 bg-[#080808]">
             <div className="flex items-center space-x-2 mb-4">
                <FileDown size={14} className="text-[#FF385C] rotate-90" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{t("prop.book.depart")}</span>
             </div>
             <p className="text-3xl font-black text-white tracking-tighter">0</p>
          </div>
        </div>
        
        {/* Date Strip */}
        <div className="w-full md:w-1/4 glass p-4 rounded-[2rem] border-white/5 bg-[#0A0A0A] flex flex-col justify-between">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 text-center mb-2">{t("prop.book.glance")}</p>
          <div className="flex justify-between items-center px-2">
            <ChevronLeft size={16} className="text-zinc-600" />
            <div className="text-center bg-white/5 py-2 px-3 rounded-xl border border-[#FF385C]/30 shadow-[0_0_15px_rgba(255,56,92,0.1)]">
              <p className="text-[8px] font-black text-[#FF385C] uppercase">MAY</p>
              <p className="text-lg font-black text-white">23</p>
            </div>
            <div className="text-center opacity-50"><p className="text-[8px] font-bold text-zinc-500">MAY</p><p className="text-xs font-black text-white">24</p></div>
            <div className="text-center opacity-30"><p className="text-[8px] font-bold text-zinc-500">MAY</p><p className="text-xs font-black text-white">25</p></div>
            <ChevronRight size={16} className="text-zinc-600" />
          </div>
        </div>
      </div>

      {/* Main Split Area */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Awaiting Payment Table */}
        <div className="w-full xl:w-3/4 glass rounded-[2rem] border-white/5 p-6 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 font-institutional">{t("prop.book.awaiting")}</h5>
              <span className="bg-[#FF385C]/10 text-[#FF385C] border border-[#FF385C]/20 px-2 py-0.5 rounded-full text-[8px] font-bold">0 Total</span>
            </div>
            <button className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center shadow-[0_0_15px_rgba(59,130,246,0.3)] transition">
               <Plus size={12} className="mr-2" /> {t("prop.book.new")}
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
             <div className="flex-1 min-w-[200px] relative">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                 <Filter size={12} className="text-zinc-500" />
               </div>
               <input type="text" placeholder={t("prop.book.search")} className="w-full bg-[#0A0A0A] border border-white/5 rounded-full py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-white/20 transition-all font-bold" />
             </div>
             <button className="bg-[#0A0A0A] border border-white/5 text-zinc-400 text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-white/5 transition flex items-center">
               {t("prop.book.allProp")} <ChevronRight size={12} className="ml-2 rotate-90" />
             </button>
             <button className="bg-[#0A0A0A] border border-white/5 text-zinc-400 text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-white/5 transition flex items-center">
               {t("prop.book.anyAmt")} <ChevronRight size={12} className="ml-2 rotate-90" />
             </button>
          </div>

          <div className="flex-1 border border-white/5 rounded-3xl bg-[#080808] flex items-center justify-center relative overflow-hidden">
             {/* Empty State */}
             <div className="text-center relative z-10">
               <Filter size={40} className="mx-auto text-zinc-800 mb-6" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 font-institutional">NO MATCHING BOOKINGS FOUND</p>
             </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">DISPLAYING 0 TO 0 OF 0 ENTRIES</span>
            <div className="flex space-x-2">
               <button className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center"><ChevronLeft size={10} className="text-zinc-500" /></button>
               <button className="w-6 h-6 rounded-md bg-[#FF385C] flex items-center justify-center text-[9px] font-black text-white shadow-lg">1</button>
               <button className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center"><ChevronRight size={10} className="text-zinc-500" /></button>
            </div>
          </div>
        </div>

        {/* Right Ledger Panel */}
        <div className="w-full xl:w-1/4 glass rounded-[2rem] border border-zinc-900 p-6 flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-center mb-6">
               <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t("prop.book.process")}</h5>
               <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[8px] font-bold">0 Pending</span>
             </div>
             
             <div className="flex-1 flex items-center justify-center min-h-[300px]">
               <div className="text-center">
                 <div className="w-12 h-12 rounded-full border border-white/5 mx-auto mb-4 flex items-center justify-center">
                   <ShieldCheck size={20} className="text-zinc-700" />
                 </div>
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">{t("prop.book.settled")}</p>
               </div>
             </div>
           </div>
           
           <div className="bg-[#FF385C]/5 border border-[#FF385C]/10 rounded-2xl p-4 mt-8 flex items-start space-x-3">
             <div className="w-2 h-2 rounded-full bg-[#FF385C] mt-1 shadow-[0_0_10px_rgba(255,56,92,0.8)]" />
             <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
               Ledger Mode: Filters are persistent. Multi-select enabled for bulk settlements.
             </p>
           </div>
        </div>
        
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Listings Sub-View
// -------------------------------------------------------------
function ListingsSubView({ onOpenWizard }: { onOpenWizard: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 glass p-6 rounded-[2rem] border-white/5 bg-[#080808] flex justify-between items-center">
           <div>
             <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">TOTAL REVENUE</span>
             <p className="text-4xl font-black text-[#10b981] tracking-tighter">$72,400</p>
           </div>
           <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[8px] font-bold">+12%</span>
        </div>
        <div className="w-full md:w-1/4 glass p-6 rounded-[2rem] border-white/5 bg-[#080808] flex justify-between items-center">
           <div>
             <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">OCCUPANCY</span>
             <p className="text-4xl font-black text-[#3B82F6] tracking-tighter">84%</p>
           </div>
           <span className="bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 px-2 py-0.5 rounded-full text-[8px] font-bold">+3%</span>
        </div>
        <div className="w-full md:w-1/4 glass p-6 rounded-[2rem] border-white/5 bg-[#080808] flex justify-between items-start">
           <div>
             <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">ACTIVE ASSETS</span>
             <p className="text-4xl font-black text-[#FF385C] tracking-tighter">0</p>
           </div>
           <span className="text-[8px] font-black tracking-widest px-2 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400">Stable</span>
        </div>
      </div>

      <div className="glass rounded-[2rem] border-white/5 p-6 min-h-[500px] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-1/3">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
               <Filter size={12} className="text-zinc-500" />
             </div>
             <input type="text" placeholder="Search assets by name or ID..." className="w-full bg-[#0A0A0A] border border-white/5 rounded-full py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-white/20 transition-all font-bold" />
          </div>
          <div className="flex space-x-4">
            <button className="bg-[#0A0A0A] border border-white/5 text-zinc-400 text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-white/5 transition flex items-center">
               <Filter size={12} className="mr-2" /> FILTER
            </button>
            <button 
              onClick={onOpenWizard}
              className="bg-[#FF385C] hover:bg-[#FF385C]/90 text-white text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-full flex items-center shadow-[0_0_15px_rgba(255,56,92,0.4)] transition"
            >
               <Plus size={12} className="mr-2" /> ADD ASSET
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] font-institutional text-center italic">
             No portfolio assets registered. Use 'Add Asset' to initialize management.
           </p>
        </div>
      </div>
    </div>
  );
}

