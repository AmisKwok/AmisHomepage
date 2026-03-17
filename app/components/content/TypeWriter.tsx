"use client";

import { useState, useEffect, useRef } from "react";

interface TypeWriterProps {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delay?: number;
  pauseTime?: number;
}

type Phase = "typing" | "pausing" | "deleting" | "idle";

export default function TypeWriter({
  texts,
  typeSpeed = 120,
  deleteSpeed = 80,
  delay = 800,
  pauseTime = 2000,
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  
  // 使用ref来存储可变值
  const displayTextRef = useRef("");
  const currentIndexRef = useRef(0);
  const textsRef = useRef(texts);
  const typeSpeedRef = useRef(typeSpeed);
  const deleteSpeedRef = useRef(deleteSpeed);
  
  // 同步ref和props
  useEffect(() => { textsRef.current = texts; }, [texts]);
  useEffect(() => { typeSpeedRef.current = typeSpeed; }, [typeSpeed]);
  useEffect(() => { deleteSpeedRef.current = deleteSpeed; }, [deleteSpeed]);
  useEffect(() => { displayTextRef.current = displayText; }, [displayText]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  // 初始延迟
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
      const newText = targetText.slice(0, prev.length + 1);
      setDisplayText(newText);
      
      if (newText.length >= targetText.length) {
        // 打字完成，进入暂停
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
