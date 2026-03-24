/**
 * 打字机效果组件
 * 模拟打字机逐字显示文本的效果
 * 支持多文本循环、打字、暂停、删除等状态
 */
"use client";

import { useState, useEffect, useRef } from "react";

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
  // 当前显示的文本
  const [displayText, setDisplayText] = useState("");
  // 光标可见性
  const [showCursor, setShowCursor] = useState(true);
  // 当前文本索引
  const [currentIndex, setCurrentIndex] = useState(0);
  // 当前动画阶段
  const [phase, setPhase] = useState<Phase>("idle");
  
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

  return (
    <span>
      {displayText}
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
    </span>
  );
}
