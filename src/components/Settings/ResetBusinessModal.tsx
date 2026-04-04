"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  Loader2, 
  ChevronRight
} from "lucide-react";
import { resetBusinessAction } from "@/app/actions/aura";

interface ResetBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  hotelId: string;
}

export function ResetBusinessModal({ isOpen, onClose, businessName, hotelId }: ResetBusinessModalProps) {
  const [step, setStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!isConfirmed || typedName.toLowerCase() !== businessName.toLowerCase()) return;
    
    setLoading(true);
    setError("");
    const res = await resetBusinessAction(hotelId, typedName);
    if (res.success) {
      window.location.href = "/"; // Force hard reload to trigger setup flow
    } else {
      setError(res.error || "Error al reiniciar el negocio");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#0A0A0A] border border-rose-500/20 rounded-[40px] shadow-2xl overflow-hidden shadow-rose-500/10"
          >
            <div className="p-8 space-y-6">
              {step === 1 ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-rose-500/10 rounded-2xl">
                        <AlertTriangle className="text-rose-500" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-outfit text-white">¿Reiniciar Negocio?</h3>
                        <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mt-1">Advertencia de Seguridad</p>
                      </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                      <X size={20} className="text-zinc-500" />
                    </button>
                  </div>

                  <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl space-y-4">
                    <p className="text-sm text-rose-200 leading-relaxed font-medium">
                      Estás a punto de eliminar **TODOS** los datos de <span className="font-black underline">{businessName}</span>. 
                      Esta acción no se puede deshacer. Se perderán:
                    </p>
                    <ul className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-tight text-rose-500/60">
                      <li>• Reservaciones</li>
                      <li>• Habitaciones</li>
                      <li>• Menús / Platillos</li>
                      <li>• Inventario</li>
                      <li>• Finanzas / Gastos</li>
                      <li>• Empleados</li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
                  >
                    Entiendo, continuar 
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-rose-500/10 rounded-2xl">
                        <Trash2 className="text-rose-500" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-outfit text-white">Confirmación Final</h3>
                        <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mt-1">Paso 2 de 2</p>
                      </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                      <X size={20} className="text-zinc-500" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <label className="flex items-start gap-4 p-4 bg-white/2 rounded-3xl border border-white/5 cursor-pointer group hover:bg-white/5 transition-all">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 rounded-lg border-white/10 bg-black checked:bg-rose-500 transition-all cursor-pointer"
                        checked={isConfirmed}
                        onChange={(e) => setIsConfirmed(e.target.checked)}
                      />
                      <span className="text-xs text-zinc-400 font-medium leading-normal">
                        Confirmo que deseo eliminar todos los datos permanentemente y entiendo que mi cuenta se reiniciará al flujo de configuración inicial.
                      </span>
                    </label>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                        Escribe <span className="text-white">&quot;{businessName}&quot;</span> para confirmar
                      </label>
                      <input 
                        type="text" 
                        value={typedName}
                        onChange={(e) => setTypedName(e.target.value)}
                        placeholder="Nombre de tu negocio"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all text-white placeholder:text-zinc-700 font-bold"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-[10px] font-black uppercase text-center">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setStep(1)}
                      className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 py-4 rounded-2xl font-bold transition-all"
                    >
                      Volver
                    </button>
                    <button 
                      onClick={handleReset}
                      disabled={loading || !isConfirmed || typedName.toLowerCase() !== businessName.toLowerCase()}
                      className="flex-2 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-30 disabled:shadow-none"
                    >
                      {loading ? <Loader2 className="animate-spin text-white" size={18} /> : <Trash2 size={18} />}
                      Eliminar Negocio para Siempre
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
