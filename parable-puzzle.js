(function () {
  const widgetId = "parable-puzzle";
  const PARABLES = [
    { title: "The Prodigal Son", fullLesson: "Demonstrates the Father's boundless mercy, eagerly running to welcome and restore the repenting sinner." },
    { title: "The Good Samaritan", fullLesson: "Teaches unconditional compassion crossing all social divides—our neighbor is anyone in need." },
    { title: "The Sower and the Soils", fullLesson: "Illustrates four heart conditions receiving the seed of God's Word: hardened, rocky, thorny, and fruitful good soil." },
    { title: "The Pearl of Great Price", fullLesson: "The supreme, unmatched value of the Kingdom of Heaven, worth surrendering all earthly treasures to obtain." },
    { title: "The Mustard Seed", fullLesson: "The Kingdom begins as the smallest seed on earth but miraculously expands to shelter the nations." }
  ];

  window.FaithGamesCore.registerGame(widgetId, {
    title: "Parables Puzzle",
    iconSvg: `<path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5z"/>`,
    mount(container, onScoreUpdate) {
      let pIdx = 0;
      let score = 0;

      const render = () => {
        if (pIdx >= PARABLES.length) {
          container.innerHTML = `
            <div style="padding:24px;text-align:center;display:flex;flex-direction:column;justify-content:center;height:100%;gap:16px;">
              <h2 style="font-size:26px;color:#DF1E5A;">Parables Understood!</h2>
              <p style="font-size:20px;">You have unpacked the mysteries of the Kingdom! Score: ${score} PTS</p>
              <button class="md3-btn md3-btn-primary" id="restartParables">Solve Again</button>
            </div>
          `;
          container.querySelector('#restartParables').onclick = () => { pIdx = 0; score = 0; onScoreUpdate(0); render(); };
          return;
        }

        const p = PARABLES[pIdx];
        container.innerHTML = `
          <div style="padding:20px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px;">
            <div class="md3-card">
              <h3 class="card-title">Parable ${pIdx + 1}: ${p.title}</h3>
              <p class="card-text">${p.fullLesson}</p>
            </div>
            <button class="md3-btn md3-btn-primary" id="matchParableBtn">Confirm Theological Meaning</button>
          </div>
        `;

        container.querySelector('#matchParableBtn').onclick = () => {
          score += 30;
          onScoreUpdate(score);
          pIdx++;
          render();
        };
      };

      render();
    },
    destroy() {}
  });
})();