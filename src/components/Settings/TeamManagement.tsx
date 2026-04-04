"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  Trash2, 
  Loader2, 
  CheckCircle2,
  X,
  AlertCircle
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { getBusinessTeam, addTeamMember, removeTeamMember } from "@/app/actions/aura";
import { Role, User } from "@/types";

export function TeamManagement() {
  const { hotelId } = useAura();
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const loadTeam = useCallback(async () => {
    if (!hotelId) return;
    setLoading(true);
    const res = await getBusinessTeam(hotelId);
    if (res.success) {
      setTeam((res.users as User[]) || []);
    }
    setLoading(false);
  }, [hotelId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) {
        await loadTeam();
      }
    })();
    return () => { mounted = false; };
  }, [loadTeam]);

  const handleRemove = async (userId: string) => {
    if (!confirm("¿Estás seguro de eliminar a este empleado? Perderá el acceso de inmediato.")) return;
    const res = await removeTeamMember(userId);
    if (res.success) {
      loadTeam();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-bold font-outfit flex items-center gap-2">
          <Users size={24} className="text-primary" />
          Gestión de Equipo
        </h4>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
        >
          <UserPlus size={16} />
          Agregar Empleado
        </button>
      </div>

      <div className="glass rounded-[40px] overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-sm text-muted">Cargando equipo...</p>
          </div>
        ) : team.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto text-muted">
              <Users size={32} />
            </div>
            <p className="text-muted text-sm">No hay empleados registrados aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Correo Electrónico</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Rol / Permiso</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Estado</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted text-xs font-bold">
                          {member.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-white">{member.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 w-fit">
                        <Shield size={12} className="text-primary" />
                        <span className="text-[10px] font-black uppercase text-zinc-400">{member.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {member.clerkId ? (
                        <div className="flex items-center gap-2 text-emerald-500">
                          <CheckCircle2 size={14} />
                          <span className="text-[10px] font-black uppercase">Activo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-500">
                          <Loader2 size={14} className="animate-spin" />
                          <span className="text-[10px] font-black uppercase">Pendiente</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {member.role !== "ADMIN" && (
                        <button 
                          onClick={() => handleRemove(member.id)}
                          className="p-2 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InviteModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onSuccess={loadTeam}
        hotelId={hotelId || ""}
      />
    </div>
  );
}

function InviteModal({ isOpen, onClose, onSuccess, hotelId }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, hotelId: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("MESERO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    
    const res = await addTeamMember(hotelId, email, role);
    if (res.success) {
      onSuccess();
      onClose();
      setEmail("");
    } else {
      setError(res.error || "Error al invitar");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden shadow-primary/10"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <UserPlus className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-outfit">Nuevo Empleado</h3>
                    <p className="text-xs text-muted">Añade a alguien a tu equipo Aura</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <X size={20} className="text-zinc-500" />
                </button>
              </div>

              <form onSubmit={handleInvite} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="empleado@restaurante.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Rol / Permisos</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "GERENTE", label: "Gerente", desc: "Todo menos finanzas avanzadas" },
                      { id: "CAJERO", label: "Cajero", desc: "Ventas y pedidos" },
                      { id: "MESERO", label: "Mesero", desc: "Solo tomar pedidos" },
                      { id: "COCINERO", label: "Chef", desc: "Solo pantalla de cocina" }
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setRole(r.id as Role)}
                        className={`p-4 rounded-3xl border text-left transition-all ${
                          role === r.id 
                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" 
                            : "bg-white/2 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Shield size={14} className={role === r.id ? "text-primary" : "text-zinc-600"} />
                          <span className={`text-[10px] font-black uppercase ${role === r.id ? "text-white" : "text-zinc-400"}`}>{r.label}</span>
                        </div>
                        <p className="text-[8px] text-zinc-500 leading-tight uppercase font-medium">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500">
                    <AlertCircle size={18} />
                    <p className="text-[10px] font-bold uppercase">{error}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                  Invitar al Equipo
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
