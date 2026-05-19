import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import ClusterCard from './components/ClusterCard';
import TopicFilter from './components/TopicFilter';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_KEY = 'NewsNexus2024SecureKey';

function App() {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [topic, setTopic] = useState(null);
  const [mood, setMood] = useState('all');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async (refresh = false) => {
    setLoading(true);
    setErr(null);
    setTopic(null);
    setMood('all');
    try {
      if (refresh) {
        const r = await axios.post(`${API_URL}/refresh`, {}, {
          headers: { 'x-api-key': API_KEY }
        });

        if (r.data.lastUpdated) {
          setDigest(prev => ({
            ...prev,
            lastUpdated: r.data.lastUpdated
          }));
        }
      }

      const res = await axios.get(`${API_URL}/digest`, {
        headers: { 'x-api-key': API_KEY }
      });

      const newsData = res.data.data || res.data;
      setDigest(newsData);
    } catch (e) {
      setErr('Couldnt load the news. Check your API key and make sure the server is running.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const pickTopic = (t) => {
    if (t === 'all') {
      setTopic(null);
      setMood('all');
    } else {
      setTopic(t);
    }
  };

  const getFiltered = () => {
    if (!digest || !digest.articles) return [];

    let articles = digest.articles;

    if (topic) {
      articles = articles.filter(a =>
        a.topic && a.topic.toLowerCase() === topic.toLowerCase()
      );
    }

    if (mood !== 'all') {
      articles = articles.filter(a => a.sentiment === mood);
    }

    if (articles.length === 0) return [];

    if (!topic) {
      const mixed = [...articles].sort(() => Math.random() - 0.5);
      return [{
        id: 1,
        topic: 'Latest News',
        articles: mixed
      }];
    }

    return [{
      id: 1,
      topic: topic.charAt(0).toUpperCase() + topic.slice(1),
      articles: articles
    }];
  };

  const getSources = () => {
    if (!digest || !digest.articles) return 0;
    const unique = new Set(digest.articles.map(a => a.source));
    return unique.size;
  };

  if (loading) return <LoadingSpinner />;
  if (err) return <div className="error-message">{err}</div>;

  const filtered = getFiltered();
  const showing = filtered.reduce((sum, c) => sum + c.articles.length, 0);

  return (
    <div className="app">
      <Header onRefresh={() => loadNews(true)} lastUpdated={digest?.lastUpdated} />

      <div className="container">
        {digest && digest.articles && (
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{digest.articles.length}</span>
              <span className="stat-label">Articles</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{getSources()}</span>
              <span className="stat-label">Sources</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{showing}</span>
              <span className="stat-label">Showing</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {digest.articles.filter(a => a.sentiment === 'positive').length}
              </span>
              <span className="stat-label">Positive</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {digest.articles.filter(a => a.sentiment === 'negative').length}
              </span>
              <span className="stat-label">Negative</span>
            </div>
          </div>
        )}

        <TopicFilter
          onTopicSelect={pickTopic}
          selectedTopic={topic}
          sentimentFilter={mood}
          onSentimentChange={setMood}
        />

        <div className="clusters-grid">
          {filtered.length > 0 ? (
            filtered.map(cluster => (
              <ClusterCard key={cluster.id} cluster={cluster} />
            ))
          ) : (
            <div className="no-results">Nothing matches those filters right now.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
