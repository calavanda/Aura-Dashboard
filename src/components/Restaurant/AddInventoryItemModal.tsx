"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Package, Hash, Ruler, AlertTriangle, Loader2, Check } from "lucide-react";
import { updateInventoryItem } from "@/app/actions/restaurant";

interface AddInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  restaurantId: string | null;
  onSuccess: () => void;
}

export function AddInventoryItemModal({ isOpen, onClose, hotelId, restaurantId, onSuccess }: AddInventoryItemModalProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [threshold, setThreshold] = useState("2");
  const [cost, setCost] = useState("0");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity || !unit || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await updateInventoryItem(hotelId, restaurantId, {
        name,
        quantity: parseFloat(quantity),
        unit,
        threshold: parseFloat(threshold),
        price: parseFloat(cost)
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setName("");
          setQuantity("");
          setUnit("kg");
          setThreshold("2");
          setCost("0");
          setIsSubmitting(false);
          setIsSuccess(false);
          onSuccess();
          onClose();
        }, 1500);
      } else {
        alert(res.error || "Error adding item");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const commonUnits = ["kg", "g", "L", "ml", "unidad", "pack", "caja"];

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass border-white/10 p-1 rounded-[40px] z-70 shadow-2xl"
          >
            <div className="bg-[#0A0A0A]/90 p-8 rounded-[38px] relative overflow-hidden">
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-[#FF385C]/10 backdrop-blur-xl flex flex-col items-center justify-center space-y-4"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-[#FF385C] rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Check className="text-white" size={32} />
                    </motion.div>
                    <p className="text-white font-black uppercase tracking-widest text-xs">Guardado correctamente</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black font-institutional text-white flex items-center uppercase italic">
                    <Package className="mr-3 text-[#FF385C]" size={24} /> Materia Prima
                  </h2>
                  <div className="w-10 h-1 bg-[#FF385C] rounded-full" />
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 pl-2">Ingrediente / Insumo</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Tomate Roma, Carne de Res..."
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white font-bold focus:border-[#FF385C] outline-none transition-all placeholder:text-zinc-800 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 pl-2">Cantidad Inicial</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                      <input 
                        type="number" 
                        step="0.01"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white font-bold focus:border-[#FF385C] outline-none transition-all placeholder:text-zinc-800 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 pl-2">Unidad</label>
                    <div className="relative">
                      <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                      <select 
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white font-bold focus:border-[#FF385C] outline-none transition-all appearance-none text-sm"
                        required
                      >
                        {commonUnits.map(u => (
                          <option key={u} value={u} className="bg-[#121212]">{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 pl-2">Umbral de Aviso</label>
                      <div className="relative">
                        <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF385C]/60" size={14} />
                        <input 
                          type="number" 
                          step="0.01"
                          value={threshold}
                          onChange={(e) => setThreshold(e.target.value)}
                          placeholder="Ej. 2"
                          className="w-full bg-[#FF385C]/5 border border-[#FF385C]/10 rounded-xl py-3 pl-12 pr-4 text-white font-bold focus:border-[#FF385C] outline-none transition-all text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 pl-2">Costo de Compra (U$)</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                        <input 
                          type="number" 
                          step="0.01"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white font-bold focus:border-[#FF385C] outline-none transition-all placeholder:text-zinc-800 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF385C] hover:bg-[#FF385C]/90 text-white font-black py-4 rounded-xl flex items-center justify-center space-x-2 uppercase tracking-widest text-xs transition-all transform active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><Plus size={16} /> <span>Agregar al Inventario</span></>}
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
