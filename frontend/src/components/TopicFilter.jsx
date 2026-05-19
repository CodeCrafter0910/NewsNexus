import './TopicFilter.css';

const TopicFilter = ({ onTopicSelect, selectedTopic, sentimentFilter, onSentimentChange }) => {
  const topics = ['all', 'technology', 'politics', 'sports', 'business', 'health', 'science'];
  const moods = ['all', 'positive', 'neutral', 'negative'];

  return (
    <div className="topic-filter">
      <div className="filter-section">
        <label>Topics:</label>
        <div className="filter-buttons">
          {topics.map(t => (
            <button
              key={t}
              className={`filter-btn ${selectedTopic === t || (!selectedTopic && t === 'all') ? 'active' : ''}`}
              onClick={() => onTopicSelect(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label>Sentiment:</label>
        <div className="filter-buttons">
          {moods.map(m => (
            <button
              key={m}
              className={`filter-btn sentiment-${m} ${sentimentFilter === m ? 'active' : ''}`}
              onClick={() => onSentimentChange(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicFilter;
