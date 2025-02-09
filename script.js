function fetchNews() {
    fetch('https://webflow-scripts-production.up.railway.app/api/data')  // ✅ Fixed URL
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById("news-container");
            output.innerHTML = ""; // Clear old content

            if (Array.isArray(data)) {
                data.forEach(article => {
                    const articleBlock = document.createElement("div");
                    articleBlock.classList.add("article");

                    articleBlock.innerHTML = `
                        <h1 class="title">${article.title}</h1>
                        <p class="line">${article.content}</p>
                        <p><strong>Source:</strong> ${article.source}</p>
                        <p><strong>Date:</strong> ${new Date(article.publishDate).toLocaleString()}</p>
                        <a href="${article.link}" target="_blank">Read more</a>
                        <hr>
                    `;
                    output.appendChild(articleBlock);
                });
            } else {
                output.textContent = data.message || "Error loading news.";
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}

// ✅ Fetch news when page loads
fetchNews();

// ✅ Refresh every 60 seconds
setInterval(fetchNews, 60000);
