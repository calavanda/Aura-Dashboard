"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Info, CheckCircle2 } from "lucide-react";
import { useAura } from "@/context/AuraContext";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { isOwner } = useAura();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Bienvenido a Aura",
      description: "Explora todas las funciones de gestión hotelera.",
      type: "info",
      icon: <Info size={16} className="text-blue-500" />,
      time: "Ahora",
      isRead: false
    },
    ...(isOwner ? [
        {
          id: 4,
          title: "Modo Propietario Activo",
          description: "Tienes acceso total ilimitado a Aura.",
          type: "success",
          icon: <CheckCircle2 size={16} className="text-emerald-500" />,
          time: "1m",
          isRead: false
        }
    ] : [])
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted hover:text-primary transition-colors relative group"
      >
        <Bell size={20} className={isOpen ? "text-primary" : ""} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border-2 border-background animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-100 bg-black/20 backdrop-blur-sm" 
              onClick={() => setIsOpen(false)}
            ></div>
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="absolute right-0 mt-6 w-96 glass border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] z-110"
            >
              <div className="p-6 border-b border-border/50 bg-background/50 flex justify-between items-center">
                <h4 className="font-bold font-outfit">Notificaciones</h4>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} NUEVAS
                  </span>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center text-muted text-[10px] font-bold uppercase tracking-widest">
                    No hay notificaciones
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n.id)}
                      className={`p-4 border-b border-border/20 hover:bg-white/5 transition-colors cursor-pointer group/item relative ${n.isRead ? 'opacity-40' : ''}`}
                    >
                      <div className="flex gap-5">
                        <div className="mt-1 shrink-0">{n.icon}</div>
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-[13px] font-bold text-white truncate">{n.title}</p>
                            <p className="text-[10px] text-zinc-500 font-medium whitespace-nowrap">{n.time}</p>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed uppercase tracking-wider mt-1">
                            {n.description}
                          </p>
                        </div>
                      </div>
                      {!n.isRead && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF385C] rounded-full shadow-[0_0_10px_#FF385C]" 
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-4 text-center bg-background/50 border-t border-border/20">
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                  >
                    Marcar todas como leídas
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
