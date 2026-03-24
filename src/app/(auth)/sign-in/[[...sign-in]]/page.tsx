"use client";

import { SignIn } from "@clerk/nextjs";
import { useI18n } from "@/context/I18nContext";
import { motion } from "framer-motion";

export default function Page() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#050505] text-white font-sans selection:bg-[#FF385C] selection:text-white relative overflow-hidden">
      
      {/* Left Column - Auth Form */}
      <div className="flex flex-col justify-center px-8 lg:px-32 relative z-10 w-full max-w-2xl mx-auto h-full min-h-screen py-10 lg:py-0">
        
        {/* Logo & Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 w-full"
        >
          <div className="w-12 h-12 bg-[#FF385C] rounded-2xl flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(255,56,92,0.2)]">
            <span className="text-white font-black text-2xl mt-1 font-institutional">A</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2 font-institutional leading-none">
            {t("auth.welcome")} <span className="text-[#FF385C]">{t("auth.back")}</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] font-institutional">
            {t("auth.subtitle")}
          </p>
        </motion.div>

        {/* Clerk Sign In */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full"
        >
          <SignIn 
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
              },
              variables: {
                colorPrimary: "#FF385C",
                colorBackground: "#0A0A0A",
                colorText: "white",
                colorInputBackground: "rgba(255, 255, 255, 0.05)",
                colorInputText: "white",
              },
              elements: {
                card: "bg-transparent shadow-none border-none p-0 w-full max-w-full",
                header: "hidden", 
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                footer: "hidden",
                formFieldLabel__emailAddress: "text-[#FF385C] font-black uppercase tracking-[0.2em] text-[9px] font-institutional mb-2 block",
                formFieldLabel__password: "text-[#FF385C] font-black uppercase tracking-[0.2em] text-[9px] font-institutional mb-2 block",
                formFieldInput: "bg-[#0A0A0A] border border-zinc-900 rounded-2xl text-white px-4 py-4 focus:border-[#FF385C] focus:ring-0 transition-all font-mono text-sm w-full",
                formButtonPrimary: "bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-[0.3em] font-institutional text-[10px] py-5 rounded-2xl mt-4 w-full transition-all border border-zinc-700 hover:border-zinc-500",
                identityPreviewText: "text-zinc-400 font-mono text-sm",
                identityPreviewEditButton: "text-[#FF385C] hover:text-[#FF385C]/80",
                dividerRow: "my-8",
                dividerLine: "bg-zinc-900",
                dividerText: "text-zinc-600 font-institutional text-[8px] font-black uppercase tracking-[0.3em]",
                socialButtonsBlockButton: "bg-[#0A0A0A] border border-zinc-900 text-white hover:bg-zinc-900 transition-all py-4 rounded-xl",
                socialButtonsBlockButtonText: "font-institutional text-[10px] font-black uppercase tracking-[0.2em]",
                formFieldRow: "mb-6",
                formFieldAction: "text-[#FF385C] hover:opacity-80 transition-opacity font-black uppercase tracking-[0.1em] text-[9px] font-institutional",
              }
            }}
          />
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="mt-12 text-center"
        >
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] font-institutional">
            {t("auth.newToAura")} <a href="/sign-up" className="text-[#FF385C] hover:underline font-bold transition-all">{t("auth.createAccount")}</a>
          </p>
        </motion.div>
      </div>

      {/* Right Column - Dashboard Mockup Abstraction */}
      <div className="hidden lg:flex items-center justify-center p-12 relative h-full">
        <div className="absolute inset-0 bg-[#0A0A0A] border-l border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF385C]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full max-w-2xl aspect-16/10 bg-[#0A0A0A] rounded-4xl border border-zinc-900 shadow-2xl p-6 flex flex-col z-10 opacity-60"
        >
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
             <div className="flex items-center space-x-4">
                <div className="w-6 h-6 rounded-lg bg-[#FF385C] opacity-80" />
                <div className="w-32 h-2 rounded-full bg-zinc-800" />
             </div>
             <div className="w-8 h-8 rounded-full bg-zinc-900" />
          </div>

          <div className="flex gap-6 mb-6">
             <div className="w-48 flex flex-col gap-4">
                <div className="w-full h-12 bg-zinc-900/50 rounded-xl border border-zinc-900" />
                <div className="w-full h-12 bg-zinc-900/30 rounded-xl border border-zinc-900/50" />
             </div>
             <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="h-24 bg-zinc-900/40 rounded-2xl border border-zinc-900/50 p-4 relative" />
                <div className="h-24 bg-zinc-900/40 rounded-2xl border border-zinc-900/50 p-4 relative" />
                <div className="h-24 bg-zinc-900/40 rounded-2xl border border-zinc-900/50 p-4 relative" />
             </div>
          </div>

          <div className="flex-1 border border-zinc-900/60 rounded-3xl bg-zinc-900/20 relative p-8">
             <div className="w-32 h-3 rounded-full bg-zinc-800 mb-8" />
             <div className="flex justify-center gap-4 absolute bottom-8 left-1/2 -translate-x-1/2">
                {[1,2,3,4,5,6,7].map(i => (
                   <div key={i} className="w-12 h-2 rounded-full bg-zinc-900" />
                ))}
             </div>
          </div>
        </motion.div>

        <div className="absolute bottom-8 right-12 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 font-institutional">
           Authorized Personnel Only • v5.8
        </div>
      </div>
    </div>
  );
}
