"use client";

import React from "react";
import { motion } from "framer-motion";

export function AuraBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[#050505] pointer-events-none">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-50 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />

      {/* Animated Mesh Gradients */}
      <motion.div
        animate={{
          x: ["-20%", "20%", "-20%"],
          y: ["-20%", "30%", "-20%"],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-[#FF385C]/10 rounded-full blur-[120px]"
      />

      <motion.div
        animate={{
          x: ["20%", "-30%", "20%"],
          y: ["30%", "-10%", "30%"],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[10%] -right-[20%] w-[80vw] h-[80vw] bg-[#3B82F6]/5 rounded-full blur-[150px]"
      />

      <motion.div
        animate={{
          x: ["-10%", "10%", "-10%"],
          y: ["40%", "10%", "40%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-[#FF385C]/5 rounded-full blur-[100px]"
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%]" />
    </div>
  );
}
