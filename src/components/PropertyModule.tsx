"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useI18n } from "@/context/I18nContext";
import { useAura } from "@/context/AuraContext";
import { AddAssetWizard } from "./AddAssetWizard";
import { getAdvancedKPIs } from "@/app/actions/analytics";
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
  Plus,
  CalendarDays
} from "lucide-react";

import { AdvancedStats, Reservation } from "@/types";

export function PropertyModule() {
  const { t } = useI18n();
  const { reservations, hotelId, rooms } = useAura();
  const [activeSubTab, setActiveSubTab] = useState("PORTFOLIO");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [stats, setStats] = useState<AdvancedStats | null>(null);

  useEffect(() => {
    if (activeSubTab === "PORTFOLIO" && hotelId) {
      getAdvancedKPIs(hotelId).then(res => {
        if (res.success) setStats(res.stats as AdvancedStats);
      });
    }
  }, [hotelId, activeSubTab]);
  
  const subTabs = [
    { id: "PORTFOLIO", label: t("prop.tab.portfolio") },
    { id: "CALENDAR", label: t("prop.tab.calendar") },
    { id: "BOOKINGS", label: t("prop.tab.bookings") },
    { id: "LISTINGS", label: t("prop.tab.listings") }
  ];

  return (
    <div className="space-y-12">
      {/* Property SubNav */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2">
        <div />
        
        {/* Pill Selector */}
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
               <KpiCard value={rooms.length.toString()} label={t("prop.stat.units")} desc={t("prop.stat.units.desc")} />
               <KpiCard value={stats?.totalRevenue || "$0"} label={t("prop.stat.revenue")} desc={t("prop.stat.revenue.desc")} valueColor="text-[#10b981]" />
               <KpiCard value={stats?.occupancyRate || "0%"} label={t("prop.stat.occ")} desc={t("prop.stat.occ.desc")} />
               <KpiCard value={stats?.adr || "$0"} label={t("prop.stat.adr")} desc={t("prop.stat.adr.desc")} />
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="space-y-4 flex flex-col h-full">
                <h4 className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] font-institutional mb-6 px-2">
                  {t("prop.snap.title")}
                </h4>
                <div className="glass rounded-4xl p-6 space-y-4 border-white/5 bg-white/1 flex-1 flex flex-col justify-between" style={{ minHeight: '400px' }}>
                  <SnapshotRow icon={Trophy} title={t("prop.snap.best")} value="N/A" sub="$0" subDesc={t("prop.snap.best.sub")} valueColor="text-[#10b981]" />
                  <div className="w-full h-px bg-white/5" />
                  <SnapshotRow icon={Flame} title={t("prop.snap.most")} value="N/A" sub="0%" subDesc={t("prop.snap.most.sub")} valueColor="text-[#3B82F6]" />
                  <div className="w-full h-px bg-white/5" />
                  <SnapshotRow icon={Gem} title={t("prop.snap.highest")} value="N/A" sub="$0" subDesc={t("prop.snap.highest.sub")} valueColor="text-[#FF385C]" />
                </div>
              </div>

              <div className="xl:col-span-2 space-y-4 flex flex-col">
                <h4 className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] font-institutional mb-6 px-2">
                  {t("prop.trends.title")}
                </h4>
                <div className="glass rounded-4xl p-8 border-white/5 bg-white/1 relative overflow-hidden flex-1" style={{ minHeight: '400px' }}>
                  <div className="flex flex-col md:flex-row md:justify-between items-start mb-12 gap-6">
                     <div>
                       <h5 className="text-xl font-black tracking-tighter text-white font-institutional uppercase">{t("prop.trends.subtitle")}</h5>
                       <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] font-institutional mt-2 max-w-[200px] md:max-w-none">
                         {t("prop.trends.desc")}
                       </p>
                     </div>
                     <div className="flex flex-wrap items-center gap-6">
                       <Legend dotColor="bg-[#3B82F6]" label={t("prop.trends.leg.rev")} />
                       <Legend dotColor="bg-[#FF385C]" label={t("prop.trends.leg.adr")} />
                     </div>
                  </div>
                  <div className="absolute top-1/2 left-0 w-full h-px bg-white/10" />
                  <svg className="w-full h-48 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] mt-8" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M0,95 L100,95" fill="none" stroke="#3B82F6" strokeWidth="1" /><path d="M0,97 L100,97" fill="none" stroke="#FF385C" strokeWidth="0.5" strokeDasharray="2,2" /></svg>
                  <p className="text-[8px] text-zinc-600 mt-8 max-w-lg leading-relaxed px-2">
                    ⓘ {t("prop.trends.disclaimer")}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
               <BottomKpiCard icon={CalendarCheck} label={t("prop.bottom.bookings")} value={reservations.length.toString()} trend={stats?.growth || "+0%"} trendColor="text-emerald-400" />
               <BottomKpiCard icon={TrendingUp} label={t("prop.bottom.forecast")} value={stats?.totalRevenue || "$0"} trend="+5%" trendColor="text-emerald-400" />
               <BottomKpiCard icon={ShieldCheck} label={t("prop.bottom.integrity")} value="99.8%" trend={t("prop.bottom.stable")} trendColor="text-zinc-400" />
               <BottomKpiCard icon={Wrench} label={t("prop.bottom.maint")} value="0" trend={t("prop.bottom.alerts")} trendColor="text-[#3B82F6]" />
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
            <ListingsSubView onOpenWizard={() => setIsWizardOpen(true)} t={t} />
          </motion.div>
        )}
      </AnimatePresence>

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

function SnapshotRow({ icon: Icon, title, value, sub, subDesc, valueColor }: { 
  icon: any, 
  title: string, 
  value: string, 
  sub: string, 
  subDesc: string, 
  valueColor: string 
}) {
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

function BottomKpiCard({ icon: Icon, label, value, trend, trendColor }: {
  icon: any,
  label: string,
  value: string,
  trend: string,
  trendColor: string
}) {
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

function CalendarSubView({ t }: { t: any }) {
  const { reservations } = useAura();
  const [viewMode, setViewMode] = useState<"MONTH" | "YEAR">("MONTH");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const currentMonthIdx = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysOfWeek = t("prop.cal.days")?.split(",") || [];
  const monthNames = t("prop.cal.months")?.split(",") || [];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonthIdx);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonthIdx);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonthIdx - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonthIdx + 1, 1));
  
  const dayReservations = (reservations as Reservation[]).filter((res: Reservation) => {
     const resDate = new Date(res.checkIn);
     return resDate.getDate() === selectedDay && 
            resDate.getMonth() === currentMonthIdx && 
            resDate.getFullYear() === currentYear;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          <h4 className="text-xl font-black text-white tracking-tighter">
            {t("prop.cal.outlook")} <span className="text-zinc-600 font-normal">/{viewMode === "MONTH" ? t("prop.cal.monthly") : t("prop.cal.annual")}</span>
          </h4>
          <div className="flex items-center space-x-2">
            <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
              <ChevronLeft size={16} className="text-white" />
            </button>
            <span className="text-xs font-black text-white px-2 min-w-[120px] text-center">{monthNames[currentMonthIdx]} {currentYear}</span>
            <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
              <ChevronRight size={16} className="text-white" />
            </button>
          </div>
        </div>
        
        <div className="flex bg-[#0A0A0A]/80 backdrop-blur-md p-1 rounded-full border border-white/5 shadow-inner">
          <button onClick={() => setViewMode("MONTH")} className={clsx("px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all", viewMode === "MONTH" ? "bg-[#FF385C] text-white shadow-lg" : "text-zinc-500 hover:text-white")}>
            <CalendarDays size={10} className="inline mr-1" /> {t("prop.cal.month")}
          </button>
          <button onClick={() => setViewMode("YEAR")} className={clsx("px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all", viewMode === "YEAR" ? "bg-[#FF385C] text-white shadow-lg" : "text-zinc-500 hover:text-white")}>
            <CalendarCheck size={10} className="inline mr-1" /> {t("prop.cal.year")}
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 glass rounded-4xl border-white/5 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/5 bg-white/2">
            {daysOfWeek.map((d: string) => (
              <div key={d} className="py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 border-r border-white/5 last:border-r-0">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-[100px]">
            {blanks.map(i => <div key={`blank-${i}`} className="border-r border-b border-white/5 bg-[#080808]/50" />)}
            {calendarDays.map(day => {
              const hasRes = (reservations as Reservation[]).some((res: Reservation) => {
                const d = new Date(res.checkIn);
                return d.getDate() === day && d.getMonth() === currentMonthIdx && d.getFullYear() === currentYear;
              });
              const isSelected = selectedDay === day;
              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDay(day)}
                  className={clsx(
                    "border-r border-b border-white/5 p-3 relative group transition-all cursor-pointer",
                    isSelected ? "bg-white/5" : "hover:bg-white/2"
                  )}
                >
                  <span className={clsx("text-xs font-black", isSelected ? "text-white" : "text-zinc-600 group-hover:text-zinc-400")}>{day}</span>
                  {hasRes && (
                    <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#FF385C]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full xl:w-[350px] glass rounded-4xl border-white/5 p-8 flex flex-col bg-[#080808]">
          <div className="mb-8">
            <p className="text-[10px] font-black text-[#FF385C] uppercase tracking-[0.3em] font-institutional mb-2">Detalles del día</p>
            <h5 className="text-2xl font-black text-white tracking-tighter">{selectedDay} {monthNames[currentMonthIdx]}</h5>
          </div>
          <div className="flex-1 space-y-4">
            {dayReservations.length > 0 ? (
              dayReservations.map((res: Reservation) => (
                <div key={res.id} className="p-4 rounded-2xl bg-white/2 border border-white/5">
                  <p className="text-[9px] font-black text-white uppercase tracking-wider">{res.guestName}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">{t("room.unit")}: {res.roomNumber}</p>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-zinc-600 uppercase text-center mt-12">No hay reservas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingsSubView({ t }: { t: any }) {
  const { reservations } = useAura();
  return (
    <div className="space-y-6">
      <div className="glass p-8 rounded-4xl border-white/5 bg-[#080808]">
        <h4 className="text-xl font-black text-white tracking-tighter mb-8 uppercase">{t("prop.book.active")}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((res: Reservation) => (
            <div key={res.id} className="glass p-5 rounded-3xl border-white/5 bg-white/1">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-black text-white">{res.guestName}</p>
                <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-[#FF385C]/10 text-[#FF385C] uppercase">{res.status}</span>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">{res.roomNumber} • ${res.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListingsSubView({ onOpenWizard, t }: { onOpenWizard: () => void, t: any }) {
  return (
    <div className="glass p-12 rounded-4xl border-white/5 bg-white/1 text-center">
      <h4 className="text-2xl font-black text-white tracking-tighter mb-6 uppercase">{t("prop.list.empty")}</h4>
      <button 
        onClick={onOpenWizard}
        className="bg-[#FF385C] text-white text-[10px] font-black uppercase tracking-widest px-10 py-5 rounded-full shadow-2xl"
      >
        <Plus size={16} className="inline mr-2" /> {t("prop.list.add")}
      </button>
    </div>
  );
}
