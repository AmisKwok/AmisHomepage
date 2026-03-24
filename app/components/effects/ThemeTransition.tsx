/**
 * 主题切换过渡动画组件
 * 在主题切换时显示模糊淡入淡出效果
 */
"use client";

import { useThemeStore } from "../../stores/theme-store";

// 动画名称常量
const BLUR_FADE_ANIMATION_NAME = "blurFade";
// 最大模糊值
const MAX_BLUR = 8;

export default function ThemeTransition() {
  const { isTransitioning } = useThemeStore();

  // 不在过渡状态时不渲染
  if (!isTransitioning) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-9999 pointer-events-none bg-black/30 backdrop-blur-md"
        style={{
          animation: `${BLUR_FADE_ANIMATION_NAME} 0.5s ease-in-out forwards`,
        }}
      />
      {/* 动画关键帧定义 */}
      <style jsx>{`
        @keyframes ${BLUR_FADE_ANIMATION_NAME} {
          0% {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          40% {
            opacity: 1;
            backdrop-filter: blur(${MAX_BLUR}px);
          }
          60% {
            opacity: 1;
            backdrop-filter: blur(${MAX_BLUR}px);
          }
          100% {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
        }
      `}</style>
    </>
  );
}
