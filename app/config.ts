// 链接配置
export const linksConfig = {
  blog: {
    url: "https://www.amisblog.cn",
    title: {
      zh: "Amis的博客",
      en: "Amis's Blog",
    },
    description: {
      zh: "记录技术文章和生活感悟",
      en: "Technical articles and life insights",
    },
  },
  github: {
    url: "https://github.com/AmisKwok",
    title: {
      zh: "GitHub",
      en: "GitHub",
    },
    description: {
      zh: "开源项目和代码仓库",
      en: "Open source projects and code repositories",
    },
  },
  gitee: {
    url: "https://gitee.com/AmisKwok",
    title: {
      zh: "Gitee",
      en: "Gitee",
    },
    description: {
      zh: "国内代码托管平台",
      en: "Domestic code hosting platform",
    },
  },
  email: {
    url: "mailto:amiskwokk@gmail.com",
    title: {
      zh: "邮箱",
      en: "Email",
    },
  },
};

// 技术栈配置
export interface TechItem {
  name: string;
  color: string;
  icon: string;
}

export const techStackConfig = {
  backend: [
    { name: "Java", color: "bg-orange-500", icon: "fab fa-java" },
    { name: "Spring Boot", color: "bg-green-600", icon: "fas fa-leaf" },
    { name: "MySQL", color: "bg-blue-600", icon: "fas fa-database" },
    { name: "Redis", color: "bg-red-500", icon: "fas fa-bolt" },
  ] as TechItem[],
  mobile: [
    { name: "Flutter", color: "bg-blue-500", icon: "fas fa-mobile-alt" },
    { name: "Dart", color: "bg-blue-700", icon: "fas fa-code" },
    { name: "Android", color: "bg-green-500", icon: "fab fa-android" },
  ] as TechItem[],
  frontend: [
    { name: "Next.js", color: "bg-gray-800", icon: "fas fa-bolt" },
    { name: "TypeScript", color: "bg-blue-600", icon: "fab fa-js" },
    { name: "React", color: "bg-cyan-500", icon: "fab fa-react" },
  ] as TechItem[],
};

// 关于我配置
export const aboutMeConfig = {
  name: "AmisKwok",
  location: {
    zh: "中国 🇨🇳",
    en: "China 🇨🇳",
  },
  focus: {
    zh: "后端 & 移动端开发",
    en: "Backend & Mobile Dev",
  },
  hobbies: {
    zh: "编程、学习、开源",
    en: "Coding, Learning, Open Source",
  },
  currentFocus: [
    {
      icon: "fas fa-satellite text-blue-400",
      text: {
        zh: "正在专注于后端服务与移动应用开发",
        en: "Working on Backend Services & Mobile Apps",
      },
    },
    {
      icon: "fas fa-seedling text-green-400",
      text: {
        zh: "正在学习云原生与微服务架构",
        en: "Learning Cloud Native & Microservices",
      },
    },
    {
      icon: "fas fa-comments text-yellow-400",
      text: {
        zh: "欢迎交流 Java、Flutter、后端开发",
        en: "Ask me about Java, Flutter, Backend Dev",
      },
    },
  ],
  motto: {
    zh: "至繁归于至简",
    en: "Simplicity is the ultimate sophistication",
  },
};

// 多语言文本配置
export const translations = {
  zh: {
    siteTitle: "Amis的主页",
    typeWriterText: "记录技术文章和生活感悟",
    typeWriterText2: "热爱编程，追求极致，永不止步",
    quickLinks: "快速链接",
    footer: "© 2026 Amis的个人主页. All Rights Reserved.",
    nav: {
      blog: "Blog",
      github: "GitHub",
      gitee: "Gitee",
    },
    aboutMe: "关于我",
    techStack: "技术栈",
    backend: "后端",
    mobile: "移动端",
    frontend: "前端",
    currentFocus: "当前关注",
  },
  en: {
    siteTitle: "Amis's Homepage",
    typeWriterText: "Recording technical articles and life insights",
    typeWriterText2: "Passionate about coding, pursuing excellence, never stopping",
    quickLinks: "Quick Links",
    footer: "© 2026 Amis's Personal Homepage. All Rights Reserved.",
    nav: {
      blog: "Blog",
      github: "GitHub",
      gitee: "Gitee",
    },
    aboutMe: "About Me",
    techStack: "Tech Stack",
    backend: "Backend",
    mobile: "Mobile",
    frontend: "Frontend",
    currentFocus: "Current Focus",
  },
};

export type Language = "zh" | "en";
