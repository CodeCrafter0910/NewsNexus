const axios = require('axios');
const Parser = require('rss-parser');
const summaryService = require('./summaryService');
const clusterService = require('./clusterService');
const sentimentService = require('./sentimentService');

const parser = new Parser();
let cached = {
  articles: [],
  clusters: [],
  lastUpdated: null
};

const grabFromNewsAPI = async () => {
  try {
    const cats = ['technology', 'business', 'sports', 'health', 'science', 'entertainment'];
    const all = [];

    for (const cat of cats) {
      try {
        const resp = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            country: 'us',
            category: cat,
            pageSize: 15,
            apiKey: process.env.NEWS_API_KEY
          }
        });

        const mapped = resp.data.articles.map(a => ({
          title: a.title,
          description: a.description || '',
          url: a.url,
          source: a.source.name,
          publishedAt: a.publishedAt,
          image: a.urlToImage,
          content: a.content || a.description || '',
          category: cat
        }));

        all.push(...mapped);
      } catch (err) {
        console.error(`NewsAPI error for ${cat}:`, err.message);
      }
    }

    try {
      const genResp = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          country: 'us',
          pageSize: 30,
          apiKey: process.env.NEWS_API_KEY
        }
      });

      const genArticles = genResp.data.articles.map(a => ({
        title: a.title,
        description: a.description || '',
        url: a.url,
        source: a.source.name,
        publishedAt: a.publishedAt,
        image: a.urlToImage,
        content: a.content || a.description || '',
        category: 'general'
      }));

      all.push(...genArticles);
    } catch (err) {
      console.error('General headlines error:', err.message);
    }

    return all;
  } catch (err) {
    console.error('NewsAPI totally failed:', err.message);
    return [];
  }
};

const grabFromRSS = async () => {
  const feedUrls = [
    'http://rss.cnn.com/rss/cnn_topstories.rss',
    'http://feeds.bbci.co.uk/news/rss.xml',
    'http://rss.cnn.com/rss/cnn_tech.rss',
    'http://rss.cnn.com/rss/cnn_health.rss',
    'http://rss.cnn.com/rss/cnn_world.rss',
    'http://rss.cnn.com/rss/cnn_us.rss',
    'http://rss.cnn.com/rss/cnn_allpolitics.rss',
    'http://feeds.bbci.co.uk/news/technology/rss.xml',
    'http://feeds.bbci.co.uk/news/health/rss.xml',
    'http://feeds.bbci.co.uk/news/business/rss.xml',
    'http://feeds.bbci.co.uk/news/politics/rss.xml',
    'http://feeds.bbci.co.uk/news/world/rss.xml'
  ];

  let results = [];

  for (const url of feedUrls) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.slice(0, 15).map(item => ({
        title: item.title,
        description: item.contentSnippet || item.content || item.summary || '',
        url: item.link,
        source: feed.title,
        publishedAt: item.pubDate || item.isoDate,
        image: item.enclosure?.url || null,
        content: item.contentSnippet || item.content || item.summary || ''
      }));
      results = results.concat(items);
    } catch (err) {
      console.error(`RSS failed for ${url}:`, err.message);
    }
  }

  return results;
};

const fetchAndProcessNews = async () => {
  try {
    const [apiNews, rssNews] = await Promise.all([
      grabFromNewsAPI(),
      grabFromRSS()
    ]);

    let everything = [...apiNews, ...rssNews];
    everything = everything.filter(a => a.title && a.url);

    const processed = await Promise.all(
      everything.map(async (article) => {
        const summary = await summaryService.generateSummary(article);
        const sentiment = sentimentService.analyzeSentiment(article.content || article.description);
        const topic = clusterService.extractTopicForArticle(article);

        return {
          ...article,
          summary,
          sentiment,
          topic
        };
      })
    );

    const clusters = clusterService.clusterArticles(processed);

    const topicCount = {};
    processed.forEach(a => {
      const t = a.topic || 'General';
      topicCount[t] = (topicCount[t] || 0) + 1;
    });
    console.log('Topics:', topicCount);
    console.log('Total articles:', processed.length);

    cached = {
      articles: processed,
      clusters,
      lastUpdated: new Date().toISOString()
    };

    return cached;
  } catch (err) {
    console.error('Processing failed:', err.message);
    throw err;
  }
};

const getDigest = () => {
  return cached;
};

const getTopicNews = (topicName) => {
  const matched = cached.articles.filter(a => {
    return a.topic && a.topic.toLowerCase() === topicName.toLowerCase();
  });

  return {
    topic: topicName,
    articles: matched,
    count: matched.length,
    lastUpdated: cached.lastUpdated
  };
};

module.exports = {
  fetchAndProcessNews,
  getDigest,
  getTopicNews
};
