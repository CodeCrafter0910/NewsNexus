const natural = require('natural');
const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();

const analyzer = new Analyzer('English', stemmer, 'afinn');

const analyzeSentiment = (text) => {
  if (!text) return 'neutral';
  
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const score = analyzer.getSentiment(tokens);
  
  if (score > 0.1) return 'positive';
  if (score < -0.1) return 'negative';
  return 'neutral';
};

module.exports = {
  analyzeSentiment
};
