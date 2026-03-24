"use client";

import React, { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronRight, User } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export function ReservationList() {
  const { reservations } = useAura();
  const { t } = useI18n();
  const [filter, setFilter] = useState("");

  const filtered = reservations.filter(r => 
    r.guestName.toLowerCase().includes(filter.toLowerCase()) || 
    r.roomType.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-2">
        <div>
          <h3 className="text-4xl font-black tracking-tighter text-white">{t("res.title")}</h3>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] font-institutional mt-3">{t("res.subtitle")}</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text" 
              placeholder={t("res.search")} 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-accent border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button className="glass p-2 rounded-xl text-muted hover:text-primary transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden border-white/5 bg-white/1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/2 text-zinc-600 font-black uppercase text-[9px] tracking-[0.3em] font-institutional">
                <th className="px-10 py-8">{t("res.th.patron")}</th>
                <th className="px-10 py-8">{t("res.th.asset")}</th>
                <th className="px-10 py-8">{t("res.th.status")}</th>
                <th className="px-10 py-8">{t("res.th.payment")}</th>
                <th className="px-10 py-8 text-right">{t("res.th.volume")}</th>
                <th className="px-10 py-8 text-right">{t("res.th.scope")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {filtered.map((res, idx) => (
                  <motion.tr 
                    key={res.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-accent/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {res.guestName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{res.guestName}</div>
                          <div className="text-[10px] text-muted font-bold uppercase">ID: {res.id.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted font-medium">{res.roomNumber}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        res.status === 'CONFIRMADO' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : res.status === 'CANCELADO'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-bold ${res.paymentStatus === 'PAGADO' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {res.paymentStatus || 'PENDIENTE'}
                        </span>
                        {res.paymentProvider && res.paymentProvider !== 'NINGUNO' && (
                          <span className="text-[9px] text-muted uppercase font-bold tracking-tighter">
                            {t("res.via")} {res.paymentProvider}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-foreground">
                      {res.amount ? `$${res.amount.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-primary transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-20 text-center">
            <User size={48} className="mx-auto text-muted/20 mb-4" />
            <p className="text-muted font-medium">{t("res.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
