import { useStore } from '../store/useStore';

export const HistoryBar = () => {
  const { history } = useStore();
  return (
    <div className="flex flex-col h-full">
      <h4 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Recent Logs</h4>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {history.length === 0 && <div className="text-[10px] text-slate-700 italic">No history yet</div>}
        {history.map((url, i) => (
          <img key={i} src={url} className="h-24 w-24 object-cover rounded border border-slate-800 hover:border-blue-500 transition-colors cursor-pointer" />
        ))}
      </div>
    </div>
  );
};