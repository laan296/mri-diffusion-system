// 导入React核心库和useEffect钩子
import React, { useEffect } from 'react';
// 导入样式文件
import './App.css';
// 导入各个功能组件
import { Header } from './components/Header'; // 头部组件
import { UploadZone } from './components/UploadZone'; // 上传区域组件
import { ActionPanel } from './components/ActionPanel'; // 操作面板组件
import { ResultZone } from './components/ResultZone'; // 结果显示区域组件
import { HistoryBar} from './components/HistoryBar'; // 历史记录栏和对比模式组件
import { ComparisonMode } from './components/ComparisonMode'; // 对比模式区域组件
// 导入状态管理钩子
import { useStore } from './store/useStore';

/**
 * 应用主组件
 * 负责整体布局和状态管理
 */
function App() {
  // 从全局状态中获取缩放相关的状态和方法
  const { setZoomScale, zoomScale } = useStore();

  /**
   * 处理全局联动缩放功能
   * 使用useEffect钩子添加和移除滚轮事件监听器
   */
  useEffect(() => {
    // 滚轮事件处理函数
    const handleWheel = (e) => {
      // 当按下Ctrl键时触发缩放功能
      if (e.ctrlKey) {
        // 阻止默认滚轮行为
        e.preventDefault();
        // 根据滚轮方向计算缩放增量
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        // 更新缩放比例，限制在0.5到5之间
        setZoomScale(Math.min(Math.max(zoomScale + delta, 0.5), 5));
      }
    };
    
    // 添加全局滚轮事件监听器
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // 组件卸载时移除事件监听器，避免内存泄漏
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoomScale, setZoomScale]); // 依赖项数组，确保缩放状态变化时重新设置监听器

  /**
   * 组件渲染部分
   * 使用Tailwind CSS进行样式设计
   */
  return (
    // 主容器，使用Flexbox布局，高度为整个屏幕
    <div className="app-container">
      {/* 头部组件 */}
      <Header />
      
      {/* 主内容区域，使用Grid布局 */}
      <main className="main-content">
        {/* 左侧区域：源数据上传 */}
        <section className="side-section">
          {/* 源数据模态信息和缩放状态 */}
          <div className="modality-info source-modality">
            <span>[ T1源图像 ]</span> {/* 源数据模态类型 */}
            <span>缩放比例: {Math.round(zoomScale * 100)}%</span> {/* 当前缩放比例 */}
          </div>
          {/* 上传区域组件 */}
          <UploadZone />
        </section>

        {/* 中间区域：操作面板 */}
        <div className="action-panel-container">
          <ActionPanel />
        </div>

        {/* 右侧区域：结果显示 */}
        <section className="side-section">
          {/* 目标数据模态信息和状态 */}
          <div className="modality-info target-modality">
            <span>[ T2生成图像 ]</span> {/* 目标数据模态类型 */}
          </div>
          {/* 结果显示区域组件 */}
          <ResultZone />
        </section>
      </main>

      {/* 底部区域，使用Grid布局 */}
      <footer className="footer-content">
        {/* 上方：比较模式 */}
        <div className="comparison-panel">
          <ComparisonMode />
          
        </div>
        {/* 下方：历史记录栏 */}
        {/* <div className="history-panel">
          <HistoryBar />
        </div> */}
      </footer>
    </div>
  );
}

// 导出App组件作为默认导出
export default App;