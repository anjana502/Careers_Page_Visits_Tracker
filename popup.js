// popup.js
function render(filter = "", sortBy = "recent") {
  chrome.storage.local.get(["visits"], ({ visits = {} }) => {
    let entries = Object.entries(visits).map(([url, data]) => ({ url, ...data }));

    if (filter) entries = entries.filter(e =>
      e.domain.includes(filter) || e.title.toLowerCase().includes(filter)
    );

    entries.sort((a, b) => {
      if (sortBy === "oldest") return a.lastVisit - b.lastVisit;
      if (sortBy === "count") return b.visitCount - a.visitCount;
      return b.lastVisit - a.lastVisit;
    });

    const list = document.getElementById("list");
    list.innerHTML = entries.map(e => {
      const ago = Math.floor((Date.now() - e.lastVisit) / 86400000);
      return `<div class="entry">
        <a href="${e.url}" target="_blank">${e.title}</a>
        <span>${ago === 0 ? "Today" : ago + "d ago"} · ${e.visitCount} visits</span>
      </div>`;
    }).join("") || "<p>No career sites tracked yet.</p>";
  });
}

document.getElementById("search").addEventListener("input", e => render(e.target.value.toLowerCase()));
document.getElementById("sort").addEventListener("change", e => render("", e.target.value));
render();
