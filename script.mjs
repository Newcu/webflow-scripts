import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // ✅ Works with `type: module`


function fetchNews() {
    fetch('https://webflow-scripts-production.up.railway.app/api/data')
        .then(response => response.json())
        .then(data => {
            console.log("✅ News data fetched successfully:", data);
        })
        .catch(error => console.error("❌ Error fetching data:", error));
}

// ✅ Fetch news when server starts
fetchNews();

// ✅ Refresh every 5 minutes
setInterval(fetchNews, 5 * 60 * 1000);
