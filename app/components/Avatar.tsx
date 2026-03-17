"use client";

import Image from "next/image";
import { useThemeStore } from "../stores/theme-store";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export default function Avatar({ src, alt, size = 120, className = "" }: AvatarProps) {
  const { theme } = useThemeStore();
  
  return (
    <div className={`relative group ${className}`}>
      {/* 呼吸光圈 */}
      <div 
        className={`absolute inset-0 rounded-full animate-pulse-slow ${
          theme === "dark" 
            ? "bg-gradient-to-r from-white/40 via-white/20 to-white/40" 
            : "bg-gradient-to-r from-gray-400/40 via-gray-200/20 to-gray-400/40"
        }`}
        style={{ 
          width: size + 16, 
          height: size + 16,
          margin: -8,
        }}
      />
      
      {/* 外圈光环动画 */}
      <div 
        className={`absolute rounded-full border-2 animate-spin-slow ${
          theme === "dark" ? "border-white/30" : "border-gray-400/30"
        }`}
        style={{ 
          width: size + 24, 
          height: size + 24,
          margin: -12,
        }}
      />
      
      {/* 头像容器 */}
      <div 
        className={`relative rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-500 ease-out group-hover:scale-110 ${
          theme === "dark" 
            ? "border-white/50 group-hover:shadow-white/30" 
            : "border-gray-300 group-hover:shadow-gray-400/30"
        }`}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-125"
          sizes={`${size}px`}
          priority
        />
      </div>
      
      {/* 悬停时的光晕效果 */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          theme === "dark" 
            ? "bg-white/0 group-hover:bg-white/10" 
            : "bg-gray-400/0 group-hover:bg-gray-400/10"
        }`}
        style={{ width: size, height: size }}
      />
    </div>
  );
}
