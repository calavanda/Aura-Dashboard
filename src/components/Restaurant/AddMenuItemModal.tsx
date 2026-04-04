"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Utensils, DollarSign, Type, AlignLeft, Layers, Loader2, Check, Trash2 } from "lucide-react";
import { createMenuItem, createMenuCategory } from "@/app/actions/restaurant";
import { Restaurant, MenuCategory } from "@/types";
import { useI18n } from "@/context/I18nContext";
import { useAura } from "@/context/AuraContext";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  onSuccess: () => void;
}

export function AddMenuItemModal({ isOpen, onClose, restaurant, onSuccess }: AddMenuItemModalProps) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { inventoryItems } = useAura();
  const [recipe, setRecipe] = useState<{ inventoryItemId: string, quantityNeeded: number }[]>([]);

  const addIngredient = () => {
    setRecipe([...recipe, { inventoryItemId: "", quantityNeeded: 0 }]);
  };

  const removeIngredient = (index: number) => {
    setRecipe(recipe.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: "inventoryItemId" | "quantityNeeded", value: string | number) => {
    const newRecipe = [...recipe];
    newRecipe[index] = { ...newRecipe[index], [field]: value };
    setRecipe(newRecipe);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!categoryId && !newCategoryName) || !price || isSubmitting) return;

    setIsSubmitting(true);

    try {
      let finalCategoryId = categoryId;

      // Handle new category creation if needed
      if (showNewCategoryInput && newCategoryName) {
        const catRes = await createMenuCategory(restaurant.id, newCategoryName);
        if (catRes.success && catRes.data) {
          const category = catRes.data as MenuCategory;
          finalCategoryId = category.id;
        } else {
          throw new Error("Failed to create category");
        }
      }

      const res = await createMenuItem(restaurant.hotelId, {
        name,
        description,
        price: parseFloat(price),
        categoryId: finalCategoryId,
        recipe: recipe.filter(r => r.inventoryItemId && r.quantityNeeded > 0)
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setName("");
          setDescription("");
          setPrice("");
          setCategoryId("");
          setNewCategoryName("");
          setShowNewCategoryInput(false);
          setIsSubmitting(false);
          setIsSuccess(false);
          onSuccess();
          onClose();
        }, 1500);
      } else {
        alert(res.error || "Error creating dish");
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl glass border-white/10 p-1 rounded-[45px] z-70 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="bg-[#0A0A0A]/90 p-10 rounded-[40px] relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="absolute inset-0 z-50 bg-[#FF385C]/10 backdrop-blur-xl flex flex-col items-center justify-center space-y-4"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 bg-[#FF385C] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,56,92,0.4)]"
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

              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black font-institutional text-white flex items-center uppercase tracking-tighter italic">
                    <Utensils className="mr-3 text-[#FF385C] stroke-[3px]" size={28} /> {t("rest.menu.add")}
                  </h2>
                  <div className="w-12 h-1 bg-[#FF385C] rounded-full" />
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-all text-zinc-500 hover:text-white group"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 pl-4 font-institutional group-focus-within:text-[#FF385C] transition-colors">Nombre del Platillo</label>
                  <div className="relative">
                    <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Pizza Margarita"
                      className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-black focus:ring-4 focus:ring-[#FF385C]/10 focus:border-[#FF385C] outline-none transition-all placeholder:text-zinc-800 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 pl-4 font-institutional group-focus-within:text-[#FF385C] transition-colors">{t("rest.menu.desc")}</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-5 top-5 text-zinc-600" size={16} />
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descripción de los ingredientes..."
                      className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-black focus:ring-4 focus:ring-[#FF385C]/10 focus:border-[#FF385C] outline-none transition-all placeholder:text-zinc-800 text-sm h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 pl-4 font-institutional group-focus-within:text-[#FF385C] transition-colors">{t("rest.menu.price")}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                      <input 
                        type="number" 
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white font-black focus:ring-4 focus:ring-[#FF385C]/10 focus:border-[#FF385C] outline-none transition-all placeholder:text-zinc-800 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 pl-4 font-institutional group-focus-within:text-[#FF385C] transition-colors">{t("rest.menu.category")}</label>
                    <div className="relative">
                      <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                      <select 
                        value={categoryId}
                        onChange={(e) => {
                          if (e.target.value === "NEW") {
                            setShowNewCategoryInput(true);
                            setCategoryId("");
                          } else {
                            setShowNewCategoryInput(false);
                            setCategoryId(e.target.value);
                          }
                        }}
                        className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white font-black focus:ring-4 focus:ring-[#FF385C]/10 focus:border-[#FF385C] outline-none transition-all appearance-none text-sm"
                        required={!showNewCategoryInput}
                      >
                        <option value="" disabled className="bg-[#121212]">Seleccionar...</option>
                        {restaurant.categories?.map(cat => (
                          <option key={cat.id} value={cat.id} className="bg-[#121212]">{cat.name}</option>
                        ))}
                        <option value="NEW" className="bg-[#121212] text-[#FF385C] font-bold">+ AGREGAR NUEVA...</option>
                      </select>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showNewCategoryInput && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF385C] pl-4 font-institutional">Nueva Categoría</label>
                      <input 
                        type="text" 
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ej. Entradas, Postres..."
                        className="w-full bg-[#FF385C]/5 border border-[#FF385C]/20 rounded-2xl py-4 px-6 text-white font-black focus:ring-4 focus:ring-[#FF385C]/10 focus:border-[#FF385C] outline-none transition-all placeholder:text-zinc-800 text-sm"
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Recipe Section */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 pl-4 font-institutional">Receta / Ingredientes</label>
                    <button 
                      type="button"
                      onClick={addIngredient}
                      className="text-[8px] font-black uppercase tracking-widest text-[#FF385C] hover:bg-[#FF385C]/10 px-3 py-1 rounded-full transition-all flex items-center"
                    >
                      <Plus size={10} className="mr-1" /> Agregar Insumo
                    </button>
                  </div>

                  <div className="space-y-3">
                    {recipe.map((ing, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-12 gap-2 items-center bg-white/2 p-2 rounded-2xl border border-white/5"
                      >
                        <div className="col-span-7">
                          <select 
                            value={ing.inventoryItemId}
                            onChange={(e) => updateIngredient(idx, "inventoryItemId", e.target.value)}
                            className="w-full bg-transparent border-none text-[11px] font-bold text-white focus:ring-0 outline-none uppercase tracking-tighter"
                          >
                            <option value="" className="bg-[#0A0A0A]">Seleccionar ingrediente...</option>
                            {inventoryItems.map(item => (
                              <option key={item.id} value={item.id} className="bg-[#0A0A0A]">
                                {item.name} ({item.unit})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-3 flex items-center bg-white/5 rounded-xl px-2">
                          <input 
                            type="number" 
                            step="0.001"
                            value={ing.quantityNeeded}
                            onChange={(e) => updateIngredient(idx, "quantityNeeded", parseFloat(e.target.value))}
                            placeholder="Cant."
                            className="w-full bg-transparent border-none text-[11px] font-black text-white focus:ring-0 outline-none py-2"
                          />
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <button 
                            type="button"
                            onClick={() => removeIngredient(idx)}
                            className="p-2 text-zinc-600 hover:text-[#FF385C] transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {recipe.length === 0 && (
                      <p className="text-[10px] text-zinc-600 italic text-center py-4 border border-dashed border-white/5 rounded-2xl">
                        Sin ingredientes vinculados. El stock no se descontará automáticamente.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-[#FF385C] opacity-100 group-hover/btn:scale-110 transition-transform duration-500" />
                    <div className="relative px-8 py-5 rounded-2xl text-white font-black flex items-center justify-center space-x-3 uppercase tracking-[0.3em] font-institutional text-sm">
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <Plus size={18} className="stroke-[3px]" />
                          <span>AGREGAR AL MENÚ</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
