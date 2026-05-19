const axios = require('axios');

const generateSummary = async (article) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_key_here') {
      return makeBasicSummary(article);
    }

    const text = article.content || article.description || article.title;
    const prompt = `Summarize this news article in exactly 2 short sentences (maximum 40 words total):\n\n${article.title}\n\n${text.substring(0, 500)}`;

    const resp = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 100
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }
    );

    if (resp.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return resp.data.candidates[0].content.parts[0].text.trim();
    }

    return makeBasicSummary(article);
  } catch (err) {
    return makeBasicSummary(article);
  }
};

const makeBasicSummary = (article) => {
  const text = article.description || article.content || article.title;
  const parts = text.split(/[.!?]+/).filter(s => s.trim().length > 20);

  if (parts.length >= 2) {
    return `${parts[0].trim()}. ${parts[1].trim()}.`;
  } else if (parts.length === 1) {
    const words = parts[0].trim().split(' ');
    if (words.length > 25) {
      return words.slice(0, 25).join(' ') + '...';
    }
    return parts[0].trim() + '.';
  }

  const words = text.trim().split(' ');
  if (words.length > 25) {
    return words.slice(0, 25).join(' ') + '...';
  }
  return text.substring(0, 150) + '...';
};

module.exports = {
  generateSummary
};
