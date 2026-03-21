import axios from 'axios';
import { motion } from 'framer-motion';
import { Zap, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ActionPanel = () => {
  // 注意：这里我们从 store 中额外取出了 sourceImageFile (原始文件对象)
  const { 
    isGenerating, 
    setGenerating, 
    sourceImage, 
    sourceImageFile, 
    setResultImage 
  } = useStore();

  const startInference = async () => {
    if (!sourceImageFile) return;

    setGenerating(true);

    // 1. 准备上传数据 (Multipart Form Data)
    const formData = new FormData();
    formData.append('image', sourceImageFile);

    try {
      // 2. 发送 POST 请求到 Flask 后端 (注意地址和端口)
      const response = await axios.post('http://127.0.0.1:5000/api/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 3. 处理返回结果
      if (response.data.success) {
        // 将后端回传的拼接了 YOLO 框的图片 URL 更新到右侧
        setResultImage(response.data.result_url);
      } else {
        console.error("生成失败:", response.data.message);
      }
    } catch (error) {
      console.error("连接后端失败:", error);
      alert("无法连接到后端服务器，请检查 Flask 是否已启动并运行在 5000 端口。");
    } finally {
      // 4. 无论成功还是失败，都要关闭加载状态
      setGenerating(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-32 px-2">
      <motion.button
        whileHover={!isGenerating && sourceImage ? { scale: 1.1 } : {}}
        whileTap={!isGenerating && sourceImage ? { scale: 0.9 } : {}}
        onClick={startInference}
        disabled={isGenerating || !sourceImage}
        className={`relative p-6 rounded-full group ${!sourceImage ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        {/* 呼吸灯特效 */}
        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${
          isGenerating ? 'bg-blue-500 animate-pulse' : (sourceImage ? 'bg-emerald-500/40' : 'bg-transparent')
        }`} />
        
        {/* 核心按钮 */}
        <div className={`relative z-10 w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
          isGenerating ? 'border-blue-400 rotate-180' : 'border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]'
        } bg-slate-900`}>
          {isGenerating ? <Loader2 className="animate-spin text-blue-400" /> : <Zap className="text-emerald-400" />}
        </div>
      </motion.button>
      
      <div className="text-center space-y-2">
        <p className={`text-[10px] font-mono tracking-tighter ${isGenerating ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`}>
          {isGenerating ? "AI ANALYZING..." : (sourceImage ? "READY TO PROCESS" : "WAITING FOR UPLOAD")}
        </p>
      </div>
    </div>
  );
};