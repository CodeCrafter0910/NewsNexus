import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading news digest...</p>
    </div>
  );
};

export default LoadingSpinner;
