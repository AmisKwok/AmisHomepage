/**
 * 打字机效果组件
 * 模拟打字机逐字显示文本的效果
 * 支持多文本循环、打字、暂停、删除等状态
 * 支持故障效果和颜色渐变动画（可通过配置开关控制）
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { useConfigStore } from "../../stores/config-store";
import { useThemeStore } from "../../stores/theme-store";

// 组件属性接口
interface TypeWriterProps {
  texts: string[];       // 要显示的文本数组
  typeSpeed?: number;    // 打字速度（毫秒）
  deleteSpeed?: number;  // 删除速度（毫秒）
  delay?: number;        // 初始延迟（毫秒）
  pauseTime?: number;    // 打字完成后暂停时间（毫秒）
}

// 动画阶段类型
type Phase = "typing" | "pausing" | "deleting" | "idle";

export default function TypeWriter({
  texts,
  typeSpeed = 120,
  deleteSpeed = 80,
  delay = 800,
  pauseTime = 2000,
}: TypeWriterProps) {
  const { siteContent } = useConfigStore();
  const { theme } = useThemeStore();
  
  // 从配置读取效果开关
  const glitchEffect = siteContent?.typeWriterEffects?.glitchEffect ?? false;
  const colorGradient = siteContent?.typeWriterEffects?.colorGradient ?? false;
  const glitchProbability = siteContent?.typeWriterEffects?.glitchProbability ?? 40;
  const glitchInterval = siteContent?.typeWriterEffects?.glitchInterval ?? 1500;
  
  // 当前显示的文本
  const [displayText, setDisplayText] = useState("");
  // 光标可见性
  const [showCursor, setShowCursor] = useState(true);
  // 当前文本索引
  const [currentIndex, setCurrentIndex] = useState(0);
  // 当前动画阶段
  const [phase, setPhase] = useState<Phase>("idle");
  // 故障效果状态
  const [glitchActive, setGlitchActive] = useState(false);
  // 颜色渐变状态
  const [gradientOffset, setGradientOffset] = useState(0);
  
  // 使用 ref 存储可变值，避免 useEffect 依赖问题
  const displayTextRef = useRef("");
  const currentIndexRef = useRef(0);
  const textsRef = useRef(texts);
  const typeSpeedRef = useRef(typeSpeed);
  const deleteSpeedRef = useRef(deleteSpeed);
  
  // 同步 ref 和 props
  useEffect(() => { textsRef.current = texts; }, [texts]);
  useEffect(() => { typeSpeedRef.current = typeSpeed; }, [typeSpeed]);
  useEffect(() => { deleteSpeedRef.current = deleteSpeed; }, [deleteSpeed]);
  useEffect(() => { displayTextRef.current = displayText; }, [displayText]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  // 初始延迟后开始打字
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPhase("typing");
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  // 打字效果
  useEffect(() => {
    if (phase !== "typing") return;
    
    const timeout = setTimeout(() => {
      const prev = displayTextRef.current;
      const targetText = textsRef.current[currentIndexRef.current];
      // 添加一个字符
      const newText = targetText.slice(0, prev.length + 1);
      setDisplayText(newText);
      
      if (newText.length >= targetText.length) {
        // 打字完成，进入暂停阶段
        setTimeout(() => setPhase("pausing"), typeSpeedRef.current);
      }
    }, typeSpeedRef.current);
    
    return () => clearTimeout(timeout);
  }, [phase, displayText]);

  // 暂停效果
  useEffect(() => {
    if (phase !== "pausing") return;
    
    const timeout = setTimeout(() => {
      setPhase("deleting");
    }, pauseTime);
    
    return () => clearTimeout(timeout);
  }, [phase, pauseTime]);

  // 删除效果
  useEffect(() => {
    if (phase !== "deleting") return;
    
    const timeout = setTimeout(() => {
      const prev = displayTextRef.current;
      // 删除一个字符
      const newText = prev.slice(0, -1);
      setDisplayText(newText);
      
      if (newText.length === 0) {
        // 删除完成，切换到下一个文本
        const nextIdx = (currentIndexRef.current + 1) % textsRef.current.length;
        setCurrentIndex(nextIdx);
        setPhase("typing");
      }
    }, deleteSpeedRef.current);
    
    return () => clearTimeout(timeout);
  }, [phase, displayText]);

  // 光标闪烁效果
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // 故障效果：随机触发
  useEffect(() => {
    if (!glitchEffect) return;
    
    const glitchIntervalTimer = setInterval(() => {
      const shouldTrigger = Math.random() * 100 < glitchProbability;
      
      if (shouldTrigger) {
        setGlitchActive(true);
        setTimeout(() => {
          setGlitchActive(false);
        }, 200);
      }
    }, glitchInterval);

    return () => clearInterval(glitchIntervalTimer);
  }, [glitchEffect, glitchProbability, glitchInterval]);

  // 颜色渐变动画（仅暗色主题）
  useEffect(() => {
    if (!colorGradient || theme === "light") return;
    
    const gradientInterval = setInterval(() => {
      setGradientOffset((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(gradientInterval);
  }, [colorGradient, theme]);

  // 计算渐变颜色（仅暗色主题）
  const getGradientStyle = () => {
    if (!colorGradient || theme === "light") return {};
    
    const hue1 = gradientOffset;
    const hue2 = (gradientOffset + 120) % 360;
    const hue3 = (gradientOffset + 240) % 360;
    
    return {
      backgroundImage: `linear-gradient(90deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 60%), hsl(${hue3}, 70%, 60%))`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    };
  };

  return (
    <span className={theme === "light" ? "drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]" : ""}>
      <span 
        style={getGradientStyle()}
        className={glitchEffect && glitchActive ? "glitch-text" : ""}
      >
        {displayText}
      </span>
      {/* 光标 */}
      <span
        className="typed-cursor"
        aria-hidden="true"
        style={{
          opacity: showCursor ? 1 : 0,
          transition: "opacity 0.1s",
        }}
      >
        |
      </span>

      {/* 故障效果样式 */}
      {glitchEffect && (
        <style jsx global>{`
          .glitch-text {
            display: inline-block !important;
            animation: glitch 0.3s ease-in-out !important;
            text-shadow: 
              2px 0 #ff00ff,
              -2px 0 #00ffff !important;
          }
          
          @keyframes glitch {
            0%, 100% {
              transform: translate(0);
              text-shadow: 
                2px 0 #ff00ff,
                -2px 0 #00ffff;
            }
            10% {
              transform: translate(-5px, 3px);
              text-shadow: 
                5px 0 #ff00ff,
                -5px 0 #00ffff;
            }
            20% {
              transform: translate(5px, -3px);
              text-shadow: 
                -5px 0 #ff00ff,
                5px 0 #00ffff;
            }
            30% {
              transform: translate(-3px, -5px);
              text-shadow: 
                3px 0 #ff00ff,
                -3px 0 #00ffff;
            }
            40% {
              transform: translate(3px, 5px);
              text-shadow: 
                -3px 0 #ff00ff,
                3px 0 #00ffff;
            }
            50% {
              transform: translate(-5px, -3px);
              text-shadow: 
                5px 0 #ff00ff,
                -5px 0 #00ffff;
            }
            60% {
              transform: translate(5px, 3px);
              text-shadow: 
                -5px 0 #ff00ff,
                5px 0 #00ffff;
            }
            70% {
              transform: translate(-3px, 5px);
              text-shadow: 
                3px 0 #ff00ff,
                -3px 0 #00ffff;
            }
            80% {
              transform: translate(3px, -5px);
              text-shadow: 
                -3px 0 #ff00ff,
                3px 0 #00ffff;
            }
            90% {
              transform: translate(-5px, 3px);
              text-shadow: 
                5px 0 #ff00ff,
                -5px 0 #00ffff;
            }
          }
        `}</style>
      )}
    </span>
  );
}
