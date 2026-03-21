// 导入React的严格模式组件，用于检测潜在的问题
import { StrictMode } from 'react'
// 导入createRoot函数，用于创建React根节点并渲染应用
import { createRoot } from 'react-dom/client'
// 导入全局样式文件，包含Tailwind CSS指令和自定义样式
import './index.css'
// 导入App组件，这是应用的主组件
import App from './App.jsx'

// 获取DOM中的root元素作为React应用的挂载点
// 使用createRoot创建根节点并渲染App组件
// 包裹在StrictMode中以启用额外的开发时检查
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
