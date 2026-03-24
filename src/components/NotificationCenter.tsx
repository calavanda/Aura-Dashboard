"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Info, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import { useAura } from "@/context/AuraContext";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { subscription, trialDaysLeft, isOwner } = useAura();

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
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            ></div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 glass border-border/50 rounded-[32px] shadow-2xl z-50 overflow-hidden"
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
                      <div className="flex gap-4">
                        <div className="mt-1">{n.icon}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-foreground">{n.title}</p>
                            <p className="text-[10px] text-muted">{n.time}</p>
                          </div>
                          <p className="text-[10px] text-muted leading-relaxed uppercase tracking-wider">
                            {n.description}
                          </p>
                        </div>
                      </div>
                      {!n.isRead && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
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
