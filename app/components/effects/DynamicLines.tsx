/**
 * 动态线条组件
 * 用于页面背景装饰效果
 */

"use client";

import { motion } from "framer-motion";

interface DynamicLinesProps {
  theme: string;
  lineCount?: number;
  opacity?: number;
}

export default function DynamicLines({ 
  theme, 
  lineCount = 6,
  opacity = 0.15
}: DynamicLinesProps) {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="dynamicLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme === "dark" ? "#8b5cf6" : "#6366f1"} />
          <stop offset="50%" stopColor={theme === "dark" ? "#a78bfa" : "#818cf8"} />
          <stop offset="100%" stopColor={theme === "dark" ? "#6366f1" : "#8b5cf6"} />
        </linearGradient>
      </defs>
      {[...Array(lineCount)].map((_, i) => (
        <motion.line
          key={i}
          x1={`${i * (100 / lineCount)}%`}
          y1="0%"
          x2={`${(i + 1) * (100 / lineCount)}%`}
          y2="100%"
          stroke="url(#dynamicLineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
          transition={{
            duration: 4 + i * 0.5,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}
