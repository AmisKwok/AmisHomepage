/**
 * 站点配置导出文件
 * 从 config.json 读取配置并导出为类型安全的模块
 */
import configData from "../config.json";
import type { SiteConfig, ProfileConfig, LinkConfig, Project, Skill, TechItem, Language, I18nText, GuestbookConfig, FriendLinksConfig } from "../types";

// 应用配置类型定义
interface AppConfig {
  site: SiteConfig;           // 站点基础信息
  profile: ProfileConfig;     // 个人资料配置
  links: Record<string, LinkConfig>;  // 社交链接配置
  projects: {
    featured: Project[];      // 精选项目列表
    moreProjectsUrl: string;  // 更多项目链接
  };
  skills: Skill[];            // 技能列表
  techStack: {
    backend: TechItem[];      // 后端技术栈
    mobile: TechItem[];       // 移动端技术栈
    frontend: TechItem[];     // 前端技术栈
  };
  translations: {
    zh: Record<string, string>;  // 中文翻译
    en: Record<string, string>;  // 英文翻译
  };
  guestbook?: GuestbookConfig;   // 留言板配置
  friendLinks?: FriendLinksConfig; // 友链配置
}

const appConfig: AppConfig = configData as AppConfig;

// 社交链接配置
export const linksConfig = appConfig.links;

// 精选项目配置
export const projectsConfig: Project[] = appConfig.projects.featured;

// 更多项目链接配置
export const moreProjectsConfig = {
  url: appConfig.projects.moreProjectsUrl,
  title: {
    zh: appConfig.translations.zh.moreProjects || "查看更多项目",
    en: appConfig.translations.en.moreProjects || "View More Projects",
  },
};

// 技能列表配置
export const skillsConfig: Skill[] = appConfig.skills;

// 社交媒体配置（邮箱）
export const socialConfig = {
  email: {
    url: appConfig.links.email?.url || "",
    icon: appConfig.links.email?.icon || "fas fa-envelope",
    color: "from-blue-400 to-blue-600",
  },
};

// 技术栈配置
export const techStackConfig = {
  backend: appConfig.techStack.backend as TechItem[],
  mobile: appConfig.techStack.mobile as TechItem[],
  frontend: appConfig.techStack.frontend as TechItem[],
};

// 个人信息配置
export const aboutMeConfig = {
  name: appConfig.profile.name,           // 姓名
  location: appConfig.profile.location,   // 所在地
  focus: appConfig.profile.focus,         // 专注领域
  hobbies: appConfig.profile.hobbies,     // 兴趣爱好
  currentFocus: appConfig.profile.currentFocus, // 当前专注
  motto: appConfig.profile.motto,         // 座右铭
};

// 留言板配置（Waline）
export const guestbookConfig = appConfig.guestbook || {
  enabled: false,
  walineUrl: "",
  title: { zh: "留言板", en: "Guestbook" }
};

// 友链配置
export const friendLinksConfig = appConfig.friendLinks || {
  enabled: false,
  title: { zh: "友链", en: "Friend Links" },
  links: []
};

// 站点基础配置
export const siteConfig = appConfig.site;
export type { Language, I18nText };
