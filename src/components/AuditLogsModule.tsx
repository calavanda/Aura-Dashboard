"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ClipboardList, 
  User, 
  Clock, 
  Settings,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export function AuditLogsModule() {
  // Mock logs for demonstration
  const logs = [
    { id: 1, user: "itslacia@gmail.com", action: "Check-in Realizado", details: "Habitación 101 - Juan Pérez", time: "Hace 5 minutos", level: "info" },
    { id: 2, user: "admin", action: "Configuración Actualizada", details: "Ajuste de tarifas temporada alta", time: "Hace 20 minutos", level: "warning" },
    { id: 3, user: "22610282@utgz.edu.mx", action: "Nueva Reserva", details: "Suite Presidencial - María Garcia", time: "Hace 1 hora", level: "info" },
    { id: 4, user: "system", action: "Respaldo Automático", details: "Cloud MongoDB Atlas Sync", time: "Hace 3 horas", level: "success" },
    { id: 5, user: "gerente", action: "Limpieza Confirmada", details: "Habitación 204", time: "Hace 5 horas", level: "info" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-bold font-outfit text-foreground tracking-tight">Logs de Sistema</h3>
          <p className="text-muted text-sm mt-2">Historial detallado de auditoría y operaciones.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-accent text-foreground text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-border transition-all">Exportar CSV</button>
        </div>
      </div>

      <div className="glass rounded-[40px] overflow-hidden border border-border/50">
        <div className="divide-y divide-border">
          {logs.map((log, idx) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-6 p-6 hover:bg-accent/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                log.level === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                log.level === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                'bg-primary/10 text-primary'
              }`}>
                {log.level === 'warning' ? <AlertTriangle size={20} /> : 
                 log.level === 'success' ? <ShieldCheck size={20} /> : 
                 <ClipboardList size={20} />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{log.action}</span>
                  <span className="w-1 h-1 bg-muted rounded-full"></span>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{log.user}</span>
                </div>
                <p className="text-xs text-muted mt-1">{log.details}</p>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 text-muted">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{log.time}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-border group-hover:bg-primary transition-colors"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="p-6 bg-accent/20 text-center">
          <button className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">Ver Historial Completo</button>
        </div>
      </div>
    </div>
  );
}

export default AuditLogsModule;
