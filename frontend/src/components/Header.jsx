import { useState } from 'react';
import './Header.css';

const Header = ({ onRefresh, lastUpdated }) => {
  const [spinning, setSpinning] = useState(false);

  const showDate = (str) => {
    if (!str) return 'Never';
    return new Date(str).toLocaleString();
  };

  const handleRefresh = async () => {
    setSpinning(true);
    await onRefresh();
    setTimeout(() => setSpinning(false), 1200);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <img src="/logo.svg" alt="NewsNexus" className="logo-img" />
        </div>

        <div className="header-actions">
          <div className="status-badge">
            <span className="live-dot"></span>
            <span className="last-updated">Updated: {showDate(lastUpdated)}</span>
          </div>
          <button onClick={handleRefresh} className="refresh-btn" disabled={spinning}>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              style={{
                animation: spinning ? 'spin 0.8s linear infinite' : 'none'
              }}
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {spinning ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
