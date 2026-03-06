async function loadScores() {
  const response = await fetch("data/scores.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load score data");
  }
  return response.json();
}

function getPlayerScore(player) {
  if (typeof player.score === "number") return player.score;
  if (typeof player.Score === "number") return player.Score;
  return 0;
}

function renderTeam(team) {
  const roster = team.players || [];
  const players = roster
    .map(
      (player) =>
        `<li><span>${player.name}</span><strong>${getPlayerScore(player).toFixed(1)}</strong></li>`
    )
    .join("");
  const emptyText = roster.length === 0 ? '<p class="no-players">No players listed for this team.</p>' : "";

  return `
    <article class="team">
      <div class="team-row">
        <h3>${team.name}</h3>
        <p class="team-score">${team.score.toFixed(1)} pts</p>
      </div>
      ${emptyText}
      <ul class="players">${players}</ul>
    </article>
  `;
}

function render(data) {
  const board = document.getElementById("matches");
  const updated = document.getElementById("last-updated");

  const matches = data.matches || [];
  updated.textContent = `Last updated: ${new Date(data.updatedAt).toLocaleString()}`;

  board.innerHTML = matches
    .map((match, index) => {
      const teams = match.teams || [];
      if (teams.length !== 2) {
        return `<section class="match"><p>Match ${index + 1}: invalid match data</p></section>`;
      }

      const winner = teams[0].score === teams[1].score ? "Draw" : teams[0].score > teams[1].score ? teams[0].name : teams[1].name;

      return `
        <section class="match">
          <div class="match-head">
            <h2>Match ${index + 1}</h2>
            <p>${winner === "Draw" ? "Result: Draw" : `Winner: ${winner}`}</p>
          </div>
          <div class="match-teams">
            ${teams.map((team) => renderTeam(team)).join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

(async function init() {
  try {
    const data = await loadScores();
    render(data);
  } catch (error) {
    const board = document.getElementById("matches");
    board.innerHTML = `<p>Could not load scores. ${error.message}</p>`;
  }
})();
