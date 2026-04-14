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
          <ScanEye size={40} className="mb-3 opacity-70" />
          <span className="result-empty-title">{'\u7b49\u5f85\u751f\u6210\u7ed3\u679c'}</span>
          <span className="result-empty-hint">{'\u4e0a\u4f20\u6e90\u56fe\u50cf\u540e\u70b9\u51fb\u4e2d\u95f4\u6309\u94ae\u5f00\u59cb\u63a8\u7406'}</span>
        </div>
      ) : isGenerating ? (
        <div className="result-loading">
          <div className="result-spinner" />
          <div className="result-loading-copy">{'\u6b63\u5728\u751f\u6210\u56fe\u50cf\uff0c\u8bf7\u7a0d\u5019...'}</div>
        </div>
      ) : (
        <div className="image-stage">
          <img
            src={resultImage}
            style={{ transform: `scale(${zoomScale})` }}
            className="image-preview"
            alt="generated-mri"
          />
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`result-download-btn ${
              isDownloading ? 'result-download-btn-disabled' : ''
            }`}
            aria-label="download-generated-image"
          >
            {isDownloading ? (
              <div className="result-download-spinner" />
            ) : downloadSuccess ? (
              <CheckCircle2 size={18} className="text-[#7ea7c7]" />
            ) : (
              <Download size={18} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
