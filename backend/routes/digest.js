const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

router.get('/', (req, res) => {
  try {
    const digest = newsService.getDigest();
    res.json(digest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve digest' });
  }
});

module.exports = router;
