"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Home, Hash, Layers } from "lucide-react";
import { useAura, RoomStatus } from "@/context/AuraContext";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddRoomModal({ isOpen, onClose }: AddRoomModalProps) {
  const { addRoom } = useAura();
  const [number, setNumber] = useState("");
  const [type, setType] = useState("Estándar");
  const [status, setStatus] = useState<RoomStatus>("Limpia");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) return;
    
    addRoom({
      number,
      type,
      status
    });
    
    setNumber("");
    onClose();
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
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass p-8 rounded-[40px] z-50 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold font-outfit text-foreground flex items-center">
                <Plus className="mr-3 text-primary" size={24} /> Nueva Habitación
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors text-muted"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted pl-4">Número / Identificador</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input 
                    type="text" 
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Ej: 101, A-2, Suite-1"
                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted pl-4">Tipo de Habitación</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                  >
                    <option>Estándar</option>
                    <option>Sencilla</option>
                    <option>Doble</option>
                    <option>Suite</option>
                    <option>Penthouse</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center justify-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Agregar Habitación</span>
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
