// Tailwind CSS 配置文件
/** @type {import('tailwindcss').Config} */
export default {
  // content 配置：指定 Tailwind CSS 应该扫描哪些文件来查找类名
  content: [
    "./index.html", // 扫描根目录下的 index.html 文件
    "./src/**/*.{js,ts,jsx,tsx}", // 扫描 src 目录及其子目录下的所有 JavaScript、TypeScript、JSX 和 TSX 文件
  ],
  // theme 配置：定义项目的主题，包括颜色、字体等
  theme: {
    // extend 配置：扩展默认主题，而不是完全替换它
    extend: {
      // 颜色配置：定义自定义颜色
      colors: {
        primary: '#10b981', // 主色调：绿色，用于强调和交互元素
        secondary: '#3b82f6', // 次要色调：蓝色，用于次要强调和交互元素
      },
      // 字体配置：定义自定义字体
      fontFamily: {
        mono: ['Courier New', 'monospace'], // 等宽字体：用于代码和等宽文本
      },
    },
  },
  // plugins 配置：指定要使用的 Tailwind 插件
  plugins: [], // 目前没有使用任何插件
}