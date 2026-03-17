"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "../../stores/theme-store";

interface Leaf {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  swayAmplitude: number;
  swayFrequency: number;
  time: number;
}

export default function LightBackground() {
  const { theme } = useThemeStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 只在亮色模式下运行
    if (theme !== "light") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const leaves: Leaf[] = [];
    const leafCount = 15;

    const colors = [
      "rgba(101, 67, 33, 0.8)",    // 深棕色
      "rgba(139, 90, 43, 0.75)",   // 赭色
      "rgba(85, 107, 47, 0.8)",    // 深橄榄绿
      "rgba(184, 134, 11, 0.75)",  // 深金黄色
      "rgba(128, 70, 27, 0.8)",    // 红褐色
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createLeaf = (): Leaf => ({
      x: Math.random() * canvas.width,
      y: -50,
      size: Math.random() * 10 + 8,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      swayAmplitude: Math.random() * 30 + 20,
      swayFrequency: Math.random() * 0.002 + 0.001,
      time: Math.random() * 1000,
    });

    const initLeaves = () => {
      leaves.length = 0;
      for (let i = 0; i < leafCount; i++) {
        const leaf = createLeaf();
        leaf.y = Math.random() * canvas.height;
        leaves.push(leaf);
      }
    };

    const drawLeaf = (leaf: Leaf) => {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rotation);
      ctx.globalAlpha = leaf.opacity;

      // 绘制叶子形状
      ctx.beginPath();
      ctx.fillStyle = leaf.color;
      
      // 叶子主体 - 椭圆形状
      ctx.ellipse(0, 0, leaf.size, leaf.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // 叶子脉络
      ctx.beginPath();
      ctx.strokeStyle = "rgba(100, 80, 60, 0.4)";
      ctx.lineWidth = 0.5;
      ctx.moveTo(-leaf.size * 0.8, 0);
      ctx.lineTo(leaf.size * 0.8, 0);
      ctx.stroke();

      // 侧脉
      for (let i = -2; i <= 2; i++) {
        if (i === 0) continue;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(leaf.size * 0.5, i * leaf.size * 0.2);
        ctx.stroke();
      }

      ctx.restore();
    };

    const updateLeaf = (leaf: Leaf) => {
      leaf.time += 1;
      
      // 垂直下落
      leaf.y += leaf.speedY;
      
      // 左右飘动（正弦波）
      leaf.x += Math.sin(leaf.time * leaf.swayFrequency) * 0.5 + leaf.speedX;
      
      // 旋转
      leaf.rotation += leaf.rotationSpeed;

      // 如果飘出底部，重置到顶部
      if (leaf.y > canvas.height + 50) {
        leaf.y = -50;
        leaf.x = Math.random() * canvas.width;
        leaf.color = colors[Math.floor(Math.random() * colors.length)];
      }

      // 左右边界处理
      if (leaf.x < -50) leaf.x = canvas.width + 50;
      if (leaf.x > canvas.width + 50) leaf.x = -50;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      leaves.forEach((leaf) => {
        updateLeaf(leaf);
        drawLeaf(leaf);
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    initLeaves();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  // 暗色模式下不渲染
  if (theme !== "light") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
}
