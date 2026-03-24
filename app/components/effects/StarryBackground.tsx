/**
 * 星空背景组件
 * 在深色模式下显示动态星空粒子效果
 * 使用 Canvas 绘制漂浮的星星粒子
 */
"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "../../stores/theme-store";

// 粒子接口
interface Particle {
  x: number;       // X 坐标
  y: number;       // Y 坐标
  size: number;    // 大小
  speedX: number;  // X 方向速度
  speedY: number;  // Y 方向速度
  opacity: number; // 透明度
}

export default function StarryBackground() {
  const { theme } = useThemeStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 只在暗色模式下运行
    if (theme !== "dark") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 150;  // 粒子数量

    // 调整画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 创建粒子
    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.3,
    });

    // 初始化粒子
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    const drawParticle = (particle: Particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.fill();
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      particle.opacity += (Math.random() - 0.5) * 0.02;
      particle.opacity = Math.max(0.2, Math.min(0.8, particle.opacity));
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        updateParticle(particle);
        drawParticle(particle);
      });

      connectParticles();

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  // 亮色模式下不渲染
  if (theme !== "dark") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
