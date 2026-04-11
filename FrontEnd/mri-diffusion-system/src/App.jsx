import React, { useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ActionPanel } from './components/ActionPanel';
import { ResultZone } from './components/ResultZone';
import { ComparisonMode } from './components/ComparisonMode';
import { useStore } from './store/useStore';

function App() {
  const { setZoomScale, zoomScale } = useStore();

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
      <Header />

      <main className="main-content">
        <section className="side-section">
          <div className="panel-head">
            <span className="panel-title source-modality">SOURCE MODALITY / T1</span>
            <span className="panel-meta">ZOOM {Math.round(zoomScale * 100)}%</span>
          </div>
          <UploadZone />
        </section>

        <div className="action-panel-container">
          <ActionPanel />
        </div>

        <section className="side-section">
          <div className="panel-head">
            <span className="panel-title target-modality">TARGET MODALITY / T2</span>
            <span className="panel-meta">DIFFUSION OUTPUT</span>
          </div>
          <ResultZone />
        </section>
      </main>

      <footer className="footer-content">
        <div className="comparison-panel">
          <ComparisonMode />
        </div>
      </footer>
    </div>
  );
}

export default App;
