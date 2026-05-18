const natural = require('natural');
const TfIdf = natural.TfIdf;

const clusterArticles = (articles) => {
  if (articles.length === 0) return [];
  
  const tfidf = new TfIdf();
  
  articles.forEach(article => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    tfidf.addDocument(text);
  });
  
  const clusters = [];
  const processed = new Set();
  
  articles.forEach((article, idx) => {
    if (processed.has(idx)) return;
    
    const cluster = {
      id: clusters.length + 1,
      topic: extractTopic(article),
      articles: [article]
    };
    
    processed.add(idx);
    
    articles.forEach((otherArticle, otherIdx) => {
      if (idx === otherIdx || processed.has(otherIdx)) return;
      
      const similarity = calculateSimilarity(tfidf, idx, otherIdx);
      
      if (similarity > 0.3) {
        cluster.articles.push(otherArticle);
        processed.add(otherIdx);
      }
    });
    
    clusters.push(cluster);
  });
  
  return clusters.sort((a, b) => b.articles.length - a.articles.length);
};

const calculateSimilarity = (tfidf, idx1, idx2) => {
  const terms1 = {};
  const terms2 = {};
  
  tfidf.listTerms(idx1).forEach(item => {
    terms1[item.term] = item.tfidf;
  });
  
  tfidf.listTerms(idx2).forEach(item => {
    terms2[item.term] = item.tfidf;
  });
  
  const allTerms = new Set([...Object.keys(terms1), ...Object.keys(terms2)]);
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  allTerms.forEach(term => {
    const val1 = terms1[term] || 0;
    const val2 = terms2[term] || 0;
    dotProduct += val1 * val2;
    mag1 += val1 * val1;
    mag2 += val2 * val2;
  });
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
};

const extractTopic = (article) => {
  const text = article.title.toLowerCase();
  const keywords = ['politics', 'technology', 'sports', 'business', 'health', 'science', 'entertainment', 'world'];
  
  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      return keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }
  }
  
  const words = article.title.split(' ').filter(w => w.length > 4);
  return words[0] || 'General';
};

module.exports = {
  clusterArticles
};
