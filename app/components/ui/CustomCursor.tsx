/**
 * 自定义光标组件
 * 支持两种模式：
 * 1. 自定义光标图片（.cur 文件）
 * 2. 光标跟随光晕效果
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useThemeStore } from "../../stores/theme-store";
import { useConfigStore } from "../../stores/config-store";

export default function CustomCursor() {
	const { theme } = useThemeStore();
	const { siteContent } = useConfigStore();
	// 光标位置状态
	const [position, setPosition] = useState({ x: 0, y: 0 });
	// 光标可见性状态
	const [isVisible, setIsVisible] = useState(false);

	// 配置项
	const showCustomCursor = siteContent?.showCustomCursor ?? false;
	const customCursorPath = siteContent?.customCursorPath ?? "/cursors/watermelon.cur";

	// 鼠标移动处理
	const handleMouseMove = useCallback((e: MouseEvent) => {
		setPosition({ x: e.clientX, y: e.clientY });
		if (!isVisible) setIsVisible(true);
	}, [isVisible]);

	// 自定义光标模式：注入 CSS 样式
	useEffect(() => {
		// 移动端不启用自定义光标
		if (typeof window !== "undefined" && window.innerWidth < 768) return;
		
		if (showCustomCursor && customCursorPath) {
			// 创建自定义光标样式
			const style = document.createElement("style");
			style.id = "custom-cursor-style";
			style.textContent = `
				:root {
					--custom-cursor: url('${customCursorPath}'), default;
				}
				html, body, div, span, p, h1, h2, h3, h4, h5, h6, 
				section, article, main, header, footer, nav, aside,
				ul, ol, li, dl, dt, dd, figure, figcaption,
				table, thead, tbody, tfoot, tr, th, td,
				form, fieldset, legend, label,
				img, picture, video, audio, canvas, svg,
				details, summary {
					cursor: var(--custom-cursor);
				}
			`;
			document.head.appendChild(style);

			// 清理函数：移除自定义样式
			return () => {
				const existingStyle = document.getElementById("custom-cursor-style");
				if (existingStyle) {
					existingStyle.remove();
				}
			};
		}
	}, [showCustomCursor, customCursorPath]);

	// 光晕跟随模式：监听鼠标移动
	useEffect(() => {
		if (showCustomCursor) return;

		const handleMouseLeave = () => setIsVisible(false);

		window.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [handleMouseMove, showCustomCursor]);

	// 移动端不渲染
	if (typeof window !== "undefined" && window.innerWidth < 768) {
		return null;
	}

	// 自定义光标模式：不渲染光晕
	if (showCustomCursor) {
		return null;
	}

	// 渲染光晕效果
	return (
		<div
			className="pointer-events-none fixed z-99999 rounded-full"
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				width: "400px",
				height: "400px",
				transform: "translate(-50%, -50%)",
				opacity: isVisible ? 1 : 0,
				transition: "opacity 0.3s ease-out",
				// 根据主题设置不同的光晕颜色
				background:
					theme === "dark"
						? "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 30%, transparent 70%)"
						: "radial-gradient(circle, rgba(251, 146, 60, 0.12) 0%, rgba(251, 146, 60, 0.04) 30%, transparent 70%)",
			}}
		/>
	);
}
