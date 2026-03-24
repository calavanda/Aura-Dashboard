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

  return (
    <div className="space-y-6">
      <AddRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence mode="popLayout">
        {rooms.map((room) => {
          const config = statusConfig[room.status];
          return (
            <motion.div
              key={room.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              onClick={() => toggleRoomStatus(room.id)}
              className="glass p-6 rounded-[2.5rem] cursor-pointer group transition-all duration-500 border-white/5 bg-white/1 hover:border-primary/20 relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${config.color} border border-white/5`}>
                  <config.icon size={24} />
                </div>
                 <div className="text-right">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-1 font-institutional">{t("room.unit")}</span>
                  <span className="text-2xl font-black text-white group-hover:text-primary transition-colors leading-none tracking-tighter">#{room.number}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">{room.type}</div>
                <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block border ${config.color.split(' ')[1]} ${config.color.split(' ')[0]}`}>
                  {room.status.toUpperCase()}
                </div>
              </div>

               <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <span>{t("room.lastClean")}</span>
                <span className="text-white font-black">{t("room.cleanTime")}</span>
              </div>

              {/* Delete Button - Overlay on Hover */}
              {canManage && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRoom(room.id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsModalOpen(true)}
            className="p-6 rounded-[40px] border-2 border-dashed border-border flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/50 cursor-pointer group transition-all min-h-[220px]"
          >
            <div className="w-16 h-16 bg-muted group-hover:bg-primary/20 rounded-3xl flex items-center justify-center transition-colors">
              <Plus className="text-muted group-hover:text-primary transition-colors" size={32} />
            </div>
            <div>
              <h4 className="font-black text-white font-institutional uppercase tracking-tight">{t("room.new")}</h4>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1 font-institutional">{t("room.manual")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
