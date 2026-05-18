const axios = require('axios');
const Parser = require('rss-parser');
const summaryService = require('./summaryService');
const clusterService = require('./clusterService');
const sentimentService = require('./sentimentService');

const parser = new Parser();
let newsCache = {
  articles: [],
  clusters: [],
  lastUpdated: null
};

const fetchFromNewsAPI = async () => {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        pageSize: 50,
        apiKey: process.env.NEWS_API_KEY
      }
    });
    
    return response.data.articles.map(article => ({
      title: article.title,
      description: article.description || '',
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      image: article.urlToImage,
      content: article.content || article.description || ''
    }));
  } catch (error) {
    console.error('NewsAPI fetch error:', error.message);
    return [];
  }
};

const fetchFromRSS = async () => {
  const feeds = [
    'http://rss.cnn.com/rss/cnn_topstories.rss',
    'http://feeds.bbci.co.uk/news/rss.xml'
  ];
  
  let articles = [];
  
  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const feedArticles = feed.items.map(item => ({
        title: item.title,
        description: item.contentSnippet || item.content || '',
        url: item.link,
        source: feed.title,
        publishedAt: item.pubDate,
        image: item.enclosure?.url || null,
        content: item.contentSnippet || item.content || ''
      }));
      articles = articles.concat(feedArticles);
    } catch (error) {
      console.error(`RSS fetch error for ${feedUrl}:`, error.message);
    }
  }
  
  return articles;
};

const fetchAndProcessNews = async () => {
  try {
    const [newsApiArticles, rssArticles] = await Promise.all([
      fetchFromNewsAPI(),
      fetchFromRSS()
    ]);
    
    let allArticles = [...newsApiArticles, ...rssArticles];
    allArticles = allArticles.filter(a => a.title && a.url);
    
    const processedArticles = await Promise.all(
      allArticles.map(async (article) => {
        const summary = await summaryService.generateSummary(article);
        const sentiment = sentimentService.analyzeSentiment(article.content || article.description);
        
        return {
          ...article,
          summary,
          sentiment
        };
      })
    );
    
    const clusters = clusterService.clusterArticles(processedArticles);
    
    newsCache = {
      articles: processedArticles,
      clusters,
      lastUpdated: new Date().toISOString()
    };
    
    return newsCache;
  } catch (error) {
    console.error('Error processing news:', error.message);
    throw error;
  }
};

const getDigest = () => {
  return newsCache;
};

const getTopicNews = (topicName) => {
  const topic = topicName.toLowerCase();
  const filtered = newsCache.articles.filter(article => {
    const searchText = `${article.title} ${article.description}`.toLowerCase();
    return searchText.includes(topic);
  });
  
  return {
    topic: topicName,
    articles: filtered,
    count: filtered.length,
    lastUpdated: newsCache.lastUpdated
  };
};

module.exports = {
  fetchAndProcessNews,
  getDigest,
  getTopicNews
};
