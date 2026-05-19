const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

router.post('/', async (req, res) => {
  try {
    console.log('Manual refresh started...');
    const ts = new Date().toISOString();
    await newsService.fetchAndProcessNews();
    const digest = newsService.getDigest();
    res.json({
      success: true,
      message: 'News refreshed',
      lastUpdated: ts,
      totalArticles: digest.articles.length
    });
  } catch (err) {
    console.error('Refresh broke:', err);
    res.status(500).json({
      success: false,
      error: 'Refresh didnt work'
    });
  }
});

module.exports = router;
