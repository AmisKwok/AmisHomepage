/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import { useThemeStore } from "../../stores/theme-store";

interface DrawnTitleProps {
  text: string;
  className?: string;
}

function DrawnTitleInner({ text, className = "" }: DrawnTitleProps) {
  const { theme } = useThemeStore();
  const [progress, setProgress] = useState(0);
  const [clipId] = useState(() => `clip-${Math.random().toString(36).slice(2)}`);
  const textRef = useRef<SVGTextElement>(null);
  const [viewBoxWidth, setViewBoxWidth] = useState(30000);

  useEffect(() => {
    const duration = 3000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);
      
      if (newProgress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);

  // 根据文字长度动态计算 viewBox 宽度
  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox();
      // 增加左右边距，确保描边不会被裁剪
      const padding = 2000;
      const width = bbox.width + padding * 2;
      setViewBoxWidth(width);
    }
  }, [text]);

  const fontSize = 500;
  const viewBoxHeight = 1000;
  // 计算文字起始位置，使其居中
  const textX = viewBoxWidth / 2;

  // 根据主题设置颜色 - 亮色模式使用纯黑色确保对比度
  const gradientStart = theme === "dark" ? "#fff" : "#000000";
  const gradientMiddle = theme === "dark" ? "#f8f8f8" : "#000000";
  const gradientEnd = theme === "dark" ? "#fff" : "#000000";
  const strokeColor = theme === "dark" ? "white" : "#000000";

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`textGradient-${clipId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="50%" stopColor={gradientMiddle} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={`${progress * viewBoxWidth}`} height={viewBoxHeight} />
          </clipPath>
        </defs>
        <text
          ref={textRef}
          x={textX}
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={`url(#textGradient-${clipId})`}
          stroke={strokeColor}
          strokeWidth="24"
          fontSize={fontSize}
          fontFamily="var(--font-zcool-qingke), 'PingFang SC', 'Microsoft YaHei', sans-serif"
          fontWeight="400"
          className={theme === "dark" ? "drop-shadow-lg" : "drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]"}
          clipPath={`url(#${clipId})`}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}

export default function DrawnTitle({ text, className = "" }: DrawnTitleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (text !== displayText) {
      // 开始过渡：先淡出
      setIsTransitioning(true);
      
      // 等待淡出完成后切换文字并重新播放动画
      const timer = setTimeout(() => {
        setDisplayText(text);
        setAnimationKey(k => k + 1);
        setIsTransitioning(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [text, displayText]);

  return (
    <div 
      className={`transition-opacity duration-300 ${className}`}
      style={{ opacity: isTransitioning ? 0 : 1 }}
    >
      <DrawnTitleInner key={animationKey} text={displayText} />
    </div>
  );
}
