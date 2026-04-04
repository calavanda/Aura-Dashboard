"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Building2, 
  Store, 
  Home, 
  Save, 
  RefreshCcw,
  Bell,
  Globe,
  Camera,
  AlertTriangle,
  Coffee,
  Utensils
} from "lucide-react";
import { useAura } from "@/context/AuraContext";
import { useI18n } from "@/context/I18nContext";
import { TeamManagement } from "./Settings/TeamManagement";
import { ResetBusinessModal } from "./Settings/ResetBusinessModal";

export function SettingsModule() {
  const { hotelConfig, hotelId, updateHotel, refreshData, businessMode, role } = useAura();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("GENERAL"); // GENERAL, TEAM
  
  const [formData, setFormData] = useState({
    name: hotelConfig?.name || "",
    type: hotelConfig?.type || "Hotel",
    logoUrl: hotelConfig?.logoUrl || "",
    businessMode: businessMode,
    notifications: typeof window !== "undefined" ? localStorage.getItem("aura_prefs_notif") !== "false" : true,
    publicWeb: typeof window !== "undefined" ? localStorage.getItem("aura_prefs_sync") !== "false" : true
  });

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  const handleSave = async () => {
    setSaveStatus("saving");
    const res = await updateHotel({ 
      name: formData.name, 
      type: formData.type, 
      logoUrl: formData.logoUrl,
      businessMode: formData.businessMode
    });
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-bold font-outfit text-foreground tracking-tight">{t("set.title")}</h3>
          <p className="text-muted text-sm mt-2">{t("set.desc")}</p>
        </div>

        <div className="flex bg-accent/30 p-1 rounded-2xl border border-border">
          <button 
            onClick={() => setActiveTab("GENERAL")}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === "GENERAL" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted hover:text-white"}`}
          >
            General
          </button>
          {(role === "ADMIN" || role === "GERENTE") && (
            <button 
              onClick={() => setActiveTab("TEAM")}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === "TEAM" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted hover:text-white"}`}
            >
              Equipo
            </button>
          )}
        </div>
      </div>

      {activeTab === "TEAM" ? <TeamManagement /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="glass p-8 rounded-[40px] space-y-6">
              <h4 className="text-lg font-bold font-outfit flex items-center gap-2">
                {businessMode === "GASTRONOMY" ? <Store size={20} className="text-primary" /> : <Building2 size={20} className="text-primary" />}
                {businessMode === "GASTRONOMY" ? t("setup.business.title") : t("set.details")}
              </h4>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <label className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center text-muted relative group overflow-hidden cursor-pointer border border-border">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      {formData.logoUrl ? (
                         <Image src={formData.logoUrl} alt="Hotel Logo" fill className="object-cover" />
                      ) : (
                         <Camera size={24} className="group-hover:scale-110 transition-transform" />
                      )}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-white uppercase">{t("set.change")}</span>
                      </div>
                    </label>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">{businessMode === "GASTRONOMY" ? t("setup.business.label") : t("set.bizName")}</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder={businessMode === "GASTRONOMY" ? t("setup.business.placeholder") : t("setup.property.placeholder")}
                        className="w-full bg-accent/30 border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">{businessMode === "GASTRONOMY" ? t("setup.business.type") : t("set.propType")}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(businessMode === "GASTRONOMY" ? [
                        { id: 'Restaurante', icon: Utensils },
                        { id: 'Bar', icon: Store },
                        { id: 'Cafetería', icon: Coffee }
                      ] : [
                        { id: 'Hotel', icon: Building2 },
                        { id: 'Hostal', icon: Store },
                        { id: 'Vivienda', icon: Home }
                      ]).map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setFormData({...formData, type: type.id})}
                          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                            formData.type === type.id 
                              ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' 
                              : 'bg-accent/30 border-border text-muted hover:border-muted group'
                          }`}
                        >
                          <type.icon size={20} className={formData.type === type.id ? 'text-primary' : 'text-muted group-hover:text-foreground'} />
                          <span className="text-[10px] font-bold uppercase">{type.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Modo de Operación</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setFormData({...formData, businessMode: "HOSPITALITY", type: "Hotel"})}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                          formData.businessMode === "HOSPITALITY" 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'bg-accent/30 border-border text-muted hover:border-muted group'
                        }`}
                      >
                        <Building2 size={20} className={formData.businessMode === "HOSPITALITY" ? 'text-primary' : 'text-muted group-hover:text-foreground'} />
                        <span className="text-[10px] font-bold uppercase">{t("setup.hospitality")}</span>
                      </button>
                      <button
                        onClick={() => setFormData({...formData, businessMode: "GASTRONOMY", type: "Restaurante"})}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                          formData.businessMode === "GASTRONOMY" 
                            ? 'bg-[#FF385C]/10 border-[#FF385C] text-[#FF385C]' 
                            : 'bg-accent/30 border-border text-muted hover:border-muted group'
                        }`}
                      >
                        <Utensils size={20} className={formData.businessMode === "GASTRONOMY" ? 'text-[#FF385C]' : 'text-muted group-hover:text-foreground'} />
                        <span className="text-[10px] font-bold uppercase">{t("setup.gastronomy")}</span>
                      </button>
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

            {role === "ADMIN" && (
              <div className="glass p-8 rounded-[40px] border-rose-500/20 bg-rose-500/10 space-y-6">
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertTriangle size={20} />
                  <h4 className="text-lg font-bold font-outfit uppercase tracking-tighter italic">Zona de Peligro</h4>
                </div>
                <p className="text-[11px] text-rose-300/80 font-medium leading-relaxed italic">
                  Si deseas borrar todos los datos de tu {businessMode === "GASTRONOMY" ? "restaurante" : "hotel"} e iniciar desde cero la configuración, puedes reiniciar el negocio por completo. Esta acción eliminará permanentemente menús, habitaciones, finanzas y reservaciones.
                </p>
                <button 
                  onClick={() => setIsResetModalOpen(true)}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-rose-600/20"
                >
                  Reiniciar Negocio desde Cero
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
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
      )}

      <ResetBusinessModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        businessName={hotelConfig?.name || "mi negocio"}
        hotelId={hotelId || ""}
      />
    </div>
  );
}

function ToggleRow({ icon: Icon, title, desc, active, onToggle }: { icon: React.ElementType, title: string, desc: string, active: boolean, onToggle: () => void }) {
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
