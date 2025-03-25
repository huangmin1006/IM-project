export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">
          欢迎使用 Next.js + Tailwind CSS + HeroUI
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          这是一个基础框架，已配置好并优化
        </p>

        <div className="mt-8">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            开始使用
          </button>
        </div>
      </div>
    </main>
  );
}
