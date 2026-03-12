"use client";

import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export default function Avatar({ src, alt, size = 120, className = "" }: AvatarProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* 呼吸光圈 */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-r from-white/40 via-white/20 to-white/40 animate-pulse-slow"
        style={{ 
          width: size + 16, 
          height: size + 16,
          margin: -8,
        }}
      />
      
      {/* 外圈光环动画 */}
      <div 
        className="absolute rounded-full border-2 border-white/30 animate-spin-slow"
        style={{ 
          width: size + 24, 
          height: size + 24,
          margin: -12,
        }}
      />
      
      {/* 头像容器 */}
      <div 
        className="relative rounded-full overflow-hidden border-4 border-white/50 shadow-2xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:shadow-white/30"
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
        className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-all duration-300"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
