"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { 
  X, 
  Check, 
  SlidersHorizontal, 
  Key, 
  Image as ImageIcon, 
  DollarSign, 
  CalendarCheck, 
  Globe, 
  Rocket,
  Minus,
  Plus
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Basic Info", icon: Check },
  { id: 2, title: "Property Details", icon: SlidersHorizontal },
  { id: 3, title: "Ownership", icon: Key },
  { id: 4, title: "Photos", icon: ImageIcon },
  { id: 5, title: "Pricing", icon: DollarSign },
  { id: 6, title: "Management", icon: CalendarCheck },
  { id: 7, title: "Connections", icon: Globe },
  { id: 8, title: "Business Options", icon: Rocket }
];

export function AddAssetWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl h-[85vh] bg-[#0A0A0A] rounded-[2rem] border border-white/10 shadow-2xl flex relative overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition z-50 text-zinc-400 hover:text-white"
        >
          <X size={14} />
        </button>

        {/* Left Wizard Navigation */}
        <div className="hidden md:flex flex-col justify-between w-[300px] bg-[#080808] border-r border-white/5 p-8 relative z-20">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter mb-1">Setup Property</h2>
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] font-institutional mb-12">SETUP ASSISTANT</p>
            
            <div className="space-y-6">
              {STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center space-x-4">
                    <div className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive ? "bg-[#FF385C] text-white shadow-[0_0_15px_rgba(255,56,92,0.4)]" :
                      isCompleted ? "bg-emerald-500 text-white" :
                      "bg-white/5 border border-white/5 text-zinc-600"
                    )}>
                      {isCompleted ? <Check size={16} strokeWidth={3} /> : <step.icon size={isActive ? 16 : 14} strokeWidth={isActive ? 2.5 : 2} />}
                    </div>
                    <div>
                      <p className={clsx("text-[8px] font-black uppercase tracking-widest transition-colors duration-300", isActive ? "text-[#FF385C]" : "text-zinc-600")}>STEP {String(step.id).padStart(2, '0')}</p>
                      <p className={clsx("text-xs font-bold transition-colors duration-300", isActive || isCompleted ? "text-white" : "text-zinc-500")}>{step.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <button className="w-full py-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-400 text-[9px] font-black uppercase tracking-widest hover:bg-teal-500/10 transition">
            SAVE PROPERTY
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col bg-[#0A0A0A] relative z-10">
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <AnimatePresence mode="wait">
              {currentStep === 1 && <Step1_GeneralInfo key="s1" />}
              {currentStep === 2 && <Step2_Narrative key="s2" />}
              {currentStep > 2 && (
                <motion.div 
                  key="unknown" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <Rocket size={48} className="text-zinc-800 mb-6" />
                  <h3 className="text-xl font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Phase {String(currentStep).padStart(2, '0')}: {STEPS[currentStep-1].title}</h3>
                  <p className="text-sm text-zinc-600 max-w-md">This integration module is currently in development. Please proceed to the next step or utilize the live production branch to complete advanced configurations.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Footer Controls */}
          <div className="border-t border-white/5 bg-[#080808]/80 p-6 flex justify-between items-center shrink-0">
             <button 
               onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
               className={clsx("px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition", currentStep === 1 ? "opacity-50 pointer-events-none text-zinc-600 bg-white/5" : "bg-white/10 text-white hover:bg-white/20")}
             >
               PREVIOUS STEP
             </button>
             <button 
               onClick={() => {
                 if (currentStep < 8) setCurrentStep(prev => prev + 1);
                 else onClose();
               }}
               className="bg-[#FF385C] hover:bg-[#FF385C]/90 shadow-[0_0_20px_rgba(255,56,92,0.4)] text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full transition flex items-center"
             >
               {currentStep === 8 ? "FINALIZE" : "CONTINUE "}
             </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

// ------------------------------------------------------------------
// Step 1: General Info
// ------------------------------------------------------------------
function Step1_GeneralInfo() {
  const Stepper = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col items-center">
      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">{label}</span>
      <div className="flex items-center space-x-4 bg-white/5 border border-white/10 rounded-full px-2 py-1">
        <button className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition"><Minus size={12} /></button>
        <span className="text-lg font-black text-white w-6 text-center">{value}</span>
        <button className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition"><Plus size={12} /></button>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-xl font-black text-white tracking-tighter">Step 1: General Info</h3>
      </div>
      
      <div className="flex space-x-6">
        <div className="flex-1 space-y-2">
          <label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">PROPERTY NAME</label>
          <input type="text" placeholder="e.g. Sunny Beachside Apartment" className="w-full bg-[#080808] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-[#FF385C]/50 transition font-bold" />
        </div>
        <div className="w-1/3 space-y-2">
          <label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">PROPERTY TYPE</label>
          <select className="w-full bg-[#080808] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-[#FF385C]/50 transition font-bold appearance-none">
            <option>Apartment</option>
            <option>House</option>
            <option>Boutique Hotel</option>
            <option>Villa</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">STREET ADDRESS</label>
        <input type="text" placeholder="Where is your property located?" className="w-full bg-[#080808] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-[#FF385C]/50 transition font-bold" />
      </div>

      <div className="glass p-8 rounded-4xl border-white/5 space-y-6">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] font-institutional">ROOM & GUEST LIMITS</p>
        <div className="grid grid-cols-4 gap-4">
          <Stepper label="MAX GUESTS" value={2} />
          <Stepper label="BEDROOMS" value={1} />
          <Stepper label="TOTAL BEDS" value={1} />
          <Stepper label="BATHROOMS" value={1} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">ALLOW INSTANT BOOKING</span>
          <div className="w-6 h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center" />
        </div>
        <div className="glass p-6 rounded-3xl border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">ALLOW PETS</span>
          <div className="w-6 h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center" />
        </div>
      </div>
    </motion.div>
  );
}

// ------------------------------------------------------------------
// Step 2: Narrative & Specs
// ------------------------------------------------------------------
function Step2_Narrative() {
  const FeatureTag = ({ label }: { label: string }) => (
    <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[8px] font-bold text-zinc-400 uppercase tracking-widest hover:bg-[#FF385C]/10 hover:text-[#FF385C] hover:border-[#FF385C]/30 transition cursor-pointer">
      {label}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-black text-white tracking-tighter">Phase 02: Narrative & Specs</h3>
          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1 font-institutional">PROPERTY STORY & PHYSICAL ATTRIBUTES</p>
        </div>
        <button className="bg-[#FF385C]/10 text-[#FF385C] border border-[#FF385C]/20 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center shadow-[0_0_15px_rgba(255,56,92,0.1)] hover:bg-[#FF385C]/20 transition">
          <Rocket size={12} className="mr-2" /> NARRATIVE ASSISTANT
        </button>
      </div>
      
      <div className="glass p-6 rounded-3xl border-white/5">
        <textarea 
          placeholder="Describe your property for potential guests..." 
          className="w-full bg-transparent border-none outline-none text-sm text-white resize-none h-24 font-bold placeholder:text-zinc-600"
        />
      </div>

      <div className="space-y-6 border-t border-white/5 pt-8">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] font-institutional">PROPERTY FEATURE REGISTRY</p>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
             <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest border-b border-teal-500/20 pb-2">KITCHEN</p>
             <div className="flex flex-wrap gap-2">
               <FeatureTag label="FRIDGE" /> <FeatureTag label="STOVE" /> <FeatureTag label="COFFEE MAKER" /> <FeatureTag label="DISHWASHER" /> <FeatureTag label="MICROWAVE" />
             </div>
          </div>
          <div className="space-y-4">
             <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest border-b border-blue-500/20 pb-2">BATHROOM</p>
             <div className="flex flex-wrap gap-2">
               <FeatureTag label="HAIR DRYER" /> <FeatureTag label="SHAMPOO" /> <FeatureTag label="HOT WATER" /> <FeatureTag label="TOWELS" />
             </div>
          </div>
          <div className="space-y-4">
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border-b border-emerald-500/20 pb-2">OUTDOOR</p>
             <div className="flex flex-wrap gap-2">
               <FeatureTag label="PATIO" /> <FeatureTag label="BBQ GRILL" /> <FeatureTag label="POOL" /> <FeatureTag label="HOT TUB" /> <FeatureTag label="PRIVATE GARDEN" />
             </div>
          </div>
          <div className="space-y-4">
             <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-rose-500/20 pb-2">SAFETY</p>
             <div className="flex flex-wrap gap-2">
               <FeatureTag label="SMOKE ALARM" /> <FeatureTag label="CO DETECTOR" /> <FeatureTag label="FIRST AID KIT" /> <FeatureTag label="FIRE EXTINGUISHER" />
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] font-institutional">SPECIAL PROPERTY FEATURES</p>
        <div className="flex space-x-4">
          <input type="text" placeholder="Add a unique feature not listed above..." className="flex-1 bg-[#080808] border border-white/10 rounded-full px-6 py-3 text-sm text-white outline-none focus:border-[#FF385C]/50 transition font-bold" />
          <button className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition">ADD FEATURE</button>
        </div>
      </div>

      <div className="glass p-8 rounded-4xl border-white/5 mt-8">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] font-institutional mb-6">TECHNICAL SPECIFICATIONS</p>
        <div className="grid grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">TOTAL AREA (SQFT)</p>
            <input type="text" defaultValue="0 sqft" className="w-full bg-transparent border-b border-white/10 pb-2 text-lg font-black text-white outline-none focus:border-[#FF385C]/50 transition" />
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">FLOOR LEVEL</p>
            <input type="text" defaultValue="1st" className="w-full bg-transparent border-b border-white/10 pb-2 text-lg font-black text-white outline-none focus:border-[#FF385C]/50 transition" />
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">PRIMARY VIEW</p>
            <input type="text" placeholder="e.g. Garden View" className="w-full bg-transparent border-b border-white/10 pb-2 text-lg font-black text-white outline-none focus:border-[#FF385C]/50 transition" />
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">CONSTRUCTION YEAR</p>
            <input type="text" defaultValue="2024" className="w-full bg-transparent border-b border-white/10 pb-2 text-lg font-black text-white outline-none focus:border-[#FF385C]/50 transition" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
