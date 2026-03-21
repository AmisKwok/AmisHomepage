"use client";

import { useEffect, useState, useCallback } from "react";
import { useThemeStore } from "../../stores/theme-store";
import { useConfigStore } from "../../stores/config-store";

export default function CustomCursor() {
	const { theme } = useThemeStore();
	const { siteContent } = useConfigStore();
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isVisible, setIsVisible] = useState(false);

	const showCustomCursor = siteContent?.showCustomCursor ?? false;
	const customCursorPath = siteContent?.customCursorPath ?? "/cursors/watermelon.cur";

	const handleMouseMove = useCallback((e: MouseEvent) => {
		setPosition({ x: e.clientX, y: e.clientY });
		if (!isVisible) setIsVisible(true);
	}, [isVisible]);

	useEffect(() => {
		if (typeof window !== "undefined" && window.innerWidth < 768) return;
		
		if (showCustomCursor && customCursorPath) {
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

			return () => {
				const existingStyle = document.getElementById("custom-cursor-style");
				if (existingStyle) {
					existingStyle.remove();
				}
			};
		}
	}, [showCustomCursor, customCursorPath]);

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

	if (typeof window !== "undefined" && window.innerWidth < 768) {
		return null;
	}

	if (showCustomCursor) {
		return null;
	}

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
				background:
					theme === "dark"
						? "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 30%, transparent 70%)"
						: "radial-gradient(circle, rgba(251, 146, 60, 0.12) 0%, rgba(251, 146, 60, 0.04) 30%, transparent 70%)",
			}}
		/>
	);
}
