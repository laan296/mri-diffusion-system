// 导入react-dropzone库，用于实现文件拖放功能
import { useDropzone } from 'react-dropzone';
// 导入图标组件
import { Upload } from 'lucide-react';
// 导入状态管理钩子
import { useStore } from '../store/useStore';

/**
 * 上传区域组件
 * 提供文件拖放功能，用于上传MRI图像
 */
export const UploadZone = () => {
  // 从全局状态中获取源图像、设置源图像的方法和缩放比例
  const { sourceImage, setSourceImage, zoomScale } = useStore();

  /**
   * 文件拖放处理函数
   * @param {Array} acceptedFiles - 拖放的文件数组
   */
  const onDrop = (acceptedFiles) => {
    // 1. 获取用户上传的第一个原始文件对象 (File Object)
    const file = acceptedFiles[0];
    
    if (file) {
      // 2. 为该文件创建一个临时的浏览器预览 URL (Blob URL)
      const previewUrl = URL.createObjectURL(file);
      
      // 3. 【关键修改点】：同时传入预览地址 和 原始文件对象
      // 预览地址用于前端 <img> 标签显示，原始文件对象用于稍后发给 Flask 后端
      setSourceImage(previewUrl, file);
    }
  };

  // 使用react-dropzone钩子，配置拖放行为
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, // 拖放文件时的回调函数
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.dcm', '.nii'] // 指定接受的图像格式
    }, 
    multiple: false // 不允许多文件上传
  });

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      {/* 拖放区域根组件 */}
      <div 
        {...getRootProps()} 
        className={`flex-1 flex items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragActive 
            ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/20'
        }`}
      >
        <input {...getInputProps()} />
        
        {sourceImage ? (
          // 已上传状态：显示图像预览
          <div className="relative w-full h-full p-2 flex items-center justify-center overflow-hidden">
             <img 
               src={sourceImage} 
               style={{ transform: `scale(${zoomScale})` }} 
               className="max-w-full max-h-full object-contain transition-transform duration-200" 
               alt="Source MRI" 
             />

          </div>
        ) : (
          // 未上传状态：显示提示信息
          <div className="text-center group">
            <div className="relative mx-auto w-16 h-16 mb-4 flex items-center justify-center">
              {/* 装饰性背景圆圈 */}
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full group-hover:scale-125 transition-transform duration-500" />
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <p className="text-sm text-slate-400 mb-1 group-hover:text-slate-300">点击或拖拽上传图像</p>
            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Supports JPG, PNG, DICOM</p>
          </div>
        )}
      </div>
    </div>
  );
};