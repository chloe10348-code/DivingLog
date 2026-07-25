# DepthLog - 潜水日志应用

一个现代化的潜水日志 Web 应用，记录你的每一次水下探索，追踪技术进步，发现新潜点。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand (客户端) + React Query (服务端)
- **后端服务**: Firebase (Auth + Firestore + Storage)
- **地图**: Mapbox GL JS
- **图表**: Recharts
- **表单验证**: Zod
- **表单处理**: React Hook Form

## 项目结构

```
src/
├── app/
│   ├── (auth)/              # 认证相关页面
│   │   ├── login/          # 登录
│   │   └── register/       # 注册
│   ├── (dashboard)/        # 主应用页面（需要登录）
│   │   ├── dashboard/      # 仪表盘
│   │   ├── map/           # 潜点地图
│   │   ├── log/           # 记录潜水
│   │   ├── journal/       # 我的日记
│   │   └── profile/       # 个人资料
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                # shadcn/ui 基础组件
│   ├── auth/              # 认证相关组件
│   └── shared/            # 共享组件
├── lib/
│   ├── firebase/          # Firebase 配置
│   ├── validations/       # Zod 验证规则
│   └── utils.ts
├── hooks/
│   └── useAuth.ts         # 认证 Hook
├── types/                 # TypeScript 类型定义
├── store/                 # Zustand 状态管理
└── styles/
```

## 功能特性

### ✅ 已完成

- 用户认证 (邮箱/密码 + Google OAuth)
- 个人资料管理
- 响应式导航栏
- 基础页面布局

### 🔄 开发中

- 潜水记录表单
- 仪表盘统计
- 潜点地图
- 潜水日记列表

## 开始使用

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Firebase

1. 在 [Firebase Console](https://console.firebase.google.com/) 创建新项目
2. 启用 Email/Password 和 Google 登录
3. 创建 Firestore 数据库
4. 创建 Storage 存储桶
5. 复制 Firebase 配置信息

### 3. 设置环境变量

复制 `.env.example` 为 `.env.local` 并填入配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Mapbox Configuration (可选，用于地图功能)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### 4. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 可用脚本

- `npm run dev`: 启动开发服务器
- `npm run build`: 构建生产版本
- `npm run start`: 启动生产服务器
- `npm run lint`: 运行代码检查
- `npm run format`: 格式化代码

## 编码规范

- 使用 TypeScript 严格模式
- 遵循 shadcn/ui 组件结构
- 使用 Zod 进行数据验证
- 使用 React Hook Form 处理表单
- 使用 Zustand 管理客户端状态
- 遵循 Conventional Commits 提交规范

## 许可证

MIT
test
