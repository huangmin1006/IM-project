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
