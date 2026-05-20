require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const newsService = require('./services/newsService');
const digestRoutes = require('./routes/digest');
const topicRoutes = require('./routes/topics');
const refreshRoutes = require('./routes/refresh');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later.'
});

app.use('/api/', limiter);

const swaggerDoc = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api/digest', authMiddleware, digestRoutes);
app.use('/api/topic', authMiddleware, topicRoutes);
app.use('/api/refresh', authMiddleware, refreshRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

cron.schedule('0 */2 * * *', async () => {
  console.log('Fetching news on schedule...');
  try {
    await newsService.fetchAndProcessNews();
    console.log('Done fetching news');
  } catch (err) {
    console.error('Scheduled fetch failed:', err.message);
  }
});

cron.schedule('*/14 * * * *', async () => {
  try {
    const axios = require('axios');
    await axios.get('https://newsnexus-api.onrender.com/api/health');
    console.log('Keep-alive ping sent');
  } catch (err) {
    console.error('Keep-alive ping failed:', err.message);
  }
});

(async () => {
  try {
    await newsService.fetchAndProcessNews();
    console.log('Got initial news');
  } catch (err) {
    console.error('First fetch didnt work:', err.message);
  }
})();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Docs at http://localhost:${PORT}/api-docs`);
});
