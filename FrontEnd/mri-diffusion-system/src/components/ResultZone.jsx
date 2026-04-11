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
      if (resultImage.startsWith('blob:')) {
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'generated_mri.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
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

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 100);
      }

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="result-shell">
      {!resultImage && !isGenerating ? (
        <div className="result-empty">
          <ScanEye size={44} className="mb-3 opacity-70" />
          <span className="result-empty-title">等待推理开始</span>
          <span className="result-empty-hint">上传 T1 图像后点击中间按钮</span>
        </div>
      ) : isGenerating ? (
        <div className="result-loading">
          <div className="result-spinner" />
          <div className="result-loading-copy">DIFFUSION RECONSTRUCTING...</div>
        </div>
      ) : (
        <div className="image-stage">
          <img
            src={resultImage}
            style={{ transform: `scale(${zoomScale})` }}
            className="image-preview"
            alt="Result"
          />
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`result-download-btn ${
              isDownloading ? 'result-download-btn-disabled' : ''
            }`}
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-[#b8fff0] border-t-transparent rounded-full animate-spin" />
            ) : downloadSuccess ? (
              <CheckCircle2 size={18} className="text-[#7ff4b7]" />
            ) : (
              <Download size={18} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
