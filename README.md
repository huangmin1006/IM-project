# Next.js + Tailwind CSS + HeroUI 项目模板

这是一个基于 Next.js、Tailwind CSS 和 HeroUI 的基础框架，已完成配置并进行了性能优化。

## 特性

- Next.js 15.2.4 应用框架
- Tailwind CSS 4 样式框架
- HeroUI 组件库集成
- 静态导出支持（无需服务器）
- 优化的构建配置

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建静态文件
npm run build

# 极速构建（优化版本）
npm run build:ultra
```

## 构建优化

本项目实施了多项构建性能优化，大幅缩短了构建时间并减小了输出文件体积。详细信息请查看 [优化文档](./OPTIMIZATION.md)。

## 目录结构

```
/
├── out/             # 构建输出目录
├── public/          # 静态资源目录
├── scripts/         # 自定义脚本
│   └── time-build.mjs  # 构建时间统计脚本
├── src/
│   └── app/         # Next.js 应用目录
│       ├── layout.tsx  # 根布局
│       ├── page.tsx    # 首页
│       └── providers.tsx # 提供器组件
├── OPTIMIZATION.md  # 优化文档
├── next.config.mjs  # Next.js 配置
├── package.json     # 项目配置
└── README.md        # 项目说明
```

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 标准构建
- `npm run build:fast` - 基本优化构建
- `npm run build:win` - Windows 平台优化构建
- `npm run build:turbo` - 高性能优化构建
- `npm run build:sonic` - 极速优化构建
- `npm run build:ultra` - 带时间统计的极速优化构建
- `npm run build:win-fast` - Windows 专用极速优化构建
- `npm run start` - 启动本地服务器
- `npm run lint` - 运行 ESLint 检查

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Geist, a custom font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# 星空粒子系统与物理小球 Demo

## 项目概述

这是一个使用 Three.js 和 React 实现的交互式 3D 场景，展示了一个旋转的星空粒子系统以及可交互的物理小球系统。场景包含深色背景和随机浅色小球，通过鼠标点击可以创建具有物理特性的小球，并可以通过鼠标拖动控制星空旋转速度。

## 功能特点

### 交互维度

- **物理小球点击生成**：点击场景任意位置即可创建物理小球
- **实时重力模拟**：小球受到真实重力影响，会下落并相互碰撞
- **精准射线碰撞**：使用 Three.js 射线检测实现精确的点击位置创建
- **鼠标控制**：上下拖动鼠标可以调整星空旋转速度

### 视觉效果

- **旋转星空背景**：包含 5000 个粒子的星空系统
- **随机浅色小球**：每个小球都有随机生成的浅色调
- **深色背景**：深蓝色渐变背景与雾效果
- **发光效果**：小球具有发光效果，在暗色背景中更加明显

### 性能维度

- **稳定 60FPS 动画**：优化的渲染循环保证流畅体验
- **物理/渲染双线程协作**：物理计算与渲染分离
- **GPU 高效利用率**：使用 BufferGeometry 优化性能
- **内存管理**：适当的资源释放和清理

## 技术实现

- 使用 React 和 Next.js 构建前端框架
- 使用 Three.js 实现 3D 渲染
- 使用 Cannon-es 物理引擎实现物理模拟
- 使用 React Three Fiber 简化 Three.js 与 React 的集成
- 使用 HSL 颜色空间生成随机浅色
- 使用射线检测实现精确的点击交互

## 使用方法

1. 点击场景任意位置创建随机浅色物理小球
2. 上下拖动鼠标调整星空粒子系统的旋转速度
3. 使用鼠标拖动来旋转和缩放整个场景视角
4. 观察左上角显示的当前旋转速度和小球数量

## 开发与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 即可查看效果。
