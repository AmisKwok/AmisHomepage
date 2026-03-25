"use client";

import { useState } from "react";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface SocialIconProps {
  href: string;
  icon: string;
  title: string;
  show?: boolean;
  theme: "dark" | "light";
  textColor: string;
}

export default function SocialIcon({ href, icon, title, show = true, theme, textColor }: SocialIconProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  if (!show) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples((prev) => [...prev, { x, y, id }]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  };

  return (
    <a
      href={href}
      rel="external nofollow noreferrer"
      target="_blank"
      title={title}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 overflow-hidden group"
      style={{
        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
        color: textColor,
      }}
    >
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          theme === "dark"
            ? "bg-blue-400"
            : "bg-orange-400"
        }`}
        style={{
          opacity: isHovered ? 0.3 : 0,
          filter: "blur(8px)",
          transform: isHovered ? "scale(1.5)" : "scale(1)",
        }}
      />

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={`absolute rounded-full animate-ripple ${
            theme === "dark" ? "bg-white/40" : "bg-gray-600/40"
          }`}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      <i className={`${icon} relative z-10 transition-transform duration-300 group-hover:scale-110`}></i>

      <style jsx>{`
        @keyframes ripple {
          0% {
            width: 10px;
            height: 10px;
            opacity: 0.6;
          }
          100% {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out forwards;
        }
      `}</style>
    </a>
  );
}
