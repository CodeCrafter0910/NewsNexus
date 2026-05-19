const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

router.get('/', (req, res) => {
  try {
    const digest = newsService.getDigest();

    if (!digest || !digest.articles || digest.articles.length === 0) {
      return res.status(503).json({
        error: 'News not ready yet, try again in a bit.',
        lastUpdated: digest?.lastUpdated || null
      });
    }

    res.json({
      success: true,
      data: digest,
      meta: {
        totalArticles: digest.articles.length,
        totalClusters: digest.clusters.length,
        lastUpdated: digest.lastUpdated
      }
    });
  } catch (err) {
    console.error('Digest error:', err);
    res.status(500).json({
      success: false,
      error: 'Couldnt get the digest',
      message: err.message
    });
  }
});

module.exports = router;
