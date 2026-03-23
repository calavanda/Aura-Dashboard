"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Building2, 
  Store, 
  Home, 
  Save, 
  RefreshCcw,
  Bell,
  Lock,
  Globe,
  Camera,
  ShieldCheck,
  Zap,
  Ticket,
  Sparkles
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { generateConnectionCodeAction } from "@/app/actions/aura";

export function SettingsModule() {
  const { hotelConfig, hotelId, subscription, connectionCode, refreshData, applyMasterKey } = useAura();
  const [saving, setSaving] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [masterKey, setMasterKey] = useState("");
  const [masterStatus, setMasterStatus] = useState<{ success?: boolean, error?: string }>({});
  
  const [formData, setFormData] = useState({
    name: hotelConfig?.name || "",
    type: hotelConfig?.type || "Hotel",
    notifications: true,
    publicWeb: true
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate server action
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
  };

  const handleGenerateCode = async () => {
    if (!hotelId) return;
    setGeneratingCode(true);
    await generateConnectionCodeAction(hotelId);
    await refreshData();
    setGeneratingCode(false);
  };

  const handleApplyMasterKey = async () => {
    const res = await applyMasterKey(masterKey);
    setMasterStatus(res);
    if (res.success) {
        setMasterKey("");
        setTimeout(() => setMasterStatus({}), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-bold font-outfit text-foreground tracking-tight">Configuración</h3>
          <p className="text-muted text-sm mt-2">Gestiona el perfil de tu establecimiento y preferencias.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass p-8 rounded-[40px] space-y-6">
            <h4 className="text-lg font-bold font-outfit flex items-center gap-2">
              <Building2 size={20} className="text-primary" />
              Detalles del Establecimiento
            </h4>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center text-muted relative group overflow-hidden">
                    <Camera size={24} className="group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-white uppercase">Cambiar</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Nombre Comercial</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-accent/30 border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Tipo de Propiedad</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'Hotel', icon: Building2 },
                      { id: 'Hostal', icon: Store },
                      { id: 'Vivienda', icon: Home }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({...formData, type: type.id})}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                          formData.type === type.id 
                            ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' 
                            : 'bg-accent/30 border-border text-muted hover:border-muted'
                        }`}
                      >
                        <type.icon size={20} />
                        <span className="text-[10px] font-bold uppercase">{type.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] space-y-6">
            <h4 className="text-lg font-bold font-outfit flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Preferencias Aura
            </h4>
            <div className="space-y-4 font-outfit">
              <ToggleRow 
                icon={Bell} 
                title="Notificaciones de Reserva" 
                desc="Recibe alertas inmediatas en el dashboard." 
                active={formData.notifications}
                onToggle={() => setFormData({...formData, notifications: !formData.notifications})}
              />
              <ToggleRow 
                icon={Globe} 
                title="Sincronización Web Pública" 
                desc="Permitir que la plantilla externa reciba datos." 
                active={formData.publicWeb}
                onToggle={() => setFormData({...formData, publicWeb: !formData.publicWeb})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[40px] bg-primary/5 border-primary/20">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-background mb-6 shadow-lg shadow-primary/20">
              <Zap size={24} />
            </div>
            <h4 className="text-xl font-bold font-outfit mb-2">Plan {subscription}</h4>
            <p className="text-xs text-muted mb-6 leading-relaxed">
              Tu hotel está operando bajo el nivel <span className="font-bold text-primary">{subscription}</span>.
            </p>
            {subscription === "BASIC" && (
              <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mb-3">
                <Sparkles size={16} />
                Mejorar a PRO
              </button>
            )}
            <div className="p-4 bg-background/50 rounded-2xl border border-border/50">
               <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Status de la Licencia</p>
               <div className="flex items-center gap-2 text-emerald-500">
                  <ShieldCheck size={14} />
                  <span className="text-xs font-bold">Activa</span>
               </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] space-y-4">
             <div className="flex items-center gap-3 text-primary mb-2">
               <Ticket size={18} />
               <h5 className="text-[10px] font-bold uppercase tracking-widest">Aura Connection Code</h5>
             </div>
             <p className="text-[10px] text-muted leading-relaxed">
               Usa este código en tu sitio web para enlazarlo con este Dashboard.
             </p>
             
             <div className="bg-accent/50 p-4 rounded-2xl border border-dashed border-primary/30 text-center font-mono text-lg font-bold tracking-widest text-primary">
               {connectionCode || "--------"}
             </div>

             <button 
              onClick={handleGenerateCode}
              disabled={generatingCode || subscription === "BASIC"}
              className="w-full text-[10px] font-bold text-primary hover:underline uppercase tracking-widest disabled:opacity-30 disabled:no-underline"
             >
               {generatingCode ? "Generando..." : connectionCode ? "Regenerar Código" : "Generar Código"}
             </button>
             
             {subscription === "BASIC" && (
               <p className="text-[9px] text-amber-500 text-center font-bold">
                 Requiere plan ENTERPRISE
               </p>
             )}
          </div>

          <div className="glass p-8 rounded-[40px] space-y-4">
             <div className="flex items-center gap-3 text-amber-500 mb-2">
               <Lock size={18} />
               <h5 className="text-[10px] font-bold uppercase tracking-widest">Seguridad y Licencia</h5>
             </div>
             
             <div className="space-y-4">
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Activar Aura Master Key</p>
                <div className="flex gap-2">
                    <input 
                        type="password" 
                        placeholder="••••••••••••"
                        value={masterKey}
                        onChange={(e) => setMasterKey(e.target.value)}
                        className="flex-1 bg-white/5 border border-border/50 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <button 
                        onClick={handleApplyMasterKey}
                        className="bg-foreground text-background px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                    >
                        Aplicar
                    </button>
                </div>
                {masterStatus.error && <p className="text-[9px] text-rose-500 font-bold">{masterStatus.error}</p>}
                {masterStatus.success && <p className="text-[9px] text-emerald-500 font-bold">¡Dashboard Desbloqueado Exitosamente!</p>}
             </div>

             <div className="pt-4 border-t border-border/20">
                <p className="text-[10px] text-muted">ID del Hotel: <span className="font-mono">{hotelId}</span></p>
                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest mt-2">Restablecer API Secret</button>
             </div>
          </div>

          <div className="flex p-4">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-foreground text-background font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {saving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? 'Guardando...' : 'Aplicar Configuración'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, title, desc, active, onToggle }: { icon: any, title: string, desc: string, active: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-[24px] hover:bg-accent/30 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-muted group-hover:text-primary transition-colors">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="text-[10px] text-muted">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${active ? 'bg-primary' : 'bg-muted'}`}
      >
        <div className={`w-4 h-4 bg-background rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export default SettingsModule;
