const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateSummary = async (article) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_key_here') {
      return fallbackSummary(article);
    }
    
    const prompt = `Summarize this news article in exactly 2 concise lines:\n\nTitle: ${article.title}\nContent: ${article.content || article.description}`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.5
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI summary error:', error.message);
    return fallbackSummary(article);
  }
};

const fallbackSummary = (article) => {
  const text = article.description || article.content || article.title;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length >= 2) {
    return `${sentences[0].trim()}. ${sentences[1].trim()}.`;
  } else if (sentences.length === 1) {
    const words = sentences[0].trim().split(' ');
    if (words.length > 30) {
      return words.slice(0, 30).join(' ') + '...';
    }
    return sentences[0].trim() + '.';
  }
  
  return text.substring(0, 150) + '...';
};

module.exports = {
  generateSummary
};
