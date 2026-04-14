import { Activity, Cpu, Sparkles } from 'lucide-react';

const cnTitle = '\u591a\u6a21\u6001\u8111 MRI \u751f\u6210\u7cfb\u7edf';

const tabs = [
  { id: 'generation', label: '\u56fe\u50cf\u751f\u6210' },
  { id: 'comparison', label: '\u7ed3\u679c\u5bf9\u6bd4' },
];

export const Header = ({ activeTab, onTabChange }) => (
  <header className="app-header">
    <div className="app-header-inner">
      <div className="brand-block">
        <div className="brand-icon-wrap">
          <Activity className="brand-icon" />
        </div>
        <div className="brand-copy">
          <h1 className="brand-title-cn">{cnTitle}</h1>
        </div>
      </div>

      <div className="header-right">
        <nav className="nav-tabs" aria-label="main-views">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`nav-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="status-cluster">
          <span className="status-chip">
            <Cpu size={13} /> {'GPU \u5c31\u7eea'}
          </span>
          <span className="status-chip status-chip-live">
            <Sparkles size={13} /> {'\u7248\u672c 1.0'}
          </span>
        </div>
      </div>
    </div>
  </header>
);
