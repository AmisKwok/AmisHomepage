/**
 * 滚动动画 Hook
 * 使用 Intersection Observer API 检测元素是否进入视口
 * 用于实现滚动时的元素入场动画
 */
"use client";

import { useEffect, useRef, useState } from "react";

// Hook 配置选项接口
interface UseScrollAnimationOptions {
  threshold?: number;    // 触发阈值 (0-1)
  rootMargin?: string;   // 根元素边距
  triggerOnce?: boolean; // 是否只触发一次
}

/**
 * 滚动动画 Hook
 * @param options - 配置选项
 * @returns ref - 绑定到目标元素的 ref
 * @returns isVisible - 元素是否可见
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,      // 默认 10% 可见时触发
    rootMargin = "0px",   // 默认无边距
    triggerOnce = true,   // 默认只触发一次
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 创建 Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 如果只触发一次，则取消观察
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // 清理函数
    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
