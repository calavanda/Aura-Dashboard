"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  LucideIcon, 
  Utensils, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Bed,
  Calendar,
  LayoutDashboard
} from "lucide-react";
import { clsx } from "clsx";

interface GradientIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  colors?: [string, string]; // [StartColor, EndColor]
  animate?: boolean;
}

export function GradientIcon({ 
  icon: Icon, 
  size = 24, 
  className, 
  colors = ["#FF385C", "#3B82F6"],
  animate = true 
}: GradientIconProps) {
  const uniqueId = React.useId().replace(/:/g, "");

  return (
    <div className={clsx("relative flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 24 24`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <motion.stop 
              offset="0%" 
              stopColor={colors[0]} 
              animate={animate ? {
                stopColor: [colors[0], colors[1], colors[0]]
              } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.stop 
              offset="100%" 
              stopColor={colors[1]} 
              animate={animate ? {
                stopColor: [colors[1], colors[0], colors[1]]
              } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </linearGradient>
        </defs>
        <Icon 
          size={size} 
          stroke={`url(#grad-${uniqueId})`} 
          strokeWidth={2}
          className="overflow-visible"
        />
      </svg>
      {animate && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-current blur-xl opacity-0 pointer-events-none"
          style={{ color: colors[0] }}
        />
      )}
    </div>
  );
}

export const AuraIcons = {
  Dashboard: (props: Partial<GradientIconProps>) => <GradientIcon icon={LayoutDashboard} {...props} />,
  Reservations: (props: Partial<GradientIconProps>) => <GradientIcon icon={Calendar} colors={["#3B82F6", "#60A5FA"]} {...props} />,
  Inventory: (props: Partial<GradientIconProps>) => <GradientIcon icon={Bed} colors={["#10b981", "#34d399"]} {...props} />,
  FandB: (props: Partial<GradientIconProps>) => <GradientIcon icon={Utensils} colors={["#F59E0B", "#FBBF24"]} {...props} />,
  Finances: (props: Partial<GradientIconProps>) => <GradientIcon icon={CreditCard} colors={["#8B5CF6", "#A78BFA"]} {...props} />,
  Guests: (props: Partial<GradientIconProps>) => <GradientIcon icon={Users} colors={["#EC4899", "#F472B6"]} {...props} />,
  System: (props: Partial<GradientIconProps>) => <GradientIcon icon={Zap} colors={["#FF385C", "#3B82F6"]} {...props} />,
  Security: (props: Partial<GradientIconProps>) => <GradientIcon icon={ShieldCheck} colors={["#000000", "#333333"]} {...props} />,
  Growth: (props: Partial<GradientIconProps>) => <GradientIcon icon={TrendingUp} colors={["#10b981", "#10b981"]} {...props} />,
};
