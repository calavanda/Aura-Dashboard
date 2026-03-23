"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  CreditCard,
  ClipboardList
} from "lucide-react";
import { useAura } from "@/context/AuraContext";

export function AuditLogsModule() {
  const { logs } = useAura();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-3xl font-bold font-outfit text-foreground tracking-tight">Registro de Auditoría</h3>
          <p className="text-muted text-sm mt-2">Seguimiento en tiempo real de todas las acciones del sistema.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          En Vivo
        </div>
      </div>

      <div className="space-y-4">
        {logs && logs.length > 0 ? (
          logs.map((log: any, idx: number) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-5 rounded-3xl flex items-center gap-6 group hover:border-primary/30 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                log.action.toLowerCase().includes('error') || log.action.includes('FALLIDO') ? 'bg-red-500/10 text-red-500' : 
                log.action.includes('PAGADO') || log.action.includes('COMPLETO') ? 'bg-emerald-500/10 text-emerald-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                {log.action.toLowerCase().includes('pago') ? <CreditCard size={20} /> : <Activity size={20} />}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{log.action}</p>
                    <p className="text-xs text-muted mt-1">{log.details || 'Sin detalles adicionales'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-foreground uppercase">{log.userName}</p>
                    <p className="text-[10px] text-muted mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="glass p-20 rounded-[40px] text-center space-y-4">
             <Activity size={40} className="mx-auto text-muted mb-4" />
             <h4 className="text-lg font-bold font-outfit">Sin actividad reciente</h4>
             <p className="text-sm text-muted">Las acciones realizadas por el equipo aparecerán aquí.</p>
          </div>
        )}
      </div>
        
      <div className="p-6 bg-accent/20 text-center rounded-3xl mt-8">
        <button className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all flex items-center gap-2 mx-auto">
          <Clock size={14} />
          Ver Historial Completo
        </button>
      </div>
    </div>
  );
}

export default AuditLogsModule;
