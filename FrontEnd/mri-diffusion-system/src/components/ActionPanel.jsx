import axios from 'axios';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export const ActionPanel = () => {
  const {
    isGenerating,
    setGenerating,
    sourceImage,
    sourceImageFile,
    setResultImage,
  } = useStore();

  const startInference = async () => {
    if (!sourceImageFile) return;

    setGenerating(true);

    const formData = new FormData();
    formData.append('image', sourceImageFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setResultImage(response.data.result_url);
      } else {
        console.error('生成失败:', response.data.message);
      }
    } catch (error) {
      console.error('连接后端失败:', error);
      alert('无法连接到后端服务，请确认 Flask 正在 5000 端口运行。');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="action-panel">
      <p className="action-label">INFERENCE CONTROL</p>

      <motion.button
        whileHover={!isGenerating && sourceImage ? { scale: 1.08 } : {}}
        whileTap={!isGenerating && sourceImage ? { scale: 0.92 } : {}}
        onClick={startInference}
        disabled={isGenerating || !sourceImage}
        className={`generate-orb ${!sourceImage ? 'generate-orb-disabled' : ''}`}
      >
        <div
          className={`generate-orb-halo ${
            isGenerating
              ? 'generate-orb-halo-generating'
              : sourceImage
                ? 'generate-orb-halo-ready'
                : ''
          }`}
        />

        <div
          className={`generate-core ${
            isGenerating ? 'generate-core-generating' : 'generate-core-ready'
          }`}
        >
          {isGenerating ? (
            <Loader2 className="animate-spin text-blue-200" size={24} />
          ) : (
            <Zap className="text-[#8fffe0]" size={24} />
          )}
        </div>
      </motion.button>

      <div className="action-copy">
        <p className={`action-state ${isGenerating ? 'action-state-running' : ''}`}>
          {isGenerating
            ? 'DIFFUSION MODEL IS RECONSTRUCTING'
            : sourceImage
              ? 'READY TO GENERATE T2 IMAGE'
              : 'WAITING FOR SOURCE T1 IMAGE'}
        </p>
        <p className="action-note">点击中间按钮开始推理</p>
      </div>
    </div>
  );
};
