# Amis's Homepage

我的个人主页，使用 Next.js + TypeScript + Tailwind CSS 构建。

## 在线预览

🌐 [https://www.amisweb.cn](https://www.amisweb.cn)

## 功能特性

- 🎨 **现代化设计** - 全屏背景图 + 渐变遮罩 + 动态背景（暗色：星空，亮色：落叶）
- ✍️ **SVG 绘画标题** - 手写风格标题，动态计算 viewBox
- ⌨️ **打字机效果** - 动态打字机文字效果，支持多文本循环
- 👤 **头像动画** - 呼吸光圈效果，悬停放大
- 🔗 **社交链接** - 背景图中心展示 Email、GitHub、Gitee、Blog 等社交链接
- 📋 **关于我卡片** - 从 GitHub README 加载个人信息
- 🌟 **精选项目** - 展示 Vibe Music Server 和 App 等项目，图片悬停放大效果
- 📊 **技能可视化** - 进度条展示技术栈，数字动画效果
- 🌍 **多语言支持** - 支持中文/英文切换，自动检测系统语言
- 🌓 **主题切换** - 支持亮色/暗色模式切换，默认暗色主题，模糊过渡动画，主题适配所有组件
- 📱 **响应式布局** - 完美适配桌面端和移动端
- 🎬 **滚动动画** - 各卡片的淡入/滑入效果
- 🧭 **桌面端导航** - 右上角导航链接到精选项目、关于我、技能，右侧侧边导航
- 📱 **移动端导航** - 移动端左下角简洁的圆形导航按钮
- ⚡ **性能优化** - Next.js Image 图片优化、页面加载动画
- 🔝 **返回顶部** - 滚动时显示返回顶部按钮
- 🔧 **在线配置管理** - 可视化配置界面，无需编辑代码，自动同步到 GitHub
- 🎵 **全局音乐播放器** - 支持播放/暂停、上一首/下一首、循环模式切换，可展开/收起，支持音乐列表管理

## 技术栈

- [Next.js 16](https://nextjs.org/) - React 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS
- [Font Awesome](https://fontawesome.com/) - 图标库

---

## 🚀 小白快速上手指南

> **只需 3 步，零代码基础也能搭建自己的主页！**

### 第一步：准备配置文件

1. 复制 `config.example.json` 文件，重命名为 `config.json`
2. 用任意文本编辑器打开 `config.json`

### 第二步：修改配置

编辑 `config.json` 文件，修改以下内容：

#### 1. 网站基本信息

```json
{
  "site": {
    "name": "张三的主页",
    "title": "张三的主页",
    "url": "https://your-domain.com",
    "author": "张三",
    "description": {
      "zh": "前端开发者 | 热爱编程",
      "en": "Frontend Developer | Love Coding"
    },
    "keywords": ["张三", "个人主页", "博客"],
    "footer": {
      "zh": "© 2026 张三的个人主页. All Rights Reserved.",
      "en": "© 2026 Zhang San's Homepage. All Rights Reserved."
    }
  }
}
```

#### 2. 个人资料

```json
{
  "profile": {
    "name": "张三",
    "avatar": "/images/avatar.jpg",
    "location": {
      "zh": "北京 🇨🇳",
      "en": "Beijing 🇨🇳"
    },
    "focus": {
      "zh": "前端开发",
      "en": "Frontend Development"
    },
    "motto": {
      "zh": "代码改变世界",
      "en": "Code changes the world"
    },
    "typeWriterTexts": {
      "zh": ["热爱编程，追求极致", "记录技术与生活"],
      "en": ["Love coding, pursue excellence", "Recording tech and life"]
    }
  }
}
```

#### 3. 社交链接

```json
{
  "links": {
    "blog": {
      "url": "https://your-blog.com",
      "title": { "zh": "博客", "en": "Blog" },
      "icon": "fas fa-blog"
    },
    "github": {
      "url": "https://github.com/yourusername",
      "title": { "zh": "GitHub", "en": "GitHub" },
      "icon": "fab fa-github"
    },
    "email": {
      "url": "mailto:your@email.com",
      "title": { "zh": "邮箱", "en": "Email" },
      "icon": "fas fa-envelope"
    }
  }
}
```

#### 4. 精选项目

```json
{
  "projects": {
    "featured": [
      {
        "id": "my-project",
        "name": "我的项目",
        "description": {
          "zh": "这是一个很棒的项目",
          "en": "This is an awesome project"
        },
        "url": "https://github.com/yourusername/project",
        "image": "/images/project.jpg",
        "tags": ["React", "TypeScript"],
        "icon": "fas fa-star",
        "gradient": "from-blue-500 to-purple-600"
      }
    ],
    "moreProjectsUrl": "https://github.com/yourusername"
  }
}
```

#### 5. 技能展示

```json
{
  "skills": [
    { "name": "JavaScript", "level": 90, "color": "from-yellow-500 to-orange-500", "icon": "fab fa-js" },
    { "name": "React", "level": 85, "color": "from-cyan-500 to-blue-600", "icon": "fab fa-react" },
    { "name": "TypeScript", "level": 80, "color": "from-blue-600 to-indigo-700", "icon": "fab fa-js" }
  ]
}
```

### 第三步：替换图片

将以下图片放入 `public/images/` 目录：

| 文件名 | 用途 | 建议尺寸 |
|--------|------|----------|
| `avatar.jpg` | 头像 | 512x512 |
| `index.jpg` | 暗色背景图 | 1920x1080 |
| `index4.jpg` | 亮色背景图 | 1920x1080 |
| `icon.png` | 网站图标 | 512x512 |
| `index2.jpg` ~ `index9.jpg` | 项目展示图 | 1200x630 |

### 第五步：添加音乐（可选）

将音乐文件放入 `public/music/` 目录，支持 `.mp3`、`.wav`、`.ogg` 格式。

也可以在配置页面的音乐管理中进行上传、删除和排序操作。

### 第四步：运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:9998 即可预览！

---

## 配置详解

### 完整配置结构

```
config.json
├── site              # 网站基本信息
│   ├── name          # 网站名称
│   ├── title         # 网站标题
│   ├── url           # 网站地址
│   ├── ogImage       # 分享预览图
│   ├── author        # 作者名
│   ├── description   # 网站描述（中英文）
│   ├── keywords      # SEO 关键词
│   └── footer        # 页脚文字
├── profile           # 个人资料
│   ├── name          # 名字
│   ├── avatar        # 头像路径
│   ├── location      # 所在地
│   ├── focus         # 专业领域
│   ├── hobbies       # 爱好
│   ├── motto         # 座右铭
│   ├── typeWriterTexts # 打字机文字
│   └── currentFocus  # 当前关注事项
├── links             # 社交链接
├── projects          # 项目展示
│   ├── featured      # 精选项目列表
│   └── moreProjectsUrl # 更多项目链接
├── skills            # 技能列表
├── techStack         # 技术栈分类
│   ├── backend       # 后端技术
│   ├── mobile        # 移动端技术
│   └── frontend      # 前端技术
└── translations      # 多语言文本
```

### 图标使用说明

本项目使用 [Font Awesome](https://fontawesome.com/icons) 图标库，常用图标：

| 用途 | 图标代码 |
|------|----------|
| 博客 | `fas fa-blog` |
| GitHub | `fab fa-github` |
| 邮箱 | `fas fa-envelope` |
| 数据库 | `fas fa-database` |
| 服务器 | `fas fa-server` |
| 手机 | `fas fa-mobile-alt` |
| 代码 | `fas fa-code` |
| 音乐 | `fas fa-music` |
| 首页 | `fas fa-home` |
| Java | `fab fa-java` |
| React | `fab fa-react` |
| JS | `fab fa-js` |
| Android | `fab fa-android` |

### 渐变色说明

项目卡片使用 Tailwind CSS 渐变色，常用组合：

| 渐变色代码 | 效果 |
|------------|------|
| `from-blue-500 to-purple-600` | 蓝紫渐变 |
| `from-pink-500 to-rose-600` | 粉红渐变 |
| `from-emerald-500 to-teal-600` | 绿青渐变 |
| `from-orange-500 to-red-500` | 橙红渐变 |
| `from-cyan-500 to-blue-600` | 青蓝渐变 |

---

## 项目结构

```
.
├── config.json             # 📝 主配置文件（用户编辑）
├── config.example.json     # 📋 配置示例模板
├── app/
│   ├── components/         # 组件
│   ├── contexts/           # React Context
│   ├── hooks/              # 自定义 Hooks
│   ├── config.ts           # 配置读取（自动）
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   ├── metadata.ts         # SEO 元数据
│   └── page.tsx            # 首页
├── public/
│   ├── images/             # 图片资源
│   ├── markdown/           # Markdown 文件
│   └── robots.txt          # 爬虫规则
├── .env.example            # 环境变量示例
├── Dockerfile              # Docker 配置
├── docker-compose.yml      # Docker Compose 配置
└── package.json
```

---

## 部署教程

### 方式一：Vercel 部署（推荐）

**适合人群：小白用户，免费托管**

1. **Fork 本项目**
   - 点击右上角 `Fork` 按钮

2. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com/)
   - 使用 GitHub 登录

3. **配置环境变量（重要！）**
   
   在 Vercel 部署前，需要先配置以下环境变量：
   
   - 进入 Vercel 控制台
   - 选择你的项目 → **Settings** → **Environment Variables**
   - 添加以下变量：

   | 变量名 | 说明 | 示例 |
   |--------|------|------|
   | `GITHUB_APP_ID` | GitHub App ID | `123456` |
   | `GITHUB_REPO_OWNER` | 仓库所有者 | `yourusername` |
   | `GITHUB_REPO_NAME` | 仓库名称 | `AmisHomepage` |
   | `GITHUB_REPO_BRANCH` | 分支名称 | `main` |

   > ⚠️ **注意**：`.env` 文件不会被上传到 GitHub，所以必须在 Vercel 控制台手动配置这些环境变量！

4. **导入项目**
   - 点击 `New Project`
   - 选择你 Fork 的仓库
   - 点击 `Deploy`

5. **绑定域名（可选）**
   - 在项目设置中添加自定义域名

---

## 🔧 在线配置管理（推荐）

项目提供了可视化的配置管理界面，无需手动编辑 JSON 文件！

### 访问配置页面

1. 部署完成后，访问 `https://your-domain.com/config`
2. 上传你的 GitHub App PEM 私钥文件
3. 在线编辑所有配置项
4. 点击保存，自动提交到 GitHub

### 支持的配置项

- ✅ 网站基本信息（名称、标题、URL）
- ✅ 个人资料（头像、姓名、简介）
- ✅ 背景大标题（中英文）
- ✅ TypeWriter 动态文字
- ✅ 页脚版权信息
- ✅ 社交链接（GitHub、Gitee、博客、邮箱）及显示/隐藏控制
- ✅ 技能列表（添加、删除、编辑）
- ✅ 项目展示（添加、删除、编辑）
- ✅ 模块显示/隐藏控制
- ✅ 音乐列表管理（上传、删除、排序）

### GitHub App 配置步骤

1. 访问 GitHub → Settings → Developer settings → GitHub Apps
2. 点击 `New GitHub App`
3. 填写应用名称和描述
4. **权限设置**：
   - Contents: **Read and Write**
5. 创建后，在应用详情页：
   - 记录 `App ID`
   - 生成并下载 `Private Key`（.pem 文件）
6. 将 App 安装到你的仓库
7. 在配置页面上传 PEM 文件即可使用

### 方式二：Docker 部署

**适合人群：有服务器的用户**

```bash
# 克隆项目
git clone https://github.com/你的用户名/AmisHomepage.git
cd AmisHomepage

# 修改配置
# 编辑 config.json
# 替换 public/images/ 中的图片

# 构建并启动
docker-compose up -d

# 访问
http://localhost:9998
```

### 方式三：服务器部署

**适合人群：有 Linux 服务器的用户**

```bash
# 1. 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 PM2
sudo npm install -g pm2

# 3. 克隆项目
git clone https://github.com/你的用户名/AmisHomepage.git
cd AmisHomepage

# 4. 安装依赖并构建
npm install
npm run build

# 5. 启动服务
pm2 start npm --name "homepage" -- start

# 6. 设置开机自启
pm2 startup
pm2 save
```

### 方式四：静态导出

**适合人群：想部署到静态托管（如 GitHub Pages）**

```bash
# 构建
npm run build

# 输出在 .next/standalone 目录
# 将静态文件上传到任意静态托管服务
```

---

## Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:9998;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 常见问题

### Q: 修改配置后没有生效？

A: 重启开发服务器：
```bash
# 停止当前运行的服务（Ctrl+C）
# 重新启动
npm run dev
```

### Q: 图片不显示？

A: 检查图片路径是否正确：
- 图片放在 `public/images/` 目录
- 配置中使用 `/images/xxx.jpg`（注意开头的 `/`）

### Q: 如何修改端口？

A: 编辑 `.env` 文件：
```
PORT=8080
```

### Q: 如何添加新的社交链接？

A: 在 `config.json` 的 `links` 中添加：
```json
{
  "links": {
    "twitter": {
      "url": "https://twitter.com/yourusername",
      "title": { "zh": "Twitter", "en": "Twitter" },
      "icon": "fab fa-twitter"
    }
  }
}
```

---

## License

本项目采用 [CC BY-NC-SA 4.0](LICENSE) 许可协议。

**简单来说：**
- ✅ 可以自由分享和修改
- ❌ **禁止商业用途**
- 📋 修改后必须使用相同协议

详见 [LICENSE](LICENSE) 文件。

---

Made with ❤️ by Amis
