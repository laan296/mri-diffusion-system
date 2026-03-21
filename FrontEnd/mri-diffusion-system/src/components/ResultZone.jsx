import { Download, ScanEye, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState } from 'react';

export const ResultZone = () => {
  const { resultImage, isGenerating, zoomScale } = useStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (!resultImage) return;
    
    setIsDownloading(true);
    setDownloadSuccess(false);
    
    try {
      // 检查是否是 blob URL
      if (resultImage.startsWith('blob:')) {
        // 对于 blob URL，使用传统的下载方法
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'generated_mri.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // 对于远程 URL，先获取 blob 然后下载
        const response = await fetch(resultImage);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'generated_mri.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 释放 blob URL
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 100);
      }
      
      // 显示下载成功提示
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      // 可以添加错误提示
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex-1 medical-panel border-blue-900/30 flex flex-col relative group">
      {!resultImage && !isGenerating ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/40 italic text-slate-600">
          <ScanEye size={48} className="mb-2 opacity-20" />
          <span className="text-xs">等待推理开始...</span>
        </div>
      ) : isGenerating ? (
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-48 h-48 rounded-full border-b-2 border-blue-500 animate-spin opacity-20" />
          <div className="absolute inset-0 backdrop-blur-xl flex items-center justify-center">
             <span className="text-blue-400 font-mono text-sm">DIFFUSION RECONSTRUCTING...</span>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full p-2 flex items-center justify-center overflow-hidden">
          <img 
            src={resultImage} 
            style={{ transform: `scale(${zoomScale})` }}
            className="max-w-full max-h-full object-contain transition-transform" 
            alt="Result" 
          />
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-colors border shadow-lg ${
              isDownloading 
                ? 'bg-slate-600/50 text-slate-400 border-slate-700 cursor-not-allowed' 
                : 'bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border-blue-500/30'
            }`}
          >
            {isDownloading ? (
              <div className="w-18 h-18 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : downloadSuccess ? (
              <CheckCircle2 size={18} className="text-green-400" />
            ) : (
              <Download size={18} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
