const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

router.get('/:name', (req, res) => {
  try {
    const name = req.params.name;
    const result = newsService.getTopicNews(name);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Couldnt get topic news' });
  }
});

module.exports = router;
