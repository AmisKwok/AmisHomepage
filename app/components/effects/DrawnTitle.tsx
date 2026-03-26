/**
 * 手绘标题组件
 * 使用 SVG 实现手绘描边动画效果
 * 文字会逐渐被"绘制"出来
 */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import { useThemeStore } from "../../stores/theme-store";
import { useConfigStore } from "../../stores/config-store";

// 组件属性接口
interface DrawnTitleProps {
  text: string;       // 要显示的文字
  className?: string; // 自定义样式类名
}

function DrawnTitleInner({ text, className = "" }: DrawnTitleProps) {
  const { theme } = useThemeStore();
  const { siteContent } = useConfigStore();
  const [progress, setProgress] = useState(0);
  const [isDrawnComplete, setIsDrawnComplete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  // 生成唯一的 clip ID
  const [clipId] = useState(() => `clip-${Math.random().toString(36).slice(2)}`);
  const textRef = useRef<SVGTextElement>(null);
  const [viewBoxWidth, setViewBoxWidth] = useState(30000);
  
  const hoverPreset = siteContent?.heroTitleEffects?.hoverPreset ?? 'scale';

  // 描边动画
  useEffect(() => {
    const duration = 3000;  // 动画持续时间 3 秒
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);
      
      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsDrawnComplete(true);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);

  // 通用动画相位更新
  useEffect(() => {
    if (isDrawnComplete && isHovered && ['strokeFlow', 'colorFade'].includes(hoverPreset)) {
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 0.05) % (Math.PI * 2));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setAnimationPhase(0);
    }
  }, [hoverPreset, isDrawnComplete, isHovered]);

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
  const glowColor = theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.6)";

  // 计算颜色渐变（用于 colorFade 效果）
  const getColorFadeGradient = () => {
    if (!isDrawnComplete || !isHovered || hoverPreset !== 'colorFade') {
      return null;
    }
    const hue1 = animationPhase * (180 / Math.PI);
    const hue2 = (animationPhase + Math.PI / 3) * (180 / Math.PI);
    const hue3 = (animationPhase + (Math.PI * 2) / 3) * (180 / Math.PI);
    return {
      start: `hsl(${hue1 % 360}, 85%, ${theme === 'dark' ? '65%' : '45%'})`,
      middle: `hsl(${hue2 % 360}, 85%, ${theme === 'dark' ? '70%' : '50%'})`,
      end: `hsl(${hue3 % 360}, 85%, ${theme === 'dark' ? '65%' : '45%'})`,
    };
  };

  // 计算发光模糊值
  const getGlowDeviation = () => {
    if (!isDrawnComplete || !isHovered) {
      return 10;
    }
    if (hoverPreset === 'scale') {
      return 20;
    }
    return 10;
  };

  // 计算描边流动宽度
  const getStrokeFlowWidth = () => {
    if (!isDrawnComplete || !isHovered || hoverPreset !== 'strokeFlow') {
      return 24;
    }
    return 24 + Math.sin(animationPhase) * 12;
  };

  // 计算动画类名
  const getAnimationClassName = () => {
    if (!isDrawnComplete || !isHovered || hoverPreset === 'none') {
      return '';
    }
    switch (hoverPreset) {
      case 'scale':
        return 'scale-105';
      default:
        return '';
    }
  };

  // 计算动画样式
  const getAnimationStyle = () => {
    if (!isDrawnComplete || !isHovered) {
      return {};
    }
    switch (hoverPreset) {
      case 'bounce':
        return { animation: 'bounce 0.6s ease-in-out infinite' };
      case 'wobble':
        return { animation: 'wobble 0.8s ease-in-out infinite' };
      default:
        return {};
    }
  };

  const colorFadeGradient = getColorFadeGradient();
  const currentGradientStart = colorFadeGradient ? colorFadeGradient.start : gradientStart;
  const currentGradientMiddle = colorFadeGradient ? colorFadeGradient.middle : gradientMiddle;
  const currentGradientEnd = colorFadeGradient ? colorFadeGradient.end : gradientEnd;
  const glowDeviation = getGlowDeviation();
  const strokeWidth = getStrokeFlowWidth();

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      style={{ 
        minHeight: '100px',
        ...getAnimationStyle()
      }}
    >
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes wobble {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          15% { transform: translateX(-25px) rotate(-5deg); }
          30% { transform: translateX(20px) rotate(3deg); }
          45% { transform: translateX(-15px) rotate(-3deg); }
          60% { transform: translateX(10px) rotate(2deg); }
          75% { transform: translateX(-5px) rotate(-1deg); }
        }
      `}</style>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className={`w-full h-auto max-w-full transition-all duration-500 ease-out ${getAnimationClassName()}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseEnter={() => isDrawnComplete && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <defs>
          <linearGradient id={`textGradient-${clipId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentGradientStart} />
            <stop offset="50%" stopColor={currentGradientMiddle} />
            <stop offset="100%" stopColor={currentGradientEnd} />
          </linearGradient>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={`${progress * viewBoxWidth}`} height={viewBoxHeight} />
          </clipPath>
          <filter id={`glow-${clipId}`}>
            <feGaussianBlur stdDeviation={glowDeviation} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <text
          ref={textRef}
          x={textX}
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={`url(#textGradient-${clipId})`}
          stroke={strokeColor}
          strokeWidth={
            hoverPreset === 'strokeFlow' ? strokeWidth :
            (isDrawnComplete && isHovered && hoverPreset === 'scale' ? "32" : "24")
          }
          fontSize={fontSize}
          fontFamily="var(--font-zcool-qingke), 'PingFang SC', 'Microsoft YaHei', sans-serif"
          fontWeight="400"
          className={`transition-all duration-300 ${
            theme === "dark" ? "drop-shadow-lg" : "drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]"
          }`}
          filter={`url(#glow-${clipId})`}
          clipPath={`url(#${clipId})`}
          style={{
            textShadow: (isDrawnComplete && isHovered && hoverPreset === 'scale')
              ? `0 0 30px ${glowColor}, 0 0 60px ${glowColor}` 
              : 'none',
            transition: hoverPreset === 'strokeFlow' ? 'none' : 'stroke-width 0.3s ease-out, text-shadow 0.3s ease-out'
          }}
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
