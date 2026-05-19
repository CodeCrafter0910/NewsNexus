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

The app is deployed and running live at:
- **Frontend**: https://newsnexus-mehb.onrender.com
- **Backend API**: https://newsnexus-api.onrender.com
- **API Docs**: https://newsnexus-api.onrender.com/api-docs

Both services are hosted on Render. The backend automatically fetches fresh news every 2 hours and the frontend connects to it to display everything.

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

## Testing the API

If you want to test the API, I set up Swagger documentation that makes it really easy. Just go to https://newsnexus-api.onrender.com/api-docs and youll see all the endpoints listed there.

Most of the routes need authentication to work. Heres how to test them:

1. Open the Swagger page
2. Click the green "Authorize" button at the top
3. Type in the API key: `NewsNexus2024SecureKey`
4. Hit Authorize and close the popup
5. Now you can click on any endpoint and hit "Try it out" to test it

For the topic endpoint you need to enter a topic name like `technology`, `politics`, `sports`, `business`, `health`, `science`, or `entertainment`.

The health check endpoint doesnt need any auth so you can test that one right away.

I also included a Postman collection file (POSTMAN_COLLECTION.json) if you prefer using that. Just import it into Postman and all the requests are already set up with the right headers.

## Some things to know

- It processes around 280+ articles every time it refreshes
- There are 7 topic categories right now
- Rate limit is set to 100 requests per 15 minutes
- API keys and secrets are in the .env file which isnt committed to git
