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

// 项目精选配置
export interface Project {
  id: string;
  name: string;
  description: {
    zh: string;
    en: string;
  };
  url: string;
  image: string;
  tags: string[];
  icon: string;
  gradient: string;
}

export const projectsConfig: Project[] = [
  {
    id: "vibe-music-server",
    name: "Vibe Music Server",
    description: {
      zh: "基于 Spring Boot 3 的高性能音乐服务后端系统，支持高并发访问、MinIO 分布式存储、Redis 智能缓存",
      en: "High-performance music service backend based on Spring Boot 3, supporting high concurrency, MinIO distributed storage, and Redis intelligent caching",
    },
    url: "https://github.com/AmisKwok/vibe-music-server",
    image: "/images/index3.jpg",
    tags: ["Spring Boot", "Java", "MySQL", "Redis", "MinIO"],
    icon: "fas fa-server",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    id: "vibe-music-app",
    name: "Vibe Music App",
    description: {
      zh: "基于 Flutter 的跨平台音乐播放器，支持 Android、iOS、Web 和桌面端",
      en: "Cross-platform music player based on Flutter, supporting Android, iOS, Web, and desktop",
    },
    url: "https://github.com/AmisKwok/vibe-music-app",
    image: "/images/index2.jpg",
    tags: ["Flutter", "Dart", "GetX", "Material Design"],
    icon: "fas fa-music",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "amis-homepage",
    name: "Amis's Homepage",
    description: {
      zh: "个人主页项目，支持亮色/暗色主题切换、多语言、动态背景效果",
      en: "Personal homepage with light/dark theme switching, multi-language support, and dynamic backgrounds",
    },
    url: "https://github.com/AmisKwok/AmisHomepage",
    image: "/images/index5.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    icon: "fas fa-home",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "amis-blog-demo",
    name: "Amis's Blog Demo",
    description: {
      zh: "个人博客系统，支持 Markdown 编辑、图片管理、项目展示等功能",
      en: "Personal blog system with Markdown editing, image management, and project showcase",
    },
    url: "https://github.com/AmisKwok/amis-s-blog-demo",
    image: "/images/index6.jpg",
    tags: ["Next.js", "React", "Markdown", "Tailwind CSS"],
    icon: "fas fa-blog",
    gradient: "from-emerald-500 to-teal-600",
  },
];

// 更多项目配置
export const moreProjectsConfig = {
  url: "https://github.com/AmisKwok",
  title: {
    zh: "查看更多项目",
    en: "View More Projects",
  },
};

// 技能配置
export interface Skill {
  name: string;
  level: number;
  color: string;
  icon: string;
}

export const skillsConfig: Skill[] = [
  { name: "Java", level: 90, color: "from-orange-500 to-red-500", icon: "fab fa-java" },
  { name: "Spring Boot", level: 85, color: "from-green-500 to-emerald-600", icon: "fas fa-leaf" },
  { name: "Flutter", level: 80, color: "from-blue-500 to-cyan-600", icon: "fas fa-mobile-alt" },
  { name: "Next.js", level: 75, color: "from-gray-700 to-gray-900", icon: "fas fa-bolt" },
  { name: "MySQL", level: 85, color: "from-blue-600 to-blue-800", icon: "fas fa-database" },
  { name: "Redis", level: 75, color: "from-red-500 to-red-700", icon: "fas fa-bolt" },
  { name: "TypeScript", level: 70, color: "from-blue-600 to-indigo-700", icon: "fab fa-js" },
  { name: "React", level: 70, color: "from-cyan-500 to-blue-600", icon: "fab fa-react" },
];

// 社交媒体配置
export const socialConfig = {
  email: {
    url: "mailto:amiskwokk@gmail.com",
    icon: "fas fa-envelope",
    color: "from-blue-400 to-blue-600",
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
    featuredProjects: "精选项目",
    skills: "技能",
    viewProject: "查看项目",
    moreProjects: "更多项目",
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
    featuredProjects: "Featured Projects",
    skills: "Skills",
    viewProject: "View Project",
    moreProjects: "More Projects",
  },
};

export type Language = "zh" | "en";
