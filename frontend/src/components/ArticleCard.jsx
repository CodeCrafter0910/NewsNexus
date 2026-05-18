import './ArticleCard.css';

const ArticleCard = ({ article }) => {
  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '#48bb78';
      case 'negative': return '#f56565';
      default: return '#4299e1';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="article-card">
      {article.image && (
        <div className="article-image">
          <img src={article.image} alt={article.title} />
        </div>
      )}
      
      <div className="article-content">
        <div className="article-meta">
          <span className="source">{article.source}</span>
          <span className="date">{formatDate(article.publishedAt)}</span>
          <span 
            className="sentiment-badge" 
            style={{ backgroundColor: getSentimentColor(article.sentiment) }}
          >
            {article.sentiment}
          </span>
        </div>
        
        <h3 className="article-title">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
        
        <p className="article-summary">{article.summary}</p>
        
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
          Read full article →
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
