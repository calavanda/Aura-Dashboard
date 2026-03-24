"use client";

import React from "react";
import { useAura, RoomStatus } from "@/context/AuraContext";
import { useI18n } from "@/context/I18nContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, CheckCircle2, AlertCircle, Clock, Hammer, Trash2, Plus } from "lucide-react";
import { AddRoomModal } from "./Onboarding/AddRoomModal";

const statusConfig: Record<RoomStatus, { color: string, icon: any }> = {
  "Limpia": { color: "text-emerald-400 bg-emerald-500/10", icon: CheckCircle2 },
  "Sucia": { color: "text-amber-400 bg-amber-500/10", icon: Clock },
  "Ocupada": { color: "text-blue-400 bg-blue-500/10", icon: Bed },
  "Mantenimiento": { color: "text-rose-400 bg-red-500/10", icon: Hammer },
};

export function RoomGrid() {
  const { rooms, toggleRoomStatus, deleteRoom, role } = useAura();
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const canManage = role === "ADMIN" || role === "GERENTE";

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring" as const, 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  return (
    <div className="space-y-6">
      <AddRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
      <AnimatePresence mode="popLayout">
        {rooms.map((room) => {
          const config = statusConfig[room.status];
          const colorClass = config.color.split(' ')[0]; // e.g. text-emerald-400
          
          return (
            <motion.div
              key={room.id}
              layout
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              whileHover={{ 
                y: -8, 
                transition: { type: "spring" as const, stiffness: 400, damping: 10 } 
              }}
              onClick={() => toggleRoomStatus(room.id)}
              className="glass p-6 rounded-[2.5rem] cursor-pointer group transition-all duration-500 border-white/5 bg-white/1 hover:border-primary/20 relative overflow-hidden active:scale-95"
            >
              {/* Dynamic Glow Background */}
              <div className={`absolute -inset-2 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-full ${config.color.split(' ')[1]}`} />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-4 rounded-2xl ${config.color} border border-white/5 relative`}>
                  <config.icon size={24} />
                  {/* Pulsing Status Dot */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${config.color.split(' ')[1]} border-2 border-[#121212] flex items-center justify-center overflow-hidden`}>
                    <div className={`w-full h-full rounded-full ${colorClass.replace('text-', 'bg-')} animate-pulse`} />
                  </div>
                </div>
                 <div className="text-right">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-1 font-institutional">{t("room.unit")}</span>
                  <span className="text-2xl font-black text-white group-hover:text-primary transition-colors leading-none tracking-tighter">#{room.number}</span>
                </div>
              </div>
              
              <div className="space-y-1 relative z-10">
                <div className="text-sm font-black text-white/90 uppercase tracking-wide">{room.type}</div>
                <div className={`text-[9px] font-black px-3 py-1 rounded-full inline-flex items-center space-x-1.5 border ${config.color.split(' ')[1]} ${colorClass} uppercase tracking-widest`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('text-', 'bg-')}`} />
                  <span>{room.status}</span>
                </div>
              </div>

               <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider relative z-10">
                <span>{t("room.lastClean")}</span>
                <span className="text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{t("room.cleanTime")}</span>
              </div>

              {/* Delete Button - Overlay on Hover */}
              {canManage && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRoom(room.id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-20"
                  title="Eliminar habitación"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </motion.div>
          );
        })}

        {/* Add Room Card */}
        {canManage && (
          <motion.div
            layout
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded-[45px] relative group cursor-pointer"
          >
            {/* Animated Glow Border */}
            <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-primary/5 to-primary/20 rounded-[45px] opacity-50 group-hover:opacity-100 transition-opacity blur-[1px] -z-10" />
            
            <div className="h-full w-full bg-[#121212]/90 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[220px]">
              <div className="w-16 h-16 bg-white/5 border border-white/5 group-hover:border-primary/30 group-hover:bg-primary/10 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-xl">
                <Plus className="text-zinc-600 group-hover:text-primary transition-colors group-hover:scale-110 duration-500" size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-white font-institutional uppercase tracking-tighter text-lg">{t("room.new")}</h4>
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] font-institutional">{t("room.manual")}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </div>
  );
}
