"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: string;
  y: string;
  scale: number;
  duration: number;
  delay: number;
}

export function AuraBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate stars only on the client side
    const newStars = [...Array(12)].map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      scale: Math.random() * 0.5 + 0.5,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 10,
    }));
    
    // Using a microtask to avoid synchronous setState inside an effect
    // which satisfies strict mode and avoids cascading render warnings
    Promise.resolve().then(() => setStars(newStars));
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[#020202] pointer-events-none">
      {/* Primary Aura (Pink/Red) - Very subtle and slow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.05, 0.03],
          x: ["-10%", "5%", "-10%"],
          y: ["-5%", "10%", "-5%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -left-[5%] w-[80vw] h-[80vw] bg-[#FF385C] rounded-full blur-[160px]"
      />

      {/* Secondary Aura (Blue) - Even slower */}
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.02, 0.04, 0.02],
          x: ["10%", "-5%", "10%"],
          y: ["15%", "0%", "15%"],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] -right-[10%] w-[90vw] h-[90vw] bg-[#3B82F6] rounded-full blur-[180px]"
      />

      {/* Subtle Bottom Glow */}
      <motion.div
        animate={{
          opacity: [0.02, 0.03, 0.02],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[-20%] left-[10%] w-screen h-[50vh] bg-linear-to-t from-[#FF385C]/10 to-transparent blur-[120px]"
      />

      {/* Elegant Moving "Stars" / Particles */}
      <div className="absolute inset-0 z-10">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ 
              opacity: 0,
              x: star.x,
              y: star.y,
              scale: star.scale
            }}
            animate={{
              opacity: [0, 0.2, 0],
              y: ["-2%", "2%"],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Dark Vignette to Frame the Content */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
