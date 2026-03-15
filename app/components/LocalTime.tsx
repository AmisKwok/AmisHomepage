"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function LocalTime() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [time, setTime] = useState<Date | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  if (!time) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === "zh" ? "zh-CN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    const weekdays = t("weekdays");
    const months = t("months");
    const day = weekdays[date.getDay()];
    const month = months[date.getMonth()];
    const dateNum = date.getDate();
    
    if (language === "zh") {
      return `${day} ${month}${dateNum}日`;
    }
    return `${day}, ${month} ${dateNum}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const weekdays = t("weekdays");
    const months = t("months");
    
    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = 
        i === time.getDate() && 
        currentMonth.getMonth() === time.getMonth() && 
        currentMonth.getFullYear() === time.getFullYear();
      
      days.push(
        <div
          key={i}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all cursor-pointer ${
            isToday
              ? "bg-blue-500 text-white font-bold"
              : theme === "dark"
                ? "hover:bg-white/10"
                : "hover:bg-gray-200"
          }`}
        >
          {i}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
            }}
            className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-200"
            }`}
          >
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <span className="font-semibold text-sm">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
            }}
            className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-200"
            }`}
          >
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekdays.map((day) => (
            <div key={day} className="w-8 h-6 flex items-center justify-center text-xs opacity-50">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      onClick={() => setIsExpanded(!isExpanded)}
      className={`hidden md:block fixed top-6 left-6 z-30 rounded-2xl border cursor-pointer overflow-hidden transition-all duration-500 ease-out ${
        theme === "dark"
          ? "bg-white/10 backdrop-blur-xl border-white/20 text-white/90 hover:bg-white/15 hover:border-white/30 shadow-lg shadow-black/20"
          : "bg-white/50 backdrop-blur-xl border-gray-200/50 text-gray-700 hover:bg-white/70 hover:border-gray-300/50 shadow-lg shadow-gray-300/20"
      }`}
      style={{
        width: isExpanded ? "300px" : "150px",
      }}
    >
      <div className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-xl font-mono font-semibold tracking-wider">
            {formatTime(time)}
          </span>
          <span className="text-xs opacity-70 whitespace-nowrap">
            {formatDate(time)}
          </span>
        </div>
        
        <div 
          className={`overflow-hidden transition-all duration-500 ease-out ${
            isExpanded ? "max-h-[300px] opacity-100 mt-3 pt-3 border-t border-white/10" : "max-h-0 opacity-0"
          }`}
        >
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
}
