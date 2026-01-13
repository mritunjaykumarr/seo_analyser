const axios = require("axios");
const cheerio = require("cheerio");

async function analyzeSEO(url) {
  const response = await axios.get(url, {
    timeout: 10000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  const html = response.data;
  const $ = cheerio.load(html);

  const title = $("title").text().trim();
  const metaDesc = $('meta[name="description"]').attr("content") || "";

  const h1Count = $("h1").length;

  let imagesWithoutAlt = 0;
  $("img").each((_, img) => {
    if (!$(img).attr("alt")) imagesWithoutAlt++;
  });

  const textContent = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = textContent ? textContent.split(" ").length : 0;

  let internalLinks = 0;
  let externalLinks = 0;

  $("a").each((_, link) => {
    const href = $(link).attr("href");
    if (!href) return;

    if (href.startsWith("/") || href.includes(new URL(url).hostname)) {
      internalLinks++;
    } else if (href.startsWith("http")) {
      externalLinks++;
    }
  });

  const https = url.startsWith("https://");

  let score = 0;
  if (title.length >= 10 && title.length <= 60) score += 10;
  if (metaDesc.length >= 50 && metaDesc.length <= 160) score += 10;
  if (h1Count === 1) score += 10;
  if (imagesWithoutAlt === 0) score += 10;
  if (wordCount > 300) score += 20;
  if (https) score += 10;
  if (internalLinks > 0) score += 10;
  if (externalLinks > 0) score += 10;

  return {
    url,
    seo: {
      title: title || "Missing",
      metaDescription: metaDesc || "Missing",
      h1Count,
      imagesWithoutAlt,
      wordCount,
      internalLinks,
      externalLinks,
      https
    },
    seoScore: score
  };
}

module.exports = analyzeSEO;
