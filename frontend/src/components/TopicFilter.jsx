import './TopicFilter.css';

const TopicFilter = ({ onTopicSelect, selectedTopic, sentimentFilter, onSentimentChange }) => {
  const topics = ['all', 'technology', 'politics', 'sports', 'business', 'health', 'science'];
  const sentiments = ['all', 'positive', 'neutral', 'negative'];

  return (
    <div className="topic-filter">
      <div className="filter-section">
        <label>Topics:</label>
        <div className="filter-buttons">
          {topics.map(topic => (
            <button
              key={topic}
              className={`filter-btn ${selectedTopic === topic || (!selectedTopic && topic === 'all') ? 'active' : ''}`}
              onClick={() => onTopicSelect(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <label>Sentiment:</label>
        <div className="filter-buttons">
          {sentiments.map(sentiment => (
            <button
              key={sentiment}
              className={`filter-btn sentiment-${sentiment} ${sentimentFilter === sentiment ? 'active' : ''}`}
              onClick={() => onSentimentChange(sentiment)}
            >
              {sentiment}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicFilter;
