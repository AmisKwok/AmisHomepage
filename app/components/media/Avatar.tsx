"use client";

import Image from "next/image";
import { useThemeStore } from "../../stores/theme-store";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export default function Avatar({ src, alt, size = 120, className = "", onHoverStart, onHoverEnd }: AvatarProps) {
  const { theme } = useThemeStore();
  
  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      
      {/* 呼吸光圈 */}
      <div 
        className={`absolute inset-0 rounded-full ${
          theme === "dark" 
            ? "bg-linear-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30" 
            : "bg-linear-to-r from-orange-400/30 via-amber-400/30 to-yellow-400/30"
        }`}
        style={{ 
          width: size + 16, 
          height: size + 16,
          margin: -8,
          animation: 'breathe 3s ease-in-out infinite',
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
            ? "border-white/50 group-hover:shadow-blue-500/30" 
            : "border-gray-300 group-hover:shadow-orange-500/30"
        }`}
        style={{ 
          width: size, 
          height: size,
          animation: 'breathe-avatar 3s ease-in-out infinite',
        }}
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

      {/* CSS 动画定义 */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.7;
          }
        }
        @keyframes breathe-avatar {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}
