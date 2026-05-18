import './Header.css';

const Header = ({ onRefresh, lastUpdated }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <img src="/logo.svg" alt="NewsNexus" className="logo" />
          <h1>NewsNexus</h1>
        </div>
        
        <div className="header-actions">
          <span className="last-updated">
            Last updated: {formatDate(lastUpdated)}
          </span>
          <button onClick={onRefresh} className="refresh-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
