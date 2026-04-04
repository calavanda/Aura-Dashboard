"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Utensils, Type, Layers, Loader2, Check } from "lucide-react";
import { createRestaurant } from "@/app/actions/restaurant";
import { useI18n } from "@/context/I18nContext";

interface CreateRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  onSuccess: () => void;
}

export function CreateRestaurantModal({ isOpen, onClose, hotelId, onSuccess }: CreateRestaurantModalProps) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [type, setType] = useState("RESTAURANTE");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await createRestaurant(hotelId, name, type);

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setName("");
          setType("RESTAURANTE");
          setIsSubmitting(false);
          setIsSuccess(false);
          onSuccess();
          onClose();
        }, 1500);
      } else {
        alert(res.error || "Error creating restaurant");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-60"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40, rotateX: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass border-white/10 p-1 rounded-[45px] z-70 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="bg-[#0A0A0A]/90 p-10 rounded-[40px] relative overflow-hidden">
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="absolute inset-0 z-50 bg-[#FF385C]/10 backdrop-blur-xl flex flex-col items-center justify-center space-y-4"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 bg-[#FF385C] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,56,92,0.4)]"
                    >
                      <Check className="text-white" size={40} />
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-white font-black uppercase tracking-[0.3em] font-institutional text-sm"
                    >
                      {t("common.saved")}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black font-institutional text-white flex items-center uppercase tracking-tighter italic">
                    <Utensils className="mr-3 text-[#FF385C] stroke-[3px]" size={28} /> {t("rest.restaurant.new")}
                  </h2>
                  <div className="w-12 h-1 bg-[#FF385C] rounded-full" />
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-all text-zinc-500 hover:text-white group"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 pl-4 font-institutional group-focus-within:text-[#FF385C] transition-colors">
                    {t("rest.restaurant.name")}
                  </label>
                  <div className="relative">
                    <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Aura Bistro"
                      className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-black focus:ring-4 focus:ring-[#FF385C]/10 focus:border-[#FF385C] outline-none transition-all placeholder:text-zinc-800 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 pl-4 font-institutional group-focus-within:text-[#FF385C] transition-colors">
                    {t("rest.restaurant.type")}
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white font-black focus:ring-4 focus:ring-[#FF385C]/10 focus:border-[#FF385C] outline-none transition-all appearance-none text-sm"
                    >
                      <option value="RESTAURANTE" className="bg-[#121212]">RESTAURANTE</option>
                      <option value="BAR" className="bg-[#121212]">BAR</option>
                      <option value="CAFETERIA" className="bg-[#121212]">CAFETERÍA</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-[#FF385C] opacity-100 group-hover/btn:scale-110 transition-transform duration-500" />
                    <div className="relative px-8 py-5 rounded-2xl text-white font-black flex items-center justify-center space-x-3 uppercase tracking-[0.3em] font-institutional text-sm">
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <Plus size={18} className="stroke-[3px]" />
                          <span>{t("rest.restaurant.create")}</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
