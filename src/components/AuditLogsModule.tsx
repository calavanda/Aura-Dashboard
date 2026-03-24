"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  CreditCard,
  ClipboardList
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { useI18n } from "@/context/I18nContext";

export function AuditLogsModule() {
  const { logs } = useAura();
  const { t } = useI18n();

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h3 className="text-4xl font-black font-institutional text-white tracking-tighter uppercase">{t("audit.title")}</h3>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] font-institutional mt-3">{t("audit.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] font-institutional bg-primary/10 px-6 py-3 rounded-full border border-primary/20">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--primary)]"></span>
          {t("audit.live")}
        </div>
      </div>

      <div className="space-y-4">
        {logs && logs.length > 0 ? (
          logs.map((log: any, idx: number) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-5 rounded-3xl flex items-center gap-6 group hover:border-primary/30 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                log.action.toLowerCase().includes('error') || log.action.includes('FALLIDO') ? 'bg-red-500/10 text-red-500' : 
                log.action.includes('PAGADO') || log.action.includes('COMPLETO') ? 'bg-emerald-500/10 text-emerald-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                {log.action.toLowerCase().includes('pago') ? <CreditCard size={20} /> : <Activity size={20} />}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-white group-hover:text-primary transition-colors tracking-tight">{log.action}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 font-bold uppercase tracking-wider">{log.details || t("audit.noDetails")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest font-institutional">{log.userName}</p>
                    <p className="text-[10px] text-zinc-600 mt-1 font-medium">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="glass p-32 rounded-[40px] border-white/5 text-center space-y-6">
             <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto text-zinc-600 border border-white/10 mb-4">
               <Activity size={40} />
             </div>
             <h4 className="text-2xl font-black font-institutional text-white uppercase tracking-tighter">{t("audit.noActivity")}</h4>
             <p className="text-sm text-zinc-500 max-w-xs mx-auto font-medium">{t("audit.activityDesc")}</p>
          </div>
        )}
      </div>
        
      <div className="p-10 bg-white/2 text-center rounded-[32px] mt-12 border border-white/5">
        <button className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] font-institutional hover:text-primary transition-all flex items-center gap-3 mx-auto group">
          <Clock size={16} className="group-hover:rotate-12 transition-transform" />
          {t("audit.viewHistory")}
        </button>
      </div>
    </div>
  );
}

export default AuditLogsModule;
