import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import ClusterCard from './components/ClusterCard';
import TopicFilter from './components/TopicFilter';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const API_BASE = 'http://localhost:5000/api';
const API_KEY = 'NewsNexus2024SecureKey';

function App() {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [sentimentFilter, setSentimentFilter] = useState('all');

  useEffect(() => {
    fetchDigest();
  }, []);

  const fetchDigest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/digest`, {
        headers: { 'x-api-key': API_KEY }
      });
      setDigest(response.data);
    } catch (err) {
      setError('Failed to load news. Please check your API key and server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicNews = async (topic) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/topic/${topic}`, {
        headers: { 'x-api-key': API_KEY }
      });
      setDigest({
        articles: response.data.articles,
        clusters: [{ id: 1, topic: topic, articles: response.data.articles }],
        lastUpdated: response.data.lastUpdated
      });
      setSelectedTopic(topic);
    } catch (err) {
      setError('Failed to load topic news.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topic) => {
    if (topic === 'all') {
      setSelectedTopic(null);
      fetchDigest();
    } else {
      fetchTopicNews(topic);
    }
  };

  const getFilteredClusters = () => {
    if (!digest || !digest.clusters) return [];
    
    if (sentimentFilter === 'all') {
      return digest.clusters;
    }
    
    return digest.clusters.map(cluster => ({
      ...cluster,
      articles: cluster.articles.filter(article => article.sentiment === sentimentFilter)
    })).filter(cluster => cluster.articles.length > 0);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  const filteredClusters = getFilteredClusters();

  return (
    <div className="app">
      <Header onRefresh={fetchDigest} lastUpdated={digest?.lastUpdated} />
      
      <div className="container">
        <TopicFilter 
          onTopicSelect={handleTopicSelect}
          selectedTopic={selectedTopic}
          sentimentFilter={sentimentFilter}
          onSentimentChange={setSentimentFilter}
        />
        
        <div className="clusters-grid">
          {filteredClusters.length > 0 ? (
            filteredClusters.map(cluster => (
              <ClusterCard key={cluster.id} cluster={cluster} />
            ))
          ) : (
            <div className="no-results">No articles found matching your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
