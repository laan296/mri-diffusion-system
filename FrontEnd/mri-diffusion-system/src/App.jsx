import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ActionPanel } from './components/ActionPanel';
import { ResultZone } from './components/ResultZone';
import { ComparisonMode } from './components/ComparisonMode';
import { useStore } from './store/useStore';

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.24, ease: 'easeOut' },
};

const workflowSteps = [
  '\u4e0a\u4f20\u56fe\u50cf',
  '\u5f00\u59cb\u63a8\u7406',
  '\u67e5\u770b\u7ed3\u679c',
  '\u5bf9\u6bd4\u4e0e\u4e0b\u8f7d',
];

function App() {
  const { setZoomScale, zoomScale } = useStore();
  const [activeTab, setActiveTab] = useState('generation');

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoomScale(Math.min(Math.max(zoomScale + delta, 0.5), 5));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoomScale, setZoomScale]);

  return (
    <div className="app-container">
      <div className="app-background-grid" aria-hidden="true" />
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence mode="wait" initial={false}>
        {activeTab === 'generation' ? (
          <motion.div key="generation" className="page-shell" {...pageMotion}>
            <main className="main-content">
              <section className="side-section source-section">
                <div className="panel-head">
                  <span className="panel-title source-modality">{'\u6e90 MRI / T1'}</span>
                  <span className="panel-meta">
                    {'\u7f29\u653e '} {Math.round(zoomScale * 100)}%
                  </span>
                </div>
                <UploadZone />
              </section>

              <div className="action-panel-container control-section">
                <ActionPanel onSwitchComparison={() => setActiveTab('comparison')} />
              </div>

              <section className="side-section result-section">
                <div className="panel-head">
                  <span className="panel-title target-modality">{'\u76ee\u6807 MRI / T2'}</span>
                  <span className="panel-meta">{'\u751f\u6210\u8f93\u51fa'}</span>
                </div>
                <ResultZone />
              </section>
            </main>

            <section className="workflow-guide" aria-label="workflow-guide">
              <h3 className="workflow-title">{'\u6d41\u7a0b\u6307\u5f15'}</h3>
              <div className="workflow-steps">
                {workflowSteps.map((item, index) => (
                  <div key={item} className="workflow-step">
                    <span className="workflow-step-index">{index + 1}</span>
                    <span className="workflow-step-text">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div key="comparison" className="page-shell" {...pageMotion}>
            <section className="comparison-panel comparison-section comparison-panel-full">
              <ComparisonMode fullPage />
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
