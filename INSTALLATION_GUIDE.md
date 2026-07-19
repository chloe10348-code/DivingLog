# DepthLog 项目安装指南

## 📦 快速开始

### 方法 1：使用项目文件（推荐）

由于 ZIP 文件已准备好，你可以直接使用已创建的项目文件夹：

```bash
# 进入项目目录
cd /Users/chloeyao/Documents/trae_projects/DivingLog

# 安装依赖
npm install

# 复制环境变量配置
cp .env.example .env.local

# 配置 Firebase（编辑 .env.local 文件）

# 启动开发服务器
npm run dev
```

### 方法 2：手动创建项目

如果你需要重新创建项目，请按以下步骤操作：

---

## 1. 创建 Next.js 项目

```bash
npx create-next-app@latest depthlog --typescript --tailwind --eslint
cd depthlog
```

## 2. 安装依赖

```bash
npm install firebase zustand @tanstack/react-query react-hook-form @hookform/resolvers zod date-fns react-day-picker
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-checkbox @radix-ui/react-popover @radix-ui/react-dialog @radix-ui/react-avatar @radix-ui/react-separator
npm install cmdk class-variance-authority clsx tailwind-merge lucide-react
```

## 3. 配置文件

### package.json (已准备好)

### tsconfig.json (已准备好)

### tailwind.config.ts (已准备好)

### next.config.js (已准备好)

## 4. 项目文件结构

所有源代码文件已在 `src/` 目录中，包含：

- `src/app/` - 页面和路由
- `src/components/` - React 组件
- `src/hooks/` - 自定义 Hooks
- `src/lib/` - 工具函数和 Firebase 配置
- `src/store/` - Zustand 状态管理
- `src/types/` - TypeScript 类型定义

## 5. Firebase 设置

1. 在 [Firebase Console](https://console.firebase.google.com) 创建项目
2. 启用 Email/Password 和 Google 登录
3. 创建 Firestore 数据库
4. 创建 Storage 存储桶
5. 复制配置到 `.env.local`

## 6. 环境变量配置

编辑 `.env.local` 文件：

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Mapbox Configuration (Optional)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

## 7. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 http://localhost:3000

---

## 📁 项目功能

✅ 用户认证（邮箱/密码 + Google OAuth）
✅ 个人资料管理
✅ 潜水记录表单
✅ 仪表盘统计
✅ 潜水日记列表
✅ 潜点地图（基础版）
✅ 安全检查清单
✅ 耗气率计算
✅ 照片上传

---

## 🛠️ 可用脚本

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run format       # 代码格式化
```

---

## 📝 注意事项

1. **Firebase 配置**：必须配置 Firebase 才能使用完整功能
2. **API Keys**：不要将真实的 API Key 提交到 Git 仓库
3. **开发模式**：先使用 Firebase 免费层进行开发测试

---

## 🔗 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Firebase 文档](https://firebase.google.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com)
