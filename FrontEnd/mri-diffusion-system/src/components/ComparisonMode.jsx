import ReactCompareImage from 'react-compare-image';
import { useStore } from '../store/useStore';


export const ComparisonMode = () => {
  const { sourceImage, resultImage } = useStore();
  
  if (!sourceImage || !resultImage) return (
    <div className="w-full h-full flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">卷帘比较模式</h3>
        <span className="text-[10px] text-slate-600">滑动控制</span>
      </div>
      {/* 提示信息 */}
      <div className="flex-1 flex items-center justify-center text-slate-700 text-xs uppercase tracking-widest border border-dashed border-slate-800 rounded-lg m-2">
        激活卷帘对比模式需完成一次生成
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">卷帘比较模式</h3>
        <span className="text-[10px] text-slate-600">滑动控制</span>
      </div>
      {/* 比较模式内容 */}
      <div className="flex-1 overflow-hidden rounded-lg flex items-center justify-center bg-black">
        <ReactCompareImage leftImage={sourceImage} rightImage={resultImage} />
      </div>
    </div>
  );
};

