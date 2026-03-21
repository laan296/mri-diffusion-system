import { create } from 'zustand';

export const useStore = create((set) => ({
  sourceImage: null,      // 用于前端展示的预览 URL (blob:xxx)
  sourceImageFile: null,  // 【新增】实际的 File 对象，用于通过 FormData 发送给 Flask 后端
  resultImage: null,      // 后端回传的生成结果图片 URL
  isGenerating: false,    // 是否正在生成/推理
  zoomScale: 1,           // 联动缩放倍率
  history: [],            // 历史记录数组

  // 修改 setSourceImage，使其接收两个参数：预览地址 和 原始文件
  setSourceImage: (url, file) => set({ 
    sourceImage: url, 
    sourceImageFile: file, 
    resultImage: null // 上传新图时，清空之前的生成结果
  }),

  setResultImage: (url) => set((state) => ({ 
    resultImage: url, 
    // 将新生成的结果加入历史记录（去重或限制长度）
    history: [url, ...state.history].slice(0, 10) 
  })),

  setGenerating: (bool) => set({ isGenerating: bool }),

  setZoomScale: (scale) => set({ zoomScale: scale }),

  reset: () => set({ 
    sourceImage: null, 
    sourceImageFile: null, 
    resultImage: null, 
    history: [],
    zoomScale: 1 
  })
}));