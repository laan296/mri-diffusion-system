// 导入图标组件
import { Activity, ShieldAlert } from 'lucide-react';

/**
 * 头部组件
 * 显示应用标题、图标和系统状态信息
 */
export const Header = () => (
  // 头部容器，使用Flexbox布局，两端对齐，添加边框和背景
  <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
    {/* 左侧：应用图标和标题 */}
    <div className="flex items-center gap-3">
      {/* 图标容器，添加背景和圆角 */}
      <div className="p-2 bg-emerald-500/20 rounded-lg">
        {/* 活动图标，设置颜色和大小 */}
        <Activity className="text-emerald-400 w-6 h-6" />
      </div>
      {/* 应用标题，使用渐变文字效果 */}
      <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
        基于扩散模型的多模态脑MRI生成系统
      </h1>
    </div>
    
    {/* 右侧：系统状态信息 */}
    <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
      {/* 版本信息 */}
      <span className="px-2 py-1 border border-slate-700 rounded text-emerald-500">
        版本号：ver1.0 {/* 版本号 */}
      </span>
    </div>
  </header>
);