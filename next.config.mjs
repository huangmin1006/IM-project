/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // 修复静态导出路径问题
  basePath: "",
  assetPrefix: process.env.NODE_ENV === "production" ? "." : undefined,
  // 禁用 i18n 以确保静态导出正常工作
  i18n: undefined,
  // 关键配置：使用相对路径

  // 确保使用相对路径
  trailingSlash: true,
  // 极简输出，不包含额外的信息
  compress: false, // 禁用压缩，加快构建速度
  generateEtags: false, // 禁用 ETag 生成

  // 优化构建性能
  // Next.js 15.2.4 已默认启用 SWC 压缩，不需要额外配置
  // 如果需要禁用 SWC 压缩：swcMinify: false

  webpack: (config, { dev }) => {
    // 提高 webpack 构建速度的配置
    config.cache = true; // 启用持久化缓存

    // 减少构建过程中的模块数量
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // 优化 babel 加载器
    if (config.module && config.module.rules) {
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOfRule) => {
            if (oneOfRule.use && Array.isArray(oneOfRule.use)) {
              oneOfRule.use.forEach((loader) => {
                if (loader.loader && /babel-loader/.test(loader.loader)) {
                  if (loader.options) {
                    loader.options.cacheCompression = false;
                    loader.options.compact = true;
                  }
                }
              });
            }
          });
        }
      });
    }

    // 生产环境优化
    if (!dev) {
      // 减少生产环境的构建体积
      config.optimization.minimize = true;

      // 禁用 splitChunks 可以在某些情况下加快构建
      config.optimization.splitChunks = false;

      // 禁用 runtimeChunk 加快构建
      config.optimization.runtimeChunk = false;
    }

    return config;
  },

  // 禁用源映射
  productionBrowserSourceMaps: false,

  // 减少元数据
  poweredByHeader: false,
  reactStrictMode: false, // 禁用严格模式可以提高性能

  // 禁用额外功能
  onDemandEntries: {
    // 页面缓存时间长度（ms），设置的越大，构建越快
    maxInactiveAge: 9999999,
    // 同时缓存的页面数量
    pagesBufferLength: 5,
  },

  // 减少不必要的构建内容
  experimental: {
    // 使用 SWC 插件加速编译
    swcPlugins: [],
    // 加快模块解析
    turbotrace: {
      logLevel: "error",
    },
    // 更激进的打包优化
    optimizePackageImports: ["@heroui/react"],
  },
};

export default nextConfig;
