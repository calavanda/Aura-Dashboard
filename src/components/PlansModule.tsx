"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Ticket
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { useI18n } from "@/context/I18nContext";
import { generateConnectionCodeAction } from "@/app/actions/aura";

export function PlansModule() {
  const { hotelId, subscription, connectionCode, refreshData } = useAura();
  const { t } = useI18n();
  const [generatingCode, setGeneratingCode] = useState(false);

  const handleGenerateCode = async () => {
    if (!hotelId) return;
    setGeneratingCode(true);
    await generateConnectionCodeAction(hotelId);
    await refreshData();
    setGeneratingCode(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h3 className="text-3xl font-bold font-outfit text-foreground tracking-tight">{t("nav.plans")}</h3>
        <p className="text-muted text-sm mt-2">{t("set.planDesc")} <span className="text-primary font-bold">{subscription}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main subscription card */}
        <div className="glass p-10 rounded-[40px] bg-primary/5 border-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={120} className="text-primary" />
          </div>
          
          <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-background mb-8 shadow-2xl shadow-primary/40 relative z-10">
            <Zap size={32} />
          </div>
          
          <div className="relative z-10">
            <h4 className="text-4xl font-black font-institutional tracking-tight mb-4 uppercase">{t("set.plan")} {subscription}</h4>
            <p className="text-sm text-zinc-500 mb-10 leading-relaxed font-medium max-w-xs">
              {t("set.planDesc")} <span className="font-bold text-primary">{subscription}</span>. Accede a herramientas de nivel institucional.
            </p>
            
            {subscription === "BASIC" && (
              <button className="w-full py-5 bg-primary text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                <Sparkles size={18} />
                {t("set.upgrade")}
              </button>
            )}
            
            <div className="mt-8 p-6 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-xl">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3">{t("set.licStatus")}</p>
               <div className="flex items-center gap-3 text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  <span className="text-xs font-black uppercase tracking-widest">{t("set.active")}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Connection Code Section */}
        <div className="space-y-8">
          <div className="glass p-10 rounded-[40px] space-y-6 border-white/5 bg-white/1 relative overflow-hidden">
             <div className="flex items-center gap-4 text-primary mb-2">
               <div className="p-3 bg-primary/10 rounded-2xl">
                 <Ticket size={24} />
               </div>
               <h5 className="text-xs font-black uppercase tracking-[0.2em] font-institutional">Aura Connection Code</h5>
             </div>
             
             <p className="text-xs text-zinc-500 leading-relaxed font-medium">
               {t("set.connDesc")}
             </p>
             
             <div className="bg-black/60 p-8 rounded-3xl border border-dashed border-primary/30 text-center font-mono text-3xl font-black tracking-[0.3em] text-primary shadow-inner">
               {connectionCode || "--------"}
             </div>

             <button 
              onClick={handleGenerateCode}
              disabled={generatingCode || subscription === "BASIC"}
              className="w-full py-4 bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-white/10 uppercase tracking-[0.3em] rounded-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
             >
               {generatingCode ? t("set.generating") : connectionCode ? t("set.regen") : t("set.generate")}
             </button>
             
             {subscription === "BASIC" && (
               <div className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                 <ShieldCheck size={12} className="text-amber-500" />
                 <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest">
                   {t("set.reqEnterprise")}
                 </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
