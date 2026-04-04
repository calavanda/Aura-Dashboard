"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useI18n, Translations } from "@/context/I18nContext";
import { useAura } from "@/context/AuraContext";
import { getRestaurantData, updateOrderStatus } from "@/app/actions/restaurant";
import { 
  Utensils, 
  Plus, 
  Search, 
  ClipboardList, 
  Package, 
  ChefHat, 
  Clock, 
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { Restaurant, Order, InventoryItem, MenuCategory, MenuItem, OrderItem } from "@/types";
import { AddOrderModal } from "./Restaurant/AddOrderModal";
import { AddMenuItemModal } from "./Restaurant/AddMenuItemModal";
import { AddInventoryItemModal } from "./Restaurant/AddInventoryItemModal";
import { KDSModule } from "./Restaurant/KDSModule";
import { CreateRestaurantModal } from "./Restaurant/CreateRestaurantModal";

export function RestaurantModule() {
  const { t } = useI18n();
  const { hotelId, refreshData, role } = useAura();
  
  // Set default tab based on role
  const [activeTab, setActiveTab] = useState(() => {
    if (role === "COCINERO") return "KDS";
    if (role === "MESERO") return "ORDERS";
    return "ORDERS";
  });

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [restaurantData, setRestaurantData] = useState<{
    restaurants: Restaurant[];
    activeOrders: Order[];
    inventory: InventoryItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isCreateRestaurantModalOpen, setIsCreateRestaurantModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!hotelId) return;
    setLoading(true);
    try {
      const res = await getRestaurantData(hotelId, selectedRestaurantId || undefined);
      if (res.success && res.data) {
        setRestaurantData({
          restaurants: res.data.restaurants,
          activeOrders: res.data.activeOrders || [],
          inventory: res.data.inventory || []
        });
      }
    } finally {
      setLoading(false);
      refreshData();
    }
  }, [hotelId, selectedRestaurantId, refreshData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-select first restaurant once data is loaded
  useEffect(() => {
    if (!selectedRestaurantId && restaurantData && restaurantData.restaurants.length > 0) {
      setSelectedRestaurantId(restaurantData.restaurants[0].id);
    }
  }, [selectedRestaurantId, restaurantData]);

  const tabs = [
    { id: "ORDERS", label: t("rest.tab.orders"), icon: ClipboardList, roles: ["ADMIN", "GERENTE", "CAJERO", "MESERO"] },
    { id: "MENU", label: t("rest.tab.menu"), icon: Utensils, roles: ["ADMIN", "GERENTE", "COCINERO", "CAJERO"] },
    { id: "INVENTORY", label: t("rest.tab.inventory"), icon: Package, roles: ["ADMIN", "GERENTE", "COCINERO"] },
    { id: "KDS", label: "Cocina (KDS)", icon: ChefHat, roles: ["ADMIN", "GERENTE", "COCINERO"] },
  ].filter(tab => !role || tab.roles.includes(role));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div>
            <h3 className="text-4xl font-black tracking-tighter text-white font-institutional">{t("rest.title")}</h3>
            <p className="text-zinc-500 text-[10px] uppercase font-institutional tracking-[0.3em] font-black mt-2">
              {t("rest.subtitle")}
            </p>
          </div>
          
          {/* Restaurant Selector */}
          {restaurantData?.restaurants && restaurantData.restaurants.length > 1 && (
            <div className="flex gap-2 p-1.5 glass rounded-2xl border border-white/5 ml-0 md:ml-4">
              {restaurantData.restaurants.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRestaurantId(r.id)}
                  className={clsx(
                    "px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all",
                    selectedRestaurantId === r.id 
                      ? "bg-white/10 text-white border border-white/10" 
                      : "text-zinc-500 hover:text-white"
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#0A0A0A]/80 backdrop-blur-md p-1.5 rounded-full border border-white/5 shadow-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 font-institutional flex items-center space-x-2 relative overflow-hidden group",
                activeTab === tab.id 
                  ? "text-white bg-[#FF385C] shadow-[0_0_20px_rgba(255,56,92,0.4)]" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon size={12} className={clsx("transition-transform group-hover:scale-110", activeTab === tab.id ? "text-white" : "text-zinc-500")} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#FF385C]/20 border-t-[#FF385C] rounded-full animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "KDS" && (
             <motion.div key="kds" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
               <KDSModule 
                 restaurantId={selectedRestaurantId} 
                 orders={restaurantData?.activeOrders} 
                 onRefresh={loadData} 
               />
             </motion.div>
          )}

          {activeTab === "ORDERS" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
              <div className="xl:col-span-2 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] font-institutional">
                    {t("rest.tab.orders")} ACTIVOS
                  </h4>
                  {(role === "ADMIN" || role === "GERENTE" || role === "CAJERO" || role === "MESERO") && (
                    <button 
                      onClick={() => setIsOrderModalOpen(true)}
                      className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center shadow-[0_0_15px_rgba(59,130,246,0.3)] transition group"
                    >
                      <Plus size={12} className="mr-2 group-hover:rotate-90 transition-transform" /> {t("rest.order.new")}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {restaurantData?.activeOrders && restaurantData.activeOrders.length > 0 ? (
                    restaurantData.activeOrders.map((order: Order) => (
                      <OrderCard key={order.id} order={order} t={t} onUpdateStatus={loadData} />
                    ))
                  ) : (
                    <div className="col-span-full h-64 glass rounded-4xl border-white/5 flex flex-col items-center justify-center text-center opacity-40">
                      <ClipboardList size={40} className="text-zinc-600 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">No hay pedidos activos</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] font-institutional mb-4">
                  RESUMEN DE COCINA
                </h4>
                <div className="glass rounded-4xl p-6 border-white/5 bg-white/1 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#FF385C]/10 flex items-center justify-center">
                          <ChefHat className="text-[#FF385C]" size={20} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-500">En Preparación</p>
                          <p className="text-2xl font-black text-white">{restaurantData?.activeOrders?.filter((o: Order) => o.status === "PREPARANDO").length || 0}</p>
                        </div>
                      </div>
                      <TrendingUp size={16} className="text-[#10b981]" />
                   </div>
                   <div className="w-full h-px bg-white/5" />
                   <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center">
                          <Clock className="text-[#3B82F6]" size={20} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-500">Pendientes</p>
                          <p className="text-2xl font-black text-white">{restaurantData?.activeOrders?.filter((o: Order) => o.status === "PENDIENTE").length || 0}</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="glass rounded-4xl p-6 border-[#FF385C]/20 bg-[#FF385C]/5 space-y-4">
                  <div className="flex items-center space-x-2 text-[#FF385C]">
                    <AlertTriangle size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{t("rest.inventory.low")}</span>
                  </div>
                  {restaurantData?.inventory && restaurantData.inventory.filter((i: InventoryItem) => i.quantity <= i.threshold).length > 0 ? (
                    restaurantData.inventory.filter((i: InventoryItem) => i.quantity <= i.threshold).map((item: InventoryItem) => (
                      <div key={item.id} className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black text-white uppercase">{item.name}</span>
                        <span className="text-[10px] font-black text-[#FF385C]">{item.quantity} {item.unit}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[8px] font-bold text-zinc-500 uppercase">Todo el inventario está en niveles óptimos.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "MENU" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div className="relative w-1/3">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={12} className="text-zinc-500" />
                  </div>
                  <input type="text" placeholder="Buscar en el menú..." className="w-full bg-[#0A0A0A] border border-white/5 rounded-full py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-white/20 transition-all font-bold" />
                </div>
                {(role === "ADMIN" || role === "GERENTE" || role === "COCINERO") && (
                  <button 
                    onClick={() => setIsMenuModalOpen(true)}
                    className="bg-[#FF385C] hover:bg-[#FF385C]/90 text-white text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-full flex items-center shadow-[0_0_15px_rgba(255,56,92,0.4)] transition"
                  >
                    <Plus size={12} className="mr-2" /> {t("rest.menu.add")}
                  </button>
                )}
              </div>

              {restaurantData?.restaurants?.filter(r => !selectedRestaurantId || r.id === selectedRestaurantId).map((rest: Restaurant) => (
                <div key={rest.id} className="space-y-6">
                  <div className="flex items-center space-x-4 border-b border-white/5 pb-4">
                    <h5 className="text-xl font-black text-white tracking-tighter uppercase">{rest.name}</h5>
                    <span className="text-[9px] font-black text-zinc-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">{rest.type}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.categories?.map((cat: MenuCategory) => (
                      <div key={cat.id} className="space-y-4">
                        <h6 className="text-[10px] font-black text-[#FF385C] uppercase tracking-[0.2em]">{cat.name}</h6>
                        <div className="space-y-2">
                          {cat.items?.map((item: MenuItem) => (
                            <div key={item.id} className="glass p-4 rounded-3xl border-white/5 hover:bg-white/5 transition-all group">
                               <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm font-black text-white mb-1">{item.name}</p>
                                    <p className="text-[9px] text-zinc-500 line-clamp-1">{item.description}</p>
                                  </div>
                                  <p className="text-sm font-black text-[#10b981]">${item.price}</p>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "INVENTORY" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-4xl border-white/5 overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Control de Materia Prima</h3>
                {(role === "ADMIN" || role === "GERENTE" || role === "COCINERO") && (
                  <button 
                    onClick={() => setIsInventoryModalOpen(true)}
                    className="bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all border border-white/5 flex items-center gap-2"
                  >
                    <Plus size={12} /> Agregar Insumo
                  </button>
                )}
              </div>
              <table className="w-full text-left">
                <thead className="border-b border-white/5 bg-white/2">
                  <tr>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">{t("rest.inventory.stock")}</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Cantidad</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Unidad</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Umbral</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-black/20">
                  {restaurantData?.inventory?.map((item: InventoryItem) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 text-[11px] font-black text-white uppercase">{item.name}</td>
                      <td className="px-6 py-4 text-sm font-black text-white">{item.quantity}</td>
                      <td className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase">{item.unit}</td>
                      <td className="px-6 py-4 text-sm font-black text-zinc-500">{item.threshold}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={clsx(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                          item.quantity <= item.threshold ? "bg-[#FF385C]/10 text-[#FF385C] border border-[#FF385C]/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        )}>
                          {item.quantity <= item.threshold ? "Reponer" : "Estable"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Empty State when no restaurants exist */}
      {!loading && (!restaurantData?.restaurants || restaurantData.restaurants.length === 0) && (
        <div className="flex flex-col items-center justify-center p-20 glass rounded-4xl border-white/5 bg-white/1 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10 group">
            <Utensils size={40} className="text-[#FF385C] group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">
            {t("rest.restaurant.empty")}
          </h4>
          {(role === "ADMIN" || role === "GERENTE") && (
            <button 
              onClick={() => setIsCreateRestaurantModalOpen(true)}
              className="bg-[#FF385C] hover:bg-[#FF385C]/90 text-white text-[10px] font-black uppercase tracking-[0.3em] px-10 py-5 rounded-full shadow-[0_0_30px_rgba(255,56,92,0.4)] transition-all transform hover:scale-105 active:scale-95"
            >
              <Plus size={16} className="inline mr-2 mb-0.5" /> {t("rest.restaurant.create")}
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateRestaurantModal 
        isOpen={isCreateRestaurantModalOpen}
        onClose={() => setIsCreateRestaurantModalOpen(false)}
        hotelId={hotelId || ""}
        onSuccess={loadData}
      />

      <AddInventoryItemModal 
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        hotelId={hotelId || ""}
        restaurantId={selectedRestaurantId}
        onSuccess={loadData}
      />

      {restaurantData?.restaurants && restaurantData.restaurants.length > 0 && (
        <>
          <AddOrderModal 
            isOpen={isOrderModalOpen} 
            onClose={() => setIsOrderModalOpen(false)}
            restaurants={restaurantData.restaurants}
            hotelId={hotelId || ""}
            restaurantId={selectedRestaurantId || ""}
            onSuccess={loadData}
          />
          <AddMenuItemModal 
            isOpen={isMenuModalOpen}
            onClose={() => setIsMenuModalOpen(false)}
            restaurant={restaurantData.restaurants.find(r => r.id === selectedRestaurantId) || restaurantData.restaurants[0]}
            onSuccess={loadData}
          />
        </>
      )}
    </div>
  );
}

function OrderCard({ order, t, onUpdateStatus }: { order: Order, t: (key: keyof Translations) => string, onUpdateStatus: () => void }) {
  const statusColors: Record<string, string> = {
    "PENDIENTE": "text-[#FF385C] bg-[#FF385C]/10 border-[#FF385C]/20",
    "PREPARANDO": "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20",
    "SERVIDO": "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20",
  };

  const statusMap: Record<string, keyof Translations> = {
    "PENDIENTE": "rest.order.status.pending",
    "PREPARANDO": "rest.order.status.prep",
    "SERVIDO": "rest.order.status.served",
  };

  async function handleNextStatus() {
    const nextStatusOrder: Record<string, string> = {
      "PENDIENTE": "PREPARANDO",
      "PREPARANDO": "SERVIDO",
      "SERVIDO": "PAGADO"
    };
    const next = nextStatusOrder[order.status];
    if (next) {
      await updateOrderStatus(order.id, next);
      onUpdateStatus();
    }
  }

  return (
    <div className="glass p-6 rounded-4xl border-white/5 bg-[#080808] flex flex-col justify-between group hover:border-white/10 transition-all">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ClipboardList size={14} className="text-zinc-500" />
             </div>
             <div>
                <p className="text-[10px] font-black text-white uppercase tracking-wider">{t("rest.order.table")}: {order.roomNumber || "Salón"}</p>
                <p className="text-[7px] font-bold text-zinc-500 uppercase">{new Date(order.createdAt).toLocaleTimeString()}</p>
             </div>
          </div>
          <span className={clsx("px-2 py-0.5 rounded-full text-[8px] font-black uppercase border", statusColors[order.status])}>
            {t(statusMap[order.status])}
          </span>
        </div>

        <div className="space-y-2 mb-6">
          {order.items.map((item: OrderItem) => (
            <div key={item.id} className="flex justify-between text-[10px]">
              <span className="text-zinc-400 font-bold"><span className="text-[#FF385C] mr-1">{item.quantity}x</span> {item.menuItem.name}</span>
              <span className="text-white font-black">${item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <p className="text-xl font-black text-white">${order.total}</p>
        <button 
          onClick={handleNextStatus}
          className="flex items-center space-x-1 text-[#FF385C] hover:text-white transition-colors group"
        >
          <span className="text-[9px] font-black uppercase tracking-widest">Siguiente Paso</span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
