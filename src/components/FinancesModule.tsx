"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Droplet, 
  Home, 
  Users, 
  Plus, 
  PieChart,
  ArrowUpRight,
  Loader2,
  FileDown,
  History,
  Calendar as CalendarIcon
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { getFinancialSummary, createExpense, getExpenses } from "@/app/actions/expense";
import { FinancialSummary, Expense } from "@/types";

/**
 * Módulo de Finanzas: Proporciona una vista consolidada de los ingresos,
 * gastos operativos y valor del inventario del establecimiento.
 * Permite la visualización de un resumen financiero y un desglose detallado de gastos.
 */
export function FinancesModule() {
  const { hotelId, role } = useAura();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  const loadFinancials = useCallback(async () => {
    if (!hotelId) return;
    setLoading(true);
    
    const [summaryRes, expensesRes] = await Promise.all([
      getFinancialSummary(hotelId),
      getExpenses(hotelId)
    ]);

    if (summaryRes.success && summaryRes.data) {
      setSummary(summaryRes.data);
    }
    
    if (expensesRes.success && expensesRes.data) {
      setExpenses(expensesRes.data);
    }

    setLoading(false);
  }, [hotelId]);

  const handleExportPDF = () => {
    window.print();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) {
        await loadFinancials();
      }
    })();
    return () => { mounted = false; };
  }, [loadFinancials]);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (role !== "ADMIN" && role !== "GERENTE") {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
          <TrendingDown size={32} />
        </div>
        <h3 className="text-xl font-bold font-outfit">Acceso Restringido</h3>
        <p className="text-muted text-sm max-w-xs">Unicamente el Administrador o Gerente pueden visualizar los reportes financieros detallados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 print-area">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinCard 
          title="Facturación Bruta" 
          value={`$${summary?.revenue.toLocaleString()}`} 
          icon={TrendingUp} 
          trend="up"
          color="emerald"
        />
        <FinCard 
          title="Gastos Operativos" 
          value={`$${summary?.totalExpenses.toLocaleString()}`} 
          icon={TrendingDown} 
          trend="down"
          color="pink"
        />
        <FinCard 
          title="Valor Inventario" 
          value={`$${summary?.inventoryValue.toLocaleString()}`} 
          icon={Zap} 
          trend="neutral"
          color="blue"
        />
        <FinCard 
          title="Utilidad Neta" 
          value={`$${summary?.netProfit.toLocaleString()}`} 
          icon={PieChart} 
          trend={summary?.netProfit && summary.netProfit > 0 ? "up" : "down"}
          color="indigo"
          highlight
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expenses Form / Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-white/2 h-full">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-6">Acciones Rápidas</h3>
            <button 
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-3 uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(255,56,92,0.3)]"
            >
              <Plus size={18} />
              <span>Registrar Gasto</span>
            </button>
            <div className="mt-8 space-y-4">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">Sugerencias de Gasto</p>
              <QuickExpenseButton label="Recibo de Luz" icon={Zap} />
              <QuickExpenseButton label="Factura de Agua" icon={Droplet} />
              <QuickExpenseButton label="Renta del Local" icon={Home} />
              <QuickExpenseButton label="Pago de Nómina" icon={Users} />
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 no-print">
              <button 
                onClick={handleExportPDF}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-3 uppercase tracking-widest text-[10px] transition-all border border-white/5"
              >
                <FileDown size={16} />
                <span>Descargar Reporte PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2 overflow-hidden flex flex-col h-full">
           <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-white/1 h-full overflow-hidden flex flex-col min-h-[460px]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <History size={20} />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Registro de Gastos</h3>
                </div>
                <div className="no-print hidden sm:block">
                  <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-white/2 px-4 py-2 rounded-full border border-white/5">
                    Historial Operativo
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                      <th className="pb-4 pl-2">Fecha</th>
                      <th className="pb-4">Concepto</th>
                      <th className="pb-4 hidden md:table-cell">Categoría</th>
                      <th className="pb-4 text-right pr-2">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {expenses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-24 text-center">
                          <p className="text-zinc-700 italic text-xs font-medium">Sin movimientos registrados</p>
                          <p className="text-[10px] text-zinc-800 mt-1 uppercase tracking-widest leading-none font-bold">Inicia registrando tu primer gasto</p>
                        </td>
                      </tr>
                    ) : expenses.map((exp: Expense) => (
                      <tr key={exp.id} className="group transition-all hover:translate-x-1">
                        <td className="py-4 pl-3 bg-white/2 rounded-l-2xl border-y border-l border-white/5">
                          <div className="flex items-center space-x-2 text-zinc-500 font-bold text-[10px]">
                            <CalendarIcon size={12} className="opacity-40" />
                            <span>{new Date(exp.date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-4 bg-white/2 border-y border-white/5">
                          <span className="text-white font-black text-[11px] uppercase tracking-tight line-clamp-1">{exp.description}</span>
                        </td>
                        <td className="py-4 bg-white/2 border-y border-white/5 hidden md:table-cell">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-3 bg-white/2 rounded-r-2xl border-y border-r border-white/5">
                          <span className="text-[#FF385C] font-black text-xs tracking-tighter">${exp.amount.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5 no-print">
                <div className="flex items-center space-x-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest italic">
                     Libro General de Gastos
                   </p>
                </div>
                <ArrowUpRight size={14} className="text-zinc-800" />
              </div>
           </div>
        </div>
      </div>

      <AddExpenseModal 
        isOpen={isAddExpenseModalOpen} 
        onClose={() => setIsAddExpenseModalOpen(false)} 
        onSuccess={loadFinancials}
        hotelId={hotelId || ""}
      />

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 2rem !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .glass {
            background: white !important;
            border: 1px solid #eee !important;
            color: black !important;
            box-shadow: none !important;
            filter: none !important;
          }
          .text-white {
            color: black !important;
          }
          .text-zinc-500, .text-zinc-700, .text-zinc-600 {
            color: #666 !important;
          }
          .bg-primary {
            background: black !important;
          }
          table, tr, td, th {
             border-color: #eee !important;
             color: black !important;
          }
        }
      `}</style>
    </div>
  );
}

function FinCard({ title, value, icon: Icon, trend, color, highlight }: { title: string, value: string, icon: React.ElementType, trend: string, color: string, highlight?: boolean }) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-400/10",
    pink: "text-[#FF385C] bg-[#FF385C]/10 border-[#FF385C]/20",
    blue: "text-blue-400 bg-blue-400/10",
    indigo: "text-indigo-400 bg-indigo-400/10",
  };

  return (
    <div className={`glass p-8 rounded-[2.5rem] border-white/5 transition-all hover:scale-[1.02] ${highlight ? 'bg-white/5 border-white/10 ring-1 ring-white/10' : 'bg-white/2'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : trend === 'down' ? 'text-pink-500 bg-pink-500/10' : 'text-zinc-500 bg-zinc-500/10'}`}>
          {trend === 'up' ? '↑ Sólido' : trend === 'down' ? '↓ Gasto' : '• Estable'}
        </div>
      </div>
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1 italic px-1">{title}</p>
      <h4 className="text-3xl font-black text-white tracking-tighter">{value}</h4>
    </div>
  );
}

function QuickExpenseButton({ label, icon: Icon }: { label: string, icon: React.ElementType }) {
  return (
    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/2 hover:bg-white/5 border border-white/5 transition-all group text-left">
      <div className="flex items-center space-x-3">
        <Icon size={16} className="text-zinc-600 group-hover:text-primary transition-colors" />
        <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-tight">{label}</span>
      </div>
      <ArrowUpRight size={14} className="text-zinc-800 group-hover:text-zinc-400 transition-colors" />
    </button>
  );
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  onSuccess: () => void;
}

function AddExpenseModal({ isOpen, onClose, hotelId, onSuccess }: AddExpenseModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("LUZ");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || isSubmitting) return;
    setIsSubmitting(true);
    const res = await createExpense(hotelId, {
      description,
      amount: parseFloat(amount),
      category
    });
    if (res.success) {
      onSuccess();
      onClose();
      setDescription("");
      setAmount("");
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass p-1 rounded-[3rem] border-white/10"
          >
            <div className="bg-[#0A0A0A] p-10 rounded-[2.8rem] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Registrar Gasto</h3>
                <div onClick={onClose} className="p-2 bg-white/5 rounded-full cursor-pointer hover:bg-white/10 text-zinc-500">
                   <Plus className="rotate-45" size={20} />
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Concepto</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-primary transition-all"
                    placeholder="Ej. Pago de Luz Marzo"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Monto ($)</label>
                    <input 
                      type="number"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-primary transition-all"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Categoría</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-primary transition-all appearance-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="LUZ">Luz</option>
                      <option value="AGUA">Agua</option>
                      <option value="RENTA">Renta</option>
                      <option value="NOMINA">Nómina</option>
                      <option value="INSUMOS">Insumos</option>
                      <option value="OTROS">Otros</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary py-5 rounded-2xl text-white font-black uppercase tracking-widest text-xs mt-4 flex items-center justify-center shadow-[0_10px_30px_rgba(255,56,92,0.3)] hover:translate-y-[-2px] active:translate-y-px transition-all"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Confirmar Gasto"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
