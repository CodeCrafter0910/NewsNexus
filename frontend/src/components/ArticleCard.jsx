import './ArticleCard.css';

const ArticleCard = ({ article }) => {
  const moodClass = (s) => {
    if (s === 'positive') return 'sentiment-positive';
    if (s === 'negative') return 'sentiment-negative';
    return 'sentiment-neutral';
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const mins = Math.floor((now - d) / (1000 * 60));

    if (mins < 5) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const topicColors = {
    technology: '#6366f1',
    politics: '#ec4899',
    sports: '#f59e0b',
    business: '#10b981',
    health: '#ef4444',
    science: '#06b6d4',
    general: '#8b5cf6'
  };

  const topicColor = topicColors[(article.topic || '').toLowerCase()] || '#6366f1';

  return (
    <div className="article-card">
      {article.image ? (
        <div className="article-image">
          <img
            src={article.image}
            alt=""
            loading="lazy"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
          <div className="image-overlay"></div>
        </div>
      ) : (
        <div className="article-color-bar" style={{ background: `linear-gradient(135deg, ${topicColor}, ${topicColor}88)` }}></div>
      )}

      <div className="article-content">
        <div className="article-meta">
          <span className="source">{article.source}</span>
          <span className="meta-dot">·</span>
          <span className="date">{timeAgo(article.publishedAt)}</span>
          <span className={`sentiment-badge ${moodClass(article.sentiment)}`}>
            {article.sentiment}
          </span>
        </div>

        <h3 className="article-title">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>

        {article.summary && (
          <div className="summary-section">
            <p className="article-summary">{article.summary}</p>
          </div>
        )}

        <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
          Read full article
          <span className="read-more-arrow">→</span>
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
