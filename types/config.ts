export type Language = "zh" | "en";

export type I18nText = {
  zh: string;
  en: string;
};

export interface TypeWriterEffects {
  glitchEffect: boolean;
  colorGradient: boolean;
}

export interface SiteConfig {
  name: string;
  title: string;
  url: string;
  ogImage: string;
  author: string;
  description: I18nText;
  keywords: string[];
  footer: I18nText;
}

export interface ProfileConfig {
  name: string;
  avatar: string;
  location: I18nText;
  focus: I18nText;
  hobbies: I18nText;
  motto: I18nText;
  typeWriterTexts: {
    zh: string[];
    en: string[];
  };
  currentFocus: Array<{
    icon: string;
    text: I18nText;
  }>;
}

export interface LinkConfig {
  url: string;
  show?: boolean;
  title: I18nText;
  description?: I18nText;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  description: I18nText;
  url: string;
  image: string;
  tags: string[];
  icon: string;
  gradient: string;
}

export interface Skill {
  name: string;
  level: number;
  color: string;
  icon: string;
}

export interface TechItem {
  name: string;
  color: string;
  icon: string;
}

export interface GuestbookConfig {
  enabled: boolean;
  walineUrl: string;
  title: I18nText;
}

export interface FriendLink {
  id: string;
  url: string;
  name: string;
  avatar: string;
  description: I18nText;
}

export interface FriendLinksConfig {
  enabled: boolean;
  title: I18nText;
  links: FriendLink[];
}
