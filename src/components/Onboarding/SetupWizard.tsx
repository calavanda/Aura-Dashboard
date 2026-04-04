"use client";

import React, { useState } from "react";
import { useAura, HotelConfig } from "@/context/AuraContext";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, BedDouble, Check, ChevronRight, Sparkles, Utensils, Store } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { BusinessMode } from "@/types";

const hospitalityTypes = ["Hotel", "Hostal", "Vivienda Vacacional", "Resort", "Apartamentos"];
const gastronomyTypes = ["Restaurante", "Bar", "Cafetería", "Food Truck", "Pizzería"];

const hospitalityServices = ["Restaurante", "Alberca", "Spa", "Gimnasio", "Limpieza diaria", "Bar", "Estacionamiento"];
const gastronomyServices = ["Terraza", "Delivery", "Catering", "Música en vivo", "WiFi", "Estacionamiento", "Área Infantil"];

export function SetupWizard() {
  const { completeSetup } = useAura();
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<HotelConfig>({
    name: "",
    type: "Hotel",
    businessMode: "HOSPITALITY",
    roomsCount: 10,
    showHotelModule: true,
    showRestaurantModule: true,
    services: []
  });

  const propertyTypes = config.businessMode === "HOSPITALITY" ? hospitalityTypes : gastronomyTypes;
  const availableServices = config.businessMode === "HOSPITALITY" ? hospitalityServices : gastronomyServices;

  const handleToggleService = (service: string) => {
    setConfig(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else completeSetup(config);
  };

  const selectBusinessMode = (mode: BusinessMode) => {
    setConfig({
      ...config,
      businessMode: mode,
      type: mode === "HOSPITALITY" ? "Hotel" : "Restaurante",
      showHotelModule: mode === "HOSPITALITY",
      showRestaurantModule: true,
      services: []
    });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-2xl w-full p-10 rounded-[40px] shadow-2xl relative overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black font-outfit text-white tracking-tight">{t("setup.welcome")}</h2>
                <p className="text-zinc-400 text-sm">{t("setup.selection")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <button
                  onClick={() => selectBusinessMode("HOSPITALITY")}
                  className="glass group p-8 rounded-3xl border-white/5 hover:border-primary/50 transition-all text-left flex flex-col space-y-4 hover:bg-primary/5"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="text-primary" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t("setup.hospitality")}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{t("setup.hospitality.desc")}</p>
                  </div>
                </button>

                <button
                  onClick={() => selectBusinessMode("GASTRONOMY")}
                  className="glass group p-8 rounded-3xl border-white/5 hover:border-[#FF385C]/50 transition-all text-left flex flex-col space-y-4 hover:bg-[#FF385C]/5"
                >
                  <div className="w-14 h-14 bg-[#FF385C]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Utensils className="text-[#FF385C]" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t("setup.gastronomy")}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{t("setup.gastronomy.desc")}</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                  {config.businessMode === "HOSPITALITY" ? <Building2 className="text-primary" size={24} /> : <Store className="text-primary" size={24} />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-outfit text-foreground">{config.businessMode === "HOSPITALITY" ? t("setup.property.title") : t("setup.business.title")}</h2>
                  <p className="text-sm text-muted">{config.businessMode === "HOSPITALITY" ? t("setup.property.desc") : t("setup.business.desc")}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">{config.businessMode === "HOSPITALITY" ? t("setup.property.label") : t("setup.business.label")}</label>
                  <input 
                    type="text" 
                    placeholder={config.businessMode === "HOSPITALITY" ? t("setup.property.placeholder") : t("setup.business.placeholder")}
                    className="w-full bg-accent border border-border rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-foreground"
                    value={config.name}
                    onChange={(e) => setConfig({...config, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">{config.businessMode === "HOSPITALITY" ? t("setup.property.type") : t("setup.business.type")}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                    {propertyTypes.map(t => (
                      <button
                        key={t}
                        onClick={() => setConfig({...config, type: t})}
                        className={`py-3 px-4 rounded-xl border text-sm transition-all ${
                          config.type === t ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border text-muted hover:border-primary/50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                  {config.businessMode === "HOSPITALITY" ? <BedDouble className="text-primary" size={24} /> : <Utensils className="text-primary" size={24} />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-outfit text-foreground">{config.businessMode === "HOSPITALITY" ? t("setup.capacity.title") : t("setup.capacity.gastro.title")}</h2>
                  <p className="text-sm text-muted">{config.businessMode === "HOSPITALITY" ? t("setup.capacity.desc") : t("setup.capacity.gastro.desc")}</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-10">
                <div className="text-6xl font-bold font-outfit text-primary mb-6">{config.roomsCount}</div>
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => setConfig({...config, roomsCount: Math.max(1, config.roomsCount - 1)})}
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-all text-foreground"
                  >
                    -
                  </button>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    className="w-48 accent-primary" 
                    value={config.roomsCount}
                    onChange={(e) => setConfig({...config, roomsCount: parseInt(e.target.value)})}
                  />
                  <button 
                    onClick={() => setConfig({...config, roomsCount: Math.min(100, config.roomsCount + 1)})}
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-all text-foreground"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Sparkles className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-outfit text-foreground">{t("setup.services.title")}</h2>
                  <p className="text-sm text-muted">{t("setup.services.desc")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {availableServices.map(s => (
                  <button
                    key={s}
                    onClick={() => handleToggleService(s)}
                    className={`flex items-center space-x-3 p-4 rounded-xl border text-sm transition-all ${
                      config.services.includes(s) ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border text-muted hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${config.services.includes(s) ? 'bg-primary border-primary' : 'border-border'}`}>
                      {config.services.includes(s) && <Check size={12} className="text-background" />}
                    </div>
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-between items-center">
          {step > 0 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="text-muted text-sm font-bold uppercase hover:text-foreground transition-colors"
            >
              {t("setup.back")}
            </button>
          ) : <div />}
          
          <button 
            onClick={handleNext}
            disabled={step === 1 && !config.name}
            className="bg-primary text-background font-bold px-8 py-4 rounded-2xl hover:brightness-110 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
          >
            <span>{step === 3 ? t("setup.finish") : t("setup.next")}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
