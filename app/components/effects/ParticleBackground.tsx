/* eslint-disable react-hooks/set-state-in-effect */
/**
 * 粒子背景组件
 * 用于页面背景装饰效果
 * 支持通过 effectsStore 动态开关
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useEffectsStore } from "@/app/stores/effects-store";

interface ParticleBackgroundProps {
  theme: string;
  particleCount?: number;
}

export default function ParticleBackground({ 
  theme, 
  particleCount = 80 
}: ParticleBackgroundProps) {
  const { effectsEnabled } = useEffectsStore();
  const [particles, setParticles] = useState<Array<{ 
    id: number; 
    x: number; 
    y: number; 
    size: number; 
    duration: number; 
    delay: number;
    xDrift: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 15 + 8,
      delay: Math.random() * 3,
      xDrift: (Math.random() - 0.5) * 200,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  if (!effectsEnabled) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            theme === "dark" 
              ? "bg-linear-to-br from-violet-400/40 to-purple-500/40" 
              : "bg-linear-to-br from-violet-500/50 to-purple-600/50"
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: theme === "dark" 
              ? `0 0 ${particle.size * 2}px rgba(139, 92, 246, 0.5)` 
              : `0 0 ${particle.size * 2}px rgba(139, 92, 246, 0.3)`,
          }}
          animate={{
            y: [0, -800],
            x: [0, particle.xDrift],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
