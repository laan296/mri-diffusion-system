import { Activity, Cpu, Sparkles } from 'lucide-react';

export const Header = () => (
  <header className="app-header">
    <div className="brand-block">
      <div className="brand-icon-wrap">
        <Activity className="brand-icon" />
      </div>
      <div>
        <p className="brand-kicker">NEURO IMAGING WORKBENCH</p>
        <h1 className="brand-title">基于扩散模型的多模态脑 MRI 生成系统</h1>
      </div>
    </div>

    <div className="status-cluster">
      <span className="status-chip">
        <Cpu size={13} /> GPU READY
      </span>
      <span className="status-chip status-chip-live">
        <Sparkles size={13} /> VER 1.0
      </span>
    </div>
  </header>
);
