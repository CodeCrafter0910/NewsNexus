const natural = require('natural');
const TfIdf = natural.TfIdf;

const clusterArticles = (articles) => {
  if (articles.length === 0) return [];

  const tfidf = new TfIdf();

  articles.forEach(article => {
    const txt = `${article.title} ${article.description}`.toLowerCase();
    tfidf.addDocument(txt);
  });

  const clusters = [];
  const done = new Set();

  articles.forEach((article, i) => {
    if (done.has(i)) return;

    const group = {
      id: clusters.length + 1,
      topic: figureTopic(article),
      articles: [article]
    };

    done.add(i);

    articles.forEach((other, j) => {
      if (i === j || done.has(j)) return;

      const sim = getSimilarity(tfidf, i, j);

      if (sim > 0.3) {
        group.articles.push(other);
        done.add(j);
      }
    });

    clusters.push(group);
  });

  return clusters.sort((a, b) => b.articles.length - a.articles.length);
};

const getSimilarity = (tfidf, i, j) => {
  const vec1 = {};
  const vec2 = {};

  tfidf.listTerms(i).forEach(item => {
    vec1[item.term] = item.tfidf;
  });

  tfidf.listTerms(j).forEach(item => {
    vec2[item.term] = item.tfidf;
  });

  const allWords = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dot = 0;
  let m1 = 0;
  let m2 = 0;

  allWords.forEach(word => {
    const v1 = vec1[word] || 0;
    const v2 = vec2[word] || 0;
    dot += v1 * v2;
    m1 += v1 * v1;
    m2 += v2 * v2;
  });

  if (m1 === 0 || m2 === 0) return 0;

  return dot / (Math.sqrt(m1) * Math.sqrt(m2));
};

const figureTopic = (article) => {
  if (article.category && article.category !== 'general') {
    return article.category.charAt(0).toUpperCase() + article.category.slice(1);
  }

  const text = `${article.title} ${article.description} ${article.source}`.toLowerCase();

  const topicWords = {
    'Politics': [
      'election', 'president', 'biden', 'trump', 'congress', 'senate', 'house',
      'government', 'political', 'vote', 'voting', 'campaign', 'democrat', 'republican',
      'policy', 'law', 'court', 'supreme court', 'white house', 'governor', 'mayor',
      'senator', 'representative', 'legislation', 'bill', 'parliament', 'minister',
      'prime minister', 'administration', 'cabinet', 'impeachment', 'scandal',
      'diplomacy', 'foreign policy', 'domestic policy', 'executive order', 'veto',
      'filibuster', 'midterm', 'primary', 'caucus', 'ballot', 'referendum',
      'constitution', 'amendment', 'justice', 'attorney general', 'state department',
      'pentagon', 'cia', 'fbi', 'homeland security', 'immigration', 'border',
      'sanctions', 'treaty', 'summit', 'nato', 'un', 'united nations'
    ],
    'Technology': [
      'tech', 'technology', 'software', 'app', 'digital', 'computer', 'internet',
      'ai', 'artificial intelligence', 'iphone', 'android', 'google', 'apple',
      'microsoft', 'amazon', 'facebook', 'meta', 'twitter', 'data', 'cyber',
      'online', 'startup', 'silicon valley', 'programming', 'coding', 'developer',
      'cloud', 'blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'nft',
      'machine learning', 'robot', 'automation', 'algorithm', 'database',
      'server', 'network', 'security', 'hack', 'breach', 'privacy', 'encryption'
    ],
    'Sports': [
      'game', 'team', 'player', 'football', 'basketball', 'baseball', 'soccer',
      'nfl', 'nba', 'mlb', 'nhl', 'championship', 'coach', 'score', 'match',
      'league', 'tournament', 'playoff', 'super bowl', 'world series', 'olympics',
      'athlete', 'sport', 'win', 'loss', 'defeat', 'victory', 'champion',
      'stadium', 'arena', 'draft', 'trade', 'contract', 'injury', 'season',
      'tennis', 'golf', 'racing', 'boxing', 'mma', 'ufc', 'wrestling', 'cricket'
    ],
    'Business': [
      'company', 'companies', 'market', 'stock', 'stocks', 'economy', 'economic',
      'business', 'trade', 'finance', 'financial', 'investment', 'investor',
      'ceo', 'profit', 'revenue', 'sales', 'industry', 'wall street', 'dow', 'nasdaq',
      'earnings', 'quarter', 'fiscal', 'merger', 'acquisition', 'ipo', 'shares',
      'dividend', 'bond', 'commodity', 'oil', 'gold', 'inflation', 'recession',
      'gdp', 'unemployment', 'jobs', 'employment', 'retail', 'consumer', 'corporate'
    ],
    'Health': [
      'health', 'healthcare', 'medical', 'doctor', 'hospital', 'disease',
      'treatment', 'patient', 'drug', 'vaccine', 'covid', 'coronavirus', 'virus',
      'medicine', 'care', 'fda', 'cdc', 'mental health', 'wellness', 'therapy',
      'clinic', 'surgery', 'diagnosis', 'symptom', 'pandemic', 'epidemic',
      'pharmaceutical', 'prescription', 'clinical trial', 'cancer', 'diabetes',
      'heart disease', 'stroke', 'alzheimer', 'nutrition', 'diet', 'fitness'
    ],
    'Science': [
      'science', 'scientific', 'research', 'study', 'scientist', 'discovery',
      'space', 'nasa', 'climate', 'environment', 'environmental', 'energy',
      'experiment', 'biology', 'physics', 'chemistry', 'astronomy', 'planet',
      'mars', 'moon', 'rocket', 'satellite', 'telescope', 'galaxy', 'universe',
      'global warming', 'carbon', 'emission', 'renewable', 'solar', 'wind power',
      'nuclear', 'fossil fuel', 'conservation', 'species', 'extinction', 'ocean'
    ]
  };

  let best = 0;
  let picked = 'General';

  for (const [topic, words] of Object.entries(topicWords)) {
    let score = 0;
    for (const w of words) {
      if (text.includes(w)) {
        score += w.split(' ').length * 2;
      }
    }
    if (score > best) {
      best = score;
      picked = topic;
    }
  }

  if (best === 0) {
    const longWords = article.title.split(' ').filter(w => w.length > 5);
    if (longWords.length > 0) {
      return longWords[0].charAt(0).toUpperCase() + longWords[0].slice(1);
    }
  }

  return picked;
};

const getArticleTopic = (article) => {
  return figureTopic(article);
};

module.exports = {
  clusterArticles,
  extractTopicForArticle: getArticleTopic
};
