import { spawn } from "child_process";
import { performance } from "perf_hooks";
import { writeFileSync, existsSync, unlinkSync, rmSync } from "fs";
import { execSync } from "child_process";

// 获取格式化的时间
function getFormattedTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// 彩色输出
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// 清理缓存文件以解决潜在的缓存问题
function cleanupCache() {
  try {
    // 尝试清除 .next 目录以确保干净构建
    console.log(`${colors.blue}清理构建缓存...${colors.reset}`);

    // 删除 .next 目录
    if (existsSync(".next")) {
      try {
        if (process.platform === "win32") {
          // Windows 系统使用 rmSync
          rmSync(".next", { recursive: true, force: true });
        } else {
          execSync("rm -rf .next", { stdio: "inherit" });
        }
      } catch (e) {
        console.error(
          `${colors.red}无法删除 .next 目录: ${e.message}${colors.reset}`
        );
      }
    }

    console.log(`${colors.green}缓存清理完成${colors.reset}`);
  } catch (err) {
    console.error(`${colors.red}缓存清理失败:${colors.reset}`, err);
  }
}

// 创建快速打包的临时环境变量文件
function createFastBuildEnv() {
  // 删除之前的构建环境文件
  if (existsSync(".env.build")) {
    unlinkSync(".env.build");
  }

  const envContent = `
# 禁用遥测数据收集，提高构建速度
NEXT_TELEMETRY_DISABLED=1

# 设置生产环境
NODE_ENV=production

# 禁用源映射生成，加快构建速度
GENERATE_SOURCEMAP=false

# 增加并行任务数量（使用所有CPU核心）
NEXT_WEBPACK_WORKERS=8

# 关闭 React 严格模式，提高性能
NEXT_WEBPACK_DISABLE_STRICT_MODE=true

# 开启并行构建
NEXT_PARALLEL_BUILD=true

# 禁用构建时类型检查，加快构建速度
DISABLE_TYPESCRIPT=true
NEXT_SKIP_TYPECHECKING=true

# 缓存优化
NEXT_CACHE_LEVEL=aggressive

# 完全禁用 ESLint
NEXT_DISABLE_ESLINT=true

# 加快 SSG 页面生成
NEXT_FORCE_INLINE_SSG=true

# 仅打包必要的页面
NEXT_MINIMAL_BUILD=true

# 禁用 SWC Minify，有时可以加快构建速度
NEXT_DISABLE_SWC_MINIFY=true

# 极简模式，仅构建必要的文件
NEXT_TURBO=true
NEXT_OPTIMIZE_FONTS=false
NEXT_OPTIMIZE_IMAGES=false
`;

  try {
    writeFileSync(".env.build", envContent);
    console.log(`${colors.blue}创建超级加速构建环境变量文件${colors.reset}`);
  } catch (err) {
    console.error(`${colors.red}创建环境变量文件失败:${colors.reset}`, err);
  }
}

console.log(
  `${colors.cyan}${colors.bright}=====================================${colors.reset}`
);
console.log(
  `${colors.green}${colors.bright}开始打包时间: ${getFormattedTime()}${
    colors.reset
  }`
);
console.log(
  `${colors.cyan}${colors.bright}=====================================${colors.reset}`
);

// 清理缓存
cleanupCache(); // 启用缓存清理

// 创建加速环境变量
createFastBuildEnv();

const startTime = performance.now();

// 执行打包命令（使用新的超级优化环境变量）
let buildCmd;
if (process.platform === "win32") {
  // Windows 用 set 设置环境变量
  buildCmd = "next build --no-lint";
} else {
  // Unix 系统
  buildCmd = "NODE_OPTIONS=--max-old-space-size=4096 next build --no-lint";
}

const buildProcess = spawn(buildCmd, {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: "--max-old-space-size=4096",
    NEXT_TELEMETRY_DISABLED: "1",
    NODE_ENV: "production",
    DISABLE_TYPESCRIPT: "1",
    NEXT_SKIP_TYPECHECKING: "1",
    NEXT_DISABLE_ESLINT: "1",
    NEXT_CACHE_LEVEL: "aggressive",
    NEXT_PARALLEL_BUILD: "true",
    NEXT_WEBPACK_WORKERS: "8",
    NEXT_WEBPACK_DISABLE_STRICT_MODE: "true",
    NEXT_MINIMAL_BUILD: "true",
    NEXT_TURBO: "true",
  },
});

buildProcess.on("close", (code) => {
  const endTime = performance.now();
  const buildTime = endTime - startTime;

  console.log(
    `${colors.cyan}${colors.bright}=====================================${colors.reset}`
  );
  console.log(
    `${colors.green}${colors.bright}结束打包时间: ${getFormattedTime()}${
      colors.reset
    }`
  );

  // 格式化构建时间
  const totalSeconds = buildTime / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor(
    (totalSeconds - Math.floor(totalSeconds)) * 1000
  );

  console.log(
    `${colors.magenta}${colors.bright}打包总耗时: ${minutes}分 ${seconds}秒 ${milliseconds}毫秒${colors.reset}`
  );
  console.log(
    `${colors.yellow}${colors.bright}打包总毫秒: ${buildTime.toFixed(2)}ms${
      colors.reset
    }`
  );
  console.log(
    `${colors.cyan}${colors.bright}=====================================${colors.reset}`
  );

  // 删除临时环境文件
  if (existsSync(".env.build")) {
    unlinkSync(".env.build");
    console.log(`${colors.blue}已清理临时环境文件${colors.reset}`);
  }

  // 返回打包命令的退出码
  process.exit(code);
});
