"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Search, ClipboardList, Hash, ShoppingBag, Loader2, Check } from "lucide-react";
import { processOrder } from "@/app/actions/restaurant";
import { Restaurant, MenuItem } from "@/types";
import { useI18n } from "@/context/I18nContext";
import { clsx } from "clsx";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  hotelId: string;
  onSuccess: () => void;
}

export function AddOrderModal({ isOpen, onClose, restaurants, hotelId, onSuccess }: AddOrderModalProps) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [basket, setBasket] = useState<Record<string, { item: MenuItem, quantity: number }>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Flatten all menu items from all restaurants
  const allMenuItems = useMemo(() => {
    const items: MenuItem[] = [];
    restaurants.forEach(rest => {
      rest.categories?.forEach(cat => {
        cat.items?.forEach(item => {
          items.push(item);
        });
      });
    });
    return items;
  }, [restaurants]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return allMenuItems.slice(0, 8);
    return allMenuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);
  }, [allMenuItems, searchTerm]);

  const updateQuantity = (item: MenuItem, delta: number) => {
    setBasket(prev => {
      const current = prev[item.id] || { item, quantity: 0 };
      const newQuantity = Math.max(0, current.quantity + delta);
      
      if (newQuantity === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [item.id]: removedItem, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [item.id]: { item, quantity: newQuantity }
      };
    });
  };

  const basketTotal = useMemo(() => {
    return Object.values(basket).reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0);
  }, [basket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(basket).length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const orderItems = Object.values(basket).map(entry => ({
        menuItemId: entry.item.id,
        quantity: entry.quantity,
        price: entry.item.price
      }));

      const res = await processOrder(hotelId, {
        roomNumber: roomNumber || "Salón",
        items: orderItems,
        total: basketTotal,
        paymentMethod: "EFECTIVO" // Default for manual orders
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setBasket({});
          setRoomNumber("");
          setSearchTerm("");
          setIsSubmitting(false);
          setIsSuccess(false);
          onSuccess();
          onClose();
        }, 1500);
      } else {
        alert(res.error || "Error creating order");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
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
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-60"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40, rotateX: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl glass border-white/10 p-1 rounded-[45px] z-70 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="bg-[#0A0A0A]/90 p-10 rounded-[40px] relative overflow-hidden flex flex-col md:flex-row gap-10">
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="absolute inset-0 z-50 bg-[#3B82F6]/10 backdrop-blur-xl flex flex-col items-center justify-center space-y-4"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                    >
                      <Check className="text-white" size={40} />
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-white font-black uppercase tracking-[0.3em] font-institutional text-sm"
                    >
                      {t("common.saved")}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Left Side: Selection */}
              <div className="flex-1 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black font-institutional text-white flex items-center uppercase tracking-tighter italic">
                      <ClipboardList className="mr-3 text-[#3B82F6] stroke-[3px]" size={28} /> {t("rest.order.new")}
                    </h2>
                    <div className="w-12 h-1 bg-[#3B82F6] rounded-full" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#3B82F6] transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar platillos..."
                      className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-black focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] outline-none transition-all placeholder:text-zinc-800 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                    {filteredItems.map(item => (
                      <div 
                        key={item.id} 
                        className={clsx(
                          "glass p-4 rounded-3xl border-white/5 transition-all group flex justify-between items-center",
                          basket[item.id] ? "bg-[#3B82F6]/10 border-[#3B82F6]/30" : "hover:bg-white/5"
                        )}
                      >
                        <div className="flex-1">
                          <p className="text-xs font-black text-white uppercase truncate">{item.name}</p>
                          <p className="text-[9px] font-bold text-[#10b981]">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                           <button 
                             onClick={() => updateQuantity(item, -1)}
                             className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                           >
                             <Minus size={12} />
                           </button>
                           <span className={clsx("text-xs font-black w-4 text-center", basket[item.id] ? "text-[#3B82F6]" : "text-zinc-600")}>
                             {basket[item.id]?.quantity || 0}
                           </span>
                           <button 
                             onClick={() => updateQuantity(item, 1)}
                             className="w-7 h-7 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white shadow-lg shadow-[#3B82F6]/20 transition-transform active:scale-90"
                           >
                             <Plus size={12} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Basket Summary */}
              <div className="w-full md:w-80 space-y-8 flex flex-col">
                <div className="flex justify-end">
                   <button 
                    onClick={onClose}
                    className="p-3 hover:bg-white/5 rounded-2xl transition-all text-zinc-500 hover:text-white group"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                <div className="glass bg-white/2 rounded-[35px] p-6 border-white/5 flex-1 flex flex-col">
                  <div className="flex items-center space-x-3 mb-6">
                    <ShoppingBag size={18} className="text-[#3B82F6]" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Resumen Orden</h3>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide mb-6">
                    {Object.values(basket).map(entry => (
                      <div key={entry.item.id} className="flex justify-between items-center text-[11px]">
                         <div className="flex flex-col">
                           <span className="font-black text-white uppercase">{entry.item.name}</span>
                           <span className="text-[9px] text-zinc-600 font-bold">{entry.quantity} x ${entry.item.price}</span>
                         </div>
                         <span className="font-black text-white">${entry.item.price * entry.quantity}</span>
                      </div>
                    ))}
                    {Object.keys(basket).length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                        <ShoppingBag size={40} className="mb-4" />
                        <p className="text-[9px] font-black uppercase">Carrito Vacío</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="space-y-1">
                       <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest ml-2">Mesa o Habitación</label>
                       <div className="relative">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                          <input 
                            type="text" 
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            placeholder="Ej. Mesa 4 o Hab 101"
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs text-white font-black focus:border-[#3B82F6] transition-all outline-none"
                          />
                       </div>
                    </div>

                    <div className="flex justify-between items-end mb-4">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total</span>
                      <span className="text-3xl font-black text-white font-institutional">${basketTotal}</span>
                    </div>

                    <button 
                      onClick={handleSubmit}
                      disabled={Object.keys(basket).length === 0 || isSubmitting}
                      className="w-full relative overflow-hidden group/order-btn rounded-2xl disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-[#3B82F6] opacity-100 group-hover/order-btn:scale-110 transition-transform duration-500" />
                      <div className="relative py-4 text-white font-black flex items-center justify-center space-x-2 uppercase tracking-widest text-[10px]">
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (
                          <>
                            <Check size={16} />
                            <span>CONFIRMAR COMANDA</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
