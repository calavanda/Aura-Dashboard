"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  BarChart3
} from "lucide-react";
import { useAura } from "@/context/AuraContext";

export function FinanceModule() {
  const { reservations } = useAura();

  const paidReservations = reservations.filter(r => r.paymentStatus === "PAGADO");
  const totalRevenue = paidReservations.reduce((acc, r) => acc + (r.amount || 0), 0);
  const pendingRevenue = reservations
    .filter(r => r.paymentStatus === "PENDIENTE")
    .reduce((acc, r) => acc + (r.amount || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-bold font-outfit text-foreground tracking-tight">Finanzas</h3>
          <p className="text-muted text-sm mt-2">Control de ingresos y estados de pago.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceCard 
          title="Ingresos Totales" 
          value={`$${totalRevenue.toLocaleString()}`} 
          trend="+12.5%" 
          positive={true}
          icon={DollarSign}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <FinanceCard 
          title="Pagos Pendientes" 
          value={`$${pendingRevenue.toLocaleString()}`} 
          trend="+5.2%" 
          positive={false}
          icon={TrendingUp}
          color="text-amber-500"
          bg="bg-amber-500/10"
        />
        <FinanceCard 
          title="Ticket Promedio" 
          value={`$${(paidReservations.length > 0 ? totalRevenue / paidReservations.length : 0).toLocaleString()}`} 
          trend="+2.1%" 
          positive={true}
          icon={PieChart}
          color="text-primary"
          bg="bg-primary/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[40px] space-y-6">
          <h4 className="text-lg font-bold font-outfit flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Últimas Transacciones
          </h4>
          
          <div className="space-y-4">
            {paidReservations.length > 0 ? (
              paidReservations.slice(-5).reverse().map((res) => (
                <div key={res.id} className="flex items-center justify-between p-4 rounded-2xl bg-accent/50 hover:bg-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-emerald-500">
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{res.guestName}</p>
                      <p className="text-[10px] text-muted uppercase tracking-widest">{res.paymentProvider} • {res.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-500">+${res.amount?.toLocaleString()}</p>
                    <p className="text-[10px] text-muted uppercase tracking-widest">{new Date(res.checkIn).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-muted text-sm italic">No hay transacciones completadas aún.</p>
            )}
          </div>
        </div>

        <div className="glass p-8 rounded-[40px] bg-linear-to-br from-primary/5 to-transparent border-primary/10 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <TrendingUp size={40} className="text-primary" />
          </div>
          <h4 className="text-2xl font-bold font-outfit text-foreground mb-4">Proyecciones Aura</h4>
          <p className="text-muted text-sm max-w-xs transition-all">
            Tu hotel está generando un flujo constante. Con el ritmo actual, podrías cerrar el mes con un incremento del **8%** en comparación al anterior.
          </p>
          <button className="mt-8 px-8 py-3 bg-primary text-background font-bold text-xs rounded-2xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest">
            Descargar Reporte PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function FinanceCard({ title, value, trend, positive, icon: Icon, color, bg }: { title: string, value: string, trend: string, positive: boolean, icon: any, color: string, bg: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-[32px] space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${bg}`}>
          <Icon className={color} size={24} />
        </div>
        <div className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full ${positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">{title}</p>
        <p className="text-3xl font-bold tracking-tight mt-1">{value}</p>
      </div>
    </motion.div>
  );
}

export default FinanceModule;
