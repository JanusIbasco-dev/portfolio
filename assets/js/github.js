(function () {
  const username = "JanusIbasco-dev";

  async function getJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub request failed: ${response.status}`);
    }
    return response.json();
  }

  function statCard(label, value) {
    return `<article class="stat"><small>${label}</small><strong>${value}</strong></article>`;
  }

  function repoCard(repo) {
    const tech = repo.language || "Mixed";
    const demo = repo.homepage ? `<a class="btn" href="${repo.homepage}" target="_blank" rel="noreferrer">Live Demo</a>` : "";
    return `
      <article class="repo-card reveal">
        <h4>${repo.name}</h4>
        <p>${repo.description || "No description provided."}</p>
        <div class="repo-meta">
          <span class="chip">${tech}</span>
          <span class="chip">Stars: ${repo.stargazers_count}</span>
          <span class="chip">Forks: ${repo.forks_count}</span>
        </div>
        <div class="card-links">
          <a class="btn" href="${repo.html_url}" target="_blank" rel="noreferrer">Repository</a>
          ${demo}
        </div>
      </article>
    `;
  }

  function buildHeatmap(events) {
    const grid = document.getElementById("contrib-grid");
    if (!grid) {
      return;
    }

    const map = new Map();
    const today = new Date();

    for (let i = 0; i < 140; i += 1) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().slice(0, 10), 0);
    }

    events.forEach((event) => {
      const key = new Date(event.created_at).toISOString().slice(0, 10);
      if (map.has(key)) {
        const increment = event.type === "PushEvent" ? 2 : 1;
        map.set(key, map.get(key) + increment);
      }
    });

    const values = Array.from(map.values()).reverse();
    const max = Math.max(...values, 1);

    grid.innerHTML = values
      .map((value) => {
        const normalized = Math.ceil((value / max) * 4);
        const level = value === 0 ? 0 : Math.min(Math.max(normalized, 1), 4);
        return `<span class="contrib-cell ${level ? `l${level}` : ""}" title="Activity score: ${value}"></span>`;
      })
      .join("");
  }

  async function loadGitHubData() {
    const statsNode = document.getElementById("github-stats");
    const repoNode = document.getElementById("repo-grid");
    if (!statsNode || !repoNode) {
      return;
    }

    statsNode.innerHTML = "<p>Loading GitHub profile...</p>";

    try {
      const [profile, repos, events] = await Promise.all([
        getJson(`https://api.github.com/users/${username}`),
        getJson(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        getJson(`https://api.github.com/users/${username}/events/public?per_page=100`)
      ]);

      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

      statsNode.innerHTML = [
        statCard("Public Repos", profile.public_repos),
        statCard("Followers", profile.followers),
        statCard("Total Stars", totalStars),
        statCard("Total Forks", totalForks)
      ].join("");

      const repoCards = repos
        .filter((repo) => !repo.fork)
        .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
        .slice(0, 6)
        .map(repoCard)
        .join("");

      repoNode.innerHTML = repoCards || "<p>No repositories available right now.</p>";
      buildHeatmap(events);

      if (window.observeRevealElements) {
        window.observeRevealElements();
      }
    } catch (error) {
      statsNode.innerHTML = `<p>Could not load GitHub data right now.</p>`;
      repoNode.innerHTML = "";
      buildHeatmap([]);
      console.error(error);
    }
  }

  window.loadGitHubData = loadGitHubData;
})();

