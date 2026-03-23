"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, Bed, TrendingUp, X } from "lucide-react";

export function WelcomeTour({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Bienvenido a Aura",
      desc: "El sistema inteligente diseñado para simplificar la gestión de tu hospitalidad.",
      icon: Sparkles,
      color: "bg-primary"
    },
    {
      title: "Gestión de Habitaciones",
      desc: "Controla el estado de limpieza y disponibilidad en tiempo real con un solo clic.",
      icon: Bed,
      color: "bg-blue-500"
    },
    {
      title: "Reservas Inteligentes",
      desc: "Mantén un control total de tus huéspedes y su experiencia desde el primer contacto.",
      icon: Calendar,
      color: "bg-emerald-500"
    },
    {
      title: "Automatización Financiera",
      desc: "Genera reportes y analiza el rendimiento de tu negocio con Aura Intelligence.",
      icon: TrendingUp,
      color: "bg-secondary"
    }
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-background/40 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass max-w-lg w-full p-10 rounded-[40px] shadow-2xl relative text-center"
      >
        <button 
          onClick={onComplete}
          className="absolute top-6 right-6 text-muted hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center"
          >
            <div className={`w-20 h-20 ${current.color} bg-opacity-20 rounded-3xl flex items-center justify-center mb-8`}>
              <current.icon size={40} className={current.color.replace('bg-', 'text-')} />
            </div>
            <h2 className="text-3xl font-bold font-outfit text-foreground mb-4">{current.title}</h2>
            <p className="text-muted leading-relaxed mb-10">{current.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
            className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-primary/20"
          >
            {step === steps.length - 1 ? "¡Empezar ahora!" : "Siguiente"}
          </button>
          
          <div className="flex justify-center space-x-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${i === step ? 'w-6 bg-primary' : 'bg-accent'}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
