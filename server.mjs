import express from 'express';
import { dirname, join } from "node:path";
import { fileURLToPath } from 'node:url';
import { FinlightApi } from 'finlight-client';

import cors from "cors";
app.use(cors({ origin: "*" })); // Allow all origins

const app = express();

// const port = 3000;
const port = process.env.PORT || 3000;  // Use Railway-assigned port

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new FinlightApi({ 
  apiKey: 'sk_4a3003296ec151c6e65e0a8852e9856de6f1395b20d2e8c21f5d33c3146c2efa' 
});

// Global variable to store articles
let articleData = { message: "Loading news..." };

// Fetch articles and update `articleData`
async function getArticles() {
  try {
    const response = await client.articles.getExtendedArticles({ query: 'Deepseek' });

    if (response && response.articles && response.articles.length > 0) {
      articleData = response.articles.map(article => ({
        title: article.title,
        source: article.source,
        link: article.link,
        content: article.content || "No content available",
        publishDate: article.publishDate
      }));
    } else {
      articleData = { message: "No articles found." };
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    articleData = { error: "Failed to fetch articles" };
  }
}

// Fetch articles on server startup & refresh every 5 minutes
getArticles();
setInterval(getArticles, 5 * 60 * 1000);

// API route to serve articles
app.get('/api/data', (req, res) => {
  res.json(articleData);
});

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Send `index.html` for frontend
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
