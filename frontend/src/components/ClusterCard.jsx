import ArticleCard from './ArticleCard';
import './ClusterCard.css';

const ClusterCard = ({ cluster }) => {
  return (
    <div className="cluster-card">
      <div className="cluster-header">
        <h2>{cluster.topic}</h2>
        <span className="article-count">{cluster.articles.length} articles</span>
      </div>

      <div className="articles-list">
        {cluster.articles.map((article, i) => (
          <ArticleCard key={i} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ClusterCard;
