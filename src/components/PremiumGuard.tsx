"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { useAura } from "@/context/AuraContext";

interface PremiumGuardProps {
  children: React.ReactNode;
  level: "PRO" | "ENTERPRISE";
  featureName: string;
}

export function PremiumGuard({ children, level, featureName }: PremiumGuardProps) {
  const { subscription } = useAura();

  const isLocked = (level === "PRO" && subscription === "BASIC") || 
                   (level === "ENTERPRISE" && subscription !== "ENTERPRISE");

  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative group">
      <div className="blur-sm pointer-events-none select-none opacity-50 transition-all group-hover:blur-md">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass border-primary/30 p-8 rounded-[32px] max-w-sm text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary" size={32} />
          </div>
          <h4 className="text-xl font-bold font-outfit mb-2 text-foreground">Función Premium</h4>
          <p className="text-sm text-muted mb-6">
            El módulo de <b>{featureName}</b> está disponible en el plan <span className="text-primary font-bold">{level}</span>.
          </p>
          <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group/btn">
            <Sparkles size={18} className="group-hover/btn:animate-pulse" />
            Mejorar Plan ahora
          </button>
        </motion.div>
      </div>
    </div>
  );
}
