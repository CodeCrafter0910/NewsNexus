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
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/digest', authMiddleware, digestRoutes);
app.use('/api/topic', authMiddleware, topicRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

cron.schedule('0 */2 * * *', async () => {
  console.log('Running scheduled news fetch...');
  try {
    await newsService.fetchAndProcessNews();
    console.log('News fetch completed successfully');
  } catch (error) {
    console.error('Error during scheduled fetch:', error.message);
  }
});

(async () => {
  try {
    await newsService.fetchAndProcessNews();
    console.log('Initial news fetch completed');
  } catch (error) {
    console.error('Initial fetch failed:', error.message);
  }
})();

app.listen(PORT, () => {
  console.log(`NewsNexus API running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
