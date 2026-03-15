"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function CustomCursor() {
  const { theme } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    if (!isVisible) setIsVisible(true);
  }, [isVisible]);

  useEffect(() => {
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove]);

  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed z-[99999] rounded-full"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "400px",
        height: "400px",
        transform: "translate(-50%, -50%)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-out",
        background: theme === "dark"
          ? "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 30%, transparent 70%)"
          : "radial-gradient(circle, rgba(251, 146, 60, 0.12) 0%, rgba(251, 146, 60, 0.04) 30%, transparent 70%)",
      }}
    />
  );
}
