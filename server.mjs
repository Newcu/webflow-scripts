import express from 'express';
import { dirname, join } from "node:path";
import { fileURLToPath } from 'node:url';
import { FinlightApi } from 'finlight-client';
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// ✅ Enable CORS to allow Webflow to fetch data
app.use(cors({ origin: "*" }));

// ✅ Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect("https://" + req.headers.host + req.url);
    }
    next();
});

const client = new FinlightApi({ 
  apiKey: 'sk_4a3003296ec151c6e65e0a8852e9856de6f1395b20d2e8c21f5d33c3146c2efa' 
});

// ✅ Ensure API Data is Available
let articleData = { message: "Loading news..." };

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

// ✅ Fetch Articles on Startup & Refresh Every 5 Minutes
getArticles();
setInterval(getArticles, 5 * 60 * 1000);

// ✅ Define API Route to Serve Articles
app.get('/api/data', (req, res) => {
  res.json(articleData);
});

// ✅ Serve Static Files
app.use(express.static(join(__dirname, 'public')));

// ✅ Catch-All Route (Prevents 404 Issues)
app.get('*', (req, res) => {
  res.send('API is running. Use /api/data to get news.');
});

// ✅ Start the Server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
