"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, DollarSign, CreditCard, Banknote, Building, Loader2 } from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { useI18n } from "@/context/I18nContext";
import { Reservation } from "@/types";

interface RegisterPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

export function RegisterPaymentModal({ isOpen, onClose, reservation }: RegisterPaymentModalProps) {
  const { updateReservationPayment } = useAura();
  const { t } = useI18n();
  const [method, setMethod] = useState<"EFECTIVO" | "TERMINAL" | "TRANSFERENCIA">("EFECTIVO");
  const [amountOverride, setAmountOverride] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const finalAmount = amountOverride ? parseFloat(amountOverride) : (reservation.amount || 0);
      await updateReservationPayment(reservation.id, {
        paymentStatus: "PAGADO",
        paymentMethod: method,
        amount: finalAmount
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(false);
        setAmountOverride("");
        setMethod("EFECTIVO");
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const methods = [
    { id: "EFECTIVO", label: t("pay.cash" as keyof typeof import('@/i18n/locales/es').es) || "Efectivo", icon: Banknote },
    { id: "TERMINAL", label: t("pay.terminal" as keyof typeof import('@/i18n/locales/es').es) || "Terminal TPV", icon: CreditCard },
    { id: "TRANSFERENCIA", label: t("pay.transfer" as keyof typeof import('@/i18n/locales/es').es) || "Transferencia", icon: Building }
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && reservation && (
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
                    className="absolute inset-0 z-50 bg-emerald-500/10 backdrop-blur-xl flex flex-col items-center justify-center space-y-4"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                    >
                      <Check className="text-white" size={40} />
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-white font-black uppercase tracking-[0.3em] font-institutional text-sm"
                    >
                      {t("pay.success" as keyof typeof import('@/i18n/locales/es').es) || "PAGO REGISTRADO"}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black font-institutional text-emerald-400 flex items-center uppercase tracking-tighter italic">
                    <DollarSign className="mr-3 text-emerald-400 stroke-[3px]" size={28} /> {t("pay.title" as keyof typeof import('@/i18n/locales/es').es) || "LIQUIDACIÓN"}
                  </h2>
                  <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-all text-zinc-500 hover:text-white group"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              <div className="bg-white/5 p-4 rounded-3xl mb-8 border border-white/5">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{t("res.guestName" as keyof typeof import('@/i18n/locales/es').es) || "HUÉSPED"}</p>
                <p className="text-white font-black">{reservation.guestName}</p>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{t("pay.debt" as keyof typeof import('@/i18n/locales/es').es) || "MONTO PENDIENTE"}</p>
                    <p className="text-2xl text-emerald-400 font-black tracking-tighter">
                      ${reservation.amount?.toLocaleString() || "0.00"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded-md">
                      {reservation.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 pl-4 font-institutional">{t("pay.method" as keyof typeof import('@/i18n/locales/es').es) || "MÉTODO DE PAGO"}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {methods.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                          method === m.id 
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                            : "bg-white/2 border-white/5 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                        }`}
                      >
                        <m.icon size={24} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 pl-4 font-institutional group-focus-within:text-emerald-400 transition-colors">
                    {t("pay.amountOverride" as keyof typeof import('@/i18n/locales/es').es) || "SOBRESCRIBIR MONTO (SI DIFIERE)"}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      type="number" 
                      value={amountOverride}
                      min="0"
                      step="0.01"
                      onChange={(e) => setAmountOverride(e.target.value)}
                      placeholder={reservation.amount?.toString() || "0.00"}
                      className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white font-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-zinc-800 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-emerald-500 opacity-100 group-hover/btn:scale-110 transition-transform duration-500" />
                    <div className="relative px-8 py-5 rounded-2xl text-white font-black flex items-center justify-center space-x-3 uppercase tracking-[0.3em] font-institutional text-sm">
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <Check size={18} className="stroke-[3px]" />
                          <span>{t("pay.confirm" as keyof typeof import('@/i18n/locales/es').es) || "REGISTRAR PAGO"}</span>
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
