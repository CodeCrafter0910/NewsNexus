# NewsNexus API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/health`) require API key authentication via header:
```
x-api-key: your_secret_key_for_auth
```

## Endpoints

### 1. Get News Digest
Returns all clustered news articles with summaries and sentiment.

**Endpoint:** `GET /api/digest`

**Headers:**
```
x-api-key: your_secret_key_for_auth
```

**Response:** `200 OK`
```json
{
  "articles": [
    {
      "title": "Article Title",
      "description": "Article description",
      "url": "https://example.com/article",
      "source": "News Source",
      "publishedAt": "2024-01-15T10:00:00Z",
      "image": "https://example.com/image.jpg",
      "summary": "Two line summary. Second line here.",
      "sentiment": "positive"
    }
  ],
  "clusters": [
    {
      "id": 1,
      "topic": "Technology",
      "articles": [...]
    }
  ],
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### 2. Get Topic News
Returns articles filtered by specific topic.

**Endpoint:** `GET /api/topic/:name`

**Parameters:**
- `name` (path) - Topic name (e.g., technology, politics, sports)

**Headers:**
```
x-api-key: your_secret_key_for_auth
```

**Example:** `GET /api/topic/technology`

**Response:** `200 OK`
```json
{
  "topic": "technology",
  "articles": [...],
  "count": 5,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### 3. Health Check
Check API status (no authentication required).

**Endpoint:** `GET /api/health`

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "API key required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid API key"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to retrieve digest"
}
```

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Applies to all `/api/*` endpoints

## Interactive Documentation
Swagger UI available at: http://localhost:5000/api-docs

## Example Usage

### cURL
```bash
curl -H "x-api-key: your_secret_key_for_auth" http://localhost:5000/api/digest
```

### JavaScript (Axios)
```javascript
const axios = require('axios');

const response = await axios.get('http://localhost:5000/api/digest', {
  headers: { 'x-api-key': 'your_secret_key_for_auth' }
});
```

### Postman
Import the included `POSTMAN_COLLECTION.json` file for ready-to-use requests.
