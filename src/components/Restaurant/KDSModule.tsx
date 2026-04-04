"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChefHat, 
  CheckCircle2, 
  Timer,
  ChevronRight,
  Printer,
  Loader2
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { updateOrderStatus } from "@/app/actions/restaurant";
import { Order } from "@/types";

interface KDSModuleProps {
  restaurantId?: string | null;
  orders?: Order[];
  onRefresh?: () => void;
}

export function KDSModule({ restaurantId, orders, onRefresh }: KDSModuleProps) {
  const { activeOrders: allOrders, refreshData } = useAura();
  const [loading, setLoading] = useState(false);

  // Use provided orders or fallback to global ones
  const sourceOrders = orders || allOrders;

  // Filter for orders that need kitchen attention AND match the restaurant
  const activeOrders = sourceOrders.filter(o => 
    ["PENDIENTE", "PREPARANDO"].includes(o.status || "") &&
    (!restaurantId || o.restaurantId === restaurantId)
  );

  const handleStatusUpdate = async (orderId: string, nextStatus: string) => {
    setLoading(true);
    const res = await updateOrderStatus(orderId, nextStatus);
    if (res.success) {
      if (onRefresh) {
        onRefresh();
      } else {
        await refreshData();
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center">
            <ChefHat className="mr-4 text-primary" size={36} /> Kitchen Display System
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 italic">Aura Institutional Service Mode</p>
        </div>
        <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-3xl border border-white/5">
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Pedidos en cola</p>
            <p className="text-2xl font-black text-white">{activeOrders.length}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <Printer className="text-zinc-600 hover:text-white cursor-pointer transition-colors" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {activeOrders.map((order, idx) => (
            <KDSCard 
              key={order.id} 
              order={order} 
              onNext={() => handleStatusUpdate(order.id, order.status === "PENDIENTE" ? "PREPARANDO" : "SERVIDO")}
              loading={loading}
              idx={idx}
            />
          ))}
        </AnimatePresence>

        {activeOrders.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white/2 rounded-[3.5rem] border border-dashed border-white/10">
            <CheckCircle2 className="text-zinc-800 mb-6" size={64} />
            <h3 className="text-xl font-bold text-zinc-500 uppercase tracking-widest">Cocina Limpia</h3>
            <p className="text-zinc-700 text-xs mt-2">No hay pedidos pendientes de preparación.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function KDSCard({ order, onNext, loading, idx }: { order: Order, onNext: () => void, loading: boolean, idx: number }) {
  const [timeElapsed, setTimeElapsed] = useState(() => {
    const start = new Date(order.createdAt).getTime();
    return Math.floor((Date.now() - start) / 1000 / 60);
  });

  useEffect(() => {
    const start = new Date(order.createdAt).getTime();

    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - start) / 1000 / 60));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const isLate = timeElapsed > 20;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ delay: idx * 0.05 }}
      className={`glass rounded-[2.5rem] overflow-hidden flex flex-col h-full border-white/5 bg-white/2 ${isLate ? 'ring-2 ring-pink-500/30' : ''}`}
    >
      <div className={`p-6 flex justify-between items-start ${order.status === "PENDIENTE" ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mesa / Hab.</p>
          <h4 className="text-2xl font-black text-white">{order.roomNumber || "SALÓN"}</h4>
        </div>
        <div className="flex flex-col items-end">
          <div className={`flex items-center space-x-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${isLate ? 'bg-pink-500/20 text-pink-400' : 'bg-white/5 text-zinc-500'}`}>
            <Timer size={10} />
            <span>{timeElapsed}m</span>
          </div>
          <p className="text-[8px] text-zinc-600 mt-2 font-mono uppercase">{order.id.slice(-6)}</p>
        </div>
      </div>

      <div className="p-6 grow space-y-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-white/2 p-3 rounded-2xl border border-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-sm">
                {item.quantity}
              </div>
              <p className="text-xs font-bold text-white uppercase tracking-tight">{item.menuItem.name}</p>
            </div>
            <div className="text-[8px] font-black text-zinc-700">QTY x{item.quantity}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/1 mt-auto border-t border-white/5">
        <button 
          onClick={onNext}
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-2 transition-all transform active:scale-95 ${
            order.status === "PENDIENTE" 
              ? 'bg-amber-500 text-black hover:bg-amber-400' 
              : 'bg-emerald-500 text-black hover:bg-emerald-400'
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <span>{order.status === "PENDIENTE" ? "Empezar a cocinar" : "Listo para servir"}</span>
              <ChevronRight size={14} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
