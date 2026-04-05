"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  BarChart3
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { useI18n } from "@/context/I18nContext";

export function FinanceModule() {
  const { reservations } = useAura();
  const { t } = useI18n();

  const paidReservations = reservations.filter(r => r.paymentStatus === "PAGADO");
  const totalRevenue = paidReservations.reduce((acc, r) => acc + (r.amount || 0), 0);
  const pendingRevenue = reservations
    .filter(r => r.paymentStatus === "PENDIENTE")
    .reduce((acc, r) => acc + (r.amount || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 md:px-0">
      <div />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceCard 
          title={t("fin.total")} 
          value={`$${totalRevenue.toLocaleString()}`} 
          trend="+12.5%" 
          positive={true}
          icon={DollarSign}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <FinanceCard 
          title={t("fin.pending")} 
          value={`$${pendingRevenue.toLocaleString()}`} 
          trend="+5.2%" 
          positive={false}
          icon={TrendingUp}
          color="text-amber-500"
          bg="bg-amber-500/10"
        />
        <FinanceCard 
          title={t("fin.average")} 
          value={`$${(paidReservations.length > 0 ? totalRevenue / paidReservations.length : 0).toLocaleString()}`} 
          trend="+2.1%" 
          positive={true}
          icon={PieChart}
          color="text-primary"
          bg="bg-primary/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] font-institutional flex items-center gap-3 text-white">
            <BarChart3 size={18} className="text-primary" />
            {t("fin.transactions")}
          </h4>
          
          <div className="space-y-4">
            {paidReservations.length > 0 ? (
              paidReservations.slice(-5).reverse().map((res) => (
                <div key={res.id} className="flex items-center justify-between p-4 rounded-2xl bg-accent/50 hover:bg-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-emerald-500">
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{res.guestName}</p>
                      <p className="text-[10px] text-muted uppercase tracking-widest">{res.paymentProvider} • {res.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-500">+${res.amount?.toLocaleString()}</p>
                    <p className="text-[10px] text-muted uppercase tracking-widest">{new Date(res.checkIn).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-zinc-500 text-xs italic font-medium">{t("fin.noTrans")}</p>
            )}
          </div>
        </div>

        <div className="glass p-12 rounded-[40px] bg-primary/2 border-primary/10 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20">
            <TrendingUp size={36} className="text-primary shadow-[0_0_20px_rgba(255,56,92,0.3)]" />
          </div>
          <h4 className="text-2xl font-black font-institutional text-white mb-4 uppercase tracking-tighter">{t("fin.projections")}</h4>
          <p className="text-zinc-500 text-xs max-w-xs transition-all leading-relaxed font-medium">
            {t("fin.forecast")}
          </p>
          <button className="mt-10 px-10 py-4 bg-primary text-white font-black text-[10px] rounded-2xl hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-[0.2em] font-institutional shadow-2xl shadow-primary/20">
            {t("fin.download")}
          </button>
        </div>
      </div>
    </div>
  );
}

function FinanceCard({ title, value, trend, positive, icon: Icon, color, bg }: { title: string, value: string, trend: string, positive: boolean, icon: React.ElementType, color: string, bg: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-[32px] space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${bg}`}>
          <Icon className={color} size={24} />
        </div>
        <div className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full ${positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">{title}</p>
        <p className="text-3xl font-bold tracking-tight mt-1">{value}</p>
      </div>
    </motion.div>
  );
}

export default FinanceModule;
