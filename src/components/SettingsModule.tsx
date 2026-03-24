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
  Sparkles,
  Trash2,
  Eraser,
  AlertTriangle
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { useI18n } from "@/context/I18nContext";
import { generateConnectionCodeAction } from "@/app/actions/aura";

export function SettingsModule() {
  const { hotelConfig, hotelId, subscription, connectionCode, refreshData, applyMasterKey, purgeData, updateHotel } = useAura();
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const [purging, setPurging] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [masterKey, setMasterKey] = useState("");
  const [masterStatus, setMasterStatus] = useState<{ success?: boolean, error?: string }>({});
  
  const [formData, setFormData] = useState({
    name: hotelConfig?.name || "",
    type: hotelConfig?.type || "Hotel",
    logoUrl: hotelConfig?.logoUrl || "",
    notifications: typeof window !== "undefined" ? localStorage.getItem("aura_prefs_notif") !== "false" : true,
    publicWeb: typeof window !== "undefined" ? localStorage.getItem("aura_prefs_sync") !== "false" : true
  });

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  
  const handleSave = async () => {
    setSaveStatus("saving");
    const res = await updateHotel({ name: formData.name, type: formData.type, logoUrl: formData.logoUrl });
    if (res.success) {
      if (typeof window !== "undefined") {
        localStorage.setItem("aura_prefs_notif", formData.notifications.toString());
        localStorage.setItem("aura_prefs_sync", formData.publicWeb.toString());
      }
      setSaveStatus("saved");
      await refreshData();
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
      alert("Error: " + res.error);
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(t("set.imgLimit"));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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

  const handlePurge = async (type: "RESERVATIONS" | "LOGS" | "ALL") => {
    const confirmMsg = type === "ALL" 
        ? t("set.purgeConfirmAll")
        : type === "RESERVATIONS" ? t("set.purgeConfirmRes") : t("set.purgeConfirmLogs");
    
    if (!window.confirm(confirmMsg)) return;
    
    setPurging(type);
    const res = await purgeData(type);
    if (res.success) {
        alert(t("set.purgeSuccess"));
    } else {
        alert(`Error: ${res.error}`);
    }
    setPurging(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-bold font-outfit text-foreground tracking-tight">{t("set.title")}</h3>
          <p className="text-muted text-sm mt-2">{t("set.desc")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass p-8 rounded-[40px] space-y-6">
            <h4 className="text-lg font-bold font-outfit flex items-center gap-2">
              <Building2 size={20} className="text-primary" />
              {t("set.details")}
            </h4>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <label className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center text-muted relative group overflow-hidden cursor-pointer border border-border">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {formData.logoUrl ? (
                       <img src={formData.logoUrl} alt="Hotel Logo" className="w-full h-full object-cover" />
                    ) : (
                       <Camera size={24} className="group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-white uppercase">{t("set.change")}</span>
                    </div>
                  </label>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">{t("set.bizName")}</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-accent/30 border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">{t("set.propType")}</label>
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
              {t("set.prefs")}
            </h4>
            <div className="space-y-4 font-outfit">
              <ToggleRow 
                icon={Bell} 
                title={t("set.notif")} 
                desc={t("set.notifDesc")} 
                active={formData.notifications}
                onToggle={() => setFormData({...formData, notifications: !formData.notifications})}
              />
              <ToggleRow 
                icon={Globe} 
                title={t("set.sync")} 
                desc={t("set.syncDesc")} 
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
            <h4 className="text-xl font-bold font-outfit mb-2">{t("set.plan")} {subscription}</h4>
            <p className="text-xs text-muted mb-6 leading-relaxed">
              {t("set.planDesc")} <span className="font-bold text-primary">{subscription}</span>.
            </p>
            {subscription === "BASIC" && (
              <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mb-3">
                <Sparkles size={16} />
                {t("set.upgrade")}
              </button>
            )}
            <div className="p-4 bg-background/50 rounded-2xl border border-border/50">
               <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">{t("set.licStatus")}</p>
               <div className="flex items-center gap-2 text-emerald-500">
                  <ShieldCheck size={14} />
                  <span className="text-xs font-bold">{t("set.active")}</span>
               </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] space-y-4">
             <div className="flex items-center gap-3 text-primary mb-2">
               <Ticket size={18} />
               <h5 className="text-[10px] font-bold uppercase tracking-widest">Aura Connection Code</h5>
             </div>
             <p className="text-[10px] text-muted leading-relaxed">
               {t("set.connDesc")}
             </p>
             
             <div className="bg-accent/50 p-4 rounded-2xl border border-dashed border-primary/30 text-center font-mono text-lg font-bold tracking-widest text-primary">
               {connectionCode || "--------"}
             </div>

             <button 
              onClick={handleGenerateCode}
              disabled={generatingCode || subscription === "BASIC"}
              className="w-full text-[10px] font-bold text-primary hover:underline uppercase tracking-widest disabled:opacity-30 disabled:no-underline"
             >
               {generatingCode ? t("set.generating") : connectionCode ? t("set.regen") : t("set.generate")}
             </button>
             
             {subscription === "BASIC" && (
               <p className="text-[9px] text-amber-500 text-center font-bold">
                 {t("set.reqEnterprise")}
               </p>
             )}
          </div>

          <div className="glass p-8 rounded-[40px] space-y-4">
             <div className="flex items-center justify-between gap-3 text-amber-500 mb-4">
               <div className="flex items-center gap-3">
                 <Lock size={18} />
                 <h5 className="text-[10px] font-black uppercase tracking-[0.3em] font-institutional">{t("set.security")}</h5>
               </div>
               <span className="text-[9px] bg-amber-500/10 px-2 py-1 rounded-full font-bold uppercase tracking-widest border border-amber-500/20">OWASP Protected</span>
             </div>
             
             <div className="space-y-4">
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">{t("set.masterKey")}</p>
                 <div className="relative group">
                    <input 
                        type="password" 
                        placeholder="•••• •••• •••• ••••"
                        value={masterKey}
                        onChange={(e) => setMasterKey(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 font-mono transition-all pr-24"
                    />
                    <button 
                        onClick={handleApplyMasterKey}
                        className="absolute right-2 top-2 bottom-2 bg-amber-500 text-black px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-900/40"
                    >
                        {t("set.validate")}
                    </button>
                </div>
                {masterStatus.error && <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest text-center mt-2">{masterStatus.error}</p>}
                {masterStatus.success && <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest text-center mt-2">{t("set.unlocked")}</p>}
             </div>

             <div className="pt-4 border-t border-white/5">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black font-institutional mb-2">{t("set.metadata")}</p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-600">{t("set.hotelId")}</span>
                  <span className="font-mono text-zinc-400">{hotelId}</span>
                </div>
                <button className="w-full mt-4 py-3 bg-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-all border border-white/5">
                   {t("set.resetApi")}
                </button>
             </div>
          </div>

          <div className="glass p-8 rounded-[40px] border-rose-500/20 bg-rose-500/5 space-y-6">
             <div className="flex items-center gap-3 text-rose-500 mb-2">
               <AlertTriangle size={18} />
               <h5 className="text-[10px] font-black uppercase tracking-[0.3em] font-institutional">{t("set.danger")}</h5>
             </div>
             
             <div className="space-y-4">
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  {t("set.dangerDesc")}
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={() => handlePurge("RESERVATIONS")}
                        disabled={purging !== null}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <Eraser size={16} className="text-zinc-600 group-hover:text-rose-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white font-institutional">{t("set.purgeRes")}</span>
                        </div>
                        {purging === "RESERVATIONS" && <RefreshCcw className="animate-spin text-rose-500" size={14} />}
                    </button>

                    <button 
                        onClick={() => handlePurge("LOGS")}
                        disabled={purging !== null}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <Trash2 size={16} className="text-zinc-600 group-hover:text-rose-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white font-institutional">{t("set.purgeLogs")}</span>
                        </div>
                        {purging === "LOGS" && <RefreshCcw className="animate-spin text-rose-500" size={14} />}
                    </button>
                    
                    <button 
                        onClick={() => handlePurge("ALL")}
                        disabled={purging !== null}
                        className="w-full flex items-center justify-center p-4 rounded-2xl bg-rose-600 text-white font-black text-[9px] uppercase tracking-[0.3em] font-institutional hover:bg-rose-700 active:scale-95 transition-all shadow-xl shadow-rose-900/20"
                    >
                        {purging === "ALL" ? t("set.purging") : t("set.purgeAll")}
                    </button>
                </div>
             </div>
          </div>

          <div className="flex p-4">
            <button 
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className={`w-full py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                saveStatus === "saved" 
                  ? "bg-emerald-500 text-white" 
                  : saveStatus === "error"
                    ? "bg-rose-500 text-white"
                    : "bg-foreground text-background hover:scale-[1.02] active:scale-95"
              }`}
            >
              {saveStatus === "saving" ? <RefreshCcw className="animate-spin" size={18} /> : 
               saveStatus === "saved" ? <Save size={18} /> : 
               saveStatus === "error" ? <AlertTriangle size={18} /> : <Save size={18} />}
              
              {saveStatus === "saving" ? t("set.saving") : 
               saveStatus === "saved" ? t("set.saved") : 
               saveStatus === "error" ? "Error" : t("set.apply")}
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
