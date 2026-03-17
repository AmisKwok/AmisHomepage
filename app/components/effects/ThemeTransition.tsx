"use client";

import { useThemeStore } from "../../stores/theme-store";

const BLUR_FADE_ANIMATION_NAME = "blurFade";
const MAX_BLUR = 8;

export default function ThemeTransition() {
  const { isTransitioning } = useThemeStore();

  if (!isTransitioning) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] pointer-events-none bg-black/30 backdrop-blur-md"
        style={{
          animation: `${BLUR_FADE_ANIMATION_NAME} 0.5s ease-in-out forwards`,
        }}
      />
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
