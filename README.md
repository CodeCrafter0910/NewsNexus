# NewsNexus

Multi-source news aggregation platform with AI-powered summaries and smart clustering.

## Features

### Core Features
- Multi-source news collection (NewsAPI + RSS feeds)
- Scheduled updates every 2 hours
- AI-powered 2-line summaries using OpenAI GPT-3.5
- Article clustering by topic using TF-IDF
- REST API with /digest and /topic endpoints
- Modern React frontend

### Bonus Features
- Sentiment analysis (positive/neutral/negative)
- Topic filtering and subscriptions
- API key authentication
- Rate limiting (100 requests per 15 minutes)
- Complete API documentation (Swagger/OpenAPI)

## Tech Stack

**Backend:** Node.js, Express, OpenAI API, Natural NLP, RSS Parser, Node-cron  
**Frontend:** React 18, Vite, Axios, CSS3

## Installation

### Prerequisites
- Node.js 16+
- NewsAPI key from https://newsapi.org
- OpenAI API key from https://platform.openai.com

### Setup

1. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Create `backend/.env`:
```env
PORT=5000
NEWS_API_KEY=your_newsapi_key
OPENAI_API_KEY=your_openai_key
API_SECRET_KEY=your_secret_key_for_auth
NODE_ENV=development
```

3. Update `frontend/src/App.jsx` line 8 with your API_SECRET_KEY

### Run

```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

Frontend: http://localhost:3000  
API Docs: http://localhost:5000/api-docs

## API Endpoints

- `GET /api/digest` - All clustered news (requires x-api-key header)
- `GET /api/topic/:name` - Filter by topic (requires x-api-key header)
- `GET /api/health` - Health check (no auth)

## Project Structure

```
NewsNexus/
├── backend/
│   ├── middleware/auth.js
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── swagger.yaml
├── frontend/
│   ├── src/components/
│   ├── src/App.jsx
│   └── public/
├── POSTMAN_COLLECTION.json
└── README.md
```

## Testing

Import `POSTMAN_COLLECTION.json` into Postman or use Swagger UI at http://localhost:5000/api-docs

## API Documentation

Complete OpenAPI specification available at `/api-docs` endpoint with interactive testing interface.
