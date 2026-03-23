"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Plus,
  Settings
} from "lucide-react";
import { useAura } from "@/context/AuraContext";

export function PaymentSandbox() {
  const { hotelId } = useAura();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [formData, setFormData] = useState({
    guestName: "Juan Pérez (PRUEBA)",
    roomNumber: "101",
    amount: 1500,
    paymentMethod: "EN_LINEA",
    paymentProvider: "STRIPE"
  });

  const runTest = async () => {
    setLoading(true);
    setStatus(null);
    try {
      if (!hotelId) throw new Error("ID del hotel no encontrado. Por favor completa la configuración.");

      const resResponse = await fetch(`/api/public/hotel/${hotelId}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          checkIn: new Date().toISOString()
        })
      });

      const resData = await resResponse.json();
      if (!resResponse.ok) throw new Error(resData.error || "Error al crear reserva");
      const reservationId = resData.reservation.id;

      const payResponse = await fetch(`/api/public/hotel/${hotelId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          action: "CONFIRM_ONLINE_PAYMENT",
          transactionId: `test_tx_${Math.random().toString(36).substr(2, 9)}`,
          paymentProvider: formData.paymentProvider
        })
      });

      const payData = await payResponse.json();
      if (!payResponse.ok) throw new Error(payData.error || "Error al procesar pago");

      setStatus({ 
        type: 'success', 
        message: `¡Prueba exitosa! Reserva ${reservationId} confirmada con ${formData.paymentProvider}.` 
      });

    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-bold font-outfit text-foreground tracking-tight">Payment Sandbox</h3>
          <p className="text-muted text-sm mt-2">Simula integraciones de pasarelas de pago externas.</p>
        </div>
        <div className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Modo Desarrollador</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-[40px] space-y-6"
        >
          <h4 className="text-lg font-bold font-outfit flex items-center gap-2">
            <Settings size={20} className="text-primary" />
            Parámetros de Prueba
          </h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Huésped</label>
              <input 
                type="text" 
                value={formData.guestName}
                onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Habitación</label>
                <input 
                  type="text" 
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  className="w-full bg-background/50 border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Monto (MXN)</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                  className="w-full bg-background/50 border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Pasarela</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['STRIPE', 'PAYPAL', 'MERCADOPAGO'].map((provider) => (
                  <button
                    key={provider}
                    onClick={() => setFormData({...formData, paymentProvider: provider as any})}
                    className={`py-2 rounded-xl text-[10px] font-bold transition-all ${
                      formData.paymentProvider === provider 
                        ? 'bg-primary text-background shadow-lg shadow-primary/20' 
                        : 'bg-accent text-muted hover:text-foreground'
                    }`}
                  >
                    {provider}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={runTest}
            disabled={loading}
            className="w-full py-4 bg-foreground text-background font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            Ejecutar Simulación Completa
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-[40px] flex flex-col h-full bg-black/5 dark:bg-black/40 border-black/5"
        >
          <h4 className="text-lg font-bold font-outfit mb-6 text-foreground/80">Salida de Consola</h4>
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            {!status && !loading && (
              <>
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-muted">
                  <CreditCard size={32} />
                </div>
                <p className="text-xs text-muted max-w-[200px]">Esperando ejecución de prueba...</p>
              </>
            )}
            {loading && (
              <div className="space-y-4">
                <Loader2 className="animate-spin text-primary mx-auto" size={48} />
                <p className="text-sm font-medium animate-pulse">Procesando...</p>
              </div>
            )}
            {status && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-4 w-full"
              >
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${status.type === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                  {status.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                </div>
                <div className={`p-4 rounded-2xl text-xs font-mono text-left break-all ${status.type === 'success' ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/5 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
                  {status.message}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="glass p-8 rounded-[40px]">
        <h4 className="text-sm font-bold uppercase tracking-widest text-muted mb-6">Flujo Proyectado</h4>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <FlowStep icon={Plus} label="Reserva" completed={!!status || loading} />
          <div className="h-px flex-1 bg-border hidden md:block"></div>
          <FlowStep icon={CreditCard} label="Pago" completed={!!status || loading} />
          <div className="h-px flex-1 bg-border hidden md:block"></div>
          <FlowStep icon={CheckCircle2} label="Aura" completed={status?.type === 'success'} />
        </div>
      </div>
    </div>
  );
}

function FlowStep({ icon: Icon, label, completed }: { icon: any, label: string, completed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${completed ? 'bg-primary text-background' : 'bg-accent text-muted'}`}>
        <Icon size={18} />
      </div>
      <span className={`text-xs font-bold ${completed ? 'text-foreground' : 'text-muted'}`}>{label}</span>
    </div>
  );
}

export default PaymentSandbox;
