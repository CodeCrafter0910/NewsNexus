# NewsNexus

So basically I built this project because I wanted to make a news app that pulls articles from different places and shows them all in one spot. The idea was to make it easier to catch up on whats happening without jumping between a bunch of news sites.

It grabs news from NewsAPI and a few RSS feeds like CNN and BBC, then uses Gemini AI to write short summaries so you dont have to read the whole thing. It also figures out what topic each article is about and whether the tone is positive, negative or neutral.

## What it can do

- Pulls news from NewsAPI (multiple categories like tech, sports, business etc) and 12 RSS feeds
- Runs on a schedule so it fetches fresh news every 2 hours on its own
- Gemini AI writes a quick 2 line summary for each article
- Groups articles that are about the same story together using TF-IDF
- Has sentiment analysis so you can see if an article is positive negative or neutral
- You can filter by topic like Technology, Politics, Sports and so on
- Theres API key auth and rate limiting so its not completely open
- Swagger docs if you want to test the API
- Frontend built with React that shows everything nicely

## Tech I used

- **Backend** - Node.js with Express for the server
- **Frontend** - React with Vite for fast dev
- **AI stuff** - Google Gemini Pro API for summaries
- **NLP** - Natural library (npm package) for sentiment analysis
- **Article grouping** - did it with TF-IDF and cosine similarity

## How to get it running

First you need Node.js on your machine. Then get API keys from these places:
- NewsAPI - go to https://newsapi.org and sign up
- Gemini - go to https://makersuite.google.com/app/apikey

Then install everything:

```
cd backend
npm install

cd ../frontend
npm install
```

Make a `.env` file inside the backend folder and put this in it:

```
PORT=5001
NEWS_API_KEY=put_your_newsapi_key
GEMINI_API_KEY=put_your_gemini_key
API_SECRET_KEY=NewsNexus2024SecureKey
```

Also check `frontend/src/App.jsx` around line 10 and make sure the API key matches what you put in the env file.

To run it, open two terminals:

```
cd backend
npm start
```

```
cd frontend
npm run dev
```

Then go to http://localhost:5173 in your browser and it should be working.

## Deployment

To deploy this app to production, check out the **DEPLOYMENT_GUIDE.md** file for detailed instructions.

**Quick Fix**: If you're getting "Couldn't load the news" error on your deployed app, see **QUICK_FIX.md** for the solution.

### Key Points for Deployment:
1. Set `VITE_API_URL` in frontend environment variables to your deployed backend URL
2. Set `FRONTEND_URL` in backend environment variables to your deployed frontend URL
3. Both services need the same `API_SECRET_KEY`
4. Use production environment variables in your hosting platform

## API stuff

All the API routes need the API key in the header except health check.

| Route | Method | What it does |
|-------|--------|-------------|
| /api/digest | GET | gives you all the news |
| /api/topic/:name | GET | gives news for a specific topic |
| /api/refresh | POST | forces a fresh news fetch |
| /api/health | GET | just checks if the server is up |

Put the API key in the header like this: `x-api-key: NewsNexus2024SecureKey`

## Folder layout

```
backend/
  server.js         - main entry point, sets up express and cron
  middleware/        - has the auth check
  routes/            - the API endpoints
  services/          - the actual logic (fetching, summarizing, clustering)

frontend/
  src/
    App.jsx          - main component that ties everything together
    components/      - individual UI pieces (cards, header, filters etc)
```

## How the whole thing works

When the server starts it immediately fetches news from all the sources. After that it does it again every 2 hours automatically. For each article it calls Gemini to get a summary (if the API key works, otherwise it just grabs the first couple sentences). Then it runs sentiment analysis and figures out the topic based on keywords. Articles that are about similar things get grouped together using TF-IDF similarity scores.

The frontend just calls the backend API and displays everything. You can filter by topic or sentiment using the buttons at the top.

## Testing

I included a Postman collection file (POSTMAN_COLLECTION.json) that has all the requests ready to go. Or you can open http://localhost:5001/api-docs for the Swagger UI.

## Some things to know

- It processes around 280+ articles every time it refreshes
- There are 7 topic categories right now
- Rate limit is set to 100 requests per 15 minutes
- API keys and secrets are in the .env file which isnt committed to git
