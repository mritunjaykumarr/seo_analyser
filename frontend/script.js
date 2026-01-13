async function analyze() {
  const url = document.getElementById("urlInput").value;
  const errorBox = document.getElementById("error");
  const resultSection = document.getElementById("resultSection");
  const table = document.getElementById("reportTable");

  errorBox.textContent = "";
  table.innerHTML = "";
  resultSection.classList.add("hidden");

  if (!url) {
    errorBox.textContent = "Please enter a URL";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.reason || data.error;
      return;
    }


    resultSection.classList.remove("hidden");

 
    const score = data.seoScore;
    document.getElementById("scoreValue").textContent = score;

    const circle = document.querySelector(".progress-circle");
    const offset = 314 - (314 * score) / 100;
    circle.style.strokeDashoffset = offset;

 
    const seo = data.seo;
    const rows = {
      "Title": seo.title,
      "Meta Description": seo.metaDescription,
      "H1 Count": seo.h1Count,
      "Images without ALT": seo.imagesWithoutAlt,
      "Word Count": seo.wordCount,
      "Internal Links": seo.internalLinks,
      "External Links": seo.externalLinks,
      "HTTPS Enabled": seo.https ? "Yes" : "No"
    };

    for (const key in rows) {
      table.innerHTML += `
        <tr>
          <td>${key}</td>
          <td>${rows[key]}</td>
        </tr>
      `;
    }

  } catch (err) {
    errorBox.textContent = "Backend not reachable";
  }
}


