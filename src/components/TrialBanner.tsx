"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldAlert } from "lucide-react";
import { useAura } from "@/context/AuraContext";

export function TrialBanner() {
  const { subscription, trialDaysLeft, isOwner } = useAura();

  if (isOwner || subscription !== "BASIC") return null;

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      className="bg-primary/5 border-b border-primary/20"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <ShieldAlert size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Modo de Prueba Activado</p>
            <p className="text-xs text-muted">Te quedan <span className="text-foreground font-bold">{trialDaysLeft} días</span> para explorar todas las funciones premium de Aura.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
            <span className="text-[10px] text-muted font-bold uppercase tracking-tighter">Límite: 5 Habitaciones</span>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-background px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/10 group">
            <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
            Ver Planes de Suscripción
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
