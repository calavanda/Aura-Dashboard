"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  CreditCard,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { useI18n } from "@/context/I18nContext";

export function GuestModule() {
  const { reservations } = useAura();
  const { t } = useI18n();

  // Group reservations by guest name to simulate a "Guest" entity
  const guests = useMemo(() => {
    const guestMap = new Map();
    
    reservations.forEach(res => {
      if (!guestMap.has(res.guestName)) {
        guestMap.set(res.guestName, {
          name: res.guestName,
          stayCount: 0,
          totalSpent: 0,
          lastStay: res.checkIn,
          status: "Regular",
          reservations: []
        });
      }
      
      const guest = guestMap.get(res.guestName);
      guest.stayCount += 1;
      guest.totalSpent += res.amount || 0;
      guest.reservations.push(res);
      if (new Date(res.checkIn) > new Date(guest.lastStay)) {
        guest.lastStay = res.checkIn;
      }
      
      if (guest.stayCount > 3) guest.status = "VIP";
    });
    
    return Array.from(guestMap.values());
  }, [reservations]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h3 className="text-4xl font-black font-institutional text-white tracking-tighter uppercase">{t("guest.title")}</h3>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] font-institutional mt-3">{t("guest.subtitle")}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input 
              type="text" 
              placeholder={t("guest.search")} 
              className="w-full bg-accent/50 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <button className="p-2 bg-accent rounded-xl hover:bg-border transition-all">
            <Filter size={20} className="text-muted" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {guests.length > 0 ? (
          guests.map((guest, idx) => (
            <motion.div
              key={guest.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-6 rounded-[32px] flex flex-col md:flex-row items-center gap-6 group hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary relative">
                <Users size={32} />
                {guest.status === "VIP" && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white border-2 border-background">
                    <Star size={12} fill="currentColor" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-bold font-outfit">{guest.name}</h4>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                    <Calendar size={12} className="text-primary" />
                    {t("guest.lastVisit")}: {new Date(guest.lastStay).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                    <UserCheck size={12} className="text-primary" />
                    {t("guest.stays")}: {guest.stayCount}
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                    <CreditCard size={12} className="text-primary" />
                    {t("guest.spent")}: ${guest.totalSpent.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  guest.status === 'VIP' ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/20 text-primary'
                }`}>
                  {guest.status}
                </div>
                <ChevronRight size={20} className="text-muted group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="glass p-32 rounded-[40px] border-white/5 text-center space-y-4">
            <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto text-zinc-600 mb-8 border border-white/10">
              <Users size={40} />
            </div>
            <h4 className="text-2xl font-black font-institutional text-white uppercase tracking-tighter">{t("guest.empty")}</h4>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto font-medium">
              {t("guest.emptyDesc")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuestModule;
