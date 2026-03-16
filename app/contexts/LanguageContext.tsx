/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { translations, Language } from "../config";

type Translations = typeof translations;
type TranslationKey = keyof Translations["zh"];

// 定义每个key的返回类型
type TranslationReturnType = {
  siteTitle: string;
  typeWriterText: string;
  typeWriterText2: string;
  quickLinks: string;
  footer: string;
  nav: Record<string, string>;
  aboutMe: string;
  techStack: string;
  backend: string;
  mobile: string;
  frontend: string;
  currentFocus: string;
  featuredProjects: string;
  skills: string;
  viewProject: string;
  moreProjects: string;
  totalMusic: (count: number) => string;
  openMusicPlayer: string;
  listLoop: string;
  listNoLoop: string;
  singleLoop: string;
  singleNoLoop: string;
  noMusicSelected: string;
  cancelMute: string;
  mute: string;
  playlist: string;
  switchToEnglish: string;
  switchToChinese: string;
  switchToLightMode: string;
  switchToDarkMode: string;
  configManagement: string;
  locationLoading: string;
  locationDenied: string;
  cursorSettings: string;
  siteComponents: string;
  localTimeComponent: string;
  enableLocalTime: string;
  customCursor: string;
  enableCustomCursor: string;
  cursorFile: string;
  cursorFileHint: string;
  cursorFileError: string;
  cursorUploadSuccess: string;
  cursorUploadError: string;
  resetCursor: string;
  cursorPreviewHint: string;
  expandAll: string;
  collapseAll: string;
  quickNav: string;
  clear: string;
  backToHome: string;
  configDescription: string;
  githubAuth: string;
  pemKeyFile: string;
  pemKeyHint: string;
  pemKeyLoaded: string;
  siteInfo: string;
  siteName: string;
  siteTitleLabel: string;
  siteUrl: string;
  footerSettings: string;
  footerText: string;
  author: string;
  siteDescription: string;
  keywords: string;
  backgroundImage: string;
  darkTheme: string;
  lightTheme: string;
  textColor: string;
  textSecondaryColor: string;
  profile: string;
  name: string;
  avatar: string;
  location: string;
  focus: string;
  hobbies: string;
  motto: string;
  typeWriterText1Label: string;
  typeWriterText2Label: string;
  links: string;
  linkUrl: string;
  linkTitle: string;
  linkDescription: string;
  linkIcon: string;
  showLink: string;
  skillColor: string;
  skillIcon: string;
  retry: string;
  uploadPemFirst: string;
  fileUploadSuccess: string;
  fileUploadFailed: string;
  configSaveSuccess: string;
  configSaveFailed: string;
  loadConfigFailed: string;
  saveToGithub: string;
  saving: string;
  addProject: string;
  projectName: string;
  projectUrl: string;
  projectImage: string;
  projectIcon: string;
  projectGradient: string;
  projectDescription: string;
  projectTags: string;
  delete: string;
  description: string;
  chinese: string;
  english: string;
  addSkill: string;
  level: string;
  icon: string;
  uploadMusic: string;
  musicUploadHint: string;
  noMusic: string;
  loading: string;
  weekdays: string[];
  months: string[];
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <K extends TranslationKey>(key: K) => TranslationReturnType[K];
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 获取系统语言
function getSystemLanguage(): Language {
  if (typeof window === "undefined") return "en";
  
  const systemLang = navigator.language.toLowerCase();
  // 如果是中文（包括简体、繁体等），返回中文
  if (systemLang.startsWith("zh")) {
    return "zh";
  }
  // 其他语言默认返回英文
  return "en";
}

// 获取初始语言
function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  
  // 优先从 localStorage 读取
  const savedLang = localStorage.getItem("language") as Language | null;
  if (savedLang && (savedLang === "zh" || savedLang === "en")) {
    return savedLang;
  }
  
  // 否则根据系统语言
  return getSystemLanguage();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化语言
  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    setIsInitialized(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    // 确保只接受中文或英文
    const validLang: Language = lang === "zh" ? "zh" : "en";
    setLanguageState(validLang);
    // 保存到 localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("language", validLang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === "zh" ? "en" : "zh";
    setLanguage(newLang);
  }, [language, setLanguage]);

  // 翻译函数
  const t = useCallback(
    <K extends TranslationKey>(key: K): TranslationReturnType[K] => {
      return translations[language][key] as TranslationReturnType[K];
    },
    [language]
  );

  // 初始化完成前不渲染子组件，避免语言闪烁
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
