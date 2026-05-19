import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <div className="spinner-inner"></div>
      </div>
      <p className="loading-text">
        Loading your news feed
        <span className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </p>
    </div>
  );
};

export default LoadingSpinner;
