"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Trash2, 
  Eraser, 
  AlertTriangle, 
  RefreshCcw,
  Lock,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { useI18n } from "@/context/I18nContext";

export function AdvancedModule() {
  const { hotelId, applyMasterKey, purgeData, refreshData } = useAura();
  const { t } = useI18n();
  const [hasAcceptedRisks, setHasAcceptedRisks] = useState(false);
  const [purging, setPurging] = useState<string | null>(null);
  const [masterKey, setMasterKey] = useState("");
  const [masterStatus, setMasterStatus] = useState<{ success?: boolean, error?: string }>({});

  const handleApplyMasterKey = async () => {
    const res = await applyMasterKey(masterKey);
    setMasterStatus(res);
    if (res.success) {
      setMasterKey("");
      setTimeout(() => setMasterStatus({}), 3000);
    }
  };

  const handlePurge = async (type: "RESERVATIONS" | "LOGS" | "ALL") => {
    const confirmMsg = type === "ALL" 
        ? t("set.purgeConfirmAll")
        : type === "RESERVATIONS" ? t("set.purgeConfirmRes") : t("set.purgeConfirmLogs");
    
    if (!window.confirm(confirmMsg)) return;
    
    setPurging(type);
    const res = await purgeData(type);
    if (res.success) {
        alert(t("set.purgeSuccess"));
        await refreshData();
    } else {
        alert(`Error: ${res.error}`);
    }
    setPurging(null);
  };

  if (!hasAcceptedRisks) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 lg:p-16 rounded-[4rem] max-w-2xl w-full border-rose-500/20 bg-rose-500/5 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-rose-500 to-transparent opacity-50" />
          
          <div className="w-24 h-24 bg-rose-500/10 rounded-[35%] flex items-center justify-center mx-auto mb-10 border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
            <ShieldAlert size={48} className="text-rose-500" />
          </div>

          <h3 className="text-4xl font-black font-institutional tracking-tighter text-white mb-6 uppercase">
            {t("adv.warning.title")}
          </h3>
          
          <p className="text-zinc-500 text-sm leading-relaxed font-medium mb-12 max-w-md mx-auto">
            {t("adv.warning.desc")}
          </p>

          <button 
            onClick={() => setHasAcceptedRisks(true)}
            className="w-full py-6 bg-rose-600 text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-3xl hover:bg-rose-500 active:scale-[0.98] transition-all shadow-2xl shadow-rose-900/40 flex items-center justify-center gap-3"
          >
            {t("adv.warning.proceed")}
            <ChevronRight size={16} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-20">
      <div>
        <h3 className="text-3xl font-bold font-outfit text-foreground tracking-tight">{t("nav.advanced")}</h3>
        <p className="text-muted text-sm mt-2">Herramientas críticas de administración y seguridad del sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Security & License */}
        <div className="glass p-10 rounded-[40px] space-y-8 border-white/5 bg-white/1 relative overflow-hidden group">
           <div className="flex items-center justify-between gap-3 text-amber-500 mb-2">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                 <Lock size={20} />
               </div>
               <h5 className="text-xs font-black uppercase tracking-[0.2em] font-institutional">{t("set.security")}</h5>
             </div>
             <span className="text-[9px] bg-amber-500/10 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">DWASP Protected</span>
           </div>
           
           <div className="space-y-6">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black font-institutional mb-4">{t("set.masterKey")}</p>
               <div className="relative group/input">
                  <input 
                      type="password" 
                      placeholder="•••• •••• •••• ••••"
                      value={masterKey}
                      onChange={(e) => setMasterKey(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-3xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-amber-500/30 font-mono transition-all pr-32 placeholder:text-zinc-800"
                  />
                  <button 
                      onClick={handleApplyMasterKey}
                      className="absolute right-2 top-2 bottom-2 bg-amber-500 text-black px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all shadow-xl shadow-amber-900/40"
                  >
                      {t("set.validate")}
                  </button>
              </div>
              <AnimatePresence>
                {masterStatus.error && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 font-black uppercase tracking-[0.2em] text-center mt-4">
                    {masterStatus.error}
                  </motion.p>
                )}
                {masterStatus.success && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] text-center mt-4 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} />
                    {t("set.unlocked")}
                  </motion.p>
                )}
              </AnimatePresence>
           </div>

           <div className="pt-8 border-t border-white/5 space-y-6">
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-black font-institutional">{t("set.metadata")}</p>
              <div className="flex items-center justify-between p-5 bg-black/40 rounded-3xl border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{t("set.hotelId")}</span>
                <span className="font-mono text-xs font-black text-zinc-400 select-all">{hotelId}</span>
              </div>
              <button className="w-full py-4 bg-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/5 font-institutional">
                 {t("set.resetApi")}
              </button>
           </div>
        </div>

        {/* Danger Zone */}
        <div className="glass p-10 rounded-[40px] border-rose-500/20 bg-rose-500/2 space-y-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <AlertTriangle size={120} className="text-rose-500" />
           </div>

           <div className="flex items-center gap-4 text-rose-500 mb-2 relative z-10">
             <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
               <AlertTriangle size={20} />
             </div>
             <h5 className="text-xs font-black uppercase tracking-[0.2em] font-institutional">{t("set.danger")}</h5>
           </div>
           
           <div className="space-y-6 relative z-10">
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                {t("set.dangerDesc")}
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                  <button 
                      onClick={() => handlePurge("RESERVATIONS")}
                      disabled={purging !== null}
                      className="w-full flex items-center justify-between p-6 rounded-3xl bg-black/40 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all group/btn"
                  >
                      <div className="flex items-center gap-4">
                          <Eraser size={20} className="text-zinc-700 group-hover/btn:text-rose-500 transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover/btn:text-white font-institutional transition-colors">{t("set.purgeRes")}</span>
                      </div>
                      {purging === "RESERVATIONS" ? <RefreshCcw className="animate-spin text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" size={16} /> : <ChevronRight size={14} className="text-zinc-800" />}
                  </button>

                  <button 
                      onClick={() => handlePurge("LOGS")}
                      disabled={purging !== null}
                      className="w-full flex items-center justify-between p-6 rounded-3xl bg-black/40 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all group/btn"
                  >
                      <div className="flex items-center gap-4">
                          <Trash2 size={20} className="text-zinc-700 group-hover/btn:text-rose-500 transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover/btn:text-white font-institutional transition-colors">{t("set.purgeLogs")}</span>
                      </div>
                      {purging === "LOGS" ? <RefreshCcw className="animate-spin text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" size={16} /> : <ChevronRight size={14} className="text-zinc-800" />}
                  </button>
                  
                  <div className="pt-6">
                    <button 
                        onClick={() => handlePurge("ALL")}
                        disabled={purging !== null}
                        className="w-full h-20 bg-rose-600 text-white font-black text-[10px] uppercase tracking-[0.4em] font-institutional rounded-3xl hover:bg-rose-700 active:scale-95 transition-all shadow-2xl shadow-rose-900/30 flex items-center justify-center gap-3"
                    >
                        {purging === "ALL" && <RefreshCcw className="animate-spin" size={20} />}
                        {purging === "ALL" ? t("set.purging") : t("set.purgeAll")}
                    </button>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
