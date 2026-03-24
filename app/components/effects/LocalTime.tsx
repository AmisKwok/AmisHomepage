/**
 * 本地时间组件
 * 显示当前时间和日历
 * 支持农历显示、节假日标记（仅中文环境）
 * 点击可展开查看完整日历
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useThemeStore } from "../../stores/theme-store";
import { useLanguageStore, useTranslation } from "../../stores/language-store";

/**
 * 获取中国生肖
 * @param year - 年份
 * @returns 生肖名称
 */
function getChineseZodiac(year: number): string {
  const zodiacs = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  return zodiacs[(year - 4) % 12];
}

/**
 * 获取干支纪年
 * @param year - 年份
 * @returns 干支年份
 */
function getGanZhi(year: number): string {
  const tiangan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const dizhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  return tiangan[(year - 4) % 10] + dizhi[(year - 4) % 12];
}

/**
 * 公历转农历
 * @param year - 公历年
 * @param month - 公历月
 * @param day - 公历日
 * @returns 农历日期信息
 */
function solarToLunar(year: number, month: number, day: number): { lunarYear: number; lunarMonth: number; lunarDay: number; isLeap: boolean } {
  const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0,
    0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570,
    0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3,
    0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0,
    0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0,
    0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4,
    0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0,
    0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, 0x095b0, 0x049b0,
    0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5,
    0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0,
    0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176,
    0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0,
    0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0,
    0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577,
    0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63,
  ];

  const baseDate = new Date(1900, 0, 31);
  const objDate = new Date(year, month - 1, day);
  let offset = Math.floor((objDate.getTime() - baseDate.getTime()) / 86400000);
  let i, leap = 0, temp = 0;
  let lunarYear = 1900;

  for (i = 1900; i < 2101 && offset > 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
    lunarYear = i;
  }

  if (offset < 0) {
    offset += temp;
    lunarYear--;
  }

  leap = leapMonth(lunarYear);
  let isLeap = false;
  let lunarMonth = 1;

  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === (leap + 1) && isLeap === false) {
      --i;
      isLeap = true;
      temp = leapDays(lunarYear);
    } else {
      temp = monthDays(lunarYear, i);
    }

    if (isLeap === true && i === (leap + 1)) isLeap = false;
    offset -= temp;
    lunarMonth = i;
  }

  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --lunarMonth;
    }
  }

  if (offset < 0) {
    offset += temp;
    --lunarMonth;
  }

  const lunarDay = offset + 1;
  return { lunarYear, lunarMonth, lunarDay, isLeap };

  function lYearDays(y: number): number {
    let i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
      sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return sum + leapDays(y);
  }

  function leapMonth(y: number): number {
    return lunarInfo[y - 1900] & 0xf;
  }

  function leapDays(y: number): number {
    if (leapMonth(y)) {
      return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
    } else {
      return 0;
    }
  }

  function monthDays(y: number, m: number): number {
    return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
  }
}

function getHoliday(date: Date, holidayData: any): { name: string; type: 'holiday' | 'workday' } | null {
  if (!holidayData) return null;
  
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const shortDateKey = `${month}-${day}`;
  
  if (holidayData.holidays && holidayData.holidays[shortDateKey]) {
    const holiday = holidayData.holidays[shortDateKey];
    if (holiday.holiday === true) {
      return { name: holiday.name, type: 'holiday' };
    } else {
      return { name: holiday.name || '补班', type: 'workday' };
    }
  }
  
  if (holidayData.workdays && holidayData.workdays[shortDateKey]) {
    return { name: '补班', type: 'workday' };
  }
  
  return null;
}

function isChinaTimezone(): boolean {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone === "Asia/Shanghai" || timezone === "Asia/Beijing" || timezone === "Asia/Chongqing";
}

function getCachedHolidayData(year: number): { data: any; year: number } | null {
  if (typeof window === 'undefined') return null;
  const storageKey = `holiday-data-${year}`;
  const cachedData = localStorage.getItem(storageKey);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      return { data: parsed, year };
    } catch {
      localStorage.removeItem(storageKey);
    }
  }
  return null;
}

export default function LocalTime() {
  const { theme } = useThemeStore();
  const { language } = useLanguageStore();
  const { t } = useTranslation();
  const [time, setTime] = useState<Date | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [holidayData, setHolidayData] = useState<any>(null);
  const [lastFetchedYear, setLastFetchedYear] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchHolidayData = useCallback(async (year: number) => {
    try {
      const response = await fetch(`/api/holiday?year=${year}`);
      const data = await response.json();
      if (data.success) {
        setHolidayData(data);
        setLastFetchedYear(year);
        const storageKey = `holiday-data-${year}`;
        localStorage.setItem(storageKey, JSON.stringify(data));
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('holiday-data-')) {
            const keyYear = parseInt(key.replace('holiday-data-', ''));
            if (!isNaN(keyYear) && keyYear < year - 2) {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch holiday data:', error);
    }
  }, []);

  useEffect(() => {
    if (language === "zh" && isChinaTimezone() && time) {
      const year = time.getFullYear();
      
      if (year !== lastFetchedYear) {
        const cached = getCachedHolidayData(year);
        if (cached) {
          setHolidayData(cached.data);
          setLastFetchedYear(cached.year);
        } else {
          fetchHolidayData(year);
        }
      }
    }
  }, [language, time, lastFetchedYear, fetchHolidayData]);

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
    const weekdays = t('weekdays', { returnObjects: true }) as string[];
    const months = t('months', { returnObjects: true }) as string[];
    const day = weekdays[date.getDay()];
    const month = months[date.getMonth()];
    const dateNum = date.getDate();
    
    if (language === "zh") {
      return `${day} ${month}${dateNum}日`;
    }
    return `${day}, ${month} ${dateNum}`;
  };

  const getLunarDate = (date: Date) => {
    const lunar = solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const lunarMonths = ["正月", "二月", "三月", "四月", "五月", "六月", 
                        "七月", "八月", "九月", "十月", "冬月", "腊月"];
    const lunarDays = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
                      "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
                      "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
    
    return {
      year: getGanZhi(lunar.lunarYear),
      zodiac: getChineseZodiac(lunar.lunarYear),
      month: lunar.isLeap ? `闰${lunarMonths[lunar.lunarMonth - 1]}` : lunarMonths[lunar.lunarMonth - 1],
      day: lunarDays[lunar.lunarDay - 1],
    };
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
    const weekdays = t('weekdays', { returnObjects: true }) as string[];
    const months = t('months', { returnObjects: true }) as string[];
    
    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = 
        i === time.getDate() && 
        currentMonth.getMonth() === time.getMonth() && 
        currentMonth.getFullYear() === time.getFullYear();
      
      const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const holiday = language === "zh" && isChinaTimezone() ? getHoliday(checkDate, holidayData) : null;
      
      days.push(
        <div
          key={i}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all cursor-pointer relative ${
            isToday
              ? "bg-blue-500 text-white font-bold"
              : theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-200"
          }`}
          title={holiday ? holiday.name : undefined}
        >
          {i}
          {holiday && !isToday && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{
              backgroundColor: holiday.type === 'holiday' ? (theme === 'dark' ? '#f87171' : '#dc2626') : (theme === 'dark' ? '#60a5fa' : '#2563eb')
            }}></span>
          )}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col gap-2">
        {language === "zh" && isChinaTimezone() && time && (() => {
          const lunarDate = getLunarDate(time);
          const todayHoliday = getHoliday(time, holidayData);
          return (
            <div className="text-center mb-2">
              <div className="text-xs opacity-70">
                {lunarDate.year}年 · {lunarDate.zodiac}年
              </div>
              <div className="text-xs opacity-70">
                {lunarDate.month}{lunarDate.day}
              </div>
              {todayHoliday && (
                <div className={`text-xs font-bold mt-1 ${
                  todayHoliday.type === 'holiday'
                    ? theme === "dark" ? "text-red-400" : "text-red-600"
                    : theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}>
                  {todayHoliday.type === 'holiday' ? '🎉' : '💼'} {todayHoliday.name}
                </div>
              )}
            </div>
          );
        })()}
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
        width: isExpanded ? "350px" : "150px",
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
            isExpanded ? "max-h-[400px] opacity-100 mt-3 pt-3 border-t border-white/10" : "max-h-0 opacity-0"
          }`}
        >
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
}
