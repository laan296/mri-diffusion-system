import { Download, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import ReactCompareImage from 'react-compare-image';
import { useStore } from '../store/useStore';

const comparisonTitle = '\u5bf9\u6bd4\u6a21\u5f0f';

const downloadImage = async (imageUrl) => {
  if (!imageUrl) return;

  if (imageUrl.startsWith('blob:')) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated_mri.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error('Failed to fetch image');

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = 'generated_mri.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
};

export const ComparisonMode = ({ fullPage = false, onOpenComparison }) => {
  const { sourceImage, resultImage } = useStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (!resultImage) return;

    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      await downloadImage(resultImage);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 1800);
    } catch (error) {
      console.error('Comparison download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const hasImages = Boolean(sourceImage && resultImage);

  return (
    <div className={`comparison-wrap ${fullPage ? 'comparison-wrap-full' : ''}`}>
      <div className="comparison-head">
        <div className="comparison-head-copy">
          <h3 className="comparison-title">{comparisonTitle}</h3>
          <span className="comparison-hint">{'\u6e90 MRI \u4e0e\u751f\u6210 MRI \u89c6\u89c9\u5bf9\u6bd4'}</span>
        </div>

        <div className="comparison-actions">
          {fullPage ? (
            <button
              type="button"
              className={`comparison-download-btn ${isDownloading ? 'comparison-download-btn-disabled' : ''}`}
              onClick={handleDownload}
              disabled={!resultImage || isDownloading}
            >
              {downloadSuccess ? <CheckCircle2 size={15} /> : <Download size={15} />}
              {'\u4e0b\u8f7d\u7ed3\u679c'}
            </button>
          ) : (
            <button
              type="button"
              className="comparison-download-btn comparison-download-btn-link"
              onClick={onOpenComparison}
            >
              {'\u6253\u5f00\u5b8c\u6574\u5bf9\u6bd4\u533a'}
            </button>
          )}
        </div>
      </div>

      {!hasImages ? (
        <div className="comparison-empty">{'\u5b8c\u6210\u4e00\u6b21\u751f\u6210\u540e\u5373\u53ef\u8fdb\u884c\u5de6\u53f3\u5bf9\u6bd4'}</div>
      ) : (
        <div className="comparison-body">
          <div className="comparison-label-row">
            <span className="comparison-label">{'\u6e90 MRI'}</span>
            <span className="comparison-label">{'\u751f\u6210 MRI'}</span>
          </div>
          <div className="comparison-slider-wrap">
            <ReactCompareImage leftImage={sourceImage} rightImage={resultImage} />
          </div>
        </div>
      )}
    </div>
  );
};
