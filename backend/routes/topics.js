const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

router.get('/:name', (req, res) => {
  try {
    const topicName = req.params.name;
    const topicNews = newsService.getTopicNews(topicName);
    res.json(topicNews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve topic news' });
  }
});

module.exports = router;
