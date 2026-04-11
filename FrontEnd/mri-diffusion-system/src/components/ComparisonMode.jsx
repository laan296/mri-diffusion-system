import ReactCompareImage from 'react-compare-image';
import { useStore } from '../store/useStore';

export const ComparisonMode = () => {
  const { sourceImage, resultImage } = useStore();

  if (!sourceImage || !resultImage) {
    return (
      <div className="comparison-wrap">
        <div className="comparison-head">
          <h3 className="comparison-title">COMPARISON MODE</h3>
          <span className="comparison-hint">拖动滑块查看差异</span>
        </div>
        <div className="comparison-empty">完成一次生成后可使用对比模式</div>
      </div>
    );
  }

  return (
    <div className="comparison-wrap">
      <div className="comparison-head">
        <h3 className="comparison-title">COMPARISON MODE</h3>
        <span className="comparison-hint">拖动滑块查看差异</span>
      </div>
      <div className="comparison-body">
        <ReactCompareImage leftImage={sourceImage} rightImage={resultImage} />
      </div>
    </div>
  );
};
